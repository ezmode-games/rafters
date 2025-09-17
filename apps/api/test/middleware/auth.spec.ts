/**
 * Auth Middleware Unit Tests
 * Tests authentication logic with spyOn for clean isolation
 */

import { env } from 'cloudflare:test';
import { Hono } from 'hono';
import { describe, expect, test, vi } from 'vitest';
import { requireApiKey } from '@/middleware/auth';

describe('Auth Middleware', () => {
  test('allows request with valid API key', async () => {
    const app = new Hono<{ Bindings: { SEED_QUEUE_API_KEY: string } }>();

    app.use('*', requireApiKey());
    app.get('/test', (c) => c.json({ success: true }));

    env.SEED_QUEUE_API_KEY = 'valid-key';

    const res = await app.request(
      '/test',
      {
        headers: { 'X-API-Key': 'valid-key' },
      },
      env
    );

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
  });

  test('rejects request with missing API key', async () => {
    const app = new Hono<{ Bindings: { SEED_QUEUE_API_KEY: string } }>();

    app.use('*', requireApiKey());
    app.get('/test', (c) => c.json({ success: true }));

    env.SEED_QUEUE_API_KEY = 'valid-key';

    const res = await app.request('/test', {}, env); // No X-API-Key header

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({
      error: 'Authentication required',
      message: 'Missing X-API-Key header',
      code: 'MISSING_API_KEY',
    });
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=300');
    expect(res.headers.get('Content-Type')).toBe('application/json');
  });

  test('rejects request with invalid API key', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const app = new Hono<{ Bindings: { SEED_QUEUE_API_KEY: string } }>();

    app.use('*', requireApiKey());
    app.get('/test', (c) => c.json({ success: true }));

    env.SEED_QUEUE_API_KEY = 'valid-key';

    const res = await app.request(
      '/test',
      {
        headers: {
          'X-API-Key': 'wrong-key',
          'CF-Connecting-IP': '127.0.0.1',
        },
      },
      env
    );

    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({
      error: 'Invalid API key',
      message: 'The provided API key is not valid',
      code: 'INVALID_API_KEY',
    });
    expect(res.headers.get('Cache-Control')).toBe('no-cache, no-store');
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Unauthorized access attempt:',
      expect.objectContaining({
        ip: '127.0.0.1',
        path: '/test',
        timestamp: expect.any(Number),
      })
    );

    consoleWarnSpy.mockRestore();
  });

  test('handles missing environment configuration', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const app = new Hono<{ Bindings: { SEED_QUEUE_API_KEY: string } }>();

    app.use('*', requireApiKey());
    app.get('/test', (c) => c.json({ success: true }));

    const emptyEnv = {} as typeof env; // Missing env var

    const res = await app.request(
      '/test',
      {
        headers: { 'X-API-Key': 'some-key' },
      },
      emptyEnv
    );

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      error: 'Server configuration error',
      message: 'Authentication system not properly configured',
      code: 'AUTH_CONFIG_ERROR',
    });
    expect(res.headers.get('Cache-Control')).toBe('no-cache');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'SEED_QUEUE_API_KEY environment variable not configured'
    );

    consoleErrorSpy.mockRestore();
  });

  test('handles missing CF-Connecting-IP header gracefully', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const app = new Hono<{ Bindings: { SEED_QUEUE_API_KEY: string } }>();

    app.use('*', requireApiKey());
    app.get('/test', (c) => c.json({ success: true }));

    env.SEED_QUEUE_API_KEY = 'valid-key';

    const res = await app.request(
      '/test',
      {
        headers: { 'X-API-Key': 'wrong-key' }, // No CF-Connecting-IP header
      },
      env
    );

    expect(res.status).toBe(403);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Unauthorized access attempt:',
      expect.objectContaining({
        ip: 'unknown',
        path: '/test',
        timestamp: expect.any(Number),
      })
    );

    consoleWarnSpy.mockRestore();
  });
});
