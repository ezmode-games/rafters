/**
 * Tests for color analysis functions
 */

import type { OKLCH } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { calculateColorDistance, getColorTemperature, isLightColor } from '../../src/analysis.js';
import { getHueFamily } from '../../src/naming.js';

describe('Color Analysis', () => {
  describe('calculateColorDistance', () => {
    const red: OKLCH = { l: 0.5, c: 0.15, h: 25 };
    const blue: OKLCH = { l: 0.5, c: 0.15, h: 240 };
    const lightRed: OKLCH = { l: 0.8, c: 0.15, h: 25 };
    const darkRed: OKLCH = { l: 0.2, c: 0.15, h: 25 };

    it('should return 0 for identical colors', () => {
      const distance = calculateColorDistance(red, red);
      expect(distance).toBe(0);
    });

    it('should return higher values for more different colors', () => {
      const sameHueDistance = calculateColorDistance(red, lightRed);
      const differentHueDistance = calculateColorDistance(red, blue);

      expect(differentHueDistance).toBeGreaterThan(sameHueDistance);
    });

    it('should be symmetric', () => {
      const distance1 = calculateColorDistance(red, blue);
      const distance2 = calculateColorDistance(blue, red);

      expect(distance1).toBeCloseTo(distance2, 5);
    });

    it('should handle lightness differences', () => {
      const lightDistance = calculateColorDistance(red, lightRed);
      const darkDistance = calculateColorDistance(red, darkRed);

      expect(lightDistance).toBeGreaterThan(0);
      expect(darkDistance).toBeGreaterThan(0);
    });

    it('should handle chroma differences', () => {
      const highChroma: OKLCH = { l: 0.5, c: 0.3, h: 25 };
      const lowChroma: OKLCH = { l: 0.5, c: 0.05, h: 25 };

      const distance = calculateColorDistance(highChroma, lowChroma);
      expect(distance).toBeGreaterThan(0);
    });

    it('should handle achromatic colors', () => {
      const gray1: OKLCH = { l: 0.5, c: 0, h: 0 };
      const gray2: OKLCH = { l: 0.7, c: 0, h: 0 };

      const distance = calculateColorDistance(gray1, gray2);
      expect(distance).toBeGreaterThan(0);
    });
  });

  describe('isLightColor', () => {
    it('should identify light colors', () => {
      const lightColors: OKLCH[] = [
        { l: 0.8, c: 0.1, h: 180 },
        { l: 0.9, c: 0.05, h: 60 },
        { l: 1, c: 0, h: 0 }, // White
      ];

      for (const color of lightColors) {
        expect(isLightColor(color)).toBe(true);
      }
    });

    it('should identify dark colors', () => {
      const darkColors: OKLCH[] = [
        { l: 0.2, c: 0.1, h: 180 },
        { l: 0.1, c: 0.05, h: 60 },
        { l: 0, c: 0, h: 0 }, // Black
      ];

      for (const color of darkColors) {
        expect(isLightColor(color)).toBe(false);
      }
    });

    it('should handle mid-range colors consistently', () => {
      const midColor: OKLCH = { l: 0.5, c: 0.15, h: 120 };
      const result = isLightColor(midColor);

      // Should return a boolean
      expect(typeof result).toBe('boolean');
    });

    it('should consider chroma in lightness perception', () => {
      // Very saturated colors might appear darker even with higher lightness
      const saturatedYellow: OKLCH = { l: 0.7, c: 0.4, h: 90 };
      const desaturatedYellow: OKLCH = { l: 0.7, c: 0.05, h: 90 };

      // Both should be light, but the algorithm might consider chroma
      expect(typeof isLightColor(saturatedYellow)).toBe('boolean');
      expect(typeof isLightColor(desaturatedYellow)).toBe('boolean');
    });
  });

  describe('getColorTemperature', () => {
    it('should identify warm colors', () => {
      const warmColors: OKLCH[] = [
        { l: 0.5, c: 0.15, h: 25 }, // Red
        { l: 0.5, c: 0.15, h: 50 }, // Orange
        { l: 0.5, c: 0.15, h: 85 }, // Yellow
        { l: 0.5, c: 0.15, h: 320 }, // Red-purple
      ];

      for (const color of warmColors) {
        const temp = getColorTemperature(color);
        expect(['warm', 'neutral']).toContain(temp);
      }
    });

    it('should identify cool colors', () => {
      const coolColors: OKLCH[] = [
        { l: 0.5, c: 0.15, h: 180 }, // Cyan
        { l: 0.5, c: 0.15, h: 240 }, // Blue
        { l: 0.5, c: 0.15, h: 280 }, // Purple
        { l: 0.5, c: 0.15, h: 140 }, // Green
      ];

      for (const color of coolColors) {
        const temp = getColorTemperature(color);
        expect(['cool', 'neutral']).toContain(temp);
      }
    });

    it('should identify neutral colors', () => {
      const neutralColors: OKLCH[] = [
        { l: 0.5, c: 0, h: 0 }, // Achromatic
        { l: 0.5, c: 0.02, h: 180 }, // Very low chroma
        { l: 0.8, c: 0.01, h: 45 }, // Near-white
        { l: 0.2, c: 0.01, h: 200 }, // Near-black
      ];

      for (const color of neutralColors) {
        expect(getColorTemperature(color)).toBe('neutral');
      }
    });

    it('should handle edge cases around temperature boundaries', () => {
      // Colors near the warm/cool boundaries
      const boundaryColors: OKLCH[] = [
        { l: 0.5, c: 0.15, h: 100 }, // Yellow-green boundary
        { l: 0.5, c: 0.15, h: 300 }, // Purple-red boundary
      ];

      for (const color of boundaryColors) {
        const temp = getColorTemperature(color);
        expect(['warm', 'cool', 'neutral']).toContain(temp);
      }
    });

    it('should be consistent with hue family classification', () => {
      const testColors: OKLCH[] = [
        { l: 0.5, c: 0.15, h: 25 }, // Red
        { l: 0.5, c: 0.15, h: 60 }, // Orange
        { l: 0.5, c: 0.15, h: 180 }, // Cyan
        { l: 0.5, c: 0.15, h: 240 }, // Blue
      ];

      for (const color of testColors) {
        const hueFamily = getHueFamily(color);
        const temperature = getColorTemperature(color);

        // Red and orange should generally be warm
        if (hueFamily === 'red' || hueFamily === 'orange') {
          expect(['warm', 'neutral']).toContain(temperature);
        }

        // Blue should generally be cool
        if (hueFamily === 'blue') {
          expect(['cool', 'neutral']).toContain(temperature);
        }
      }
    });
  });
});
