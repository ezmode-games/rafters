/**
 * Manipulation Module Tests
 *
 * Tests color manipulation functions for lightness, chroma,
 * and hue adjustments.
 */

import type { OKLCH } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import {
  adjustChroma,
  adjustHue,
  adjustLightness,
  blendColors,
} from '../../src/color-utils/manipulation';

describe('Manipulation Module', () => {
  const baseColor: OKLCH = { l: 0.6, c: 0.15, h: 240 };

  describe('adjustLightness', () => {
    it('should adjust lightness up', () => {
      const lighter = adjustLightness(baseColor, 0.1);
      expect(lighter.l).toBeGreaterThan(baseColor.l);
    });

    it('should adjust lightness down', () => {
      const darker = adjustLightness(baseColor, -0.1);
      expect(darker.l).toBeLessThan(baseColor.l);
    });

    it('should clamp lightness values', () => {
      const tooLight = adjustLightness(baseColor, 1);
      const tooDark = adjustLightness(baseColor, -1);

      expect(tooLight.l).toBeLessThanOrEqual(1);
      expect(tooDark.l).toBeGreaterThanOrEqual(0);
    });
  });

  describe('adjustChroma', () => {
    it('should adjust chroma', () => {
      const moreVibrant = adjustChroma(baseColor, 0.1);
      const lessVibrant = adjustChroma(baseColor, -0.05);

      expect(moreVibrant.c).toBeGreaterThan(baseColor.c);
      expect(lessVibrant.c).toBeLessThan(baseColor.c);
    });

    it('should clamp chroma values', () => {
      const tooVibrant = adjustChroma(baseColor, 1);
      const tooGray = adjustChroma(baseColor, -1);

      expect(tooVibrant.c).toBeGreaterThanOrEqual(0);
      expect(tooGray.c).toBeGreaterThanOrEqual(0);
    });
  });

  describe('adjustHue', () => {
    it('should adjust hue', () => {
      const shifted = adjustHue(baseColor, 30);
      expect(shifted.h).not.toBe(baseColor.h);
    });

    it('should wrap hue values', () => {
      const wrapped = adjustHue(baseColor, 200);
      expect(wrapped.h).toBeGreaterThanOrEqual(0);
      expect(wrapped.h).toBeLessThan(360);
    });
  });

  describe('blendColors', () => {
    it('should blend two colors', () => {
      const color1: OKLCH = { l: 0.2, c: 0.1, h: 0 };
      const color2: OKLCH = { l: 0.8, c: 0.2, h: 120 };

      const blended = blendColors(color1, color2, 0.5);

      expect(blended.l).toBeGreaterThan(color1.l);
      expect(blended.l).toBeLessThan(color2.l);
    });

    it('should return first color at ratio 0', () => {
      const color1: OKLCH = { l: 0.2, c: 0.1, h: 0 };
      const color2: OKLCH = { l: 0.8, c: 0.2, h: 120 };

      const blended = blendColors(color1, color2, 0);

      expect(blended.l).toBeCloseTo(color1.l, 2);
      expect(blended.c).toBeCloseTo(color1.c, 2);
      expect(blended.h).toBeCloseTo(color1.h, 2);
    });

    it('should return second color at ratio 1', () => {
      const color1: OKLCH = { l: 0.2, c: 0.1, h: 0 };
      const color2: OKLCH = { l: 0.8, c: 0.2, h: 120 };

      const blended = blendColors(color1, color2, 1);

      expect(blended.l).toBeCloseTo(color2.l, 2);
      expect(blended.c).toBeCloseTo(color2.c, 2);
      expect(blended.h).toBeCloseTo(color2.h, 2);
    });
  });
});
