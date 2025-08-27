/**
 * OKLCH color validation functions using colorjs.io
 */

import type { OKLCH } from '@rafters/shared';
import Color from 'colorjs.io';

/**
 * Validate an OKLCH color object has correct ranges
 */
export function isValidOKLCH(color: OKLCH): boolean {
  // Lightness: 0-1
  if (color.l < 0 || color.l > 1) return false;

  // Chroma: 0+ (theoretically unbounded but practically 0-0.4)
  if (color.c < 0) return false;

  // Hue: any number (wraps around 360)
  if (!Number.isFinite(color.h)) return false;

  return true;
}

/**
 * Parse any color string to OKLCH using colorjs.io
 */
export function parseColorToOKLCH(colorString: string): OKLCH {
  try {
    const color = new Color(colorString);
    const oklch = color.to('oklch');

    return {
      l: oklch.l,
      c: oklch.c,
      h: oklch.h || 0, // Handle undefined hue for achromatic colors
    };
  } catch (_error) {
    throw new Error(`Invalid color string: ${colorString}`);
  }
}
