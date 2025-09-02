import type { OKLCH } from '@rafters/shared';
import { testClient } from 'hono/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { colorIntel } from '../../routes/color-intel';
import {
  generateTestColorIntelligence,
  mockColorIntelligence,
} from '../helpers/color-intelligence-mock';

// Mock the color intelligence generation
vi.mock('../../lib/color-intel/utils', () => ({
  generateColorIntelligence: vi.fn(),
  calculateColorData: vi.fn((oklch: OKLCH) => ({
    harmonies: {
      complementary: { l: oklch.l, c: oklch.c, h: (oklch.h + 180) % 360 },
      triadic: [
        { l: oklch.l, c: oklch.c, h: (oklch.h + 120) % 360 },
        { l: oklch.l, c: oklch.c, h: (oklch.h + 240) % 360 },
      ],
      analogous: [
        { l: oklch.l, c: oklch.c, h: (oklch.h + 30) % 360 },
        { l: oklch.l, c: oklch.c, h: (oklch.h - 30 + 360) % 360 },
      ],
      tetradic: [
        { l: oklch.l, c: oklch.c, h: (oklch.h + 90) % 360 },
        { l: oklch.l, c: oklch.c, h: (oklch.h + 180) % 360 },
        { l: oklch.l, c: oklch.c, h: (oklch.h + 270) % 360 },
      ],
      monochromatic: [
        { l: Math.max(0, oklch.l - 0.2), c: oklch.c, h: oklch.h },
        { l: Math.max(0, oklch.l - 0.1), c: oklch.c, h: oklch.h },
        { l: Math.min(1, oklch.l + 0.1), c: oklch.c, h: oklch.h },
        { l: Math.min(1, oklch.l + 0.2), c: oklch.c, h: oklch.h },
      ],
    },
    accessibility: {
      onWhite: {
        wcagAA: oklch.l <= 0.6,
        wcagAAA: oklch.l < 0.4,
        contrastRatio: oklch.l <= 0.6 ? 4.5 : 2.1,
      },
      onBlack: {
        wcagAA: oklch.l > 0.4,
        wcagAAA: oklch.l > 0.6,
        contrastRatio: oklch.l > 0.5 ? 4.5 : 2.1,
      },
    },
    analysis: {
      temperature:
        (oklch.h >= 0 && oklch.h <= 60) || (oklch.h >= 300 && oklch.h <= 360)
          ? 'warm'
          : oklch.h >= 180 && oklch.h <= 270
            ? 'cool'
            : 'neutral',
      isLight: oklch.l > 0.6,
      name: `Test Color ${Math.round(oklch.h)}°`,
    },
  })),
}));

describe('Color Intelligence API', () => {
  const client = testClient(colorIntel, {
    RAFTERS_INTEL: {
      get: vi.fn(),
      put: vi.fn(),
    } as unknown as KVNamespace,
    CLAUDE_API_KEY: 'test-api-key',
    CLAUDE_GATEWAY_URL: 'https://gateway.ai.cloudflare.com/v1/test/test/anthropic',
  });

  beforeEach(async () => {
    vi.clearAllMocks();

    // Mock generateColorIntelligence to use fixtures or generate test data
    const { generateColorIntelligence } = vi.mocked(await import('../../lib/color-intel/utils'));
    generateColorIntelligence.mockImplementation(async (oklch: OKLCH) => {
      const mockResponse = mockColorIntelligence(oklch);
      if (mockResponse) {
        return mockResponse.intelligence;
      }
      return generateTestColorIntelligence(oklch).intelligence;
    });
  });

  it('should generate intelligence for ocean-depths blue', async () => {
    const response = await client.index.$post({
      json: {
        oklch: { l: 0.5, c: 0.1, h: 240 },
        token: 'primary',
        name: 'test-blue',
      },
    });

    expect(response.status).toBe(200);
    const data = await response.json();

    expect(data).toHaveProperty('intelligence');
    expect(data).toHaveProperty('harmonies');
    expect(data).toHaveProperty('accessibility');
    expect(data).toHaveProperty('analysis');

    expect(data.intelligence.suggestedName).toBe('ocean-depths');
    expect(data.intelligence).toHaveProperty('reasoning');
    expect(data.intelligence).toHaveProperty('emotionalImpact');
    expect(data.intelligence).toHaveProperty('culturalContext');
    expect(data.intelligence).toHaveProperty('accessibilityNotes');
    expect(data.intelligence).toHaveProperty('usageGuidance');
  });

  it('should generate intelligence for warm-cream', async () => {
    const response = await client.index.$post({
      json: {
        oklch: { l: 0.8, c: 0.05, h: 30 },
      },
    });

    expect(response.status).toBe(200);
    const data = await response.json();

    expect(data.intelligence.suggestedName).toBe('warm-cream');
    expect(data.analysis.temperature).toBe('warm');
    expect(data.analysis.isLight).toBe(true);
  });

  it('should generate intelligence for sunset-coral', async () => {
    const response = await client.index.$post({
      json: {
        oklch: { l: 0.6, c: 0.2, h: 15 },
      },
    });

    expect(response.status).toBe(200);
    const data = await response.json();

    expect(data.intelligence.suggestedName).toBe('sunset-coral');
    expect(data.analysis.temperature).toBe('warm');
    expect(data.accessibility.onWhite.wcagAA).toBe(true);
  });

  it('should handle colors not in fixtures', async () => {
    const response = await client.index.$post({
      json: {
        oklch: { l: 0.3, c: 0.15, h: 120 },
      },
    });

    expect(response.status).toBe(200);
    const data = await response.json();

    expect(data.intelligence.suggestedName).toContain('test-color');
    expect(data.analysis.temperature).toBe('neutral');
  });

  it('should validate OKLCH input', async () => {
    const response = await client.index.$post({
      json: {
        oklch: { l: 2.0, c: -0.1, h: 400 },
      },
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Invalid OKLCH values');
  });
});
