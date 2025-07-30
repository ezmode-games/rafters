/**
 * Tests for OKLCH color conversion functions
 */

import type { OKLCH } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { hexToOKLCH, oklchToCSS, oklchToHex } from '../../src/conversion.js';

describe('OKLCH Color Conversions', () => {
  describe('oklchToHex', () => {
    it('should convert red OKLCH to hex', () => {
      const red: OKLCH = { l: 0.628, c: 0.258, h: 29.234 };
      const hex = oklchToHex(red);
      expect(hex).toMatch(/^#[0-9a-f]{6}$/i);
      expect(hex.toLowerCase()).toBe('#ff0000');
    });

    it('should convert white OKLCH to hex', () => {
      const white: OKLCH = { l: 1, c: 0, h: 0 };
      const hex = oklchToHex(white);
      expect(hex.toLowerCase()).toBe('#ffffff');
    });

    it('should convert black OKLCH to hex', () => {
      const black: OKLCH = { l: 0, c: 0, h: 0 };
      const hex = oklchToHex(black);
      expect(hex.toLowerCase()).toBe('#000000');
    });
  });

  describe('oklchToCSS', () => {
    it('should convert OKLCH to CSS oklch() function', () => {
      const color: OKLCH = { l: 0.5, c: 0.1, h: 180 };
      const css = oklchToCSS(color);
      expect(css).toBe('oklch(0.5 0.1 180)');
    });

    it('should handle zero chroma (achromatic)', () => {
      const gray: OKLCH = { l: 0.5, c: 0, h: 0 };
      const css = oklchToCSS(gray);
      expect(css).toBe('oklch(0.5 0 0)');
    });
  });

  describe('hexToOKLCH', () => {
    it('should convert hex to OKLCH', () => {
      const oklch = hexToOKLCH('#ff0000');
      expect(oklch.l).toBeCloseTo(0.628, 1);
      expect(oklch.c).toBeCloseTo(0.258, 1);
      expect(oklch.h).toBeCloseTo(29.234, 0);
    });

    it('should handle short hex format', () => {
      const oklch = hexToOKLCH('#f00');
      expect(oklch.l).toBeCloseTo(0.628, 1);
      expect(oklch.c).toBeGreaterThan(0.2);
    });

    it('should throw for invalid hex', () => {
      expect(() => hexToOKLCH('invalid')).toThrow();
      expect(() => hexToOKLCH('#gggggg')).toThrow();
    });
  });

  describe('round-trip conversions', () => {
    it('should maintain color integrity through hex->OKLCH->hex', () => {
      const originalHex = '#3b82f6';
      const oklch = hexToOKLCH(originalHex);
      const resultHex = oklchToHex(oklch);

      // Colors should be very close (allowing for minor rounding)
      expect(resultHex.toLowerCase()).toBe(originalHex.toLowerCase());
    });
  });
});
