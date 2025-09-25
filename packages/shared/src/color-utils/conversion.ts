/**
 * OKLCH color conversion functions using colorjs.io
 */

import type { OKLCH } from '@rafters/shared';
import Color from 'colorjs.io';

/**
 * Convert OKLCH color object to hex string.
 *
 * This is a cornerstone function for the Rafters design system, converting from the
 * perceptually uniform OKLCH color space to hex format for CSS and styling systems.
 *
 * OKLCH is the foundation of Rafters' color intelligence because it provides:
 * - Perceptual uniformity: equal changes in values produce equal visual differences
 * - Predictable lightness: L component directly correlates to human perception
 * - Chroma independence: saturation can be adjusted without affecting lightness
 * - Hue continuity: hue values wrap smoothly around the color wheel
 *
 * This conversion maintains color fidelity when translating design intelligence
 * into browser-compatible formats.
 *
 * @param oklch - OKLCH color object with l (lightness 0-1), c (chroma 0-0.4), h (hue 0-360)
 * @returns Hex color string in format #rrggbb
 * @throws Error if color conversion fails due to out-of-gamut values
 *
 * @example
 * ```typescript
 * const blue = { l: 0.6, c: 0.25, h: 250 };
 * const hex = oklchToHex(blue); // "#4287f5"
 * ```
 */
export function oklchToHex(oklch: OKLCH): string {
  const color = new Color('oklch', [oklch.l, oklch.c, oklch.h]);
  return color.to('srgb').toString({ format: 'hex', collapse: false });
}

/**
 * Convert OKLCH to CSS oklch() function string.
 *
 * Generates modern CSS oklch() function syntax for direct use in stylesheets.
 * This is preferred over hex when browsers support it because it maintains
 * the full color gamut and allows for CSS custom property manipulation.
 *
 * The oklch() function provides:
 * - Wider color gamut support (P3, Rec2020)
 * - CSS custom property compatibility for dynamic theming
 * - Mathematical color manipulation in CSS calc() functions
 * - Future-proof color specification
 *
 * @param oklch - OKLCH color object
 * @returns CSS oklch() function string
 *
 * @example
 * ```typescript
 * const color = { l: 0.7, c: 0.15, h: 180 };
 * const css = oklchToCSS(color); // "oklch(0.7 0.15 180)"
 * ```
 */
export function oklchToCSS(oklch: OKLCH): string {
  return `oklch(${oklch.l} ${oklch.c} ${oklch.h})`;
}

/**
 * Convert hex string to OKLCH color object.
 *
 * This is the primary entry point for converting existing colors into Rafters'
 * OKLCH-based design intelligence system. Essential for:
 * - Brand color migration from existing design systems
 * - User color input processing in Studio
 * - Legacy color system integration
 * - Design token import workflows
 *
 * The conversion process:
 * 1. Parses hex into sRGB values
 * 2. Transforms to CIE XYZ color space
 * 3. Converts to OKLab perceptual space
 * 4. Transforms to OKLCH cylindrical coordinates
 *
 * This maintains perceptual accuracy while enabling mathematical color operations.
 *
 * @param hex - Hex color string (#rgb, #rrggbb, or variations)
 * @returns OKLCH color object with precise floating-point values
 * @throws Error for invalid hex color formats
 *
 * @example
 * ```typescript
 * const oklch = hexToOKLCH('#3498db');
 * // Returns: { l: 0.628, c: 0.162, h: 251.2, alpha: 1 }
 * ```
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
 * Round OKLCH values to standard precision for consistency.
 *
 * Critical utility for the Rafters design system that ensures:
 * - Consistent color representation across the system
 * - Optimal cache key generation for performance
 * - Elimination of floating-point precision errors
 * - Standardized token generation and comparison
 *
 * Precision standards:
 * - Lightness (L): 2 decimal places (0.01 precision, imperceptible differences)
 * - Chroma (C): 2 decimal places (0.01 precision, maintains saturation accuracy)
 * - Hue (H): Whole degrees (1° precision, sufficient for color harmony)
 * - Alpha: 2 decimal places (0.01 precision, standard transparency precision)
 *
 * This precision balances perceptual accuracy with system performance.
 * Smaller differences are imperceptible to users but cause cache misses
 * and inconsistent color matching.
 *
 * @param oklch - Raw OKLCH color object with full precision
 * @returns Rounded OKLCH color object with standardized precision
 *
 * @example
 * ```typescript
 * const raw = { l: 0.7234567, c: 0.1567890, h: 245.678 };
 * const rounded = roundOKLCH(raw);
 * // Returns: { l: 0.72, c: 0.16, h: 246 }
 * ```
 */
export function roundOKLCH(oklch: OKLCH): OKLCH {
  return {
    l: Math.round(oklch.l * 100) / 100, // 2 decimal places for lightness
    c: Math.round(oklch.c * 100) / 100, // 2 decimal places for chroma
    h: Math.round(oklch.h), // Whole degrees for hue
    alpha: oklch.alpha ? Math.round(oklch.alpha * 100) / 100 : undefined, // 2 decimal places for alpha
  };
}
