/**
 * Queue Consumer Specification Tests
 * Integration tests for queue message processing behavior
 */

import type { ColorValue } from '@rafters/shared';
import type { Hono } from 'hono';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { processColorSeedBatch, processSingleMessage } from '@/lib/queue/consumer';
import type { ColorSeedMessage } from '@/lib/queue/publisher';

interface CloudflareBindings {
  VECTORIZE: VectorizeIndex;
  AI: Ai;
  CLAUDE_API_KEY: string;
  CF_TOKEN: string;
  CLAUDE_GATEWAY_URL: string;
  COLOR_SEED_QUEUE: Queue;
  SEED_QUEUE_API_KEY: string;
}

describe('Queue Consumer Specification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('processSingleMessage', () => {
    test('processes successful message and calls ack', async () => {
      const mockMessage = {
        body: {
          oklch: { l: 0.5, c: 0.1, h: 180 },
          token: 'primary',
          name: 'test-blue',
          timestamp: Date.now(),
        },
        ack: vi.fn(),
        retry: vi.fn(),
      } as unknown as Message<ColorSeedMessage>;

      const mockColorData: ColorValue = {
        name: 'Test Blue',
        scale: [{ l: 0.5, c: 0.1, h: 180 }],
        intelligence: {
          suggestedName: 'Ocean Blue',
          reasoning: 'test',
          emotionalImpact: 'test',
          culturalContext: 'test',
          accessibilityNotes: 'test',
          usageGuidance: 'test',
        },
      };

      const mockApp = {
        fetch: vi.fn().mockResolvedValue({
          status: 200,
          json: vi.fn().mockResolvedValue(mockColorData),
        }),
      } as unknown as Hono<{ Bindings: CloudflareBindings }>;

      const mockEnv = {} as CloudflareBindings;

      const result = await processSingleMessage(mockMessage, mockApp, mockEnv);

      expect(result.success).toBe(true);
      expect(result.message).toBe(mockMessage);
      expect(mockMessage.ack).toHaveBeenCalled();
      expect(mockMessage.retry).not.toHaveBeenCalled();
      expect(mockApp.fetch).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: 'http://internal/api/color-intel',
        }),
        mockEnv
      );
    });

    test('processes failed message and calls retry', async () => {
      const mockMessage = {
        body: {
          oklch: { l: 0.5, c: 0.1, h: 180 },
          timestamp: Date.now(),
        },
        ack: vi.fn(),
        retry: vi.fn(),
      } as unknown as Message<ColorSeedMessage>;

      const mockApp = {
        fetch: vi.fn().mockResolvedValue({
          status: 500,
          text: vi.fn().mockResolvedValue('Internal Server Error'),
        }),
      } as unknown as Hono<{ Bindings: CloudflareBindings }>;

      const mockEnv = {} as CloudflareBindings;

      const result = await processSingleMessage(mockMessage, mockApp, mockEnv);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(mockMessage.retry).toHaveBeenCalled();
      expect(mockMessage.ack).not.toHaveBeenCalled();
    });

    test('handles network errors and calls retry', async () => {
      const mockMessage = {
        body: {
          oklch: { l: 0.5, c: 0.1, h: 180 },
          timestamp: Date.now(),
        },
        ack: vi.fn(),
        retry: vi.fn(),
      } as unknown as Message<ColorSeedMessage>;

      const mockApp = {
        fetch: vi.fn().mockRejectedValue(new Error('Network timeout')),
      } as unknown as Hono<{ Bindings: CloudflareBindings }>;

      const mockEnv = {} as CloudflareBindings;

      const result = await processSingleMessage(mockMessage, mockApp, mockEnv);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(mockMessage.retry).toHaveBeenCalled();
      expect(mockMessage.ack).not.toHaveBeenCalled();
    });
  });

  describe('processColorSeedBatch', () => {
    test('processes batch with single message', async () => {
      const mockMessage = {
        id: 'msg-1',
        timestamp: new Date(),
        attempts: 1,
        body: {
          oklch: { l: 0.5, c: 0.1, h: 180 },
          timestamp: Date.now(),
        },
        ack: vi.fn(),
        retry: vi.fn(),
      };

      const mockBatch: MessageBatch<ColorSeedMessage> = {
        queue: 'COLOR_SEED_QUEUE',
        messages: [mockMessage],
        retryAll: vi.fn(),
        ackAll: vi.fn(),
      };

      const mockApp = {
        fetch: vi.fn().mockResolvedValue({
          status: 200,
          json: vi.fn().mockResolvedValue({ name: 'Test' }),
        }),
      } as unknown as Hono<{ Bindings: CloudflareBindings }>;

      const mockEnv = {} as CloudflareBindings;

      await processColorSeedBatch(mockBatch, mockEnv, mockApp);

      expect(mockApp.fetch).toHaveBeenCalledTimes(1);
      expect(mockMessage.ack).toHaveBeenCalled();
      expect(mockMessage.retry).not.toHaveBeenCalled();
    });

    test('processes batch with multiple messages concurrently', async () => {
      const mockMessages = [
        {
          id: 'msg-1',
          timestamp: new Date(),
          attempts: 1,
          body: {
            oklch: { l: 0.5, c: 0.1, h: 180 },
            timestamp: Date.now(),
          },
          ack: vi.fn(),
          retry: vi.fn(),
        },
        {
          id: 'msg-2',
          timestamp: new Date(),
          attempts: 1,
          body: {
            oklch: { l: 0.6, c: 0.2, h: 240 },
            timestamp: Date.now(),
          },
          ack: vi.fn(),
          retry: vi.fn(),
        },
      ];

      const mockBatch: MessageBatch<ColorSeedMessage> = {
        queue: 'COLOR_SEED_QUEUE',
        messages: mockMessages,
        retryAll: vi.fn(),
        ackAll: vi.fn(),
      };

      const mockApp = {
        fetch: vi.fn().mockResolvedValue({
          status: 200,
          json: vi.fn().mockResolvedValue({ name: 'Test' }),
        }),
      } as unknown as Hono<{ Bindings: CloudflareBindings }>;

      const mockEnv = {} as CloudflareBindings;

      await processColorSeedBatch(mockBatch, mockEnv, mockApp);

      expect(mockApp.fetch).toHaveBeenCalledTimes(2);
      expect(mockMessages[0].ack).toHaveBeenCalled();
      expect(mockMessages[1].ack).toHaveBeenCalled();
    });

    test('processes batch with mixed success and failure', async () => {
      const mockMessages = [
        {
          id: 'msg-success',
          timestamp: new Date(),
          attempts: 1,
          body: {
            oklch: { l: 0.5, c: 0.1, h: 180 },
            timestamp: Date.now(),
          },
          ack: vi.fn(),
          retry: vi.fn(),
        },
        {
          id: 'msg-failure',
          timestamp: new Date(),
          attempts: 1,
          body: {
            oklch: { l: 0.6, c: 0.2, h: 240 },
            timestamp: Date.now(),
          },
          ack: vi.fn(),
          retry: vi.fn(),
        },
      ];

      const mockBatch: MessageBatch<ColorSeedMessage> = {
        queue: 'COLOR_SEED_QUEUE',
        messages: mockMessages,
        retryAll: vi.fn(),
        ackAll: vi.fn(),
      };

      const mockApp = {
        fetch: vi
          .fn()
          .mockResolvedValueOnce({
            status: 200,
            json: vi.fn().mockResolvedValue({ name: 'Success' }),
          })
          .mockResolvedValueOnce({
            status: 500,
            text: vi.fn().mockResolvedValue('Error'),
          }),
      } as unknown as Hono<{ Bindings: CloudflareBindings }>;

      const mockEnv = {} as CloudflareBindings;

      await processColorSeedBatch(mockBatch, mockEnv, mockApp);

      expect(mockMessages[0].ack).toHaveBeenCalled();
      expect(mockMessages[0].retry).not.toHaveBeenCalled();
      expect(mockMessages[1].ack).not.toHaveBeenCalled();
      expect(mockMessages[1].retry).toHaveBeenCalled();
    });

    test('processes large batch with chunking', async () => {
      // Create 15 messages (more than CONCURRENCY_LIMIT of 10)
      const mockMessages = Array.from({ length: 15 }, (_, i) => ({
        id: `msg-${i}`,
        timestamp: new Date(),
        attempts: 1,
        body: {
          oklch: { l: 0.5, c: 0.1, h: i * 10 },
          timestamp: Date.now(),
        },
        ack: vi.fn(),
        retry: vi.fn(),
      }));

      const mockBatch: MessageBatch<ColorSeedMessage> = {
        queue: 'COLOR_SEED_QUEUE',
        messages: mockMessages,
        retryAll: vi.fn(),
        ackAll: vi.fn(),
      };

      const mockApp = {
        fetch: vi.fn().mockResolvedValue({
          status: 200,
          json: vi.fn().mockResolvedValue({ name: 'Test' }),
        }),
      } as unknown as Hono<{ Bindings: CloudflareBindings }>;

      const mockEnv = {} as CloudflareBindings;

      await processColorSeedBatch(mockBatch, mockEnv, mockApp);

      expect(mockApp.fetch).toHaveBeenCalledTimes(15);
      mockMessages.forEach((message) => {
        expect(message.ack).toHaveBeenCalled();
        expect(message.retry).not.toHaveBeenCalled();
      });
    });

    test('handles all messages failing in batch', async () => {
      const mockMessages = [
        {
          id: 'msg-1',
          timestamp: new Date(),
          attempts: 1,
          body: {
            oklch: { l: 0.5, c: 0.1, h: 180 },
            timestamp: Date.now(),
          },
          ack: vi.fn(),
          retry: vi.fn(),
        },
        {
          id: 'msg-2',
          timestamp: new Date(),
          attempts: 1,
          body: {
            oklch: { l: 0.6, c: 0.2, h: 240 },
            timestamp: Date.now(),
          },
          ack: vi.fn(),
          retry: vi.fn(),
        },
      ];

      const mockBatch: MessageBatch<ColorSeedMessage> = {
        queue: 'COLOR_SEED_QUEUE',
        messages: mockMessages,
        retryAll: vi.fn(),
        ackAll: vi.fn(),
      };

      const mockApp = {
        fetch: vi.fn().mockRejectedValue(new Error('Service unavailable')),
      } as unknown as Hono<{ Bindings: CloudflareBindings }>;

      const mockEnv = {} as CloudflareBindings;

      await processColorSeedBatch(mockBatch, mockEnv, mockApp);

      expect(mockMessages[0].ack).not.toHaveBeenCalled();
      expect(mockMessages[0].retry).toHaveBeenCalled();
      expect(mockMessages[1].ack).not.toHaveBeenCalled();
      expect(mockMessages[1].retry).toHaveBeenCalled();
    });

    test('processes empty batch without errors', async () => {
      const mockBatch: MessageBatch<ColorSeedMessage> = {
        queue: 'COLOR_SEED_QUEUE',
        messages: [],
        retryAll: vi.fn(),
        ackAll: vi.fn(),
      };

      const mockApp = {
        fetch: vi.fn(),
      } as unknown as Hono<{ Bindings: CloudflareBindings }>;

      const mockEnv = {} as CloudflareBindings;

      await processColorSeedBatch(mockBatch, mockEnv, mockApp);

      expect(mockApp.fetch).not.toHaveBeenCalled();
    });
  });
});
