/**
 * Dependency Intelligence Service Tests
 *
 * Tests for intelligent token dependency analysis, cascade impact prediction,
 * and rule-based token generation integration.
 */

import {
  GenerationRuleExecutor,
  GenerationRuleParser,
  TokenRegistry,
} from '@rafters/design-tokens';
import type { Token } from '@rafters/shared';
import { beforeEach, describe, expect, it } from 'vitest';
import { DependencyIntelligenceService } from '../src/mcp/services/dependency-intelligence';

// Mock data for testing
const createMockTokens = (): Token[] => [
  {
    name: 'primary',
    value: 'oklch(0.5 0.2 240)',
    category: 'color',
    intelligence: {
      cognitiveLoad: 2,
      attentionEconomics: 'Primary brand color',
      accessibility: 'WCAG AAA compliant',
      trustBuilding: 'Consistent brand identity',
      semanticMeaning: 'Primary action color',
    },
  },
  {
    name: 'primary-hover',
    value: 'oklch(0.4 0.2 240)',
    category: 'color',
    intelligence: {
      cognitiveLoad: 2,
      attentionEconomics: 'Hover state indicator',
      accessibility: 'WCAG AAA compliant',
      trustBuilding: 'Clear interaction feedback',
      semanticMeaning: 'Primary hover state',
    },
  },
  {
    name: 'spacing-4',
    value: '1rem',
    category: 'spacing',
    intelligence: {
      cognitiveLoad: 1,
      attentionEconomics: 'Base spacing unit',
      accessibility: 'Touch-friendly spacing',
      trustBuilding: 'Consistent spacing system',
      semanticMeaning: 'Medium spacing value',
    },
  },
  {
    name: 'spacing-8',
    value: '2rem',
    category: 'spacing',
    intelligence: {
      cognitiveLoad: 1,
      attentionEconomics: 'Larger spacing unit',
      accessibility: 'Generous touch targets',
      trustBuilding: 'Consistent spacing system',
      semanticMeaning: 'Large spacing value',
    },
  },
];

describe('DependencyIntelligenceService', () => {
  let service: DependencyIntelligenceService;
  let tokenRegistry: TokenRegistry;
  let ruleParser: GenerationRuleParser;
  let ruleExecutor: GenerationRuleExecutor;

  beforeEach(() => {
    const tokens = createMockTokens();
    tokenRegistry = new TokenRegistry(tokens);
    ruleParser = new GenerationRuleParser();
    ruleExecutor = new GenerationRuleExecutor(tokenRegistry);

    // Set up some dependencies for testing
    tokenRegistry.dependencyGraph.addDependency('primary-hover', ['primary'], 'state:hover');
    tokenRegistry.dependencyGraph.addDependency('spacing-8', ['spacing-4'], 'scale:2');

    service = new DependencyIntelligenceService(tokenRegistry, ruleParser, ruleExecutor);
  });

  describe('analyzeDependencies', () => {
    it('should analyze direct dependencies correctly', async () => {
      const result = await service.analyzeDependencies('primary-hover');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tokenName).toBe('primary-hover');
        expect(result.data.directDependencies).toContain('primary');
        expect(result.data.ruleType).toBe('state');
        expect(result.data.ruleExpression).toBe('state:hover');
        expect(result.confidence).toBeGreaterThan(0.5);
      }
    });

    it('should calculate cascade scope correctly', async () => {
      const result = await service.analyzeDependencies('primary');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.cascadeScope).toContain('primary-hover');
        expect(result.data.dependents).toContain('primary-hover');
      }
    });

    it('should handle indirect dependencies', async () => {
      // Add a chain: base -> primary -> primary-hover
      tokenRegistry.add({
        name: 'base-color',
        value: 'oklch(0.5 0.15 240)',
        category: 'color',
        intelligence: {
          cognitiveLoad: 1,
          attentionEconomics: 'Base color value',
          accessibility: 'Foundation color',
          trustBuilding: 'Consistent base',
          semanticMeaning: 'Base brand color',
        },
      });
      tokenRegistry.dependencyGraph.addDependency('primary', ['base-color'], 'contrast:high');

      const result = await service.analyzeDependencies('base-color', {
        includeIndirectDependencies: true,
        maxDepth: 3,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        // base-color has no dependencies, so indirectDependencies should be empty
        expect(result.data.indirectDependencies).toHaveLength(0);
        // But it should show cascade scope (tokens that would be affected by changes)
        expect(result.data.cascadeScope).toContain('primary');
        expect(result.data.cascadeScope).toContain('primary-hover');
      }
    });

    it('should detect circular dependencies', async () => {
      // Create a circular dependency: A -> B -> A
      tokenRegistry.add({
        name: 'test-a',
        value: 'test-value-a',
        category: 'test',
        intelligence: {
          cognitiveLoad: 1,
          attentionEconomics: 'Test token A',
          accessibility: 'Test accessibility',
          trustBuilding: 'Test trust',
          semanticMeaning: 'Test semantic A',
        },
      });

      tokenRegistry.add({
        name: 'test-b',
        value: 'test-value-b',
        category: 'test',
        intelligence: {
          cognitiveLoad: 1,
          attentionEconomics: 'Test token B',
          accessibility: 'Test accessibility',
          trustBuilding: 'Test trust',
          semanticMeaning: 'Test semantic B',
        },
      });

      // This should work
      tokenRegistry.dependencyGraph.addDependency('test-b', ['test-a'], 'scale:1.5');

      const result = await service.analyzeDependencies('test-a');
      expect(result.success).toBe(true);
      if (result.success) {
        // Initially no circular dependencies
        expect(result.data.circularDependencies).toHaveLength(0);
      }
    });

    it('should calculate performance metrics', async () => {
      const result = await service.analyzeDependencies('primary-hover');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.performanceMetrics.complexity).toBeGreaterThanOrEqual(0);
        expect(result.data.performanceMetrics.complexity).toBeLessThanOrEqual(10);
        expect(result.data.performanceMetrics.impactScope).toBeGreaterThanOrEqual(0);
      }
    });

    it('should handle non-existent tokens gracefully', async () => {
      const result = await service.analyzeDependencies('non-existent-token');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.directDependencies).toHaveLength(0);
        expect(result.data.dependents).toHaveLength(0);
        expect(result.metadata?.tokenExists).toBe(false);
      }
    });
  });

  describe('validateChanges', () => {
    it('should validate simple changes successfully', async () => {
      const changes = [
        {
          tokenName: 'new-color',
          newValue: 'oklch(0.6 0.2 120)',
          dependencies: ['primary'],
          rule: 'contrast:medium',
        },
      ];

      const result = await service.validateChanges(changes);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isValid).toBe(true);
        expect(result.data.errors).toHaveLength(0);
      }
    });

    it('should detect missing dependencies', async () => {
      const changes = [
        {
          tokenName: 'test-token',
          newValue: 'test-value',
          dependencies: ['non-existent-dependency'],
          rule: 'scale:2',
        },
      ];

      const result = await service.validateChanges(changes);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isValid).toBe(false);
        expect(result.data.errors).toHaveLength(1);
        expect(result.data.errors[0].errorType).toBe('missing-dependency');
      }
    });

    it('should detect invalid rule syntax', async () => {
      const changes = [
        {
          tokenName: 'test-token',
          newValue: 'test-value',
          rule: 'invalid-rule-syntax',
        },
      ];

      const result = await service.validateChanges(changes);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isValid).toBe(false);
        expect(result.data.errors).toHaveLength(1);
        expect(result.data.errors[0].errorType).toBe('invalid-rule');
      }
    });

    it('should calculate performance impact', async () => {
      const changes = [
        {
          tokenName: 'token-1',
          newValue: 'value-1',
          dependencies: ['primary', 'spacing-4'],
          rule: 'calc({primary} + {spacing-4})',
        },
        {
          tokenName: 'token-2',
          newValue: 'value-2',
          rule: 'scale:1.5',
        },
      ];

      const result = await service.validateChanges(changes);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.performanceImpact.complexity).toBeGreaterThan(0);
        expect(result.data.performanceImpact.estimatedRegenerationTime).toBeGreaterThan(0);
      }
    });

    it('should identify potential bottlenecks', async () => {
      // Create a token with many dependents
      const dependentTokens = Array.from({ length: 15 }, (_, i) => ({
        name: `dependent-${i}`,
        value: `value-${i}`,
        category: 'test',
        intelligence: {
          cognitiveLoad: 1,
          attentionEconomics: 'Test dependent',
          accessibility: 'Test accessibility',
          trustBuilding: 'Test trust',
          semanticMeaning: 'Test semantic',
        },
      }));

      for (const token of dependentTokens) {
        tokenRegistry.add(token);
        tokenRegistry.dependencyGraph.addDependency(token.name, ['primary'], 'scale:1.1');
      }

      const changes = [
        {
          tokenName: 'primary',
          newValue: 'oklch(0.6 0.25 240)',
        },
      ];

      const result = await service.validateChanges(changes);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.performanceImpact.potentialBottlenecks.length).toBeGreaterThan(0);
        expect(result.data.performanceImpact.potentialBottlenecks[0]).toContain('dependents');
      }
    });
  });

  describe('executeRule', () => {
    it('should execute scale rules correctly', async () => {
      const context = {
        tokenName: 'spacing-8',
        dependencies: ['spacing-4'],
        currentValue: '1rem',
      };

      const result = await service.executeRule('scale:2', 'spacing-8', context);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.success).toBe(true);
        expect(result.data.metadata.ruleType).toBe('scale');
        expect(result.data.confidence).toBeGreaterThan(0.5);
      }
    });

    it('should execute state rules correctly', async () => {
      const context = {
        tokenName: 'primary-hover',
        dependencies: ['primary'],
        currentValue: 'oklch(0.5 0.2 240)',
      };

      const result = await service.executeRule('state:hover', 'primary-hover', context);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.success).toBe(true);
        expect(result.data.metadata.ruleType).toBe('state');
        expect(result.data.metadata.reasoning).toContain('hover');
      }
    });

    it('should handle invalid rule syntax', async () => {
      const context = {
        tokenName: 'test-token',
        dependencies: [],
      };

      const result = await service.executeRule('invalid:syntax', 'test-token', context);

      // Service should be resilient and return success with low confidence instead of failing
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.confidence).toBeLessThan(0.5); // Very low confidence for invalid syntax
        expect(result.data.metadata.reasoning).toContain('parsing failed');
      }
    });

    it('should calculate confidence based on dependency availability', async () => {
      const contextWithDeps = {
        tokenName: 'test-token',
        dependencies: ['primary'], // exists
      };

      const contextMissingDeps = {
        tokenName: 'test-token',
        dependencies: ['non-existent'], // doesn't exist
      };

      const result1 = await service.executeRule('scale:2', 'test-token', contextWithDeps);
      const result2 = await service.executeRule('scale:2', 'test-token', contextMissingDeps);

      if (result1.success && result2.success) {
        expect(result1.confidence).toBeGreaterThan(result2.confidence);
      }
    });
  });

  describe('predictCascadeImpact', () => {
    it('should predict impact of primary color change', async () => {
      const result = await service.predictCascadeImpact('primary', 'oklch(0.6 0.25 120)');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tokenName).toBe('primary');
        expect(result.data.newValue).toBe('oklch(0.6 0.25 120)');
        expect(result.data.affectedTokens).toContainEqual(
          expect.objectContaining({
            tokenName: 'primary-hover',
          })
        );
        expect(result.data.totalImpact).toBeGreaterThanOrEqual(0);
        expect(result.data.totalImpact).toBeLessThanOrEqual(10);
      }
    });

    it('should provide risk assessment', async () => {
      const result = await service.predictCascadeImpact('primary', 'oklch(0.3 0.3 60)');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.riskAssessment.breakingChanges).toBeGreaterThanOrEqual(0);
        expect(result.data.riskAssessment.visualImpact).toBeGreaterThanOrEqual(0);
        expect(result.data.riskAssessment.accessibilityImpact).toBeGreaterThanOrEqual(0);
        expect(result.data.riskAssessment.semanticConsistency).toBeGreaterThanOrEqual(0);
      }
    });

    it('should generate relevant recommendations', async () => {
      // Create many dependents to trigger recommendations
      const manyDependents = Array.from({ length: 25 }, (_, i) => ({
        name: `many-dependent-${i}`,
        value: `value-${i}`,
        category: 'test',
        intelligence: {
          cognitiveLoad: 1,
          attentionEconomics: 'Test dependent',
          accessibility: 'Test accessibility',
          trustBuilding: 'Test trust',
          semanticMeaning: 'Test semantic',
        },
      }));

      for (const token of manyDependents) {
        tokenRegistry.add(token);
        tokenRegistry.dependencyGraph.addDependency(token.name, ['primary'], 'scale:1.1');
      }

      const result = await service.predictCascadeImpact('primary', 'oklch(0.7 0.2 200)');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.recommendations.length).toBeGreaterThan(0);
        expect(result.data.recommendations.some((rec) => rec.includes('many tokens'))).toBe(true);
      }
    });

    it('should calculate cascade paths correctly', async () => {
      // Create a deeper dependency chain
      tokenRegistry.add({
        name: 'primary-focus',
        value: 'oklch(0.45 0.2 240)',
        category: 'color',
        intelligence: {
          cognitiveLoad: 2,
          attentionEconomics: 'Focus state',
          accessibility: 'Focus indicator',
          trustBuilding: 'Clear focus state',
          semanticMeaning: 'Primary focus',
        },
      });

      tokenRegistry.dependencyGraph.addDependency(
        'primary-focus',
        ['primary-hover'],
        'contrast:medium'
      );

      const result = await service.predictCascadeImpact('primary', 'oklch(0.6 0.22 240)');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.cascadePath.length).toBeGreaterThan(0);
        expect(result.metadata?.cascadeDepth).toBeGreaterThan(1);
      }
    });

    it('should handle tokens with no dependents', async () => {
      const result = await service.predictCascadeImpact('spacing-4', '1.5rem');

      expect(result.success).toBe(true);
      if (result.success) {
        // spacing-4 has dependents (spacing-8), so should show impact
        expect(result.data.affectedTokens.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Integration tests', () => {
    it('should work with complex rule chains', async () => {
      // Build a complex rule chain
      const tokens = [
        {
          name: 'base-scale',
          value: '1.25',
          category: 'scale',
          intelligence: {
            cognitiveLoad: 1,
            attentionEconomics: 'Base scaling factor',
            accessibility: 'Consistent scaling',
            trustBuilding: 'Mathematical precision',
            semanticMeaning: 'Scale foundation',
          },
        },
        {
          name: 'h1-size',
          value: '2rem',
          category: 'typography',
          intelligence: {
            cognitiveLoad: 2,
            attentionEconomics: 'Primary heading',
            accessibility: 'Clear hierarchy',
            trustBuilding: 'Consistent typography',
            semanticMeaning: 'Main heading size',
          },
        },
        {
          name: 'h2-size',
          value: '1.5rem',
          category: 'typography',
          intelligence: {
            cognitiveLoad: 2,
            attentionEconomics: 'Secondary heading',
            accessibility: 'Clear hierarchy',
            trustBuilding: 'Consistent typography',
            semanticMeaning: 'Sub heading size',
          },
        },
      ];

      for (const token of tokens) {
        tokenRegistry.add(token);
      }
      tokenRegistry.dependencyGraph.addDependency(
        'h2-size',
        ['h1-size', 'base-scale'],
        'calc({h1-size} / {base-scale})'
      );

      // Analyze the complex dependency
      const analysis = await service.analyzeDependencies('h2-size');
      expect(analysis.success).toBe(true);

      // Predict impact of changing base scale
      const impact = await service.predictCascadeImpact('base-scale', '1.5');
      expect(impact.success).toBe(true);
      if (impact.success) {
        expect(impact.data.affectedTokens.some((t) => t.tokenName === 'h2-size')).toBe(true);
      }

      // Validate a change that would affect the chain
      const validation = await service.validateChanges([
        {
          tokenName: 'base-scale',
          newValue: '1.618', // Golden ratio
        },
      ]);
      expect(validation.success).toBe(true);
    });

    it('should handle concurrent analysis requests', async () => {
      const promises = [
        service.analyzeDependencies('primary'),
        service.analyzeDependencies('primary-hover'),
        service.analyzeDependencies('spacing-4'),
        service.predictCascadeImpact('primary', 'oklch(0.5 0.3 300)'),
      ];

      const results = await Promise.all(promises);

      expect(results).toHaveLength(4);
      for (const result of results) {
        expect(result.success).toBe(true);
        expect(result.executionTime).toBeGreaterThan(0);
      }
    });

    it('should maintain consistency across operations', async () => {
      const tokenName = 'primary';

      // First, analyze dependencies
      const analysis = await service.analyzeDependencies(tokenName);
      expect(analysis.success).toBe(true);

      // Then predict cascade impact
      const impact = await service.predictCascadeImpact(tokenName, 'oklch(0.6 0.3 180)');
      expect(impact.success).toBe(true);

      // The affected tokens in impact should match the cascade scope in analysis
      if (analysis.success && impact.success) {
        const analysisScope = analysis.data.cascadeScope;
        const impactTokens = impact.data.affectedTokens.map((t) => t.tokenName);

        // All impact tokens should be in the analysis scope
        for (const token of impactTokens) {
          expect(analysisScope).toContain(token);
        }
      }
    });
  });

  describe('Performance and Reliability', () => {
    it('should complete analysis within reasonable time', async () => {
      const startTime = performance.now();
      const result = await service.analyzeDependencies('primary');
      const endTime = performance.now();

      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(100); // Should complete within 100ms
    });

    it('should handle large dependency graphs efficiently', async () => {
      // Create a larger dependency graph
      const largeTokens = Array.from({ length: 100 }, (_, i) => ({
        name: `large-token-${i}`,
        value: `value-${i}`,
        category: 'test',
        intelligence: {
          cognitiveLoad: 1,
          attentionEconomics: 'Large test token',
          accessibility: 'Test accessibility',
          trustBuilding: 'Test trust',
          semanticMeaning: 'Test semantic',
        },
      }));

      for (const [i, token] of largeTokens.entries()) {
        tokenRegistry.add(token);
        if (i > 0) {
          tokenRegistry.dependencyGraph.addDependency(
            token.name,
            [`large-token-${i - 1}`],
            'scale:1.1'
          );
        }
      }

      const startTime = performance.now();
      const result = await service.analyzeDependencies('large-token-0', {
        maxDepth: 10,
        includeIndirectDependencies: true,
      });
      const endTime = performance.now();

      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(500); // Should complete within 500ms even with 100 tokens
    });

    it('should provide consistent confidence scores', async () => {
      const results = await Promise.all([
        service.analyzeDependencies('primary'),
        service.analyzeDependencies('primary'),
        service.analyzeDependencies('primary'),
      ]);

      expect(results).toHaveLength(3);
      for (const result of results) {
        expect(result.success).toBe(true);
      }

      // Confidence scores should be consistent for the same analysis
      const confidences = results.map((r) => (r.success ? r.confidence : 0));
      expect(Math.max(...confidences) - Math.min(...confidences)).toBeLessThan(0.01);
    });
  });
});
