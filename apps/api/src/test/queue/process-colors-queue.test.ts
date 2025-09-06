/**
 * Tests for Cloudflare Queue color processor
 *
 * Tests the queue consumer that processes color batches with automatic retry
 * and calls the color-intel API for full intelligence generation
 */

import type { OKLCH } from '@rafters/shared';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the queue handler
import { processColorBatch } from '../../queue/process-colors-queue';

// Types for queue messages
interface ColorMessage {
  oklch: OKLCH;
  index: number;
  timestamp: string;
}

interface MockMessage {
  id: string;
  body: ColorMessage;
  ack: () => void;
  retry: () => void;
}

interface MockMessageBatch {
  messages: MockMessage[];
}

interface MockEnv {
  VECTORIZE: VectorizeIndex;
  CLAUDE_API_KEY: string;
  CF_TOKEN: string;
  CLAUDE_GATEWAY_URL: string;
}

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Color Queue Consumer', () => {
  let mockEnv: MockEnv;
  let mockMessages: MockMessage[];
  let mockBatch: MockMessageBatch;

  beforeEach(() => {
    vi.clearAllMocks();

    mockEnv = {
      VECTORIZE: {} as VectorizeIndex,
      CLAUDE_API_KEY: 'test-api-key',
      CF_TOKEN: 'test-cf-token',
      CLAUDE_GATEWAY_URL: 'https://gateway.ai.cloudflare.com/v1/test/test/anthropic',
    };

    // Create mock messages
    mockMessages = [
      {
        id: 'msg-1',
        body: {
          oklch: { l: 0.5, c: 0.1, h: 240 },
          index: 0,
          timestamp: new Date().toISOString(),
        },
        ack: vi.fn(),
        retry: vi.fn(),
      },
      {
        id: 'msg-2',
        body: {
          oklch: { l: 0.7, c: 0.15, h: 120 },
          index: 1,
          timestamp: new Date().toISOString(),
        },
        ack: vi.fn(),
        retry: vi.fn(),
      },
    ];

    mockBatch = { messages: mockMessages };
  });

  describe('processColorBatch', () => {
    it('should process all colors successfully and acknowledge messages', async () => {
      // Mock successful API responses
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          name: 'Ocean Depths',
          intelligence: {
            suggestedName: 'Ocean Depths',
            reasoning: 'Deep blue reminiscent of ocean depths',
            emotionalImpact: 'Calming and mysterious',
            culturalContext: 'Associated with wisdom and depth',
            accessibilityNotes: 'Good contrast on light backgrounds',
            usageGuidance: 'Ideal for headers and accent elements',
          },
          analysis: { temperature: 'cool', isLight: false },
        }),
      });

      await processColorBatch(mockBatch, mockEnv);

      // Verify API was called for each color
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://rafters.realhandy.tech/api/color-intel',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ oklch: { l: 0.5, c: 0.1, h: 240 } }),
        })
      );

      // Verify messages were acknowledged
      expect(mockMessages[0].ack).toHaveBeenCalledOnce();
      expect(mockMessages[1].ack).toHaveBeenCalledOnce();
      expect(mockMessages[0].retry).not.toHaveBeenCalled();
      expect(mockMessages[1].retry).not.toHaveBeenCalled();
    });

    it('should retry messages when API fails', async () => {
      // Mock API failure
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      });

      await processColorBatch(mockBatch, mockEnv);

      // Verify API was called for each color
      expect(mockFetch).toHaveBeenCalledTimes(2);

      // Verify messages were retried, not acknowledged
      expect(mockMessages[0].retry).toHaveBeenCalledOnce();
      expect(mockMessages[1].retry).toHaveBeenCalledOnce();
      expect(mockMessages[0].ack).not.toHaveBeenCalled();
      expect(mockMessages[1].ack).not.toHaveBeenCalled();
    });

    it('should handle mixed success and failure in batch', async () => {
      // Mock mixed responses - first succeeds, second fails
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ name: 'Test Color' }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 429, // Rate limited
        });

      await processColorBatch(mockBatch, mockEnv);

      // Verify both API calls were made
      expect(mockFetch).toHaveBeenCalledTimes(2);

      // First message should be acknowledged
      expect(mockMessages[0].ack).toHaveBeenCalledOnce();
      expect(mockMessages[0].retry).not.toHaveBeenCalled();

      // Second message should be retried
      expect(mockMessages[1].retry).toHaveBeenCalledOnce();
      expect(mockMessages[1].ack).not.toHaveBeenCalled();
    });

    it('should handle fetch network errors gracefully', async () => {
      // Mock network error
      mockFetch.mockRejectedValue(new Error('Network error'));

      await processColorBatch(mockBatch, mockEnv);

      // Verify API was called
      expect(mockFetch).toHaveBeenCalledTimes(2);

      // All messages should be retried due to network error
      expect(mockMessages[0].retry).toHaveBeenCalledOnce();
      expect(mockMessages[1].retry).toHaveBeenCalledOnce();
      expect(mockMessages[0].ack).not.toHaveBeenCalled();
      expect(mockMessages[1].ack).not.toHaveBeenCalled();
    });

    it('should process empty batch without errors', async () => {
      const emptyBatch = { messages: [] };

      await expect(processColorBatch(emptyBatch, mockEnv)).resolves.not.toThrow();

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should handle large batch sizes efficiently', async () => {
      // Create a batch with 10 messages (max batch size)
      const largeBatch = {
        messages: Array.from({ length: 10 }, (_, i) => ({
          id: `msg-${i}`,
          body: {
            oklch: { l: 0.5 + i * 0.05, c: 0.1, h: i * 36 },
            index: i,
            timestamp: new Date().toISOString(),
          },
          ack: vi.fn(),
          retry: vi.fn(),
        })),
      };

      // Mock all successful responses
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ name: 'Test Color' }),
      });

      await processColorBatch(largeBatch, mockEnv);

      // Verify all colors were processed
      expect(mockFetch).toHaveBeenCalledTimes(10);

      // All messages should be acknowledged
      for (const msg of largeBatch.messages) {
        expect(msg.ack).toHaveBeenCalledOnce();
        expect(msg.retry).not.toHaveBeenCalled();
      }
    });
  });

  describe('Queue integration patterns', () => {
    it('should maintain proper message lifecycle', async () => {
      const message = mockMessages[0];

      // Mock successful response
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ name: 'Test Color' }),
      });

      await processColorBatch({ messages: [message] }, mockEnv);

      // Message should go through proper lifecycle: process → ack
      expect(mockFetch).toHaveBeenCalledWith(
        'https://rafters.realhandy.tech/api/color-intel',
        expect.any(Object)
      );
      expect(message.ack).toHaveBeenCalledOnce();
    });

    it('should respect queue configuration for retries', async () => {
      // The queue is configured with max_retries: 3 in wrangler.jsonc
      // Failed messages will be automatically retried by Cloudflare Queues
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      });

      await processColorBatch(mockBatch, mockEnv);

      // Messages should be marked for retry
      for (const msg of mockMessages) {
        expect(msg.retry).toHaveBeenCalledOnce();
        expect(msg.ack).not.toHaveBeenCalled();
      }
    });
  });
});
