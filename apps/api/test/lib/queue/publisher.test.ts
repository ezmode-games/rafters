/**
 * ColorSeedPublisher Unit Tests
 * Tests queue publisher logic with spyOn mocking
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { ColorSeedPublisher } from '@/lib/queue/publisher';

describe('ColorSeedPublisher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('publishSingle creates message with all required fields', async () => {
    const mockSend = vi.fn().mockResolvedValue(undefined);
    const mockQueue = { send: mockSend } as unknown as Queue;
    const publisher = new ColorSeedPublisher(mockQueue);

    const result = await publisher.publishSingle(
      { l: 0.5, c: 0.1, h: 180 },
      { token: 'primary', name: 'ocean-blue' }
    );

    expect(result.success).toBe(true);
    expect(result.queuedCount).toBe(1);
    expect(result.requestId).toBeDefined();
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        oklch: { l: 0.5, c: 0.1, h: 180 },
        token: 'primary',
        name: 'ocean-blue',
        requestId: expect.any(String),
        timestamp: expect.any(Number),
      }),
      { contentType: 'json' }
    );
  });

  test('publishSingle works with minimal options', async () => {
    const mockSend = vi.fn().mockResolvedValue(undefined);
    const mockQueue = { send: mockSend } as unknown as Queue;
    const publisher = new ColorSeedPublisher(mockQueue);

    const result = await publisher.publishSingle({ l: 0.7, c: 0.2, h: 240 });

    expect(result.success).toBe(true);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        oklch: { l: 0.7, c: 0.2, h: 240 },
        token: undefined,
        name: undefined,
        requestId: expect.any(String),
        timestamp: expect.any(Number),
      }),
      { contentType: 'json' }
    );
  });

  test('publishSingle respects provided requestId', async () => {
    const mockSend = vi.fn().mockResolvedValue(undefined);
    const mockQueue = { send: mockSend } as unknown as Queue;
    const publisher = new ColorSeedPublisher(mockQueue);

    const customRequestId = 'custom-request-123';
    const result = await publisher.publishSingle(
      { l: 0.3, c: 0.05, h: 120 },
      { requestId: customRequestId }
    );

    expect(result.success).toBe(true);
    expect(result.requestId).toBe(customRequestId);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        requestId: customRequestId,
      }),
      { contentType: 'json' }
    );
  });

  test('publishSingle handles queue send errors', async () => {
    const mockSend = vi.fn().mockRejectedValue(new Error('Queue full'));
    const mockQueue = { send: mockSend } as unknown as Queue;
    const publisher = new ColorSeedPublisher(mockQueue);

    const result = await publisher.publishSingle({ l: 0.5, c: 0.1, h: 180 });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Queue full');
    expect(result.queuedCount).toBeUndefined();
    expect(result.requestId).toBeUndefined();
  });

  test('publishSingle handles non-Error exceptions', async () => {
    const mockSend = vi.fn().mockRejectedValue('String error');
    const mockQueue = { send: mockSend } as unknown as Queue;
    const publisher = new ColorSeedPublisher(mockQueue);

    const result = await publisher.publishSingle({ l: 0.5, c: 0.1, h: 180 });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Unknown error');
  });

  test('publishBatch processes multiple colors correctly', async () => {
    const mockSendBatch = vi.fn().mockResolvedValue(undefined);
    const mockQueue = { sendBatch: mockSendBatch } as unknown as Queue;
    const publisher = new ColorSeedPublisher(mockQueue);

    const colors = [
      { oklch: { l: 0.5, c: 0.1, h: 180 }, token: 'primary' },
      { oklch: { l: 0.6, c: 0.2, h: 240 }, name: 'blue-light' },
      { oklch: { l: 0.4, c: 0.15, h: 200 } },
    ];

    const result = await publisher.publishBatch(colors, { batchId: 'test-batch' });

    expect(result.success).toBe(true);
    expect(result.queuedCount).toBe(3);
    expect(result.requestId).toBe('test-batch');
    expect(mockSendBatch).toHaveBeenCalledTimes(1); // All 3 colors in one batch
  });

  test('publishBatch generates batchId when not provided', async () => {
    const mockSendBatch = vi.fn().mockResolvedValue(undefined);
    const mockQueue = { sendBatch: mockSendBatch } as unknown as Queue;
    const publisher = new ColorSeedPublisher(mockQueue);

    const colors = [{ oklch: { l: 0.5, c: 0.1, h: 180 } }];
    const result = await publisher.publishBatch(colors);

    expect(result.success).toBe(true);
    expect(result.requestId).toBeDefined();
    expect(result.requestId).toMatch(/^[0-9a-f-]+$/i); // UUID format
  });

  test('publishBatch handles batch send errors gracefully', async () => {
    const mockSendBatch = vi.fn().mockRejectedValue(new Error('Batch failed'));
    const mockQueue = { sendBatch: mockSendBatch } as unknown as Queue;
    const publisher = new ColorSeedPublisher(mockQueue);

    const colors = [{ oklch: { l: 0.5, c: 0.1, h: 180 } }, { oklch: { l: 0.6, c: 0.2, h: 240 } }];

    const result = await publisher.publishBatch(colors);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Batch failed');
  });

  test('publishBatch creates correct requestId format for batched messages', async () => {
    const mockSendBatch = vi.fn().mockResolvedValue(undefined);
    const mockQueue = { sendBatch: mockSendBatch } as unknown as Queue;
    const publisher = new ColorSeedPublisher(mockQueue);

    const colors = [{ oklch: { l: 0.5, c: 0.1, h: 180 } }];
    await publisher.publishBatch(colors, { batchId: 'batch-123' });

    const call = mockSendBatch.mock.calls[0];
    const messages = call[0];
    const message = messages[0];
    expect(message.body.requestId).toMatch(/^batch-123-0-[0-9a-f-]+$/i);
  });

  test('publishSpectrum generates expected number of colors', async () => {
    const mockSendBatch = vi.fn().mockResolvedValue(undefined);
    const mockQueue = { sendBatch: mockSendBatch } as unknown as Queue;
    const publisher = new ColorSeedPublisher(mockQueue);

    const config = {
      lightnessSteps: 3,
      chromaSteps: 2,
      hueSteps: 4,
      baseName: 'test-spectrum',
    };

    const result = await publisher.publishSpectrum(config);
    const expectedCount = 3 * 2 * 4; // 24 colors

    expect(result.success).toBe(true);
    expect(result.queuedCount).toBe(expectedCount);
    expect(mockSendBatch).toHaveBeenCalledTimes(1); // All colors in one batch call
  });

  test('publishSpectrum uses provided values correctly', async () => {
    const mockSendBatch = vi.fn().mockResolvedValue(undefined);
    const mockQueue = { sendBatch: mockSendBatch } as unknown as Queue;
    const publisher = new ColorSeedPublisher(mockQueue);

    // Test with specific config values
    const result = await publisher.publishSpectrum({
      lightnessSteps: 2,
      chromaSteps: 2,
      hueSteps: 3,
    });
    const expectedCount = 2 * 2 * 3; // 12 colors

    expect(result.success).toBe(true);
    expect(result.queuedCount).toBe(expectedCount);
  });

  test('publishSpectrum creates proper color names', async () => {
    const mockSendBatch = vi.fn().mockResolvedValue(undefined);
    const mockQueue = { sendBatch: mockSendBatch } as unknown as Queue;
    const publisher = new ColorSeedPublisher(mockQueue);

    await publisher.publishSpectrum({
      lightnessSteps: 2,
      chromaSteps: 1,
      hueSteps: 2,
      baseName: 'test',
    });

    // Check that messages have proper naming
    const call = mockSendBatch.mock.calls[0];
    const messages = call[0];
    const message = messages[0];
    expect(message.body.name).toMatch(/^test-/);
    expect(message.body.oklch).toEqual(
      expect.objectContaining({
        l: expect.any(Number),
        c: expect.any(Number),
        h: expect.any(Number),
      })
    );
  });

  test('publishSpectrum handles spectrum generation errors', async () => {
    const mockSendBatch = vi.fn().mockRejectedValue(new Error('Spectrum send failed'));
    const mockQueue = { sendBatch: mockSendBatch } as unknown as Queue;
    const publisher = new ColorSeedPublisher(mockQueue);

    const result = await publisher.publishSpectrum({
      lightnessSteps: 2,
      chromaSteps: 1,
      hueSteps: 1,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Spectrum send failed');
  });

  test('chunkArray divides arrays correctly', () => {
    const mockQueue = { send: vi.fn() } as unknown as Queue;
    const publisher = new ColorSeedPublisher(mockQueue);

    // Access private method through type assertion for testing
    const chunkArray = (
      publisher as unknown as { chunkArray: <T>(array: T[], chunkSize: number) => T[][] }
    ).chunkArray;

    const items = [1, 2, 3, 4, 5, 6, 7];
    const chunks = chunkArray(items, 3);

    expect(chunks).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
  });

  test('chunkArray handles empty arrays', () => {
    const mockQueue = { send: vi.fn() } as unknown as Queue;
    const publisher = new ColorSeedPublisher(mockQueue);

    const chunkArray = (
      publisher as unknown as { chunkArray: <T>(array: T[], chunkSize: number) => T[][] }
    ).chunkArray;
    const chunks = chunkArray([], 5);

    expect(chunks).toEqual([]);
  });

  test('message timestamp is recent', async () => {
    const mockSend = vi.fn().mockResolvedValue(undefined);
    const mockQueue = { send: mockSend } as unknown as Queue;
    const publisher = new ColorSeedPublisher(mockQueue);

    const beforeTime = Date.now();
    await publisher.publishSingle({ l: 0.5, c: 0.1, h: 180 });
    const afterTime = Date.now();

    const call = mockSend.mock.calls[0];
    const message = call[0];
    expect(message.timestamp).toBeGreaterThanOrEqual(beforeTime);
    expect(message.timestamp).toBeLessThanOrEqual(afterTime);
  });
});
