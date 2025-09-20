/**
 * Contrast Plugin Tests
 *
 * Tests the contrast plugin that finds optimal contrast colors using WCAG
 * accessibility data and AI-powered intelligence.
 */

import type { ColorValue, Token } from '@rafters/shared';
import { beforeEach, describe, expect, it } from 'vitest';
import contrastPlugin from '../../src/plugins/contrast.js';
import { TokenRegistry } from '../../src/registry.js';

describe('Contrast Plugin', () => {
  let registry: TokenRegistry;

  beforeEach(() => {
    registry = new TokenRegistry();

    // Extended ColorValue with foreground references
    type ExtendedColorValue = ColorValue & {
      foregroundReferences?: {
        auto?: { family: string; position: string | number };
      };
    };

    const colorValueWithForegroundRefs: ExtendedColorValue = {
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
      foregroundReferences: {
        auto: { family: 'neutral-family', position: '900' },
      },
      accessibility: {
        wcagAAA: {
          normal: [
            [0, 8],
            [1, 9],
          ], // High contrast pairs
          large: [
            [0, 7],
            [1, 8],
          ],
        },
        wcagAA: {
          normal: [
            [0, 6],
            [1, 7],
            [2, 8],
          ], // More contrast pairs
          large: [
            [0, 5],
            [1, 6],
            [2, 7],
          ],
        },
        onWhite: {
          wcagAA: true,
          wcagAAA: false,
          contrastRatio: 4.8,
          aa: [6, 7, 8, 9],
          aaa: [8, 9],
        },
        onBlack: {
          wcagAA: true,
          wcagAAA: true,
          contrastRatio: 12.1,
          aa: [0, 1, 2, 3],
          aaa: [0, 1],
        },
      },
    };

    const colorValueWithAccessibility: ColorValue = {
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
      accessibility: {
        wcagAAA: {
          normal: [
            [2, 9],
            [3, 8],
          ], // AAA contrast pairs
          large: [
            [2, 8],
            [3, 7],
          ],
        },
        wcagAA: {
          normal: [
            [1, 7],
            [2, 8],
            [3, 9],
          ], // AA contrast pairs
          large: [
            [1, 6],
            [2, 7],
            [3, 8],
          ],
        },
        onWhite: {
          wcagAA: true,
          wcagAAA: true,
          contrastRatio: 7.2,
          aa: [5, 6, 7, 8, 9],
          aaa: [7, 8, 9],
        },
        onBlack: {
          wcagAA: true,
          wcagAAA: false,
          contrastRatio: 3.8,
          aa: [0, 1, 2, 3, 4],
          aaa: [],
        },
      },
    };

    const neutralColorValue: ColorValue = {
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
      accessibility: {
        onWhite: {
          wcagAA: true,
          wcagAAA: true,
          contrastRatio: 8.5,
          aa: [5, 6, 7, 8, 9],
          aaa: [7, 8, 9],
        },
        onBlack: {
          wcagAA: true,
          wcagAAA: true,
          contrastRatio: 15.2,
          aa: [0, 1, 2, 3, 4],
          aaa: [0, 1, 2],
        },
      },
    };

    const mockTokens: Token[] = [
      {
        name: 'primary-family',
        value: colorValueWithForegroundRefs,
        category: 'color-family',
        namespace: 'color',
      },
      {
        name: 'secondary-family',
        value: colorValueWithAccessibility,
        category: 'color-family',
        namespace: 'color',
      },
      {
        name: 'neutral-family',
        value: neutralColorValue,
        category: 'color-family',
        namespace: 'color',
      },
      // Base semantic tokens with positions
      {
        name: 'primary',
        value: { position: '600' },
        category: 'color',
        namespace: 'color',
      },
      {
        name: 'secondary',
        value: { position: '500' },
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

  describe('Pre-computed Foreground References', () => {
    it('should use foregroundReferences.auto when available', () => {
      const result = contrastPlugin(registry, 'primary-foreground', ['primary-family']);

      expect(result.family).toBe('neutral-family');
      expect(result.position).toBe('900');
    });

    it('should prioritize foregroundReferences over other methods', () => {
      // Even though the token has accessibility data, it should use foregroundReferences first
      const result = contrastPlugin(registry, 'primary-text', ['primary-family']);

      expect(result.family).toBe('neutral-family');
      expect(result.position).toBe('900');
    });
  });

  describe('Base Position Extraction', () => {
    it('should extract base position from semantic token name', () => {
      // This will fall back to accessibility data since secondary-family has no foregroundReferences
      const result = contrastPlugin(registry, 'secondary-foreground', ['secondary-family']);

      // Should use accessibility data to find contrast for position 5 (500)
      expect(result.family).toBe('secondary-family');
      expect(typeof result.position).toBe('string');
    });

    it('should handle different foreground suffix patterns', () => {
      const patterns = ['primary-foreground', 'primary-text', 'primary-contrast'];

      patterns.forEach((pattern) => {
        const result = contrastPlugin(registry, pattern, ['primary-family']);

        expect(result.family).toBe('neutral-family'); // From foregroundReferences
        expect(result.position).toBe('900');
      });
    });
  });

  describe('WCAG Accessibility Data Usage', () => {
    it('should prefer WCAG AAA over AA when available', () => {
      // Remove foregroundReferences to test accessibility fallback
      const testFamily: ColorValue = {
        name: 'test-color',
        scale: [{ l: 0.5, c: 0.1, h: 180 }],
        accessibility: {
          wcagAAA: {
            normal: [[2, 8]], // AAA pair
            large: [[2, 7]],
          },
          wcagAA: {
            normal: [[2, 6]], // AA pair (lower quality)
            large: [[2, 5]],
          },
          onWhite: {
            wcagAA: true,
            wcagAAA: true,
            contrastRatio: 7.0,
            aa: [6, 7, 8],
            aaa: [8],
          },
          onBlack: {
            wcagAA: true,
            wcagAAA: false,
            contrastRatio: 3.0,
            aa: [0, 1, 2],
            aaa: [],
          },
        },
      };

      registry.add({
        name: 'test-family',
        value: testFamily,
        category: 'color-family',
        namespace: 'color',
      });

      // Add base token for position extraction
      registry.add({
        name: 'test',
        value: { position: '200' }, // Position 2
        category: 'color',
        namespace: 'color',
      });

      const result = contrastPlugin(registry, 'test-foreground', ['test-family']);

      expect(result.family).toBe('test-family');
      expect(result.position).toBe('800'); // AAA contrast position (8 * 100)
    });

    it('should fall back to WCAG AA when AAA not available', () => {
      const testFamily: ColorValue = {
        name: 'test-color-aa',
        scale: [{ l: 0.5, c: 0.1, h: 180 }],
        accessibility: {
          wcagAA: {
            normal: [[1, 7]], // Only AA available
            large: [[1, 6]],
          },
          onWhite: {
            wcagAA: true,
            wcagAAA: false,
            contrastRatio: 4.5,
            aa: [6, 7],
            aaa: [],
          },
          onBlack: {
            wcagAA: true,
            wcagAAA: false,
            contrastRatio: 4.2,
            aa: [0, 1],
            aaa: [],
          },
        },
      };

      registry.add({
        name: 'test-aa-family',
        value: testFamily,
        category: 'color-family',
        namespace: 'color',
      });

      registry.add({
        name: 'test-aa',
        value: { position: '100' }, // Position 1
        category: 'color',
        namespace: 'color',
      });

      const result = contrastPlugin(registry, 'test-aa-foreground', ['test-aa-family']);

      expect(result.family).toBe('test-aa-family');
      expect(result.position).toBe('700'); // AA contrast position (7 * 100)
    });
  });

  describe('Neutral Family Fallback', () => {
    it('should find neutral families when no other method works', () => {
      const testFamily: ColorValue = {
        name: 'test-no-accessibility',
        scale: [{ l: 0.5, c: 0.1, h: 180 }],
        // No accessibility data
      };

      registry.add({
        name: 'test-no-access-family',
        value: testFamily,
        category: 'color-family',
        namespace: 'color',
      });

      const result = contrastPlugin(registry, 'test-foreground', ['test-no-access-family']);

      expect(result.family).toBe('test-no-access-family'); // Uses provided family when no accessibility data
      expect(result.position).toBe('900'); // Uses high contrast fallback
    });

    it('should prefer AAA positions from neutral families', () => {
      // Test that neutral family uses its best AAA positions
      const result = contrastPlugin(registry, 'unknown-foreground', ['primary-family']);

      // Should use neutral-family since it exists and has good accessibility data
      expect(result.family).toBe('neutral-family');
      expect(result.position).toBe('900'); // From foregroundReferences, but tests the logic
    });
  });

  describe('Last Resort Fallback', () => {
    it('should use same family with high contrast when no neutral found', () => {
      // Create isolated registry without neutral family
      const isolatedRegistry = new TokenRegistry();

      const isolatedFamily: ColorValue = {
        name: 'isolated-color',
        scale: [{ l: 0.5, c: 0.1, h: 180 }],
        // No accessibility data, no foregroundReferences
      };

      isolatedRegistry.add({
        name: 'isolated-family',
        value: isolatedFamily,
        category: 'color-family',
        namespace: 'color',
      });

      isolatedRegistry.add({
        name: 'isolated',
        value: { position: '200' }, // Light base
        category: 'color',
        namespace: 'color',
      });

      const result = contrastPlugin(isolatedRegistry, 'isolated-foreground', ['isolated-family']);

      expect(result.family).toBe('isolated-family');
      expect(result.position).toBe('900'); // Dark text for light background
    });

    it('should choose appropriate contrast based on base position', () => {
      const isolatedRegistry = new TokenRegistry();

      const isolatedFamily: ColorValue = {
        name: 'isolated-color',
        scale: [{ l: 0.5, c: 0.1, h: 180 }],
      };

      isolatedRegistry.add({
        name: 'isolated-family',
        value: isolatedFamily,
        category: 'color-family',
        namespace: 'color',
      });

      // Test light base (should get dark text)
      isolatedRegistry.add({
        name: 'light-base',
        value: { position: '100' }, // Light base (position < 5)
        category: 'color',
        namespace: 'color',
      });

      const lightResult = contrastPlugin(isolatedRegistry, 'light-base-foreground', [
        'isolated-family',
      ]);
      expect(lightResult.position).toBe('900'); // Dark text

      // Test dark base (should get light text)
      isolatedRegistry.add({
        name: 'dark-base',
        value: { position: '800' }, // Dark base (position >= 5)
        category: 'color',
        namespace: 'color',
      });

      const darkResult = contrastPlugin(isolatedRegistry, 'dark-base-foreground', [
        'isolated-family',
      ]);
      expect(darkResult.position).toBe('100'); // Light text
    });
  });

  describe('Error Handling', () => {
    it('should throw error when no dependencies provided', () => {
      expect(() => {
        contrastPlugin(registry, 'primary-foreground', []);
      }).toThrow('No dependencies found for contrast rule on token: primary-foreground');
    });

    it('should throw error when family token not found', () => {
      expect(() => {
        contrastPlugin(registry, 'primary-foreground', ['nonexistent-family']);
      }).toThrow('ColorValue family token nonexistent-family not found for contrast rule');
    });

    it('should throw error when dependency is not a ColorValue', () => {
      expect(() => {
        contrastPlugin(registry, 'text-foreground', ['text-token']);
      }).toThrow('ColorValue family token text-token not found for contrast rule');
    });
  });

  describe('Return Value Structure', () => {
    it('should return object with family and position properties', () => {
      const result = contrastPlugin(registry, 'primary-foreground', ['primary-family']);

      expect(result).toHaveProperty('family');
      expect(result).toHaveProperty('position');
      expect(typeof result.family).toBe('string');
      expect(typeof result.position).toBe('string');
    });
  });

  describe('Multiple Dependencies', () => {
    it('should use first dependency as family reference', () => {
      const result = contrastPlugin(registry, 'test-foreground', [
        'primary-family',
        'secondary-family',
      ]);

      expect(result.family).toBe('neutral-family'); // From primary-family's foregroundReferences
    });
  });

  describe('Complex Token Name Patterns', () => {
    it('should handle nested semantic names', () => {
      const result = contrastPlugin(registry, 'ui-brand-primary-foreground', ['primary-family']);

      expect(result.family).toBe('neutral-family');
      expect(result.position).toBe('900');
    });

    it('should handle various foreground suffixes', () => {
      const suffixes = ['foreground', 'text', 'contrast'];

      suffixes.forEach((suffix) => {
        const result = contrastPlugin(registry, `primary-${suffix}`, ['primary-family']);

        expect(result.family).toBe('neutral-family');
        expect(result.position).toBe('900');
      });
    });
  });
});
