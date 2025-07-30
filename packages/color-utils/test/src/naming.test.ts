/**
 * Tests for descriptive color naming functions
 */

import type { OKLCH } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { generateColorName, getHueFamily } from '../../src/naming.js';

describe('Color Naming', () => {
  describe('getHueFamily', () => {
    it('should identify red hues', () => {
      expect(getHueFamily({ l: 0.5, c: 0.15, h: 25 })).toBe('red');
      expect(getHueFamily({ l: 0.5, c: 0.15, h: 350 })).toBe('red');
    });

    it('should identify orange hues', () => {
      expect(getHueFamily({ l: 0.5, c: 0.15, h: 50 })).toBe('orange');
    });

    it('should identify yellow hues', () => {
      expect(getHueFamily({ l: 0.5, c: 0.15, h: 85 })).toBe('yellow');
    });

    it('should identify green hues', () => {
      expect(getHueFamily({ l: 0.5, c: 0.15, h: 120 })).toBe('green');
      expect(getHueFamily({ l: 0.5, c: 0.15, h: 160 })).toBe('green');
    });

    it('should identify blue hues', () => {
      expect(getHueFamily({ l: 0.5, c: 0.15, h: 240 })).toBe('blue');
    });

    it('should identify purple hues', () => {
      expect(getHueFamily({ l: 0.5, c: 0.15, h: 300 })).toBe('purple');
    });

    it('should identify neutral/achromatic colors', () => {
      expect(getHueFamily({ l: 0.5, c: 0.02, h: 180 })).toBe('neutral');
      expect(getHueFamily({ l: 0.5, c: 0, h: 0 })).toBe('neutral');
    });
  });

  describe('generateColorName', () => {
    it('should generate descriptive names for blue colors', () => {
      const steelBlue: OKLCH = { l: 0.45, c: 0.08, h: 240 };
      const name = generateColorName(steelBlue);
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(3);
      expect(getHueFamily(steelBlue)).toBe('blue');
    });

    it('should generate names for vibrant colors', () => {
      const vibrantRed: OKLCH = { l: 0.6, c: 0.25, h: 25 };
      const name = generateColorName(vibrantRed);
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(3);
      expect(getHueFamily(vibrantRed)).toBe('red');
    });

    it('should generate names for muted colors', () => {
      const mutedGreen: OKLCH = { l: 0.4, c: 0.06, h: 140 };
      const name = generateColorName(mutedGreen);
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(3);
      expect(getHueFamily(mutedGreen)).toBe('green');
    });

    it('should generate names for light colors', () => {
      const lightPink: OKLCH = { l: 0.85, c: 0.08, h: 15 };
      const name = generateColorName(lightPink);
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(3);
    });

    it('should generate names for dark colors', () => {
      const darkPurple: OKLCH = { l: 0.25, c: 0.12, h: 290 };
      const name = generateColorName(darkPurple);
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(3);
      expect(getHueFamily(darkPurple)).toBe('purple');
    });

    it('should generate names for neutral colors', () => {
      const warmGray: OKLCH = { l: 0.5, c: 0.02, h: 45 };
      const name = generateColorName(warmGray);
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(3);
      expect(getHueFamily(warmGray)).toBe('neutral');
    });

    it('should handle edge cases', () => {
      const black: OKLCH = { l: 0, c: 0, h: 0 };
      const white: OKLCH = { l: 1, c: 0, h: 0 };

      const blackName = generateColorName(black);
      const whiteName = generateColorName(white);

      expect(typeof blackName).toBe('string');
      expect(typeof whiteName).toBe('string');
      expect(blackName.length).toBeGreaterThan(3);
      expect(whiteName.length).toBeGreaterThan(3);
    });
  });
});
