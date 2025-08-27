/**
 * Accessibility contrast calculation and compliance checking functions
 */

import type { OKLCH } from '@rafters/shared';
import { APCAcontrast, sRGBtoY } from 'apca-w3';
import Color from 'colorjs.io';

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

  // Convert to 0-255 RGB arrays for apca-w3
  const fgArray = [fgRgb.r * 255, fgRgb.g * 255, fgRgb.b * 255];
  const bgArray = [bgRgb.r * 255, bgRgb.g * 255, bgRgb.b * 255];

  // Use official APCA calculation
  return APCAcontrast(sRGBtoY(fgArray), sRGBtoY(bgArray));
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
  const _targetLuminance = getRelativeLuminance(targetColor);

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
      return testColor;
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

  return result;
}
