/**
 * Analysis Module Tests
 *
 * Tests color analysis functions for perceptual properties,
 * color distance calculations, and temperature detection.
 */

import type { OKLCH } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import {
  calculateColorDistance,
  getColorTemperature,
  isLightColor,
} from '../../src/color-utils/analysis';

describe('Analysis Module', () => {
  // Test colors
  const red: OKLCH = { l: 0.6, c: 0.2, h: 0 };
  const blue: OKLCH = { l: 0.5, c: 0.15, h: 240 };
  const white: OKLCH = { l: 1, c: 0, h: 0 };
  const black: OKLCH = { l: 0, c: 0, h: 0 };
  const gray: OKLCH = { l: 0.5, c: 0, h: 0 };

  describe('calculateColorDistance', () => {
    it('should return 0 for identical colors', () => {
      const distance = calculateColorDistance(red, red);
      expect(distance).toBe(0);
    });

    it('should calculate distance between different colors', () => {
      const distance = calculateColorDistance(red, blue);
      expect(distance).toBeGreaterThan(0);
    });

    it('should be symmetric', () => {
      const distance1 = calculateColorDistance(red, blue);
      const distance2 = calculateColorDistance(blue, red);
      expect(distance1).toBeCloseTo(distance2, 5);
    });

    it('should calculate maximum distance for black and white', () => {
      const distance = calculateColorDistance(black, white);
      expect(distance).toBeGreaterThan(90); // Should be close to 100
    });

    it('should handle achromatic colors', () => {
      const distance = calculateColorDistance(gray, white);
      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(100);
    });

    it('should handle high chroma colors', () => {
      const vibrant1: OKLCH = { l: 0.6, c: 0.3, h: 60 };
      const vibrant2: OKLCH = { l: 0.6, c: 0.3, h: 180 };

      const distance = calculateColorDistance(vibrant1, vibrant2);
      expect(distance).toBeGreaterThan(0);
    });
  });

  describe('getColorTemperature', () => {
    it('should identify warm colors', () => {
      const orange: OKLCH = { l: 0.6, c: 0.15, h: 30 };
      expect(getColorTemperature(orange)).toBe('warm');
    });

    it('should identify cool colors', () => {
      expect(getColorTemperature(blue)).toBe('cool');
    });

    it('should handle neutral colors', () => {
      expect(getColorTemperature(gray)).toBe('neutral');
    });

    it('should handle edge cases around temperature boundaries', () => {
      const coolRed: OKLCH = { l: 0.5, c: 0.1, h: 350 };
      const warmBlue: OKLCH = { l: 0.5, c: 0.1, h: 190 };

      // Should handle boundary cases consistently
      expect(['warm', 'neutral', 'cool']).toContain(getColorTemperature(coolRed));
      expect(['warm', 'neutral', 'cool']).toContain(getColorTemperature(warmBlue));
    });
  });

  describe('isLightColor', () => {
    it('should identify light colors', () => {
      expect(isLightColor(white)).toBe(true);

      const lightGray: OKLCH = { l: 0.8, c: 0, h: 0 };
      expect(isLightColor(lightGray)).toBe(true);
    });

    it('should identify dark colors', () => {
      expect(isLightColor(black)).toBe(false);

      const darkBlue: OKLCH = { l: 0.2, c: 0.1, h: 240 };
      expect(isLightColor(darkBlue)).toBe(false);
    });

    it('should handle medium lightness colors', () => {
      const result = isLightColor(gray);
      expect(typeof result).toBe('boolean');
    });

    it('should be consistent with lightness threshold', () => {
      const justLight: OKLCH = { l: 0.6, c: 0.1, h: 120 };
      const justDark: OKLCH = { l: 0.4, c: 0.1, h: 120 };

      expect(isLightColor(justLight)).toBe(true);
      expect(isLightColor(justDark)).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle extreme lightness values', () => {
      const veryLight: OKLCH = { l: 0.99, c: 0.01, h: 180 };
      const veryDark: OKLCH = { l: 0.01, c: 0.01, h: 180 };

      expect(() => calculateColorDistance(veryLight, veryDark)).not.toThrow();
      expect(() => getColorTemperature(veryLight)).not.toThrow();
      expect(() => isLightColor(veryDark)).not.toThrow();
    });

    it('should handle high chroma values', () => {
      const highChroma: OKLCH = { l: 0.5, c: 0.4, h: 90 };

      expect(() => calculateColorDistance(highChroma, red)).not.toThrow();
      expect(() => getColorTemperature(highChroma)).not.toThrow();
      expect(() => isLightColor(highChroma)).not.toThrow();
    });

    it('should handle edge case hue values', () => {
      const hue360: OKLCH = { l: 0.5, c: 0.1, h: 360 };
      const hue0: OKLCH = { l: 0.5, c: 0.1, h: 0 };

      expect(() => calculateColorDistance(hue360, hue0)).not.toThrow();
      expect(() => getColorTemperature(hue360)).not.toThrow();
    });
  });
});
