/**
 * Tests for KV color queue seeder
 *
 * Tests the seeding of OKLCH colors to KV queue with proper state management
 */

import type { OKLCH } from '@rafters/shared';
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

interface QueueProgress {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  estimatedCompletion: string;
}

// Import functions to test
import {
  type BootstrapSeederConfig,
  generateStrategicMatrix,
  loadStandardColors,
  seedColorQueue,
} from '../seed-color-queue.js';

describe('Color Queue Seeder', () => {
  let mockKV: MockKV;

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
  });

  describe('generateStrategicMatrix', () => {
    it('should generate correct number of colors for 9L × 5C × 12H matrix', () => {
      const config = {
        lightnessSteps: 9,
        chromaSteps: 5,
        hueSteps: 12,
      };

      const colors = generateStrategicMatrix(config);

      expect(colors).toHaveLength(540); // 9 × 5 × 12 = 540
    });

    it('should generate valid OKLCH values within expected ranges', () => {
      const config = {
        lightnessSteps: 3,
        chromaSteps: 2,
        hueSteps: 4,
      };

      const colors = generateStrategicMatrix(config);

      for (const color of colors) {
        expect(color.l).toBeGreaterThanOrEqual(0.1);
        expect(color.l).toBeLessThanOrEqual(0.9);
        expect(color.c).toBeGreaterThanOrEqual(0.05);
        expect(color.c).toBeLessThanOrEqual(0.25);
        expect(color.h).toBeGreaterThanOrEqual(0);
        expect(color.h).toBeLessThan(360);
      }
    });

    it('should distribute lightness evenly across range', () => {
      const config = {
        lightnessSteps: 5, // 0.1, 0.3, 0.5, 0.7, 0.9
        chromaSteps: 1,
        hueSteps: 1,
      };

      const colors = generateStrategicMatrix(config);
      const lightnessValues = colors.map((c) => c.l);

      expect(lightnessValues).toEqual([0.1, 0.3, 0.5, 0.7, 0.9]);
    });
  });

  describe('seedColorQueue', () => {
    it('should seed strategic matrix to KV queue with correct structure', async () => {
      const config = {
        strategicMatrix: { lightnessSteps: 2, chromaSteps: 2, hueSteps: 2 },
        includeStandardColors: false,
        kvNamespace: 'TEST_KV',
      };

      await seedColorQueue(config, mockKV);

      // Should have 2×2×2 = 8 color queue items
      const queueItems = await mockKV.list({ prefix: 'color-queue:item:' });
      expect(queueItems.keys).toHaveLength(8);

      // Check structure of first item
      const firstItem = await mockKV.get(queueItems.keys[0].name);
      const parsedItem: ColorQueueItem = JSON.parse(firstItem!);

      expect(parsedItem.state).toBe('pending');
      expect(parsedItem.processingTimeout).toBe(30000);
      expect(parsedItem.retryCount).toBe(0);
      expect(parsedItem.oklch).toMatchObject({
        l: expect.any(Number),
        c: expect.any(Number),
        h: expect.any(Number),
      });
    });

    it('should create progress tracking entry', async () => {
      const config = {
        strategicMatrix: { lightnessSteps: 3, chromaSteps: 2, hueSteps: 2 },
        includeStandardColors: false,
        kvNamespace: 'TEST_KV',
      };

      await seedColorQueue(config, mockKV);

      const progressData = await mockKV.get('color-queue:progress');
      const progress: QueueProgress = JSON.parse(progressData!);

      expect(progress.total).toBe(12); // 3×2×2
      expect(progress.pending).toBe(12);
      expect(progress.processing).toBe(0);
      expect(progress.completed).toBe(0);
      expect(progress.failed).toBe(0);
    });

    it('should include standard colors when requested', async () => {
      // Mock loadStandardColors to return known set
      const mockStandardColors: OKLCH[] = [
        { l: 0.5, c: 0.1, h: 120 }, // Green
        { l: 0.4, c: 0.15, h: 240 }, // Blue
        { l: 0.6, c: 0.2, h: 0 }, // Red
      ];

      vi.mocked(loadStandardColors).mockResolvedValue(mockStandardColors);

      const config = {
        strategicMatrix: { lightnessSteps: 2, chromaSteps: 1, hueSteps: 1 },
        includeStandardColors: true,
        kvNamespace: 'TEST_KV',
      };

      await seedColorQueue(config, mockKV);

      const queueItems = await mockKV.list({ prefix: 'color-queue:item:' });
      expect(queueItems.keys).toHaveLength(5); // 2 strategic + 3 standard

      const progressData = await mockKV.get('color-queue:progress');
      const progress: QueueProgress = JSON.parse(progressData!);
      expect(progress.total).toBe(5);
    });

    it('should generate unique queue item keys', async () => {
      const config = {
        strategicMatrix: { lightnessSteps: 3, chromaSteps: 2, hueSteps: 2 },
        includeStandardColors: false,
        kvNamespace: 'TEST_KV',
      };

      await seedColorQueue(config, mockKV);

      const queueItems = await mockKV.list({ prefix: 'color-queue:item:' });
      const keyNames = queueItems.keys.map((k) => k.name);
      const uniqueKeys = new Set(keyNames);

      expect(uniqueKeys.size).toBe(keyNames.length); // All keys should be unique
    });
  });

  describe('loadStandardColors', () => {
    it('should return array of valid OKLCH colors', async () => {
      const standardColors = await loadStandardColors();

      expect(Array.isArray(standardColors)).toBe(true);
      expect(standardColors.length).toBeGreaterThan(0);

      for (const color of standardColors) {
        expect(color).toMatchObject({
          l: expect.any(Number),
          c: expect.any(Number),
          h: expect.any(Number),
        });
        expect(color.l).toBeGreaterThanOrEqual(0);
        expect(color.l).toBeLessThanOrEqual(1);
        expect(color.c).toBeGreaterThanOrEqual(0);
        expect(color.h).toBeGreaterThanOrEqual(0);
        expect(color.h).toBeLessThan(360);
      }
    });
  });

  describe('Error handling', () => {
    it('should handle KV write failures gracefully', async () => {
      const faultyKV = {
        ...mockKV,
        async put() {
          throw new Error('KV write failed');
        },
      };

      const config = {
        strategicMatrix: { lightnessSteps: 1, chromaSteps: 1, hueSteps: 1 },
        includeStandardColors: false,
        kvNamespace: 'TEST_KV',
      };

      await expect(seedColorQueue(config, faultyKV)).rejects.toThrow('KV write failed');
    });

    it('should validate configuration parameters', async () => {
      const invalidConfig = {
        strategicMatrix: { lightnessSteps: 0, chromaSteps: 5, hueSteps: 12 },
        includeStandardColors: false,
        kvNamespace: 'TEST_KV',
      };

      await expect(seedColorQueue(invalidConfig, mockKV)).rejects.toThrow();
    });
  });
});
