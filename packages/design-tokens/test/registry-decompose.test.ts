/**
 * Tests for TokenRegistry decompose/recompose methods
 */

import type { Token } from '@rafters/shared';
import { beforeEach, describe, expect, it } from 'vitest';
import { TokenRegistry } from '../src/registry.js';

describe('TokenRegistry Color Decompose/Recompose', () => {
  let registry: TokenRegistry;

  beforeEach(() => {
    registry = new TokenRegistry();
  });

  describe('decomposeColor', () => {
    it('should handle simple string tokens unchanged', () => {
      const simpleToken: Token = {
        name: 'spacing-md',
        value: '1rem',
        category: 'spacing',
        namespace: 'spacing',
      };

      registry.decomposeColor(simpleToken);

      const result = registry.get('spacing-md');
      expect(result).toEqual(simpleToken);
    });

    it('should decompose complex color token with states', () => {
      const colorToken: Token = {
        name: 'primary',
        value: {
          scale: [500, 600, 700],
          values: ['oklch(0.6 0.12 240)', 'oklch(0.5 0.14 240)', 'oklch(0.4 0.16 240)'],
          baseColor: 'blue-600',
          states: {
            hover: 'blue-700',
            focus: 'blue-500',
            active: 'blue-800',
          },
        },
        category: 'color',
        namespace: 'color',
        semanticMeaning: 'Primary brand color',
        cognitiveLoad: 3,
        trustLevel: 'high',
      };

      registry.decomposeColor(colorToken);

      // Check base token
      const baseToken = registry.get('primary');
      expect(baseToken).toEqual({
        name: 'primary',
        value: 'blue-600',
        category: 'color',
        namespace: 'color',
        semanticMeaning: 'Primary brand color',
        cognitiveLoad: 3,
        trustLevel: 'high',
      });

      // Check state tokens
      const hoverToken = registry.get('primary-hover');
      expect(hoverToken?.value).toBe('blue-700');
      expect(hoverToken?.semanticMeaning).toBe('hover state for primary');

      const focusToken = registry.get('primary-focus');
      expect(focusToken?.value).toBe('blue-500');

      const activeToken = registry.get('primary-active');
      expect(activeToken?.value).toBe('blue-800');

      // Check scale tokens
      const scale500Token = registry.get('primary-500');
      expect(scale500Token?.value).toBe('oklch(0.6 0.12 240)');
      expect(scale500Token?.semanticMeaning).toBe('primary shade 500');

      const scale600Token = registry.get('primary-600');
      expect(scale600Token?.value).toBe('oklch(0.5 0.14 240)');

      const scale700Token = registry.get('primary-700');
      expect(scale700Token?.value).toBe('oklch(0.4 0.16 240)');
    });

    it('should track dependencies correctly', () => {
      const colorToken: Token = {
        name: 'accent',
        value: {
          scale: [400, 500],
          values: ['oklch(0.7 0.1 300)', 'oklch(0.6 0.12 300)'],
          baseColor: 'purple-500',
          states: {
            hover: 'purple-600',
          },
        },
        category: 'color',
        namespace: 'color',
      };

      registry.decomposeColor(colorToken);

      // Check dependencies
      const dependents = registry.getDependents('accent');
      expect(dependents).toContain('accent-hover');
      expect(dependents).toContain('accent-400');
      expect(dependents).toContain('accent-500');

      // Check generation rules
      expect(registry.dependencyGraph.getGenerationRule('accent-hover')).toBe('state:hover');
      expect(registry.dependencyGraph.getGenerationRule('accent-400')).toBe('scale:400');
      expect(registry.dependencyGraph.getGenerationRule('accent-500')).toBe('scale:500');
    });
  });

  describe('recomposeColor', () => {
    it('should return undefined for non-existent tokens', () => {
      const result = registry.recomposeColor('non-existent');
      expect(result).toBeUndefined();
    });

    it('should return simple token unchanged if no dependencies', () => {
      const simpleToken: Token = {
        name: 'border-width',
        value: '1px',
        category: 'border',
        namespace: 'border',
      };

      registry.decomposeColor(simpleToken);
      const result = registry.recomposeColor('border-width');

      expect(result).toEqual(simpleToken);
    });

    it('should recompose complex color token with states and scale', () => {
      // First decompose
      const originalToken: Token = {
        name: 'secondary',
        value: {
          scale: [300, 400, 500],
          values: ['oklch(0.8 0.08 180)', 'oklch(0.7 0.1 180)', 'oklch(0.6 0.12 180)'],
          baseColor: 'green-400',
          states: {
            hover: 'green-500',
            focus: 'green-300',
            disabled: 'green-200',
          },
        },
        category: 'color',
        namespace: 'color',
        semanticMeaning: 'Secondary brand color',
        cognitiveLoad: 2,
        trustLevel: 'medium',
      };

      registry.decomposeColor(originalToken);

      // Then recompose
      const recomposed = registry.recomposeColor('secondary');

      expect(recomposed).toBeDefined();
      expect(recomposed?.name).toBe('secondary');
      expect(recomposed?.category).toBe('color');
      expect(recomposed?.semanticMeaning).toBe('Secondary brand color');
      expect(recomposed?.cognitiveLoad).toBe(2);
      expect(recomposed?.trustLevel).toBe('medium');

      // Check complex value structure
      expect(typeof recomposed?.value).toBe('object');
      if (typeof recomposed?.value === 'object') {
        expect(recomposed.value.baseColor).toBe('green-400');
        expect(recomposed.value.scale).toEqual([300, 400, 500]);
        expect(recomposed.value.values).toEqual([
          'oklch(0.8 0.08 180)',
          'oklch(0.7 0.1 180)',
          'oklch(0.6 0.12 180)',
        ]);
        expect(recomposed.value.states).toEqual({
          hover: 'green-500',
          focus: 'green-300',
          disabled: 'green-200',
        });
      }
    });

    it('should handle states-only color token', () => {
      const statesOnlyToken: Token = {
        name: 'warning',
        value: {
          scale: [],
          values: [],
          baseColor: 'amber-500',
          states: {
            hover: 'amber-600',
            focus: 'amber-400',
          },
        },
        category: 'color',
        namespace: 'color',
      };

      registry.decomposeColor(statesOnlyToken);
      const recomposed = registry.recomposeColor('warning');

      expect(typeof recomposed?.value).toBe('object');
      if (typeof recomposed?.value === 'object') {
        expect(recomposed.value.baseColor).toBe('amber-500');
        expect(recomposed.value.states).toEqual({
          hover: 'amber-600',
          focus: 'amber-400',
        });
        // Should not have scale/values since they were empty
        expect(recomposed.value).not.toHaveProperty('scale');
        expect(recomposed.value).not.toHaveProperty('values');
      }
    });

    it('should sort scale data correctly', () => {
      const colorToken: Token = {
        name: 'info',
        value: {
          scale: [800, 400, 600], // Unsorted
          values: ['oklch(0.3 0.12 210)', 'oklch(0.7 0.08 210)', 'oklch(0.5 0.1 210)'],
          baseColor: 'blue-600',
        },
        category: 'color',
        namespace: 'color',
      };

      registry.decomposeColor(colorToken);
      const recomposed = registry.recomposeColor('info');

      if (typeof recomposed?.value === 'object') {
        // Should be sorted by scale number
        expect(recomposed.value.scale).toEqual([400, 600, 800]);
        expect(recomposed.value.values).toEqual([
          'oklch(0.7 0.08 210)', // 400
          'oklch(0.5 0.1 210)', // 600
          'oklch(0.3 0.12 210)', // 800
        ]);
      }
    });
  });

  describe('Round-trip consistency', () => {
    it('should maintain consistency through decompose -> recompose cycle', () => {
      const originalToken: Token = {
        name: 'brand',
        value: {
          scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
          values: [
            'oklch(0.95 0.02 260)',
            'oklch(0.9 0.04 260)',
            'oklch(0.85 0.06 260)',
            'oklch(0.8 0.08 260)',
            'oklch(0.7 0.1 260)',
            'oklch(0.6 0.12 260)',
            'oklch(0.5 0.14 260)',
            'oklch(0.4 0.16 260)',
            'oklch(0.3 0.18 260)',
            'oklch(0.2 0.2 260)',
          ],
          baseColor: 'indigo-600',
          states: {
            hover: 'indigo-700',
            focus: 'indigo-500',
            active: 'indigo-800',
            disabled: 'indigo-300',
          },
        },
        category: 'color',
        namespace: 'color',
        semanticMeaning: 'Brand identity color',
        cognitiveLoad: 4,
        trustLevel: 'high',
      };

      // Decompose then recompose
      registry.decomposeColor(originalToken);
      const recomposed = registry.recomposeColor('brand');

      // Should match original structure (order might vary for states)
      expect(recomposed?.name).toBe(originalToken.name);
      expect(recomposed?.category).toBe(originalToken.category);
      expect(recomposed?.semanticMeaning).toBe(originalToken.semanticMeaning);
      expect(recomposed?.cognitiveLoad).toBe(originalToken.cognitiveLoad);
      expect(recomposed?.trustLevel).toBe(originalToken.trustLevel);

      if (typeof recomposed?.value === 'object' && typeof originalToken.value === 'object') {
        expect(recomposed.value.baseColor).toBe(originalToken.value.baseColor);
        expect(recomposed.value.scale).toEqual(originalToken.value.scale);
        expect(recomposed.value.values).toEqual(originalToken.value.values);
        expect(recomposed.value.states).toEqual(originalToken.value.states);
      }
    });
  });
});
