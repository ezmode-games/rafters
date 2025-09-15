/**
 * OKLCH color manipulation functions
 */

import type { OKLCH } from '@rafters/shared';

/**
 * Lighten a color by increasing its lightness
 */
export function lighten(color: OKLCH, amount: number): OKLCH {
  return {
    ...color,
    l: Math.max(0, Math.min(1, color.l + amount)),
  };
}

/**
 * Darken a color by decreasing its lightness
 */
export function darken(color: OKLCH, amount: number): OKLCH {
  return {
    ...color,
    l: Math.max(0, Math.min(1, color.l - amount)),
  };
}

/**
 * Adjust the chroma (saturation) of a color
 */
export function adjustChroma(color: OKLCH, amount: number): OKLCH {
  return {
    ...color,
    c: Math.max(0, color.c + amount),
  };
}

/**
 * Adjust the hue of a color by degrees
 */
export function adjustHue(color: OKLCH, degrees: number): OKLCH {
  let newHue = color.h + degrees;

  // Normalize hue to 0-360 range
  while (newHue < 0) newHue += 360;
  while (newHue >= 360) newHue -= 360;

  return {
    ...color,
    h: newHue,
  };
}

/**
 * Generate surface color from base color
 */
export function generateSurfaceColor(baseColor: OKLCH): OKLCH {
  const surface: OKLCH = {
    ...baseColor,
    h: (baseColor.h + 15) % 360, // Slight hue shift
    l: 0.85, // More usable lightness than 0.95
    c: Math.max(0.02, baseColor.c * 0.15), // Very low chroma for surfaces
  };

  return surface;
}
