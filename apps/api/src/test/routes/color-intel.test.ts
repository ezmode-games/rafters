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
}));

describe('Color Intelligence API', () => {
  const mockVectorize = {
    getByIds: vi.fn(),
    upsert: vi.fn(),
  };

  const client = testClient(colorIntel, {
    VECTORIZE: mockVectorize as unknown as VectorizeIndex,
    CLAUDE_API_KEY: 'test-api-key',
    CLAUDE_GATEWAY_URL: 'https://gateway.ai.cloudflare.com/v1/test/test/anthropic',
    CF_TOKEN: 'test-cf-token',
  });

  beforeEach(async () => {
    vi.clearAllMocks();

    // Mock Vectorize to return empty results by default (no cache)
    mockVectorize.getByIds.mockResolvedValue([]);
    mockVectorize.upsert.mockResolvedValue(undefined);

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
    expect(data).toHaveProperty('scale');
    expect(data.scale).toHaveLength(11); // New contrast-aware scale

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
    expect(data).toHaveProperty('scale');
    expect(data.scale).toHaveLength(11);
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
    expect(data.accessibility.onWhite).toBeDefined();
    expect(data).toHaveProperty('scale');
    expect(data.scale).toHaveLength(11);
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
    expect(data.analysis.temperature).toBe('cool'); // h=120 is green, which is cool
    expect(data).toHaveProperty('scale');
    expect(data.scale).toHaveLength(11);
  });

  it('should validate OKLCH input', async () => {
    const response = await client.index.$post({
      json: {
        oklch: { l: 2.0, c: -0.1, h: 400 },
      },
    });

    expect(response.status).toBe(400);
    // Just verify it returns a 400 error - the error structure can vary
  });

  it('should return cached data when available', async () => {
    const cachedData = {
      intelligence: { suggestedName: 'cached-color' },
      scale: [{ l: 0.5, c: 0.1, h: 200 }],
      harmonies: {},
      accessibility: {},
      analysis: {},
    };

    // Mock cached data exists
    mockVectorize.getByIds.mockResolvedValue([
      {
        id: 'oklch-0.50-0.10-200',
        metadata: {
          complete_color_value: JSON.stringify(cachedData),
        },
      },
    ]);

    const response = await client.index.$post({
      json: {
        oklch: { l: 0.5, c: 0.1, h: 200 },
      },
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.intelligence.suggestedName).toBe('cached-color');

    // Should not have called generateColorIntelligence
    const { generateColorIntelligence } = vi.mocked(await import('../../lib/color-intel/utils'));
    expect(generateColorIntelligence).not.toHaveBeenCalled();
  });

  it('should ignore cache and reuse existing AI intelligence when expire=true', async () => {
    const cachedData = {
      intelligence: {
        suggestedName: 'existing-ai-name',
        reasoning: 'existing reasoning',
        emotionalImpact: 'existing impact',
        culturalContext: 'existing context',
        accessibilityNotes: 'existing notes',
        usageGuidance: 'existing guidance',
      },
      scale: [{ l: 0.8, c: 0.1, h: 200 }], // Old scale
      harmonies: {},
      accessibility: {},
      analysis: {},
    };

    // Mock cached data exists
    mockVectorize.getByIds.mockResolvedValue([
      {
        id: 'oklch-0.50-0.10-200',
        metadata: {
          complete_color_value: JSON.stringify(cachedData),
        },
      },
    ]);

    const response = await client.index.$post({
      json: {
        oklch: { l: 0.5, c: 0.1, h: 200 },
        expire: true,
      },
    });

    expect(response.status).toBe(200);
    const data = await response.json();

    // Should reuse existing AI intelligence
    expect(data.intelligence.suggestedName).toBe('existing-ai-name');
    expect(data.intelligence.reasoning).toBe('existing reasoning');

    // Should have fresh mathematical data (new scale)
    expect(data.scale).toBeDefined();
    expect(data.scale.length).toBe(11); // Full contrast-aware scale

    // Should not have called generateColorIntelligence (reused existing)
    const { generateColorIntelligence } = vi.mocked(await import('../../lib/color-intel/utils'));
    expect(generateColorIntelligence).not.toHaveBeenCalled();

    // Should have updated the cache
    expect(mockVectorize.upsert).toHaveBeenCalled();
  });

  it('should generate new AI intelligence when expire=true but no existing intelligence', async () => {
    // Mock no cached data
    mockVectorize.getByIds.mockResolvedValue([]);

    const response = await client.index.$post({
      json: {
        oklch: { l: 0.5, c: 0.1, h: 200 },
        expire: true,
      },
    });

    expect(response.status).toBe(200);
    const data = await response.json();

    // Should have generated new AI intelligence
    expect(data.intelligence).toBeDefined();

    // Should have called generateColorIntelligence
    const { generateColorIntelligence } = vi.mocked(await import('../../lib/color-intel/utils'));
    expect(generateColorIntelligence).toHaveBeenCalledWith(
      { l: 0.5, c: 0.1, h: 200 },
      { token: undefined, name: undefined },
      'test-api-key',
      'https://gateway.ai.cloudflare.com/v1/test/test/anthropic',
      'test-cf-token'
    );
  });
});
