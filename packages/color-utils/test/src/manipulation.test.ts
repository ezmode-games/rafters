/**
 * Tests for OKLCH color manipulation functions
 */

import type { OKLCH } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { adjustChroma, adjustHue, darken, lighten } from '../../src//manipulation.js';

describe('OKLCH Color Manipulation', () => {
  const baseColor: OKLCH = { l: 0.5, c: 0.1, h: 180 };

  describe('lighten', () => {
    it('should increase lightness by specified amount', () => {
      const result = lighten(baseColor, 0.2);
      expect(result.l).toBe(0.7);
      expect(result.c).toBe(baseColor.c);
      expect(result.h).toBe(baseColor.h);
    });

    it('should clamp lightness to 1.0', () => {
      const result = lighten(baseColor, 0.6);
      expect(result.l).toBe(1.0);
    });

    it('should handle negative amounts (darken)', () => {
      const result = lighten(baseColor, -0.2);
      expect(result.l).toBe(0.3);
    });
  });

  describe('darken', () => {
    it('should decrease lightness by specified amount', () => {
      const result = darken(baseColor, 0.2);
      expect(result.l).toBe(0.3);
      expect(result.c).toBe(baseColor.c);
      expect(result.h).toBe(baseColor.h);
    });

    it('should clamp lightness to 0.0', () => {
      const result = darken(baseColor, 0.6);
      expect(result.l).toBe(0.0);
    });

    it('should handle negative amounts (lighten)', () => {
      const result = darken(baseColor, -0.2);
      expect(result.l).toBe(0.7);
    });
  });

  describe('adjustChroma', () => {
    it('should adjust chroma by specified amount', () => {
      const result = adjustChroma(baseColor, 0.05);
      expect(result.c).toBeCloseTo(0.15, 5);
      expect(result.l).toBe(baseColor.l);
      expect(result.h).toBe(baseColor.h);
    });

    it('should clamp chroma to 0.0 minimum', () => {
      const result = adjustChroma(baseColor, -0.2);
      expect(result.c).toBe(0.0);
    });

    it('should allow high chroma values', () => {
      const result = adjustChroma(baseColor, 0.3);
      expect(result.c).toBe(0.4);
    });
  });

  describe('adjustHue', () => {
    it('should adjust hue by specified degrees', () => {
      const result = adjustHue(baseColor, 90);
      expect(result.h).toBe(270);
      expect(result.l).toBe(baseColor.l);
      expect(result.c).toBe(baseColor.c);
    });

    it('should wrap hue around 360 degrees', () => {
      const result = adjustHue(baseColor, 200);
      expect(result.h).toBe(20); // 180 + 200 - 360 = 20
    });

    it('should handle negative adjustments', () => {
      const result = adjustHue(baseColor, -90);
      expect(result.h).toBe(90);
    });

    it('should handle negative wrap-around', () => {
      const result = adjustHue(baseColor, -200);
      expect(result.h).toBe(340); // 180 - 200 + 360 = 340
    });
  });
});
