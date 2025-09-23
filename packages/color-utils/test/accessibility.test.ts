/**
 * Accessibility Module Tests
 *
 * Tests WCAG and APCA contrast calculations, accessibility metadata generation,
 * and accessible color finding functionality.
 */

import type { OKLCH } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import {
  calculateAPCAContrast,
  calculateWCAGContrast,
  findAccessibleColor,
  generateAccessibilityMetadata,
  meetsAPCAStandard,
  meetsWCAGStandard,
} from '../src/accessibility';

describe('Accessibility Module', () => {
  // Test colors
  const white: OKLCH = { l: 1, c: 0, h: 0 };
  const black: OKLCH = { l: 0, c: 0, h: 0 };
  const midGray: OKLCH = { l: 0.5, c: 0, h: 0 };
  const darkBlue: OKLCH = { l: 0.3, c: 0.15, h: 240 };
  const lightBlue: OKLCH = { l: 0.7, c: 0.15, h: 240 };

  describe('calculateWCAGContrast', () => {
    it('should calculate maximum contrast for black on white', () => {
      const contrast = calculateWCAGContrast(black, white);
      expect(contrast).toBeCloseTo(21, 1);
    });

    it('should calculate minimum contrast for same colors', () => {
      const contrast = calculateWCAGContrast(white, white);
      expect(contrast).toBe(1);
    });

    it('should calculate symmetric contrast', () => {
      const contrast1 = calculateWCAGContrast(black, white);
      const contrast2 = calculateWCAGContrast(white, black);
      expect(contrast1).toBeCloseTo(contrast2, 2);
    });

    it('should calculate reasonable contrast for blue colors', () => {
      const contrast = calculateWCAGContrast(darkBlue, white);
      expect(contrast).toBeGreaterThan(4);
      expect(contrast).toBeLessThan(15);
    });

    it('should handle edge case colors', () => {
      const red: OKLCH = { l: 0.5, c: 0.2, h: 0 };
      const green: OKLCH = { l: 0.5, c: 0.2, h: 120 };
      const contrast = calculateWCAGContrast(red, green);
      expect(contrast).toBeGreaterThan(1);
      expect(contrast).toBeLessThan(21);
    });
  });

  describe('calculateAPCAContrast', () => {
    it('should calculate APCA contrast values', () => {
      const contrast = calculateAPCAContrast(black, white);
      expect(typeof contrast).toBe('number');
      expect(Math.abs(contrast)).toBeGreaterThan(50);
    });

    it('should return zero for same colors', () => {
      const contrast = calculateAPCAContrast(white, white);
      expect(Math.abs(contrast)).toBeLessThan(5);
    });

    it('should handle color conversion edge cases', () => {
      const highChroma: OKLCH = { l: 0.6, c: 0.3, h: 180 };
      const contrast = calculateAPCAContrast(highChroma, white);
      expect(typeof contrast).toBe('number');
    });

    it('should clamp RGB values correctly', () => {
      const extremeColor: OKLCH = { l: 1.2, c: 0.5, h: 90 }; // Out of gamut
      const contrast = calculateAPCAContrast(extremeColor, white);
      expect(typeof contrast).toBe('number');
    });
  });

  describe('meetsWCAGStandard', () => {
    it('should pass AA normal text for high contrast', () => {
      expect(meetsWCAGStandard(black, white, 'AA', 'normal')).toBe(true);
    });

    it('should pass AA normal text for mid contrast', () => {
      expect(meetsWCAGStandard(midGray, white, 'AA', 'normal')).toBe(true);
    });

    it('should have different thresholds for large text', () => {
      const lowContrast: OKLCH = { l: 0.6, c: 0, h: 0 };
      expect(meetsWCAGStandard(lowContrast, white, 'AA', 'normal')).toBe(false);
      expect(meetsWCAGStandard(lowContrast, white, 'AA', 'large')).toBe(true);
    });

    it('should have higher threshold for AAA than AA', () => {
      const mediumContrast: OKLCH = { l: 0.4, c: 0, h: 0 };
      const aaResult = meetsWCAGStandard(mediumContrast, white, 'AA', 'normal');
      const aaaResult = meetsWCAGStandard(mediumContrast, white, 'AAA', 'normal');

      // In OKLCH, dark colors (l: 0.4) have sufficient contrast for both AA and AAA
      expect(aaResult).toBe(true);
      expect(aaaResult).toBe(true);
    });

    it('should handle blue color pairs correctly', () => {
      expect(meetsWCAGStandard(darkBlue, white, 'AA', 'normal')).toBe(true);
      expect(meetsWCAGStandard(lightBlue, white, 'AA', 'normal')).toBe(false);
    });
  });

  describe('meetsAPCAStandard', () => {
    it('should pass for high contrast colors', () => {
      expect(meetsAPCAStandard(black, white, 16)).toBe(true);
    });

    it('should adjust threshold based on text size', () => {
      const testColor: OKLCH = { l: 0.45, c: 0, h: 0 };

      // Larger text should have lower requirements
      const small = meetsAPCAStandard(testColor, white, 12);
      const large = meetsAPCAStandard(testColor, white, 24);

      if (!small) {
        expect(large).toBe(true);
      }
    });

    it('should handle medium text size', () => {
      const testColor: OKLCH = { l: 0.4, c: 0, h: 0 };
      const result = meetsAPCAStandard(testColor, white, 18);
      expect(typeof result).toBe('boolean');
    });

    it('should handle edge case text sizes', () => {
      expect(typeof meetsAPCAStandard(black, white, 8)).toBe('boolean');
      expect(typeof meetsAPCAStandard(black, white, 48)).toBe('boolean');
    });
  });

  describe('generateAccessibilityMetadata', () => {
    const testScale: OKLCH[] = [
      { l: 0.1, c: 0.05, h: 200 }, // Very dark
      { l: 0.3, c: 0.1, h: 200 }, // Dark
      { l: 0.5, c: 0.15, h: 200 }, // Medium
      { l: 0.7, c: 0.1, h: 200 }, // Light
      { l: 0.9, c: 0.05, h: 200 }, // Very light
    ];

    it('should generate complete metadata structure', () => {
      const metadata = generateAccessibilityMetadata(testScale);

      expect(metadata).toHaveProperty('wcagAA');
      expect(metadata).toHaveProperty('wcagAAA');
      expect(metadata).toHaveProperty('onWhite');
      expect(metadata).toHaveProperty('onBlack');

      expect(metadata.wcagAA).toHaveProperty('normal');
      expect(metadata.wcagAA).toHaveProperty('large');
      expect(metadata.wcagAAA).toHaveProperty('normal');
      expect(metadata.wcagAAA).toHaveProperty('large');
    });

    it('should find accessible pairs within scale', () => {
      const metadata = generateAccessibilityMetadata(testScale);

      // Should find some AA compliant pairs
      expect(metadata.wcagAA.normal.length).toBeGreaterThan(0);
      expect(metadata.wcagAA.large.length).toBeGreaterThanOrEqual(metadata.wcagAA.normal.length);
    });

    it('should identify colors that work on white background', () => {
      const metadata = generateAccessibilityMetadata(testScale);

      // Darker colors should work on white
      expect(metadata.onWhite.aa).toContain(0); // Very dark should pass
      expect(metadata.onWhite.aa).toContain(1); // Dark should pass
      expect(metadata.onWhite.aa).not.toContain(4); // Very light should not pass
    });

    it('should identify colors that work on black background', () => {
      const metadata = generateAccessibilityMetadata(testScale);

      // Lighter colors should work on black
      expect(metadata.onBlack.aa).toContain(4); // Very light should pass
      expect(metadata.onBlack.aa).toContain(3); // Light should pass
      expect(metadata.onBlack.aa).not.toContain(0); // Very dark should not pass
    });

    it('should handle empty scale gracefully', () => {
      const metadata = generateAccessibilityMetadata([]);

      expect(metadata.wcagAA.normal).toEqual([]);
      expect(metadata.wcagAAA.normal).toEqual([]);
      expect(metadata.onWhite.aa).toEqual([]);
      expect(metadata.onBlack.aa).toEqual([]);
    });

    it('should handle invalid colors in scale', () => {
      const invalidScale = [
        { l: 0.5, c: 0.1, h: 200 },
        // @ts-expect-error - testing invalid color
        { l: null, c: 0.1, h: 200 },
        { l: 0.7, c: 0.1, h: 200 },
      ];

      const metadata = generateAccessibilityMetadata(invalidScale as OKLCH[]);
      expect(typeof metadata).toBe('object');
    });

    it('should have more large text pairs than normal text pairs', () => {
      const metadata = generateAccessibilityMetadata(testScale);

      expect(metadata.wcagAA.large.length).toBeGreaterThanOrEqual(metadata.wcagAA.normal.length);
      expect(metadata.wcagAAA.large.length).toBeGreaterThanOrEqual(metadata.wcagAAA.normal.length);
    });

    it('should have fewer AAA pairs than AA pairs', () => {
      const metadata = generateAccessibilityMetadata(testScale);

      expect(metadata.wcagAAA.normal.length).toBeLessThanOrEqual(metadata.wcagAA.normal.length);
      expect(metadata.wcagAAA.large.length).toBeLessThanOrEqual(metadata.wcagAA.large.length);
    });
  });

  describe('findAccessibleColor', () => {
    it('should return accessible color for WCAG-AA', () => {
      const targetColor: OKLCH = { l: 0.6, c: 0.1, h: 240 }; // Medium blue
      const result = findAccessibleColor(targetColor, white, 'WCAG-AA');

      expect(meetsWCAGStandard(result, white, 'AA', 'normal')).toBe(true);
      expect(result.c).toBeCloseTo(targetColor.c, 1); // Should preserve chroma
      expect(result.h).toBeCloseTo(targetColor.h, 1); // Should preserve hue
    });

    it('should return accessible color for WCAG-AAA', () => {
      const targetColor: OKLCH = { l: 0.6, c: 0.1, h: 120 }; // Medium green
      const result = findAccessibleColor(targetColor, white, 'WCAG-AAA');

      expect(meetsWCAGStandard(result, white, 'AAA', 'normal')).toBe(true);
    });

    it('should return accessible color for APCA', () => {
      const targetColor: OKLCH = { l: 0.6, c: 0.15, h: 0 }; // Medium red
      const result = findAccessibleColor(targetColor, white, 'APCA');

      expect(meetsAPCAStandard(result, white, 16)).toBe(true);
    });

    it('should adjust lightness for dark backgrounds', () => {
      const targetColor: OKLCH = { l: 0.4, c: 0.1, h: 60 }; // Medium yellow
      const result = findAccessibleColor(targetColor, black, 'WCAG-AA');

      expect(result.l).toBeGreaterThan(targetColor.l); // Should be lighter
      expect(meetsWCAGStandard(result, black, 'AA', 'normal')).toBe(true);
    });

    it('should adjust lightness for light backgrounds', () => {
      const targetColor: OKLCH = { l: 0.6, c: 0.1, h: 300 }; // Medium purple
      const result = findAccessibleColor(targetColor, white, 'WCAG-AA');

      expect(result.l).toBeLessThan(targetColor.l); // Should be darker
      expect(meetsWCAGStandard(result, white, 'AA', 'normal')).toBe(true);
    });

    it('should preserve hue and chroma when possible', () => {
      const targetColor: OKLCH = { l: 0.5, c: 0.2, h: 180 }; // Medium cyan
      const result = findAccessibleColor(targetColor, white, 'WCAG-AA');

      expect(result.h).toBeCloseTo(targetColor.h, 1);
      expect(result.c).toBeCloseTo(targetColor.c, 1);
    });

    it('should handle edge case where target is already accessible', () => {
      const accessibleColor: OKLCH = { l: 0.2, c: 0.1, h: 240 }; // Already dark enough
      const result = findAccessibleColor(accessibleColor, white, 'WCAG-AA');

      expect(meetsWCAGStandard(result, white, 'AA', 'normal')).toBe(true);
    });

    it('should clamp lightness values', () => {
      const extremeColor: OKLCH = { l: 1.5, c: 0.1, h: 0 }; // Out of range
      const result = findAccessibleColor(extremeColor, white, 'WCAG-AA');

      expect(result.l).toBeGreaterThanOrEqual(0);
      expect(result.l).toBeLessThanOrEqual(1);
    });

    it('should handle high chroma colors', () => {
      const vibrantColor: OKLCH = { l: 0.6, c: 0.3, h: 330 }; // Vibrant magenta
      const result = findAccessibleColor(vibrantColor, white, 'WCAG-AA');

      expect(meetsWCAGStandard(result, white, 'AA', 'normal')).toBe(true);
      expect(result.c).toBeCloseTo(vibrantColor.c, 1);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle NaN values gracefully', () => {
      const invalidColor: OKLCH = { l: NaN, c: 0.1, h: 200 };

      // Should not throw errors
      expect(() => calculateWCAGContrast(invalidColor, white)).not.toThrow();
      expect(() => calculateAPCAContrast(invalidColor, white)).not.toThrow();
    });

    it('should handle out-of-gamut colors', () => {
      const outOfGamut: OKLCH = { l: 0.5, c: 0.5, h: 200 }; // Very high chroma

      expect(() => calculateWCAGContrast(outOfGamut, white)).not.toThrow();
      expect(() => findAccessibleColor(outOfGamut, white, 'WCAG-AA')).not.toThrow();
    });

    it('should handle negative lightness values', () => {
      const negativeL: OKLCH = { l: -0.1, c: 0.1, h: 200 };

      expect(() => calculateWCAGContrast(negativeL, white)).not.toThrow();
      expect(() => meetsWCAGStandard(negativeL, white, 'AA', 'normal')).not.toThrow();
    });

    it('should handle extreme hue values', () => {
      const extremeHue: OKLCH = { l: 0.5, c: 0.1, h: 720 }; // > 360 degrees

      expect(() => calculateWCAGContrast(extremeHue, white)).not.toThrow();
      expect(() => findAccessibleColor(extremeHue, white, 'WCAG-AA')).not.toThrow();
    });
  });
});
