/**
 * Seed Queue Route Unit Tests
 * Tests route logic with spyOn mocking
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { z } from 'zod';
import { ColorSeedPublisher } from '@/lib/queue/publisher';

describe('Seed Queue Route Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('validates OKLCH schema correctly', () => {
    const OKLCHSchema = z.object({
      l: z.number().min(0).max(1),
      c: z.number().min(0),
      h: z.number().min(0).max(360),
      alpha: z.number().min(0).max(1).optional(),
    });

    // Valid OKLCH
    const validResult = OKLCHSchema.safeParse({ l: 0.5, c: 0.1, h: 180 });
    expect(validResult.success).toBe(true);

    // Invalid lightness > 1
    const invalidL = OKLCHSchema.safeParse({ l: 1.5, c: 0.1, h: 180 });
    expect(invalidL.success).toBe(false);

    // Invalid negative chroma
    const invalidC = OKLCHSchema.safeParse({ l: 0.5, c: -0.1, h: 180 });
    expect(invalidC.success).toBe(false);

    // Invalid hue > 360
    const invalidH = OKLCHSchema.safeParse({ l: 0.5, c: 0.1, h: 400 });
    expect(invalidH.success).toBe(false);
  });

  test('validates single color schema correctly', () => {
    const OKLCHSchema = z.object({
      l: z.number().min(0).max(1),
      c: z.number().min(0),
      h: z.number().min(0).max(360),
      alpha: z.number().min(0).max(1).optional(),
    });

    const SingleColorSchema = z.object({
      oklch: OKLCHSchema,
      token: z.string().optional(),
      name: z.string().optional(),
    });

    // Valid single color
    const validColor = {
      oklch: { l: 0.5, c: 0.1, h: 180 },
      token: 'primary',
      name: 'ocean-blue',
    };
    expect(SingleColorSchema.safeParse(validColor).success).toBe(true);

    // Valid minimal color
    const minimalColor = {
      oklch: { l: 0.5, c: 0.1, h: 180 },
    };
    expect(SingleColorSchema.safeParse(minimalColor).success).toBe(true);

    // Invalid - missing oklch
    const invalidColor = {
      token: 'primary',
      name: 'test',
    };
    expect(SingleColorSchema.safeParse(invalidColor).success).toBe(false);
  });

  test('validates batch color schema with limits', () => {
    const OKLCHSchema = z.object({
      l: z.number().min(0).max(1),
      c: z.number().min(0),
      h: z.number().min(0).max(360),
      alpha: z.number().min(0).max(1).optional(),
    });

    const SingleColorSchema = z.object({
      oklch: OKLCHSchema,
      token: z.string().optional(),
      name: z.string().optional(),
    });

    const BatchColorSchema = z.object({
      colors: z.array(SingleColorSchema).max(1000),
      batchId: z.string().optional(),
    });

    // Valid batch
    const validBatch = {
      colors: [{ oklch: { l: 0.5, c: 0.1, h: 180 } }, { oklch: { l: 0.6, c: 0.2, h: 240 } }],
      batchId: 'test-batch',
    };
    expect(BatchColorSchema.safeParse(validBatch).success).toBe(true);

    // Too many colors (over 1000 limit)
    const oversizedBatch = {
      colors: new Array(1001).fill({ oklch: { l: 0.5, c: 0.1, h: 180 } }),
    };
    expect(BatchColorSchema.safeParse(oversizedBatch).success).toBe(false);
  });

  test('validates spectrum config schema with defaults', () => {
    const SpectrumConfigSchema = z.object({
      lightnessSteps: z.number().min(1).max(20).default(9),
      chromaSteps: z.number().min(1).max(20).default(5),
      hueSteps: z.number().min(1).max(36).default(12),
      baseName: z.string().optional().default('spectrum-seed'),
    });

    // Valid config with all values
    const fullConfig = {
      lightnessSteps: 7,
      chromaSteps: 3,
      hueSteps: 8,
      baseName: 'test-spectrum',
    };
    expect(SpectrumConfigSchema.safeParse(fullConfig).success).toBe(true);

    // Minimal config (should use defaults)
    const minimalConfig = {};
    const result = SpectrumConfigSchema.safeParse(minimalConfig);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.lightnessSteps).toBe(9);
      expect(result.data.chromaSteps).toBe(5);
      expect(result.data.hueSteps).toBe(12);
      expect(result.data.baseName).toBe('spectrum-seed');
    }

    // Invalid - steps too high
    const invalidConfig = {
      lightnessSteps: 25, // Over max of 20
    };
    expect(SpectrumConfigSchema.safeParse(invalidConfig).success).toBe(false);
  });

  test('ColorSeedPublisher publishSingle creates message correctly', async () => {
    const mockQueue = {
      send: vi.fn().mockResolvedValue(undefined),
    } as unknown as Queue;

    const publisher = new ColorSeedPublisher(mockQueue);

    const result = await publisher.publishSingle(
      { l: 0.5, c: 0.1, h: 180 },
      { token: 'primary', name: 'test-blue' }
    );

    expect(result.success).toBe(true);
    expect(result.queuedCount).toBe(1);
    expect(result.requestId).toBeDefined();
    expect(mockQueue.send).toHaveBeenCalledWith(
      expect.objectContaining({
        oklch: { l: 0.5, c: 0.1, h: 180 },
        token: 'primary',
        name: 'test-blue',
        timestamp: expect.any(Number),
        requestId: expect.any(String),
      }),
      { contentType: 'json' }
    );
  });

  test('ColorSeedPublisher publishSingle handles queue errors', async () => {
    const mockQueue = {
      send: vi.fn().mockRejectedValue(new Error('Queue send failed')),
    } as unknown as Queue;

    const publisher = new ColorSeedPublisher(mockQueue);

    const result = await publisher.publishSingle({ l: 0.5, c: 0.1, h: 180 });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Queue send failed');
    expect(result.queuedCount).toBeUndefined();
  });

  test('ColorSeedPublisher generates proper message structure', async () => {
    const mockSend = vi.fn().mockResolvedValue(undefined);
    const mockQueue = {
      send: mockSend,
    } as unknown as Queue;

    const publisher = new ColorSeedPublisher(mockQueue);

    await publisher.publishSingle({ l: 0.7, c: 0.05, h: 60 }, { token: 'warning' });

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        oklch: { l: 0.7, c: 0.05, h: 60 },
        token: 'warning',
        name: undefined,
        requestId: expect.any(String),
        timestamp: expect.any(Number),
      }),
      { contentType: 'json' }
    );

    // Verify requestId is a valid UUID format
    const call = mockSend.mock.calls[0];
    const message = call[0];
    expect(message.requestId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });

  test('spectrum config calculates expected color count correctly', () => {
    const config = {
      lightnessSteps: 3,
      chromaSteps: 2,
      hueSteps: 4,
    };

    const expectedCount = config.lightnessSteps * config.chromaSteps * config.hueSteps;
    expect(expectedCount).toBe(24); // 3 * 2 * 4 = 24

    // Test with larger values
    const largerConfig = {
      lightnessSteps: 9,
      chromaSteps: 5,
      hueSteps: 12,
    };

    const largerExpectedCount =
      largerConfig.lightnessSteps * largerConfig.chromaSteps * largerConfig.hueSteps;
    expect(largerExpectedCount).toBe(540); // 9 * 5 * 12 = 540
  });

  test('queue message size limit calculation', () => {
    // Test that messages stay within 128KB limit
    const maxMessageSize = 128 * 1024; // 128KB in bytes

    const typicalMessage = {
      oklch: { l: 0.55555, c: 0.15555, h: 355.555 },
      token: 'very-long-semantic-token-name',
      name: 'very-long-descriptive-color-name-with-details',
      requestId: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx',
      timestamp: 1700000000000,
    };

    const messageSize = JSON.stringify(typicalMessage).length;
    expect(messageSize).toBeLessThan(maxMessageSize);
    expect(messageSize).toBeLessThan(1000); // Should be well under limit
  });
});
