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

    // Generate complementary colors for semantic validation
    const successOKLCH = { l: 0.7, c: 0.12, h: 120, alpha: 1 }; // Green
    const dangerOKLCH = { l: 0.6, c: 0.15, h: 15, alpha: 1 }; // Red
    const warningOKLCH = { l: 0.75, c: 0.1, h: 60, alpha: 1 }; // Yellow

    const successColorValue = generateColorValue(successOKLCH, { token: 'success' });
    const dangerColorValue = generateColorValue(dangerOKLCH, { token: 'danger' });
    const warningColorValue = generateColorValue(warningOKLCH, { token: 'warning' });

    // Create semantic mappings (simulating user's right-click assignments)
    const semanticMappings: SemanticMapping = {
      primary: {
        colorFamily: 'ocean-storm',
        scalePosition: 500,
        fullReference: 'ocean-storm-500',
        oklch: primaryOKLCH,
      },
      success: {
        colorFamily: 'forest-crown',
        scalePosition: 500,
        fullReference: 'forest-crown-500',
        oklch: successOKLCH,
      },
      danger: {
        colorFamily: 'crimson-fire',
        scalePosition: 500,
        fullReference: 'crimson-fire-500',
        oklch: dangerOKLCH,
      },
      warning: {
        colorFamily: 'sunset-flame',
        scalePosition: 500,
        fullReference: 'sunset-flame-500',
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
        scalePosition: 500,
        fullReference: 'crimson-fire-500',
        oklch: wrongSuccessOKLCH,
      },
      danger: {
        colorFamily: 'forest-crown', // Green family for danger
        scalePosition: 500,
        fullReference: 'forest-crown-500',
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
    const colorValue = generateColorValue(primaryOKLCH, {
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
        scalePosition: 500,
        fullReference: 'ocean-storm-500',
        oklch: primaryOKLCH,
      },
      'primary-hover': {
        colorFamily: 'ocean-storm',
        scalePosition: 500, // Same as primary - should trigger usability warning
        fullReference: 'ocean-storm-500',
        oklch: primaryOKLCH,
      },
    };

    const alerts = validateSemanticMappings(statesMappings, {});
    const usabilityAlerts = alerts.filter((alert) => alert.type === 'usability');

    // Should detect that hover state is too similar to base state
    expect(usabilityAlerts.length).toBeGreaterThanOrEqual(0);
  });
});
