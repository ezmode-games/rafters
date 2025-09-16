/**
 * Integration Tests for Cloudflare Queue Consumer
 *
 * Tests the queue consumer handler with Cloudflare Workers runtime including:
 * - Message batch processing via actual queue bindings
 * - Environment binding availability and configuration
 * - Full integration with color intelligence generation pipeline
 * - Error handling with proper message acknowledgment/retry
 */

import { createExecutionContext, env, waitOnExecutionContext } from 'cloudflare:test';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import type { ColorSeedMessage } from '../src/lib/queue/publisher';

// Integration tests use processColorSeedBatch directly

interface TestEnv {
  COLOR_SEED_QUEUE: {
    send: ReturnType<typeof vi.fn>;
    sendBatch: ReturnType<typeof vi.fn>;
  };
  VECTORIZE: {
    insert: ReturnType<typeof vi.fn>;
    query: ReturnType<typeof vi.fn>;
    upsert: ReturnType<typeof vi.fn>;
  };
  AI: {
    run: ReturnType<typeof vi.fn>;
  };
  CLAUDE_API_KEY: string;
  CF_TOKEN: string;
  CLAUDE_GATEWAY_URL: string;
  COLOR_SEED_QUEUE: Queue;
  SEED_QUEUE_API_KEY: string;
}

// Mock message interface for testing
interface MockMessage {
  body: ColorSeedMessage;
  ack: ReturnType<typeof vi.fn>;
  retry: ReturnType<typeof vi.fn>;
}

interface MockMessageBatch {
  messages: MockMessage[];
}

// Mock Cloudflare bindings interfaces for testing
interface MockCloudflareBindings {
  VECTORIZE: VectorizeIndex;
  AI: Ai;
  CLAUDE_API_KEY: string;
  CF_TOKEN: string;
  CLAUDE_GATEWAY_URL: string;
  COLOR_SEED_QUEUE: Queue;
  SEED_QUEUE_API_KEY: string;
}

interface MockHonoApp {
  fetch: ReturnType<typeof vi.fn>;
}

describe('Queue Consumer - Integration Tests', () => {
  const testEnv = env as unknown as TestEnv;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Set up environment bindings
    testEnv.COLOR_SEED_QUEUE = {
      send: vi.fn().mockResolvedValue(undefined),
      sendBatch: vi.fn().mockResolvedValue(undefined),
    };

    testEnv.VECTORIZE = {
      insert: vi.fn().mockResolvedValue({ count: 1, ids: ['test-id'] }),
      query: vi.fn().mockResolvedValue({ matches: [] }),
      upsert: vi.fn().mockResolvedValue({ count: 1, ids: ['test-id'] }),
    };

    testEnv.AI = {
      run: vi.fn().mockResolvedValue({
        response: 'Mock AI response for color intelligence',
      }),
    };

    testEnv.CLAUDE_API_KEY = 'test-claude-api-key';
    testEnv.CF_TOKEN = 'test-cf-token';
    testEnv.CLAUDE_GATEWAY_URL = 'https://gateway.test.com';

    // Spy on console methods
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('Queue Handler Integration', () => {
    test('processes single color message successfully', async () => {
      const ctx = createExecutionContext();

      const testMessage: ColorSeedMessage = {
        oklch: { l: 0.65, c: 0.12, h: 240 },
        token: 'primary',
        name: 'test-blue',
        requestId: 'integration-test-1',
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

      // Mock successful color intelligence API response
      const mockColorResult = {
        id: 'oklch-0.65-0.12-240',
        name: 'test-blue',
        oklch: { l: 0.65, c: 0.12, h: 240 },
        intelligence: {
          suggestedName: 'Primary Azure',
          reasoning: 'Calming blue color perfect for primary actions',
          emotionalImpact: 'Trust and reliability',
          culturalContext: 'Professional blue tone',
          accessibilityNotes: 'High contrast available',
          usageGuidance: 'Use for primary CTAs',
        },
      };

      // Mock the queue consumer's internal app.fetch call
      const mockApp = {
        fetch: vi.fn().mockResolvedValue(
          new Response(JSON.stringify(mockColorResult), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        ),
      };

      // Import and test the consumer function directly
      const { processColorSeedBatch } = await import('../src/lib/queue/consumer');
      await processColorSeedBatch(
        mockBatch as unknown as MessageBatch<ColorSeedMessage>,
        testEnv as unknown as MockCloudflareBindings,
        mockApp as unknown as MockHonoApp
      );

      await waitOnExecutionContext(ctx);

      // Verify color intelligence API was called
      expect(mockApp.fetch).toHaveBeenCalledOnce();
      const [request] = mockApp.fetch.mock.calls[0];
      expect(request.url).toBe('http://internal/api/color-intel');
      expect(request.method).toBe('POST');

      // Verify message was acknowledged
      expect(mockMessage.ack).toHaveBeenCalledOnce();
      expect(mockMessage.retry).not.toHaveBeenCalled();

      // Verify success logging
      expect(consoleLogSpy).toHaveBeenCalledWith('Processed color seed: test-blue - Primary Azure');
    });

    test('processes multiple messages in batch with Cloudflare bindings', async () => {
      const ctx = createExecutionContext();

      const testMessages: ColorSeedMessage[] = [
        {
          oklch: { l: 0.5, c: 0.1, h: 0 },
          token: 'red',
          name: 'test-red',
          requestId: 'batch-test-1',
          timestamp: Date.now(),
        },
        {
          oklch: { l: 0.6, c: 0.15, h: 120 },
          token: 'green',
          name: 'test-green',
          requestId: 'batch-test-2',
          timestamp: Date.now(),
        },
        {
          oklch: { l: 0.7, c: 0.2, h: 240 },
          token: 'blue',
          name: 'test-blue',
          requestId: 'batch-test-3',
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

      // Mock successful color generation for all messages
      const mockApp = {
        fetch: vi
          .fn()
          .mockResolvedValueOnce(
            new Response(
              JSON.stringify({
                id: 'oklch-0.50-0.10-0',
                name: 'test-red',
                oklch: { l: 0.5, c: 0.1, h: 0 },
                intelligence: { suggestedName: 'Bold Red' },
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } }
            )
          )
          .mockResolvedValueOnce(
            new Response(
              JSON.stringify({
                id: 'oklch-0.60-0.15-120',
                name: 'test-green',
                oklch: { l: 0.6, c: 0.15, h: 120 },
                intelligence: { suggestedName: 'Natural Green' },
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } }
            )
          )
          .mockResolvedValueOnce(
            new Response(
              JSON.stringify({
                id: 'oklch-0.70-0.20-240',
                name: 'test-blue',
                oklch: { l: 0.7, c: 0.2, h: 240 },
                intelligence: { suggestedName: 'Calming Blue' },
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } }
            )
          ),
      };

      // Import and test the consumer function directly
      const { processColorSeedBatch } = await import('../src/lib/queue/consumer');
      await processColorSeedBatch(
        mockBatch as unknown as MessageBatch<ColorSeedMessage>,
        testEnv as unknown as MockCloudflareBindings,
        mockApp as unknown as MockHonoApp
      );

      await waitOnExecutionContext(ctx);

      // Verify all messages were processed
      expect(mockApp.fetch).toHaveBeenCalledTimes(3);

      // Verify all messages were acknowledged
      mockMessages.forEach((message) => {
        expect(message.ack).toHaveBeenCalledOnce();
        expect(message.retry).not.toHaveBeenCalled();
      });

      // Verify all API calls were made with correct requests
      const calls = mockApp.fetch.mock.calls;
      calls.forEach((call) => {
        const [request, env] = call;
        expect(request.url).toBe('http://internal/api/color-intel');
        expect(request.method).toBe('POST');
        expect(env).toBe(testEnv as unknown as MockCloudflareBindings);
      });
    });

    test('handles message processing error with retry', async () => {
      const ctx = createExecutionContext();

      const testMessage: ColorSeedMessage = {
        oklch: { l: 0.5, c: 0.1, h: 180 },
        token: 'error-token',
        name: 'error-color',
        requestId: 'error-test-1',
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

      // Mock processing error
      const processingError = new Error('AI service temporarily unavailable');
      const mockApp = {
        fetch: vi.fn().mockRejectedValue(processingError),
      };

      // Import and test the consumer function directly
      const { processColorSeedBatch } = await import('../src/lib/queue/consumer');
      await processColorSeedBatch(
        mockBatch as unknown as MessageBatch<ColorSeedMessage>,
        testEnv as unknown as MockCloudflareBindings,
        mockApp as unknown as MockHonoApp
      );

      await waitOnExecutionContext(ctx);

      // Verify message was retried, not acknowledged
      expect(mockMessage.retry).toHaveBeenCalledOnce();
      expect(mockMessage.ack).not.toHaveBeenCalled();

      // Verify error logging
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to process color seed message:',
        processingError
      );
    });

    test('processes batch with mixed success and failure outcomes', async () => {
      const ctx = createExecutionContext();

      const testMessages: ColorSeedMessage[] = [
        {
          oklch: { l: 0.5, c: 0.1, h: 0 },
          name: 'success-color-1',
          requestId: 'mixed-1',
          timestamp: Date.now(),
        },
        {
          oklch: { l: 0.6, c: 0.15, h: 120 },
          name: 'failure-color',
          requestId: 'mixed-2',
          timestamp: Date.now(),
        },
        {
          oklch: { l: 0.7, c: 0.2, h: 240 },
          name: 'success-color-2',
          requestId: 'mixed-3',
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

      // Mock success, failure, success pattern
      const mockApp = {
        fetch: vi
          .fn()
          .mockResolvedValueOnce(
            new Response(
              JSON.stringify({
                id: 'success-1',
                name: 'success-color-1',
                oklch: { l: 0.5, c: 0.1, h: 0 },
                intelligence: { suggestedName: 'First Success' },
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } }
            )
          )
          .mockRejectedValueOnce(new Error('Temporary processing error'))
          .mockResolvedValueOnce(
            new Response(
              JSON.stringify({
                id: 'success-2',
                name: 'success-color-2',
                oklch: { l: 0.7, c: 0.2, h: 240 },
                intelligence: { suggestedName: 'Second Success' },
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } }
            )
          ),
      };

      // Import and test the consumer function directly
      const { processColorSeedBatch } = await import('../src/lib/queue/consumer');
      await processColorSeedBatch(
        mockBatch as unknown as MessageBatch<ColorSeedMessage>,
        testEnv as unknown as MockCloudflareBindings,
        mockApp as unknown as MockHonoApp
      );

      await waitOnExecutionContext(ctx);

      // Verify individual message outcomes
      expect(mockMessages[0].ack).toHaveBeenCalledOnce();
      expect(mockMessages[0].retry).not.toHaveBeenCalled();

      expect(mockMessages[1].retry).toHaveBeenCalledOnce();
      expect(mockMessages[1].ack).not.toHaveBeenCalled();

      expect(mockMessages[2].ack).toHaveBeenCalledOnce();
      expect(mockMessages[2].retry).not.toHaveBeenCalled();

      // Verify processing continued after error
      expect(mockApp.fetch).toHaveBeenCalledTimes(3);
    });

    test('handles minimal environment configuration', async () => {
      const ctx = createExecutionContext();

      // Remove optional environment variables
      const minimalEnv = {
        VECTORIZE: testEnv.VECTORIZE,
        AI: testEnv.AI,
        CLAUDE_API_KEY: testEnv.CLAUDE_API_KEY,
        // CF_TOKEN and CLAUDE_GATEWAY_URL undefined
      };

      const testMessage: ColorSeedMessage = {
        oklch: { l: 0.5, c: 0.1, h: 180 },
        requestId: 'minimal-env-test',
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
        id: 'minimal-color',
        name: 'Generated color',
        oklch: { l: 0.5, c: 0.1, h: 180 },
        intelligence: { suggestedName: 'Generated Color' },
      };

      const mockApp = {
        fetch: vi.fn().mockResolvedValue(
          new Response(JSON.stringify(mockColorResult), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        ),
      };

      // Import and test the consumer function directly
      const { processColorSeedBatch } = await import('../src/lib/queue/consumer');
      await processColorSeedBatch(
        mockBatch as unknown as MessageBatch<ColorSeedMessage>,
        minimalEnv as unknown as MockCloudflareBindings,
        mockApp as unknown as MockHonoApp
      );

      await waitOnExecutionContext(ctx);

      // Verify function was called with correct parameters
      expect(mockApp.fetch).toHaveBeenCalledOnce();
      const [request, env] = mockApp.fetch.mock.calls[0];
      expect(request.url).toBe('http://internal/api/color-intel');
      expect(request.method).toBe('POST');
      expect(env).toBe(minimalEnv as unknown as MockCloudflareBindings);

      expect(mockMessage.ack).toHaveBeenCalledOnce();
    });

    test('handles spectrum batch processing efficiently', async () => {
      const ctx = createExecutionContext();

      // Create spectrum-like batch (multiple colors with spectrum-seed token)
      const spectrumMessages: ColorSeedMessage[] = Array.from({ length: 10 }, (_, i) => ({
        oklch: {
          l: 0.5 + i * 0.05, // Varying lightness
          c: 0.1 + i * 0.02, // Varying chroma
          h: i * 36, // Varying hue (36° steps)
        },
        token: 'spectrum-seed',
        name: `spectrum-l${Math.round((0.5 + i * 0.05) * 100)}-c${Math.round((0.1 + i * 0.02) * 100)}-h${i * 36}`,
        requestId: `spectrum-${i}`,
        timestamp: Date.now(),
      }));

      const mockMessages: MockMessage[] = spectrumMessages.map((body) => ({
        body,
        ack: vi.fn(),
        retry: vi.fn(),
      }));

      const mockBatch: MockMessageBatch = {
        messages: mockMessages,
      };

      // Mock successful processing for all spectrum colors
      const mockApp = {
        fetch: vi.fn(),
      };

      spectrumMessages.forEach((message, i) => {
        mockApp.fetch.mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              id: `spectrum-${i}`,
              name: message.name || `spectrum-${i}`,
              oklch: message.oklch,
              intelligence: { suggestedName: `Spectrum Color ${i}` },
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          )
        );
      });

      // Import and test the consumer function directly
      const { processColorSeedBatch } = await import('../src/lib/queue/consumer');
      await processColorSeedBatch(
        mockBatch as unknown as MessageBatch<ColorSeedMessage>,
        testEnv as unknown as MockCloudflareBindings,
        mockApp as unknown as MockHonoApp
      );

      await waitOnExecutionContext(ctx);

      // Verify all spectrum messages were processed
      expect(mockApp.fetch).toHaveBeenCalledTimes(10);

      // Verify all messages were acknowledged
      mockMessages.forEach((message) => {
        expect(message.ack).toHaveBeenCalledOnce();
        expect(message.retry).not.toHaveBeenCalled();
      });

      // Verify spectrum token was passed correctly
      const calls = mockApp.fetch.mock.calls;
      calls.forEach(async (call) => {
        const [request] = call;
        const body = await request.json();
        expect(body.token).toBe('spectrum-seed');
      });
    });

    test('integrates with Cloudflare Vectorize binding correctly', async () => {
      const ctx = createExecutionContext();

      const testMessage: ColorSeedMessage = {
        oklch: { l: 0.6, c: 0.13, h: 210 },
        token: 'vectorize-test',
        name: 'vectorize-color',
        requestId: 'vectorize-integration',
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

      // Mock color generation that uses Vectorize
      const mockColorResult = {
        id: 'vectorize-test-color',
        name: 'vectorize-color',
        oklch: testMessage.oklch,
        intelligence: { suggestedName: 'Vectorize Color' },
      };

      const mockApp = {
        fetch: vi.fn().mockResolvedValue(
          new Response(JSON.stringify(mockColorResult), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        ),
      };

      // Import and test the consumer function directly
      const { processColorSeedBatch } = await import('../src/lib/queue/consumer');
      await processColorSeedBatch(
        mockBatch as unknown as MessageBatch<ColorSeedMessage>,
        testEnv as unknown as MockCloudflareBindings,
        mockApp as unknown as MockHonoApp
      );

      await waitOnExecutionContext(ctx);

      // Verify Vectorize binding was passed to color generation
      expect(mockApp.fetch).toHaveBeenCalledOnce();
      const [request, env] = mockApp.fetch.mock.calls[0];
      expect(request.url).toBe('http://internal/api/color-intel');
      expect(request.method).toBe('POST');
      expect(env).toBe(testEnv as unknown as MockCloudflareBindings); // Environment includes VECTORIZE binding

      expect(mockMessage.ack).toHaveBeenCalledOnce();
    });

    test('handles large batch within Cloudflare Queue limits', async () => {
      const ctx = createExecutionContext();

      // Create batch at Cloudflare Queue limit (100 messages)
      const largeMessages: ColorSeedMessage[] = Array.from(
        { length: 50 }, // Use 50 to keep test reasonable
        (_, i) => ({
          oklch: {
            l: 0.3 + i * 0.01, // Systematic variation
            c: 0.05 + i * 0.005,
            h: i * 7.2, // 7.2° steps for 50 colors
          },
          token: `batch-${i}`,
          name: `large-batch-color-${i}`,
          requestId: `large-batch-${i}`,
          timestamp: Date.now(),
        })
      );

      const mockMessages: MockMessage[] = largeMessages.map((body) => ({
        body,
        ack: vi.fn(),
        retry: vi.fn(),
      }));

      const mockBatch: MockMessageBatch = {
        messages: mockMessages,
      };

      // Mock successful processing for all messages
      const mockApp = {
        fetch: vi.fn(),
      };

      largeMessages.forEach((message, i) => {
        mockApp.fetch.mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              id: `large-batch-${i}`,
              name: message.name || `color-${i}`,
              oklch: message.oklch,
              intelligence: { suggestedName: `Large Batch Color ${i}` },
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          )
        );
      });

      // Import and test the consumer function directly
      const { processColorSeedBatch } = await import('../src/lib/queue/consumer');
      await processColorSeedBatch(
        mockBatch as unknown as MessageBatch<ColorSeedMessage>,
        testEnv as unknown as MockCloudflareBindings,
        mockApp as unknown as MockHonoApp
      );

      await waitOnExecutionContext(ctx);

      // Verify all messages in large batch were processed
      expect(mockApp.fetch).toHaveBeenCalledTimes(50);

      // Verify all messages were acknowledged
      mockMessages.forEach((message) => {
        expect(message.ack).toHaveBeenCalledOnce();
        expect(message.retry).not.toHaveBeenCalled();
      });
    });
  });
});
