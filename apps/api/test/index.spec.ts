/**
 * Main App Integration Tests
 * Tests CORS, routing, and queue handler
 */

import { env } from 'cloudflare:test';
import { describe, expect, test, vi } from 'vitest';
import worker from '@/index';
import type { ColorSeedMessage } from '@/lib/queue/publisher';

describe('Main App', () => {
  test('handles CORS for localhost origins', async () => {
    const res = await worker.fetch(
      new Request('http://localhost:3000/', {
        method: 'OPTIONS',
        headers: { Origin: 'http://localhost:3000' },
      }),
      env
    );

    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
    expect(res.headers.get('Access-Control-Allow-Methods')).toBe('GET,POST,OPTIONS');
  });

  test('handles CORS for realhandy.tech domains', async () => {
    const res = await worker.fetch(
      new Request('https://api.realhandy.tech/', {
        method: 'OPTIONS',
        headers: { Origin: 'https://app.realhandy.tech' },
      }),
      env
    );

    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://app.realhandy.tech');
  });

  test('rejects CORS for unauthorized origins', async () => {
    const res = await worker.fetch(
      new Request('https://evil.com/', {
        method: 'OPTIONS',
        headers: { Origin: 'https://evil.com' },
      }),
      env
    );

    expect(res.status).toBe(500);
  });

  test('routes to color-intel endpoint', async () => {
    env.SEED_QUEUE_API_KEY = 'test-key';

    const res = await worker.fetch(
      new Request('http://localhost/api/color-intel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-key',
        },
        body: JSON.stringify({
          oklch: { l: 0.5, c: 0.1, h: 180 },
          token: 'test-token',
          name: 'test-color',
        }),
      }),
      env
    );

    // Should not be 404 (routing works)
    expect(res.status).not.toBe(404);
  });

  test('routes to seed-queue endpoint', async () => {
    env.SEED_QUEUE_API_KEY = 'test-key';

    const res = await worker.fetch(
      new Request('http://localhost/api/seed-queue/single', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-key',
        },
        body: JSON.stringify({
          oklch: { l: 0.5, c: 0.1, h: 180 },
          token: 'test-token',
          name: 'test-color',
        }),
      }),
      env
    );

    // Should not be 404 (routing works)
    expect(res.status).not.toBe(404);
  });

  test('handles 404 for unknown routes', async () => {
    const res = await worker.fetch(new Request('http://localhost/api/unknown'), env);

    expect(res.status).toBe(404);
  });

  test('queue handler processes batch messages', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    // Mock the global fetch instead of worker.fetch for internal HTTP calls
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          name: 'Test Color',
          scale: [{ l: 0.5, c: 0.1, h: 180 }],
          intelligence: { suggestedName: 'Test Color' },
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );

    const mockBatch: MessageBatch<ColorSeedMessage> = {
      queue: 'COLOR_SEED_QUEUE',
      messages: [
        {
          id: 'test-id',
          timestamp: new Date(),
          attempts: 1,
          body: {
            oklch: { l: 0.5, c: 0.1, h: 180 },
            token: 'test-token',
            name: 'test-color',
            timestamp: Date.now(),
          },
          ack: vi.fn(),
          retry: vi.fn(),
        },
      ],
      retryAll: vi.fn(),
      ackAll: vi.fn(),
    };

    await worker.queue(mockBatch, env);

    expect(mockBatch.messages[0].ack).toHaveBeenCalled();

    // Restore original fetch
    global.fetch = originalFetch;
    consoleSpy.mockRestore();
  }, 10000); // 10 second timeout
});
