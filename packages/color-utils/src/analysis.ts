/**
 * Color analysis functions for perceptual color properties
 */

import type { OKLCH } from '@rafters/shared';

/**
 * Calculate perceptual distance between two colors using Delta E in OKLCH space
 * This is a simplified version - real Delta E calculations are more complex
 */
export function calculateColorDistance(color1: OKLCH, color2: OKLCH): number {
  // Convert to Cartesian coordinates for chroma and hue
  const a1 = color1.c * Math.cos((color1.h * Math.PI) / 180);
  const b1 = color1.c * Math.sin((color1.h * Math.PI) / 180);

  const a2 = color2.c * Math.cos((color2.h * Math.PI) / 180);
  const b2 = color2.c * Math.sin((color2.h * Math.PI) / 180);

  // Calculate differences in each dimension
  const deltaL = color1.l - color2.l;
  const deltaA = a1 - a2;
  const deltaB = b1 - b2;

  // Simple Euclidean distance in LAB-like space
  // Scale lightness difference as it's perceptually more significant
  const distance = Math.sqrt(
    (deltaL * 100) ** 2 + // Scale lightness to 0-100 range
      (deltaA * 200) ** 2 + // Scale chroma components
      (deltaB * 200) ** 2,
  );

  return distance;
}

/**
 * Determine if color is light or dark based on perceptual lightness
 * Uses OKLCH lightness with adjustments for chroma
 */
export function isLightColor(color: OKLCH): boolean {
  // Base threshold at 50% lightness
  let threshold = 0.5;

  // Adjust threshold based on chroma
  // High chroma colors appear darker due to the Helmholtz-Kohlrausch effect
  if (color.c > 0.15) {
    threshold += color.c * 0.3; // Increase threshold for high chroma
  }

  // Very low chroma colors are essentially gray, use simple lightness
  if (color.c < 0.05) {
    threshold = 0.5;
  }

  return color.l > threshold;
}

/**
 * Calculate color temperature (warm/cool/neutral)
 * Based on hue angle and chroma intensity
 */
export function getColorTemperature(color: OKLCH): 'warm' | 'cool' | 'neutral' {
  // Very low chroma colors are neutral regardless of hue
  if (color.c < 0.04) {
    return 'neutral';
  }

  // Normalize hue to 0-360 range
  const hue = ((color.h % 360) + 360) % 360;

  // Define temperature ranges based on color theory
  // Warm: reds, oranges, yellows, warm purples
  // Cool: greens, cyans, blues, cool purples

  if (
    (hue >= 0 && hue <= 90) || // Red to yellow
    (hue >= 315 && hue < 360) // Red-purple to red
  ) {
    return 'warm';
  }

  if (hue >= 150 && hue <= 270) {
    // Green-cyan to blue-purple
    return 'cool';
  }

  // Boundary zones (yellow-green and purple-red) depend on specific hue
  if (hue > 90 && hue < 150) {
    // Yellow-green to green
    // More yellow = warm, more green = cool
    return hue < 120 ? 'warm' : 'cool';
  }

  if (hue > 270 && hue < 315) {
    // Purple to red-purple
    // More blue = cool, more red = warm
    return hue > 290 ? 'warm' : 'cool';
  }

  // Fallback for edge cases
  return 'neutral';
}
