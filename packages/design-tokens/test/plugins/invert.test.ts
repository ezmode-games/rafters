/**
 * Invert Plugin Tests
 *
 * Tests the invert plugin that creates dark mode variants by mathematically
 * inverting colors and positions.
 */

import type { ColorValue, Token } from '@rafters/shared';
import { beforeEach, describe, expect, it } from 'vitest';
import invertPlugin from '../../src/plugins/invert.js';
import { TokenRegistry } from '../../src/registry.js';

describe('Invert Plugin', () => {
  let registry: TokenRegistry;

  beforeEach(() => {
    registry = new TokenRegistry();

    // Extended ColorValue with dark mode references
    type ExtendedColorValue = ColorValue & {
      darkModeReferences?: Record<number, { family: string; position: string | number }>;
      darkModeFamily?: string;
    };

    const colorValueWithDarkModeRefs: ExtendedColorValue = {
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
      darkModeReferences: {
        1: { family: 'primary-dark-family', position: '800' }, // 100 -> dark 800
        2: { family: 'primary-dark-family', position: '700' }, // 200 -> dark 700
        6: { family: 'primary-dark-family', position: '300' }, // 600 -> dark 300
        8: { family: 'primary-dark-family', position: '200' }, // 800 -> dark 200
      },
    };

    const colorValueWithDarkModeFamily: ExtendedColorValue = {
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
      darkModeFamily: 'secondary-dark-family',
    };

    const simplColorValue: ColorValue = {
      name: 'accent-red',
      scale: [
        { l: 0.95, c: 0.01, h: 0 },
        { l: 0.9, c: 0.02, h: 0 },
        { l: 0.8, c: 0.05, h: 0 },
        { l: 0.7, c: 0.08, h: 0 },
        { l: 0.6, c: 0.12, h: 0 },
        { l: 0.5, c: 0.15, h: 0 },
        { l: 0.4, c: 0.18, h: 0 },
        { l: 0.3, c: 0.2, h: 0 },
        { l: 0.2, c: 0.22, h: 0 },
        { l: 0.1, c: 0.25, h: 0 },
      ],
    };

    const mockTokens: Token[] = [
      // Color families
      {
        name: 'primary-family',
        value: colorValueWithDarkModeRefs,
        category: 'color-family',
        namespace: 'color',
      },
      {
        name: 'secondary-family',
        value: colorValueWithDarkModeFamily,
        category: 'color-family',
        namespace: 'color',
      },
      {
        name: 'accent-family',
        value: simplColorValue,
        category: 'color-family',
        namespace: 'color',
      },
      // Dark mode families
      {
        name: 'primary-dark-family',
        value: {
          name: 'primary-dark',
          scale: [{ l: 0.1, c: 0.25, h: 240 }], // Dark variant
        } as ColorValue,
        category: 'color-family',
        namespace: 'color',
      },
      {
        name: 'secondary-dark-family',
        value: {
          name: 'secondary-dark',
          scale: [{ l: 0.1, c: 0.25, h: 120 }], // Dark variant
        } as ColorValue,
        category: 'color-family',
        namespace: 'color',
      },
      // Semantic tokens with ColorReference values
      {
        name: 'primary-600',
        value: { family: 'primary-family', position: '600' },
        category: 'color',
        namespace: 'color',
      },
      {
        name: 'primary-200',
        value: { family: 'primary-family', position: '200' },
        category: 'color',
        namespace: 'color',
      },
      {
        name: 'secondary-500',
        value: { family: 'secondary-family', position: '500' },
        category: 'color',
        namespace: 'color',
      },
      // Simple color tokens
      {
        name: 'simple-color',
        value: 'oklch(0.7 0.15 240)',
        category: 'color',
        namespace: 'color',
      },
      {
        name: 'hex-color',
        value: '#3b82f6',
        category: 'color',
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

  describe('Dark Mode References (Priority 1)', () => {
    it('should use pre-computed darkModeReferences when available', () => {
      const result = invertPlugin(registry, 'primary-600-dark', ['primary-600']);

      expect(result.family).toBe('primary-dark-family');
      expect(result.position).toBe('300'); // Pre-computed dark mode reference
    });

    it('should work with different positions that have darkModeReferences', () => {
      const testCases = [
        { token: 'primary-200', expectedFamily: 'primary-dark-family', expectedPosition: '700' },
        { token: 'primary-600', expectedFamily: 'primary-dark-family', expectedPosition: '300' },
      ];

      testCases.forEach(({ token, expectedFamily, expectedPosition }) => {
        const result = invertPlugin(registry, `${token}-dark`, [token]);

        expect(result.family).toBe(expectedFamily);
        expect(result.position).toBe(expectedPosition);
      });
    });

    it('should handle string and number position types', () => {
      // Test with string position
      const stringResult = invertPlugin(registry, 'primary-200-dark', ['primary-200']);
      expect(stringResult.family).toBe('primary-dark-family');
      expect(stringResult.position).toBe('700');

      // Add token with number position
      registry.add({
        name: 'primary-800-num',
        value: { family: 'primary-family', position: 800 },
        category: 'color',
        namespace: 'color',
      });

      const numberResult = invertPlugin(registry, 'primary-800-dark', ['primary-800-num']);
      expect(numberResult.family).toBe('primary-dark-family');
      expect(numberResult.position).toBe('200');
    });
  });

  describe('Mathematical Position Inversion (Fallback)', () => {
    it('should mathematically invert positions when no darkModeReferences exist', () => {
      // Add a token that maps to a position without darkModeReferences
      registry.add({
        name: 'primary-400',
        value: { family: 'primary-family', position: '400' },
        category: 'color',
        namespace: 'color',
      });

      const result = invertPlugin(registry, 'primary-400-dark', ['primary-400']);

      expect(result.family).toBe('primary-family'); // Same family
      expect(result.position).toBe('600'); // 1000 - 400 = 600
    });

    it('should apply correct mathematical inversion formula', () => {
      const testCases = [
        { input: '100', expected: '900' }, // 1000 - 100 = 900
        { input: '300', expected: '700' }, // 1000 - 300 = 700
        { input: '500', expected: '500' }, // 1000 - 500 = 500
        { input: '700', expected: '300' }, // 1000 - 700 = 300
        { input: '900', expected: '100' }, // 1000 - 900 = 100
      ];

      testCases.forEach(({ input, expected }) => {
        registry.add({
          name: `test-${input}`,
          value: { family: 'accent-family', position: input },
          category: 'color',
          namespace: 'color',
        });

        const result = invertPlugin(registry, `test-${input}-dark`, [`test-${input}`]);

        expect(result.family).toBe('accent-family');
        expect(result.position).toBe(expected);
      });
    });

    it('should clamp inverted positions to valid range (100-900)', () => {
      // Test extreme values that would go outside valid range
      registry.add({
        name: 'test-50',
        value: { family: 'accent-family', position: '50' },
        category: 'color',
        namespace: 'color',
      });

      registry.add({
        name: 'test-950',
        value: { family: 'accent-family', position: '950' },
        category: 'color',
        namespace: 'color',
      });

      const result50 = invertPlugin(registry, 'test-50-dark', ['test-50']);
      const result950 = invertPlugin(registry, 'test-950-dark', ['test-950']);

      expect(Number.parseInt(result50.position as string, 10)).toBeGreaterThanOrEqual(100);
      expect(Number.parseInt(result50.position as string, 10)).toBeLessThanOrEqual(900);
      expect(Number.parseInt(result950.position as string, 10)).toBeGreaterThanOrEqual(100);
      expect(Number.parseInt(result950.position as string, 10)).toBeLessThanOrEqual(900);
    });
  });

  describe('Dark Mode Family References', () => {
    it('should use darkModeFamily when inverting family tokens', () => {
      const result = invertPlugin(registry, 'secondary-family-dark', ['secondary-family']);

      expect(result.family).toBe('secondary-dark-family');
      expect(result.position).toBe(500); // Default middle position
    });

    it('should fall back to same family when no darkModeFamily exists', () => {
      const result = invertPlugin(registry, 'accent-family-dark', ['accent-family']);

      expect(result.family).toBe('accent-family');
      expect(result.position).toBe(500); // Default middle position
    });
  });

  describe('Simple Color Value Inversion', () => {
    it('should handle OKLCH color inversion', () => {
      const result = invertPlugin(registry, 'simple-color-dark', ['simple-color']);

      // For simple color values, returns synthetic reference
      expect(result.family).toBe('simple-color');
      expect(result.position).toBe('inverted');
    });

    it('should handle hex color values', () => {
      const result = invertPlugin(registry, 'hex-color-dark', ['hex-color']);

      expect(result.family).toBe('hex-color');
      expect(result.position).toBe('inverted');
    });
  });

  describe('Error Handling', () => {
    it('should throw error when no dependencies provided', () => {
      expect(() => {
        invertPlugin(registry, 'primary-dark', []);
      }).toThrow('No dependencies found for invert rule on token: primary-dark');
    });

    it('should throw error when base token not found', () => {
      expect(() => {
        invertPlugin(registry, 'primary-dark', ['nonexistent-token']);
      }).toThrow('Base token nonexistent-token not found for invert rule');
    });

    it('should throw error when ColorReference family not found', () => {
      registry.add({
        name: 'broken-ref',
        value: { family: 'nonexistent-family', position: '500' },
        category: 'color',
        namespace: 'color',
      });

      expect(() => {
        invertPlugin(registry, 'broken-dark', ['broken-ref']);
      }).toThrow('ColorValue family token nonexistent-family not found for invert rule');
    });

    it('should throw error when referenced family is not a ColorValue', () => {
      registry.add({
        name: 'invalid-ref',
        value: { family: 'text-token', position: '500' },
        category: 'color',
        namespace: 'color',
      });

      expect(() => {
        invertPlugin(registry, 'invalid-dark', ['invalid-ref']);
      }).toThrow('ColorValue family token text-token not found for invert rule');
    });
  });

  describe('Return Value Structure', () => {
    it('should return object with family and position properties', () => {
      const result = invertPlugin(registry, 'primary-600-dark', ['primary-600']);

      expect(result).toHaveProperty('family');
      expect(result).toHaveProperty('position');
      expect(typeof result.family).toBe('string');
      expect(typeof result.position).toBe('string');
    });

    it('should maintain consistent structure across different inversion methods', () => {
      const precomputedResult = invertPlugin(registry, 'primary-600-dark', ['primary-600']);
      const mathematicalResult = invertPlugin(registry, 'secondary-family-dark', [
        'secondary-family',
      ]);
      const simpleResult = invertPlugin(registry, 'simple-color-dark', ['simple-color']);

      [precomputedResult, mathematicalResult, simpleResult].forEach((result) => {
        expect(result).toHaveProperty('family');
        expect(result).toHaveProperty('position');
        expect(typeof result.family).toBe('string');
      });
    });
  });

  describe('Multiple Dependencies', () => {
    it('should use first dependency as base token', () => {
      const result = invertPlugin(registry, 'test-dark', ['primary-600', 'secondary-500']);

      // Should use primary-600 (first dependency)
      expect(result.family).toBe('primary-dark-family');
      expect(result.position).toBe('300');
    });
  });

  describe('Edge Cases', () => {
    it('should handle position 500 (middle) correctly', () => {
      registry.add({
        name: 'middle-token',
        value: { family: 'accent-family', position: '500' },
        category: 'color',
        namespace: 'color',
      });

      const result = invertPlugin(registry, 'middle-dark', ['middle-token']);

      expect(result.family).toBe('accent-family');
      expect(result.position).toBe('500'); // 1000 - 500 = 500 (inverts to itself)
    });

    it('should handle both string and number positions in calculations', () => {
      // String position
      registry.add({
        name: 'string-pos',
        value: { family: 'accent-family', position: '300' },
        category: 'color',
        namespace: 'color',
      });

      // Number position
      registry.add({
        name: 'number-pos',
        value: { family: 'accent-family', position: 300 },
        category: 'color',
        namespace: 'color',
      });

      const stringResult = invertPlugin(registry, 'string-dark', ['string-pos']);
      const numberResult = invertPlugin(registry, 'number-dark', ['number-pos']);

      expect(stringResult.position).toBe('700');
      expect(numberResult.position).toBe('700');
    });

    it('should handle missing darkModeReferences gracefully', () => {
      // Position that exists in scale but not in darkModeReferences
      registry.add({
        name: 'unmapped-pos',
        value: { family: 'primary-family', position: '500' },
        category: 'color',
        namespace: 'color',
      });

      const result = invertPlugin(registry, 'unmapped-dark', ['unmapped-pos']);

      // Should fall back to mathematical inversion
      expect(result.family).toBe('primary-family');
      expect(result.position).toBe('500'); // 1000 - 500 = 500
    });
  });

  describe('Integration with Dark Mode Systems', () => {
    it('should work with realistic dark mode token patterns', () => {
      const darkModeTokens = [
        'primary-100-dark',
        'primary-300-dark',
        'primary-500-dark',
        'primary-700-dark',
        'primary-900-dark',
      ];

      darkModeTokens.forEach((tokenName) => {
        const baseTokenName = tokenName.replace('-dark', '');

        // Add base token if it doesn't exist
        if (!registry.get(baseTokenName)) {
          const position = tokenName.match(/(\d+)/)?.[0];
          registry.add({
            name: baseTokenName,
            value: { family: 'primary-family', position },
            category: 'color',
            namespace: 'color',
          });
        }

        const result = invertPlugin(registry, tokenName, [baseTokenName]);

        expect(result).toHaveProperty('family');
        expect(result).toHaveProperty('position');
        expect(typeof result.position).toBe('string');
      });
    });
  });
});
