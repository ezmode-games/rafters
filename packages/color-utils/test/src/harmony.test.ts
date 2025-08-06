/**
 * Tests for harmony functions - Pure OKLCH workflow
 */

import { describe, it, expect } from 'vitest';
import type { OKLCH } from '@rafters/shared';
import {
  generateFiveColorHarmony,
  generateSemanticColorSuggestions,
  generateOKLCHScale,
  generateColorCombinations,
  generateSemanticColorSystem,
} from '../../src/harmony.js';

describe('Pure OKLCH Harmony Functions', () => {
  const testColor: OKLCH = {
    l: 0.6,
    c: 0.15,
    h: 250, // Blue
    alpha: 1,
  };

  describe('generateFiveColorHarmony', () => {
    it('should generate five-color harmony in OKLCH format', () => {
      const harmony = generateFiveColorHarmony(testColor);

      expect(harmony).toHaveProperty('primary');
      expect(harmony).toHaveProperty('secondary');
      expect(harmony).toHaveProperty('tertiary');
      expect(harmony).toHaveProperty('accent');
      expect(harmony).toHaveProperty('surface');
      expect(harmony).toHaveProperty('neutral');

      // All colors should be valid OKLCH objects
      Object.values(harmony).forEach(color => {
        expect(color).toHaveProperty('l');
        expect(color).toHaveProperty('c');
        expect(color).toHaveProperty('h');
        expect(color).toHaveProperty('alpha');
        expect(typeof color.l).toBe('number');
        expect(typeof color.c).toBe('number');
        expect(typeof color.h).toBe('number');
        expect(typeof color.alpha).toBe('number');
      });

      // Primary should match input
      expect(harmony.primary).toEqual(testColor);
    });
  });

  describe('generateSemanticColorSuggestions', () => {
    it('should generate semantic colors in OKLCH format', () => {
      const suggestions = generateSemanticColorSuggestions(testColor);

      expect(suggestions).toHaveProperty('danger');
      expect(suggestions).toHaveProperty('success');
      expect(suggestions).toHaveProperty('warning');
      expect(suggestions).toHaveProperty('info');

      // Each semantic type should have array of OKLCH colors
      Object.values(suggestions).forEach(colorArray => {
        expect(Array.isArray(colorArray)).toBe(true);
        expect(colorArray.length).toBeGreaterThan(0);
        
        colorArray.forEach(color => {
          expect(color).toHaveProperty('l');
          expect(color).toHaveProperty('c');
          expect(color).toHaveProperty('h');
          expect(color).toHaveProperty('alpha');
        });
      });
    });
  });

  describe('generateOKLCHScale', () => {
    it('should generate 50-900 scale in OKLCH format', () => {
      const scale = generateOKLCHScale(testColor);

      const expectedSteps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
      expectedSteps.forEach(step => {
        expect(scale).toHaveProperty(step);
        
        const color = scale[step];
        expect(color).toHaveProperty('l');
        expect(color).toHaveProperty('c');
        expect(color).toHaveProperty('h');
        expect(color).toHaveProperty('alpha');
        
        // Hue should remain consistent
        expect(color.h).toBe(testColor.h);
        expect(color.alpha).toBe(testColor.alpha);
      });

      // 500 should match the base color lightness
      expect(scale['500'].l).toBe(testColor.l);

      // Lightness should progress logically
      expect(scale['50'].l).toBeGreaterThan(scale['100'].l);
      expect(scale['100'].l).toBeGreaterThan(scale['200'].l);
      expect(scale['800'].l).toBeGreaterThan(scale['900'].l);
    });
  });

  describe('generateColorCombinations', () => {
    it('should work with OKLCH scale input', () => {
      const scale = generateOKLCHScale(testColor);
      const combinations = generateColorCombinations(scale);

      expect(Array.isArray(combinations)).toBe(true);
      expect(combinations.length).toBeGreaterThan(0);

      combinations.forEach(combo => {
        expect(combo).toHaveProperty('background');
        expect(combo).toHaveProperty('foreground');
        expect(combo).toHaveProperty('contrastRatio');
        expect(combo).toHaveProperty('usage');

        // Background and foreground should be OKLCH objects
        expect(combo.background).toHaveProperty('l');
        expect(combo.background).toHaveProperty('c');
        expect(combo.background).toHaveProperty('h');
        
        expect(combo.foreground).toHaveProperty('l');
        expect(combo.foreground).toHaveProperty('c');
        expect(combo.foreground).toHaveProperty('h');

        expect(typeof combo.contrastRatio).toBe('number');
        expect(['primary', 'secondary', 'subtle']).toContain(combo.usage);
      });
    });
  });

  describe('generateSemanticColorSystem', () => {
    it('should generate complete semantic system in OKLCH', () => {
      const system = generateSemanticColorSystem(testColor);

      expect(system).toHaveProperty('danger');
      expect(system).toHaveProperty('success');
      expect(system).toHaveProperty('warning');
      expect(system).toHaveProperty('info');

      Object.values(system).forEach(semantic => {
        expect(semantic).toHaveProperty('colors');
        expect(semantic).toHaveProperty('scale');
        expect(semantic).toHaveProperty('combinations');

        // Scale should be OKLCH objects
        Object.values(semantic.scale).forEach(color => {
          expect(color).toHaveProperty('l');
          expect(color).toHaveProperty('c');
          expect(color).toHaveProperty('h');
          expect(color).toHaveProperty('alpha');
        });

        // Combinations should reference OKLCH objects
        if (semantic.combinations) {
          semantic.combinations.forEach(combo => {
            expect(combo.background).toHaveProperty('l');
            expect(combo.foreground).toHaveProperty('l');
          });
        }
      });
    });
  });
});