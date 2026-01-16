/**
 * Token Display Utilities
 *
 * Helpers for displaying token values in the UI.
 */

import type { Token } from '../api/token-loader';

/**
 * Check if a value is a ColorValue object (has scale array)
 */
function isColorValue(
  value: unknown,
): value is { name: string; scale: Array<{ l: number; c: number; h: number }> } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'scale' in value &&
    Array.isArray((value as { scale: unknown }).scale)
  );
}

/**
 * Check if a value is a ColorReference object
 */
function isColorReference(value: unknown): value is { family: string; position: string } {
  return typeof value === 'object' && value !== null && 'family' in value && 'position' in value;
}

/**
 * Get a CSS-compatible string value from a token
 */
export function getTokenCssValue(token: Token): string {
  const { value } = token;

  // String value - return as-is
  if (typeof value === 'string') {
    return value;
  }

  // ColorValue - get the 500 position (middle of scale) as OKLCH
  if (isColorValue(value)) {
    const midIndex = 5; // 500 position in [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
    const oklch = value.scale[midIndex] || value.scale[0];
    if (oklch) {
      return `oklch(${oklch.l.toFixed(3)} ${oklch.c.toFixed(3)} ${oklch.h.toFixed(1)})`;
    }
    return '#888888';
  }

  // ColorReference - construct reference string
  if (isColorReference(value)) {
    return `{${value.family}.${value.position}}`;
  }

  // Unknown - stringify
  return String(value);
}

/**
 * Get a display string for a token value (for showing in UI)
 */
export function getTokenDisplayValue(token: Token): string {
  const { value } = token;

  // String value
  if (typeof value === 'string') {
    return value;
  }

  // ColorValue - show the name
  if (isColorValue(value)) {
    return value.name;
  }

  // ColorReference
  if (isColorReference(value)) {
    return `${value.family}.${value.position}`;
  }

  return String(value);
}
