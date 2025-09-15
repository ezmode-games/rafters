/**
 * Accessibility contrast calculation and compliance checking functions
 */

import type { OKLCH } from '@rafters/shared';
import { APCAcontrast, sRGBtoY } from 'apca-w3';
import Color from 'colorjs.io';
import { roundOKLCH } from './conversion';

/**
 * Convert OKLCH to relative luminance for WCAG calculations
 */
function getRelativeLuminance(oklch: OKLCH): number {
  const color = new Color('oklch', [oklch.l, oklch.c, oklch.h]);
  const srgb = color.to('srgb');

  // WCAG formula for relative luminance
  const toLinear = (val: number): number => {
    if (val <= 0.03928) {
      return val / 12.92;
    }
    return ((val + 0.055) / 1.055) ** 2.4;
  };

  const r = toLinear(srgb.r);
  const g = toLinear(srgb.g);
  const b = toLinear(srgb.b);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate WCAG 2.1 contrast ratio between two colors
 */
export function calculateWCAGContrast(foreground: OKLCH, background: OKLCH): number {
  const l1 = getRelativeLuminance(foreground);
  const l2 = getRelativeLuminance(background);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculate APCA contrast for modern accessibility
 * Uses the official APCA algorithm via apca-w3 library
 */
export function calculateAPCAContrast(foreground: OKLCH, background: OKLCH): number {
  // Convert OKLCH to RGB arrays for APCA
  const foregroundColor = new Color('oklch', [foreground.l, foreground.c, foreground.h]);
  const backgroundColorObj = new Color('oklch', [background.l, background.c, background.h]);

  const fgRgb = foregroundColor.to('srgb');
  const bgRgb = backgroundColorObj.to('srgb');

  // Convert to 0-255 RGB values for apca-w3
  const fgR = fgRgb.r * 255;
  const fgG = fgRgb.g * 255;
  const fgB = fgRgb.b * 255;
  const bgR = bgRgb.r * 255;
  const bgG = bgRgb.g * 255;
  const bgB = bgRgb.b * 255;

  // Use official APCA calculation
  return APCAcontrast(sRGBtoY(fgR, fgG, fgB), sRGBtoY(bgR, bgG, bgB));
}

/**
 * Check if color pair meets WCAG contrast standards
 */
export function meetsWCAGStandard(
  foreground: OKLCH,
  background: OKLCH,
  level: 'AA' | 'AAA',
  textSize: 'normal' | 'large'
): boolean {
  const contrast = calculateWCAGContrast(foreground, background);

  const thresholds = {
    AA: { normal: 4.5, large: 3.0 },
    AAA: { normal: 7.0, large: 4.5 },
  };

  return contrast >= thresholds[level][textSize];
}

/**
 * Check if color pair meets APCA contrast standards
 */
export function meetsAPCAStandard(foreground: OKLCH, background: OKLCH, textSize: number): boolean {
  const contrast = Math.abs(calculateAPCAContrast(foreground, background));

  // APCA thresholds based on text size (simplified)
  let threshold = 60; // Default for 16px text

  if (textSize >= 24) {
    threshold = 45; // Large text
  } else if (textSize >= 18) {
    threshold = 50; // Medium text
  } else if (textSize < 14) {
    threshold = 75; // Small text
  }

  return contrast >= threshold;
}

/**
 * Pre-computed accessibility contrast matrix interface
 * Stores WCAG AA/AAA compliance pairs as indices into color scales
 */
export interface AccessibilityMetadata {
  // Pre-computed contrast matrices (indices into scale array)
  wcagAA: {
    normal: number[][]; // [[0, 5], [0, 6], [1, 7], ...] - pairs that meet AA
    large: number[][]; // [[0, 4], [0, 5], [1, 5], ...] - more pairs for large text
  };
  wcagAAA: {
    normal: number[][]; // [[0, 7], [0, 8], [0, 9], ...] - fewer pairs meet AAA
    large: number[][]; // [[0, 6], [0, 7], [1, 7], ...]
  };

  // Pre-calculated for common backgrounds
  onWhite: {
    aa: number[]; // [5, 6, 7, 8, 9] - shades that pass AA on white
    aaa: number[]; // [7, 8, 9] - shades that pass AAA on white
  };
  onBlack: {
    aa: number[]; // [0, 1, 2, 3, 4] - shades that pass AA on black
    aaa: number[]; // [0, 1, 2] - shades that pass AAA on black
  };
}

/**
 * Generate pre-computed accessibility metadata for a color scale
 * Eliminates expensive on-demand contrast calculations by storing all valid pairs as indices
 */
export function generateAccessibilityMetadata(scale: OKLCH[]): AccessibilityMetadata {
  if (!scale || scale.length === 0) {
    // Return empty metadata for invalid scales
    return {
      wcagAA: { normal: [], large: [] },
      wcagAAA: { normal: [], large: [] },
      onWhite: { aa: [], aaa: [] },
      onBlack: { aa: [], aaa: [] },
    };
  }

  const metadata: AccessibilityMetadata = {
    wcagAA: { normal: [], large: [] },
    wcagAAA: { normal: [], large: [] },
    onWhite: { aa: [], aaa: [] },
    onBlack: { aa: [], aaa: [] },
  };

  // White and black reference colors
  const white: OKLCH = { l: 1, c: 0, h: 0 };
  const black: OKLCH = { l: 0, c: 0, h: 0 };

  // Check all pairs within the scale
  for (let i = 0; i < scale.length; i++) {
    for (let j = 0; j < scale.length; j++) {
      if (i === j) continue; // Skip same color pairs

      const color1 = scale[i];
      const color2 = scale[j];

      // Skip invalid OKLCH values
      if (!color1 || !color2 || typeof color1.l !== 'number' || typeof color2.l !== 'number') {
        continue;
      }

      // Check WCAG AA compliance
      if (meetsWCAGStandard(color1, color2, 'AA', 'normal')) {
        metadata.wcagAA.normal.push([i, j]);
      }
      if (meetsWCAGStandard(color1, color2, 'AA', 'large')) {
        metadata.wcagAA.large.push([i, j]);
      }

      // Check WCAG AAA compliance
      if (meetsWCAGStandard(color1, color2, 'AAA', 'normal')) {
        metadata.wcagAAA.normal.push([i, j]);
      }
      if (meetsWCAGStandard(color1, color2, 'AAA', 'large')) {
        metadata.wcagAAA.large.push([i, j]);
      }
    }

    // Check against white background
    const colorForWhite = scale[i];
    if (colorForWhite && typeof colorForWhite.l === 'number') {
      if (meetsWCAGStandard(colorForWhite, white, 'AA', 'normal')) {
        metadata.onWhite.aa.push(i);
      }
      if (meetsWCAGStandard(colorForWhite, white, 'AAA', 'normal')) {
        metadata.onWhite.aaa.push(i);
      }
    }

    // Check against black background
    const colorForBlack = scale[i];
    if (colorForBlack && typeof colorForBlack.l === 'number') {
      if (meetsWCAGStandard(colorForBlack, black, 'AA', 'normal')) {
        metadata.onBlack.aa.push(i);
      }
      if (meetsWCAGStandard(colorForBlack, black, 'AAA', 'normal')) {
        metadata.onBlack.aaa.push(i);
      }
    }
  }

  return metadata;
}

/**
 * Find the closest accessible color to target color
 */
export function findAccessibleColor(
  targetColor: OKLCH,
  backgroundColor: OKLCH,
  standard: 'WCAG-AA' | 'WCAG-AAA' | 'APCA'
): OKLCH {
  const result = { ...targetColor };

  // Determine if we need to go lighter or darker
  const bgLuminance = getRelativeLuminance(backgroundColor);

  // Binary search for accessible lightness
  let minL = 0;
  let maxL = 1;
  let iterations = 0;
  const maxIterations = 50;

  while (iterations < maxIterations) {
    const testColor = { ...result };

    let meetsStandard = false;

    switch (standard) {
      case 'WCAG-AA':
        meetsStandard = meetsWCAGStandard(testColor, backgroundColor, 'AA', 'normal');
        break;
      case 'WCAG-AAA':
        meetsStandard = meetsWCAGStandard(testColor, backgroundColor, 'AAA', 'normal');
        break;
      case 'APCA':
        meetsStandard = meetsAPCAStandard(testColor, backgroundColor, 16);
        break;
    }

    if (meetsStandard) {
      return roundOKLCH(testColor);
    }

    // Adjust lightness based on which direction provides better contrast
    if (bgLuminance > 0.5) {
      // Light background - make text darker
      maxL = result.l;
      result.l = (minL + result.l) / 2;
    } else {
      // Dark background - make text lighter
      minL = result.l;
      result.l = (result.l + maxL) / 2;
    }

    // Clamp lightness
    result.l = Math.max(0, Math.min(1, result.l));

    iterations++;
  }

  return roundOKLCH(result);
}
