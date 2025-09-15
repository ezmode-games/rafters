/**
 * OKLCH color conversion functions using colorjs.io
 */

import type { OKLCH } from '@rafters/shared';
import Color from 'colorjs.io';

/**
 * Convert OKLCH color object to hex string
 */
export function oklchToHex(oklch: OKLCH): string {
  const color = new Color('oklch', [oklch.l, oklch.c, oklch.h]);
  return color.to('srgb').toString({ format: 'hex', collapse: false });
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
      l: oklch.coords[0] || 0,
      c: oklch.coords[1] || 0,
      h: oklch.coords[2] || 0, // Handle undefined hue for achromatic colors
      alpha: oklch.alpha || 1,
    };
  } catch (_error) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
}

/**
 * Round OKLCH values to standard precision for consistency
 * L and C: 2 decimal places, H: whole degrees, Alpha: 2 decimal places
 * Prevents floating point precision issues and optimizes cache keys
 */
export function roundOKLCH(oklch: OKLCH): OKLCH {
  return {
    l: Math.round(oklch.l * 100) / 100, // 2 decimal places for lightness
    c: Math.round(oklch.c * 100) / 100, // 2 decimal places for chroma
    h: Math.round(oklch.h), // Whole degrees for hue
    alpha: oklch.alpha ? Math.round(oklch.alpha * 100) / 100 : undefined, // 2 decimal places for alpha
  };
}
