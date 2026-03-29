/**
 * OKLCH color conversion functions using colorjs.io
 */

import type { OKLCH } from '@rafters/shared';
import Color from 'colorjs.io';

/**
 * Convert OKLCH color object to hex string
 */
export function oklchToHex(oklch: OKLCH): string {
  const color = new Color('oklch', [oklch.l, oklch.c, oklch.h], oklch.alpha);
  const clamped = color.toGamut({ space: 'srgb' });
  return clamped.toString({ format: 'hex', collapse: false });
}

/**
 * Convert OKLCH to CSS oklch() function string
 */
export function oklchToCSS(oklch: OKLCH): string {
  return `oklch(${oklch.l} ${oklch.c} ${oklch.h})`;
}

/**
 * Convert hex string to OKLCH color object
 */
export function hexToOKLCH(hex: string): OKLCH {
  try {
    const color = new Color(hex);
    const oklch = color.to('oklch');

    return {
      l: oklch.coords[0] ?? 0,
      c: oklch.coords[1] ?? 0,
      // Achromatic colors (grays) get NaN hue from colorjs.io, not undefined
      h: Number.isNaN(oklch.coords[2]) ? 0 : (oklch.coords[2] ?? 0),
      alpha: oklch.alpha ?? 1,
    };
  } catch (_error) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
}

/**
 * Round OKLCH values to standard precision for consistency
 * L and C: 3 decimal places (perceptually meaningful differentiation)
 * H: whole degrees, Alpha: 2 decimal places
 * Prevents floating point precision issues and optimizes cache keys
 */
export function roundOKLCH(oklch: OKLCH): OKLCH {
  return {
    l: Math.round(oklch.l * 1000) / 1000,
    c: Math.round(oklch.c * 1000) / 1000,
    // NaN hue from achromatic colors defaults to 0
    h: Number.isNaN(oklch.h) ? 0 : Math.round(oklch.h),
    alpha: oklch.alpha !== undefined ? Math.round(oklch.alpha * 100) / 100 : 1,
  };
}
