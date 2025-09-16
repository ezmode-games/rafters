/**
 * Simplified Color Intelligence API Integration Tests
 *
 * Tests the basic functionality of the Hono-based color intelligence API
 * with simpler mocking to ensure reliability in CI environments.
 */

import { createExecutionContext, env, waitOnExecutionContext } from 'cloudflare:test';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import app from '../src/index';

interface TestEnv {
  AI: {
    run: ReturnType<typeof vi.fn>;
  };
  CLAUDE_API_KEY: string;
  CLAUDE_GATEWAY_URL: string;
  CF_TOKEN: string;
  VECTORIZE?: {
    getByIds: ReturnType<typeof vi.fn>;
    upsert: ReturnType<typeof vi.fn>;
  };
}

describe('Color Intelligence API - Basic Integration', () => {
  const testEnv = env as unknown as TestEnv;

  beforeEach(() => {
    // Set up basic environment with mocked AI
    testEnv.AI = {
      run: vi.fn().mockResolvedValue({
        response: JSON.stringify({
          suggestedName: 'Test Blue',
          reasoning: 'Test reasoning',
          emotionalImpact: 'Test impact',
          culturalContext: 'Test context',
          accessibilityNotes: 'Test accessibility',
          usageGuidance: 'Test usage',
          balancingGuidance: 'Test balancing',
        }),
      }),
    };
    testEnv.CLAUDE_API_KEY = 'test-api-key';
    testEnv.CLAUDE_GATEWAY_URL = 'https://gateway.example.com';
    testEnv.CF_TOKEN = 'test-cf-token';
  });

  test('API responds to valid color intelligence requests', async () => {
    const ctx = createExecutionContext();
    const request = new Request('http://localhost/api/color-intel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        oklch: { l: 0.65, c: 0.12, h: 240 },
        token: 'primary',
        name: 'test-blue',
      }),
    });

    const response = await app.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);

    const data = await response.json();

    // Basic structure validation
    expect(data).toBeDefined();
    expect(data.name).toBeDefined();
    expect(data.scale).toBeDefined();
    expect(Array.isArray(data.scale)).toBe(true);
    expect(data.intelligence).toBeDefined();
    expect(data.harmonies).toBeDefined();
    expect(data.accessibility).toBeDefined();
    expect(data.analysis).toBeDefined();
  });

  test('API handles CORS preflight requests', async () => {
    const ctx = createExecutionContext();
    const request = new Request('http://localhost/api/color-intel', {
      method: 'OPTIONS',
    });

    const response = await app.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    // OPTIONS requests return 204 No Content or 200 OK
    expect([200, 204]).toContain(response.status);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  test('API rejects invalid OKLCH values', async () => {
    const ctx = createExecutionContext();
    const request = new Request('http://localhost/api/color-intel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        oklch: { l: 2.0, c: 0.12, h: 240 }, // Invalid lightness > 1
      }),
    });

    const response = await app.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(400);
  });

  test('API rejects malformed JSON', async () => {
    const ctx = createExecutionContext();
    const request = new Request('http://localhost/api/color-intel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{ "invalid": json }',
    });

    const response = await app.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(400);
  });

  test('API rejects unsupported HTTP methods', async () => {
    const ctx = createExecutionContext();
    const request = new Request('http://localhost/api/color-intel', {
      method: 'GET',
    });

    const response = await app.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(404);
  });

  test('API includes CORS headers in responses', async () => {
    const ctx = createExecutionContext();
    const request = new Request('http://localhost/api/color-intel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        oklch: { l: 0.5, c: 0.1, h: 180 },
      }),
    });

    const response = await app.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  test('API handles missing required fields', async () => {
    const ctx = createExecutionContext();
    const request = new Request('http://localhost/api/color-intel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // Missing oklch field
        token: 'primary',
      }),
    });

    const response = await app.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(400);
  });

  test('Vectorize caching functions without errors', async () => {
    const ctx = createExecutionContext();

    // Make multiple requests with the same color to test caching
    const colorData = {
      oklch: { l: 0.6, c: 0.15, h: 300 },
      token: 'accent',
    };

    // First request
    const firstRequest = new Request('http://localhost/api/color-intel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(colorData),
    });

    const firstResponse = await app.fetch(firstRequest, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(firstResponse.status).toBe(200);

    // Second request (may use cache)
    const secondRequest = new Request('http://localhost/api/color-intel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(colorData),
    });

    const secondResponse = await app.fetch(secondRequest, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(secondResponse.status).toBe(200);

    // Both should return valid data
    const firstData = await firstResponse.json();
    const secondData = await secondResponse.json();

    expect(firstData.name).toBeDefined();
    expect(secondData.name).toBeDefined();
  });
});
