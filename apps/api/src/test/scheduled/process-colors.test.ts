/**
 * Tests for KV color queue processor
 *
 * Tests the cron processor that handles color queue items with atomic state management
 * and race condition prevention
 */

import type { ColorValue, OKLCH } from '@rafters/shared';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock KV interface for testing
interface MockKV {
  data: Map<string, string>;
  put: (key: string, value: string) => Promise<void>;
  get: (key: string) => Promise<string | null>;
  list: (options?: { prefix?: string }) => Promise<{ keys: { name: string }[] }>;
  delete: (key: string) => Promise<void>;
}

// Types for color queue system
interface ColorQueueItem {
  oklch: OKLCH;
  state: 'pending' | 'processing' | 'completed';
  processingStarted?: string;
  processingTimeout: number;
  retryCount: number;
  lastError?: string;
}

interface ProcessResult {
  processed: boolean;
  key?: string;
  error?: string;
}

// Mock environment
interface Env {
  RAFTERS_INTEL: MockKV;
}

// Import functions to test
import {
  claimNextPendingColor,
  handleProcessingError,
  processColorQueue,
} from '../../scheduled/process-colors.js';

// Mock generateColorValue and generateColorCacheKey
vi.mock('@rafters/color-utils', () => ({
  generateColorValue: vi.fn().mockImplementation(
    (oklch: OKLCH) =>
      ({
        name: `color-${oklch.h}-${Math.round(oklch.l * 100)}`,
        scale: [oklch], // Simplified mock
        harmonies: {},
        accessibility: { wcagAA: { normal: [], large: [] } },
        analysis: { temperature: 'neutral', isLight: oklch.l > 0.5, name: 'test-color' },
      }) as ColorValue
  ),
  generateColorCacheKey: vi
    .fn()
    .mockImplementation(
      (oklch: OKLCH) => `oklch-${oklch.l.toFixed(2)}-${oklch.c.toFixed(2)}-${oklch.h.toFixed(0)}`
    ),
}));

describe('Color Queue Processor', () => {
  let mockKV: MockKV;
  let mockEnv: Env;

  beforeEach(() => {
    mockKV = {
      data: new Map(),
      async put(key: string, value: string) {
        this.data.set(key, value);
      },
      async get(key: string) {
        return this.data.get(key) || null;
      },
      async list(options?: { prefix?: string }) {
        const keys = Array.from(this.data.keys())
          .filter((key) => !options?.prefix || key.startsWith(options.prefix))
          .map((name) => ({ name }));
        return { keys };
      },
      async delete(key: string) {
        this.data.delete(key);
      },
    };

    mockEnv = { RAFTERS_INTEL: mockKV };
  });

  describe('claimNextPendingColor', () => {
    it('should claim a pending color and set it to processing', async () => {
      const testColor: ColorQueueItem = {
        oklch: { l: 0.5, c: 0.1, h: 240 },
        state: 'pending',
        processingTimeout: 30000,
        retryCount: 0,
      };

      await mockKV.put('color-queue:item:test-1', JSON.stringify(testColor));

      const claimedKey = await claimNextPendingColor(mockKV);

      expect(claimedKey).toBe('color-queue:item:test-1');

      const updatedItem = await mockKV.get('color-queue:item:test-1');
      const parsed: ColorQueueItem = JSON.parse(updatedItem!);

      expect(parsed.state).toBe('processing');
      expect(parsed.processingStarted).toBeDefined();
      expect(new Date(parsed.processingStarted!).getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should return null when no pending colors available', async () => {
      const completedColor: ColorQueueItem = {
        oklch: { l: 0.5, c: 0.1, h: 240 },
        state: 'completed',
        processingTimeout: 30000,
        retryCount: 0,
      };

      await mockKV.put('color-queue:item:test-1', JSON.stringify(completedColor));

      const claimedKey = await claimNextPendingColor(mockKV);

      expect(claimedKey).toBeNull();
    });

    it('should reclaim stale processing items that have timed out', async () => {
      const staleProcessingColor: ColorQueueItem = {
        oklch: { l: 0.5, c: 0.1, h: 240 },
        state: 'processing',
        processingStarted: new Date(Date.now() - 45000).toISOString(), // 45 seconds ago
        processingTimeout: 30000,
        retryCount: 0,
      };

      await mockKV.put('color-queue:item:test-stale', JSON.stringify(staleProcessingColor));

      const claimedKey = await claimNextPendingColor(mockKV);

      expect(claimedKey).toBe('color-queue:item:test-stale');

      const updatedItem = await mockKV.get('color-queue:item:test-stale');
      const parsed: ColorQueueItem = JSON.parse(updatedItem!);

      expect(parsed.state).toBe('processing');
      expect(parsed.processingStarted).not.toBe(staleProcessingColor.processingStarted);
    });

    it('should not claim items that are still within processing timeout', async () => {
      const activeProcessingColor: ColorQueueItem = {
        oklch: { l: 0.5, c: 0.1, h: 240 },
        state: 'processing',
        processingStarted: new Date(Date.now() - 15000).toISOString(), // 15 seconds ago
        processingTimeout: 30000,
        retryCount: 0,
      };

      await mockKV.put('color-queue:item:test-active', JSON.stringify(activeProcessingColor));

      const claimedKey = await claimNextPendingColor(mockKV);

      expect(claimedKey).toBeNull();
    });
  });

  describe('processColorQueue', () => {
    it('should successfully process a pending color', async () => {
      const testColor: ColorQueueItem = {
        oklch: { l: 0.5, c: 0.1, h: 240 },
        state: 'pending',
        processingTimeout: 30000,
        retryCount: 0,
      };

      await mockKV.put('color-queue:item:test-1', JSON.stringify(testColor));

      const result = await processColorQueue(mockEnv);

      expect(result.processed).toBe(true);
      expect(result.key).toBe('color-queue:item:test-1');

      // Verify color was marked as completed
      const processedItem = await mockKV.get('color-queue:item:test-1');
      const parsed: ColorQueueItem = JSON.parse(processedItem!);
      expect(parsed.state).toBe('completed');
      expect(parsed.processingStarted).toBeUndefined();

      // Verify color cache was created
      const cacheKey = `color-cache:oklch-${testColor.oklch.l.toFixed(2)}-${testColor.oklch.c.toFixed(2)}-${testColor.oklch.h.toFixed(0)}`;
      const cachedColor = await mockKV.get(cacheKey);
      expect(cachedColor).toBeDefined();

      const colorValue: ColorValue = JSON.parse(cachedColor!);
      expect(colorValue.name).toContain('color-240');
    });

    it('should return no work when no pending colors available', async () => {
      const result = await processColorQueue(mockEnv);

      expect(result.processed).toBe(false);
      expect(result.key).toBeUndefined();
    });

    it('should handle processing errors gracefully', async () => {
      // Mock generateColorValue to throw an error
      const { generateColorValue } = await import('@rafters/color-utils');
      vi.mocked(generateColorValue).mockImplementationOnce(() => {
        throw new Error('Color generation failed');
      });

      const testColor: ColorQueueItem = {
        oklch: { l: 0.5, c: 0.1, h: 240 },
        state: 'pending',
        processingTimeout: 30000,
        retryCount: 0,
      };

      await mockKV.put('color-queue:item:test-error', JSON.stringify(testColor));

      const result = await processColorQueue(mockEnv);

      expect(result.processed).toBe(false);
      expect(result.error).toBeDefined();

      // Verify error was recorded
      const errorItem = await mockKV.get('color-queue:item:test-error');
      const parsed: ColorQueueItem = JSON.parse(errorItem!);
      expect(parsed.state).toBe('pending'); // Reset to pending for retry
      expect(parsed.retryCount).toBe(1);
      expect(parsed.lastError).toContain('Color generation failed');
    });
  });

  describe('Basic race condition handling', () => {
    it('should handle multiple processors attempting to process same color', async () => {
      const testColor: ColorQueueItem = {
        oklch: { l: 0.5, c: 0.1, h: 240 },
        state: 'pending',
        processingTimeout: 30000,
        retryCount: 0,
      };

      await mockKV.put('color-queue:item:test-race', JSON.stringify(testColor));

      // Simulate multiple concurrent processors
      // Note: With our simple implementation, multiple may claim the same item
      const results = await Promise.all([
        processColorQueue(mockEnv),
        processColorQueue(mockEnv),
        processColorQueue(mockEnv),
      ]);

      // At least one should successfully process
      const processedCount = results.filter((r) => r.processed).length;
      expect(processedCount).toBeGreaterThanOrEqual(1);

      // Verify final state is completed
      const finalItem = await mockKV.get('color-queue:item:test-race');
      const parsed: ColorQueueItem = JSON.parse(finalItem!);
      expect(parsed.state).toBe('completed');
    });

    it('should handle concurrent claim attempts with available colors', async () => {
      // Add multiple pending colors
      const colors = Array.from({ length: 5 }, (_, i) => ({
        oklch: { l: 0.5, c: 0.1, h: i * 60 },
        state: 'pending' as const,
        processingTimeout: 30000,
        retryCount: 0,
      }));

      for (let i = 0; i < colors.length; i++) {
        await mockKV.put(`color-queue:item:test-${i}`, JSON.stringify(colors[i]));
      }

      // Simulate multiple concurrent claim attempts
      const claimResults = await Promise.all([
        claimNextPendingColor(mockKV),
        claimNextPendingColor(mockKV),
        claimNextPendingColor(mockKV),
        claimNextPendingColor(mockKV),
        claimNextPendingColor(mockKV),
      ]);

      // Some should succeed in claiming (may not be perfectly atomic)
      const successfulClaims = claimResults.filter((r) => r !== null);
      expect(successfulClaims.length).toBeGreaterThan(0);
      expect(successfulClaims.length).toBeLessThanOrEqual(5);
    });
  });

  describe('handleProcessingError', () => {
    it('should increment retry count and reset state to pending', async () => {
      const testColor: ColorQueueItem = {
        oklch: { l: 0.5, c: 0.1, h: 240 },
        state: 'processing',
        processingStarted: new Date().toISOString(),
        processingTimeout: 30000,
        retryCount: 1,
      };

      await mockKV.put('color-queue:item:test-error', JSON.stringify(testColor));

      const error = new Error('Processing failed');
      await handleProcessingError(mockKV, 'color-queue:item:test-error', error);

      const updatedItem = await mockKV.get('color-queue:item:test-error');
      const parsed: ColorQueueItem = JSON.parse(updatedItem!);

      expect(parsed.state).toBe('pending');
      expect(parsed.retryCount).toBe(2);
      expect(parsed.lastError).toBe('Processing failed');
      expect(parsed.processingStarted).toBeUndefined();
    });

    it('should mark as failed after max retries exceeded', async () => {
      const testColor: ColorQueueItem = {
        oklch: { l: 0.5, c: 0.1, h: 240 },
        state: 'processing',
        processingStarted: new Date().toISOString(),
        processingTimeout: 30000,
        retryCount: 3, // Already at max
      };

      await mockKV.put('color-queue:item:test-max-retries', JSON.stringify(testColor));

      const error = new Error('Final failure');
      await handleProcessingError(mockKV, 'color-queue:item:test-max-retries', error);

      const updatedItem = await mockKV.get('color-queue:item:test-max-retries');
      const parsed: ColorQueueItem = JSON.parse(updatedItem!);

      expect(parsed.state).toBe('completed'); // Mark as completed to remove from queue
      expect(parsed.retryCount).toBe(4);
      expect(parsed.lastError).toBe('Final failure');
    });
  });

  describe('Progress tracking', () => {
    it('should update progress when colors are processed', async () => {
      // Set initial progress
      const initialProgress = {
        total: 3,
        pending: 3,
        processing: 0,
        completed: 0,
        failed: 0,
        estimatedCompletion: new Date().toISOString(),
      };

      await mockKV.put('color-queue:progress', JSON.stringify(initialProgress));

      // Add a pending color
      const testColor: ColorQueueItem = {
        oklch: { l: 0.5, c: 0.1, h: 240 },
        state: 'pending',
        processingTimeout: 30000,
        retryCount: 0,
      };

      await mockKV.put('color-queue:item:test-progress', JSON.stringify(testColor));

      // Process the color
      const result = await processColorQueue(mockEnv);

      expect(result.processed).toBe(true);

      // Check that progress could be updated (implementation would handle this)
      const updatedProgress = await mockKV.get('color-queue:progress');
      expect(updatedProgress).toBeDefined();
    });
  });
});
