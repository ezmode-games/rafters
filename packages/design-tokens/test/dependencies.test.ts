/**
 * Token Dependency Tracking Tests
 *
 * Comprehensive tests for the dependency tracking system functionality
 */

import { describe, expect, it } from 'vitest';
import { TokenDependencyGraph } from '../src/dependencies.js';
import type { Token } from '../src/index.js';
import { TokenRegistry } from '../src/registry.js';

describe('TokenDependencyGraph', () => {
  describe('addDependency', () => {
    it('should add dependency relationship with generation rule', () => {
      const graph = new TokenDependencyGraph();

      graph.addDependency('primary-foreground', ['primary'], 'contrast-pair');

      expect(graph.getDependencies('primary-foreground')).toEqual(['primary']);
      expect(graph.getDependents('primary')).toEqual(['primary-foreground']);
      expect(graph.getGenerationRule('primary-foreground')).toBe('contrast-pair');
    });

    it('should handle multiple dependencies', () => {
      const graph = new TokenDependencyGraph();

      graph.addDependency('composite-token', ['primary', 'secondary'], 'blend-colors');

      expect(graph.getDependencies('composite-token')).toEqual(['primary', 'secondary']);
      expect(graph.getDependents('primary')).toEqual(['composite-token']);
      expect(graph.getDependents('secondary')).toEqual(['composite-token']);
    });

    it('should update existing dependencies', () => {
      const graph = new TokenDependencyGraph();

      graph.addDependency('token', ['primary'], 'rule1');
      graph.addDependency('token', ['secondary'], 'rule2');

      expect(graph.getDependencies('token')).toEqual(['secondary']);
      expect(graph.getGenerationRule('token')).toBe('rule2');
      expect(graph.getDependents('primary')).toEqual([]);
      expect(graph.getDependents('secondary')).toEqual(['token']);
    });

    it('should throw error for circular dependencies', () => {
      const graph = new TokenDependencyGraph();

      graph.addDependency('a', ['b'], 'rule1');
      graph.addDependency('b', ['c'], 'rule2');

      expect(() => {
        graph.addDependency('c', ['a'], 'circular');
      }).toThrow('Circular dependency detected');
    });

    it('should detect direct circular dependencies', () => {
      const graph = new TokenDependencyGraph();

      expect(() => {
        graph.addDependency('primary', ['primary'], 'self-reference');
      }).toThrow('Circular dependency detected');
    });
  });

  describe('getDependents', () => {
    it('should return empty array for token with no dependents', () => {
      const graph = new TokenDependencyGraph();

      expect(graph.getDependents('primary')).toEqual([]);
    });

    it('should return all tokens that depend on specified token', () => {
      const graph = new TokenDependencyGraph();

      graph.addDependency('primary-foreground', ['primary'], 'contrast-pair');
      graph.addDependency('ring', ['primary'], 'inherit-value');

      const dependents = graph.getDependents('primary');
      expect(dependents).toHaveLength(2);
      expect(dependents).toContain('primary-foreground');
      expect(dependents).toContain('ring');
    });
  });

  describe('getDependencies', () => {
    it('should return empty array for token with no dependencies', () => {
      const graph = new TokenDependencyGraph();

      expect(graph.getDependencies('primary')).toEqual([]);
    });

    it('should return all tokens this token depends on', () => {
      const graph = new TokenDependencyGraph();

      graph.addDependency('primary-foreground', ['primary'], 'contrast-pair');

      expect(graph.getDependencies('primary-foreground')).toEqual(['primary']);
    });
  });

  describe('topologicalSort', () => {
    it('should return tokens in dependency order', () => {
      const graph = new TokenDependencyGraph();

      graph.addDependency('primary-foreground', ['primary'], 'contrast-pair');
      graph.addDependency('card', ['background'], 'inherit-value');

      const sortOrder = graph.topologicalSort();
      const primaryIndex = sortOrder.indexOf('primary');
      const foregroundIndex = sortOrder.indexOf('primary-foreground');
      const backgroundIndex = sortOrder.indexOf('background');
      const cardIndex = sortOrder.indexOf('card');

      expect(primaryIndex).toBeLessThan(foregroundIndex);
      expect(backgroundIndex).toBeLessThan(cardIndex);
    });

    it('should handle complex dependency chains', () => {
      const graph = new TokenDependencyGraph();

      graph.addDependency('b', ['a'], 'rule1');
      graph.addDependency('c', ['b'], 'rule2');
      graph.addDependency('d', ['c'], 'rule3');

      const sortOrder = graph.topologicalSort();
      const aIndex = sortOrder.indexOf('a');
      const bIndex = sortOrder.indexOf('b');
      const cIndex = sortOrder.indexOf('c');
      const dIndex = sortOrder.indexOf('d');

      expect(aIndex).toBeLessThan(bIndex);
      expect(bIndex).toBeLessThan(cIndex);
      expect(cIndex).toBeLessThan(dIndex);
    });

    it('should handle valid dependency sorting', () => {
      const graph = new TokenDependencyGraph();

      // Test valid dependency chain
      graph.addDependency('a', [], 'base');
      graph.addDependency('b', ['a'], 'rule1');
      graph.addDependency('c', ['b'], 'rule2');

      const sortOrder = graph.topologicalSort();
      const aIndex = sortOrder.indexOf('a');
      const bIndex = sortOrder.indexOf('b');
      const cIndex = sortOrder.indexOf('c');

      expect(aIndex).toBeLessThan(bIndex);
      expect(bIndex).toBeLessThan(cIndex);
    });
  });

  describe('getGenerationRule', () => {
    it('should return generation rule for existing token', () => {
      const graph = new TokenDependencyGraph();

      graph.addDependency('primary-foreground', ['primary'], 'contrast-pair');

      expect(graph.getGenerationRule('primary-foreground')).toBe('contrast-pair');
    });

    it('should return undefined for non-existent token', () => {
      const graph = new TokenDependencyGraph();

      expect(graph.getGenerationRule('non-existent')).toBeUndefined();
    });
  });
});

describe('TokenRegistry Dependency Integration', () => {
  // Test fixtures
  const primaryToken: Token = {
    name: 'primary',
    value: 'oklch(0.45 0.12 240)',
    category: 'color',
    namespace: 'color',
  };

  const backgroundToken: Token = {
    name: 'background',
    value: 'oklch(1 0 0)',
    category: 'color',
    namespace: 'color',
  };

  describe('dependency methods', () => {
    it('should add dependency relationship', () => {
      const registry = new TokenRegistry([primaryToken]);

      registry.addDependency('primary-foreground', ['primary'], 'contrast-pair');

      const dependents = registry.getDependents('primary');
      expect(dependents).toContain('primary-foreground');

      const dependencies = registry.getDependencies('primary-foreground');
      expect(dependencies).toContain('primary');
    });

    it('should handle multiple dependency relationships', () => {
      const registry = new TokenRegistry([primaryToken, backgroundToken]);

      registry.addDependency('primary-foreground', ['primary'], 'contrast-pair');
      registry.addDependency('ring', ['primary'], 'inherit-value');
      registry.addDependency('card', ['background'], 'inherit-value');

      const primaryDependents = registry.getDependents('primary');
      expect(primaryDependents).toHaveLength(2);
      expect(primaryDependents).toContain('primary-foreground');
      expect(primaryDependents).toContain('ring');

      const backgroundDependents = registry.getDependents('background');
      expect(backgroundDependents).toEqual(['card']);
    });

    it('should provide access to topological sort', () => {
      const registry = new TokenRegistry([primaryToken]);

      registry.addDependency('primary-foreground', ['primary'], 'contrast-pair');

      const sortOrder = registry.dependencyGraph.topologicalSort();
      const primaryIndex = sortOrder.indexOf('primary');
      const foregroundIndex = sortOrder.indexOf('primary-foreground');

      expect(primaryIndex).toBeLessThan(foregroundIndex);
    });

    it('should detect circular dependencies', () => {
      const registry = new TokenRegistry();

      expect(() => {
        registry.addDependency('primary', ['primary-foreground'], 'circular');
        registry.addDependency('primary-foreground', ['primary'], 'circular');
      }).toThrow('Circular dependency detected');
    });
  });

  describe('predefined color dependencies', () => {
    it('should configure standard color dependency relationships', () => {
      const registry = new TokenRegistry();

      // Configure predefined dependencies as specified in requirements
      registry.addDependency('primary-foreground', ['primary'], 'contrast-pair');
      registry.addDependency('card', ['background'], 'inherit-value');
      registry.addDependency('card-foreground', ['card'], 'contrast-pair');
      registry.addDependency('popover', ['background'], 'inherit-value');
      registry.addDependency('popover-foreground', ['popover'], 'contrast-pair');
      registry.addDependency('accent-foreground', ['accent'], 'contrast-pair');
      registry.addDependency('muted-foreground', ['muted'], 'contrast-pair');
      registry.addDependency('ring', ['primary'], 'inherit-value');

      // Test some key relationships
      expect(registry.getDependents('primary')).toEqual(['primary-foreground', 'ring']);
      expect(registry.getDependents('background')).toEqual(['card', 'popover']);
      expect(registry.getDependencies('card-foreground')).toEqual(['card']);
      expect(registry.getDependencies('popover-foreground')).toEqual(['popover']);
    });

    it('should support scale dependencies', () => {
      const registry = new TokenRegistry();

      // Example scale dependencies
      registry.addDependency('primary-50', ['primary'], 'lightness-scale-50');
      registry.addDependency('primary-100', ['primary'], 'lightness-scale-100');
      registry.addDependency('primary-200', ['primary'], 'lightness-scale-200');

      const primaryDependents = registry.getDependents('primary');
      expect(primaryDependents).toContain('primary-50');
      expect(primaryDependents).toContain('primary-100');
      expect(primaryDependents).toContain('primary-200');
    });
  });

  describe('performance requirements', () => {
    it('should provide O(1) dependency lookup', () => {
      const registry = new TokenRegistry();

      // Create many dependency relationships
      for (let i = 0; i < 1000; i++) {
        registry.addDependency(`token-${i}`, [`base-${i % 10}`], `rule-${i}`);
      }

      const start = performance.now();
      const dependents = registry.getDependents('base-5');
      const end = performance.now();

      expect(dependents.length).toBeGreaterThan(0);
      expect(end - start).toBeLessThan(1); // Should be well under 1ms
    });

    it('should provide efficient dependency lookup', () => {
      const registry = new TokenRegistry();

      // Create complex dependency tree
      for (let i = 0; i < 100; i++) {
        registry.addDependency(`level-1-${i}`, ['base'], 'rule1');
        registry.addDependency(`level-2-${i}`, [`level-1-${i}`], 'rule2');
      }

      const start = performance.now();
      const dependencies = registry.getDependencies('level-2-50');
      const end = performance.now();

      expect(dependencies).toEqual(['level-1-50']);
      expect(end - start).toBeLessThan(1); // Should be well under 1ms
    });
  });
});
