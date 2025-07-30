/**
 * Tests for palette generation functions
 */

import type { OKLCH } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { generateLightnessScale } from '../../src/palette.js';

describe('Palette Generation', () => {
  describe('generateLightnessScale', () => {
    const baseBlue: OKLCH = { l: 0.5, c: 0.15, h: 240 };

    it('should generate all standard scale values', () => {
      const scale = generateLightnessScale(baseBlue);

      const expectedSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

      for (const step of expectedSteps) {
        expect(scale[step]).toBeDefined();
        expect(scale[step]).toHaveProperty('l');
        expect(scale[step]).toHaveProperty('c');
        expect(scale[step]).toHaveProperty('h');
      }
    });

    it('should preserve hue reasonably across lightness values', () => {
      const scale = generateLightnessScale(baseBlue);

      // Most colors should preserve hue reasonably well
      // Extreme lightness values may shift hue due to color space conversion
      const middleValues = [200, 300, 400, 500, 600, 700, 800];

      for (const step of middleValues) {
        const color = scale[step];
        if (color && color.c > 0.05) {
          // Only check colors with meaningful chroma
          const hueDiff = Math.min(
            Math.abs(color.h - baseBlue.h),
            Math.abs(color.h - baseBlue.h + 360),
            Math.abs(color.h - baseBlue.h - 360)
          );
          expect(hueDiff).toBeLessThan(60); // Allow for color space conversion variance
        }
      }
    });

    it('should have progressively darker lightness values', () => {
      const scale = generateLightnessScale(baseBlue);

      const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

      for (let i = 1; i < steps.length; i++) {
        const lighter = scale[steps[i - 1]];
        const darker = scale[steps[i]];
        expect(lighter.l).toBeGreaterThan(darker.l);
      }
    });

    it('should maintain reasonable chroma distribution', () => {
      const scale = generateLightnessScale(baseBlue);

      // Chroma should be preserved in middle range
      expect(scale[500].c).toBeCloseTo(baseBlue.c, 0.05);

      // Very light and very dark colors should have reduced chroma
      expect(scale[50].c).toBeLessThanOrEqual(baseBlue.c * 1.1);
      expect(scale[950].c).toBeLessThanOrEqual(baseBlue.c);
    });

    it('should handle low chroma base colors', () => {
      const grayColor: OKLCH = { l: 0.5, c: 0.02, h: 0 };
      const scale = generateLightnessScale(grayColor);

      for (const color of Object.values(scale)) {
        expect(color.c).toBeGreaterThanOrEqual(0);
        expect(color.c).toBeLessThanOrEqual(0.05); // Should remain low chroma
      }
    });

    it('should handle high chroma base colors', () => {
      const vibrantColor: OKLCH = { l: 0.6, c: 0.3, h: 120 };
      const scale = generateLightnessScale(vibrantColor);

      // Should handle high chroma without breaking
      for (const color of Object.values(scale)) {
        expect(color.c).toBeGreaterThanOrEqual(0);
        expect(color.l).toBeGreaterThanOrEqual(0);
        expect(color.l).toBeLessThanOrEqual(1);
      }
    });

    it('should produce perceptually uniform steps', () => {
      const scale = generateLightnessScale(baseBlue);

      // Check that lightness steps feel perceptually even
      // This is a simplified test - real perceptual uniformity is complex
      const steps = [100, 200, 300, 400, 500, 600, 700, 800, 900];
      const differences: number[] = [];

      for (let i = 1; i < steps.length; i++) {
        const diff = scale[steps[i - 1]].l - scale[steps[i]].l;
        differences.push(diff);
      }

      // Differences should be reasonably consistent (within 50% variance)
      const avgDiff = differences.reduce((a, b) => a + b) / differences.length;
      for (const diff of differences) {
        expect(Math.abs(diff - avgDiff)).toBeLessThan(avgDiff * 0.5);
      }
    });

    it('should handle edge case lightness values', () => {
      const veryLight: OKLCH = { l: 0.95, c: 0.1, h: 60 };
      const veryDark: OKLCH = { l: 0.05, c: 0.1, h: 60 };

      const lightScale = generateLightnessScale(veryLight);
      const darkScale = generateLightnessScale(veryDark);

      // Should still generate valid scales
      expect(lightScale[50].l).toBeLessThanOrEqual(1);
      expect(lightScale[950].l).toBeGreaterThanOrEqual(0);
      expect(darkScale[50].l).toBeLessThanOrEqual(1);
      expect(darkScale[950].l).toBeGreaterThanOrEqual(0);
    });
  });
});
