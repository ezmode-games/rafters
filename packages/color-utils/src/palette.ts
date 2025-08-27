/**
 * Palette generation functions for design systems
 * Advanced algorithms inspired by leonardo-contrast-colors
 */

import type { OKLCH } from '@rafters/shared';
import chroma from 'chroma-js';
import Color from 'colorjs.io';

/**
 * Generate advanced perceptual color scale with smooth interpolation
 * Algorithm inspired by leonardo's createScale approach
 */
function generateAdvancedScale(
  colorKeys: OKLCH[],
  swatches = 11,
  options: {
    colorspace?: 'LAB' | 'LCH' | 'OKLCH' | 'HSL' | 'HSLuv';
    smooth?: boolean;
    distributeLightness?: 'linear' | 'polynomial';
    fullScale?: boolean;
  } = {}
): OKLCH[] {
  const { smooth = true, distributeLightness = 'polynomial', fullScale = true } = options;

  // Convert OKLCH to hex for chroma-js compatibility
  const hexKeys = colorKeys.map((oklch) => {
    const color = new Color('oklch', [oklch.l, oklch.c, oklch.h]);
    return color.to('srgb').toString({ format: 'hex' });
  });

  let domains: number[];

  if (fullScale) {
    // Set domain based on lightness against full black-to-white scale
    domains = hexKeys
      .map((key) => swatches - swatches * (chroma(key).hsl()[2] / 100))
      .sort((a, b) => a - b)
      .concat(swatches);
    domains.unshift(0);
  } else {
    // Use relative lightness range
    const lums = hexKeys.map((c) => chroma(c).hsl()[2] / 100);
    const min = Math.min(...lums);
    const max = Math.max(...lums);

    domains = lums
      .map((lum) => {
        if (lum === 0 || Number.isNaN((lum - min) / (max - min))) return 0;
        return swatches - ((lum - min) / (max - min)) * swatches;
      })
      .sort((a, b) => a - b);
  }

  // Apply advanced lightness distribution
  if (distributeLightness === 'polynomial') {
    // Polynomial mapping for perceptually uniform distribution
    const polynomial = (x: number) => {
      return Math.sqrt(Math.sqrt((x ** 2.25 + x ** 4) / 2));
    };

    const percDomains = domains.map((d) => d / swatches);
    const newDomains = percDomains.map((d) => polynomial(d) * swatches);
    domains = newDomains;
  }

  // Sort colors by lightness
  const sortedHexKeys = hexKeys
    .map((c, i) => ({ color: c, lightness: chroma(c).hsl()[2], index: i }))
    .sort((a, b) => b.lightness - a.lightness)
    .map((data) => data.color);

  let colorsArray: string[] = [];
  if (fullScale) {
    colorsArray = ['#ffffff', ...sortedHexKeys, '#000000'];
  } else {
    colorsArray = sortedHexKeys;
  }

  // Create the scale
  let scale: chroma.Scale;
  if (smooth) {
    // Use smooth interpolation for better perceptual uniformity
    scale = chroma.scale(colorsArray).domain(domains).mode('lch');
  } else {
    scale = chroma.scale(colorsArray).domain(domains).mode('lch');
  }

  // Generate colors
  const colors = scale.colors(swatches);

  // Convert back to OKLCH
  return colors.map((hexColor: string) => {
    const color = new Color(hexColor);
    const oklch = color.to('oklch');
    return {
      l: Math.max(0, Math.min(1, oklch.coords[0])), // Clamp lightness
      c: Math.max(0, oklch.coords[1] || 0), // Ensure positive chroma
      h: ((oklch.coords[2] || 0) + 360) % 360, // Normalize hue
    };
  });
}

/**
 * Generate perceptually uniform lightness scale (50-950)
 * Creates a Tailwind-style color scale with perceptually even steps
 */
export function generateLightnessScale(
  baseColor: OKLCH,
  steps: number[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
): Record<number, OKLCH> {
  // Create multiple color keys around the base color for smooth interpolation
  const colorKeys = [
    { ...baseColor, l: Math.min(0.95, baseColor.l + 0.4) }, // Lighter
    baseColor, // Base
    { ...baseColor, l: Math.max(0.05, baseColor.l - 0.4) }, // Darker
  ];

  const advancedColors = generateAdvancedScale(colorKeys, steps.length, {
    smooth: true,
    distributeLightness: 'polynomial',
    fullScale: true,
  });

  const scale: Record<number, OKLCH> = {};
  for (let i = 0; i < steps.length && i < advancedColors.length; i++) {
    scale[steps[i]] = advancedColors[i];
  }

  return scale;
}

/**
 * Generate harmonious color palette using color theory
 */
export function generateHarmoniousPalette(
  baseColor: OKLCH,
  harmony: 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'tetradic',
  variations = 5
): OKLCH[] {
  let colorKeys: OKLCH[] = [baseColor];

  switch (harmony) {
    case 'monochromatic':
      // Create lightness and chroma variations
      colorKeys = [
        {
          ...baseColor,
          l: Math.min(0.9, baseColor.l + 0.2),
          c: baseColor.c * 0.8,
        },
        baseColor,
        {
          ...baseColor,
          l: Math.max(0.1, baseColor.l - 0.2),
          c: baseColor.c * 1.2,
        },
      ];
      break;

    case 'analogous':
      colorKeys = [
        { ...baseColor, h: (baseColor.h - 30 + 360) % 360 },
        baseColor,
        { ...baseColor, h: (baseColor.h + 30) % 360 },
      ];
      break;

    case 'complementary':
      colorKeys = [baseColor, { ...baseColor, h: (baseColor.h + 180) % 360 }];
      break;

    case 'triadic':
      colorKeys = [
        baseColor,
        { ...baseColor, h: (baseColor.h + 120) % 360 },
        { ...baseColor, h: (baseColor.h + 240) % 360 },
      ];
      break;

    case 'tetradic':
      colorKeys = [
        baseColor,
        { ...baseColor, h: (baseColor.h + 90) % 360 },
        { ...baseColor, h: (baseColor.h + 180) % 360 },
        { ...baseColor, h: (baseColor.h + 270) % 360 },
      ];
      break;
  }

  return generateAdvancedScale(colorKeys, variations, {
    smooth: true,
    fullScale: false,
    distributeLightness: 'polynomial',
  });
}

/**
 * Generate semantic color set (success, warning, danger, info)
 */
export function generateSemanticColors(_brandColor: OKLCH): {
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
