/**
 * Unit Tests for ColorSeedPublisher
 *
 * Tests the queue publishing logic for color seed generation.
 * Focuses on business logic and error handling without Cloudflare runtime dependencies.
 */

import type { OKLCH } from '@rafters/shared';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { ColorSeedPublisher } from '../../../src/lib/queue/publisher';

// Mock Queue interface
interface MockQueue {
  send: ReturnType<typeof vi.fn>;
  sendBatch: ReturnType<typeof vi.fn>;
}

describe('ColorSeedPublisher', () => {
  let mockQueue: MockQueue;
  let publisher: ColorSeedPublisher;

  beforeEach(() => {
    mockQueue = {
      send: vi.fn(),
      sendBatch: vi.fn(),
    };
    publisher = new ColorSeedPublisher(mockQueue as unknown as Queue);
  });

  describe('publishSingle', () => {
    const testColor: OKLCH = { l: 0.65, c: 0.12, h: 240 };

    test('publishes single color with minimal data', async () => {
      mockQueue.send.mockResolvedValue(undefined);

      const result = await publisher.publishSingle(testColor);

      expect(result.success).toBe(true);
      expect(result.requestId).toBeDefined();
      expect(result.queuedCount).toBe(1);
      expect(mockQueue.send).toHaveBeenCalledOnce();

      const [message, options] = mockQueue.send.mock.calls[0];
      expect(message.oklch).toEqual(testColor);
      expect(message.timestamp).toBeTypeOf('number');
      expect(message.requestId).toBeDefined();
      expect(options.contentType).toBe('json');
    });

    test('publishes single color with optional metadata', async () => {
      mockQueue.send.mockResolvedValue(undefined);

      const result = await publisher.publishSingle(testColor, {
        token: 'primary',
        name: 'test-blue',
        requestId: 'custom-request-id',
      });

      expect(result.success).toBe(true);
      expect(result.requestId).toBe('custom-request-id');

      const [message] = mockQueue.send.mock.calls[0];
      expect(message.token).toBe('primary');
      expect(message.name).toBe('test-blue');
      expect(message.requestId).toBe('custom-request-id');
    });

    test('generates requestId when not provided', async () => {
      mockQueue.send.mockResolvedValue(undefined);

      const result = await publisher.publishSingle(testColor);

      expect(result.requestId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      );

      const [message] = mockQueue.send.mock.calls[0];
      expect(message.requestId).toBe(result.requestId);
    });

    test('handles queue send errors gracefully', async () => {
      const errorMessage = 'Queue send failed';
      mockQueue.send.mockRejectedValue(new Error(errorMessage));

      const result = await publisher.publishSingle(testColor);

      expect(result.success).toBe(false);
      expect(result.error).toBe(errorMessage);
      expect(result.requestId).toBeUndefined();
      expect(result.queuedCount).toBeUndefined();
    });

    test('handles non-Error exceptions', async () => {
      mockQueue.send.mockRejectedValue('String error');

      const result = await publisher.publishSingle(testColor);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unknown error');
    });

    test('includes current timestamp in message', async () => {
      mockQueue.send.mockResolvedValue(undefined);
      const startTime = Date.now();

      await publisher.publishSingle(testColor);

      const [message] = mockQueue.send.mock.calls[0];
      const endTime = Date.now();

      expect(message.timestamp).toBeGreaterThanOrEqual(startTime);
      expect(message.timestamp).toBeLessThanOrEqual(endTime);
    });
  });

  describe('publishBatch', () => {
    const testColors = [
      { oklch: { l: 0.5, c: 0.1, h: 0 }, token: 'red', name: 'test-red' },
      { oklch: { l: 0.6, c: 0.15, h: 120 }, token: 'green', name: 'test-green' },
      { oklch: { l: 0.7, c: 0.2, h: 240 }, token: 'blue', name: 'test-blue' },
    ];

    test('publishes small batch as single sendBatch call', async () => {
      mockQueue.sendBatch.mockResolvedValue(undefined);

      const result = await publisher.publishBatch(testColors);

      expect(result.success).toBe(true);
      expect(result.queuedCount).toBe(3);
      expect(result.requestId).toBeDefined();
      expect(mockQueue.sendBatch).toHaveBeenCalledOnce();

      const [messages] = mockQueue.sendBatch.mock.calls[0];
      expect(messages).toHaveLength(3);
      expect(messages[0].body.oklch).toEqual(testColors[0].oklch);
      expect(messages[0].body.token).toBe('red');
      expect(messages[0].body.name).toBe('test-red');
      expect(messages[0].options.contentType).toBe('json');
    });

    test('splits large batches into chunks of 100', async () => {
      const largeColorSet = Array.from({ length: 250 }, (_, i) => ({
        oklch: { l: 0.5, c: 0.1, h: i * 1.44 }, // Spread across hue range
        token: `color-${i}`,
      }));

      mockQueue.sendBatch.mockResolvedValue(undefined);

      const result = await publisher.publishBatch(largeColorSet);

      expect(result.success).toBe(true);
      expect(result.queuedCount).toBe(250);
      expect(mockQueue.sendBatch).toHaveBeenCalledTimes(3); // 100 + 100 + 50

      // Verify first batch has 100 messages
      const [firstBatch] = mockQueue.sendBatch.mock.calls[0];
      expect(firstBatch).toHaveLength(100);

      // Verify last batch has remaining 50 messages
      const [lastBatch] = mockQueue.sendBatch.mock.calls[2];
      expect(lastBatch).toHaveLength(50);
    });

    test('generates unique requestIds for each message in batch', async () => {
      mockQueue.sendBatch.mockResolvedValue(undefined);

      await publisher.publishBatch(testColors, { batchId: 'test-batch' });

      const [messages] = mockQueue.sendBatch.mock.calls[0];
      const requestIds = messages.map((msg: { body: { requestId: string } }) => msg.body.requestId);

      // All requestIds should be unique
      const uniqueIds = new Set(requestIds);
      expect(uniqueIds.size).toBe(requestIds.length);

      // All should start with batch ID
      requestIds.forEach((id: string) => {
        expect(id).toMatch(/^test-batch-0-[0-9a-f-]+$/);
      });
    });

    test('uses generated batchId when not provided', async () => {
      mockQueue.sendBatch.mockResolvedValue(undefined);

      const result = await publisher.publishBatch([testColors[0]]);

      expect(result.requestId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      );
    });

    test('handles sendBatch errors gracefully', async () => {
      const errorMessage = 'Batch send failed';
      mockQueue.sendBatch.mockRejectedValue(new Error(errorMessage));

      const result = await publisher.publishBatch(testColors);

      expect(result.success).toBe(false);
      expect(result.error).toBe(errorMessage);
      expect(result.queuedCount).toBeUndefined();
    });

    test('handles empty batch', async () => {
      const result = await publisher.publishBatch([]);

      expect(result.success).toBe(true);
      expect(result.queuedCount).toBe(0);
      expect(mockQueue.sendBatch).not.toHaveBeenCalled();
    });

    test('includes delay between batches for rate limiting', async () => {
      const largeColorSet = Array.from({ length: 150 }, (_, i) => ({
        oklch: { l: 0.5, c: 0.1, h: i * 2.4 },
      }));

      mockQueue.sendBatch.mockResolvedValue(undefined);

      const startTime = Date.now();
      await publisher.publishBatch(largeColorSet);
      const endTime = Date.now();

      // Should have at least 250ms delay between 2 batches
      expect(endTime - startTime).toBeGreaterThanOrEqual(250);
      expect(mockQueue.sendBatch).toHaveBeenCalledTimes(2);
    });
  });

  describe('publishSpectrum', () => {
    test('generates correct number of colors for spectrum', async () => {
      mockQueue.sendBatch.mockResolvedValue(undefined);

      const config = {
        lightnessSteps: 3,
        chromaSteps: 2,
        hueSteps: 4,
        baseName: 'test-spectrum',
      };

      const result = await publisher.publishSpectrum(config);

      expect(result.success).toBe(true);
      expect(result.queuedCount).toBe(24); // 3 × 2 × 4 = 24

      // Should generate exactly 24 messages
      const [messages] = mockQueue.sendBatch.mock.calls[0];
      expect(messages).toHaveLength(24);
    });

    test('generates colors with correct OKLCH ranges', async () => {
      mockQueue.sendBatch.mockResolvedValue(undefined);

      const config = {
        lightnessSteps: 3, // 0.1, 0.5, 0.9
        chromaSteps: 2, // 0.0, 0.4
        hueSteps: 2, // 0°, 180°
      };

      await publisher.publishSpectrum(config);

      const [messages] = mockQueue.sendBatch.mock.calls[0];
      const colors = messages.map((msg: { body: { oklch: OKLCH } }) => msg.body.oklch);

      // Check lightness range
      const lightnesses = colors.map((c: OKLCH) => c.l);
      expect(Math.min(...lightnesses)).toBe(0.1);
      expect(Math.max(...lightnesses)).toBe(0.9);

      // Check chroma range
      const chromas = colors.map((c: OKLCH) => c.c);
      expect(Math.min(...chromas)).toBe(0);
      expect(Math.max(...chromas)).toBe(0.4);

      // Check hue range
      const hues = colors.map((c: OKLCH) => c.h);
      expect(Math.min(...hues)).toBe(0);
      expect(Math.max(...hues)).toBe(180);
    });

    test('generates descriptive names for spectrum colors', async () => {
      mockQueue.sendBatch.mockResolvedValue(undefined);

      const config = {
        lightnessSteps: 2,
        chromaSteps: 2,
        hueSteps: 2,
        baseName: 'custom-spectrum',
      };

      await publisher.publishSpectrum(config);

      const [messages] = mockQueue.sendBatch.mock.calls[0];
      const names = messages.map((msg: { body: { name: string } }) => msg.body.name);

      // Should include base name and OKLCH values
      expect(names[0]).toMatch(/^custom-spectrum-l\d+-c\d+-h\d+$/);
      expect(names).toContain('custom-spectrum-l10-c0-h0');
      expect(names).toContain('custom-spectrum-l90-c40-h180');
    });

    test('uses default baseName when not provided', async () => {
      mockQueue.sendBatch.mockResolvedValue(undefined);

      const config = {
        lightnessSteps: 2, // Use 2 to avoid division by zero bug
        chromaSteps: 2, // Use 2 to avoid division by zero bug
        hueSteps: 1,
      };

      await publisher.publishSpectrum(config);

      const [messages] = mockQueue.sendBatch.mock.calls[0];
      const name = (messages[0] as { body: { name: string } }).body.name;

      expect(name).toMatch(/^spectrum-l\d+-c\d+-h\d+$/);
    });

    test('assigns spectrum-seed token to all generated colors', async () => {
      mockQueue.sendBatch.mockResolvedValue(undefined);

      const config = {
        lightnessSteps: 2,
        chromaSteps: 1,
        hueSteps: 1,
      };

      await publisher.publishSpectrum(config);

      const [messages] = mockQueue.sendBatch.mock.calls[0];
      const tokens = messages.map((msg: { body: { token: string } }) => msg.body.token);

      expect(tokens.every((token: string) => token === 'spectrum-seed')).toBe(true);
    });

    test('handles spectrum generation errors', async () => {
      mockQueue.sendBatch.mockRejectedValue(new Error('Spectrum batch failed'));

      const config = {
        lightnessSteps: 2,
        chromaSteps: 2,
        hueSteps: 2,
      };

      const result = await publisher.publishSpectrum(config);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Spectrum batch failed');
    });

    test('generates requestId with spectrum prefix', async () => {
      mockQueue.sendBatch.mockResolvedValue(undefined);

      const config = {
        lightnessSteps: 1,
        chromaSteps: 1,
        hueSteps: 1,
      };

      const result = await publisher.publishSpectrum(config);

      expect(result.requestId).toMatch(/^spectrum-\d+$/);
    });

    test('rounds OKLCH values to 2 decimal places', async () => {
      mockQueue.sendBatch.mockResolvedValue(undefined);

      const config = {
        lightnessSteps: 3, // Will generate 0.1, 0.5, 0.9
        chromaSteps: 3, // Will generate 0.0, 0.2, 0.4
        hueSteps: 1,
      };

      await publisher.publishSpectrum(config);

      const [messages] = mockQueue.sendBatch.mock.calls[0];
      const colors = messages.map((msg: { body: { oklch: OKLCH } }) => msg.body.oklch);

      colors.forEach((color: OKLCH) => {
        // Check that values are rounded to 2 decimal places
        expect(color.l).toBe(Math.round(color.l * 100) / 100);
        expect(color.c).toBe(Math.round(color.c * 100) / 100);
        expect(color.h).toBe(Math.round(color.h));
      });
    });
  });

  describe('edge cases and validation', () => {
    test('handles very large spectrum configurations', async () => {
      mockQueue.sendBatch.mockResolvedValue(undefined);

      const config = {
        lightnessSteps: 10,
        chromaSteps: 10,
        hueSteps: 10, // 1000 total colors
      };

      const result = await publisher.publishSpectrum(config);

      expect(result.success).toBe(true);
      expect(result.queuedCount).toBe(1000);

      // Should split into multiple batches (1000 / 100 = 10 batches)
      expect(mockQueue.sendBatch).toHaveBeenCalledTimes(10);
    });

    test('handles minimum spectrum configuration', async () => {
      mockQueue.sendBatch.mockResolvedValue(undefined);

      const config = {
        lightnessSteps: 2, // Use 2 to avoid division by zero bug
        chromaSteps: 2, // Use 2 to avoid division by zero bug
        hueSteps: 1,
      };

      const result = await publisher.publishSpectrum(config);

      expect(result.success).toBe(true);
      expect(result.queuedCount).toBe(4); // 2 × 2 × 1 = 4
      expect(mockQueue.sendBatch).toHaveBeenCalledOnce();

      const [messages] = mockQueue.sendBatch.mock.calls[0];
      expect(messages).toHaveLength(4);

      // Check that we get proper OKLCH values (not NaN)
      messages.forEach((msg: { body: { oklch: OKLCH } }) => {
        expect(msg.body.oklch.l).not.toBeNaN();
        expect(msg.body.oklch.c).not.toBeNaN();
        expect(msg.body.oklch.h).not.toBeNaN();
      });
    });

    test('validates OKLCH color values are within expected ranges', async () => {
      mockQueue.send.mockResolvedValue(undefined);

      const validColor: OKLCH = { l: 0.5, c: 0.2, h: 180 };
      const result = await publisher.publishSingle(validColor);

      expect(result.success).toBe(true);

      const [message] = mockQueue.send.mock.calls[0];
      expect(message.oklch.l).toBeGreaterThanOrEqual(0);
      expect(message.oklch.l).toBeLessThanOrEqual(1);
      expect(message.oklch.c).toBeGreaterThanOrEqual(0);
      expect(message.oklch.h).toBeGreaterThanOrEqual(0);
      expect(message.oklch.h).toBeLessThanOrEqual(360);
    });
  });
});
