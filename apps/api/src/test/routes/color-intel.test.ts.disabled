import { env } from 'cloudflare:test';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import app from '../index';

// Mock the Claude client to avoid real API calls
vi.mock('../lib/ai/claude/client', () => ({
  getClaudeClient: () => ({
    generateText: vi.fn().mockResolvedValue(
      JSON.stringify({
        reasoning: 'Mock color intelligence for testing',
        emotionalImpact: 'Mock emotional impact',
        culturalContext: 'Mock cultural context',
        accessibilityNotes: 'Mock accessibility notes',
        usageGuidance: 'Mock usage guidance',
      })
    ),
  }),
}));

describe('Color Intelligence API', () => {
  const testColor = {
    oklch: { l: 0.5, c: 0.1, h: 180 },
  };

  beforeEach(async () => {
    // Clear any cached data before each test
    const cacheKey = `color-intel:${testColor.oklch.l.toFixed(3)}-${testColor.oklch.c.toFixed(3)}-${testColor.oklch.h.toFixed(1)}`;
    if (env.RAFTERS_INTEL) {
      await env.RAFTERS_INTEL.delete(cacheKey);
    }
  });

  it('Should validate OKLCH input', async () => {
    const invalidColor = {
      oklch: { l: 2, c: -1, h: 400 }, // Invalid values
    };

    const res = await app.request(
      '/api/color-intel',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidColor),
      },
      env
    );

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid OKLCH values');
  });

  it('Should generate color intelligence with proper structure', async () => {
    const res = await app.request(
      '/api/color-intel',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testColor),
      },
      env
    );

    expect(res.status).toBe(200);

    const data = await res.json();

    // Validate response structure
    expect(data).toHaveProperty('intelligence');
    expect(data).toHaveProperty('harmonies');
    expect(data).toHaveProperty('accessibility');
    expect(data).toHaveProperty('analysis');

    // Validate intelligence structure
    expect(data.intelligence).toHaveProperty('reasoning');
    expect(data.intelligence).toHaveProperty('emotionalImpact');
    expect(data.intelligence).toHaveProperty('culturalContext');
    expect(data.intelligence).toHaveProperty('accessibilityNotes');
    expect(data.intelligence).toHaveProperty('usageGuidance');

    // Validate harmonies
    expect(data.harmonies).toHaveProperty('complementary');
    expect(data.harmonies).toHaveProperty('triadic');
    expect(data.harmonies).toHaveProperty('analogous');

    // Validate accessibility
    expect(data.accessibility).toHaveProperty('onWhite');
    expect(data.accessibility).toHaveProperty('onBlack');
    expect(data.accessibility.onWhite).toHaveProperty('contrastRatio');
  });

  it('Should use KV cache for repeated requests', async () => {
    // First request - should generate and cache
    const res1 = await app.request(
      '/api/color-intel',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testColor),
      },
      env
    );

    expect(res1.status).toBe(200);
    const data1 = await res1.json();

    // Second request - should use cache
    const res2 = await app.request(
      '/api/color-intel',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testColor),
      },
      env
    );

    expect(res2.status).toBe(200);
    const data2 = await res2.json();

    // Should return identical data from cache
    expect(data1).toEqual(data2);
  });

  it('Should handle invalid JSON', async () => {
    const res = await app.request(
      '/api/color-intel',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json',
      },
      env
    );

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid JSON');
  });
});
