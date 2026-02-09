/**
 * Tests for OKLCH gamut awareness utilities
 */

import type { OKLCH } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import {
  computeGamutBoundaries,
  getGamutTier,
  isInP3Gamut,
  isInSRGBGamut,
  toNearestGamut,
} from '../src/gamut.js';

// Tolerance constant used in boundary computation
const TOLERANCE = 0.001;

// Reference colors
const midGray: OKLCH = { l: 0.5, c: 0, h: 0, alpha: 1 };
const srgbBlue: OKLCH = { l: 0.5, c: 0.1, h: 260, alpha: 1 };
// P3-only: chroma beyond sRGB but within P3 (green hue has wide P3 extension)
const p3Green: OKLCH = { l: 0.7, c: 0.25, h: 150, alpha: 1 };
const extremeColor: OKLCH = { l: 0.5, c: 0.4, h: 150, alpha: 1 };
const black: OKLCH = { l: 0, c: 0, h: 0, alpha: 1 };
const white: OKLCH = { l: 1, c: 0, h: 0, alpha: 1 };

describe('isInSRGBGamut', () => {
  it('returns true for achromatic colors', () => {
    expect(isInSRGBGamut(midGray)).toBe(true);
    expect(isInSRGBGamut(black)).toBe(true);
    expect(isInSRGBGamut(white)).toBe(true);
  });

  it('returns true for a known sRGB color', () => {
    expect(isInSRGBGamut(srgbBlue)).toBe(true);
  });

  it('returns false for a P3-only color', () => {
    expect(isInSRGBGamut(p3Green)).toBe(false);
  });
});

describe('isInP3Gamut', () => {
  it('returns true for sRGB colors (P3 is a superset)', () => {
    expect(isInP3Gamut(midGray)).toBe(true);
    expect(isInP3Gamut(srgbBlue)).toBe(true);
  });

  it('returns true for P3-only colors', () => {
    expect(isInP3Gamut(p3Green)).toBe(true);
  });

  it('returns false for extreme chroma values', () => {
    expect(isInP3Gamut(extremeColor)).toBe(false);
  });
});

describe('getGamutTier', () => {
  it('classifies sRGB colors as gold', () => {
    expect(getGamutTier(midGray)).toBe('gold');
    expect(getGamutTier(srgbBlue)).toBe('gold');
  });

  it('classifies P3-only colors as silver', () => {
    expect(getGamutTier(p3Green)).toBe('silver');
  });

  it('classifies out-of-gamut colors as fail', () => {
    expect(getGamutTier(extremeColor)).toBe('fail');
  });
});

describe('toNearestGamut', () => {
  it('returns the same color for in-gamut sRGB colors', () => {
    const result = toNearestGamut(srgbBlue);
    expect(result.tier).toBe('gold');
    expect(result.color.l).toBe(srgbBlue.l);
    expect(result.color.c).toBe(srgbBlue.c);
    expect(result.color.h).toBe(srgbBlue.h);
  });

  it('snaps out-of-gamut colors to gold tier', () => {
    const result = toNearestGamut(p3Green);
    expect(result.tier).toBe('gold');
    expect(isInSRGBGamut(result.color)).toBe(true);
  });

  it('preserves hue approximately when snapping', () => {
    const result = toNearestGamut(p3Green);
    // Gamut mapping may shift hue slightly; allow 10 degrees tolerance
    const hueDiff = Math.abs(result.color.h - p3Green.h);
    expect(hueDiff).toBeLessThan(10);
  });

  it('reduces chroma minimally', () => {
    const result = toNearestGamut(p3Green);
    // Snapped chroma should be less than original but still substantial
    expect(result.color.c).toBeLessThan(p3Green.c);
    expect(result.color.c).toBeGreaterThan(0);
  });

  it('preserves alpha', () => {
    const withAlpha: OKLCH = { ...p3Green, alpha: 0.5 };
    const result = toNearestGamut(withAlpha);
    expect(result.color.alpha).toBe(0.5);
  });
});

describe('computeGamutBoundaries', () => {
  it('returns the requested number of steps', () => {
    const boundaries = computeGamutBoundaries(260, 21);
    expect(boundaries).toHaveLength(21);
  });

  it('covers lightness range from 0 to 1', () => {
    const boundaries = computeGamutBoundaries(260, 11);
    expect(boundaries[0].l).toBeCloseTo(0, 5);
    expect(boundaries[boundaries.length - 1].l).toBeCloseTo(1, 5);
  });

  it('has zero chroma at L=0 and L=1', () => {
    const boundaries = computeGamutBoundaries(260, 11);
    expect(boundaries[0].maxC_srgb).toBe(0);
    expect(boundaries[0].maxC_p3).toBe(0);
    expect(boundaries[boundaries.length - 1].maxC_srgb).toBe(0);
    expect(boundaries[boundaries.length - 1].maxC_p3).toBe(0);
  });

  it('P3 boundary is always >= sRGB boundary', () => {
    const boundaries = computeGamutBoundaries(260, 21);
    for (const point of boundaries) {
      expect(point.maxC_p3).toBeGreaterThanOrEqual(point.maxC_srgb - TOLERANCE);
    }
  });

  it('boundaries narrow at lightness extremes', () => {
    const boundaries = computeGamutBoundaries(260, 101);
    // Mid-range should have higher chroma than near-black or near-white
    const mid = boundaries[50];
    const nearBlack = boundaries[5];
    const nearWhite = boundaries[95];

    expect(mid.maxC_srgb).toBeGreaterThan(nearBlack.maxC_srgb);
    expect(mid.maxC_srgb).toBeGreaterThan(nearWhite.maxC_srgb);
  });

  it('blue hue has higher max chroma than yellow', () => {
    const blueBounds = computeGamutBoundaries(260, 21);
    const yellowBounds = computeGamutBoundaries(90, 21);

    // Find peak sRGB chroma for each hue
    const blueMax = Math.max(...blueBounds.map((b) => b.maxC_srgb));
    const yellowMax = Math.max(...yellowBounds.map((b) => b.maxC_srgb));

    expect(blueMax).toBeGreaterThan(yellowMax);
  });

  it('produces a smooth curve (no sudden jumps)', () => {
    const boundaries = computeGamutBoundaries(260, 101);
    for (let i = 1; i < boundaries.length; i++) {
      const diff = Math.abs(boundaries[i].maxC_srgb - boundaries[i - 1].maxC_srgb);
      // Adjacent lightness steps should not differ by more than 0.05 chroma
      expect(diff).toBeLessThan(0.05);
    }
  });
});
