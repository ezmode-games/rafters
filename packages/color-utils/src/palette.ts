/**
 * Palette generation functions for design systems
 */

import type { OKLCH } from '@rafters/shared';

/**
 * Generate perceptually uniform lightness scale (50-950)
 * Creates a Tailwind-style color scale with perceptually even steps
 */
export function generateLightnessScale(baseColor: OKLCH): Record<number, OKLCH> {
  const scale: Record<number, OKLCH> = {};

  // Define the lightness curve - adjusted for perceptual uniformity
  // These values are based on research into perceptual lightness scales
  const lightnessMap: Record<number, number> = {
    50: 0.97, // Very light
    100: 0.92, // Light
    200: 0.84, // Light-medium
    300: 0.74, // Medium-light
    400: 0.62, // Medium
    500: 0.5, // Base (will be adjusted to match input)
    600: 0.42, // Medium-dark
    700: 0.34, // Dark-medium
    800: 0.26, // Dark
    900: 0.18, // Very dark
    950: 0.1, // Darkest
  };

  // Calculate adjustment factor to center the base color at 500
  const targetL500 = 0.5;
  const adjustment = baseColor.l - targetL500;

  // Generate each step in the scale
  for (const [step, targetLightness] of Object.entries(lightnessMap)) {
    const stepNum = Number.parseInt(step);
    let adjustedLightness = targetLightness + adjustment;

    // Clamp lightness to valid range
    adjustedLightness = Math.max(0.02, Math.min(0.98, adjustedLightness));

    // Adjust chroma based on lightness to maintain color appearance
    // Chroma tends to appear less saturated at very light/dark values
    let adjustedChroma = baseColor.c;

    if (adjustedLightness > 0.85) {
      // Very light colors - reduce chroma slightly
      const reduction = (adjustedLightness - 0.85) * 0.3;
      adjustedChroma = baseColor.c * (1 - reduction);
    } else if (adjustedLightness < 0.25) {
      // Very dark colors - reduce chroma more significantly
      const reduction = (0.25 - adjustedLightness) * 0.4;
      adjustedChroma = baseColor.c * (1 - reduction);
    }

    // Ensure chroma doesn't go negative
    adjustedChroma = Math.max(0, adjustedChroma);

    scale[stepNum] = {
      l: adjustedLightness,
      c: adjustedChroma,
      h: baseColor.h, // Preserve hue
    };
  }

  return scale;
}

/**
 * Generate harmonious color palette using color theory
 */
export function generateHarmoniousPalette(
  baseColor: OKLCH,
  harmony: 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'tetradic'
): OKLCH[] {
  const colors: OKLCH[] = [baseColor];

  switch (harmony) {
    case 'monochromatic':
      // Same hue, different lightness and chroma
      colors.push(
        { ...baseColor, l: baseColor.l * 0.7, c: baseColor.c * 0.8 },
        { ...baseColor, l: baseColor.l * 1.2, c: baseColor.c * 0.6 },
        { ...baseColor, c: baseColor.c * 0.5 },
        { ...baseColor, c: baseColor.c * 1.3 }
      );
      break;

    case 'analogous':
      // Adjacent hues (±30°)
      colors.push(
        { ...baseColor, h: (baseColor.h + 30) % 360 },
        { ...baseColor, h: (baseColor.h - 30 + 360) % 360 },
        { ...baseColor, h: (baseColor.h + 60) % 360, c: baseColor.c * 0.8 },
        { ...baseColor, h: (baseColor.h - 60 + 360) % 360, c: baseColor.c * 0.8 }
      );
      break;

    case 'complementary': {
      // Opposite hue (180°)
      const complementHue = (baseColor.h + 180) % 360;
      colors.push(
        { ...baseColor, h: complementHue },
        { ...baseColor, h: complementHue, l: baseColor.l * 0.8 },
        { ...baseColor, h: complementHue, l: baseColor.l * 1.1, c: baseColor.c * 0.7 },
        { ...baseColor, l: baseColor.l * 0.8 }
      );
      break;
    }

    case 'triadic':
      // 120° intervals
      colors.push(
        { ...baseColor, h: (baseColor.h + 120) % 360 },
        { ...baseColor, h: (baseColor.h + 240) % 360 },
        { ...baseColor, l: baseColor.l * 0.8, c: baseColor.c * 0.8 },
        { ...baseColor, l: baseColor.l * 1.1, c: baseColor.c * 0.7 }
      );
      break;

    case 'tetradic':
      // 90° intervals (square)
      colors.push(
        { ...baseColor, h: (baseColor.h + 90) % 360 },
        { ...baseColor, h: (baseColor.h + 180) % 360 },
        { ...baseColor, h: (baseColor.h + 270) % 360 },
        { ...baseColor, l: baseColor.l * 0.9, c: baseColor.c * 0.8 }
      );
      break;
  }

  // Ensure all colors have valid ranges
  return colors.map((color) => ({
    l: Math.max(0, Math.min(1, color.l)),
    c: Math.max(0, color.c),
    h: ((color.h % 360) + 360) % 360,
  }));
}

/**
 * Generate semantic color set (success, warning, danger, info)
 */
export function generateSemanticColors(brandColor: OKLCH): {
  success: OKLCH;
  warning: OKLCH;
  danger: OKLCH;
  info: OKLCH;
} {
  return {
    success: {
      l: 0.55,
      c: 0.14,
      h: 140, // Green
    },
    warning: {
      l: 0.65,
      c: 0.16,
      h: 65, // Orange-yellow
    },
    danger: {
      l: 0.58,
      c: 0.2,
      h: 15, // Red
    },
    info: {
      l: 0.6,
      c: 0.15,
      h: 240, // Blue
    },
  };
}
