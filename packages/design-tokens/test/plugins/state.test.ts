/**
 * State Plugin Tests
 *
 * Tests the state plugin that generates hover, active, focus, and disabled
 * state variations for color tokens.
 */

import type { ColorValue, Token } from '@rafters/shared';
import { beforeEach, describe, expect, it } from 'vitest';
import statePlugin from '../../src/plugins/state.js';
import { TokenRegistry } from '../../src/registry.js';

describe('State Plugin', () => {
  let registry: TokenRegistry;

  beforeEach(() => {
    registry = new TokenRegistry();

    // Extended ColorValue with state references
    type ExtendedColorValue = ColorValue & {
      stateReferences?: Record<string, { family: string; position: string | number }>;
    };

    const colorValueWithStates: ExtendedColorValue = {
      name: 'primary-blue',
      scale: [
        { l: 0.95, c: 0.01, h: 240 }, // 50
        { l: 0.9, c: 0.02, h: 240 }, // 100
        { l: 0.8, c: 0.05, h: 240 }, // 200
        { l: 0.7, c: 0.08, h: 240 }, // 300
        { l: 0.6, c: 0.12, h: 240 }, // 400
        { l: 0.5, c: 0.15, h: 240 }, // 500
        { l: 0.4, c: 0.18, h: 240 }, // 600
        { l: 0.3, c: 0.2, h: 240 }, // 700
        { l: 0.2, c: 0.22, h: 240 }, // 800
        { l: 0.1, c: 0.25, h: 240 }, // 900
      ],
      stateReferences: {
        hover: { family: 'primary-family', position: '600' },
        active: { family: 'primary-family', position: '700' },
        focus: { family: 'primary-family', position: '550' },
        disabled: { family: 'primary-family', position: '300' },
      },
    };

    const colorValueWithoutStates: ColorValue = {
      name: 'secondary-green',
      scale: [
        { l: 0.95, c: 0.01, h: 120 },
        { l: 0.9, c: 0.02, h: 120 },
        { l: 0.8, c: 0.05, h: 120 },
        { l: 0.7, c: 0.08, h: 120 },
        { l: 0.6, c: 0.12, h: 120 },
        { l: 0.5, c: 0.15, h: 120 },
        { l: 0.4, c: 0.18, h: 120 },
        { l: 0.3, c: 0.2, h: 120 },
        { l: 0.2, c: 0.22, h: 120 },
        { l: 0.1, c: 0.25, h: 120 },
      ],
    };

    const mockTokens: Token[] = [
      {
        name: 'primary-family',
        value: colorValueWithStates,
        category: 'color-family',
        namespace: 'color',
      },
      {
        name: 'secondary-family',
        value: colorValueWithoutStates,
        category: 'color-family',
        namespace: 'color',
      },
      {
        name: 'text-token',
        value: 'not a color value',
        category: 'typography',
        namespace: 'text',
      },
    ];

    for (const token of mockTokens) {
      registry.add(token);
    }
  });

  describe('State Extraction from Token Names', () => {
    it('should extract hover state from token name', () => {
      const result = statePlugin(registry, 'primary-hover', ['primary-family']);

      expect(result.family).toBe('primary-family');
      expect(result.position).toBe('600'); // Pre-computed state reference
    });

    it('should extract active state from token name', () => {
      const result = statePlugin(registry, 'primary-active', ['primary-family']);

      expect(result.family).toBe('primary-family');
      expect(result.position).toBe('700'); // Pre-computed state reference
    });

    it('should extract focus state from token name', () => {
      const result = statePlugin(registry, 'primary-focus', ['primary-family']);

      expect(result.family).toBe('primary-family');
      expect(result.position).toBe('550'); // Pre-computed state reference
    });

    it('should extract disabled state from token name', () => {
      const result = statePlugin(registry, 'primary-disabled', ['primary-family']);

      expect(result.family).toBe('primary-family');
      expect(result.position).toBe('300'); // Pre-computed state reference
    });
  });

  describe('Pre-computed State References', () => {
    it('should use stateReferences when available', () => {
      const states = ['hover', 'active', 'focus', 'disabled'];
      const expectedPositions = ['600', '700', '550', '300'];

      states.forEach((state, index) => {
        const result = statePlugin(registry, `primary-${state}`, ['primary-family']);

        expect(result.family).toBe('primary-family');
        expect(result.position).toBe(expectedPositions[index]);
      });
    });

    it('should use exact stateReferences values', () => {
      // Test that we get exact pre-computed values, not calculated fallbacks
      const result = statePlugin(registry, 'primary-hover', ['primary-family']);

      expect(result.position).toBe('600'); // Exact pre-computed value
      expect(typeof result.position).toBe('string'); // Should be string format
    });
  });

  describe('Fallback State Calculation', () => {
    it('should calculate hover state when no stateReferences exist', () => {
      const result = statePlugin(registry, 'secondary-hover', ['secondary-family']);

      expect(result.family).toBe('secondary-family');
      expect(result.position).toBe('600'); // 500 + 100
    });

    it('should calculate active state when no stateReferences exist', () => {
      const result = statePlugin(registry, 'secondary-active', ['secondary-family']);

      expect(result.family).toBe('secondary-family');
      expect(result.position).toBe('700'); // 500 + 200
    });

    it('should calculate focus state when no stateReferences exist', () => {
      const result = statePlugin(registry, 'secondary-focus', ['secondary-family']);

      expect(result.family).toBe('secondary-family');
      expect(result.position).toBe('550'); // 500 + 50
    });

    it('should calculate disabled state when no stateReferences exist', () => {
      const result = statePlugin(registry, 'secondary-disabled', ['secondary-family']);

      expect(result.family).toBe('secondary-family');
      expect(result.position).toBe('300'); // 500 - 200
    });
  });

  describe('Position Clamping in Fallback', () => {
    it('should clamp positions to valid range (100-900)', () => {
      // Test extreme cases that would go beyond valid range
      const extremeToken: Token = {
        name: 'extreme-family',
        value: {
          name: 'extreme-color',
          scale: [{ l: 0.5, c: 0.1, h: 180 }],
        } as ColorValue,
        category: 'color-family',
        namespace: 'color',
      };
      registry.add(extremeToken);

      // These should be clamped to valid range
      const hover = statePlugin(registry, 'extreme-hover', ['extreme-family']);
      const disabled = statePlugin(registry, 'extreme-disabled', ['extreme-family']);

      expect(Number.parseInt(hover.position as string, 10)).toBeGreaterThanOrEqual(100);
      expect(Number.parseInt(hover.position as string, 10)).toBeLessThanOrEqual(900);
      expect(Number.parseInt(disabled.position as string, 10)).toBeGreaterThanOrEqual(100);
      expect(Number.parseInt(disabled.position as string, 10)).toBeLessThanOrEqual(900);
    });
  });

  describe('Complex Token Name Patterns', () => {
    it('should handle prefixed token names', () => {
      const result = statePlugin(registry, 'brand-primary-hover', ['primary-family']);

      expect(result.family).toBe('primary-family');
      expect(result.position).toBe('600');
    });

    it('should handle semantic token names', () => {
      const semanticTokens = ['danger-hover', 'success-active', 'warning-focus', 'info-disabled'];

      semanticTokens.forEach((tokenName) => {
        const _state = tokenName.split('-')[1];
        const result = statePlugin(registry, tokenName, ['primary-family']);

        expect(result.family).toBe('primary-family');
        expect(typeof result.position).toBe('string');
      });
    });

    it('should handle nested semantic names', () => {
      const result = statePlugin(registry, 'ui-semantic-primary-hover', ['primary-family']);

      expect(result.family).toBe('primary-family');
      expect(result.position).toBe('600');
    });
  });

  describe('Error Handling', () => {
    it('should throw error when token name has no state suffix', () => {
      expect(() => {
        statePlugin(registry, 'invalid-token-name', ['primary-family']);
      }).toThrow('Cannot extract state from token name: invalid-token-name');
    });

    it('should throw error when no dependencies provided', () => {
      expect(() => {
        statePlugin(registry, 'primary-hover', []);
      }).toThrow('No dependencies found for state rule on token: primary-hover');
    });

    it('should throw error when family token not found', () => {
      expect(() => {
        statePlugin(registry, 'primary-hover', ['nonexistent-family']);
      }).toThrow('ColorValue family token nonexistent-family not found for state rule');
    });

    it('should throw error when dependency is not a ColorValue', () => {
      expect(() => {
        statePlugin(registry, 'text-hover', ['text-token']);
      }).toThrow('ColorValue family token text-token not found for state rule');
    });

    it('should throw error for invalid state names', () => {
      expect(() => {
        statePlugin(registry, 'primary-invalid', ['primary-family']);
      }).toThrow('Cannot extract state from token name: primary-invalid');
    });
  });

  describe('Return Value Structure', () => {
    it('should return object with family and position properties', () => {
      const result = statePlugin(registry, 'primary-hover', ['primary-family']);

      expect(result).toHaveProperty('family');
      expect(result).toHaveProperty('position');
      expect(typeof result.family).toBe('string');
      expect(typeof result.position).toBe('string');
    });

    it('should return consistent structure for all states', () => {
      const states = ['hover', 'active', 'focus', 'disabled'];

      states.forEach((state) => {
        const result = statePlugin(registry, `primary-${state}`, ['primary-family']);

        expect(result).toHaveProperty('family');
        expect(result).toHaveProperty('position');
        expect(result.family).toBe('primary-family');
      });
    });
  });

  describe('Multiple Dependencies', () => {
    it('should use first dependency as family reference', () => {
      const result = statePlugin(registry, 'test-hover', ['primary-family', 'secondary-family']);

      expect(result.family).toBe('primary-family'); // First dependency
    });
  });

  describe('State Calculation Logic', () => {
    it('should apply correct position adjustments for each state', () => {
      const expectedAdjustments = {
        hover: 100, // +100 from base
        active: 200, // +200 from base
        focus: 50, // +50 from base
        disabled: -200, // -200 from base (but clamped)
      };

      Object.entries(expectedAdjustments).forEach(([state, adjustment]) => {
        const result = statePlugin(registry, `secondary-${state}`, ['secondary-family']);
        const expectedPosition = Math.min(900, Math.max(100, 500 + adjustment));

        expect(result.position).toBe(expectedPosition.toString());
      });
    });
  });

  describe('Integration with Color Families', () => {
    it('should work with different color family types', () => {
      const families = ['primary-family', 'secondary-family'];

      families.forEach((family) => {
        const result = statePlugin(registry, 'test-hover', [family]);

        expect(result.family).toBe(family);
        expect(typeof result.position).toBe('string');
      });
    });
  });
});
