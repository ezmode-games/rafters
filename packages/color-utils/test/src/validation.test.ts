/**
 * Tests for OKLCH color validation functions
 */

import type { OKLCH } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { isValidOKLCH, parseColorToOKLCH } from '../../src/validation.js';

describe('OKLCH Color Validation', () => {
  describe('isValidOKLCH', () => {
    it('should validate correct OKLCH values', () => {
      const validColor: OKLCH = { l: 0.5, c: 0.1, h: 180 };
      expect(isValidOKLCH(validColor)).toBe(true);
    });

    it('should reject invalid lightness values', () => {
      expect(isValidOKLCH({ l: -0.1, c: 0.1, h: 180 })).toBe(false);
      expect(isValidOKLCH({ l: 1.1, c: 0.1, h: 180 })).toBe(false);
    });

    it('should reject invalid chroma values', () => {
      expect(isValidOKLCH({ l: 0.5, c: -0.1, h: 180 })).toBe(false);
      expect(isValidOKLCH({ l: 0.5, c: 0.5, h: 180 })).toBe(true); // 0.5 is valid
    });

    it('should handle hue wrap-around correctly', () => {
      expect(isValidOKLCH({ l: 0.5, c: 0.1, h: 360 })).toBe(true);
      expect(isValidOKLCH({ l: 0.5, c: 0.1, h: -10 })).toBe(true);
      expect(isValidOKLCH({ l: 0.5, c: 0.1, h: 450 })).toBe(true);
    });
  });

  describe('parseColorToOKLCH', () => {
    it('should parse hex colors to OKLCH', () => {
      const result = parseColorToOKLCH('#ff0000');
      expect(result).toHaveProperty('l');
      expect(result).toHaveProperty('c');
      expect(result).toHaveProperty('h');
      expect(result.l).toBeGreaterThan(0);
      expect(result.c).toBeGreaterThan(0);
    });

    it('should parse CSS oklch() strings', () => {
      const result = parseColorToOKLCH('oklch(0.5 0.1 180)');
      expect(result.l).toBeCloseTo(0.5, 2);
      expect(result.c).toBeCloseTo(0.1, 2);
      expect(result.h).toBeCloseTo(180, 1);
    });

    it('should throw for invalid color strings', () => {
      expect(() => parseColorToOKLCH('invalid')).toThrow();
      expect(() => parseColorToOKLCH('')).toThrow();
    });
  });
});
