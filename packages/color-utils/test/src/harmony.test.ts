/**
 * Tests for harmony functions - Pure OKLCH workflow
 */

import type { OKLCH } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import {
  generateHarmony,
  generateOKLCHScale,
  generateRaftersHarmony,
  generateSemanticColors,
} from '../../src/harmony.js';

describe('Pure OKLCH Harmony Functions', () => {
  const testColor: OKLCH = {
    l: 0.6,
    c: 0.15,
    h: 250, // Blue
    alpha: 1,
  };

  describe('generateHarmony', () => {
    it('should generate traditional color theory harmony with proper OKLCH values', () => {
      const harmony = generateHarmony(testColor);

      // Check all expected traditional harmony properties exist
      expect(harmony).toHaveProperty('base');
      expect(harmony).toHaveProperty('complementary');
      expect(harmony).toHaveProperty('analogous1');
      expect(harmony).toHaveProperty('analogous2');
      expect(harmony).toHaveProperty('triadic1');
      expect(harmony).toHaveProperty('triadic2');
      expect(harmony).toHaveProperty('tetradic1');
      expect(harmony).toHaveProperty('tetradic2');
      expect(harmony).toHaveProperty('tetradic3');
      expect(harmony).toHaveProperty('splitComplementary1');
      expect(harmony).toHaveProperty('splitComplementary2');
      expect(harmony).toHaveProperty('neutral');

      // All colors should be valid OKLCH objects
      for (const color of Object.values(harmony)) {
        if (color) {
          // neutral might be optional
          expect(color).toHaveProperty('l');
          expect(color).toHaveProperty('c');
          expect(color).toHaveProperty('h');
          expect(typeof color.l).toBe('number');
          expect(typeof color.c).toBe('number');
          expect(typeof color.h).toBe('number');
        }
      }

      // All colors should be properly rounded
      for (const color of Object.values(harmony)) {
        if (color) {
          // neutral might be optional
          expect(color.l).toEqual(Math.round(color.l * 100) / 100);
          expect(color.c).toEqual(Math.round(color.c * 100) / 100);
          expect(color.h).toEqual(Math.round(color.h));
        }
      }

      // Test traditional color theory relationships
      expect(harmony.base).toEqual(testColor);
      expect(harmony.complementary.h).toBe((testColor.h + 180) % 360);
      expect(harmony.analogous1.h).toBe((testColor.h + 30) % 360);
      expect(harmony.analogous2.h).toBe((testColor.h - 30 + 360) % 360);
    });
  });

  describe('generateRaftersHarmony', () => {
    it('should generate Rafters semantic harmony mapping from traditional harmonies', () => {
      const raftersHarmony = generateRaftersHarmony(testColor);

      // Check all expected Rafters semantic properties exist
      expect(raftersHarmony).toHaveProperty('primary');
      expect(raftersHarmony).toHaveProperty('secondary');
      expect(raftersHarmony).toHaveProperty('tertiary');
      expect(raftersHarmony).toHaveProperty('accent');
      expect(raftersHarmony).toHaveProperty('highlight');
      expect(raftersHarmony).toHaveProperty('surface');
      expect(raftersHarmony).toHaveProperty('neutral');

      // All colors should be valid OKLCH objects
      for (const color of Object.values(raftersHarmony)) {
        expect(color).toHaveProperty('l');
        expect(color).toHaveProperty('c');
        expect(color).toHaveProperty('h');
        expect(typeof color.l).toBe('number');
        expect(typeof color.c).toBe('number');
        expect(typeof color.h).toBe('number');
      }

      // All colors should be properly rounded
      for (const color of Object.values(raftersHarmony)) {
        expect(color.l).toEqual(Math.round(color.l * 100) / 100);
        expect(color.c).toEqual(Math.round(color.c * 100) / 100);
        expect(color.h).toEqual(Math.round(color.h));
      }

      // Primary should be the base color
      expect(raftersHarmony.primary).toEqual(testColor);
    });
  });

  describe('generateSemanticColors', () => {
    it('should generate intelligent semantic colors with Leonardo theory', () => {
      // Provide semantic suggestions as required by the new API
      const basicSuggestions = {
        danger: [{ l: 0.6, c: 0.2, h: 15, alpha: 1 }],
        success: [{ l: 0.7, c: 0.15, h: 135, alpha: 1 }],
        warning: [{ l: 0.75, c: 0.18, h: 45, alpha: 1 }],
        info: [{ l: 0.65, c: 0.2, h: 220, alpha: 1 }],
      };

      const semanticColors = generateSemanticColors(testColor, basicSuggestions);

      expect(semanticColors).toHaveProperty('danger');
      expect(semanticColors).toHaveProperty('success');
      expect(semanticColors).toHaveProperty('warning');
      expect(semanticColors).toHaveProperty('info');

      // Each semantic type should have colors array
      for (const semanticType of Object.values(semanticColors)) {
        expect(semanticType).toHaveProperty('colors');
        expect(Array.isArray(semanticType.colors)).toBe(true);
        expect(semanticType.colors.length).toBeGreaterThan(0);

        for (const color of semanticType.colors) {
          expect(color).toHaveProperty('l');
          expect(color).toHaveProperty('c');
          expect(color).toHaveProperty('h');
          expect(color).toHaveProperty('alpha');

          // All colors should be properly rounded
          expect(color.l).toEqual(Math.round(color.l * 100) / 100);
          expect(color.c).toEqual(Math.round(color.c * 100) / 100);
          expect(color.h).toEqual(Math.round(color.h));
        }
      }
    });
  });

  describe('generateOKLCHScale', () => {
    it('should generate 50-900 scale in OKLCH format', () => {
      const scale = generateOKLCHScale(testColor);

      const expectedSteps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
      for (const step of expectedSteps) {
        expect(scale).toHaveProperty(step);

        const color = scale[step];
        expect(color).toHaveProperty('l');
        expect(color).toHaveProperty('c');
        expect(color).toHaveProperty('h');
        expect(color).toHaveProperty('alpha');

        // Hue should remain consistent
        expect(color.h).toBe(testColor.h);
        expect(color.alpha).toBe(testColor.alpha);
      }

      // 500 should match the base color lightness
      expect(scale['500'].l).toBe(testColor.l);

      // Lightness should progress logically
      expect(scale['50'].l).toBeGreaterThan(scale['100'].l);
      expect(scale['100'].l).toBeGreaterThan(scale['200'].l);
      expect(scale['800'].l).toBeGreaterThan(scale['900'].l);
    });
  });
});
