/**
 * Tests for MCP Server functionality
 */

import type { Token } from '@rafters/shared';
import { beforeEach, describe, expect, it } from 'vitest';
import { RaftersDesignIntelligenceServer } from '../../src/mcp/server.js';

// Mock tokens for testing
const _mockTokens: Token[] = [
  {
    name: 'primary',
    value: { l: 0.7, c: 0.15, h: 220, alpha: 1 },
    category: 'color',
    namespace: 'brand',
    description: 'Primary brand color',
  },
  {
    name: 'secondary',
    value: { l: 0.6, c: 0.12, h: 160, alpha: 1 },
    category: 'color',
    namespace: 'brand',
    description: 'Secondary brand color',
  },
];

describe('RaftersDesignIntelligenceServer', () => {
  let server: RaftersDesignIntelligenceServer;

  beforeEach(() => {
    server = new RaftersDesignIntelligenceServer();
  });

  it('should be instantiable', () => {
    expect(server).toBeDefined();
  });

  it('should have proper server configuration', () => {
    expect(server).toHaveProperty('server');
  });
});

describe('Vector Intelligence Service', () => {
  it('should convert OKLCH to vector', async () => {
    const { VectorIntelligenceService } = await import(
      '../../src/mcp/services/vector-intelligence.js'
    );
    const service = new VectorIntelligenceService();
    const vector = service.colorToVector({ l: 0.7, c: 0.15, h: 220 });

    expect(vector).toBeDefined();
    expect(vector).toHaveLength(384);
    // Vector is normalized, so values won't match exactly
    expect(vector[0]).toBeGreaterThan(0);
    expect(vector[1]).toBeGreaterThan(0);
  });

  it('should calculate similarity between vectors', async () => {
    const { VectorIntelligenceService } = await import(
      '../../src/mcp/services/vector-intelligence.js'
    );
    const service = new VectorIntelligenceService();

    const vector1 = service.colorToVector({ l: 0.7, c: 0.15, h: 220 });
    const vector2 = service.colorToVector({ l: 0.6, c: 0.12, h: 180 });

    const similarity = service.calculateSimilarity(vector1, vector2, 'euclidean');

    expect(similarity).toBeGreaterThan(0);
    expect(similarity).toBeLessThanOrEqual(1);
  });
});

describe('Context Intelligence Service', () => {
  it('should analyze component context', async () => {
    const { ContextIntelligenceService } = await import(
      '../../src/mcp/services/context-intelligence.js'
    );
    const service = new ContextIntelligenceService();

    const intelligence = {
      cognitiveLoad: 3,
      attentionHierarchy: 'primary',
      accessibilityRules: 'WCAG 2.1 AA',
      usageContext: 'Primary actions',
    };

    const analysis = service.analyzeComponentContext(intelligence);

    expect(analysis).toBeDefined();
    expect(analysis.contextualFit).toBeGreaterThan(0);
    expect(analysis.recommendations).toBeDefined();
    expect(Array.isArray(analysis.recommendations)).toBe(true);
  });

  it('should predict token usage', async () => {
    const { ContextIntelligenceService } = await import(
      '../../src/mcp/services/context-intelligence.js'
    );
    const service = new ContextIntelligenceService();

    const token: Token = {
      name: 'primary',
      value: 'blue',
      category: 'color',
      namespace: 'brand',
      description: 'Primary color',
    };

    const prediction = service.predictTokenUsage(token);

    expect(prediction).toBeDefined();
    expect(['low', 'medium', 'high']).toContain(prediction.usageFrequency);
    expect(Array.isArray(prediction.seasonality)).toBe(true);
  });
});

describe('Prediction Intelligence Service', () => {
  it('should predict token evolution', async () => {
    const { PredictionIntelligenceService } = await import(
      '../../src/mcp/services/prediction-intelligence.js'
    );
    const service = new PredictionIntelligenceService();

    const token: Token = {
      name: 'primary',
      value: 'blue',
      category: 'color',
      namespace: 'brand',
      description: 'Primary color',
    };

    const evolution = service.predictTokenEvolution(token);

    expect(evolution).toBeDefined();
    expect(evolution.currentState).toBeDefined();
    expect(Array.isArray(evolution.predictedStates)).toBe(true);
    expect(evolution.predictedStates.length).toBeGreaterThan(0);
  });

  it('should predict composition success', async () => {
    const { PredictionIntelligenceService } = await import(
      '../../src/mcp/services/prediction-intelligence.js'
    );
    const service = new PredictionIntelligenceService();

    const components = ['Button', 'Input', 'Card'];
    const prediction = service.predictCompositionSuccess(components);

    expect(prediction).toBeDefined();
    expect(prediction.prediction).toBeDefined();
    expect(prediction.confidence).toBeGreaterThan(0);
    expect(prediction.confidence).toBeLessThanOrEqual(1);
  });

  it('should analyze trend impact', async () => {
    const { PredictionIntelligenceService } = await import(
      '../../src/mcp/services/prediction-intelligence.js'
    );
    const service = new PredictionIntelligenceService();

    const tokens: Token[] = [
      {
        name: 'primary',
        value: 'blue',
        category: 'color',
        namespace: 'brand',
        description: 'Primary color',
      },
    ];

    const analysis = service.analyzeTrendImpact(tokens);

    expect(analysis).toBeDefined();
    expect(analysis.trendsAlignment).toBeDefined();
    expect(analysis.futureViability).toBeGreaterThan(0);
    expect(Array.isArray(analysis.adaptationRecommendations)).toBe(true);
  });
});
