/**
 * Studio integration utilities for CSS and framework integration
 */

import type { OKLCH } from '@rafters/shared';
import Color from 'colorjs.io';
import { oklchToCSS, oklchToHex } from './conversion.js';
import { parseColorToOKLCH } from './validation.js';

/**
 * Generate CSS custom properties from color palette
 */
export function generateCSSVariables(palette: Record<string, OKLCH>, prefix = '--color'): string {
  if (Object.keys(palette).length === 0) {
    return '';
  }

  return Object.entries(palette)
    .map(([name, color]) => {
      const cssName = `${prefix}-${name}`;
      const cssValue = oklchToCSS(color);
      return `${cssName}: ${cssValue};`;
    })
    .join('\n');
}

/**
 * Generate Tailwind color configuration
 */
export function generateTailwindConfig(palette: Record<string, OKLCH>): Record<string, string> {
  const config: Record<string, string> = {};

  for (const [name, color] of Object.entries(palette)) {
    config[name] = oklchToHex(color);
  }

  return config;
}

/**
 * Validate color string format (hex, rgb, hsl, oklch, named)
 */
export function isValidColorString(colorString: string): boolean {
  if (!colorString || typeof colorString !== 'string') {
    return false;
  }

  try {
    // Use colorjs.io to validate - it will throw if invalid
    new Color(colorString);
    return true;
  } catch {
    return false;
  }
}

/**
 * Parse any color string format to OKLCH
 */
export function parseColorString(colorString: string): OKLCH {
  if (!isValidColorString(colorString)) {
    throw new Error(`Invalid color string: ${colorString}`);
  }

  return parseColorToOKLCH(colorString);
}
