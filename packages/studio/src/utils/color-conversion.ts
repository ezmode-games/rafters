/**
 * Color conversion utilities using colorjs.io
 *
 * Standalone implementation for Studio to avoid Vite/TypeScript workspace issues.
 * Mirrors functionality from @rafters/color-utils.
 */

import Color from 'colorjs.io';

export interface OKLCH {
  l: number;
  c: number;
  h: number;
  alpha?: number;
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
      h: oklch.coords[2] ?? 0,
      alpha: oklch.alpha ?? 1,
    };
  } catch {
    throw new Error(`Invalid hex color: ${hex}`);
  }
}

/**
 * Convert OKLCH color object to hex string
 */
export function oklchToHex(oklch: OKLCH): string {
  const color = new Color('oklch', [oklch.l, oklch.c, oklch.h], oklch.alpha);
  const srgb = color.to('srgb');
  return srgb.toString({ format: 'hex', collapse: false });
}

/**
 * Convert OKLCH to CSS oklch() function string
 */
export function oklchToCSS(oklch: OKLCH): string {
  const alpha = oklch.alpha !== undefined && oklch.alpha < 1 ? ` / ${oklch.alpha}` : '';
  return `oklch(${oklch.l.toFixed(3)} ${oklch.c.toFixed(3)} ${oklch.h.toFixed(0)}${alpha})`;
}

/**
 * Check if an OKLCH color is within sRGB gamut
 */
export function isInGamut(oklch: OKLCH): boolean {
  const color = new Color('oklch', [oklch.l, oklch.c, oklch.h], oklch.alpha);
  return color.inGamut('srgb');
}

/**
 * Get a gamut-mapped version of an OKLCH color
 */
export function toGamut(oklch: OKLCH): OKLCH {
  const color = new Color('oklch', [oklch.l, oklch.c, oklch.h], oklch.alpha);
  const mapped = color.toGamut('srgb');
  const result = mapped.to('oklch');

  return {
    l: result.coords[0] ?? 0,
    c: result.coords[1] ?? 0,
    h: result.coords[2] ?? 0,
    alpha: result.alpha ?? 1,
  };
}

/**
 * Round OKLCH values for display
 */
export function roundOKLCH(oklch: OKLCH): OKLCH {
  return {
    l: Math.round(oklch.l * 1000) / 1000,
    c: Math.round(oklch.c * 1000) / 1000,
    h: Math.round(oklch.h),
    alpha: oklch.alpha !== undefined ? Math.round(oklch.alpha * 100) / 100 : 1,
  };
}
