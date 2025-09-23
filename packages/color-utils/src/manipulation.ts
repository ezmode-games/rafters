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

/**
 * Generate neutral color from base color
 * More desaturated than surface colors, used for neutral grays and backgrounds
 */
export function generateNeutralColor(baseColor: OKLCH): OKLCH {
  const neutral: OKLCH = {
    ...baseColor,
    c: Math.max(0.005, baseColor.c * 0.1), // Much more desaturated for neutral
  };

  return neutral;
}

/**
 * Adjust lightness by a specific amount (alias for compatibility)
 */
export function adjustLightness(color: OKLCH, amount: number): OKLCH {
  return {
    ...color,
    l: Math.max(0, Math.min(1, color.l + amount)),
  };
}

/**
 * Blend two colors by interpolating their OKLCH values
 */
export function blendColors(color1: OKLCH, color2: OKLCH, ratio: number): OKLCH {
  // Clamp ratio between 0 and 1
  const r = Math.max(0, Math.min(1, ratio));

  // Linear interpolation in OKLCH space
  return {
    l: color1.l + (color2.l - color1.l) * r,
    c: color1.c + (color2.c - color1.c) * r,
    h: color1.h + (color2.h - color1.h) * r,
    alpha:
      color1.alpha !== undefined && color2.alpha !== undefined
        ? color1.alpha + (color2.alpha - color1.alpha) * r
        : color1.alpha || color2.alpha,
  };
}
