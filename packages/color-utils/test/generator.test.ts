/**
 * Generator Module Tests
 *
 * Tests the unified color object generator, metadata calculation,
 * cache key generation, and validation functions.
 */

import type { ColorValue, OKLCH } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import {
  type ColorContext,
  calculateColorMetadata,
  generateColorCacheKey,
  generateColorValue,
  validateOKLCH,
} from '../src/generator';

describe('Generator Module', () => {
  // Test colors
  const red: OKLCH = { l: 0.6, c: 0.2, h: 0 };
  const blue: OKLCH = { l: 0.5, c: 0.15, h: 240 };
  const gray: OKLCH = { l: 0.5, c: 0, h: 0 };

  describe('generateColorValue', () => {
    it('should generate complete ColorValue object', () => {
      const result = generateColorValue(red);

      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('scale');
      expect(result).toHaveProperty('harmonies');
      expect(result).toHaveProperty('accessibility');
      expect(result).toHaveProperty('analysis');
      expect(result).toHaveProperty('atmosphericWeight');
      expect(result).toHaveProperty('perceptualWeight');
      expect(result).toHaveProperty('semanticSuggestions');
    });

    it('should generate 11-step scale', () => {
      const result = generateColorValue(blue);

      expect(result.scale).toHaveLength(11);
      expect(result.scale[0]).toBeDefined(); // 50
      expect(result.scale[5]).toBeDefined(); // 500
      expect(result.scale[10]).toBeDefined(); // 950
    });

    it('should set default value to 600', () => {
      const result = generateColorValue(red);

      expect(result.value).toBe('600');
    });

    it('should use provided name from context', () => {
      const context: ColorContext = { name: 'Custom Red' };
      const result = generateColorValue(red, context);

      expect(result.name).toBe('Custom Red');
    });

    it('should generate default name when none provided', () => {
      const result = generateColorValue(red);

      expect(result.name).toContain('oklch');
      expect(result.name).toContain('0'); // hue
      expect(result.name).toContain('60'); // lightness * 100
    });

    it('should include token from context', () => {
      const context: ColorContext = { token: 'primary' };
      const result = generateColorValue(blue, context);

      expect(result.token).toBe('primary');
    });

    it('should include usage from context', () => {
      const context: ColorContext = { usage: 'Brand colors' };
      const result = generateColorValue(blue, context);

      expect(result.use).toBe('Brand colors');
    });

    it('should generate states when requested', () => {
      const context: ColorContext = {
        generateStates: true,
        token: 'primary',
      };
      const result = generateColorValue(red, context);

      expect(result.states).toBeDefined();
      expect(result.states).toHaveProperty('hover');
      expect(result.states).toHaveProperty('focus');
      expect(result.states).toHaveProperty('active');
      expect(result.states).toHaveProperty('disabled');
    });

    it('should not generate states when not requested', () => {
      const context: ColorContext = { generateStates: false };
      const result = generateColorValue(red, context);

      expect(result.states).toBeUndefined();
    });

    it('should generate harmonies', () => {
      const result = generateColorValue(blue);

      expect(result.harmonies).toHaveProperty('complementary');
      expect(result.harmonies).toHaveProperty('triadic');
      expect(result.harmonies).toHaveProperty('analogous');
      expect(result.harmonies).toHaveProperty('tetradic');
      expect(result.harmonies).toHaveProperty('monochromatic');

      expect(result.harmonies.triadic).toHaveLength(2);
      expect(result.harmonies.analogous).toHaveLength(2);
      expect(result.harmonies.tetradic).toHaveLength(3);
      expect(result.harmonies.monochromatic).toHaveLength(4);
    });

    it('should generate accessibility metadata', () => {
      const result = generateColorValue(red);

      expect(result.accessibility).toHaveProperty('wcagAA');
      expect(result.accessibility).toHaveProperty('wcagAAA');
      expect(result.accessibility).toHaveProperty('onWhite');
      expect(result.accessibility).toHaveProperty('onBlack');

      expect(result.accessibility.onWhite).toHaveProperty('wcagAA');
      expect(result.accessibility.onWhite).toHaveProperty('wcagAAA');
      expect(result.accessibility.onWhite).toHaveProperty('contrastRatio');
    });

    it('should include analysis data', () => {
      const result = generateColorValue(blue);

      expect(result.analysis).toHaveProperty('temperature');
      expect(result.analysis).toHaveProperty('isLight');
      expect(result.analysis).toHaveProperty('name');
    });

    it('should round input color values', () => {
      const precise: OKLCH = { l: 0.123456, c: 0.654321, h: 234.567 };
      const result = generateColorValue(precise);

      // Check that scale colors are rounded
      for (const color of result.scale) {
        expect(color.l).toBe(Math.round(color.l * 100) / 100);
        expect(color.c).toBe(Math.round(color.c * 100) / 100);
        expect(color.h).toBe(Math.round(color.h));
      }
    });

    it('should handle achromatic colors', () => {
      const result = generateColorValue(gray);

      expect(result.scale).toHaveLength(11);
      expect(result.harmonies).toBeDefined();
      expect(result.accessibility).toBeDefined();
    });

    it('should validate output with schema', () => {
      // Should not throw if schema validation passes
      expect(() => generateColorValue(red)).not.toThrow();
      expect(() => generateColorValue(blue)).not.toThrow();
      expect(() => generateColorValue(gray)).not.toThrow();
    });

    it('should handle invalid input colors', () => {
      const invalid = { l: NaN, c: -1, h: 'invalid' } as unknown as OKLCH;

      expect(() => generateColorValue(invalid)).toThrow();
    });

    it('should include atmospheric and perceptual weights', () => {
      const result = generateColorValue(red);

      expect(typeof result.atmosphericWeight).toBe('object');
      expect(typeof result.perceptualWeight).toBe('object');
      expect(result.atmosphericWeight).toHaveProperty('distanceWeight');
      expect(result.perceptualWeight).toHaveProperty('weight');
      expect(result.atmosphericWeight.distanceWeight).toBeGreaterThanOrEqual(0);
      expect(result.perceptualWeight.weight).toBeGreaterThanOrEqual(0);
    });

    it('should include semantic suggestions', () => {
      const result = generateColorValue(blue);

      expect(result.semanticSuggestions).toBeDefined();
      expect(typeof result.semanticSuggestions).toBe('object');
      expect(result.semanticSuggestions).toHaveProperty('danger');
      expect(result.semanticSuggestions).toHaveProperty('success');
      expect(result.semanticSuggestions).toHaveProperty('warning');
      expect(result.semanticSuggestions).toHaveProperty('info');
      expect(Array.isArray(result.semanticSuggestions.danger)).toBe(true);
    });
  });

  describe('calculateColorMetadata', () => {
    const mockColorValue: ColorValue = {
      name: 'Test Color',
      scale: [
        gray,
        gray,
        gray,
        gray,
        gray,
        red, // position 5 (600)
        gray,
        gray,
        gray,
        gray,
        gray,
      ],
      value: '600',
      harmonies: {
        complementary: blue,
        triadic: [blue, blue],
        analogous: [blue, blue],
        tetradic: [blue, blue, blue],
        monochromatic: [blue, blue, blue, blue],
      },
      accessibility: {
        wcagAA: { normal: [], large: [] },
        wcagAAA: { normal: [], large: [] },
        onWhite: { wcagAA: true, wcagAAA: false, contrastRatio: 5.5, aa: [], aaa: [] },
        onBlack: { wcagAA: false, wcagAAA: false, contrastRatio: 2.1, aa: [], aaa: [] },
      },
      analysis: {
        temperature: 'warm',
        isLight: false,
        name: 'test-red',
      },
      atmosphericWeight: 0.5,
      perceptualWeight: 0.7,
      semanticSuggestions: [],
    };

    it('should calculate trust level for primary token', () => {
      const colorWithPrimary = { ...mockColorValue, token: 'primary' };
      const metadata = calculateColorMetadata(colorWithPrimary);

      expect(metadata.trustLevel).toBe('high');
    });

    it('should calculate trust level for danger token', () => {
      const colorWithDanger = { ...mockColorValue, token: 'danger' };
      const metadata = calculateColorMetadata(colorWithDanger);

      expect(metadata.trustLevel).toBe('critical');
    });

    it('should calculate trust level for destructive token', () => {
      const colorWithDestructive = { ...mockColorValue, token: 'destructive' };
      const metadata = calculateColorMetadata(colorWithDestructive);

      expect(metadata.trustLevel).toBe('critical');
    });

    it('should calculate trust level for warning token', () => {
      const colorWithWarning = { ...mockColorValue, token: 'warning' };
      const metadata = calculateColorMetadata(colorWithWarning);

      expect(metadata.trustLevel).toBe('medium');
    });

    it('should default to low trust level', () => {
      const metadata = calculateColorMetadata(mockColorValue);

      expect(metadata.trustLevel).toBe('low');
    });

    it('should calculate cognitive load', () => {
      const metadata = calculateColorMetadata(mockColorValue);

      expect(typeof metadata.cognitiveLoad).toBe('number');
      expect(metadata.cognitiveLoad).toBeGreaterThanOrEqual(1);
      expect(metadata.cognitiveLoad).toBeLessThanOrEqual(10);
    });

    it('should increase cognitive load for critical colors', () => {
      const criticalColor = { ...mockColorValue, token: 'danger' };
      const normalColor = mockColorValue;

      const criticalMetadata = calculateColorMetadata(criticalColor);
      const normalMetadata = calculateColorMetadata(normalColor);

      expect(criticalMetadata.cognitiveLoad).toBeGreaterThan(normalMetadata.cognitiveLoad);
    });

    it('should calculate consequence based on trust level', () => {
      const criticalColor = { ...mockColorValue, token: 'danger' };
      const highTrustColor = { ...mockColorValue, token: 'primary' };
      const lowTrustColor = mockColorValue;

      const criticalMeta = calculateColorMetadata(criticalColor);
      const highMeta = calculateColorMetadata(highTrustColor);
      const lowMeta = calculateColorMetadata(lowTrustColor);

      expect(criticalMeta.consequence).toBe('destructive');
      expect(highMeta.consequence).toBe('significant');
      expect(lowMeta.consequence).toBe('reversible');
    });

    it('should handle empty scale gracefully', () => {
      const emptyScaleColor = { ...mockColorValue, scale: [] };

      expect(() => calculateColorMetadata(emptyScaleColor)).toThrow(
        'No valid color found in scale'
      );
    });

    it('should handle scale with invalid colors', () => {
      const invalidScaleColor = {
        ...mockColorValue,
        scale: [
          // @ts-expect-error - testing invalid colors
          null,
          undefined,
          null,
          null,
          null,
          red, // valid color at position 5
          null,
          null,
          null,
          null,
          null,
        ],
      };

      expect(() => calculateColorMetadata(invalidScaleColor as ColorValue)).not.toThrow();
    });
  });

  describe('generateColorCacheKey', () => {
    it('should generate consistent cache key', () => {
      const key1 = generateColorCacheKey(red);
      const key2 = generateColorCacheKey(red);

      expect(key1).toBe(key2);
    });

    it('should include rounded values', () => {
      const precise: OKLCH = { l: 0.123456, c: 0.654321, h: 234.567 };
      const key = generateColorCacheKey(precise);

      expect(key).toContain('0.12'); // rounded lightness
      expect(key).toContain('0.65'); // rounded chroma
      expect(key).toContain('235'); // rounded hue
    });

    it('should include context token when provided', () => {
      const context: ColorContext = { token: 'primary' };
      const key = generateColorCacheKey(red, context);

      expect(key).toContain('primary');
    });

    it('should not include context when not provided', () => {
      const key = generateColorCacheKey(red);

      expect(key).not.toContain('primary');
      expect(key).not.toContain('undefined');
    });

    it('should handle different colors differently', () => {
      const redKey = generateColorCacheKey(red);
      const blueKey = generateColorCacheKey(blue);

      expect(redKey).not.toBe(blueKey);
    });

    it('should handle different contexts differently', () => {
      const primaryKey = generateColorCacheKey(red, { token: 'primary' });
      const secondaryKey = generateColorCacheKey(red, { token: 'secondary' });

      expect(primaryKey).not.toBe(secondaryKey);
    });

    it('should format consistently', () => {
      const key = generateColorCacheKey(red);

      expect(key).toMatch(/^oklch-[\d.]+-[\d.]+-\d+$/);
    });
  });

  describe('validateOKLCH', () => {
    it('should validate correct OKLCH objects', () => {
      expect(validateOKLCH(red)).toBe(true);
      expect(validateOKLCH(blue)).toBe(true);
      expect(validateOKLCH(gray)).toBe(true);
    });

    it('should validate OKLCH with alpha', () => {
      const withAlpha: OKLCH = { l: 0.5, c: 0.1, h: 120, alpha: 0.8 };
      expect(validateOKLCH(withAlpha)).toBe(true);
    });

    it('should reject invalid objects', () => {
      expect(validateOKLCH({})).toBe(false);
      expect(validateOKLCH({ l: 0.5 })).toBe(false);
      expect(validateOKLCH({ l: 0.5, c: 0.1 })).toBe(false);
    });

    it('should reject wrong types', () => {
      expect(validateOKLCH(null)).toBe(false);
      expect(validateOKLCH(undefined)).toBe(false);
      expect(validateOKLCH('string')).toBe(false);
      expect(validateOKLCH(123)).toBe(false);
      expect(validateOKLCH([])).toBe(false);
    });

    it('should reject invalid value types', () => {
      expect(validateOKLCH({ l: 'invalid', c: 0.1, h: 120 })).toBe(false);
      expect(validateOKLCH({ l: 0.5, c: 'invalid', h: 120 })).toBe(false);
      expect(validateOKLCH({ l: 0.5, c: 0.1, h: 'invalid' })).toBe(false);
    });

    it('should reject out-of-range values', () => {
      expect(validateOKLCH({ l: -0.1, c: 0.1, h: 120 })).toBe(false);
      expect(validateOKLCH({ l: 1.1, c: 0.1, h: 120 })).toBe(false);
      expect(validateOKLCH({ l: 0.5, c: -0.1, h: 120 })).toBe(false);
    });

    it('should handle edge case values', () => {
      expect(validateOKLCH({ l: 0, c: 0, h: 0 })).toBe(true);
      expect(validateOKLCH({ l: 1, c: 0.4, h: 360 })).toBe(true);
      expect(validateOKLCH({ l: 0.5, c: 0, h: 180 })).toBe(true);
    });

    it('should validate alpha when present', () => {
      expect(validateOKLCH({ l: 0.5, c: 0.1, h: 120, alpha: 0 })).toBe(true);
      expect(validateOKLCH({ l: 0.5, c: 0.1, h: 120, alpha: 1 })).toBe(true);
      expect(validateOKLCH({ l: 0.5, c: 0.1, h: 120, alpha: -0.1 })).toBe(false);
      expect(validateOKLCH({ l: 0.5, c: 0.1, h: 120, alpha: 1.1 })).toBe(false);
    });
  });

  describe('Integration Tests', () => {
    it('should generate valid ColorValue that passes metadata calculation', () => {
      const context: ColorContext = { token: 'primary', name: 'Brand Blue' };
      const colorValue = generateColorValue(blue, context);

      expect(() => calculateColorMetadata(colorValue)).not.toThrow();

      const metadata = calculateColorMetadata(colorValue);
      expect(metadata.trustLevel).toBe('high');
    });

    it('should generate cache keys for generated colors', () => {
      const colorValue = generateColorValue(red);
      const baseColor = colorValue.scale[5]; // Should be position 600

      const cacheKey = generateColorCacheKey(baseColor);
      expect(cacheKey).toMatch(/^oklch-[\d.]+-[\d.]+-\d+$/);
    });

    it('should validate all colors in generated scale', () => {
      const colorValue = generateColorValue(blue);

      for (const color of colorValue.scale) {
        expect(validateOKLCH(color)).toBe(true);
      }
    });

    it('should handle complex workflow', () => {
      // Generate color value
      const context: ColorContext = {
        token: 'danger',
        name: 'Error Red',
        usage: 'Error states and alerts',
        generateStates: true,
        semanticRole: 'semantic',
      };

      const colorValue = generateColorValue(red, context);

      // Calculate metadata
      const metadata = calculateColorMetadata(colorValue);

      // Generate cache key
      const cacheKey = generateColorCacheKey(colorValue.scale[5], context);

      // Validate results
      expect(colorValue.name).toBe('Error Red');
      expect(colorValue.token).toBe('danger');
      expect(colorValue.states).toBeDefined();
      expect(metadata.trustLevel).toBe('critical');
      expect(metadata.consequence).toBe('destructive');
      expect(cacheKey).toContain('danger');
    });
  });
});
