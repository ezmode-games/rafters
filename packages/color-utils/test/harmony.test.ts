/**
 * Harmony Module Tests
 *
 * Tests color harmony generation, scale generation,
 * and color theory calculations.
 */

import type { OKLCH } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import {
  calculateAtmosphericWeight,
  calculatePerceptualWeight,
  generateHarmony,
  generateOKLCHScale,
  generateSemanticColorSuggestions,
} from '../src/harmony';

describe('Harmony Module', () => {
  const baseColor: OKLCH = { l: 0.6, c: 0.15, h: 240 };

  describe('generateHarmony', () => {
    it('should generate mathematically correct color harmonies', () => {
      const harmony = generateHarmony(baseColor);

      // Verify complementary is exactly 180° opposite
      expect(harmony.complementary.h).toBe((baseColor.h + 180) % 360);

      // Verify triadic colors form 120° triangle
      expect(harmony.triadic1.h).toBe((baseColor.h + 120) % 360);
      expect(harmony.triadic2.h).toBe((baseColor.h + 240) % 360);

      // Verify analogous colors are ±30°
      expect(harmony.analogous1.h).toBe((baseColor.h + 30) % 360);
      expect(harmony.analogous2.h).toBe((baseColor.h - 30 + 360) % 360);

      // Verify tetradic colors form 90° square
      expect(harmony.tetradic1.h).toBe((baseColor.h + 90) % 360);
      expect(harmony.tetradic3.h).toBe((baseColor.h + 270) % 360);

      // Verify split complementary at ±30° from complement
      expect(harmony.splitComplementary1.h).toBe((baseColor.h + 150) % 360);
      expect(harmony.splitComplementary2.h).toBe((baseColor.h + 210) % 360);
    });

    it('should adjust lightness for complementary contrast', () => {
      const harmony = generateHarmony(baseColor);

      // Complementary should have inverted lightness for contrast
      // If base is > 0.5, complementary should be darker
      expect(harmony.complementary.l).toBe(baseColor.l > 0.5 ? 0.3 : 0.7);

      // Complementary should boost chroma slightly
      expect(harmony.complementary.c).toBe(Math.min(0.3, baseColor.c * 1.2));
    });

    it('should reduce chroma for analogous harmony', () => {
      const harmony = generateHarmony(baseColor);

      // Analogous colors should have reduced chroma for subtlety (rounded)
      expect(harmony.analogous1.c).toBeCloseTo(baseColor.c * 0.9, 1);
      expect(harmony.analogous2.c).toBeCloseTo(baseColor.c * 0.9, 1);

      // Slight lightness shift for depth
      expect(harmony.analogous1.l).toBeCloseTo(Math.max(0.2, Math.min(0.8, baseColor.l + 0.05)), 2);
      expect(harmony.analogous2.l).toBeCloseTo(Math.max(0.2, Math.min(0.8, baseColor.l - 0.05)), 2);
    });

    it('should generate optimal neutral gray from palette', () => {
      const harmony = generateHarmony(baseColor);

      expect(harmony.neutral).toBeDefined();
      // Neutral should have very low chroma
      expect(harmony.neutral?.c).toBeLessThanOrEqual(0.02);
      // Neutral should be mid-lightness
      expect(harmony.neutral?.l).toBe(0.5);
      // Neutral hue should be influenced by palette average
      expect(harmony.neutral?.h).toBeGreaterThanOrEqual(0);
      expect(harmony.neutral?.h).toBeLessThan(360);
    });

    it('should handle edge case hues near 0/360 boundary', () => {
      const redBase: OKLCH = { l: 0.5, c: 0.2, h: 10 };
      const harmony = generateHarmony(redBase);

      // Analogous2 should wrap around correctly
      expect(harmony.analogous2.h).toBe((10 - 30 + 360) % 360); // 340
      expect(harmony.complementary.h).toBe((10 + 180) % 360); // 190
    });
  });

  describe('generateOKLCHScale', () => {
    it('should generate perceptually uniform lightness progression', () => {
      const scale = generateOKLCHScale(baseColor);

      // Light tints should progress from near-white to medium-light
      expect(scale['50'].l).toBeCloseTo(0.98, 2);
      expect(scale['100'].l).toBeCloseTo(0.95, 2);
      expect(scale['200'].l).toBeCloseTo(0.9, 2);
      expect(scale['300'].l).toBeCloseTo(0.8, 2);
      expect(scale['400'].l).toBeCloseTo(0.7, 2);

      // Base color at 500
      expect(scale['500'].l).toBeCloseTo(baseColor.l, 2);

      // Dark shades should progress from medium-dark to near-black
      expect(scale['600'].l).toBeCloseTo(0.4, 2);
      expect(scale['700'].l).toBeCloseTo(0.25, 2);
      expect(scale['800'].l).toBeCloseTo(0.15, 2);
      expect(scale['900'].l).toBeCloseTo(0.08, 2);
      expect(scale['950'].l).toBeCloseTo(0.04, 2);
    });

    it('should adjust chroma based on lightness for perceptual uniformity', () => {
      const scale = generateOKLCHScale(baseColor);

      // Ultra-light tints should have very low chroma
      expect(scale['50'].c).toBeLessThanOrEqual(baseColor.c * 0.15);
      expect(scale['100'].c).toBeLessThanOrEqual(baseColor.c * 0.15);

      // Light tints should have reduced chroma
      expect(scale['200'].c).toBeCloseTo(baseColor.c * 0.25, 2);

      // Medium-light should have moderate chroma
      expect(scale['300'].c).toBeCloseTo(baseColor.c * 0.7, 1);
      expect(scale['400'].c).toBeCloseTo(baseColor.c * 0.7, 1);

      // 500-600 should maintain original chroma
      expect(scale['500'].c).toBeCloseTo(baseColor.c, 2);
      expect(scale['600'].c).toBeCloseTo(baseColor.c, 2);

      // Dark shades should have slightly reduced chroma
      expect(scale['700'].c).toBeCloseTo(baseColor.c * 0.9, 1);
      expect(scale['800'].c).toBeCloseTo(baseColor.c * 0.8, 1);
    });

    it('should maintain consistent hue across scale', () => {
      const scale = generateOKLCHScale(baseColor);

      Object.values(scale).forEach((color) => {
        expect(color.h).toBe(baseColor.h);
      });
    });

    it('should handle edge colors gracefully', () => {
      const tooLight: OKLCH = { l: 0.95, c: 0.1, h: 120 };
      const tooDark: OKLCH = { l: 0.05, c: 0.1, h: 120 };

      const lightScale = generateOKLCHScale(tooLight);
      const darkScale = generateOKLCHScale(tooDark);

      // Should recursively adjust to suggested lightness
      expect(Object.keys(lightScale)).toHaveLength(11);
      expect(Object.keys(darkScale)).toHaveLength(11);
    });
  });

  describe('calculateAtmosphericWeight', () => {
    it('should apply atmospheric perspective theory correctly', () => {
      // Warm, dark, high-chroma color should be foreground
      const warmForeground: OKLCH = { l: 0.3, c: 0.25, h: 30 }; // Red-orange
      const warmWeight = calculateAtmosphericWeight(warmForeground);

      expect(warmWeight.temperature).toBe('warm');
      expect(warmWeight.distanceWeight).toBeGreaterThan(0.7);
      expect(warmWeight.atmosphericRole).toBe('foreground');

      // Cool, light, low-chroma color should be background
      const coolBackground: OKLCH = { l: 0.8, c: 0.05, h: 220 }; // Light blue
      const coolWeight = calculateAtmosphericWeight(coolBackground);

      expect(coolWeight.temperature).toBe('cool');
      expect(coolWeight.distanceWeight).toBeLessThan(0.3);
      expect(coolWeight.atmosphericRole).toBe('background');

      // Neutral color should be midground
      const neutral: OKLCH = { l: 0.5, c: 0.1, h: 90 }; // Yellow-green
      const neutralWeight = calculateAtmosphericWeight(neutral);

      expect(neutralWeight.temperature).toBe('neutral');
      expect(neutralWeight.distanceWeight).toBeGreaterThan(0.3);
      expect(neutralWeight.distanceWeight).toBeLessThan(0.7);
      expect(neutralWeight.atmosphericRole).toBe('midground');
    });

    it('should calculate distance weight based on Leonardo principles', () => {
      // Higher chroma = closer (advances)
      const highChroma: OKLCH = { l: 0.5, c: 0.3, h: 180 };
      const lowChroma: OKLCH = { l: 0.5, c: 0.05, h: 180 };

      const highChromaWeight = calculateAtmosphericWeight(highChroma);
      const lowChromaWeight = calculateAtmosphericWeight(lowChroma);

      expect(highChromaWeight.distanceWeight).toBeGreaterThan(lowChromaWeight.distanceWeight);

      // Darker = closer (advances)
      const dark: OKLCH = { l: 0.2, c: 0.15, h: 180 };
      const light: OKLCH = { l: 0.8, c: 0.15, h: 180 };

      const darkWeight = calculateAtmosphericWeight(dark);
      const lightWeight = calculateAtmosphericWeight(light);

      expect(darkWeight.distanceWeight).toBeGreaterThan(lightWeight.distanceWeight);
    });

    it('should correctly classify temperature ranges', () => {
      // Warm hues: 0-60° and 300-360°
      const red: OKLCH = { l: 0.5, c: 0.2, h: 15 };
      const orange: OKLCH = { l: 0.5, c: 0.2, h: 45 };
      const magenta: OKLCH = { l: 0.5, c: 0.2, h: 330 };

      expect(calculateAtmosphericWeight(red).temperature).toBe('warm');
      expect(calculateAtmosphericWeight(orange).temperature).toBe('warm');
      expect(calculateAtmosphericWeight(magenta).temperature).toBe('warm');

      // Cool hues: 180-270°
      const cyan: OKLCH = { l: 0.5, c: 0.2, h: 190 };
      const blue: OKLCH = { l: 0.5, c: 0.2, h: 240 };

      expect(calculateAtmosphericWeight(cyan).temperature).toBe('cool');
      expect(calculateAtmosphericWeight(blue).temperature).toBe('cool');

      // Neutral hues: everything else
      const green: OKLCH = { l: 0.5, c: 0.2, h: 120 };
      const purple: OKLCH = { l: 0.5, c: 0.2, h: 280 };

      expect(calculateAtmosphericWeight(green).temperature).toBe('neutral');
      expect(calculateAtmosphericWeight(purple).temperature).toBe('neutral');
    });
  });

  describe('calculatePerceptualWeight', () => {
    it('should apply perceptual weight theory correctly', () => {
      // Red should be heaviest
      const red: OKLCH = { l: 0.3, c: 0.2, h: 10 };
      const redWeight = calculatePerceptualWeight(red);

      expect(redWeight.weight).toBeGreaterThan(0.6);
      expect(redWeight.density).toBe('heavy');

      // Green should be lightest
      const green: OKLCH = { l: 0.7, c: 0.1, h: 135 };
      const greenWeight = calculatePerceptualWeight(green);

      expect(greenWeight.weight).toBeLessThan(0.5);
      expect(['light', 'medium']).toContain(greenWeight.density);

      // Dark, saturated colors should feel heavy
      const darkSaturated: OKLCH = { l: 0.2, c: 0.25, h: 270 };
      const darkWeight = calculatePerceptualWeight(darkSaturated);

      expect(darkWeight.weight).toBeGreaterThan(0.5);
      expect(['medium', 'heavy']).toContain(darkWeight.density);
    });

    it('should calculate weight based on multiple factors', () => {
      // Factor 1: Lower lightness = heavier
      const dark: OKLCH = { l: 0.2, c: 0.15, h: 180 };
      const light: OKLCH = { l: 0.8, c: 0.15, h: 180 };

      expect(calculatePerceptualWeight(dark).weight).toBeGreaterThan(
        calculatePerceptualWeight(light).weight
      );

      // Factor 2: Higher chroma = heavier
      const saturated: OKLCH = { l: 0.5, c: 0.3, h: 180 };
      const desaturated: OKLCH = { l: 0.5, c: 0.05, h: 180 };

      expect(calculatePerceptualWeight(saturated).weight).toBeGreaterThan(
        calculatePerceptualWeight(desaturated).weight
      );

      // Factor 3: Hue weight hierarchy
      const hueWeights = [
        { h: 10, weight: 0.9 }, // Red - heaviest
        { h: 30, weight: 0.8 }, // Red-Orange
        { h: 60, weight: 0.6 }, // Orange-Yellow
        { h: 90, weight: 0.4 }, // Yellow-Green
        { h: 135, weight: 0.3 }, // Green - lightest
        { h: 210, weight: 0.2 }, // Blue - very light
        { h: 270, weight: 0.35 }, // Blue-Purple
        { h: 330, weight: 0.5 }, // Purple-Red
      ];

      hueWeights.forEach((expected, i) => {
        if (i > 0) {
          const prev = hueWeights[i - 1];
          if (expected.weight < prev.weight) {
            const color1: OKLCH = { l: 0.5, c: 0.15, h: prev.h };
            const color2: OKLCH = { l: 0.5, c: 0.15, h: expected.h };

            // With same L and C, hue ordering should influence weight
            const weight1 = calculatePerceptualWeight(color1);
            const weight2 = calculatePerceptualWeight(color2);

            // The hue contribution should follow the expected pattern
            if (prev.h <= 15 || prev.h >= 345) {
              // Red range should contribute more weight
              expect(weight1.weight).toBeGreaterThan(weight2.weight - 0.1);
            }
          }
        }
      });
    });
  });

  describe('generateSemanticColorSuggestions', () => {
    it('should generate semantically appropriate colors', () => {
      const suggestions = generateSemanticColorSuggestions(baseColor);

      // Danger colors should be in red range (0-30° or 330-360°)
      suggestions.danger.forEach((color) => {
        expect(color.h).toBeLessThanOrEqual(30);
        // Colors should be vibrant enough to convey danger
        expect(color.l).toBeGreaterThanOrEqual(0.5);
        expect(color.l).toBeLessThanOrEqual(0.75);
        expect(color.c).toBeGreaterThanOrEqual(baseColor.c);
      });

      // Success colors should be in green range (120-150°)
      suggestions.success.forEach((color) => {
        expect(color.h).toBeGreaterThanOrEqual(120);
        expect(color.h).toBeLessThanOrEqual(150);
        // Success should be optimistic/bright
        expect(color.l).toBeGreaterThanOrEqual(0.55);
        expect(color.l).toBeLessThanOrEqual(0.8);
      });

      // Warning colors should be in orange/yellow range (30-70°)
      suggestions.warning.forEach((color) => {
        expect(color.h).toBeGreaterThanOrEqual(30);
        expect(color.h).toBeLessThanOrEqual(70);
        // Warning should be bright/attention-grabbing
        expect(color.l).toBeGreaterThanOrEqual(0.7);
        expect(color.l).toBeLessThanOrEqual(0.85);
      });

      // Info colors should be in blue range (200-240°)
      suggestions.info.forEach((color) => {
        expect(color.h).toBeGreaterThanOrEqual(200);
        expect(color.h).toBeLessThanOrEqual(240);
        // Info should be calm but visible
        expect(color.l).toBeGreaterThanOrEqual(0.5);
        expect(color.l).toBeLessThanOrEqual(0.75);
      });
    });

    it('should provide multiple variations for each semantic type', () => {
      const suggestions = generateSemanticColorSuggestions(baseColor);

      // Should provide 3 variations of each semantic color
      expect(suggestions.danger).toHaveLength(3);
      expect(suggestions.success).toHaveLength(3);
      expect(suggestions.warning).toHaveLength(3);
      expect(suggestions.info).toHaveLength(3);

      // Each variation should be slightly different
      const dangerHues = suggestions.danger.map((c) => c.h);
      expect(new Set(dangerHues).size).toBeGreaterThan(1);

      const successHues = suggestions.success.map((c) => c.h);
      expect(new Set(successHues).size).toBeGreaterThan(1);
    });

    it('should adjust semantic colors based on base color properties', () => {
      const darkBase: OKLCH = { l: 0.3, c: 0.1, h: 180 };
      const lightBase: OKLCH = { l: 0.8, c: 0.1, h: 180 };

      const darkSuggestions = generateSemanticColorSuggestions(darkBase);
      const lightSuggestions = generateSemanticColorSuggestions(lightBase);

      // Semantic colors should be adjusted relative to base
      // When base is dark, semantic colors should be lighter
      const avgDarkDangerL = darkSuggestions.danger.reduce((sum, c) => sum + c.l, 0) / 3;
      const avgLightDangerL = lightSuggestions.danger.reduce((sum, c) => sum + c.l, 0) / 3;

      // Both should be in appropriate range for danger
      expect(avgDarkDangerL).toBeGreaterThan(darkBase.l);
      expect(avgLightDangerL).toBeLessThan(lightBase.l);
    });

    it('should maintain appropriate chroma relationships', () => {
      const highChromaBase: OKLCH = { l: 0.5, c: 0.25, h: 180 };
      const lowChromaBase: OKLCH = { l: 0.5, c: 0.05, h: 180 };

      const highSuggestions = generateSemanticColorSuggestions(highChromaBase);
      const lowSuggestions = generateSemanticColorSuggestions(lowChromaBase);

      // Semantic colors should scale with base chroma
      const avgHighDangerC = highSuggestions.danger.reduce((sum, c) => sum + c.c, 0) / 3;
      const avgLowDangerC = lowSuggestions.danger.reduce((sum, c) => sum + c.c, 0) / 3;

      expect(avgHighDangerC).toBeGreaterThan(avgLowDangerC);

      // But should remain within reasonable bounds
      highSuggestions.danger.forEach((color) => {
        expect(color.c).toBeLessThanOrEqual(0.3); // Max reasonable chroma
      });
    });
  });
});
