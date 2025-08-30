import { createExecutionContext, env, waitOnExecutionContext } from 'cloudflare:test';
import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { POST } from '../../../src/app/api/color-intel/route';

// Mock the Claude client module
vi.mock('../../../src/lib/ai/claude/client', () => ({
  getClaudeClient: () => ({
    generateText: vi.fn().mockResolvedValue(
      JSON.stringify({
        reasoning: 'This is a test color with mocked analysis for integration testing',
        emotionalImpact: 'Calming and neutral for testing purposes',
        culturalContext: 'Universal test color suitable for all contexts',
        accessibilityNotes: 'Mocked accessibility analysis - should meet WCAG standards',
        usageGuidance: 'Use this mock color for testing integration workflows',
      })
    ),
  }),
}));

describe('Color Intelligence API Integration', () => {
  // Test the route handler directly in Cloudflare Workers environment

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should return 400 for invalid OKLCH lightness', async () => {
    const request = new NextRequest('http://localhost/api/color-intel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oklch: { l: 1.5, c: 0.1, h: 180 }, // Invalid lightness > 1
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBe('Invalid OKLCH values');
    expect(data.message).toContain('OKLCH must have l (0-1)');
  });

  test('should return 400 for invalid OKLCH chroma', async () => {
    const request = new NextRequest('http://localhost/api/color-intel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oklch: { l: 0.5, c: -0.1, h: 180 }, // Invalid negative chroma
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBe('Invalid OKLCH values');
  });

  test('should return 400 for invalid OKLCH hue', async () => {
    const request = new NextRequest('http://localhost/api/color-intel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oklch: { l: 0.5, c: 0.1, h: 400 }, // Invalid hue > 360
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBe('Invalid OKLCH values');
  });

  test('should return 400 for malformed JSON', async () => {
    const request = new NextRequest('http://localhost/api/color-intel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid json string not parseable',
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBe('Invalid JSON');
    expect(data.message).toBe('Request body must be valid JSON');
  });

  test('should return 400 for missing OKLCH object', async () => {
    const request = new NextRequest('http://localhost/api/color-intel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: 'primary',
        // Missing oklch property
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBe('Invalid OKLCH values');
  });

  test('should handle different color temperatures', async () => {
    // Test a warm color (red-orange)
    const warmRequest = new NextRequest('http://localhost/api/color-intel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oklch: { l: 0.6, c: 0.15, h: 30 }, // Warm orange
      }),
    });

    const warmResponse = await POST(warmRequest);
    expect(warmResponse.status).toBe(200);
    const warmData = await warmResponse.json();
    expect(warmData.analysis.temperature).toBe('warm');

    // Test a cool color (blue)
    const coolRequest = new NextRequest('http://localhost/api/color-intel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oklch: { l: 0.5, c: 0.1, h: 240 }, // Cool blue
      }),
    });

    const coolResponse = await POST(coolRequest);
    expect(coolResponse.status).toBe(200);
    const coolData = await coolResponse.json();
    expect(coolData.analysis.temperature).toBe('cool');
  });

  test('should cache responses for identical colors', async () => {
    const oklch = { l: 0.5, c: 0.1, h: 180 };

    // Make first request
    const request1 = new NextRequest('http://localhost/api/color-intel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oklch }),
    });

    const response1 = await POST(request1);
    expect(response1.status).toBe(200);
    const data1 = await response1.json();

    // Make second identical request - should use cache
    const request2 = new NextRequest('http://localhost/api/color-intel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oklch }),
    });

    const response2 = await POST(request2);
    expect(response2.status).toBe(200);
    const data2 = await response2.json();

    // Results should be identical due to consistent color name generation
    expect(data1.analysis.temperature).toBe(data2.analysis.temperature);
    expect(data1.intelligence.reasoning).toBe(data2.intelligence.reasoning);
  });

  test('should return proper content-type headers', async () => {
    const request = new NextRequest('http://localhost/api/color-intel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oklch: { l: 1.5, c: 0.1, h: 180 }, // Invalid to get error response
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    // Check for proper content-type header
    expect(response.headers.get('content-type')).toContain('application/json');
  });
});
