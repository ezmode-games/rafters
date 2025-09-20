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
    it('should generate color harmonies', () => {
      const harmony = generateHarmony(baseColor);

      expect(harmony).toHaveProperty('complementary');
      expect(harmony).toHaveProperty('triadic1');
      expect(harmony).toHaveProperty('triadic2');
      expect(harmony).toHaveProperty('analogous1');
      expect(harmony).toHaveProperty('analogous2');
    });

    it('should generate valid OKLCH colors', () => {
      const harmony = generateHarmony(baseColor);

      Object.values(harmony).forEach((color) => {
        expect(color.l).toBeGreaterThanOrEqual(0);
        expect(color.l).toBeLessThanOrEqual(1);
        expect(color.c).toBeGreaterThanOrEqual(0);
        expect(color.h).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('generateOKLCHScale', () => {
    it('should generate 11-step scale', () => {
      const scale = generateOKLCHScale(baseColor);

      expect(Object.keys(scale)).toHaveLength(11);
      expect(scale['50']).toBeDefined();
      expect(scale['950']).toBeDefined();
    });

    it('should have base color at 600', () => {
      const scale = generateOKLCHScale(baseColor);

      expect(scale['600']).toBeDefined();
      expect(scale['600'].h).toBeCloseTo(baseColor.h, 1);
    });
  });

  describe('calculateAtmosphericWeight', () => {
    it('should return numeric weight', () => {
      const weight = calculateAtmosphericWeight(baseColor);

      expect(typeof weight).toBe('number');
      expect(weight).toBeGreaterThanOrEqual(0);
    });
  });

  describe('calculatePerceptualWeight', () => {
    it('should return numeric weight', () => {
      const weight = calculatePerceptualWeight(baseColor);

      expect(typeof weight).toBe('number');
      expect(weight).toBeGreaterThanOrEqual(0);
    });
  });

  describe('generateSemanticColorSuggestions', () => {
    it('should return array of suggestions', () => {
      const suggestions = generateSemanticColorSuggestions(baseColor);

      expect(Array.isArray(suggestions)).toBe(true);
    });
  });
});
