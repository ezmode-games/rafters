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
  } catch (error) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
}
