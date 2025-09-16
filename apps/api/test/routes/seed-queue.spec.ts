/**
 * Integration Tests for Color Seed Queue Routes
 *
 * Tests queue endpoints with Cloudflare Workers runtime including:
 * - API key authentication
 * - Request validation with Zod schemas
 * - Queue message publishing
 * - Error handling and security logging
 */

import { createExecutionContext, env, waitOnExecutionContext } from 'cloudflare:test';
import type { OKLCH } from '@rafters/shared';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import app from '../../src/index';

interface TestEnv {
  COLOR_SEED_QUEUE: {
    send: ReturnType<typeof vi.fn>;
    sendBatch: ReturnType<typeof vi.fn>;
  };
  SEED_QUEUE_API_KEY: string;
  AI?: {
    run: ReturnType<typeof vi.fn>;
  };
  CLAUDE_API_KEY?: string;
  CLAUDE_GATEWAY_URL?: string;
  CF_TOKEN?: string;
}

describe('Color Seed Queue Routes - Integration', () => {
  const testEnv = env as unknown as TestEnv;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Set up queue mock
    testEnv.COLOR_SEED_QUEUE = {
      send: vi.fn().mockResolvedValue(undefined),
      sendBatch: vi.fn().mockResolvedValue(undefined),
    };

    // Set up auth
    testEnv.SEED_QUEUE_API_KEY = 'test-api-key-12345';

    // Set up other required env vars
    testEnv.AI = { run: vi.fn() };
    testEnv.CLAUDE_API_KEY = 'test-claude-key';
    testEnv.CLAUDE_GATEWAY_URL = 'https://gateway.example.com';
    testEnv.CF_TOKEN = 'test-cf-token';

    // Spy on console methods
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('Authentication', () => {
    test('requires API key for all endpoints', async () => {
      const endpoints = [
        { method: 'POST', path: '/api/seed-queue/single' },
        { method: 'POST', path: '/api/seed-queue/batch' },
        { method: 'POST', path: '/api/seed-queue/spectrum' },
        { method: 'GET', path: '/api/seed-queue/status' },
      ];

      for (const endpoint of endpoints) {
        const ctx = createExecutionContext();
        const request = new Request(`http://localhost${endpoint.path}`, {
          method: endpoint.method,
          headers: { 'Content-Type': 'application/json' },
          body: endpoint.method === 'POST' ? JSON.stringify({}) : undefined,
        });

        const response = await app.fetch(request, env, ctx);
        await waitOnExecutionContext(ctx);

        expect(response.status).toBe(401);
        const data = await response.json();
        expect(data.code).toBe('MISSING_API_KEY');
      }
    });

    test('accepts valid API key', async () => {
      const ctx = createExecutionContext();
      const request = new Request('http://localhost/api/seed-queue/status', {
        method: 'GET',
        headers: {
          'X-API-Key': 'test-api-key-12345',
        },
      });

      const response = await app.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.status).toBe('operational');
    });

    test('rejects invalid API key with security logging', async () => {
      const ctx = createExecutionContext();
      const request = new Request('http://localhost/api/seed-queue/single', {
        method: 'POST',
        headers: {
          'X-API-Key': 'invalid-key',
          'CF-Connecting-IP': '192.168.1.100',
          'User-Agent': 'TestAgent/1.0',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oklch: { l: 0.5, c: 0.1, h: 180 } }),
      });

      const response = await app.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.code).toBe('INVALID_API_KEY');

      // Verify optimized security logging
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Unauthorized access attempt:',
        expect.objectContaining({
          ip: '192.168.1.100',
          path: '/api/seed-queue/single',
          timestamp: expect.any(Number), // Now using timestamp for better performance
        })
      );
    });

    test('handles missing environment configuration', async () => {
      // Temporarily remove API key
      delete testEnv.SEED_QUEUE_API_KEY;

      const ctx = createExecutionContext();
      const request = new Request('http://localhost/api/seed-queue/status', {
        method: 'GET',
        headers: {
          'X-API-Key': 'any-key',
        },
      });

      const response = await app.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.code).toBe('AUTH_CONFIG_ERROR');

      // Verify error logging
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'SEED_QUEUE_API_KEY environment variable not configured'
      );

      // Restore for other tests
      testEnv.SEED_QUEUE_API_KEY = 'test-api-key-12345';
    });
  });

  describe('POST /api/seed-queue/single', () => {
    const validHeaders = { 'X-API-Key': 'test-api-key-12345', 'Content-Type': 'application/json' };

    test('queues single color successfully', async () => {
      const ctx = createExecutionContext();
      const colorData = {
        oklch: { l: 0.65, c: 0.12, h: 240 },
        token: 'primary',
        name: 'test-blue',
      };

      const request = new Request('http://localhost/api/seed-queue/single', {
        method: 'POST',
        headers: validHeaders,
        body: JSON.stringify(colorData),
      });

      const response = await app.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.message).toBe('Color queued for processing');
      expect(data.requestId).toBeDefined();
      expect(data.queuedCount).toBe(1);

      // Verify queue.send was called
      expect(testEnv.COLOR_SEED_QUEUE.send).toHaveBeenCalledOnce();
      const [message, options] = testEnv.COLOR_SEED_QUEUE.send.mock.calls[0];

      expect(message.oklch).toEqual(colorData.oklch);
      expect(message.token).toBe('primary');
      expect(message.name).toBe('test-blue');
      expect(message.requestId).toBeDefined();
      expect(message.timestamp).toBeTypeOf('number');
      expect(options.contentType).toBe('json');
    });

    test('queues color with minimal data', async () => {
      const ctx = createExecutionContext();
      const colorData = {
        oklch: { l: 0.5, c: 0.1, h: 180 },
      };

      const request = new Request('http://localhost/api/seed-queue/single', {
        method: 'POST',
        headers: validHeaders,
        body: JSON.stringify(colorData),
      });

      const response = await app.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);

      const [message] = testEnv.COLOR_SEED_QUEUE.send.mock.calls[0];
      expect(message.token).toBeUndefined();
      expect(message.name).toBeUndefined();
    });

    test('validates OKLCH values', async () => {
      const invalidCases = [
        { oklch: { l: 1.5, c: 0.1, h: 180 } }, // Lightness > 1
        { oklch: { l: 0.5, c: -0.1, h: 180 } }, // Negative chroma
        { oklch: { l: 0.5, c: 0.1, h: 400 } }, // Hue > 360
        { oklch: { l: 0.5, c: 0.1, h: 180, alpha: 1.5 } }, // Alpha > 1
      ];

      for (const invalidData of invalidCases) {
        const ctx = createExecutionContext();
        const request = new Request('http://localhost/api/seed-queue/single', {
          method: 'POST',
          headers: validHeaders,
          body: JSON.stringify(invalidData),
        });

        const response = await app.fetch(request, env, ctx);
        await waitOnExecutionContext(ctx);

        expect(response.status).toBe(400);
        expect(testEnv.COLOR_SEED_QUEUE.send).not.toHaveBeenCalled();
      }
    });

    test('handles missing required fields', async () => {
      const ctx = createExecutionContext();
      const request = new Request('http://localhost/api/seed-queue/single', {
        method: 'POST',
        headers: validHeaders,
        body: JSON.stringify({ token: 'primary' }), // Missing oklch
      });

      const response = await app.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(400);
      expect(testEnv.COLOR_SEED_QUEUE.send).not.toHaveBeenCalled();
    });

    test('handles queue send errors', async () => {
      testEnv.COLOR_SEED_QUEUE.send.mockRejectedValue(new Error('Queue unavailable'));

      const ctx = createExecutionContext();
      const request = new Request('http://localhost/api/seed-queue/single', {
        method: 'POST',
        headers: validHeaders,
        body: JSON.stringify({ oklch: { l: 0.5, c: 0.1, h: 180 } }),
      });

      const response = await app.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    test('handles malformed JSON', async () => {
      const ctx = createExecutionContext();
      const request = new Request('http://localhost/api/seed-queue/single', {
        method: 'POST',
        headers: validHeaders,
        body: '{ invalid json }',
      });

      const response = await app.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(400);
      expect(testEnv.COLOR_SEED_QUEUE.send).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/seed-queue/batch', () => {
    const validHeaders = { 'X-API-Key': 'test-api-key-12345', 'Content-Type': 'application/json' };

    test('queues multiple colors successfully', async () => {
      const ctx = createExecutionContext();
      const batchData = {
        colors: [
          { oklch: { l: 0.5, c: 0.1, h: 0 }, token: 'red', name: 'test-red' },
          { oklch: { l: 0.6, c: 0.15, h: 120 }, token: 'green', name: 'test-green' },
          { oklch: { l: 0.7, c: 0.2, h: 240 }, token: 'blue', name: 'test-blue' },
        ],
        batchId: 'test-batch-123',
      };

      const request = new Request('http://localhost/api/seed-queue/batch', {
        method: 'POST',
        headers: validHeaders,
        body: JSON.stringify(batchData),
      });

      const response = await app.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.message).toBe('3 colors queued for processing');
      expect(data.batchId).toBe('test-batch-123');
      expect(data.queuedCount).toBe(3);

      // Verify queue.sendBatch was called
      expect(testEnv.COLOR_SEED_QUEUE.sendBatch).toHaveBeenCalledOnce();
      const [messages] = testEnv.COLOR_SEED_QUEUE.sendBatch.mock.calls[0];

      expect(messages).toHaveLength(3);
      expect(messages[0].body.oklch).toEqual(batchData.colors[0].oklch);
      expect(messages[0].body.token).toBe('red');
      expect(messages[0].options.contentType).toBe('json');
    });

    test('generates batchId when not provided', async () => {
      const ctx = createExecutionContext();
      const batchData = {
        colors: [{ oklch: { l: 0.5, c: 0.1, h: 180 } }],
      };

      const request = new Request('http://localhost/api/seed-queue/batch', {
        method: 'POST',
        headers: validHeaders,
        body: JSON.stringify(batchData),
      });

      const response = await app.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.batchId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      );
    });

    test('validates color array size limit', async () => {
      const ctx = createExecutionContext();
      const tooManyColors = Array.from({ length: 1001 }, (_, i) => ({
        oklch: { l: 0.5, c: 0.1, h: i % 360 },
      }));

      const request = new Request('http://localhost/api/seed-queue/batch', {
        method: 'POST',
        headers: validHeaders,
        body: JSON.stringify({ colors: tooManyColors }),
      });

      const response = await app.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(400);
      expect(testEnv.COLOR_SEED_QUEUE.sendBatch).not.toHaveBeenCalled();
    });

    test('handles empty batch', async () => {
      const ctx = createExecutionContext();
      const request = new Request('http://localhost/api/seed-queue/batch', {
        method: 'POST',
        headers: validHeaders,
        body: JSON.stringify({ colors: [] }),
      });

      const response = await app.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.queuedCount).toBe(0);
    });

    test('validates individual colors in batch', async () => {
      const ctx = createExecutionContext();
      const batchData = {
        colors: [
          { oklch: { l: 0.5, c: 0.1, h: 180 } }, // Valid
          { oklch: { l: 1.5, c: 0.1, h: 180 } }, // Invalid lightness
        ],
      };

      const request = new Request('http://localhost/api/seed-queue/batch', {
        method: 'POST',
        headers: validHeaders,
        body: JSON.stringify(batchData),
      });

      const response = await app.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(400);
      expect(testEnv.COLOR_SEED_QUEUE.sendBatch).not.toHaveBeenCalled();
    });

    test('handles batch send errors', async () => {
      testEnv.COLOR_SEED_QUEUE.sendBatch.mockRejectedValue(new Error('Batch failed'));

      const ctx = createExecutionContext();
      const request = new Request('http://localhost/api/seed-queue/batch', {
        method: 'POST',
        headers: validHeaders,
        body: JSON.stringify({
          colors: [{ oklch: { l: 0.5, c: 0.1, h: 180 } }],
        }),
      });

      const response = await app.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });
  });

  describe('POST /api/seed-queue/spectrum', () => {
    const validHeaders = { 'X-API-Key': 'test-api-key-12345', 'Content-Type': 'application/json' };

    test('generates and queues spectrum successfully', async () => {
      const ctx = createExecutionContext();
      const spectrumConfig = {
        lightnessSteps: 3,
        chromaSteps: 2,
        hueSteps: 4,
        baseName: 'test-spectrum',
      };

      const request = new Request('http://localhost/api/seed-queue/spectrum', {
        method: 'POST',
        headers: validHeaders,
        body: JSON.stringify(spectrumConfig),
      });

      const response = await app.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.message).toBe('Spectrum of 24 colors queued for processing');
      expect(data.spectrumId).toMatch(/^spectrum-\d+$/);
      expect(data.config.totalColors).toBe(24); // 3 × 2 × 4 = 24
      expect(data.estimatedProcessingTime).toBe('1 seconds'); // Math.ceil(24/400) = 1

      // Verify queue.sendBatch was called
      expect(testEnv.COLOR_SEED_QUEUE.sendBatch).toHaveBeenCalledOnce();
      const [messages] = testEnv.COLOR_SEED_QUEUE.sendBatch.mock.calls[0];
      expect(messages).toHaveLength(24);
    });

    test('uses default values for optional parameters', async () => {
      const ctx = createExecutionContext();
      const request = new Request('http://localhost/api/seed-queue/spectrum', {
        method: 'POST',
        headers: validHeaders,
        body: JSON.stringify({}), // Use all defaults
      });

      const response = await app.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data.config.lightnessSteps).toBe(9);
      expect(data.config.chromaSteps).toBe(5);
      expect(data.config.hueSteps).toBe(12);
      expect(data.config.totalColors).toBe(540); // 9 × 5 × 12 = 540
    });

    test('validates step count limits', async () => {
      const invalidConfigs = [
        { lightnessSteps: 0 }, // Too small
        { chromaSteps: 25 }, // Too large
        { hueSteps: -1 }, // Negative
        { lightnessSteps: 50 }, // Way too large
      ];

      for (const config of invalidConfigs) {
        const ctx = createExecutionContext();
        const request = new Request('http://localhost/api/seed-queue/spectrum', {
          method: 'POST',
          headers: validHeaders,
          body: JSON.stringify(config),
        });

        const response = await app.fetch(request, env, ctx);
        await waitOnExecutionContext(ctx);

        expect(response.status).toBe(400);
        expect(testEnv.COLOR_SEED_QUEUE.sendBatch).not.toHaveBeenCalled();
      }
    });

    test('generates spectrum with correct OKLCH ranges', async () => {
      const ctx = createExecutionContext();
      const spectrumConfig = {
        lightnessSteps: 2, // 0.1, 0.9
        chromaSteps: 2, // 0.0, 0.4
        hueSteps: 2, // 0°, 180°
      };

      const request = new Request('http://localhost/api/seed-queue/spectrum', {
        method: 'POST',
        headers: validHeaders,
        body: JSON.stringify(spectrumConfig),
      });

      const response = await app.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(200);

      const [messages] = testEnv.COLOR_SEED_QUEUE.sendBatch.mock.calls[0];
      const colors = messages.map((msg: { body: { oklch: OKLCH } }) => msg.body.oklch);

      // Check ranges
      const lightnesses = colors.map((c: OKLCH) => c.l);
      const chromas = colors.map((c: OKLCH) => c.c);
      const hues = colors.map((c: OKLCH) => c.h);

      expect(Math.min(...lightnesses)).toBe(0.1);
      expect(Math.max(...lightnesses)).toBe(0.9);
      expect(Math.min(...chromas)).toBe(0);
      expect(Math.max(...chromas)).toBe(0.4);
      expect(Math.min(...hues)).toBe(0);
      expect(Math.max(...hues)).toBe(180);
    });

    test('assigns spectrum-seed token to all colors', async () => {
      const ctx = createExecutionContext();
      const request = new Request('http://localhost/api/seed-queue/spectrum', {
        method: 'POST',
        headers: validHeaders,
        body: JSON.stringify({ lightnessSteps: 1, chromaSteps: 1, hueSteps: 2 }),
      });

      const response = await app.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(200);

      const [messages] = testEnv.COLOR_SEED_QUEUE.sendBatch.mock.calls[0];
      const tokens = messages.map((msg: { body: { token: string } }) => msg.body.token);

      expect(tokens.every((token: string) => token === 'spectrum-seed')).toBe(true);
    });

    test('handles spectrum generation errors', async () => {
      testEnv.COLOR_SEED_QUEUE.sendBatch.mockRejectedValue(new Error('Spectrum failed'));

      const ctx = createExecutionContext();
      const request = new Request('http://localhost/api/seed-queue/spectrum', {
        method: 'POST',
        headers: validHeaders,
        body: JSON.stringify({ lightnessSteps: 2, chromaSteps: 2, hueSteps: 2 }),
      });

      const response = await app.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });
  });

  describe('GET /api/seed-queue/status', () => {
    const validHeaders = { 'X-API-Key': 'test-api-key-12345' };

    test('returns queue status information', async () => {
      const ctx = createExecutionContext();
      const request = new Request('http://localhost/api/seed-queue/status', {
        method: 'GET',
        headers: validHeaders,
      });

      const response = await app.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data.status).toBe('operational');
      expect(data.publisher).toBe('color-seed-queue');
      expect(data.security).toBeDefined();
      expect(data.limits).toBeDefined();
      expect(data.endpoints).toBeDefined();
      expect(data.usage).toBeDefined();

      // Verify specific information
      expect(data.limits.maxBatchSize).toBe(100);
      expect(data.limits.maxRequestSize).toBe(1000);
      expect(data.limits.rateLimit).toBe('400 messages/second');
      expect(data.security.authentication).toBe('API key required');
    });

    test('does not call queue methods for status endpoint', async () => {
      const ctx = createExecutionContext();
      const request = new Request('http://localhost/api/seed-queue/status', {
        method: 'GET',
        headers: validHeaders,
      });

      await app.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      expect(testEnv.COLOR_SEED_QUEUE.send).not.toHaveBeenCalled();
      expect(testEnv.COLOR_SEED_QUEUE.sendBatch).not.toHaveBeenCalled();
    });
  });

  describe('Error handling and edge cases', () => {
    const validHeaders = { 'X-API-Key': 'test-api-key-12345', 'Content-Type': 'application/json' };

    test('handles unsupported HTTP methods', async () => {
      const ctx = createExecutionContext();
      const request = new Request('http://localhost/api/seed-queue/single', {
        method: 'GET', // Should be POST
        headers: validHeaders,
      });

      const response = await app.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(404);
    });

    test('handles large payload within limits', async () => {
      const ctx = createExecutionContext();
      const largeValidBatch = {
        colors: Array.from({ length: 100 }, (_, i) => ({
          oklch: { l: 0.5, c: 0.1, h: i * 3.6 }, // Spread across hue range
          token: `color-${i}`,
          name: `test-color-${i}`,
        })),
      };

      const request = new Request('http://localhost/api/seed-queue/batch', {
        method: 'POST',
        headers: validHeaders,
        body: JSON.stringify(largeValidBatch),
      });

      const response = await app.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.queuedCount).toBe(100);
    });

    test('preserves error context in responses', async () => {
      testEnv.COLOR_SEED_QUEUE.send.mockRejectedValue(new Error('Specific queue error'));

      const ctx = createExecutionContext();
      const request = new Request('http://localhost/api/seed-queue/single', {
        method: 'POST',
        headers: validHeaders,
        body: JSON.stringify({ oklch: { l: 0.5, c: 0.1, h: 180 } }),
      });

      const response = await app.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(500);
      const data = await response.json();
      // When the publisher throws an error, it returns the error message directly
      expect(data.error).toBe('Specific queue error');
    });

    test('handles concurrent requests safely', async () => {
      const ctx = createExecutionContext();
      const requests = Array.from(
        { length: 5 },
        (_, i) =>
          new Request('http://localhost/api/seed-queue/single', {
            method: 'POST',
            headers: validHeaders,
            body: JSON.stringify({
              oklch: { l: 0.5, c: 0.1, h: i * 72 }, // Different hues
              name: `concurrent-${i}`,
            }),
          })
      );

      // Send all requests concurrently
      const responses = await Promise.all(requests.map((request) => app.fetch(request, env, ctx)));
      await waitOnExecutionContext(ctx);

      // All should succeed
      responses.forEach((response) => {
        expect(response.status).toBe(200);
      });

      // Queue.send should be called for each request
      expect(testEnv.COLOR_SEED_QUEUE.send).toHaveBeenCalledTimes(5);
    });
  });
});
