/**
 * Scale Plugin Tests
 *
 * Tests the scale plugin that extracts specific positions from color family scales.
 */

import type { ColorValue, Token } from '@rafters/shared';
import { beforeEach, describe, expect, it } from 'vitest';
import scalePlugin from '../../src/plugins/scale.js';
import { TokenRegistry } from '../../src/registry.js';

describe('Scale Plugin', () => {
  let registry: TokenRegistry;

  beforeEach(() => {
    registry = new TokenRegistry();

    const mockColorValue: ColorValue = {
      name: 'ocean-blue',
      scale: [
        { l: 0.95, c: 0.01, h: 240 }, // position 0 (50)
        { l: 0.9, c: 0.02, h: 240 }, // position 1 (100)
        { l: 0.8, c: 0.05, h: 240 }, // position 2 (200)
        { l: 0.7, c: 0.08, h: 240 }, // position 3 (300)
        { l: 0.6, c: 0.12, h: 240 }, // position 4 (400)
        { l: 0.5, c: 0.15, h: 240 }, // position 5 (500)
        { l: 0.4, c: 0.18, h: 240 }, // position 6 (600)
        { l: 0.3, c: 0.2, h: 240 }, // position 7 (700)
        { l: 0.2, c: 0.22, h: 240 }, // position 8 (800)
        { l: 0.1, c: 0.25, h: 240 }, // position 9 (900)
        { l: 0.05, c: 0.28, h: 240 }, // position 10 (950)
      ],
    };

    const mockTokens: Token[] = [
      {
        name: 'blue-family',
        value: mockColorValue,
        category: 'color-family',
        namespace: 'color',
      },
      {
        name: 'neutral-family',
        value: {
          name: 'neutral-gray',
          scale: [
            { l: 0.98, c: 0.005, h: 240 }, // 50
            { l: 0.9, c: 0.01, h: 240 }, // 100
            { l: 0.8, c: 0.01, h: 240 }, // 200
            { l: 0.7, c: 0.01, h: 240 }, // 300
            { l: 0.6, c: 0.01, h: 240 }, // 400
            { l: 0.5, c: 0.01, h: 240 }, // 500
            { l: 0.4, c: 0.01, h: 240 }, // 600
            { l: 0.3, c: 0.01, h: 240 }, // 700
            { l: 0.2, c: 0.01, h: 240 }, // 800
            { l: 0.1, c: 0.01, h: 240 }, // 900
          ],
        } as ColorValue,
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

  describe('Scale Position Extraction', () => {
    it('should extract position from token name ending with number', () => {
      const result = scalePlugin(registry, 'blue-600', ['blue-family']);

      expect(result.family).toBe('blue-family');
      expect(result.position).toBe('600');
    });

    it('should extract different scale positions', () => {
      const positions = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

      positions.forEach((position) => {
        const tokenName = `blue-${position}`;
        const result = scalePlugin(registry, tokenName, ['blue-family']);

        expect(result.family).toBe('blue-family');
        expect(result.position).toBe(position);
      });
    });

    it('should work with different family names', () => {
      const result = scalePlugin(registry, 'neutral-500', ['neutral-family']);

      expect(result.family).toBe('neutral-family');
      expect(result.position).toBe('500');
    });
  });

  describe('Token Name Pattern Recognition', () => {
    it('should handle primary color patterns', () => {
      const result = scalePlugin(registry, 'primary-600', ['blue-family']);

      expect(result.family).toBe('blue-family');
      expect(result.position).toBe('600');
    });

    it('should handle semantic token patterns', () => {
      const semanticPatterns = ['danger-500', 'success-700', 'warning-400', 'info-300'];

      semanticPatterns.forEach((pattern) => {
        const result = scalePlugin(registry, pattern, ['blue-family']);
        const expectedPosition = pattern.split('-')[1];

        expect(result.family).toBe('blue-family');
        expect(result.position).toBe(expectedPosition);
      });
    });

    it('should handle complex token names', () => {
      const complexNames = ['brand-primary-600', 'ui-accent-500', 'semantic-destructive-700'];

      complexNames.forEach((name) => {
        const result = scalePlugin(registry, name, ['blue-family']);
        const expectedPosition = name.match(/(\d+)$/)?.[1];

        expect(result.family).toBe('blue-family');
        expect(result.position).toBe(expectedPosition);
      });
    });
  });

  describe('Multiple Dependencies', () => {
    it('should use first dependency as family reference', () => {
      const result = scalePlugin(registry, 'test-600', ['blue-family', 'neutral-family']);

      expect(result.family).toBe('blue-family'); // First dependency
      expect(result.position).toBe('600');
    });
  });

  describe('Error Handling', () => {
    it('should throw error when token name has no numeric suffix', () => {
      expect(() => {
        scalePlugin(registry, 'invalid-token-name', ['blue-family']);
      }).toThrow('Cannot extract scale position from token name: invalid-token-name');
    });

    it('should throw error when no dependencies provided', () => {
      expect(() => {
        scalePlugin(registry, 'blue-600', []);
      }).toThrow('No dependencies found for scale rule on token: blue-600');
    });

    it('should throw error when family token not found', () => {
      expect(() => {
        scalePlugin(registry, 'blue-600', ['nonexistent-family']);
      }).toThrow('ColorValue family token nonexistent-family not found for scale rule');
    });

    it('should throw error when dependency is not a ColorValue', () => {
      expect(() => {
        scalePlugin(registry, 'text-600', ['text-token']);
      }).toThrow('ColorValue family token text-token not found for scale rule');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large position numbers', () => {
      const result = scalePlugin(registry, 'blue-9999', ['blue-family']);

      expect(result.family).toBe('blue-family');
      expect(result.position).toBe('9999');
    });

    it('should handle single digit positions', () => {
      const result = scalePlugin(registry, 'blue-5', ['blue-family']);

      expect(result.family).toBe('blue-family');
      expect(result.position).toBe('5');
    });

    it('should handle zero position', () => {
      const result = scalePlugin(registry, 'blue-0', ['blue-family']);

      expect(result.family).toBe('blue-family');
      expect(result.position).toBe('0');
    });

    it('should handle custom scale positions', () => {
      const customPositions = ['25', '75', '150', '350', '550', '750', '850'];

      customPositions.forEach((position) => {
        const result = scalePlugin(registry, `blue-${position}`, ['blue-family']);

        expect(result.family).toBe('blue-family');
        expect(result.position).toBe(position);
      });
    });
  });

  describe('Return Value Structure', () => {
    it('should return object with family and position properties', () => {
      const result = scalePlugin(registry, 'blue-600', ['blue-family']);

      expect(result).toHaveProperty('family');
      expect(result).toHaveProperty('position');
      expect(typeof result.family).toBe('string');
      expect(typeof result.position).toBe('string');
    });

    it('should return exact family name from dependencies', () => {
      const familyNames = ['blue-family', 'neutral-family'];

      familyNames.forEach((familyName) => {
        const result = scalePlugin(registry, 'test-500', [familyName]);
        expect(result.family).toBe(familyName);
      });
    });

    it('should return position as string', () => {
      const result = scalePlugin(registry, 'blue-600', ['blue-family']);

      expect(typeof result.position).toBe('string');
      expect(result.position).toBe('600');
    });
  });

  describe('Integration with Color System', () => {
    it('should work with realistic token naming patterns', () => {
      const realisticTokens = [
        'primary-50',
        'primary-100',
        'secondary-600',
        'accent-400',
        'neutral-900',
        'destructive-500',
        'success-300',
        'warning-400',
        'info-200',
      ];

      realisticTokens.forEach((tokenName) => {
        const result = scalePlugin(registry, tokenName, ['blue-family']);
        const expectedPosition = tokenName.match(/(\d+)$/)?.[1];

        expect(result.family).toBe('blue-family');
        expect(result.position).toBe(expectedPosition);
      });
    });
  });
});
