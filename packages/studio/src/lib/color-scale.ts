/**
 * Color Scale Generation
 *
 * Generates 11-position lightness scale from a base OKLCH color.
 * Positions: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
 */

import type { OKLCH } from '../utils/color-conversion';

const SCALE_POSITIONS = [0.97, 0.93, 0.85, 0.75, 0.65, 0.55, 0.45, 0.35, 0.25, 0.18, 0.12];

/**
 * Generate an 11-position lightness scale from a base color.
 * The 500 position uses the base color's lightness; others interpolate.
 */
export function generateColorScale(base: OKLCH): OKLCH[] {
  return SCALE_POSITIONS.map((l, i) => ({
    l: i === 5 ? base.l : l,
    c: base.c,
    h: base.h,
  }));
}
