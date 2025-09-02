/**
 * Unified Color Object Generator
 *
 * Single source of truth for creating complete ColorValue objects
 * Used by: API, Studio, and design-tokens generator
 * Eliminates duplication of complex mathematical color logic
 */

import type { ColorValue, OKLCH } from '@rafters/shared';
import { ColorValueSchema, OKLCHSchema } from '@rafters/shared';
import { findAccessibleColor } from './accessibility.js';
import { roundOKLCH } from './conversion.js';
// Removed atmospheric/perceptual weight imports - using harmony functions directly
import { generateOKLCHScale as generateLightnessScale } from './harmony.js';

/**
 * Color context validation using shared schemas
 * Simple approach that leverages existing Zod validation
 */
export type ColorContext = {
  token?: string; // Semantic assignment (primary, success, etc.)
  name?: string; // User-provided name override
  usage?: string; // Usage description
  generateStates?: boolean; // Whether to generate interactive states
  semanticRole?: 'brand' | 'semantic' | 'neutral'; // Role in design system
};

/**
 * Generate complete ColorValue with full mathematical intelligence
 * This is the single source of truth used by API, Studio, and generators
 */
export function generateColorValue(baseColor: OKLCH, context: ColorContext = {}): ColorValue {
  // Validate input with Zod
  const validatedColor = OKLCHSchema.parse(baseColor);
  // Round for consistency and cache optimization
  const roundedColor = roundOKLCH(validatedColor);
  // Generate mathematical lightness scale (50-950) using rounded color
  const scaleRecord = generateLightnessScale(roundedColor);

  // Convert Record<number, OKLCH> to ordered OKLCH array (already rounded from harmony)
  const scale: OKLCH[] = [
    scaleRecord[50],
    scaleRecord[100],
    scaleRecord[200],
    scaleRecord[300],
    scaleRecord[400],
    scaleRecord[500],
    scaleRecord[600],
    scaleRecord[700],
    scaleRecord[800],
    scaleRecord[900],
    scaleRecord[950] || scaleRecord[900],
  ].filter(Boolean);

  // Generate descriptive color name (or use provided name) using validated color
  const colorName =
    context.name || `oklch-${Math.round(roundedColor.h)}-${Math.round(roundedColor.l * 100)}`;

  // Generate accessible interactive states if requested
  const states: Record<string, string> = {};
  if (context.generateStates && context.token) {
    const whiteBackground = { l: 1, c: 0, h: 0, alpha: 1 };

    // Calculate accessible state variants using validated color
    const hoverColor = roundOKLCH(
      findAccessibleColor(
        { ...validatedColor, l: Math.max(0.1, validatedColor.l - 0.05) },
        whiteBackground,
        'WCAG-AA'
      )
    );
    const focusColor = roundOKLCH(
      findAccessibleColor(
        { ...validatedColor, l: Math.max(0.1, validatedColor.l - 0.08) },
        whiteBackground,
        'WCAG-AA'
      )
    );
    const activeColor = roundOKLCH(
      findAccessibleColor(
        { ...validatedColor, l: Math.max(0.1, validatedColor.l - 0.12) },
        whiteBackground,
        'WCAG-AA'
      )
    );

    // Round disabled state values (still need rounding here since it's calculated inline)
    const disabledColor = roundOKLCH({
      l: validatedColor.l * 0.6,
      c: validatedColor.c * 0.3,
      h: validatedColor.h,
      alpha: validatedColor.alpha,
    });

    states.hover = `oklch(${hoverColor.l} ${hoverColor.c} ${hoverColor.h})`;
    states.focus = `oklch(${focusColor.l} ${focusColor.c} ${focusColor.h})`;
    states.active = `oklch(${activeColor.l} ${activeColor.c} ${activeColor.h})`;
    states.disabled = `oklch(${disabledColor.l} ${disabledColor.c} ${disabledColor.h})`;
  }

  const colorValue = {
    name: colorName,
    scale,
    token: context.token,
    value: '500', // Default scale position
    use: context.usage,
    ...(Object.keys(states).length > 0 && { states }),
    // Intelligence fields left for API to populate:
    // intelligence, harmonies, accessibility, analysis
  };

  // Validate output with Zod
  return ColorValueSchema.parse(colorValue);
}

/**
 * Calculate mathematical color metadata for token generation
 * Provides consistent metadata calculation across all systems
 */
export function calculateColorMetadata(colorValue: ColorValue) {
  const baseColor = colorValue.scale[5] || colorValue.scale[0]; // Use 500 or first available

  // Map color properties to trust levels based on semantic context
  let trustLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
  if (colorValue.token?.includes('danger') || colorValue.token?.includes('destructive')) {
    trustLevel = 'critical';
  } else if (colorValue.token === 'primary') {
    trustLevel = 'high';
  } else if (colorValue.token?.includes('warning')) {
    trustLevel = 'medium';
  }

  // Calculate cognitive load from basic color properties
  const cognitiveLoad = Math.round(
    (1 - baseColor.l) * 3 + // Darker colors have more weight
      baseColor.c * 10 + // Chroma adds cognitive load
      (trustLevel === 'critical' ? 3 : 0) // Critical colors demand attention
  );

  return {
    trustLevel,
    cognitiveLoad: Math.max(1, Math.min(10, cognitiveLoad)),
    consequence:
      trustLevel === 'critical'
        ? ('destructive' as const)
        : trustLevel === 'high'
          ? ('significant' as const)
          : ('reversible' as const),
  };
}

/**
 * Generate cache key for color intelligence
 * Consistent cache key generation across API and Studio
 */
export function generateColorCacheKey(oklch: OKLCH, context?: ColorContext): string {
  // Use consistent rounding function
  const rounded = roundOKLCH(oklch);

  const baseKey = `oklch-${rounded.l}-${rounded.c}-${rounded.h}`;
  const contextKey = context?.token ? `-${context.token}` : '';

  return baseKey + contextKey;
}

/**
 * Validate OKLCH values for safety
 * Shared validation logic across all systems
 */
export function validateOKLCH(oklch: unknown): oklch is OKLCH {
  try {
    OKLCHSchema.parse(oklch);
    return true;
  } catch {
    return false;
  }
}
