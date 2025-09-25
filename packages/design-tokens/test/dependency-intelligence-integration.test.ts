/**
 * Integration tests for Dependency Intelligence Service
 * Tests the service with real TokenRegistry operations and rule execution
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { TokenRegistry } from '../src/registry';
import type { Token } from '@rafters/shared';

// Import the service directly for integration testing
// Note: Using relative path since exports might not be fully resolved
import { DependencyIntelligenceService } from '../../../apps/cli/src/mcp/services/dependency-intelligence';

// Create realistic tokens for integration testing
const createIntegrationTokens = (): Token[] => [
  {
    name: 'primary',
    value: 'oklch(0.5 0.2 240)',
    category: 'color',
    namespace: 'color',
    intelligence: {
      cognitiveLoad: 3,
      attentionEconomics: 'Primary brand color - maximum visual weight',
      accessibility: 'WCAG AAA compliant at size',
      trustBuilding: 'Consistent brand identity reinforcement',
      semanticMeaning: 'Primary action and brand color',
    },
  },
  {
    name: 'primary-hover',
    value: 'oklch(0.4 0.2 240)',
    category: 'color',
    namespace: 'color',
    intelligence: {
      cognitiveLoad: 2,
      attentionEconomics: 'Clear interactive feedback',
      accessibility: 'Sufficient contrast for hover states',
      trustBuilding: 'Predictable interaction patterns',
      semanticMeaning: 'Primary action hover state',
    },
  },
  {
    name: 'secondary',
    value: 'oklch(0.6 0.15 120)',
    category: 'color',
    namespace: 'color',
    intelligence: {
      cognitiveLoad: 2,
      attentionEconomics: 'Supporting brand color',
      accessibility: 'AA compliant contrast ratios',
      trustBuilding: 'Complementary brand hierarchy',
      semanticMeaning: 'Secondary actions and accents',
    },
  },
  {
    name: 'spacing-base',
    value: '1rem',
    category: 'spacing',
    namespace: 'spacing',
    intelligence: {
      cognitiveLoad: 1,
      attentionEconomics: 'Foundation spacing unit',
      accessibility: 'Touch-friendly baseline (16px)',
      trustBuilding: 'Consistent spacing system',
      semanticMeaning: 'Base measurement for all spacing',
    },
  },
  {
    name: 'spacing-lg',
    value: '1.5rem', // Will be overridden by rule
    category: 'spacing',
    namespace: 'spacing',
    intelligence: {
      cognitiveLoad: 1,
      attentionEconomics: 'Comfortable content separation',
      accessibility: 'Generous touch targets',
      trustBuilding: 'Proportional spacing progression',
      semanticMeaning: 'Large spacing for important content',
    },
  },
];

describe('DependencyIntelligenceService Integration Tests', () => {
  let service: DependencyIntelligenceService;
  let tokenRegistry: TokenRegistry;

  beforeEach(() => {
    const tokens = createIntegrationTokens();
    tokenRegistry = new TokenRegistry(tokens);

    // Set up realistic dependency relationships
    tokenRegistry.dependencyGraph.addDependency('primary-hover', ['primary'], 'state:hover');
    tokenRegistry.dependencyGraph.addDependency('spacing-lg', ['spacing-base'], 'scale:1.5');

    service = new DependencyIntelligenceService(tokenRegistry);
  });

  describe('Real TokenRegistry Integration', () => {
    it('should integrate with existing TokenRegistry operations', async () => {
      // Test that the service works with real token operations
      expect(tokenRegistry.has('primary')).toBe(true);
      expect(tokenRegistry.get('primary')?.value).toBe('oklch(0.5 0.2 240)');

      const analysis = await service.analyzeDependencies('primary');
      expect(analysis.success).toBe(true);

      if (analysis.success) {
        expect(analysis.data.tokenName).toBe('primary');
        expect(analysis.data.exists).toBe(true);
        expect(analysis.data.cascadeScope).toContain('primary-hover');
      }
    });

    it('should handle token mutations and cascade updates', async () => {
      // Test that the service can predict the impact of real token changes
      const originalPrimary = tokenRegistry.get('primary');
      expect(originalPrimary).toBeDefined();

      const impact = await service.predictCascadeImpact('primary', 'oklch(0.6 0.25 120)');
      expect(impact.success).toBe(true);

      if (impact.success) {
        expect(impact.data.tokenName).toBe('primary');
        expect(impact.data.newValue).toBe('oklch(0.6 0.25 120)');
        
        // Should predict impact on primary-hover
        const affectedToken = impact.data.affectedTokens.find(t => t.tokenName === 'primary-hover');
        expect(affectedToken).toBeDefined();
        expect(affectedToken?.confidence).toBeGreaterThan(0.5);
      }
    });

    it('should validate changes against real dependency graph', async () => {
      const changes = [
        {
          tokenName: 'new-accent',
          newValue: 'oklch(0.7 0.2 300)',
          dependencies: ['primary'],
          rule: 'contrast:medium',
        },
      ];

      const validation = await service.validateChanges(changes);
      expect(validation.success).toBe(true);

      if (validation.success) {
        expect(validation.data.isValid).toBe(true);
        expect(validation.data.errors).toHaveLength(0);
        // Should have performance metrics
        expect(validation.data.performanceImpact).toBeDefined();
      }
    });

    it('should detect circular dependencies in real scenarios', async () => {
      // Create a potential circular dependency
      const changes = [
        {
          tokenName: 'primary',
          newValue: 'oklch(0.5 0.2 240)',
          dependencies: ['primary-hover'], // This would create a circle!
          rule: 'state:active',
        },
      ];

      const validation = await service.validateChanges(changes);
      expect(validation.success).toBe(true);

      if (validation.success) {
        expect(validation.data.isValid).toBe(false);
        expect(validation.data.errors.length).toBeGreaterThan(0);
        
        const circularError = validation.data.errors.find(e => e.errorType === 'circular-dependency');
        expect(circularError).toBeDefined();
      }
    });
  });

  describe('Real Rule Execution', () => {
    it('should execute state rules with real GenerationRuleExecutor', async () => {
      const context = {
        tokenName: 'primary-hover',
        dependencies: ['primary'],
      };

      const result = await service.executeRule('state:hover', 'primary-hover', context);
      expect(result.success).toBe(true);

      if (result.success && result.data.success) {
        expect(result.data.result).toBeDefined();
        expect(result.data.result).not.toBe('Executed state:hover on primary-hover'); // Not a mock!
        expect(result.data.metadata.ruleType).toBe('state');
        expect(result.data.metadata.baseToken).toBe('primary');
        expect(result.confidence).toBeGreaterThan(0.7);
      }
    });

    it('should execute scale rules with real calculations', async () => {
      const context = {
        tokenName: 'spacing-lg',
        dependencies: ['spacing-base'],
      };

      const result = await service.executeRule('scale:1.5', 'spacing-lg', context);
      expect(result.success).toBe(true);

      if (result.success && result.data.success) {
        expect(result.data.result).toBeDefined();
        expect(result.data.result).not.toMatch(/scale.*transformed.*value/); // Not a mock pattern!
        expect(result.data.metadata.ruleType).toBe('scale');
        expect(result.data.metadata.baseToken).toBe('spacing-base');
      }
    });

    it('should handle calc rules with token reference resolution', async () => {
      // Add a calc rule dependency
      const context = {
        tokenName: 'test-calc',
        dependencies: ['spacing-base', 'spacing-lg'],
      };

      const result = await service.executeRule('calc({spacing-base} + {spacing-lg})', 'test-calc', context);
      expect(result.success).toBe(true);

      if (result.success && result.data.success) {
        expect(result.data.result).toContain('calc(');
        expect(result.data.metadata.ruleType).toBe('calc');
        expect(result.data.metadata.mathExpression).toContain('{spacing-base} + {spacing-lg}');
      }
    });
  });

  describe('Performance and Reliability', () => {
    it('should cache expensive operations for performance', async () => {
      // First call should calculate
      const start1 = performance.now();
      const result1 = await service.analyzeDependencies('primary');
      const time1 = performance.now() - start1;

      // Second call should use cache (much faster)
      const start2 = performance.now();
      const result2 = await service.analyzeDependencies('primary');
      const time2 = performance.now() - start2;

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(time2).toBeLessThan(time1); // Cache should be faster
      
      // Results should be identical
      if (result1.success && result2.success) {
        expect(result1.data.cascadeScope).toEqual(result2.data.cascadeScope);
        expect(result1.data.performanceMetrics.depth).toEqual(result2.data.performanceMetrics.depth);
      }
    });

    it('should handle large dependency graphs efficiently', async () => {
      // Create a larger dependency network
      const manyTokens: Token[] = [];
      for (let i = 0; i < 50; i++) {
        manyTokens.push({
          name: `token-${i}`,
          value: `${i}rem`,
          category: 'spacing',
          namespace: 'spacing',
        });
      }

      const largeRegistry = new TokenRegistry([...createIntegrationTokens(), ...manyTokens]);
      
      // Create dependency chain
      for (let i = 1; i < 50; i++) {
        largeRegistry.dependencyGraph.addDependency(`token-${i}`, [`token-${i - 1}`], 'scale:1.1');
      }

      const largeService = new DependencyIntelligenceService(largeRegistry);

      const startTime = performance.now();
      const analysis = await largeService.analyzeDependencies('token-0');
      const executionTime = performance.now() - startTime;

      expect(analysis.success).toBe(true);
      expect(executionTime).toBeLessThan(500); // Should complete within 500ms even for large graphs
      
      if (analysis.success) {
        expect(analysis.data.cascadeScope.length).toBeGreaterThan(40); // Should find the chain
        expect(analysis.data.performanceMetrics.complexity).toBeGreaterThan(0);
      }
    });

    it('should provide consistent results across multiple calls', async () => {
      const results = await Promise.all([
        service.analyzeDependencies('primary'),
        service.analyzeDependencies('primary'),
        service.analyzeDependencies('primary'),
      ]);

      expect(results.every(r => r.success)).toBe(true);
      
      // All results should be consistent
      if (results.every(r => r.success)) {
        const cascadeSizes = results.map(r => r.success ? r.data.cascadeScope.length : 0);
        const depths = results.map(r => r.success ? r.data.performanceMetrics.depth : 0);
        
        expect(Math.max(...cascadeSizes) - Math.min(...cascadeSizes)).toBe(0);
        expect(Math.max(...depths) - Math.min(...depths)).toBe(0);
      }
    });
  });

  describe('Advanced Dependency Analysis', () => {
    it('should analyze complex multi-level dependencies', async () => {
      // Create a multi-level dependency structure
      tokenRegistry.add({
        name: 'tertiary',
        value: 'oklch(0.8 0.1 60)',
        category: 'color',
        namespace: 'color',
      });

      tokenRegistry.dependencyGraph.addDependency('tertiary', ['secondary'], 'contrast:low');

      const analysis = await service.analyzeDependencies('primary');
      expect(analysis.success).toBe(true);

      if (analysis.success) {
        // Should not include tertiary since it doesn't depend on primary
        expect(analysis.data.cascadeScope).not.toContain('tertiary');
        expect(analysis.data.indirectDependencies).toHaveLength(0);
      }

      // But secondary should show tertiary in its cascade
      const secondaryAnalysis = await service.analyzeDependencies('secondary');
      expect(secondaryAnalysis.success).toBe(true);

      if (secondaryAnalysis.success) {
        expect(secondaryAnalysis.data.cascadeScope).toContain('tertiary');
      }
    });

    it('should provide detailed rule analysis information', async () => {
      const analysis = await service.analyzeDependencies('primary-hover');
      expect(analysis.success).toBe(true);

      if (analysis.success) {
        expect(analysis.data.ruleType).toBe('state');
        expect(analysis.data.ruleExpression).toBe('state:hover');
        expect(analysis.data.ruleComplexity).toBeGreaterThan(0);
        expect(analysis.data.ruleComplexity).toBeLessThan(5); // State rules are simple
      }
    });
  });
});