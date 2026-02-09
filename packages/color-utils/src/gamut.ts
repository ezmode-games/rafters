/**
 * OKLCH gamut awareness utilities
 *
 * Three-tier gamut model based on real-world display support:
 * - Gold: in both sRGB AND Display P3 (safe on every screen)
 * - Silver: in P3 but NOT sRGB (modern wide-gamut displays only)
 * - Fail: outside both gamuts (not displayable anywhere)
 */

import type { OKLCH } from '@rafters/shared';
import Color from 'colorjs.io';

/**
 * Display support tier for a color.
 * - gold: in sRGB + P3, safe everywhere
 * - silver: in P3 only, clamped on older screens
 * - fail: outside both gamuts
 */
export type GamutTier = 'gold' | 'silver' | 'fail';

/** Gamut boundary data at a single lightness level */
export interface GamutBoundaryPoint {
  /** Lightness value (0-1) */
  l: number;
  /** Maximum chroma within sRGB gamut (gold boundary) */
  maxC_srgb: number;
  /** Maximum chroma within P3 gamut (silver boundary) */
  maxC_p3: number;
}

/**
 * Check whether an OKLCH color is within the sRGB gamut.
 */
export function isInSRGBGamut(oklch: OKLCH): boolean {
  const color = new Color('oklch', [oklch.l, oklch.c, oklch.h]);
  return color.inGamut('srgb');
}

/**
 * Check whether an OKLCH color is within the Display P3 gamut.
 */
export function isInP3Gamut(oklch: OKLCH): boolean {
  const color = new Color('oklch', [oklch.l, oklch.c, oklch.h]);
  return color.inGamut('p3');
}

/**
 * Classify an OKLCH color by its display support tier.
 */
export function getGamutTier(oklch: OKLCH): GamutTier {
  if (isInSRGBGamut(oklch)) return 'gold';
  if (isInP3Gamut(oklch)) return 'silver';
  return 'fail';
}

/**
 * Snap an OKLCH color to the nearest in-gamut color.
 * Tries sRGB first (gold), falls back to P3 (silver).
 * Returns the snapped color and its tier.
 */
export function toNearestGamut(oklch: OKLCH): { color: OKLCH; tier: GamutTier } {
  const color = new Color('oklch', [oklch.l, oklch.c, oklch.h]);

  if (color.inGamut('srgb')) {
    return { color: { ...oklch }, tier: 'gold' };
  }

  // Try sRGB gamut mapping first
  const srgbMapped = color.toGamut({ space: 'srgb' });
  const mappedOklch = srgbMapped.to('oklch');
  return {
    color: {
      l: mappedOklch.coords[0] ?? 0,
      c: mappedOklch.coords[1] ?? 0,
      h: mappedOklch.coords[2] ?? oklch.h,
      alpha: oklch.alpha,
    },
    tier: 'gold',
  };
}

/** Default number of lightness steps for boundary computation */
const DEFAULT_STEPS = 101;

/** Maximum chroma to search (OKLCH practical limit) */
const MAX_CHROMA = 0.4;

/** Binary search tolerance for chroma boundary */
const TOLERANCE = 0.001;

/**
 * Binary search for the maximum chroma at a given lightness and hue
 * that remains within the specified gamut.
 */
function findMaxChroma(l: number, h: number, gamutSpace: string): number {
  let lo = 0;
  let hi = MAX_CHROMA;

  // Edge cases: L=0 (black) and L=1 (white) have zero chroma
  if (l <= 0 || l >= 1) return 0;

  // Quick check: if max chroma is in gamut, return it
  const maxColor = new Color('oklch', [l, hi, h]);
  if (maxColor.inGamut(gamutSpace)) return hi;

  while (hi - lo > TOLERANCE) {
    const mid = (lo + hi) / 2;
    const color = new Color('oklch', [l, mid, h]);
    if (color.inGamut(gamutSpace)) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  return lo;
}

/**
 * Compute both sRGB and P3 gamut boundaries for a given hue.
 * Returns an array of boundary points across lightness levels.
 *
 * The two boundary curves define three zones:
 * - 0 to maxC_srgb: gold (sRGB-safe)
 * - maxC_srgb to maxC_p3: silver (P3-only)
 * - beyond maxC_p3: fail (out of gamut)
 *
 * @param hue - Hue angle in degrees (0-360)
 * @param steps - Number of lightness steps (default 101, for L = 0.00, 0.01, ..., 1.00)
 */
export function computeGamutBoundaries(hue: number, steps = DEFAULT_STEPS): GamutBoundaryPoint[] {
  const boundaries: GamutBoundaryPoint[] = [];

  for (let i = 0; i < steps; i++) {
    const l = i / (steps - 1);
    const maxC_srgb = findMaxChroma(l, hue, 'srgb');
    const maxC_p3 = findMaxChroma(l, hue, 'p3');

    boundaries.push({ l, maxC_srgb, maxC_p3 });
  }

  return boundaries;
}
