import { describe, expect, it } from 'vitest';
import { inP3, inSrgb } from '../../src/primitives/oklch-gamut';

describe('oklch-gamut', () => {
  describe.each([
    { name: 'inSrgb', fn: inSrgb },
    { name: 'inP3', fn: inP3 },
  ])('$name', ({ fn }) => {
    it('accepts pure black', () => {
      expect(fn(0, 0, 0)).toBe(true);
    });

    it('accepts pure white', () => {
      expect(fn(1, 0, 0)).toBe(true);
    });

    it('accepts mid-gray', () => {
      expect(fn(0.5, 0, 180)).toBe(true);
    });

    it('rejects extremely high chroma', () => {
      expect(fn(0.5, 0.4, 30)).toBe(false);
    });

    it('is consistent at the 0/360 hue boundary', () => {
      expect(fn(0.7, 0.1, 0)).toBe(fn(0.7, 0.1, 360));
    });
  });

  describe('sRGB-specific', () => {
    it('accepts low chroma color', () => {
      expect(inSrgb(0.7, 0.05, 250)).toBe(true);
    });

    it('rejects high chroma green', () => {
      expect(inSrgb(0.7, 0.25, 150)).toBe(false);
    });
  });

  describe('P3-specific', () => {
    it('accepts high chroma green that exceeds sRGB', () => {
      expect(inP3(0.7, 0.25, 150)).toBe(true);
    });
  });

  describe('gamut relationship', () => {
    it('sRGB is a subset of P3 -- if inSrgb then inP3', () => {
      const samples = [
        [0.5, 0.1, 90],
        [0.7, 0.05, 250],
        [0.3, 0.08, 30],
        [0.9, 0.02, 180],
      ] as const;

      for (const [l, c, h] of samples) {
        if (inSrgb(l, c, h)) {
          expect(inP3(l, c, h)).toBe(true);
        }
      }
    });
  });
});
