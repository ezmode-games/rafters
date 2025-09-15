/**
 * Unified Color Object Generator
 *
 * Single source of truth for creating complete ColorValue objects
 * Used by: API, Studio, and design-tokens generator
 * Eliminates duplication of complex mathematical color logic
 */
import { ColorValueSchema, OKLCHSchema } from '@rafters/shared';
import { calculateWCAGContrast, findAccessibleColor, generateAccessibilityMetadata, meetsWCAGStandard, } from './accessibility';
import { getColorTemperature, isLightColor } from './analysis';
import { roundOKLCH } from './conversion';
import { calculateAtmosphericWeight, calculatePerceptualWeight, generateHarmony, generateOKLCHScale as generateLightnessScale, generateSemanticColorSuggestions, } from './harmony';
/**
 * Generate complete ColorValue with full mathematical intelligence
 * This is the single source of truth used by API, Studio, and generators
 */
export function generateColorValue(baseColor, context = {}) {
    // Validate input with Zod
    const validatedColor = OKLCHSchema.parse(baseColor);
    // Round for consistency and cache optimization
    const roundedColor = roundOKLCH(validatedColor);
    // Generate mathematical lightness scale (50-950) with base at 600 using rounded color
    const scaleRecord = generateLightnessScale(roundedColor);
    // Convert Record<number, OKLCH> to ordered OKLCH array (already rounded from harmony)
    // Base color now positioned at 600 for balanced tint/shade distribution
    const scale = [
        scaleRecord[50],
        scaleRecord[100],
        scaleRecord[200],
        scaleRecord[300],
        scaleRecord[400],
        scaleRecord[500],
        scaleRecord[600], // Base color position
        scaleRecord[700],
        scaleRecord[800],
        scaleRecord[900],
        scaleRecord[950], // Now always generated mathematically
    ].filter(Boolean);
    // Generate descriptive color name (or use provided name) using validated color
    const colorName = context.name || `oklch-${Math.round(roundedColor.h)}-${Math.round(roundedColor.l * 100)}`;
    // Generate accessible interactive states if requested
    const states = {};
    if (context.generateStates && context.token) {
        const whiteBackground = { l: 1, c: 0, h: 0, alpha: 1 };
        // Calculate accessible state variants using validated color
        const hoverColor = roundOKLCH(findAccessibleColor({ ...validatedColor, l: Math.max(0.1, validatedColor.l - 0.05) }, whiteBackground, 'WCAG-AA'));
        const focusColor = roundOKLCH(findAccessibleColor({ ...validatedColor, l: Math.max(0.1, validatedColor.l - 0.08) }, whiteBackground, 'WCAG-AA'));
        const activeColor = roundOKLCH(findAccessibleColor({ ...validatedColor, l: Math.max(0.1, validatedColor.l - 0.12) }, whiteBackground, 'WCAG-AA'));
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
 * Calculate mathematical color metadata for token generation
 * Provides consistent metadata calculation across all systems
 */
export function calculateColorMetadata(colorValue) {
    const baseColor = colorValue.scale[5] || colorValue.scale[0]; // Use 500 or first available
    // Map color properties to trust levels based on semantic context
    let trustLevel = 'low';
    if (colorValue.token?.includes('danger') || colorValue.token?.includes('destructive')) {
        trustLevel = 'critical';
    }
    else if (colorValue.token === 'primary') {
        trustLevel = 'high';
    }
    else if (colorValue.token?.includes('warning')) {
        trustLevel = 'medium';
    }
    // Calculate cognitive load from basic color properties
    const cognitiveLoad = Math.round((1 - baseColor.l) * 3 + // Darker colors have more weight
        baseColor.c * 10 + // Chroma adds cognitive load
        (trustLevel === 'critical' ? 3 : 0) // Critical colors demand attention
    );
    return {
        trustLevel,
        cognitiveLoad: Math.max(1, Math.min(10, cognitiveLoad)),
        consequence: trustLevel === 'critical'
            ? 'destructive'
            : trustLevel === 'high'
                ? 'significant'
                : 'reversible',
    };
}
/**
 * Generate cache key for color intelligence
 * Consistent cache key generation across API and Studio
 */
export function generateColorCacheKey(oklch, context) {
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
export function validateOKLCH(oklch) {
    try {
        OKLCHSchema.parse(oklch);
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=generator.js.map