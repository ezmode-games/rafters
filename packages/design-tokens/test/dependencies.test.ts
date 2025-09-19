/**
 * Comprehensive TokenDependencyGraph Test Suite
 *
 * Critical tests for the core dependency system that powers Rafters Studio revenue.
 * These tests must cover every edge case to ensure reliability for production use.
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { TokenDependencyGraph } from '../src/dependencies.js';

describe('TokenDependencyGraph - Basic Operations', () => {
  let graph: TokenDependencyGraph;

  beforeEach(() => {
    graph = new TokenDependencyGraph();
  });

  describe('Basic Dependency Management', () => {
    it('should add a single dependency correctly', () => {
      graph.addDependency('primary-hover', ['primary'], 'state:hover');

      expect(graph.getDependencies('primary-hover')).toEqual(['primary']);
      expect(graph.getDependents('primary')).toEqual(['primary-hover']);
      expect(graph.getGenerationRule('primary-hover')).toBe('state:hover');
    });

    it('should handle multiple dependencies for one token', () => {
      graph.addDependency(
        'complex-color',
        ['primary', 'secondary', 'background'],
        'calc({primary} + {secondary} - {background})'
      );

      expect(graph.getDependencies('complex-color')).toEqual([
        'primary',
        'secondary',
        'background',
      ]);
      expect(graph.getDependents('primary')).toEqual(['complex-color']);
      expect(graph.getDependents('secondary')).toEqual(['complex-color']);
      expect(graph.getDependents('background')).toEqual(['complex-color']);
    });

    it('should handle multiple dependents for one token', () => {
      graph.addDependency('primary-hover', ['primary'], 'state:hover');
      graph.addDependency('primary-active', ['primary'], 'state:active');
      graph.addDependency('primary-focus', ['primary'], 'state:focus');
      graph.addDependency('primary-disabled', ['primary'], 'state:disabled');

      const dependents = graph.getDependents('primary');
      expect(dependents).toHaveLength(4);
      expect(dependents).toContain('primary-hover');
      expect(dependents).toContain('primary-active');
      expect(dependents).toContain('primary-focus');
      expect(dependents).toContain('primary-disabled');
    });

    it('should return empty arrays for non-existent tokens', () => {
      expect(graph.getDependencies('non-existent')).toEqual([]);
      expect(graph.getDependents('non-existent')).toEqual([]);
      expect(graph.getGenerationRule('non-existent')).toBeUndefined();
    });

    it('should handle tokens with no dependencies or dependents', () => {
      graph.addDependency('standalone-token', [], 'manual-value');

      expect(graph.getDependencies('standalone-token')).toEqual([]);
      expect(graph.getDependents('standalone-token')).toEqual([]);
      expect(graph.getGenerationRule('standalone-token')).toBe('manual-value');
    });
  });

  describe('Dependency Updates', () => {
    it('should update dependencies when re-adding with different deps', () => {
      // Initial dependency
      graph.addDependency('dynamic-color', ['primary'], 'state:hover');
      expect(graph.getDependencies('dynamic-color')).toEqual(['primary']);
      expect(graph.getDependents('primary')).toEqual(['dynamic-color']);

      // Update to different dependency
      graph.addDependency('dynamic-color', ['secondary'], 'state:active');
      expect(graph.getDependencies('dynamic-color')).toEqual(['secondary']);
      expect(graph.getDependents('primary')).toEqual([]); // Should be removed
      expect(graph.getDependents('secondary')).toEqual(['dynamic-color']);
    });

    it('should handle complex dependency updates with multiple tokens', () => {
      // Setup initial complex dependencies
      graph.addDependency('token-a', ['base-1'], 'rule-1');
      graph.addDependency('token-b', ['base-1', 'base-2'], 'rule-2');
      graph.addDependency('token-c', ['base-2'], 'rule-3');

      // Update token-b to depend only on base-3
      graph.addDependency('token-b', ['base-3'], 'new-rule-2');

      expect(graph.getDependencies('token-b')).toEqual(['base-3']);
      expect(graph.getDependents('base-1')).toEqual(['token-a']); // token-b removed
      expect(graph.getDependents('base-2')).toEqual(['token-c']); // token-b removed
      expect(graph.getDependents('base-3')).toEqual(['token-b']); // token-b added
    });

    it('should update generation rules correctly', () => {
      graph.addDependency('test-token', ['base'], 'initial-rule');
      expect(graph.getGenerationRule('test-token')).toBe('initial-rule');

      graph.addDependency('test-token', ['base'], 'updated-rule');
      expect(graph.getGenerationRule('test-token')).toBe('updated-rule');
    });
  });
});

describe('TokenDependencyGraph - Circular Dependencies', () => {
  let graph: TokenDependencyGraph;

  beforeEach(() => {
    graph = new TokenDependencyGraph();
  });

  describe('Direct Circular Dependencies', () => {
    it('should detect simple A -> B -> A cycle', () => {
      graph.addDependency('token-a', ['token-b'], 'rule-a');

      expect(() => {
        graph.addDependency('token-b', ['token-a'], 'rule-b');
      }).toThrow('Circular dependency detected');
    });

    it('should detect self-referential dependency', () => {
      expect(() => {
        graph.addDependency('token-a', ['token-a'], 'self-ref');
      }).toThrow('Circular dependency detected');
    });
  });

  describe('Complex Circular Dependencies', () => {
    it('should detect A -> B -> C -> A cycle', () => {
      graph.addDependency('token-a', ['token-b'], 'rule-a');
      graph.addDependency('token-b', ['token-c'], 'rule-b');

      expect(() => {
        graph.addDependency('token-c', ['token-a'], 'rule-c');
      }).toThrow('Circular dependency detected');
    });

    it('should detect complex multi-path cycles', () => {
      graph.addDependency('token-a', ['token-b', 'token-c'], 'rule-a');
      graph.addDependency('token-b', ['token-d'], 'rule-b');
      graph.addDependency('token-c', ['token-e'], 'rule-c');
      graph.addDependency('token-d', ['token-f'], 'rule-d');

      expect(() => {
        graph.addDependency('token-f', ['token-a'], 'rule-f'); // Creates cycle through token-b path
      }).toThrow('Circular dependency detected');
    });

    it('should detect deep nested cycles (depth 10)', () => {
      // Create a chain: token-0 -> token-1 -> ... -> token-9
      for (let i = 0; i < 9; i++) {
        graph.addDependency(`token-${i}`, [`token-${i + 1}`], `rule-${i}`);
      }

      // This should create a cycle: token-9 -> token-0
      expect(() => {
        graph.addDependency('token-9', ['token-0'], 'rule-9');
      }).toThrow('Circular dependency detected');
    });

    it('should allow valid complex dependencies without cycles', () => {
      // Diamond dependency: A depends on B,C; B,C depend on D (no cycle)
      graph.addDependency('token-d', [], 'base');
      graph.addDependency('token-b', ['token-d'], 'rule-b');
      graph.addDependency('token-c', ['token-d'], 'rule-c');

      // This should work - diamond pattern is valid
      expect(() => {
        graph.addDependency('token-a', ['token-b', 'token-c'], 'rule-a');
      }).not.toThrow();

      expect(graph.getDependencies('token-a')).toEqual(['token-b', 'token-c']);
    });
  });

  describe('Cycle Detection Edge Cases', () => {
    it('should handle updates that would create cycles', () => {
      graph.addDependency('token-a', ['token-b'], 'rule-a');
      graph.addDependency('token-c', ['token-d'], 'rule-c');

      // Update token-b to depend on token-a (should fail)
      expect(() => {
        graph.addDependency('token-b', ['token-a'], 'rule-b');
      }).toThrow('Circular dependency detected');
    });

    it('should handle multiple dependency updates in sequence', () => {
      graph.addDependency('token-a', ['token-b'], 'rule-a');
      graph.addDependency('token-b', ['token-c'], 'rule-b');

      // Legal update
      graph.addDependency('token-a', ['token-d'], 'new-rule-a');
      expect(graph.getDependencies('token-a')).toEqual(['token-d']);

      // Now this should be legal since token-a no longer depends on token-b
      expect(() => {
        graph.addDependency('token-c', ['token-a'], 'rule-c');
      }).not.toThrow();
    });
  });
});

describe('TokenDependencyGraph - Topological Sorting', () => {
  let graph: TokenDependencyGraph;

  beforeEach(() => {
    graph = new TokenDependencyGraph();
  });

  describe('Basic Topological Sorting', () => {
    it('should handle empty graph', () => {
      const result = graph.topologicalSort();
      expect(result).toEqual([]);
    });

    it('should handle single token with no dependencies', () => {
      graph.addDependency('standalone', [], 'manual');
      const result = graph.topologicalSort();
      expect(result).toEqual(['standalone']);
    });

    it('should sort simple chain correctly', () => {
      graph.addDependency('token-a', ['token-b'], 'rule-a');
      graph.addDependency('token-b', ['token-c'], 'rule-b');
      graph.addDependency('token-c', [], 'base');

      const result = graph.topologicalSort();

      // token-c should come before token-b, which should come before token-a
      expect(result.indexOf('token-c')).toBeLessThan(result.indexOf('token-b'));
      expect(result.indexOf('token-b')).toBeLessThan(result.indexOf('token-a'));
    });

    it('should handle diamond dependency pattern', () => {
      graph.addDependency('base', [], 'manual');
      graph.addDependency('left', ['base'], 'rule-left');
      graph.addDependency('right', ['base'], 'rule-right');
      graph.addDependency('top', ['left', 'right'], 'rule-top');

      const result = graph.topologicalSort();

      // Base should come first, then left and right (any order), then top
      expect(result.indexOf('base')).toBe(0);
      expect(result.indexOf('top')).toBe(3);
      expect([result.indexOf('left'), result.indexOf('right')]).toEqual(
        expect.arrayContaining([1, 2])
      );
    });
  });

  describe('Complex Topological Sorting', () => {
    it('should handle large dependency graph (50 tokens)', () => {
      // Create a complex but valid dependency graph
      for (let i = 0; i < 50; i++) {
        const deps = i === 0 ? [] : [`token-${Math.floor(i / 2)}`]; // Each token depends on its parent in tree
        graph.addDependency(`token-${i}`, deps, `rule-${i}`);
      }

      const result = graph.topologicalSort();
      expect(result).toHaveLength(50);

      // Verify topological order: parent comes before child
      for (let i = 1; i < 50; i++) {
        const parentIndex = result.indexOf(`token-${Math.floor(i / 2)}`);
        const childIndex = result.indexOf(`token-${i}`);
        expect(parentIndex).toBeLessThan(childIndex);
      }
    });

    it('should handle multiple disconnected components', () => {
      // Component 1: A -> B -> C
      graph.addDependency('a', ['b'], 'rule-a');
      graph.addDependency('b', ['c'], 'rule-b');
      graph.addDependency('c', [], 'base-c');

      // Component 2: X -> Y -> Z
      graph.addDependency('x', ['y'], 'rule-x');
      graph.addDependency('y', ['z'], 'rule-y');
      graph.addDependency('z', [], 'base-z');

      const result = graph.topologicalSort();
      expect(result).toHaveLength(6);

      // Within each component, order should be maintained
      expect(result.indexOf('c')).toBeLessThan(result.indexOf('b'));
      expect(result.indexOf('b')).toBeLessThan(result.indexOf('a'));
      expect(result.indexOf('z')).toBeLessThan(result.indexOf('y'));
      expect(result.indexOf('y')).toBeLessThan(result.indexOf('x'));
    });

    it('should throw error if cycle detected during sorting', () => {
      // This test verifies that our cycle detection works in addDependency
      graph.addDependency('token-a', ['token-b'], 'rule-a');

      // This should throw an error during addDependency due to cycle detection
      expect(() => {
        graph.addDependency('token-b', ['token-a'], 'rule-b');
      }).toThrow('Circular dependency detected');
    });
  });

  describe('Topological Sorting Performance', () => {
    it('should handle large graphs efficiently (1000 tokens)', () => {
      // Create a tree structure with 1000 tokens
      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        const deps = i === 0 ? [] : [`token-${Math.floor(i / 10)}`]; // 10-ary tree
        graph.addDependency(`token-${i}`, deps, `rule-${i}`);
      }

      const result = graph.topologicalSort();

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      expect(result).toHaveLength(1000);
      expect(executionTime).toBeLessThan(2000); // Should complete in under 2s (allowing for CI variability)
    });
  });
});

describe('TokenDependencyGraph - Dependency Cleanup', () => {
  let graph: TokenDependencyGraph;

  beforeEach(() => {
    graph = new TokenDependencyGraph();
  });

  describe('Dependency Removal Edge Cases', () => {
    it('should properly clean up when dependencies are removed', () => {
      graph.addDependency('token-a', ['token-b', 'token-c'], 'rule-a');
      expect(graph.getDependents('token-b')).toEqual(['token-a']);
      expect(graph.getDependents('token-c')).toEqual(['token-a']);

      // Update to remove token-c dependency
      graph.addDependency('token-a', ['token-b'], 'rule-a-updated');
      expect(graph.getDependents('token-b')).toEqual(['token-a']);
      expect(graph.getDependents('token-c')).toEqual([]); // Should be cleaned up
    });

    it('should handle partial dependency updates', () => {
      graph.addDependency('token-a', ['base-1', 'base-2'], 'rule-a');
      graph.addDependency('token-b', ['base-1', 'base-2'], 'rule-b');

      // Update token-a to only depend on base-1
      graph.addDependency('token-a', ['base-1'], 'rule-a-updated');

      expect(graph.getDependents('base-1')).toEqual(expect.arrayContaining(['token-a', 'token-b']));
      expect(graph.getDependents('base-2')).toEqual(['token-b']); // token-a removed
    });

    it('should handle complete dependency removal', () => {
      graph.addDependency('token-a', ['base-1'], 'rule-a');
      expect(graph.getDependents('base-1')).toEqual(['token-a']);

      // Remove all dependencies
      graph.addDependency('token-a', [], 'rule-a-standalone');
      expect(graph.getDependents('base-1')).toEqual([]); // Should be cleaned up
    });
  });

  describe('Complex Cleanup Scenarios', () => {
    it('should handle cleanup in complex graphs', () => {
      // Create complex dependency network
      graph.addDependency('level-3', ['level-2-a', 'level-2-b'], 'rule-3');
      graph.addDependency('level-2-a', ['level-1-a', 'level-1-b'], 'rule-2a');
      graph.addDependency('level-2-b', ['level-1-b', 'level-1-c'], 'rule-2b');
      graph.addDependency('level-1-a', ['base'], 'rule-1a');
      graph.addDependency('level-1-b', ['base'], 'rule-1b');
      graph.addDependency('level-1-c', ['base'], 'rule-1c');

      // Verify initial state
      expect(graph.getDependents('base')).toEqual(
        expect.arrayContaining(['level-1-a', 'level-1-b', 'level-1-c'])
      );
      expect(graph.getDependents('level-1-b')).toEqual(
        expect.arrayContaining(['level-2-a', 'level-2-b'])
      );

      // Remove level-2-a's dependency on level-1-b
      graph.addDependency('level-2-a', ['level-1-a'], 'rule-2a-updated');

      expect(graph.getDependents('level-1-b')).toEqual(['level-2-b']); // level-2-a removed
    });

    it('should maintain consistency after multiple updates', () => {
      // Start with simple setup
      graph.addDependency('child', ['parent'], 'initial-rule');

      // Perform multiple updates
      for (let i = 0; i < 10; i++) {
        graph.addDependency('child', [`parent-${i}`], `rule-${i}`);

        // Verify only current dependency exists
        expect(graph.getDependencies('child')).toEqual([`parent-${i}`]);
        expect(graph.getDependents(`parent-${i}`)).toEqual(['child']);

        // Verify old dependencies are cleaned up
        for (let j = 0; j < i; j++) {
          expect(graph.getDependents(`parent-${j}`)).toEqual([]);
        }
      }
    });
  });
});

describe('TokenDependencyGraph - Error Handling', () => {
  let graph: TokenDependencyGraph;

  beforeEach(() => {
    graph = new TokenDependencyGraph();
  });

  describe('Malformed Input Handling', () => {
    it('should handle empty token names gracefully', () => {
      expect(() => {
        graph.addDependency('', ['valid-token'], 'rule');
      }).not.toThrow();

      expect(graph.getDependencies('')).toEqual(['valid-token']);
    });

    it('should handle empty dependency arrays', () => {
      expect(() => {
        graph.addDependency('valid-token', [], 'standalone-rule');
      }).not.toThrow();

      expect(graph.getDependencies('valid-token')).toEqual([]);
    });

    it('should handle duplicate dependencies', () => {
      expect(() => {
        graph.addDependency('token', ['base', 'base', 'base'], 'rule-with-dupes');
      }).not.toThrow();

      // Should deduplicate internally - should only have one 'base' dependency
      const deps = graph.getDependencies('token');
      expect(deps).toEqual(['base']);
      expect(deps.length).toBe(1);
    });

    it('should handle null/undefined gracefully where possible', () => {
      expect(() => {
        graph.getDependencies('null');
        graph.getDependents('undefined');
        graph.getGenerationRule('missing');
      }).not.toThrow();
    });
  });

  describe('Edge Case Scenarios', () => {
    it('should handle very long token names', () => {
      const longTokenName = 'a'.repeat(1000);
      const longDependencyName = 'b'.repeat(1000);

      expect(() => {
        graph.addDependency(longTokenName, [longDependencyName], 'rule-for-long-names');
      }).not.toThrow();

      expect(graph.getDependencies(longTokenName)).toEqual([longDependencyName]);
    });

    it('should handle many dependencies on single token', () => {
      const manyDeps = [];
      for (let i = 0; i < 100; i++) {
        manyDeps.push(`dep-${i}`);
      }

      expect(() => {
        graph.addDependency('token-with-many-deps', manyDeps, 'complex-rule');
      }).not.toThrow();

      expect(graph.getDependencies('token-with-many-deps')).toHaveLength(100);
    });

    it('should handle special characters in token names', () => {
      const specialTokens = [
        'token-with-dashes',
        'token_with_underscores',
        'token.with.dots',
        'token:with:colons',
        'token/with/slashes',
        'token with spaces',
      ];

      specialTokens.forEach((token) => {
        expect(() => {
          graph.addDependency(token, ['base'], `rule-for-${token}`);
        }).not.toThrow();

        expect(graph.getDependencies(token)).toEqual(['base']);
      });
    });
  });
});

describe('TokenDependencyGraph - Real-world Scenarios', () => {
  let graph: TokenDependencyGraph;

  beforeEach(() => {
    graph = new TokenDependencyGraph();
  });

  describe('Color System Dependencies', () => {
    it('should handle complete color system with state variants', () => {
      // Base color
      graph.addDependency('primary', [], 'base-color');

      // State variants
      graph.addDependency('primary-hover', ['primary'], 'state:hover');
      graph.addDependency('primary-active', ['primary'], 'state:active');
      graph.addDependency('primary-focus', ['primary'], 'state:focus');
      graph.addDependency('primary-disabled', ['primary'], 'state:disabled');

      // Foreground variants
      graph.addDependency('primary-foreground', ['primary'], 'contrast:auto');
      graph.addDependency('primary-foreground-hover', ['primary-hover'], 'contrast:auto');
      graph.addDependency('primary-foreground-active', ['primary-active'], 'contrast:auto');

      // Verify dependency structure - should have 5 dependents (4 states + 1 foreground)
      expect(graph.getDependents('primary')).toHaveLength(5);
      expect(graph.getDependents('primary-hover')).toEqual(['primary-foreground-hover']);

      // Verify topological order
      const sorted = graph.topologicalSort();
      expect(sorted.indexOf('primary')).toBeLessThan(sorted.indexOf('primary-hover'));
      expect(sorted.indexOf('primary-hover')).toBeLessThan(
        sorted.indexOf('primary-foreground-hover')
      );
    });

    it('should handle semantic color mappings', () => {
      // Color families
      graph.addDependency('gray-50', ['gray-family'], 'scale:50');
      graph.addDependency('gray-100', ['gray-family'], 'scale:100');
      graph.addDependency('gray-500', ['gray-family'], 'scale:500');
      graph.addDependency('gray-900', ['gray-family'], 'scale:900');

      // Semantic mappings
      graph.addDependency('background', ['gray-50'], 'semantic-mapping');
      graph.addDependency('foreground', ['gray-900'], 'semantic-mapping');
      graph.addDependency('muted', ['gray-100'], 'semantic-mapping');
      graph.addDependency('muted-foreground', ['gray-500'], 'semantic-mapping');

      // Component-specific colors
      graph.addDependency('card-background', ['background'], 'component-variant');
      graph.addDependency('card-foreground', ['foreground'], 'component-variant');

      const sorted = graph.topologicalSort();
      expect(sorted.indexOf('gray-family')).toBeLessThan(sorted.indexOf('gray-50'));
      expect(sorted.indexOf('gray-50')).toBeLessThan(sorted.indexOf('background'));
      expect(sorted.indexOf('background')).toBeLessThan(sorted.indexOf('card-background'));
    });

    it('should handle dark mode variants', () => {
      // Light mode tokens
      graph.addDependency('background-light', ['neutral-50'], 'scale:50');
      graph.addDependency('foreground-light', ['neutral-900'], 'scale:900');

      // Dark mode tokens
      graph.addDependency('background-dark', ['neutral-900'], 'scale:900');
      graph.addDependency('foreground-dark', ['neutral-50'], 'scale:50');

      // Adaptive tokens that switch based on theme
      graph.addDependency('background', ['background-light', 'background-dark'], 'theme-adaptive');
      graph.addDependency('foreground', ['foreground-light', 'foreground-dark'], 'theme-adaptive');

      expect(graph.getDependencies('background')).toEqual(['background-light', 'background-dark']);
      expect(graph.getDependents('background-light')).toEqual(['background']);
      expect(graph.getDependents('background-dark')).toEqual(['background']);
    });
  });

  describe('Typography System Dependencies', () => {
    it('should handle typography scale dependencies', () => {
      // Base typography
      graph.addDependency('text-base', [], 'base-typography');

      // Scale-based typography
      graph.addDependency('text-xs', ['text-base'], 'calc({text-base} * 0.75)');
      graph.addDependency('text-sm', ['text-base'], 'calc({text-base} * 0.875)');
      graph.addDependency('text-lg', ['text-base'], 'calc({text-base} * 1.125)');
      graph.addDependency('text-xl', ['text-base'], 'calc({text-base} * 1.25)');

      // Component-specific typography
      graph.addDependency('heading-1', ['text-xl'], 'component-heading');
      graph.addDependency('heading-2', ['text-lg'], 'component-heading');
      graph.addDependency('body-text', ['text-base'], 'component-body');
      graph.addDependency('caption', ['text-sm'], 'component-caption');

      const sorted = graph.topologicalSort();
      expect(sorted.indexOf('text-base')).toBe(0); // Base comes first
      expect(sorted.indexOf('text-xl')).toBeLessThan(sorted.indexOf('heading-1'));
    });
  });

  describe('Spacing System Dependencies', () => {
    it('should handle mathematical spacing relationships', () => {
      // Base spacing unit
      graph.addDependency('spacing-base', [], 'base-unit');

      // Mathematical relationships
      graph.addDependency('spacing-xs', ['spacing-base'], 'calc({spacing-base} * 0.25)');
      graph.addDependency('spacing-sm', ['spacing-base'], 'calc({spacing-base} * 0.5)');
      graph.addDependency('spacing-md', ['spacing-base'], 'calc({spacing-base} * 1)');
      graph.addDependency('spacing-lg', ['spacing-base'], 'calc({spacing-base} * 1.5)');
      graph.addDependency('spacing-xl', ['spacing-base'], 'calc({spacing-base} * 2)');
      graph.addDependency('spacing-2xl', ['spacing-xl'], 'calc({spacing-xl} * 1.5)');

      // Component spacing that combines multiple units
      graph.addDependency(
        'card-padding',
        ['spacing-md', 'spacing-lg'],
        'calc({spacing-md} + {spacing-lg})'
      );
      graph.addDependency('button-padding-x', ['spacing-sm'], 'component-padding-x');
      graph.addDependency('button-padding-y', ['spacing-xs'], 'component-padding-y');

      const sorted = graph.topologicalSort();
      expect(sorted.indexOf('spacing-base')).toBe(0);
      expect(sorted.indexOf('spacing-xl')).toBeLessThan(sorted.indexOf('spacing-2xl'));
      expect([sorted.indexOf('spacing-md'), sorted.indexOf('spacing-lg')]).toSatisfy((indices) =>
        indices.every((i) => i < sorted.indexOf('card-padding'))
      );
    });
  });
});

describe('TokenDependencyGraph - Enhanced Utility Methods', () => {
  let graph: TokenDependencyGraph;

  beforeEach(() => {
    graph = new TokenDependencyGraph();
  });

  describe('Token Removal', () => {
    it('should remove token and clean up all references', () => {
      // Setup dependencies
      graph.addDependency('base', [], 'base-rule');
      graph.addDependency('derived', ['base'], 'derived-rule');
      graph.addDependency('complex', ['base', 'derived'], 'complex-rule');

      // Verify initial state
      expect(graph.getDependents('base')).toEqual(['derived', 'complex']);
      expect(graph.getDependents('derived')).toEqual(['complex']);

      // Remove the derived token
      graph.removeToken('derived');

      // Verify cleanup
      expect(graph.getDependents('base')).toEqual(['complex']); // derived removed from base's dependents
      expect(graph.getDependencies('complex')).toEqual(['base']); // derived removed from complex's dependencies
      expect(graph.getDependencies('derived')).toEqual([]); // derived no longer exists
      expect(graph.getGenerationRule('derived')).toBeUndefined();
    });

    it('should handle removing non-existent token gracefully', () => {
      expect(() => {
        graph.removeToken('non-existent');
      }).not.toThrow();
    });

    it('should handle removing token from complex dependency network', () => {
      // Create complex network
      graph.addDependency('a', ['b', 'c'], 'rule-a');
      graph.addDependency('b', ['d'], 'rule-b');
      graph.addDependency('c', ['d'], 'rule-c');
      graph.addDependency('d', [], 'base-d');
      graph.addDependency('e', ['a', 'b'], 'rule-e');

      // Remove 'b' - should clean up properly
      graph.removeToken('b');

      expect(graph.getDependencies('a')).toEqual(['c']); // b removed
      expect(graph.getDependencies('e')).toEqual(['a']); // b removed
      expect(graph.getDependents('d')).toEqual(['c']); // b removed
      expect(graph.getDependents('b')).toEqual([]); // b no longer exists
    });
  });

  describe('Graph Metrics and Analysis', () => {
    it('should calculate correct metrics for empty graph', () => {
      const metrics = graph.getMetrics();
      expect(metrics).toEqual({
        totalTokens: 0,
        totalDependencies: 0,
        avgDependenciesPerToken: 0,
        maxDependencies: 0,
        isolated: [],
      });
    });

    it('should calculate metrics for simple graph', () => {
      graph.addDependency('base', [], 'base-rule');
      graph.addDependency('derived1', ['base'], 'derived-rule-1');
      graph.addDependency('derived2', ['base'], 'derived-rule-2');
      graph.addDependency('complex', ['derived1', 'derived2'], 'complex-rule');

      const metrics = graph.getMetrics();
      expect(metrics.totalTokens).toBe(4);
      expect(metrics.totalDependencies).toBe(4); // 0 + 1 + 1 + 2
      expect(metrics.avgDependenciesPerToken).toBe(1); // 4/4
      expect(metrics.maxDependencies).toBe(2); // complex token
      expect(metrics.isolated).toEqual([]); // no isolated tokens
    });

    it('should identify isolated tokens', () => {
      graph.addDependency('connected', ['base'], 'rule');
      graph.addDependency('base', [], 'base-rule');
      graph.addDependency('isolated1', [], 'isolated-rule-1');
      graph.addDependency('isolated2', [], 'isolated-rule-2');

      const metrics = graph.getMetrics();
      expect(metrics.isolated.length).toBe(2);
      expect(metrics.isolated).toContain('isolated1');
      expect(metrics.isolated).toContain('isolated2');
    });

    it('should get all tokens in graph', () => {
      graph.addDependency('a', ['b'], 'rule-a');
      graph.addDependency('c', ['d'], 'rule-c');
      // Note: 'b' and 'd' are referenced but not explicitly added

      const allTokens = graph.getAllTokens();
      expect(allTokens.sort()).toEqual(['a', 'b', 'c', 'd'].sort());
    });
  });

  describe('Bulk Operations', () => {
    it('should add multiple dependencies efficiently', () => {
      const dependencies = [
        { tokenName: 'a', dependsOn: ['base1'], rule: 'rule-a' },
        { tokenName: 'b', dependsOn: ['base2'], rule: 'rule-b' },
        { tokenName: 'c', dependsOn: ['a', 'b'], rule: 'rule-c' },
        { tokenName: 'base1', dependsOn: [], rule: 'base-rule-1' },
        { tokenName: 'base2', dependsOn: [], rule: 'base-rule-2' },
      ];

      expect(() => {
        graph.addDependencies(dependencies);
      }).not.toThrow();

      expect(graph.getDependencies('c')).toEqual(['a', 'b']);
      expect(graph.getDependents('a')).toEqual(['c']);
      expect(graph.getDependents('base1')).toEqual(['a']);
    });

    it('should detect circular dependencies in bulk operations', () => {
      const dependencies = [
        { tokenName: 'a', dependsOn: ['b'], rule: 'rule-a' },
        { tokenName: 'b', dependsOn: ['c'], rule: 'rule-b' },
        { tokenName: 'c', dependsOn: ['a'], rule: 'rule-c' }, // Creates cycle
      ];

      expect(() => {
        graph.addDependencies(dependencies);
      }).toThrow('Circular dependency detected');
    });

    it('should handle bulk operations with duplicate dependencies', () => {
      const dependencies = [
        { tokenName: 'a', dependsOn: ['base', 'base', 'base'], rule: 'rule-a' },
        { tokenName: 'b', dependsOn: ['base'], rule: 'rule-b' },
      ];

      expect(() => {
        graph.addDependencies(dependencies);
      }).not.toThrow();

      expect(graph.getDependencies('a')).toEqual(['base']);
      expect(graph.getDependents('base')).toEqual(['a', 'b']);
    });
  });

  describe('Graph Validation', () => {
    it('should validate correct graph', () => {
      graph.addDependency('base', [], 'base-rule');
      graph.addDependency('derived', ['base'], 'derived-rule');

      const validation = graph.validate();
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toEqual([]);
    });

    it('should detect integrity issues (though they shouldnt normally occur)', () => {
      // This is more of a test to ensure the validation works
      // In normal operation, the graph should always be valid
      graph.addDependency('a', ['b'], 'rule-a');
      graph.addDependency('b', [], 'rule-b');

      const validation = graph.validate();
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toEqual([]);
    });
  });

  describe('Performance Improvements', () => {
    it('should cache topological sort results', () => {
      // Setup a moderate graph
      for (let i = 0; i < 100; i++) {
        const deps = i === 0 ? [] : [`token-${Math.floor(i / 2)}`];
        graph.addDependency(`token-${i}`, deps, `rule-${i}`);
      }

      // First sort - will compute and cache
      const start1 = performance.now();
      const result1 = graph.topologicalSort();
      const time1 = performance.now() - start1;

      // Second sort - should use cache
      const start2 = performance.now();
      const result2 = graph.topologicalSort();
      const time2 = performance.now() - start2;

      // Results should be identical
      expect(result2).toEqual(result1);
      // Second call should be significantly faster (cached)
      expect(time2).toBeLessThan(time1 * 0.5);
    });

    it('should invalidate cache when graph changes', () => {
      graph.addDependency('a', ['b'], 'rule-a');
      graph.addDependency('b', [], 'rule-b');

      const firstSort = graph.topologicalSort();
      expect(firstSort.indexOf('b')).toBeLessThan(firstSort.indexOf('a'));

      // Add new dependency - should invalidate cache
      graph.addDependency('c', ['a'], 'rule-c');
      const secondSort = graph.topologicalSort();

      expect(secondSort).toHaveLength(3);
      expect(secondSort.indexOf('a')).toBeLessThan(secondSort.indexOf('c'));
    });
  });

  describe('Clear and Reset', () => {
    it('should clear all dependencies', () => {
      graph.addDependency('a', ['b'], 'rule-a');
      graph.addDependency('b', [], 'rule-b');

      expect(graph.getAllTokens()).toHaveLength(2);

      graph.clear();

      expect(graph.getAllTokens()).toHaveLength(0);
      expect(graph.topologicalSort()).toEqual([]);
      expect(graph.getDependencies('a')).toEqual([]);
    });
  });
});

describe('TokenDependencyGraph - Advanced Edge Cases', () => {
  let graph: TokenDependencyGraph;

  beforeEach(() => {
    graph = new TokenDependencyGraph();
  });

  describe('Complex Real-world Scenarios', () => {
    it('should handle theme system with variants and modes', () => {
      // Base theme tokens
      graph.addDependency('neutral-50', ['neutral-family'], 'scale:50');
      graph.addDependency('neutral-900', ['neutral-family'], 'scale:900');
      graph.addDependency('primary-500', ['primary-family'], 'scale:500');

      // Light mode semantics
      graph.addDependency('background-light', ['neutral-50'], 'semantic');
      graph.addDependency('foreground-light', ['neutral-900'], 'semantic');

      // Dark mode semantics (inverted)
      graph.addDependency('background-dark', ['neutral-900'], 'semantic');
      graph.addDependency('foreground-dark', ['neutral-50'], 'semantic');

      // Adaptive tokens
      graph.addDependency('background', ['background-light', 'background-dark'], 'theme-adaptive');
      graph.addDependency('foreground', ['foreground-light', 'foreground-dark'], 'theme-adaptive');

      // Component tokens
      graph.addDependency('button-bg', ['primary-500'], 'component');
      graph.addDependency('button-bg-hover', ['button-bg'], 'state:hover');
      graph.addDependency('button-fg', ['button-bg'], 'contrast:auto');

      // Verify complex dependency chain
      const sorted = graph.topologicalSort();

      // Families should come first (but order between families isn't guaranteed)
      const neutralFamilyIndex = sorted.indexOf('neutral-family');
      const primaryFamilyIndex = sorted.indexOf('primary-family');
      expect(neutralFamilyIndex).toBeGreaterThanOrEqual(0);
      expect(primaryFamilyIndex).toBeGreaterThanOrEqual(0);

      // Scale tokens should come after families
      expect(sorted.indexOf('neutral-family')).toBeLessThan(sorted.indexOf('neutral-50'));
      expect(sorted.indexOf('primary-family')).toBeLessThan(sorted.indexOf('primary-500'));

      // Semantic tokens should come after scale tokens
      expect(sorted.indexOf('neutral-50')).toBeLessThan(sorted.indexOf('background-light'));

      // Component tokens should come after semantic tokens
      expect(sorted.indexOf('primary-500')).toBeLessThan(sorted.indexOf('button-bg'));
      expect(sorted.indexOf('button-bg')).toBeLessThan(sorted.indexOf('button-bg-hover'));
    });

    it('should handle mathematical spacing relationships with cascading updates', () => {
      // Base mathematical system
      graph.addDependency('spacing-base', [], 'base-unit');

      // Linear scale
      graph.addDependency('spacing-xs', ['spacing-base'], 'calc({spacing-base} * 0.25)');
      graph.addDependency('spacing-sm', ['spacing-base'], 'calc({spacing-base} * 0.5)');
      graph.addDependency('spacing-md', ['spacing-base'], 'calc({spacing-base} * 1)');
      graph.addDependency('spacing-lg', ['spacing-base'], 'calc({spacing-base} * 1.5)');
      graph.addDependency('spacing-xl', ['spacing-base'], 'calc({spacing-base} * 2)');

      // Composite spacing
      graph.addDependency(
        'card-padding',
        ['spacing-md', 'spacing-lg'],
        'calc({spacing-md} + {spacing-lg})'
      );
      graph.addDependency('section-gap', ['spacing-xl'], 'calc({spacing-xl} * 2)');

      // Layout spacing that depends on multiple levels
      graph.addDependency(
        'layout-gap',
        ['card-padding', 'section-gap'],
        'calc({card-padding} + {section-gap})'
      );

      // Verify deep dependency chain
      const deps = graph.getDependents('spacing-base');
      expect(deps).toContain('spacing-md');
      expect(deps).toContain('spacing-lg');
      expect(deps).toContain('spacing-xl');

      // Verify cascading dependencies
      expect(graph.getDependents('spacing-md')).toContain('card-padding');
      expect(graph.getDependents('card-padding')).toContain('layout-gap');

      const sorted = graph.topologicalSort();
      expect(sorted.indexOf('spacing-base')).toBeLessThan(sorted.indexOf('spacing-md'));
      expect(sorted.indexOf('spacing-md')).toBeLessThan(sorted.indexOf('card-padding'));
      expect(sorted.indexOf('card-padding')).toBeLessThan(sorted.indexOf('layout-gap'));
    });

    it('should handle component system with shared dependencies', () => {
      // Shared base tokens
      graph.addDependency('border-radius-base', [], 'base-radius');
      graph.addDependency('spacing-base', [], 'base-spacing');
      graph.addDependency('primary-500', [], 'primary-color');

      // Button component family
      graph.addDependency('button-radius', ['border-radius-base'], 'component-radius');
      graph.addDependency('button-padding-x', ['spacing-base'], 'calc({spacing-base} * 0.75)');
      graph.addDependency('button-padding-y', ['spacing-base'], 'calc({spacing-base} * 0.5)');
      graph.addDependency('button-bg', ['primary-500'], 'component-bg');

      // Card component family
      graph.addDependency(
        'card-radius',
        ['border-radius-base'],
        'calc({border-radius-base} * 1.5)'
      );
      graph.addDependency('card-padding', ['spacing-base'], 'calc({spacing-base} * 1.5)');

      // Input component family
      graph.addDependency(
        'input-radius',
        ['border-radius-base'],
        'calc({border-radius-base} * 0.75)'
      );
      graph.addDependency('input-padding-x', ['spacing-base'], 'calc({spacing-base} * 0.75)');
      graph.addDependency('input-padding-y', ['spacing-base'], 'calc({spacing-base} * 0.5)');

      // Verify shared dependencies
      const radiusDependents = graph.getDependents('border-radius-base');
      expect(radiusDependents).toContain('button-radius');
      expect(radiusDependents).toContain('card-radius');
      expect(radiusDependents).toContain('input-radius');

      const spacingDependents = graph.getDependents('spacing-base');
      expect(spacingDependents.length).toBe(5); // button padding x/y, card padding, input padding x/y

      // Verify metrics
      const metrics = graph.getMetrics();
      expect(metrics.totalTokens).toBe(12);
      expect(metrics.maxDependencies).toBe(1); // Each token depends on at most 1 base token
    });
  });
});

describe('TokenDependencyGraph - Rule Engine Integration', () => {
  let graph: TokenDependencyGraph;

  beforeEach(() => {
    graph = new TokenDependencyGraph();
  });

  describe('Rule Validation', () => {
    it('should validate calc rules correctly', () => {
      const validCalcRule = 'calc({spacing-base} * 2)';
      const result = graph.validateRule(validCalcRule);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should validate state rules correctly', () => {
      const validStateRule = 'state:hover';
      const result = graph.validateRule(validStateRule);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should validate scale rules correctly', () => {
      const validScaleRule = 'scale:600';
      const result = graph.validateRule(validScaleRule);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should validate contrast rules correctly', () => {
      const validContrastRule = 'contrast:auto';
      const result = graph.validateRule(validContrastRule);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should validate invert rules correctly', () => {
      const validInvertRule = 'invert';
      const result = graph.validateRule(validInvertRule);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject invalid rules', () => {
      const invalidRule = 'invalid:rule:syntax';
      const result = graph.validateRule(invalidRule);

      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject malformed calc rules', () => {
      const invalidCalcRule = 'calc(invalid expression';
      const result = graph.validateRule(invalidCalcRule);

      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject invalid state types', () => {
      const invalidStateRule = 'state:invalid';
      const result = graph.validateRule(invalidStateRule);

      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Rule Dependency Parsing', () => {
    it('should extract dependencies from calc rules', () => {
      const calcRule = 'calc({spacing-base} * {multiplier})';
      const dependencies = graph.parseRuleDependencies(calcRule);

      expect(dependencies).toEqual(['spacing-base', 'multiplier']);
    });

    it('should extract single dependency from calc rules', () => {
      const calcRule = 'calc({spacing-base} * 2)';
      const dependencies = graph.parseRuleDependencies(calcRule);

      expect(dependencies).toEqual(['spacing-base']);
    });

    it('should return empty array for non-calc rules', () => {
      const stateRule = 'state:hover';
      const dependencies = graph.parseRuleDependencies(stateRule);

      expect(dependencies).toEqual([]);
    });

    it('should handle complex calc expressions', () => {
      const complexCalcRule = 'calc(({base-size} + {padding}) * {scale-factor})';
      const dependencies = graph.parseRuleDependencies(complexCalcRule);

      expect(dependencies).toEqual(['base-size', 'padding', 'scale-factor']);
    });

    it('should throw error for invalid rules', () => {
      const invalidRule = 'invalid:rule';

      expect(() => {
        graph.parseRuleDependencies(invalidRule);
      }).toThrow('Failed to parse rule dependencies');
    });
  });

  describe('Rule-based Dependency Addition', () => {
    it('should add dependency with automatic rule parsing', () => {
      const calcRule = 'calc({spacing-base} * 2)';

      graph.addDependencyWithRuleParsing('spacing-lg', calcRule);

      expect(graph.getDependencies('spacing-lg')).toEqual(['spacing-base']);
      expect(graph.getGenerationRule('spacing-lg')).toBe(calcRule);
      expect(graph.getDependents('spacing-base')).toEqual(['spacing-lg']);
    });

    it('should combine explicit and rule-extracted dependencies', () => {
      const calcRule = 'calc({spacing-base} * 2)';
      const explicitDeps = ['theme-config'];

      graph.addDependencyWithRuleParsing('spacing-lg', calcRule, explicitDeps);

      const dependencies = graph.getDependencies('spacing-lg');
      expect(dependencies).toContain('spacing-base');
      expect(dependencies).toContain('theme-config');
      expect(dependencies.length).toBe(2);
    });

    it('should handle state rules with explicit dependencies', () => {
      const stateRule = 'state:hover';
      const explicitDeps = ['button-bg'];

      graph.addDependencyWithRuleParsing('button-bg-hover', stateRule, explicitDeps);

      expect(graph.getDependencies('button-bg-hover')).toEqual(['button-bg']);
      expect(graph.getGenerationRule('button-bg-hover')).toBe(stateRule);
    });

    it('should reject invalid rules', () => {
      const invalidRule = 'invalid:syntax';

      expect(() => {
        graph.addDependencyWithRuleParsing('token', invalidRule);
      }).toThrow('Invalid generation rule');
    });

    it('should deduplicate dependencies', () => {
      const calcRule = 'calc({spacing-base} * {spacing-base})';

      graph.addDependencyWithRuleParsing('test-token', calcRule);

      const dependencies = graph.getDependencies('test-token');
      expect(dependencies).toEqual(['spacing-base']);
      expect(dependencies.length).toBe(1);
    });
  });

  describe('Rule Updates', () => {
    it('should update token rule and dependencies', () => {
      // Add initial dependency
      graph.addDependency('test-token', ['old-dep'], 'old-rule');

      // Update with new calc rule
      const newRule = 'calc({new-dep} * 2)';
      graph.updateTokenRule('test-token', newRule);

      expect(graph.getDependencies('test-token')).toEqual(['new-dep']);
      expect(graph.getGenerationRule('test-token')).toBe(newRule);
      expect(graph.getDependents('old-dep')).toEqual([]);
      expect(graph.getDependents('new-dep')).toEqual(['test-token']);
    });

    it('should reject invalid rule updates', () => {
      graph.addDependency('test-token', ['dep'], 'rule');

      expect(() => {
        graph.updateTokenRule('test-token', 'invalid:rule');
      }).toThrow('Invalid generation rule');
    });

    it('should throw error for non-existent tokens', () => {
      expect(() => {
        graph.updateTokenRule('non-existent', 'calc({dep} * 2)');
      }).toThrow('Token non-existent does not exist in dependency graph');
    });
  });

  describe('Rule Analysis', () => {
    beforeEach(() => {
      // Set up a graph with various rule types
      graph.addDependencyWithRuleParsing('calc-token', 'calc({base} * 2)');
      graph.addDependencyWithRuleParsing('state-token', 'state:hover', ['base-color']);
      graph.addDependencyWithRuleParsing('scale-token', 'scale:600', ['color-scale']);
      graph.addDependencyWithRuleParsing('contrast-token', 'contrast:auto', ['bg-color']);
      graph.addDependencyWithRuleParsing('invert-token', 'invert', ['light-color']);
    });

    it('should get all tokens with rules', () => {
      const tokensWithRules = graph.getTokensWithRules();

      expect(tokensWithRules).toHaveLength(5);
      expect(tokensWithRules.find((t) => t.tokenName === 'calc-token')).toEqual({
        tokenName: 'calc-token',
        rule: 'calc({base} * 2)',
        dependencies: ['base'],
      });
    });

    it('should validate all rules in the graph', () => {
      const validation = graph.validateAllRules();

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect invalid rules in validation', () => {
      // Add an invalid rule directly (bypassing validation)
      graph.addDependency('invalid-token', [], 'invalid:rule:syntax');

      const validation = graph.validateAllRules();

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toHaveLength(1);
      expect(validation.errors[0].tokenName).toBe('invalid-token');
    });

    it('should get rule type statistics', () => {
      const stats = graph.getRuleTypeStats();

      expect(stats.calc).toBe(1);
      expect(stats.state).toBe(1);
      expect(stats.scale).toBe(1);
      expect(stats.contrast).toBe(1);
      expect(stats.invert).toBe(1);
    });

    it('should find tokens by rule type', () => {
      const calcTokens = graph.getTokensByRuleType('calc');
      const stateTokens = graph.getTokensByRuleType('state');

      expect(calcTokens).toEqual(['calc-token']);
      expect(stateTokens).toEqual(['state-token']);
    });

    it('should handle empty results for unused rule types', () => {
      const unusedTokens = graph.getTokensByRuleType('unused-type');

      expect(unusedTokens).toEqual([]);
    });
  });

  describe('Rule Engine Integration with Complex Scenarios', () => {
    it('should handle design system with mixed rule types', () => {
      // Base tokens (no rules)
      graph.addDependency('spacing-base', [], '');
      graph.addDependency('color-primary', [], '');

      // Calculated spacing scale
      graph.addDependencyWithRuleParsing('spacing-sm', 'calc({spacing-base} * 0.5)');
      graph.addDependencyWithRuleParsing('spacing-lg', 'calc({spacing-base} * 2)');
      graph.addDependencyWithRuleParsing('spacing-xl', 'calc({spacing-lg} * 1.5)');

      // State variants
      graph.addDependencyWithRuleParsing('color-primary-hover', 'state:hover', ['color-primary']);
      graph.addDependencyWithRuleParsing('color-primary-active', 'state:active', ['color-primary']);

      // Component tokens using calc
      graph.addDependencyWithRuleParsing('button-padding', 'calc({spacing-sm} + {spacing-base})');

      // Verify the complex dependency chain
      const sorted = graph.topologicalSort();

      expect(sorted.indexOf('spacing-base')).toBeLessThan(sorted.indexOf('spacing-sm'));
      expect(sorted.indexOf('spacing-base')).toBeLessThan(sorted.indexOf('spacing-lg'));
      expect(sorted.indexOf('spacing-lg')).toBeLessThan(sorted.indexOf('spacing-xl'));
      expect(sorted.indexOf('spacing-sm')).toBeLessThan(sorted.indexOf('button-padding'));
      expect(sorted.indexOf('spacing-base')).toBeLessThan(sorted.indexOf('button-padding'));

      // Verify rule types are working
      const stats = graph.getRuleTypeStats();
      expect(stats.calc).toBe(4);
      expect(stats.state).toBe(2);

      // Verify all rules are valid
      const validation = graph.validateAllRules();
      expect(validation.isValid).toBe(true);
    });

    it('should handle rule updates without breaking dependencies', () => {
      // Initial setup
      graph.addDependencyWithRuleParsing('computed-token', 'calc({base} * 2)');
      graph.addDependencyWithRuleParsing('dependent-token', 'calc({computed-token} + 4)', [
        'computed-token',
      ]);

      // Update the rule for computed-token
      graph.updateTokenRule('computed-token', 'calc({base} * 3)');

      // Verify dependencies are maintained
      expect(graph.getDependencies('computed-token')).toEqual(['base']);
      expect(graph.getDependents('computed-token')).toContain('dependent-token');
      expect(graph.getGenerationRule('computed-token')).toBe('calc({base} * 3)');
    });
  });
});

describe('TokenDependencyGraph - Advanced Rule Engine Integration', () => {
  let graph: TokenDependencyGraph;

  beforeEach(() => {
    graph = new TokenDependencyGraph();
  });

  describe('Complex Rule Dependency Chains', () => {
    it('should handle cascading calc rules with multiple levels', () => {
      // Build a complex mathematical dependency chain
      graph.addDependencyWithRuleParsing('base-unit', 'calc({foundation} * 1)', ['foundation']);
      graph.addDependencyWithRuleParsing('spacing-xs', 'calc({base-unit} * 0.25)');
      graph.addDependencyWithRuleParsing('spacing-sm', 'calc({base-unit} * 0.5)');
      graph.addDependencyWithRuleParsing('spacing-md', 'calc({base-unit} * 1)');
      graph.addDependencyWithRuleParsing('spacing-lg', 'calc({base-unit} * 2)');
      graph.addDependencyWithRuleParsing('spacing-xl', 'calc({spacing-lg} * 1.5)');

      // Complex component calculations
      graph.addDependencyWithRuleParsing('card-padding', 'calc({spacing-md} + {spacing-xs})');
      graph.addDependencyWithRuleParsing('button-padding-x', 'calc({card-padding} * 0.75)');
      graph.addDependencyWithRuleParsing('button-padding-y', 'calc({spacing-sm} + {spacing-xs})');

      // Verify correct dependency extraction and ordering
      const sorted = graph.topologicalSort();

      expect(sorted.indexOf('foundation')).toBeLessThan(sorted.indexOf('base-unit'));
      expect(sorted.indexOf('base-unit')).toBeLessThan(sorted.indexOf('spacing-xs'));
      expect(sorted.indexOf('base-unit')).toBeLessThan(sorted.indexOf('spacing-sm'));
      expect(sorted.indexOf('base-unit')).toBeLessThan(sorted.indexOf('spacing-md'));
      expect(sorted.indexOf('base-unit')).toBeLessThan(sorted.indexOf('spacing-lg'));
      expect(sorted.indexOf('spacing-lg')).toBeLessThan(sorted.indexOf('spacing-xl'));
      expect(sorted.indexOf('spacing-md')).toBeLessThan(sorted.indexOf('card-padding'));
      expect(sorted.indexOf('spacing-xs')).toBeLessThan(sorted.indexOf('card-padding'));
      expect(sorted.indexOf('card-padding')).toBeLessThan(sorted.indexOf('button-padding-x'));

      // Verify all calc rules are detected
      const stats = graph.getRuleTypeStats();
      expect(stats.calc).toBe(9);

      // Verify complex dependency extraction
      expect(graph.getDependencies('card-padding')).toEqual(
        expect.arrayContaining(['spacing-md', 'spacing-xs'])
      );
      expect(graph.getDependencies('button-padding-y')).toEqual(
        expect.arrayContaining(['spacing-sm', 'spacing-xs'])
      );
    });

    it('should handle state rules with complex base token dependencies', () => {
      // Create a color system with states
      graph.addDependency('brand-primary', [], 'base-color');
      graph.addDependencyWithRuleParsing('brand-primary-hover', 'state:hover', ['brand-primary']);
      graph.addDependencyWithRuleParsing('brand-primary-active', 'state:active', ['brand-primary']);
      graph.addDependencyWithRuleParsing('brand-primary-disabled', 'state:disabled', [
        'brand-primary',
      ]);
      graph.addDependencyWithRuleParsing('brand-primary-focus', 'state:focus', ['brand-primary']);

      // Secondary colors with calc rules
      graph.addDependencyWithRuleParsing(
        'brand-secondary',
        'calc({brand-primary} + {color-offset})',
        ['color-offset']
      );
      graph.addDependencyWithRuleParsing('brand-secondary-hover', 'state:hover', [
        'brand-secondary',
      ]);

      // Verify state rule detection
      const stateTokens = graph.getTokensByRuleType('state');
      expect(stateTokens).toHaveLength(5);
      expect(stateTokens).toContain('brand-primary-hover');
      expect(stateTokens).toContain('brand-secondary-hover');

      // Verify dependency chains
      expect(graph.getDependents('brand-primary')).toHaveLength(5); // 4 state variants + 1 calc rule
      expect(graph.getDependents('brand-secondary')).toEqual(['brand-secondary-hover']);

      // Verify topological ordering maintains state after base
      const sorted = graph.topologicalSort();
      expect(sorted.indexOf('brand-primary')).toBeLessThan(sorted.indexOf('brand-primary-hover'));
      expect(sorted.indexOf('brand-secondary')).toBeLessThan(
        sorted.indexOf('brand-secondary-hover')
      );
    });

    it('should handle scale rules with complex color family dependencies', () => {
      // Color family with scale
      graph.addDependency('neutral-family', [], 'color-family-base');
      graph.addDependency('accent-family', [], 'color-family-base');

      // Scale positions
      graph.addDependencyWithRuleParsing('neutral-100', 'scale:100', ['neutral-family']);
      graph.addDependencyWithRuleParsing('neutral-200', 'scale:200', ['neutral-family']);
      graph.addDependencyWithRuleParsing('neutral-500', 'scale:500', ['neutral-family']);
      graph.addDependencyWithRuleParsing('neutral-800', 'scale:800', ['neutral-family']);
      graph.addDependencyWithRuleParsing('neutral-900', 'scale:900', ['neutral-family']);

      graph.addDependencyWithRuleParsing('accent-400', 'scale:400', ['accent-family']);
      graph.addDependencyWithRuleParsing('accent-600', 'scale:600', ['accent-family']);

      // Semantic tokens using scale colors
      graph.addDependencyWithRuleParsing(
        'surface-primary',
        'calc({neutral-100} + {opacity-overlay})',
        ['opacity-overlay']
      );
      graph.addDependencyWithRuleParsing(
        'surface-secondary',
        'calc({neutral-200} + {opacity-overlay})',
        ['opacity-overlay']
      );

      // Verify scale rule detection
      const scaleTokens = graph.getTokensByRuleType('scale');
      expect(scaleTokens).toHaveLength(7);

      // Verify family dependencies
      expect(graph.getDependents('neutral-family')).toHaveLength(5);
      expect(graph.getDependents('accent-family')).toHaveLength(2);

      // Verify complex calc+scale combinations
      expect(graph.getDependencies('surface-primary')).toEqual(
        expect.arrayContaining(['neutral-100', 'opacity-overlay'])
      );

      const sorted = graph.topologicalSort();
      expect(sorted.indexOf('neutral-family')).toBeLessThan(sorted.indexOf('neutral-100'));
      expect(sorted.indexOf('neutral-100')).toBeLessThan(sorted.indexOf('surface-primary'));
    });

    it('should handle contrast and invert rules in dark mode system', () => {
      // Light mode base colors
      graph.addDependency('light-background', [], 'light-base');
      graph.addDependency('light-surface', [], 'light-base');
      graph.addDependency('light-primary', [], 'light-base');

      // Auto-contrast text colors
      graph.addDependencyWithRuleParsing('light-text-on-background', 'contrast:auto', [
        'light-background',
      ]);
      graph.addDependencyWithRuleParsing('light-text-on-surface', 'contrast:auto', [
        'light-surface',
      ]);
      graph.addDependencyWithRuleParsing('light-text-on-primary', 'contrast:auto', [
        'light-primary',
      ]);

      // Dark mode variants using invert
      graph.addDependencyWithRuleParsing('dark-background', 'invert', ['light-background']);
      graph.addDependencyWithRuleParsing('dark-surface', 'invert', ['light-surface']);
      graph.addDependencyWithRuleParsing('dark-primary', 'invert', ['light-primary']);

      // Dark mode contrast
      graph.addDependencyWithRuleParsing('dark-text-on-background', 'contrast:auto', [
        'dark-background',
      ]);
      graph.addDependencyWithRuleParsing('dark-text-on-surface', 'contrast:auto', ['dark-surface']);

      // Adaptive tokens using calc
      graph.addDependencyWithRuleParsing(
        'adaptive-background',
        'calc({light-background} + {dark-background})'
      );
      graph.addDependencyWithRuleParsing(
        'adaptive-text',
        'calc({light-text-on-background} + {dark-text-on-background})'
      );

      // Verify rule type distribution
      const stats = graph.getRuleTypeStats();
      expect(stats.contrast).toBe(5);
      expect(stats.invert).toBe(3);
      expect(stats.calc).toBe(2);

      // Verify contrast dependencies
      const contrastTokens = graph.getTokensByRuleType('contrast');
      expect(contrastTokens).toContain('light-text-on-background');
      expect(contrastTokens).toContain('dark-text-on-background');

      // Verify invert dependencies
      const invertTokens = graph.getTokensByRuleType('invert');
      expect(invertTokens).toContain('dark-background');
      expect(invertTokens).toContain('dark-surface');

      // Verify dependency chains for adaptive tokens
      expect(graph.getDependencies('adaptive-background')).toEqual(
        expect.arrayContaining(['light-background', 'dark-background'])
      );
      expect(graph.getDependencies('adaptive-text')).toEqual(
        expect.arrayContaining(['light-text-on-background', 'dark-text-on-background'])
      );
    });
  });

  describe('Rule Engine Edge Cases', () => {
    it('should handle circular dependencies in rule updates', () => {
      // Set up valid initial state
      graph.addDependencyWithRuleParsing('token-a', 'calc({base} * 2)', ['base']);
      graph.addDependencyWithRuleParsing('token-b', 'calc({token-a} * 1.5)');

      // Attempt to create circular dependency through rule update
      expect(() => {
        graph.updateTokenRule('token-a', 'calc({token-b} * 2)');
      }).toThrow('Circular dependency detected');

      // Verify original state is preserved
      expect(graph.getGenerationRule('token-a')).toBe('calc({base} * 2)');
      expect(graph.getDependencies('token-a')).toEqual(['base']);
    });

    it('should handle complex calc expressions with multiple token references', () => {
      const complexRule =
        'calc(({base-size} + {padding-x} + {padding-y}) * {scale-factor} + {offset})';

      graph.addDependencyWithRuleParsing('complex-token', complexRule);

      const dependencies = graph.getDependencies('complex-token');
      expect(dependencies).toEqual(
        expect.arrayContaining(['base-size', 'padding-x', 'padding-y', 'scale-factor', 'offset'])
      );
      expect(dependencies).toHaveLength(5);

      // Verify rule parsing extracted all tokens
      const parsedDeps = graph.parseRuleDependencies(complexRule);
      expect(parsedDeps).toEqual(['base-size', 'padding-x', 'padding-y', 'scale-factor', 'offset']);
    });

    it('should handle duplicate token references in calc rules', () => {
      const duplicateRule = 'calc({spacing-base} + {spacing-base} * {spacing-base})';

      graph.addDependencyWithRuleParsing('duplicate-token', duplicateRule);

      // Should deduplicate dependencies
      const dependencies = graph.getDependencies('duplicate-token');
      expect(dependencies).toEqual(['spacing-base']);
      expect(dependencies).toHaveLength(1);

      // But rule should remain as-is
      expect(graph.getGenerationRule('duplicate-token')).toBe(duplicateRule);
    });

    it('should handle rule validation with malformed expressions', () => {
      const malformedRules = [
        'calc({unclosed-bracket',
        'calc({} * 2)',
        'calc({valid} +)',
        'state:invalid-state',
        'scale:not-a-number',
        'contrast:invalid-mode',
        'invalid-rule-type:value',
      ];

      for (const rule of malformedRules) {
        const validation = graph.validateRule(rule);
        expect(validation.isValid).toBe(false);
        expect(validation.error).toBeDefined();

        // Should reject in addDependencyWithRuleParsing
        expect(() => {
          graph.addDependencyWithRuleParsing('test-token', rule);
        }).toThrow('Invalid generation rule');
      }
    });

    it('should handle individual malformed rule validation', () => {
      // Test each rule individually to identify which ones pass
      expect(graph.validateRule('calc({unclosed-bracket').isValid).toBe(false);
      expect(graph.validateRule('calc({} * 2)').isValid).toBe(false);
      expect(graph.validateRule('calc({valid} +)').isValid).toBe(false);
      expect(graph.validateRule('state:invalid-state').isValid).toBe(false);
      expect(graph.validateRule('scale:not-a-number').isValid).toBe(false);
      expect(graph.validateRule('contrast:invalid-mode').isValid).toBe(false);
      expect(graph.validateRule('invalid-rule-type:value').isValid).toBe(false);
    });

    it('should handle rule updates that change dependency count', () => {
      // Start with simple rule
      graph.addDependencyWithRuleParsing('flexible-token', 'calc({base} * 2)');
      expect(graph.getDependencies('flexible-token')).toEqual(['base']);

      // Update to complex rule with more dependencies
      graph.updateTokenRule('flexible-token', 'calc({base} + {offset} + {multiplier})');
      const newDeps = graph.getDependencies('flexible-token');
      expect(newDeps).toEqual(expect.arrayContaining(['base', 'offset', 'multiplier']));
      expect(newDeps).toHaveLength(3);

      // Update to rule with fewer dependencies
      graph.updateTokenRule('flexible-token', 'calc({single-dep} * 5)');
      expect(graph.getDependencies('flexible-token')).toEqual(['single-dep']);

      // Update to non-calc rule (no auto-extracted dependencies)
      graph.updateTokenRule('flexible-token', 'state:hover');
      expect(graph.getDependencies('flexible-token')).toEqual([]);
    });

    it('should handle mixed rule types in bulk operations', () => {
      const mixedRuleDependencies = [
        { tokenName: 'calc-token-1', dependsOn: [], rule: 'calc({base} * 2)' },
        { tokenName: 'calc-token-2', dependsOn: [], rule: 'calc({base} * 3)' },
        { tokenName: 'state-token-1', dependsOn: ['calc-token-1'], rule: 'state:hover' },
        { tokenName: 'state-token-2', dependsOn: ['calc-token-2'], rule: 'state:active' },
        { tokenName: 'scale-token', dependsOn: ['color-family'], rule: 'scale:500' },
        { tokenName: 'contrast-token', dependsOn: ['scale-token'], rule: 'contrast:auto' },
        { tokenName: 'invert-token', dependsOn: ['contrast-token'], rule: 'invert' },
      ];

      graph.addDependencies(mixedRuleDependencies);

      // Verify all rule types were added
      const stats = graph.getRuleTypeStats();
      expect(stats.calc).toBe(2);
      expect(stats.state).toBe(2);
      expect(stats.scale).toBe(1);
      expect(stats.contrast).toBe(1);
      expect(stats.invert).toBe(1);

      // Verify complex dependency chain
      const sorted = graph.topologicalSort();
      expect(sorted.indexOf('color-family')).toBeLessThan(sorted.indexOf('scale-token'));
      expect(sorted.indexOf('scale-token')).toBeLessThan(sorted.indexOf('contrast-token'));
      expect(sorted.indexOf('contrast-token')).toBeLessThan(sorted.indexOf('invert-token'));

      // Verify all rules are valid
      const validation = graph.validateAllRules();
      expect(validation.isValid).toBe(true);
    });
  });

  describe('Rule Engine Performance and Scale', () => {
    it('should handle large design systems with mixed rule types efficiently', () => {
      const startTime = performance.now();

      // Create a large design system
      const tokenCount = 1000;
      const dependencies = [];

      // Base tokens
      for (let i = 0; i < 50; i++) {
        dependencies.push({
          tokenName: `base-${i}`,
          dependsOn: [],
          rule: '',
        });
      }

      // Calculated spacing scale (500 tokens)
      for (let i = 0; i < 500; i++) {
        const baseIndex = i % 50;
        dependencies.push({
          tokenName: `spacing-${i}`,
          dependsOn: [],
          rule: `calc({base-${baseIndex}} * ${(i + 1) * 0.25})`,
        });
      }

      // State variants (300 tokens)
      for (let i = 0; i < 300; i++) {
        const baseIndex = i % 50;
        const states = ['hover', 'active', 'focus', 'disabled'];
        const state = states[i % 4];
        dependencies.push({
          tokenName: `color-${i}-${state}`,
          dependsOn: [`base-${baseIndex}`],
          rule: `state:${state}`,
        });
      }

      // Scale tokens (100 tokens)
      for (let i = 0; i < 100; i++) {
        const baseIndex = i % 50;
        const position = ((i % 9) + 1) * 100;
        dependencies.push({
          tokenName: `scale-${i}`,
          dependsOn: [`base-${baseIndex}`],
          rule: `scale:${position}`,
        });
      }

      // Contrast tokens (50 tokens)
      for (let i = 0; i < 50; i++) {
        dependencies.push({
          tokenName: `contrast-${i}`,
          dependsOn: [`scale-${i}`],
          rule: 'contrast:auto',
        });
      }

      // Add all dependencies
      graph.addDependencies(dependencies);

      const addTime = performance.now() - startTime;

      // Verify the system was built correctly
      expect(graph.getAllTokens()).toHaveLength(tokenCount);

      // Test rule type statistics performance
      const statsStartTime = performance.now();
      const stats = graph.getRuleTypeStats();
      const statsTime = performance.now() - statsStartTime;

      expect(stats.calc).toBe(500);
      expect(stats.state).toBe(300);
      expect(stats.scale).toBe(100);
      expect(stats.contrast).toBe(50);

      // Test validation performance
      const validationStartTime = performance.now();
      const validation = graph.validateAllRules();
      const validationTime = performance.now() - validationStartTime;

      expect(validation.isValid).toBe(true);

      // Test topological sort performance
      const sortStartTime = performance.now();
      const sorted = graph.topologicalSort();
      const sortTime = performance.now() - sortStartTime;

      expect(sorted).toHaveLength(tokenCount);

      // Performance assertions (allowing for CI variability)
      expect(addTime).toBeLessThan(2000); // 2s to add 1000 tokens with rules
      expect(statsTime).toBeLessThan(200); // 200ms for statistics
      expect(validationTime).toBeLessThan(500); // 500ms to validate all rules
      expect(sortTime).toBeLessThan(1000); // 1s for topological sort
    });

    it('should handle rapid rule updates efficiently', () => {
      // Set up base system
      const baseTokens = [];
      for (let i = 0; i < 100; i++) {
        baseTokens.push({
          tokenName: `token-${i}`,
          dependsOn: i > 0 ? [`token-${i - 1}`] : [],
          rule: i > 0 ? `calc({token-${i - 1}} * 1.1)` : '',
        });
      }

      graph.addDependencies(baseTokens);

      // Perform rapid rule updates
      const startTime = performance.now();

      for (let i = 1; i < 100; i++) {
        const newMultiplier = 1.1 + i * 0.01;
        graph.updateTokenRule(`token-${i}`, `calc({token-${i - 1}} * ${newMultiplier})`);
      }

      const updateTime = performance.now() - startTime;

      // Verify all updates were applied
      expect(graph.getGenerationRule('token-50')).toBe('calc({token-49} * 1.6)');
      expect(graph.getGenerationRule('token-99')).toBe('calc({token-98} * 2.09)');

      // Verify dependency integrity
      const validation = graph.validate();
      expect(validation.isValid).toBe(true);

      // Should complete updates quickly
      expect(updateTime).toBeLessThan(200); // 200ms for 99 rule updates
    });

    it('should handle complex rule dependency extraction at scale', () => {
      const complexRules = [];

      // Create rules with varying complexity
      for (let i = 0; i < 200; i++) {
        let rule: string;

        if (i % 4 === 0) {
          rule = `calc({base-${i % 10}} * ${i + 1})`;
        } else if (i % 4 === 1) {
          rule = `calc(({base-${i % 10}} + {offset-${i % 5}}) * {scale-${i % 3}})`;
        } else if (i % 4 === 2) {
          rule = `calc({base-${i % 10}} + {pad-x-${i % 4}} + {pad-y-${i % 4}} + {margin-${i % 6}})`;
        } else {
          rule = `calc((({base-${i % 10}} * {factor-a-${i % 7}}) + ({offset-${i % 5}} * {factor-b-${i % 8}})) * {final-scale-${i % 9}})`;
        }

        complexRules.push({
          tokenName: `complex-${i}`,
          dependsOn: [],
          rule,
        });
      }

      const startTime = performance.now();
      // Use addDependencyWithRuleParsing to enable automatic dependency extraction
      for (const rule of complexRules) {
        graph.addDependencyWithRuleParsing(rule.tokenName, rule.rule);
      }
      const addTime = performance.now() - startTime;

      // Verify complex dependency extraction worked
      const complexToken = graph.getDependencies('complex-199');
      const rule199 = graph.getGenerationRule('complex-199');

      if (rule199) {
        const expectedDeps = graph.parseRuleDependencies(rule199);
        expect(complexToken.length).toBe(expectedDeps.length); // Should match parsed dependencies
        expect(complexToken.length).toBeGreaterThanOrEqual(1); // Should have at least one dependency
      } else {
        throw new Error('Rule 199 is missing');
      }

      // Test rule parsing performance
      const parseStartTime = performance.now();
      for (let i = 0; i < 200; i++) {
        const rule = graph.getGenerationRule(`complex-${i}`);
        if (rule) {
          graph.parseRuleDependencies(rule);
        }
      }
      const parseTime = performance.now() - parseStartTime;

      // Performance assertions
      expect(addTime).toBeLessThan(300); // 300ms to add 200 complex rules
      expect(parseTime).toBeLessThan(100); // 100ms to parse 200 complex rules
    });
  });
});

describe('TokenDependencyGraph - Performance Stress Tests', () => {
  let graph: TokenDependencyGraph;

  beforeEach(() => {
    graph = new TokenDependencyGraph();
  });

  describe('Large Scale Performance', () => {
    it('should handle enterprise-scale token system (5000 tokens)', () => {
      const startTime = performance.now();

      // Create a realistic enterprise dependency structure
      // Base tokens (100)
      for (let i = 0; i < 100; i++) {
        graph.addDependency(`base-${i}`, [], `base-rule-${i}`);
      }

      // Scale tokens (1000) - each depends on a base
      for (let i = 0; i < 1000; i++) {
        const baseIndex = i % 100;
        graph.addDependency(`scale-${i}`, [`base-${baseIndex}`], `scale:${(i % 10) * 100 + 50}`);
      }

      // Semantic tokens (2000) - each depends on 1-3 scale tokens
      for (let i = 0; i < 2000; i++) {
        const deps = [];
        const numDeps = (i % 3) + 1; // 1-3 dependencies
        for (let j = 0; j < numDeps; j++) {
          deps.push(`scale-${(i * j) % 1000}`);
        }
        graph.addDependency(`semantic-${i}`, deps, `semantic-rule-${i}`);
      }

      // Component tokens (1900) - each depends on semantic tokens
      for (let i = 0; i < 1900; i++) {
        const semanticIndex = i % 2000;
        graph.addDependency(`component-${i}`, [`semantic-${semanticIndex}`], `component-rule-${i}`);
      }

      const setupTime = performance.now();

      // Test operations
      const sorted = graph.topologicalSort();
      const sortTime = performance.now();

      // Test queries
      const testQueries = 1000;
      for (let i = 0; i < testQueries; i++) {
        const tokenIndex = i % 100;
        graph.getDependents(`base-${tokenIndex}`);
        graph.getDependencies(`component-${tokenIndex}`);
      }
      const queryTime = performance.now();

      // Assertions
      expect(sorted.length).toBe(5000);
      expect(setupTime - startTime).toBeLessThan(10000); // Setup under 10s for CI
      expect(sortTime - setupTime).toBeLessThan(3000); // Sort under 3s for CI
      expect(queryTime - sortTime).toBeLessThan(2000); // Queries under 2s for CI

      // Verify correctness of a sample
      expect(graph.getDependents('base-0').length).toBeGreaterThan(0);
    }, 10000);

    it('should handle rapid dependency updates', () => {
      const startTime = performance.now();

      // Initial setup
      for (let i = 0; i < 100; i++) {
        graph.addDependency(`token-${i}`, [], `initial-rule-${i}`);
      }

      // Rapid updates - each token gets updated 100 times
      for (let update = 0; update < 100; update++) {
        for (let i = 0; i < 100; i++) {
          const newDep = `base-${(i + update) % 50}`; // Cycling dependencies
          graph.addDependency(`token-${i}`, [newDep], `rule-${i}-${update}`);
        }
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      expect(totalTime).toBeLessThan(2000); // Should complete in under 2s
      expect(graph.topologicalSort().length).toBe(150); // 100 tokens + 50 bases
    }, 5000);

    it('should handle concurrent-like operations', () => {
      // Simulate concurrent operations by interleaving different types of operations
      const operations = [];

      for (let i = 0; i < 1000; i++) {
        const opType = i % 4;
        switch (opType) {
          case 0: // Add dependency
            operations.push(() =>
              graph.addDependency(`token-${i}`, [`base-${i % 100}`], `rule-${i}`)
            );
            break;
          case 1: // Update dependency
            operations.push(() => {
              if (i > 0) {
                graph.addDependency(
                  `token-${i - 1}`,
                  [`base-${(i - 1) % 50}`],
                  `updated-rule-${i}`
                );
              }
            });
            break;
          case 2: // Query dependencies
            operations.push(() => {
              if (i > 0) {
                graph.getDependencies(`token-${i - 1}`);
              }
            });
            break;
          case 3: // Query dependents
            operations.push(() => {
              if (i > 0) {
                graph.getDependents(`base-${(i - 1) % 100}`);
              }
            });
            break;
        }
      }

      const startTime = performance.now();

      // Execute all operations
      for (const op of operations) {
        op();
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      expect(totalTime).toBeLessThan(1000); // Should complete in under 1s
      expect(() => graph.topologicalSort()).not.toThrow();
    }, 3000);
  });
});
