/**
 * Invert Rule Plugin
 *
 * Mathematically inverts colors for dark mode by inverting lightness values.
 * This creates sophisticated dark mode variants that maintain visual hierarchy.
 */

import type { ColorValue } from '@rafters/shared';
import type { TokenRegistry } from '../registry';

// Extended ColorValue with optional plugin-specific properties
type ExtendedColorValue = ColorValue & {
  darkModeReferences?: Record<number, { family: string; position: string | number }>;
  darkModeFamily?: string;
};

export default function invert(
  registry: TokenRegistry,
  tokenName: string,
  dependencies: string[],
): { family: string; position: string | number } {
  // Get the base token from dependencies
  if (dependencies.length === 0) {
    throw new Error(`No dependencies found for invert rule on token: ${tokenName}`);
  }

  const baseTokenName = dependencies[0];
  if (!baseTokenName) {
    throw new Error(`No dependency token name for invert rule on token: ${tokenName}`);
  }
  const baseToken = registry.get(baseTokenName);

  if (!baseToken) {
    throw new Error(`Base token ${baseTokenName} not found for invert rule`);
  }

  // Handle ColorReference tokens (semantic tokens with family/position)
  if (typeof baseToken.value === 'object' && 'family' in baseToken.value) {
    const colorRef = baseToken.value as { family: string; position: string | number };

    // Get the actual color family to perform inversion logic
    const familyToken = registry.get(colorRef.family);
    if (!familyToken || typeof familyToken.value !== 'object') {
      throw new Error(`ColorValue family token ${colorRef.family} not found for invert rule`);
    }

    const colorValue = familyToken.value as ExtendedColorValue;

    // Check if the family has dark mode inversion mappings
    if (colorValue.darkModeReferences) {
      const currentPosition =
        typeof colorRef.position === 'string' ? parseInt(colorRef.position, 10) : colorRef.position;

      const currentIndex = Math.floor(currentPosition / 100);

      // Look for pre-computed dark mode reference
      if (colorValue.darkModeReferences[currentIndex]) {
        const darkRef = colorValue.darkModeReferences[currentIndex];
        return {
          family: darkRef.family,
          position: darkRef.position,
        };
      }
    }

    // Mathematical inversion fallback
    return invertPosition(colorRef.family, colorRef.position);
  }

  // Handle direct ColorValue family tokens
  if (typeof baseToken.value === 'object' && 'scale' in baseToken.value) {
    // For family tokens, invert to create a dark mode variant
    // This would typically create a new family or reference existing dark variants

    const colorValue = baseToken.value as ExtendedColorValue;

    // Check for dark mode family references
    if (colorValue.darkModeFamily) {
      return {
        family: colorValue.darkModeFamily,
        position: 500, // Default middle position
      };
    }

    // Fallback: return same family with inverted position logic
    return {
      family: baseTokenName ?? 'neutral',
      position: 500, // Middle position as safe default
    };
  }

  // For simple string values, try to parse and invert
  invertColorValue(String(baseToken.value));

  // Since we need to return a reference, we'll create a synthetic reference
  // In practice, this might need to reference a dark mode family
  return {
    family: baseTokenName ?? 'neutral',
    position: 'inverted',
  };
}

/**
 * Invert a position within a color family scale
 */
function invertPosition(
  family: string,
  position: string | number,
): { family: string; position: string | number } {
  const pos = typeof position === 'string' ? parseInt(position, 10) : position;

  // Mathematical inversion: 100 ↔ 900, 200 ↔ 800, etc.
  // This maintains visual hierarchy while inverting lightness
  const invertedPos = 1000 - pos;

  // Ensure we stay within valid range (100-900)
  const clampedPos = Math.max(100, Math.min(900, invertedPos));

  return {
    family,
    position: clampedPos.toString(),
  };
}

/**
 * Invert a color value string (for OKLCH colors)
 */
function invertColorValue(colorValue: string): string {
  // Handle OKLCH color inversion
  if (colorValue.startsWith('oklch(')) {
    const match = colorValue.match(/oklch\\(([\\d.]+)\\s+([\\d.]+)\\s+([\\d.]+)\\)/);
    if (match?.[1] && match[2] && match[3]) {
      const l = parseFloat(match[1]);
      const c = parseFloat(match[2]);
      const h = parseFloat(match[3]);

      // Invert lightness: dark becomes light, light becomes dark
      const invertedL = 1 - l;

      return `oklch(${invertedL.toFixed(3)} ${c} ${h})`;
    }
  }

  // Handle hex colors by converting to OKLCH and inverting
  if (colorValue.startsWith('#')) {
    // For now, return a placeholder - would need color conversion utilities
    return colorValue; // Simplified - should convert to OKLCH and invert
  }

  // For other formats, return as-is (simplified)
  return colorValue;
}
