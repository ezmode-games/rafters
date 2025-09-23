/**
 * Rule Engine Tests
 *
 * Tests the plugin system and rule execution
 */

import type { Token } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { TokenRegistry } from '../src/registry';
import { createRuleContext, executeRule, loadPlugins } from '../src/rule-engine';

describe('Rule Engine', () => {
  const mockColorFamilyToken: Token = {
    name: 'ocean-blue',
    value: {
      name: 'Ocean Blue',
      scale: [
        { l: 0.9, c: 0.05, h: 220 }, // 100
        { l: 0.8, c: 0.08, h: 220 }, // 200
        { l: 0.7, c: 0.12, h: 220 }, // 300
        { l: 0.6, c: 0.15, h: 220 }, // 400
        { l: 0.5, c: 0.18, h: 220 }, // 500
        { l: 0.4, c: 0.2, h: 220 }, // 600
        { l: 0.3, c: 0.18, h: 220 }, // 700
        { l: 0.2, c: 0.15, h: 220 }, // 800
        { l: 0.1, c: 0.1, h: 220 }, // 900
      ],
      stateReferences: {
        hover: { family: 'ocean-blue', position: 7 },
        active: { family: 'ocean-blue', position: 8 },
      },
      foregroundReferences: {
        auto: { family: 'neutral-grayscale', position: 9 },
      },
      accessibility: {
        wcagAA: {
          normal: [
            [0, 6],
            [0, 7],
            [0, 8],
            [0, 9], // Light positions pair with dark
            [1, 6],
            [1, 7],
            [1, 8],
            [1, 9],
            [2, 7],
            [2, 8],
            [2, 9],
            [3, 8],
            [3, 9],
            [4, 9],
            [6, 0],
            [7, 0],
            [8, 0],
            [9, 0], // Dark positions pair with light
            [6, 1],
            [7, 1],
            [8, 1],
            [9, 1],
            [7, 2],
            [8, 2],
            [9, 2],
            [8, 3],
            [9, 3],
            [9, 4],
          ],
        },
        wcagAAA: {
          normal: [
            [0, 7],
            [0, 8],
            [0, 9], // Stricter AAA requirements
            [1, 8],
            [1, 9],
            [2, 9],
            [7, 0],
            [8, 0],
            [9, 0],
            [8, 1],
            [9, 1],
            [9, 2],
          ],
        },
        onWhite: {
          wcagAA: true,
          wcagAAA: false,
          contrastRatio: 4.8,
          aa: [6, 7, 8, 9],
          aaa: [7, 8, 9],
        },
        onBlack: {
          wcagAA: true,
          wcagAAA: true,
          contrastRatio: 8.2,
          aa: [0, 1, 2, 3, 4],
          aaa: [0, 1, 2, 3],
        },
      },
    },
    category: 'color-family',
    namespace: 'color',
    semanticMeaning: 'Ocean blue color family',
  };

  const mockNeutralToken: Token = {
    name: 'neutral-grayscale',
    value: {
      name: 'Neutral Grayscale',
      scale: [
        { l: 0.95, c: 0.0, h: 0 }, // 100
        { l: 0.9, c: 0.0, h: 0 }, // 200
        { l: 0.8, c: 0.0, h: 0 }, // 300
        { l: 0.7, c: 0.0, h: 0 }, // 400
        { l: 0.6, c: 0.0, h: 0 }, // 500
        { l: 0.5, c: 0.0, h: 0 }, // 600
        { l: 0.4, c: 0.0, h: 0 }, // 700
        { l: 0.3, c: 0.0, h: 0 }, // 800
        { l: 0.1, c: 0.0, h: 0 }, // 900
      ],
    },
    category: 'color-family',
    namespace: 'color',
    semanticMeaning: 'Neutral grayscale family',
  };

  describe('Plugin Loading', () => {
    it('should load built-in plugins', async () => {
      const plugins = await loadPlugins();

      expect(plugins.size).toBeGreaterThan(0);

      // All 5 rule types from generation-rules.ts should be available
      expect(plugins.has('scale')).toBe(true);
      expect(plugins.has('state')).toBe(true);
      expect(plugins.has('contrast')).toBe(true);
      expect(plugins.has('calc')).toBe(true);
      expect(plugins.has('invert')).toBe(true);
      expect(plugins.has('example')).toBe(true);

      // Should have at least 6 plugins (5 rules + example)
      expect(plugins.size).toBeGreaterThanOrEqual(6);
    });
  });

  describe('Rule Execution', () => {
    it('should execute scale rule', async () => {
      const registry = new TokenRegistry();
      registry.add(mockColorFamilyToken);

      // Create semantic token that depends on the family
      const semanticToken: Token = {
        name: 'primary-600',
        value: '', // Will be populated by rule
        category: 'color',
        namespace: 'rafters',
        semanticMeaning: 'Primary color at 600 weight',
      };
      registry.add(semanticToken);
      registry.addDependency('primary-600', ['ocean-blue'], 'scale');

      const context = await createRuleContext(registry);
      const result = executeRule('scale', 'primary-600', context);

      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('family');
      expect(result).toHaveProperty('position');

      const colorRef = result as { family: string; position: string | number };
      expect(colorRef.family).toBe('ocean-blue');
      expect(colorRef.position).toBe('600');
    });

    it('should execute state rule with pre-computed references', async () => {
      const registry = new TokenRegistry();
      registry.add(mockColorFamilyToken);

      // Create semantic token for hover state
      const hoverToken: Token = {
        name: 'primary-hover',
        value: '', // Will be populated by rule
        category: 'color',
        namespace: 'rafters',
        semanticMeaning: 'Primary color hover state',
      };
      registry.add(hoverToken);
      registry.addDependency('primary-hover', ['ocean-blue'], 'state');

      const context = await createRuleContext(registry);
      const result = executeRule('state', 'primary-hover', context);

      expect(typeof result).toBe('object');
      const colorRef = result as { family: string; position: string | number };
      expect(colorRef.family).toBe('ocean-blue');
      expect(colorRef.position).toBe(7);
    });

    it('should execute contrast rule with pre-computed references', async () => {
      const registry = new TokenRegistry();
      registry.add(mockColorFamilyToken);
      registry.add(mockNeutralToken);

      // Create semantic token for foreground
      const foregroundToken: Token = {
        name: 'primary-foreground',
        value: '', // Will be populated by rule
        category: 'color',
        namespace: 'rafters',
        semanticMeaning: 'Primary color foreground',
      };
      registry.add(foregroundToken);
      registry.addDependency('primary-foreground', ['ocean-blue'], 'contrast');

      const context = await createRuleContext(registry);
      const result = executeRule('contrast', 'primary-foreground', context);

      expect(typeof result).toBe('object');
      const colorRef = result as { family: string; position: string | number };
      expect(colorRef.family).toBe('neutral-grayscale');
      expect(colorRef.position).toBe(9);
    });

    it('should execute contrast rule using WCAG accessibility data', async () => {
      // Create a color family WITHOUT pre-computed foreground references
      const wcagTestToken: Token = {
        name: 'test-blue',
        value: {
          name: 'Test Blue',
          scale: [
            { l: 0.9, c: 0.05, h: 220 }, // 100 (index 0)
            { l: 0.8, c: 0.08, h: 220 }, // 200 (index 1)
            { l: 0.7, c: 0.12, h: 220 }, // 300 (index 2)
            { l: 0.6, c: 0.15, h: 220 }, // 400 (index 3)
            { l: 0.5, c: 0.18, h: 220 }, // 500 (index 4)
            { l: 0.4, c: 0.2, h: 220 }, // 600 (index 5)
            { l: 0.3, c: 0.18, h: 220 }, // 700 (index 6)
            { l: 0.2, c: 0.15, h: 220 }, // 800 (index 7)
            { l: 0.1, c: 0.1, h: 220 }, // 900 (index 8)
          ],
          // NO foregroundReferences - should use WCAG data
          accessibility: {
            wcagAA: {
              normal: [
                [0, 6],
                [0, 7],
                [0, 8], // Light positions pair with dark
                [1, 6],
                [1, 7],
                [1, 8],
                [2, 7],
                [2, 8],
                [3, 8],
                [6, 0],
                [7, 0],
                [8, 0], // Dark positions pair with light
                [6, 1],
                [7, 1],
                [8, 1],
                [7, 2],
                [8, 2],
                [8, 3],
              ],
            },
            wcagAAA: {
              normal: [
                [0, 7],
                [0, 8], // Stricter AAA: position 0 pairs with 7, 8
                [1, 8],
                [7, 0],
                [8, 0], // position 7 pairs with 0
                [8, 1],
              ],
            },
          },
        },
        category: 'color-family',
        namespace: 'color',
        semanticMeaning: 'Test blue color family',
      };

      const registry = new TokenRegistry();
      registry.add(wcagTestToken);

      // Create a primary token at position 0 (light)
      const primaryToken: Token = {
        name: 'primary',
        value: { family: 'test-blue', position: '0' },
        category: 'color',
        namespace: 'rafters',
        semanticMeaning: 'Primary brand color',
      };
      registry.add(primaryToken);

      // Create contrast token
      const contrastToken: Token = {
        name: 'primary-foreground',
        value: '', // Will be populated by rule
        category: 'color',
        namespace: 'rafters',
        semanticMeaning: 'Primary contrast foreground',
      };
      registry.add(contrastToken);
      registry.addDependency('primary-foreground', ['test-blue'], 'contrast');

      const context = await createRuleContext(registry);
      const result = executeRule('contrast', 'primary-foreground', context);

      expect(typeof result).toBe('object');
      const colorRef = result as { family: string; position: string | number };
      expect(colorRef.family).toBe('test-blue');

      // Position 0 should pair with position 7 according to WCAG AAA data: [0, 7]
      expect(colorRef.position).toBe('700');
    });

    it('should execute calc rule with musical intervals', async () => {
      const registry = new TokenRegistry();

      // Create base spacing token
      const baseToken: Token = {
        name: 'spacing-base',
        value: '16px',
        category: 'spacing',
        namespace: 'spacing',
        semanticMeaning: 'Base spacing unit',
      };
      registry.add(baseToken);

      // Create calc token with explicit math relationship
      const calcToken: Token = {
        name: 'spacing-base-golden',
        value: '', // Will be calculated
        category: 'spacing',
        namespace: 'spacing',
        semanticMeaning: 'Golden ratio spacing',
        mathRelationship: '{spacing-base} * golden', // Explicit calc expression
      };
      registry.add(calcToken);
      registry.addDependency('spacing-base-golden', ['spacing-base'], 'calc');

      const context = await createRuleContext(registry);
      const result = executeRule('calc', 'spacing-base-golden', context);

      expect(typeof result).toBe('string');
      // 16px * golden ratio ≈ 25.888px (allowing for floating point precision)
      expect(result).toMatch(/25\.888\d*px/);
    });

    it('should throw error for unknown rule type', async () => {
      const registry = new TokenRegistry();
      const context = await createRuleContext(registry);

      expect(() => {
        executeRule('unknown-rule', 'some-token', context);
      }).toThrow('Unknown rule type: unknown-rule');
    });
  });
});
