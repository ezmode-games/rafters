/**
 * Main App Integration Tests
 * Tests CORS, routing, and queue handler
 */

import { env } from 'cloudflare:test';
import { describe, expect, test, vi } from 'vitest';
import worker from '@/index';

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

    // Mock Workers AI binding to prevent real API calls and usage charges
    env.AI.run = vi.fn().mockResolvedValue({
      response: 'Mock AI intelligence response for testing',
    });

    // Mock Vectorize binding to prevent real vector DB calls and usage charges
    env.VECTORIZE.getByIds = vi.fn().mockResolvedValue({
      count: 0,
      vectors: [],
    });
    env.VECTORIZE.upsert = vi.fn().mockResolvedValue({
      mutationId: 'mock-mutation-123',
    });

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
});
