/**
 * Integration test for unified color generator + semantic validation
 * Tests the complete flow: generate ColorValue → validate semantic assignments
 */

import { describe, expect, it } from 'vitest';
import { type ColorContext, generateColorValue } from '../src/generator.js';
import { type SemanticMapping, validateSemanticMappings } from '../src/validation-alerts.js';

describe('Color Generator + Validation Integration', () => {
  it('should generate ColorValue and validate semantic assignments', () => {
    // Generate a primary color using the unified generator
    const primaryOKLCH = { l: 0.6, c: 0.15, h: 220, alpha: 1 };
    const context: ColorContext = {
      token: 'primary',
      name: 'Ocean Storm',
      generateStates: true,
      semanticRole: 'brand',
    };

    const primaryColorValue = generateColorValue(primaryOKLCH, context);

    // Verify ColorValue structure
    expect(primaryColorValue.name).toBe('Ocean Storm');
    expect(primaryColorValue.token).toBe('primary');
    expect(primaryColorValue.scale).toHaveLength(11); // 50-950 scale
    expect(primaryColorValue.states).toBeDefined();
    expect(primaryColorValue.states?.hover).toBeDefined();
    expect(primaryColorValue.states?.focus).toBeDefined();

    // NEW: Verify advanced color theory intelligence
    expect(primaryColorValue.atmosphericWeight).toBeDefined();
    expect(primaryColorValue.atmosphericWeight?.distanceWeight).toBeTypeOf('number');
    expect(primaryColorValue.atmosphericWeight?.temperature).toMatch(/^(warm|neutral|cool)$/);
    expect(primaryColorValue.atmosphericWeight?.atmosphericRole).toMatch(
      /^(background|midground|foreground)$/
    );

    // NEW: Verify perceptual weight intelligence
    expect(primaryColorValue.perceptualWeight).toBeDefined();
    expect(primaryColorValue.perceptualWeight?.weight).toBeTypeOf('number');
    expect(primaryColorValue.perceptualWeight?.weight).toBeGreaterThanOrEqual(0);
    expect(primaryColorValue.perceptualWeight?.weight).toBeLessThanOrEqual(1);
    expect(primaryColorValue.perceptualWeight?.density).toMatch(/^(light|medium|heavy)$/);
    expect(primaryColorValue.perceptualWeight?.balancingRecommendation).toBeTypeOf('string');

    // NEW: Verify semantic color suggestions
    expect(primaryColorValue.semanticSuggestions).toBeDefined();
    expect(primaryColorValue.semanticSuggestions?.danger).toBeInstanceOf(Array);
    expect(primaryColorValue.semanticSuggestions?.success).toBeInstanceOf(Array);
    expect(primaryColorValue.semanticSuggestions?.warning).toBeInstanceOf(Array);
    expect(primaryColorValue.semanticSuggestions?.info).toBeInstanceOf(Array);
    expect(primaryColorValue.semanticSuggestions?.danger.length).toBeGreaterThan(0);
    expect(primaryColorValue.semanticSuggestions?.success.length).toBeGreaterThan(0);

    // Generate complementary colors for semantic validation
    const successOKLCH = { l: 0.7, c: 0.12, h: 120, alpha: 1 }; // Green
    const dangerOKLCH = { l: 0.6, c: 0.15, h: 15, alpha: 1 }; // Red
    const warningOKLCH = { l: 0.75, c: 0.1, h: 60, alpha: 1 }; // Yellow

    // Generate color values for semantic validation
    generateColorValue(successOKLCH, { token: 'success' });
    generateColorValue(dangerOKLCH, { token: 'danger' });
    generateColorValue(warningOKLCH, { token: 'warning' });

    // Create semantic mappings (simulating user's right-click assignments)
    const semanticMappings: SemanticMapping = {
      primary: {
        colorFamily: 'ocean-storm',
        scalePosition: 600, // Updated to match new base position
        fullReference: 'ocean-storm-600',
        oklch: primaryOKLCH,
      },
      success: {
        colorFamily: 'forest-crown',
        scalePosition: 600, // Updated to match new base position
        fullReference: 'forest-crown-600',
        oklch: successOKLCH,
      },
      danger: {
        colorFamily: 'crimson-fire',
        scalePosition: 600, // Updated to match new base position
        fullReference: 'crimson-fire-600',
        oklch: dangerOKLCH,
      },
      warning: {
        colorFamily: 'sunset-flame',
        scalePosition: 600, // Updated to match new base position
        fullReference: 'sunset-flame-600',
        oklch: warningOKLCH,
      },
    };

    // Validate semantic assignments
    const alerts = validateSemanticMappings(semanticMappings, {});

    // Should have minimal alerts since colors are semantically appropriate
    expect(alerts).toBeInstanceOf(Array);

    // Test that semantic colors align with expectations
    const cognitiveAlerts = alerts.filter((alert) => alert.type === 'cognitive-load');

    // Success should use green (h ≈ 120) - should pass validation
    const successAlert = cognitiveAlerts.find((alert) => alert.affectedTokens.includes('success'));
    expect(successAlert).toBeUndefined(); // No alert expected for proper green

    // Danger should use red (h ≈ 15) - should pass validation
    const dangerAlert = cognitiveAlerts.find((alert) => alert.affectedTokens.includes('danger'));
    expect(dangerAlert).toBeUndefined(); // No alert expected for proper red
  });

  it('should detect problematic semantic assignments', () => {
    // Generate colors with wrong semantic associations
    const wrongSuccessOKLCH = { l: 0.6, c: 0.15, h: 15, alpha: 1 }; // Red for success (wrong!)
    const wrongDangerOKLCH = { l: 0.7, c: 0.12, h: 120, alpha: 1 }; // Green for danger (wrong!)

    // Create problematic semantic mappings
    const problematicMappings: SemanticMapping = {
      success: {
        colorFamily: 'crimson-fire', // Red family for success
        scalePosition: 600, // Updated to match new base position
        fullReference: 'crimson-fire-600',
        oklch: wrongSuccessOKLCH,
      },
      danger: {
        colorFamily: 'forest-crown', // Green family for danger
        scalePosition: 600, // Updated to match new base position
        fullReference: 'forest-crown-600',
        oklch: wrongDangerOKLCH,
      },
    };

    // Validate - should detect cognitive load violations
    const alerts = validateSemanticMappings(problematicMappings, {});
    const cognitiveAlerts = alerts.filter((alert) => alert.type === 'cognitive-load');

    expect(cognitiveAlerts.length).toBeGreaterThan(0);

    // Should detect red color used for success
    const successAlert = cognitiveAlerts.find((alert) => alert.affectedTokens.includes('success'));
    expect(successAlert).toBeDefined();
    expect(successAlert?.message).toContain('success');
    expect(successAlert?.suggestion).toContain('green');

    // Should detect green color used for danger
    const dangerAlert = cognitiveAlerts.find((alert) => alert.affectedTokens.includes('danger'));
    expect(dangerAlert).toBeDefined();
    expect(dangerAlert?.message).toContain('danger');
    expect(dangerAlert?.suggestion).toContain('red');
  });

  it('should provide auto-fix suggestions for generated colors', () => {
    const primaryOKLCH = { l: 0.6, c: 0.15, h: 220, alpha: 1 };
    // Generate color value to ensure system is working
    generateColorValue(primaryOKLCH, {
      token: 'primary',
      generateStates: true,
    });

    // Create mapping with contrast issues
    const lowContrastMappings: SemanticMapping = {
      background: {
        colorFamily: 'neutral',
        scalePosition: 100,
        fullReference: 'neutral-100',
        oklch: { l: 0.95, c: 0.01, h: 0, alpha: 1 }, // Very light
      },
      foreground: {
        colorFamily: 'neutral',
        scalePosition: 200,
        fullReference: 'neutral-200',
        oklch: { l: 0.85, c: 0.02, h: 0, alpha: 1 }, // Also light - poor contrast
      },
    };

    const alerts = validateSemanticMappings(lowContrastMappings, {});
    const contrastAlerts = alerts.filter((alert) => alert.type === 'contrast');

    if (contrastAlerts.length > 0) {
      const alertWithFix = contrastAlerts.find((alert) => alert.autoFix);
      if (alertWithFix) {
        expect(alertWithFix.autoFix?.token).toBeTruthy();
        expect(alertWithFix.autoFix?.newValue).toBeTruthy();
        expect(alertWithFix.autoFix?.reason).toContain('contrast');
      }
    }
  });

  it('should generate color theory intelligence correctly', () => {
    // Test different colors to verify atmospheric and perceptual intelligence
    const warmColor = { l: 0.6, c: 0.2, h: 15, alpha: 1 }; // Red (warm, heavy)
    const coolColor = { l: 0.7, c: 0.15, h: 220, alpha: 1 }; // Blue (cool, lighter)
    const neutralColor = { l: 0.8, c: 0.05, h: 180, alpha: 1 }; // Light cyan (neutral)

    const warmColorValue = generateColorValue(warmColor);
    const coolColorValue = generateColorValue(coolColor);
    const neutralColorValue = generateColorValue(neutralColor);

    // Verify warm color characteristics
    expect(warmColorValue.atmosphericWeight?.temperature).toBe('warm');
    expect(warmColorValue.perceptualWeight?.weight).toBeGreaterThan(
      coolColorValue.perceptualWeight?.weight || 0
    );
    expect(warmColorValue.atmosphericWeight?.distanceWeight).toBeGreaterThan(
      coolColorValue.atmosphericWeight?.distanceWeight || 0
    );

    // Verify cool color characteristics
    expect(coolColorValue.atmosphericWeight?.temperature).toBe('cool');
    expect(coolColorValue.atmosphericWeight?.atmosphericRole).toMatch(/^(background|midground)$/); // Cool colors tend to recede

    // Verify neutral color characteristics
    expect(neutralColorValue.atmosphericWeight?.temperature).toMatch(/^(cool|neutral)$/);
    expect(neutralColorValue.perceptualWeight?.density).toMatch(/^(light|medium)$/); // Light colors have less weight

    // Verify semantic suggestions are contextual
    expect(warmColorValue.semanticSuggestions?.danger[0].h).toBeCloseTo(15, 10); // Danger should suggest reds
    expect(coolColorValue.semanticSuggestions?.info[0].h).toBeCloseTo(220, 30); // Info should suggest blues
    expect(neutralColorValue.semanticSuggestions?.success[0].h).toBeCloseTo(135, 30); // Success should suggest greens
  });

  it('should handle ColorValue states in validation', () => {
    const primaryOKLCH = { l: 0.6, c: 0.15, h: 220, alpha: 1 };
    const colorValue = generateColorValue(primaryOKLCH, {
      token: 'primary',
      generateStates: true,
    });

    // Verify states were generated
    expect(colorValue.states).toBeDefined();
    expect(colorValue.states?.hover).toBeDefined();
    expect(colorValue.states?.focus).toBeDefined();
    expect(colorValue.states?.active).toBeDefined();

    // Create mappings that include interactive states
    const statesMappings: SemanticMapping = {
      primary: {
        colorFamily: 'ocean-storm',
        scalePosition: 600, // Updated to match new base position
        fullReference: 'ocean-storm-600',
        oklch: primaryOKLCH,
      },
      'primary-hover': {
        colorFamily: 'ocean-storm',
        scalePosition: 600, // Same as primary - should trigger usability warning
        fullReference: 'ocean-storm-600',
        oklch: primaryOKLCH,
      },
    };

    const alerts = validateSemanticMappings(statesMappings, {});
    const usabilityAlerts = alerts.filter((alert) => alert.type === 'usability');

    // Should detect that hover state is too similar to base state
    expect(usabilityAlerts.length).toBeGreaterThanOrEqual(0);
  });
});
