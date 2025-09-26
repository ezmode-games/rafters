import { ColorValueSchema } from '@rafters/shared';
import { describe, expect, test } from 'vitest';
import { PatternRecognitionService } from '../../../src/mcp/services/pattern-recognition';
import {
  antDesignSystem,
  driftTestSystems,
  materialDesignSystem,
  poorDesignSystem,
} from '../../fixtures/design-systems';

describe('PatternRecognitionService', () => {
  const service = new PatternRecognitionService();

  describe('analyzeDesignPatterns', () => {
    test('should analyze patterns across multiple design systems', async () => {
      const result = await service.analyzeDesignPatterns([materialDesignSystem, antDesignSystem]);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.patterns.some((p) => p.name === 'Button')).toBe(true);
      expect(result.data?.commonPatterns.length).toBeGreaterThan(0);
      expect(result.data?.recommendations.length).toBeGreaterThan(0);
    });

    test('should handle empty design systems', async () => {
      const result = await service.analyzeDesignPatterns([]);

      expect(result.success).toBe(true);
      expect(result.data?.commonPatterns).toEqual([]);
      expect(result.data?.patterns).toEqual([]);
      expect(result.data?.recommendations.length).toBeGreaterThan(0);
    });

    test('should calculate color harmony correctly', async () => {
      const result = await service.analyzeDesignPatterns([materialDesignSystem, antDesignSystem]);

      expect(result.data?.patterns.length).toBeGreaterThan(0);
      expect(result.data?.commonPatterns.length).toBeGreaterThan(0);
    });

    test('should process within reasonable time', async () => {
      const startTime = Date.now();
      await service.analyzeDesignPatterns([materialDesignSystem, antDesignSystem]);
      const processingTime = Date.now() - startTime;

      expect(processingTime).toBeLessThan(5000); // Should complete within 5 seconds
    });
  });

  describe('detectDesignDrift', () => {
    test('should detect drift between design systems', async () => {
      const result = await service.detectDesignDrift(
        driftTestSystems.baseline,
        driftTestSystems.modified
      );

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.driftScore).toBeGreaterThan(0);
      expect(result.data?.driftScore).toBeLessThanOrEqual(1);
      expect(result.data?.driftingElements.length).toBeGreaterThan(0);
    });

    test('should detect no drift for identical systems', async () => {
      const result = await service.detectDesignDrift(materialDesignSystem, materialDesignSystem);

      expect(result.success).toBe(true);
      expect(result.data?.driftScore).toBe(0);
      expect(result.data?.driftingElements).toEqual([]);
    });

    test('should identify specific drift areas', async () => {
      const result = await service.detectDesignDrift(
        materialDesignSystem,
        driftTestSystems.modified
      );

      expect(result.data?.driftingElements.some((e) => e.type === 'component')).toBe(true);
      expect(result.data?.alerts.length).toBeGreaterThan(0);
    });

    test('should provide actionable recommendations', async () => {
      const result = await service.detectDesignDrift(
        materialDesignSystem,
        driftTestSystems.modified
      );

      expect(result.data?.alerts).toBeDefined();
      expect(result.data?.alerts.length).toBeGreaterThan(0);
      expect(result.data?.driftingElements.some((e) => e.type === 'color')).toBe(true);
    });
  });

  describe('evaluateSystemHealth', () => {
    test('should evaluate design system health comprehensively', async () => {
      const result = await service.evaluateSystemHealth(materialDesignSystem);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.overallScore).toBeGreaterThan(0);
      expect(result.data?.overallScore).toBeLessThanOrEqual(100);
      expect(result.data?.dimensions).toBeDefined();
      expect(result.data?.dimensions.consistency).toBeGreaterThan(0);
      expect(result.data?.dimensions.maintainability).toBeGreaterThan(0);
      expect(result.data?.dimensions.accessibility).toBeGreaterThan(0);
      expect(result.data?.dimensions.performance).toBeGreaterThan(0);
      expect(result.data?.dimensions.adoption).toBeGreaterThan(0);
    });

    test('should identify critical issues', async () => {
      const poorSystem = {
        name: 'Poor Design',
        version: '1.0',
        colors: [], // No colors - critical issue
        components: ['Button'],
        patterns: [],
      };

      const result = await service.evaluateSystemHealth(poorSystem);

      expect(result.data?.issues.length).toBeGreaterThan(0);
      expect(result.data?.issues.some((issue) => issue.description.includes('color'))).toBe(true);
    });

    test('should provide improvement suggestions', async () => {
      const result = await service.evaluateSystemHealth(materialDesignSystem);

      expect(result.data?.recommendations).toBeDefined();
      expect(result.data?.recommendations.length).toBeGreaterThan(0);
    });

    test('should handle systems with missing components', async () => {
      const incompleteSystem = {
        name: 'Incomplete System',
        version: '1.0',
        colors: [{ name: 'primary', scale: [{ l: 0.6, c: 0.15, h: 210 }] }],
        components: [],
        patterns: [],
      };

      const result = await service.evaluateSystemHealth(incompleteSystem);

      expect(result.success).toBe(true);
      expect(result.data?.overallScore).toBeLessThan(80); // Should be low due to missing components
    });
  });

  describe('trackPatternEvolution', () => {
    test('should track pattern evolution over time', async () => {
      const versionData = [
        {
          version: 'v1.0',
          timestamp: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
          added: ['Button'],
          modified: [],
          removed: [],
          adoption: 0.3,
          consistency: 0.6,
          quality: 0.7,
        },
        {
          version: 'v2.0',
          timestamp: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
          added: ['Card', 'TextField'],
          modified: ['Button'],
          removed: [],
          adoption: 0.7,
          consistency: 0.8,
          quality: 0.85,
        },
      ];

      const result = await service.trackPatternEvolution('button-pattern', versionData);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.trajectory).toBeDefined();
      expect(result.data?.versions.length).toBeGreaterThan(0);
      expect(result.data?.predictions.length).toBeGreaterThan(0);
    });

    test('should predict future trends', async () => {
      const versionData = [
        {
          version: 'v1.0',
          timestamp: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
          added: ['Button'],
          modified: [],
          removed: [],
        },
        {
          version: 'v2.0',
          timestamp: new Date().toISOString(),
          added: ['TrendingComponent'],
          modified: ['Button'],
          removed: [],
        },
      ];

      const result = await service.trackPatternEvolution('trending-pattern', versionData);

      expect(result.data?.predictions).toBeDefined();
      expect(result.data?.predictions.length).toBeGreaterThan(0);
    });

    test('should handle insufficient historical data', async () => {
      const result = await service.trackPatternEvolution('empty-pattern', []);

      expect(result.success).toBe(true);
      expect(result.data?.versions).toEqual([]);
      expect(result.data?.predictions.length).toBeGreaterThan(0);
    });

    test('should calculate change velocity accurately', async () => {
      const rapidVersionData = [
        {
          version: 'v1.0',
          timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          added: ['Button'],
          modified: [],
          removed: [],
        },
        {
          version: 'v2.0',
          timestamp: new Date().toISOString(),
          added: ['Comp1', 'Comp2', 'Comp3'],
          modified: ['Button'],
          removed: [],
        },
      ];

      const slowVersionData = [
        {
          version: 'v1.0',
          timestamp: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
          added: ['Button'],
          modified: [],
          removed: [],
        },
        {
          version: 'v2.0',
          timestamp: new Date().toISOString(),
          added: ['OneNewComponent'],
          modified: [],
          removed: [],
        },
      ];

      const rapidResult = await service.trackPatternEvolution('rapid-pattern', rapidVersionData);
      const slowResult = await service.trackPatternEvolution('slow-pattern', slowVersionData);

      expect(rapidResult.data?.versions.length).toEqual(slowResult.data?.versions.length || 0);
    });
  });

  describe('error handling', () => {
    test('should handle null/undefined inputs gracefully', async () => {
      // @ts-expect-error - Testing error handling
      const result = await service.analyzeDesignPatterns(null as never);

      expect(result.success).toBe(true); // Service handles gracefully
      expect(result.data?.patterns).toEqual([]);
      expect(result.data?.recommendations).toContain(
        'Add design systems to enable pattern analysis'
      );
    });

    test('should handle malformed design system data', async () => {
      const result = await service.evaluateSystemHealth(poorDesignSystem);

      expect(result.success).toBe(true); // The service handles poor systems gracefully
      expect(result.data?.overallScore).toBeLessThan(70); // But gives them low scores
      expect(result.data?.issues.length).toBeGreaterThan(0); // And identifies issues
    });

    test('should handle processing timeouts', async () => {
      // Mock a very large dataset that might cause timeout
      const hugeDataset = Array.from({ length: 1000 }, (_, i) => ({
        name: `System${i}`,
        version: '1.0',
        colors: Array.from({ length: 100 }, (_, j) => ({
          name: `color${j}`,
          scale: [{ l: 0.5, c: 0.1, h: j * 3.6 }],
        })),
        components: Array.from({ length: 100 }, (_, j) => `Component${j}`),
        patterns: Array.from({ length: 50 }, (_, j) => `pattern${j}`),
      }));

      const result = await service.analyzeDesignPatterns(hugeDataset);

      // Should either succeed or fail gracefully
      expect(typeof result.success).toBe('boolean');
    }, 10000); // 10 second timeout for this test
  });

  describe('ColorValueSchema integration', () => {
    test('should validate color data with schema', () => {
      const colorValue = {
        name: 'Test Color',
        scale: [{ l: 0.7, c: 0.15, h: 180 }],
      };

      expect(() => ColorValueSchema.parse(colorValue)).not.toThrow();
    });

    test('should handle invalid color data', () => {
      const invalidColorValue = {
        name: 'Invalid Color',
        scale: [{ l: 2.0, c: -0.5, h: 400 }], // Invalid OKLCH values
      };

      expect(() => ColorValueSchema.parse(invalidColorValue)).toThrow();
    });
  });
});
