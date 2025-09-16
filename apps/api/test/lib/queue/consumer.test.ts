/**
 * Unit Tests for Color Seed Queue Consumer
 *
 * Tests the queue consumer logic for processing ColorSeedMessage batches.
 * Focuses on business logic and error handling without Cloudflare runtime dependencies.
 */

import type { OKLCH } from '@rafters/shared';
import type { Hono } from 'hono';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { processColorSeedBatch } from '../../../src/lib/queue/consumer';
import type { ColorSeedMessage } from '../../../src/lib/queue/publisher';

// Mock message interface with proper typing
interface MockMessage {
  body: ColorSeedMessage;
  ack: ReturnType<typeof vi.fn>;
  retry: ReturnType<typeof vi.fn>;
}

// Mock message batch interface
interface MockMessageBatch {
  messages: MockMessage[];
}

// Mock environment interface
interface MockEnv {
  VECTORIZE: VectorizeIndex;
  AI: Ai;
  CLAUDE_API_KEY: string;
  CF_TOKEN: string;
  CLAUDE_GATEWAY_URL: string;
  COLOR_SEED_QUEUE: Queue;
  SEED_QUEUE_API_KEY: string;
}

// Mock Hono app interface
interface MockHonoApp {
  fetch: ReturnType<typeof vi.fn>;
}

describe('Color Seed Queue Consumer - Unit Tests', () => {
  let mockEnv: MockEnv;
  let mockApp: MockHonoApp;

  beforeEach(() => {
    vi.clearAllMocks();

    mockEnv = {
      VECTORIZE: {} as VectorizeIndex,
      AI: {} as Ai,
      CLAUDE_API_KEY: 'test-claude-api-key',
      CF_TOKEN: 'test-cf-token',
      CLAUDE_GATEWAY_URL: 'https://gateway.test.com',
      COLOR_SEED_QUEUE: {} as Queue,
      SEED_QUEUE_API_KEY: 'test-seed-queue-api-key',
    };

    mockApp = {
      fetch: vi.fn(),
    };
  });

  describe('processColorSeedBatch', () => {
    test('processes single message successfully', async () => {
      const testOklch: OKLCH = { l: 0.65, c: 0.12, h: 240 };
      const testMessage: ColorSeedMessage = {
        oklch: testOklch,
        token: 'primary',
        name: 'test-blue',
        requestId: 'test-request-123',
        timestamp: Date.now(),
      };

      const mockMessage: MockMessage = {
        body: testMessage,
        ack: vi.fn(),
        retry: vi.fn(),
      };

      const mockBatch: MockMessageBatch = {
        messages: [mockMessage],
      };

      const mockColorResult = {
        id: 'oklch-0.65-0.12-240',
        name: 'test-blue',
        oklch: testOklch,
        intelligence: {
          suggestedName: 'Deep Azure',
          reasoning: 'Calming blue color for primary actions',
          emotionalImpact: 'Trust and reliability',
          culturalContext: 'Professional blue tone',
          accessibilityNotes: 'High contrast available',
          usageGuidance: 'Use for primary CTAs',
        },
      };

      // Mock successful API response
      mockApp.fetch.mockResolvedValue(
        new Response(JSON.stringify(mockColorResult), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      await processColorSeedBatch(
        mockBatch as unknown as MessageBatch<ColorSeedMessage>,
        mockEnv,
        mockApp as unknown as Hono<{ Bindings: MockEnv }>
      );

      // Verify API was called with correct request
      expect(mockApp.fetch).toHaveBeenCalledOnce();
      const [request, env] = mockApp.fetch.mock.calls[0];

      expect(request.url).toBe('http://internal/api/color-intel');
      expect(request.method).toBe('POST');
      expect(await request.json()).toEqual({
        oklch: testOklch,
        token: 'primary',
        name: 'test-blue',
      });
      expect(env).toBe(mockEnv);

      // Verify message was acknowledged
      expect(mockMessage.ack).toHaveBeenCalledOnce();
      expect(mockMessage.retry).not.toHaveBeenCalled();
    });

    test('processes multiple messages in batch', async () => {
      const testMessages: ColorSeedMessage[] = [
        {
          oklch: { l: 0.5, c: 0.1, h: 0 },
          token: 'red',
          name: 'test-red',
          requestId: 'test-1',
          timestamp: Date.now(),
        },
        {
          oklch: { l: 0.6, c: 0.15, h: 120 },
          token: 'green',
          name: 'test-green',
          requestId: 'test-2',
          timestamp: Date.now(),
        },
        {
          oklch: { l: 0.7, c: 0.2, h: 240 },
          token: 'blue',
          name: 'test-blue',
          requestId: 'test-3',
          timestamp: Date.now(),
        },
      ];

      const mockMessages: MockMessage[] = testMessages.map((body) => ({
        body,
        ack: vi.fn(),
        retry: vi.fn(),
      }));

      const mockBatch: MockMessageBatch = {
        messages: mockMessages,
      };

      // Mock successful API responses for all messages
      mockApp.fetch
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ id: 'red', name: 'test-red' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ id: 'green', name: 'test-green' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ id: 'blue', name: 'test-blue' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );

      await processColorSeedBatch(
        mockBatch as unknown as MessageBatch<ColorSeedMessage>,
        mockEnv,
        mockApp as unknown as Hono<{ Bindings: MockEnv }>
      );

      // Verify all messages were processed
      expect(mockApp.fetch).toHaveBeenCalledTimes(3);

      // Verify all messages were acknowledged
      mockMessages.forEach((message) => {
        expect(message.ack).toHaveBeenCalledOnce();
        expect(message.retry).not.toHaveBeenCalled();
      });
    });

    test('processes message with minimal data (no token/name)', async () => {
      const testMessage: ColorSeedMessage = {
        oklch: { l: 0.5, c: 0.1, h: 180 },
        requestId: 'test-minimal',
        timestamp: Date.now(),
      };

      const mockMessage: MockMessage = {
        body: testMessage,
        ack: vi.fn(),
        retry: vi.fn(),
      };

      const mockBatch: MockMessageBatch = {
        messages: [mockMessage],
      };

      const mockColorResult = {
        id: 'oklch-0.50-0.10-180',
        name: 'Generated color',
        oklch: { l: 0.5, c: 0.1, h: 180 },
        intelligence: {
          suggestedName: 'Generated Cyan',
          reasoning: 'Color generated from OKLCH values',
        },
      };

      mockApp.fetch.mockResolvedValue(
        new Response(JSON.stringify(mockColorResult), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      await processColorSeedBatch(
        mockBatch as unknown as MessageBatch<ColorSeedMessage>,
        mockEnv,
        mockApp as unknown as Hono<{ Bindings: MockEnv }>
      );

      // Verify API was called with undefined for token/name
      expect(mockApp.fetch).toHaveBeenCalledOnce();
      const [request] = mockApp.fetch.mock.calls[0];
      expect(await request.json()).toEqual({
        oklch: { l: 0.5, c: 0.1, h: 180 },
        token: undefined,
        name: undefined,
      });

      expect(mockMessage.ack).toHaveBeenCalledOnce();
    });

    test('handles API error and retries message', async () => {
      const testMessage: ColorSeedMessage = {
        oklch: { l: 0.5, c: 0.1, h: 180 },
        token: 'error-token',
        name: 'error-color',
        requestId: 'error-test',
        timestamp: Date.now(),
      };

      const mockMessage: MockMessage = {
        body: testMessage,
        ack: vi.fn(),
        retry: vi.fn(),
      };

      const mockBatch: MockMessageBatch = {
        messages: [mockMessage],
      };

      // Mock API error response
      mockApp.fetch.mockResolvedValue(
        new Response('Claude API rate limited', {
          status: 500,
          statusText: 'Internal Server Error',
        })
      );

      await processColorSeedBatch(
        mockBatch as unknown as MessageBatch<ColorSeedMessage>,
        mockEnv,
        mockApp as unknown as Hono<{ Bindings: MockEnv }>
      );

      // Verify message was retried, not acknowledged
      expect(mockMessage.retry).toHaveBeenCalledOnce();
      expect(mockMessage.ack).not.toHaveBeenCalled();
    });

    test('handles mixed success and failure in batch', async () => {
      const testMessages: ColorSeedMessage[] = [
        {
          oklch: { l: 0.5, c: 0.1, h: 0 },
          token: 'success',
          name: 'success-color',
          requestId: 'success-1',
          timestamp: Date.now(),
        },
        {
          oklch: { l: 0.6, c: 0.15, h: 120 },
          token: 'failure',
          name: 'failure-color',
          requestId: 'failure-1',
          timestamp: Date.now(),
        },
        {
          oklch: { l: 0.7, c: 0.2, h: 240 },
          token: 'success-2',
          name: 'success-color-2',
          requestId: 'success-2',
          timestamp: Date.now(),
        },
      ];

      const mockMessages: MockMessage[] = testMessages.map((body) => ({
        body,
        ack: vi.fn(),
        retry: vi.fn(),
      }));

      const mockBatch: MockMessageBatch = {
        messages: mockMessages,
      };

      // Mock success for first and third messages, failure for second
      mockApp.fetch
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ id: 'success-1', name: 'success-color' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        )
        .mockResolvedValueOnce(
          new Response('Processing failed', {
            status: 500,
            statusText: 'Internal Server Error',
          })
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ id: 'success-2', name: 'success-color-2' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );

      await processColorSeedBatch(
        mockBatch as unknown as MessageBatch<ColorSeedMessage>,
        mockEnv,
        mockApp as unknown as Hono<{ Bindings: MockEnv }>
      );

      // Verify first and third messages were acknowledged
      expect(mockMessages[0].ack).toHaveBeenCalledOnce();
      expect(mockMessages[0].retry).not.toHaveBeenCalled();

      expect(mockMessages[2].ack).toHaveBeenCalledOnce();
      expect(mockMessages[2].retry).not.toHaveBeenCalled();

      // Verify second message was retried
      expect(mockMessages[1].retry).toHaveBeenCalledOnce();
      expect(mockMessages[1].ack).not.toHaveBeenCalled();
    });

    test('handles environment with all required fields', async () => {
      const testMessage: ColorSeedMessage = {
        oklch: { l: 0.5, c: 0.1, h: 180 },
        requestId: 'env-test',
        timestamp: Date.now(),
      };

      const mockMessage: MockMessage = {
        body: testMessage,
        ack: vi.fn(),
        retry: vi.fn(),
      };

      const mockBatch: MockMessageBatch = {
        messages: [mockMessage],
      };

      const mockColorResult = {
        id: 'env-color',
        name: 'Generated color',
        oklch: { l: 0.5, c: 0.1, h: 180 },
        intelligence: {
          suggestedName: 'Environment Cyan',
          reasoning: 'Color processed with full environment',
        },
      };

      mockApp.fetch.mockResolvedValue(
        new Response(JSON.stringify(mockColorResult), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      await processColorSeedBatch(
        mockBatch as unknown as MessageBatch<ColorSeedMessage>,
        mockEnv,
        mockApp as unknown as Hono<{ Bindings: MockEnv }>
      );

      // Verify API was called with correct request
      expect(mockApp.fetch).toHaveBeenCalledOnce();
      const [request, env] = mockApp.fetch.mock.calls[0];
      expect(await request.json()).toEqual({
        oklch: { l: 0.5, c: 0.1, h: 180 },
        token: undefined,
        name: undefined,
      });
      expect(env).toBe(mockEnv);

      expect(mockMessage.ack).toHaveBeenCalledOnce();
    });

    test('continues processing after individual message errors', async () => {
      const testMessages: ColorSeedMessage[] = [
        {
          oklch: { l: 0.5, c: 0.1, h: 0 },
          requestId: 'first',
          timestamp: Date.now(),
        },
        {
          oklch: { l: 0.6, c: 0.15, h: 120 },
          requestId: 'second-error',
          timestamp: Date.now(),
        },
        {
          oklch: { l: 0.7, c: 0.2, h: 240 },
          requestId: 'third',
          timestamp: Date.now(),
        },
      ];

      const mockMessages: MockMessage[] = testMessages.map((body) => ({
        body,
        ack: vi.fn(),
        retry: vi.fn(),
      }));

      const mockBatch: MockMessageBatch = {
        messages: mockMessages,
      };

      // First succeeds, second fails, third succeeds
      mockApp.fetch
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ id: 'first-success', name: 'first' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        )
        .mockResolvedValueOnce(
          new Response('Network timeout', {
            status: 500,
            statusText: 'Internal Server Error',
          })
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ id: 'third-success', name: 'third' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );

      await processColorSeedBatch(
        mockBatch as unknown as MessageBatch<ColorSeedMessage>,
        mockEnv,
        mockApp as unknown as Hono<{ Bindings: MockEnv }>
      );

      // Verify all three messages were processed
      expect(mockApp.fetch).toHaveBeenCalledTimes(3);

      // Verify success/failure patterns
      expect(mockMessages[0].ack).toHaveBeenCalledOnce();
      expect(mockMessages[1].retry).toHaveBeenCalledOnce();
      expect(mockMessages[2].ack).toHaveBeenCalledOnce();
    });
  });
});
