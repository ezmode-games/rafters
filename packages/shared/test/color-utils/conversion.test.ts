/**
 * Conversion Module Tests
 *
 * Tests OKLCH to/from hex conversions, CSS output formatting,
 * and precision rounding functionality.
 */

import type { OKLCH } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { hexToOKLCH, oklchToCSS, oklchToHex, roundOKLCH } from '../../src/color-utils/conversion';

describe('Conversion Module', () => {
  // Test colors
  const red: OKLCH = { l: 0.6, c: 0.2, h: 0 };
  const blue: OKLCH = { l: 0.5, c: 0.15, h: 240 };
  const white: OKLCH = { l: 1, c: 0, h: 0 };
  const black: OKLCH = { l: 0, c: 0, h: 0 };
  const gray: OKLCH = { l: 0.5, c: 0, h: 0 };

  describe('oklchToHex', () => {
    it('should convert red OKLCH to hex', () => {
      const hex = oklchToHex(red);
      expect(hex).toMatch(/^#[0-9a-f]{6}$/i);
      expect(hex.length).toBe(7); // Valid hex color format
    });

    it('should convert blue OKLCH to hex', () => {
      const hex = oklchToHex(blue);
      expect(hex).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it('should convert white to #ffffff', () => {
      const hex = oklchToHex(white);
      expect(hex.toLowerCase()).toBe('#ffffff');
    });

    it('should convert black to #000000', () => {
      const hex = oklchToHex(black);
      expect(hex.toLowerCase()).toBe('#000000');
    });

    it('should handle achromatic colors (grays)', () => {
      const hex = oklchToHex(gray);
      expect(hex).toMatch(/^#[0-9a-f]{6}$/i);

      // For gray, R, G, B should be approximately equal
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);

      expect(Math.abs(r - g)).toBeLessThan(5);
      expect(Math.abs(g - b)).toBeLessThan(5);
    });

    it('should handle colors with alpha', () => {
      const colorWithAlpha: OKLCH = { l: 0.5, c: 0.1, h: 120, alpha: 0.5 };
      const hex = oklchToHex(colorWithAlpha);
      expect(hex).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it('should handle edge case lightness values', () => {
      const veryDark: OKLCH = { l: 0.01, c: 0.1, h: 180 };
      const veryLight: OKLCH = { l: 0.99, c: 0.1, h: 180 };

      expect(() => oklchToHex(veryDark)).not.toThrow();
      expect(() => oklchToHex(veryLight)).not.toThrow();
    });

    it('should handle high chroma colors', () => {
      const vibrant: OKLCH = { l: 0.6, c: 0.3, h: 60 };

      expect(() => oklchToHex(vibrant)).not.toThrow();
      const hex = oklchToHex(vibrant);
      expect(hex).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });

  describe('oklchToCSS', () => {
    it('should format OKLCH as CSS oklch() function', () => {
      const css = oklchToCSS(red);
      expect(css).toBe('oklch(0.6 0.2 0)');
    });

    it('should format blue correctly', () => {
      const css = oklchToCSS(blue);
      expect(css).toBe('oklch(0.5 0.15 240)');
    });

    it('should format white correctly', () => {
      const css = oklchToCSS(white);
      expect(css).toBe('oklch(1 0 0)');
    });

    it('should format black correctly', () => {
      const css = oklchToCSS(black);
      expect(css).toBe('oklch(0 0 0)');
    });

    it('should handle decimal values', () => {
      const precise: OKLCH = { l: 0.654, c: 0.123, h: 234.5 };
      const css = oklchToCSS(precise);
      expect(css).toBe('oklch(0.654 0.123 234.5)');
    });

    it('should handle achromatic colors', () => {
      const css = oklchToCSS(gray);
      expect(css).toBe('oklch(0.5 0 0)');
    });

    it('should handle colors with zero chroma', () => {
      const achromatic: OKLCH = { l: 0.3, c: 0, h: 120 };
      const css = oklchToCSS(achromatic);
      expect(css).toBe('oklch(0.3 0 120)');
    });
  });

  describe('hexToOKLCH', () => {
    it('should convert #ffffff to white OKLCH', () => {
      const oklch = hexToOKLCH('#ffffff');
      expect(oklch.l).toBeCloseTo(1, 1);
      expect(oklch.c).toBeCloseTo(0, 2);
    });

    it('should convert #000000 to black OKLCH', () => {
      const oklch = hexToOKLCH('#000000');
      expect(oklch.l).toBeCloseTo(0, 1);
      expect(oklch.c).toBeCloseTo(0, 2);
    });

    it('should handle red hex colors', () => {
      const oklch = hexToOKLCH('#ff0000');
      expect(oklch.l).toBeGreaterThan(0.4);
      expect(oklch.l).toBeLessThan(0.8);
      expect(oklch.c).toBeGreaterThan(0.1);
      expect(oklch.h).toBeCloseTo(29, 0); // Red hex maps to ~29° in OKLCH
    });

    it('should handle blue hex colors', () => {
      const oklch = hexToOKLCH('#0000ff');
      expect(oklch.l).toBeGreaterThan(0.2);
      expect(oklch.l).toBeLessThan(0.6);
      expect(oklch.c).toBeGreaterThan(0.1);
      expect(oklch.h).toBeGreaterThan(200);
      expect(oklch.h).toBeLessThan(280);
    });

    it('should handle green hex colors', () => {
      const oklch = hexToOKLCH('#00ff00');
      expect(oklch.l).toBeGreaterThan(0.6);
      expect(oklch.c).toBeGreaterThan(0.1);
      expect(oklch.h).toBeGreaterThan(80);
      expect(oklch.h).toBeLessThan(180);
    });

    it('should handle short hex format', () => {
      const oklch = hexToOKLCH('#f00');
      expect(oklch.l).toBeGreaterThan(0.4);
      expect(oklch.c).toBeGreaterThan(0.1);
    });

    it('should handle lowercase hex', () => {
      const oklch = hexToOKLCH('#aabbcc');
      expect(oklch.l).toBeGreaterThan(0);
      expect(oklch.l).toBeLessThan(1);
    });

    it('should handle mixed case hex', () => {
      const oklch = hexToOKLCH('#AaBbCc');
      expect(oklch.l).toBeGreaterThan(0);
      expect(oklch.l).toBeLessThan(1);
    });

    it('should throw error for invalid hex', () => {
      expect(() => hexToOKLCH('invalid')).toThrow('Invalid hex color');
      expect(() => hexToOKLCH('#xyz')).toThrow('Invalid hex color');
      expect(() => hexToOKLCH('')).toThrow('Invalid hex color');
    });

    it('should throw error for malformed hex', () => {
      expect(() => hexToOKLCH('#fffff')).toThrow(); // 5 digits not valid
      expect(() => hexToOKLCH('#gggggg')).toThrow(); // Invalid hex characters
    });

    it('should include alpha property', () => {
      const oklch = hexToOKLCH('#ff0000');
      expect(oklch.alpha).toBe(1);
    });

    it('should handle achromatic colors properly', () => {
      const grayOklch = hexToOKLCH('#808080');
      expect(grayOklch.c).toBeCloseTo(0, 2); // Should be achromatic
      expect(grayOklch.h).toBeDefined(); // Hue should be defined even if 0
    });
  });

  describe('roundOKLCH', () => {
    it('should round lightness to 2 decimal places', () => {
      const precise: OKLCH = { l: 0.123456, c: 0.1, h: 120 };
      const rounded = roundOKLCH(precise);
      expect(rounded.l).toBe(0.12);
    });

    it('should round chroma to 2 decimal places', () => {
      const precise: OKLCH = { l: 0.5, c: 0.123456, h: 120 };
      const rounded = roundOKLCH(precise);
      expect(rounded.c).toBe(0.12);
    });

    it('should round hue to whole degrees', () => {
      const precise: OKLCH = { l: 0.5, c: 0.1, h: 123.456 };
      const rounded = roundOKLCH(precise);
      expect(rounded.h).toBe(123);
    });

    it('should round alpha to 2 decimal places when present', () => {
      const precise: OKLCH = { l: 0.5, c: 0.1, h: 120, alpha: 0.123456 };
      const rounded = roundOKLCH(precise);
      expect(rounded.alpha).toBe(0.12);
    });

    it('should preserve undefined alpha', () => {
      const noAlpha: OKLCH = { l: 0.5, c: 0.1, h: 120 };
      const rounded = roundOKLCH(noAlpha);
      expect(rounded.alpha).toBeUndefined();
    });

    it('should handle edge case values', () => {
      const edgeCase: OKLCH = { l: 0.999999, c: 0.999999, h: 359.999 };
      const rounded = roundOKLCH(edgeCase);

      expect(rounded.l).toBe(1);
      expect(rounded.c).toBe(1);
      expect(rounded.h).toBe(360);
    });

    it('should handle zero values', () => {
      const zeros: OKLCH = { l: 0.000001, c: 0.000001, h: 0.000001 };
      const rounded = roundOKLCH(zeros);

      expect(rounded.l).toBe(0);
      expect(rounded.c).toBe(0);
      expect(rounded.h).toBe(0);
    });

    it('should handle negative values', () => {
      const negative: OKLCH = { l: -0.123, c: -0.123, h: -123.456 };
      const rounded = roundOKLCH(negative);

      expect(rounded.l).toBe(-0.12);
      expect(rounded.c).toBe(-0.12);
      expect(rounded.h).toBe(-123);
    });

    it('should be consistent for multiple calls', () => {
      const color: OKLCH = { l: 0.123456, c: 0.654321, h: 234.567 };
      const rounded1 = roundOKLCH(color);
      const rounded2 = roundOKLCH(rounded1);

      expect(rounded1).toEqual(rounded2);
    });
  });

  describe('Round-trip Conversions', () => {
    it('should maintain consistency in hex round-trip for simple colors', () => {
      const originalHex = '#ff0000';
      const oklch = hexToOKLCH(originalHex);
      const backToHex = oklchToHex(oklch);

      // Convert both to RGB for comparison (since hex might have slight variations)
      const original = hexToOKLCH(originalHex);
      const final = hexToOKLCH(backToHex);

      expect(final.l).toBeCloseTo(original.l, 1);
      expect(final.c).toBeCloseTo(original.c, 1);
    });

    it('should handle white round-trip conversion', () => {
      const originalHex = '#ffffff';
      const oklch = hexToOKLCH(originalHex);
      const backToHex = oklchToHex(oklch);

      expect(backToHex.toLowerCase()).toBe('#ffffff');
    });

    it('should handle black round-trip conversion', () => {
      const originalHex = '#000000';
      const oklch = hexToOKLCH(originalHex);
      const backToHex = oklchToHex(oklch);

      expect(backToHex.toLowerCase()).toBe('#000000');
    });

    it('should handle CSS formatting round-trip', () => {
      const original: OKLCH = { l: 0.5, c: 0.15, h: 240 };
      const css = oklchToCSS(original);

      expect(css).toContain('oklch(');
      expect(css).toContain('0.5');
      expect(css).toContain('0.15');
      expect(css).toContain('240');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle very small numbers', () => {
      const tiny: OKLCH = { l: 1e-10, c: 1e-10, h: 1e-10 };

      expect(() => oklchToHex(tiny)).not.toThrow();
      expect(() => oklchToCSS(tiny)).not.toThrow();
      expect(() => roundOKLCH(tiny)).not.toThrow();
    });

    it('should handle very large numbers', () => {
      const large: OKLCH = { l: 1e6, c: 1e6, h: 1e6 };

      expect(() => oklchToCSS(large)).not.toThrow();
      expect(() => roundOKLCH(large)).not.toThrow();
    });

    it('should handle NaN values', () => {
      const nanColor: OKLCH = { l: NaN, c: NaN, h: NaN };

      expect(() => roundOKLCH(nanColor)).not.toThrow();

      const rounded = roundOKLCH(nanColor);
      expect(Number.isNaN(rounded.l)).toBe(true);
      expect(Number.isNaN(rounded.c)).toBe(true);
      expect(Number.isNaN(rounded.h)).toBe(true);
    });

    it('should handle Infinity values', () => {
      const infiniteColor: OKLCH = { l: Infinity, c: -Infinity, h: Infinity };

      expect(() => roundOKLCH(infiniteColor)).not.toThrow();
    });
  });
});
