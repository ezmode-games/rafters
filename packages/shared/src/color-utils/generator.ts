/**
 * Unified Color Object Generator
 *
 * Single source of truth for creating complete ColorValue objects
 * Used by: API, Studio, and design-tokens generator
 * Eliminates duplication of complex mathematical color logic
 */

import type { ColorValue, OKLCH } from '@rafters/shared';
import { ColorValueSchema, OKLCHSchema } from '@rafters/shared';
import {
  calculateWCAGContrast,
  findAccessibleColor,
  generateAccessibilityMetadata,
  meetsWCAGStandard,
} from './accessibility';
import { getColorTemperature, isLightColor } from './analysis';
import { roundOKLCH } from './conversion';
import {
  calculateAtmosphericWeight,
  calculatePerceptualWeight,
  generateHarmony,
  generateOKLCHScale as generateLightnessScale,
  generateSemanticColorSuggestions,
} from './harmony';

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
 * Generate complete ColorValue with full mathematical intelligence.
 *
 * This is the cornerstone function of the Rafters color intelligence system.
 * It transforms a simple OKLCH color into a complete ColorValue object containing:
 *
 * - **Mathematical Scale**: 11-step lightness scale (50-950) with base color at 600
 * - **Accessibility Intelligence**: Pre-computed contrast matrices for instant lookup
 * - **Color Harmonies**: Mathematically derived complementary, triadic, analogous relationships
 * - **Interactive States**: Accessible hover/focus/active/disabled variants
 * - **Perceptual Analysis**: Temperature, weight, and semantic role suggestions
 * - **Cognitive Load Data**: Trust levels and attention economics for UI decisions
 *
 * Used by:
 * - API: Real-time color intelligence generation
 * - Studio: Interactive color exploration and brand customization
 * - Design Tokens: Systematic token generation with dependencies
 * - MCP Server: AI agent color intelligence queries
 *
 * The mathematical foundation ensures all generated values have inherent harmony
 * and accessibility compliance, removing guesswork from color decisions.
 *
 * @param baseColor - OKLCH color object to analyze and expand
 * @param context - Optional context for token assignment and state generation
 * @returns Complete ColorValue object with full design intelligence
 * @throws ZodError if input color is invalid
 *
 * @example
 * ```typescript
 * const color = { l: 0.6, c: 0.25, h: 250 };
 * const colorValue = generateColorValue(color, {
 *   token: 'primary',
 *   generateStates: true,
 *   semanticRole: 'brand'
 * });
 * // Returns complete ColorValue with scale, accessibility, harmonies, states
 * ```
 */
export function generateColorValue(baseColor: OKLCH, context: ColorContext = {}): ColorValue {
  // Validate input with Zod
  const validatedColor = OKLCHSchema.parse(baseColor);
  // Round for consistency and cache optimization
  const roundedColor = roundOKLCH(validatedColor);
  // Generate mathematical lightness scale (50-950) with base at 600 using rounded color
  const scaleRecord = generateLightnessScale(roundedColor);

  // Convert Record<number, OKLCH> to ordered OKLCH array (already rounded from harmony)
  // Base color now positioned at 600 for balanced tint/shade distribution
  const scaleKeys = [
    '50',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
    '950',
  ] as const;
  const scale: OKLCH[] = scaleKeys
    .map((key) => scaleRecord[key])
    .filter((color): color is OKLCH => color !== undefined);

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

  // Generate harmonies using existing harmony functions
  const harmonyData = generateHarmony(roundedColor);
  const harmonies = {
    complementary: harmonyData.complementary,
    triadic: [harmonyData.triadic1, harmonyData.triadic2],
    analogous: [harmonyData.analogous1, harmonyData.analogous2],
    tetradic: [harmonyData.tetradic1, harmonyData.tetradic2, harmonyData.tetradic3],
    monochromatic: [
      harmonyData.analogous1,
      harmonyData.analogous2,
      harmonyData.triadic1,
      harmonyData.triadic2,
    ].slice(0, 4),
  };

  // Generate pre-computed accessibility metadata for instant contrast lookups
  const accessibilityMetadata = generateAccessibilityMetadata(scale);

  // Calculate basic accessibility for backwards compatibility
  const white = roundOKLCH({ l: 1, c: 0, h: 0 });
  const black = roundOKLCH({ l: 0, c: 0, h: 0 });
  const accessibility = {
    // Pre-computed contrast matrices - the key innovation
    ...accessibilityMetadata,

    // Basic compatibility data for the base color
    onWhite: {
      wcagAA: meetsWCAGStandard(roundedColor, white, 'AA', 'normal'),
      wcagAAA: meetsWCAGStandard(roundedColor, white, 'AAA', 'normal'),
      contrastRatio: Math.round(calculateWCAGContrast(roundedColor, white) * 100) / 100,
      // Pre-computed indices override for scale lookups
      aa: accessibilityMetadata.onWhite.aa,
      aaa: accessibilityMetadata.onWhite.aaa,
    },
    onBlack: {
      wcagAA: meetsWCAGStandard(roundedColor, black, 'AA', 'normal'),
      wcagAAA: meetsWCAGStandard(roundedColor, black, 'AAA', 'normal'),
      contrastRatio: Math.round(calculateWCAGContrast(roundedColor, black) * 100) / 100,
      // Pre-computed indices for scale lookups
      aa: accessibilityMetadata.onBlack.aa,
      aaa: accessibilityMetadata.onBlack.aaa,
    },
  };

  // Color analysis with core properties
  const analysis = {
    temperature: getColorTemperature(roundedColor),
    isLight: isLightColor(roundedColor),
    name: `color-${Math.round(roundedColor.h)}-${Math.round(roundedColor.l * 100)}-${Math.round(roundedColor.c * 100)}`,
  };

  // Calculate color theory intelligence
  const atmosphericWeight = calculateAtmosphericWeight(roundedColor);
  const perceptualWeight = calculatePerceptualWeight(roundedColor);

  // Generate semantic color suggestions based on color theory
  const semanticSuggestions = generateSemanticColorSuggestions(roundedColor);

  const colorValue = {
    name: colorName,
    scale,
    token: context.token,
    value: '600', // Default scale position (updated to match new base)
    use: context.usage,
    ...(Object.keys(states).length > 0 && { states }),
    // Mathematical data from color-utils
    harmonies,
    accessibility,
    analysis,
    // Advanced color theory intelligence
    atmosphericWeight,
    perceptualWeight,
    semanticSuggestions,
    // All mathematical intelligence included in analysis field
    // Intelligence field left for API to populate with AI data:
    // intelligence
  };

  // Validate output with Zod
  return ColorValueSchema.parse(colorValue);
}

/**
 * Calculate mathematical color metadata for token generation.
 *
 * Generates standardized metadata that enables AI agents to make intelligent
 * color decisions based on mathematical properties and semantic context.
 *
 * This function provides the cognitive load intelligence that prevents
 * AI-generated interfaces from overwhelming users with excessive visual weight.
 *
 * Calculates:
 * - **Trust Level**: Based on semantic role (critical for destructive actions)
 * - **Cognitive Load**: Mathematical formula considering lightness, chroma, and context
 * - **Consequence Level**: Impact classification for risk assessment
 *
 * The cognitive load calculation uses:
 * - Darker colors: Higher cognitive load (demand more attention)
 * - Higher chroma: Increased processing requirement
 * - Critical context: Additional attention weight for safety
 *
 * @param colorValue - Complete ColorValue object to analyze
 * @returns Metadata object with trust level, cognitive load, and consequences
 * @throws Error if no valid color found in scale
 *
 * @example
 * ```typescript
 * const metadata = calculateColorMetadata(primaryColorValue);
 * // Returns: { trustLevel: 'high', cognitiveLoad: 6, consequence: 'significant' }
 * ```
 */
export function calculateColorMetadata(colorValue: ColorValue) {
  const baseColor = colorValue.scale[5] || colorValue.scale[0] || colorValue.scale.find(Boolean);

  if (!baseColor) {
    throw new Error('No valid color found in scale');
  }

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
 * Generate cache key for color intelligence.
 *
 * Creates consistent, optimized cache keys for color intelligence lookups
 * across all Rafters systems. Critical for performance optimization in:
 * - API color generation endpoints
 * - Studio real-time color exploration
 * - MCP server intelligence queries
 * - Design token dependency resolution
 *
 * Uses rounded OKLCH values to ensure cache hits for visually identical
 * colors that may have minor floating-point differences.
 *
 * @param oklch - OKLCH color for cache key generation
 * @param context - Optional context for cache segmentation
 * @returns Optimized string cache key
 *
 * @example
 * ```typescript
 * const key = generateColorCacheKey(
 *   { l: 0.6234567, c: 0.25123, h: 250.789 },
 *   { token: 'primary' }
 * );
 * // Returns: "oklch-0.62-0.25-251-primary"
 * ```
 */
export function generateColorCacheKey(oklch: OKLCH, context?: ColorContext): string {
  // Use consistent rounding function
  const rounded = roundOKLCH(oklch);

  const baseKey = `oklch-${rounded.l}-${rounded.c}-${rounded.h}`;
  const contextKey = context?.token ? `-${context.token}` : '';

  return baseKey + contextKey;
}

/**
 * Validate OKLCH values for safety.
 *
 * Type guard function that ensures color objects conform to OKLCH schema
 * before processing. Essential for preventing runtime errors in color
 * intelligence generation.
 *
 * Uses Zod schema validation to check:
 * - Lightness: 0-1 range
 * - Chroma: 0-0.4 range (practical limit for most displays)
 * - Hue: 0-360 degrees
 * - Alpha: Optional 0-1 range
 *
 * @param oklch - Unknown value to validate as OKLCH
 * @returns Type-safe boolean indicating valid OKLCH object
 *
 * @example
 * ```typescript
 * if (validateOKLCH(userInput)) {
 *   // TypeScript knows userInput is OKLCH
 *   const colorValue = generateColorValue(userInput);
 * }
 * ```
 */
export function validateOKLCH(oklch: unknown): oklch is OKLCH {
  try {
    OKLCHSchema.parse(oklch);
    return true;
  } catch {
    return false;
  }
}
