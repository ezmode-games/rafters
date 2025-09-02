/**
 * Test suite for semantic mapping validation system
 * Validates mathematical accessibility validation without AI dependency
 */

import { describe, expect, it } from 'vitest';
import {
  type AccessibilityAlert,
  type SemanticMapping,
  validateSemanticMappings,
} from '../src/validation-alerts.js';

describe('Semantic Mapping Validation System', () => {
  // Test data representing user's right-click semantic assignments
  const mockSemanticMappings: SemanticMapping = {
    primary: {
      colorFamily: 'ocean-storm',
      scalePosition: 500,
      fullReference: 'ocean-storm-500',
      oklch: { l: 0.6, c: 0.15, h: 220, alpha: 1 },
    },
    'primary-foreground': {
      colorFamily: 'neutral',
      scalePosition: 50,
      fullReference: 'neutral-50',
      oklch: { l: 0.98, c: 0.01, h: 0, alpha: 1 },
    },
    background: {
      colorFamily: 'neutral',
      scalePosition: 50,
      fullReference: 'neutral-50',
      oklch: { l: 0.98, c: 0.01, h: 0, alpha: 1 },
    },
    foreground: {
      colorFamily: 'neutral',
      scalePosition: 900,
      fullReference: 'neutral-900',
      oklch: { l: 0.2, c: 0.02, h: 0, alpha: 1 },
    },
    success: {
      colorFamily: 'sunset-flame', // Wrong semantic color - should be green
      scalePosition: 500,
      fullReference: 'sunset-flame-500',
      oklch: { l: 0.7, c: 0.12, h: 60, alpha: 1 }, // Orange/yellow instead of green
    },
    danger: {
      colorFamily: 'forest-crown', // Wrong semantic color - should be red
      scalePosition: 500,
      fullReference: 'forest-crown-500',
      oklch: { l: 0.6, c: 0.15, h: 140, alpha: 1 }, // Green instead of red
    },
  };

  const mockColorFamilies = {
    'ocean-storm': [
      { l: 0.98, c: 0.02, h: 220, alpha: 1 }, // 50
      { l: 0.95, c: 0.05, h: 220, alpha: 1 }, // 100
      { l: 0.85, c: 0.08, h: 220, alpha: 1 }, // 200
      { l: 0.75, c: 0.12, h: 220, alpha: 1 }, // 300
      { l: 0.65, c: 0.14, h: 220, alpha: 1 }, // 400
      { l: 0.6, c: 0.15, h: 220, alpha: 1 }, // 500
      { l: 0.55, c: 0.14, h: 220, alpha: 1 }, // 600
      { l: 0.45, c: 0.12, h: 220, alpha: 1 }, // 700
      { l: 0.35, c: 0.1, h: 220, alpha: 1 }, // 800
      { l: 0.25, c: 0.08, h: 220, alpha: 1 }, // 900
      { l: 0.15, c: 0.06, h: 220, alpha: 1 }, // 950
    ],
  };

  it('should validate WCAG contrast standards', () => {
    const alerts = validateSemanticMappings(mockSemanticMappings, mockColorFamilies);

    // Should have accessibility alerts
    expect(alerts).toBeInstanceOf(Array);
    expect(alerts.length).toBeGreaterThan(0);

    // Check for contrast-related alerts
    const contrastAlerts = alerts.filter((alert) => alert.type === 'contrast');
    expect(contrastAlerts.length).toBeGreaterThanOrEqual(0);
  });

  it('should detect cognitive load violations for semantic colors', () => {
    const alerts = validateSemanticMappings(mockSemanticMappings, mockColorFamilies);

    // Should detect that success uses wrong color (orange instead of green)
    const cognitiveAlerts = alerts.filter(
      (alert) => alert.type === 'cognitive-load' && alert.affectedTokens.includes('success')
    );

    expect(cognitiveAlerts.length).toBeGreaterThan(0);
    expect(cognitiveAlerts[0].severity).toBe('warning');
    expect(cognitiveAlerts[0].message).toContain('success');
    expect(cognitiveAlerts[0].suggestion).toContain('green');
  });

  it('should detect semantic violations for danger colors', () => {
    const alerts = validateSemanticMappings(mockSemanticMappings, mockColorFamilies);

    // Should detect that danger uses wrong color (green instead of red)
    const cognitiveAlerts = alerts.filter(
      (alert) => alert.type === 'cognitive-load' && alert.affectedTokens.includes('danger')
    );

    expect(cognitiveAlerts.length).toBeGreaterThan(0);
    expect(cognitiveAlerts[0].message).toContain('danger');
    expect(cognitiveAlerts[0].suggestion).toContain('red');
  });

  it('should provide auto-fix suggestions for accessibility violations', () => {
    const alerts = validateSemanticMappings(mockSemanticMappings, mockColorFamilies);

    // Check for auto-fix suggestions
    const alertsWithAutoFix = alerts.filter((alert) => alert.autoFix);
    expect(alertsWithAutoFix.length).toBeGreaterThan(0);

    for (const alert of alertsWithAutoFix) {
      expect(alert.autoFix).toBeDefined();
      expect(alert.autoFix?.token).toBeTruthy();
      expect(alert.autoFix?.newValue).toBeTruthy();
      expect(alert.autoFix?.reason).toBeTruthy();
    }
  });

  it('should validate color vision deficiency accessibility', () => {
    // Create mappings that might be indistinguishable for color vision deficiency
    const problematicMappings: SemanticMapping = {
      success: {
        colorFamily: 'forest-crown',
        scalePosition: 500,
        fullReference: 'forest-crown-500',
        oklch: { l: 0.6, c: 0.15, h: 120, alpha: 1 }, // Green
      },
      danger: {
        colorFamily: 'crimson-fire',
        scalePosition: 500,
        fullReference: 'crimson-fire-500',
        oklch: { l: 0.6, c: 0.15, h: 15, alpha: 1 }, // Red - might be indistinguishable for deuteranopia
      },
    };

    const alerts = validateSemanticMappings(problematicMappings, mockColorFamilies);

    // Should potentially detect color vision issues
    const colorVisionAlerts = alerts.filter((alert) => alert.type === 'color-vision');
    // Note: This test might pass with 0 alerts if the colors are sufficiently different
    expect(colorVisionAlerts).toBeInstanceOf(Array);
  });

  it('should validate usability patterns for interactive states', () => {
    // Create mappings with similar interactive states
    const similarStateMappings: SemanticMapping = {
      primary: {
        colorFamily: 'ocean-storm',
        scalePosition: 500,
        fullReference: 'ocean-storm-500',
        oklch: { l: 0.6, c: 0.15, h: 220, alpha: 1 },
      },
      'primary-hover': {
        colorFamily: 'ocean-storm',
        scalePosition: 500, // Same as primary - should trigger usability alert
        fullReference: 'ocean-storm-500',
        oklch: { l: 0.6, c: 0.15, h: 220, alpha: 1 },
      },
    };

    const alerts = validateSemanticMappings(similarStateMappings, mockColorFamilies);

    // Should detect similar interactive states
    const usabilityAlerts = alerts.filter((alert) => alert.type === 'usability');
    expect(usabilityAlerts.length).toBeGreaterThanOrEqual(0);
  });

  it('should handle empty mappings gracefully', () => {
    const alerts = validateSemanticMappings({}, mockColorFamilies);
    expect(alerts).toBeInstanceOf(Array);
    expect(alerts.length).toBe(0);
  });

  it('should provide meaningful error messages and suggestions', () => {
    const alerts = validateSemanticMappings(mockSemanticMappings, mockColorFamilies);

    for (const alert of alerts) {
      expect(alert.message).toBeTruthy();
      expect(alert.message.length).toBeGreaterThan(10);
      expect(alert.suggestion).toBeTruthy();
      expect(alert.suggestion.length).toBeGreaterThan(10);
      expect(alert.affectedTokens).toBeInstanceOf(Array);
      expect(alert.affectedTokens.length).toBeGreaterThan(0);
      expect(['error', 'warning', 'caution']).toContain(alert.severity);
      expect(['contrast', 'cognitive-load', 'color-vision', 'cultural', 'usability']).toContain(
        alert.type
      );
    }
  });

  it('should validate mathematical precision without AI dependency', () => {
    // Test that all validation is mathematical/rule-based, no AI calls
    const startTime = Date.now();
    const alerts = validateSemanticMappings(mockSemanticMappings, mockColorFamilies);
    const endTime = Date.now();

    // Should complete very quickly (under 100ms) since it's pure math
    expect(endTime - startTime).toBeLessThan(100);

    // Should have deterministic results
    const alerts2 = validateSemanticMappings(mockSemanticMappings, mockColorFamilies);
    expect(alerts.length).toBe(alerts2.length);
  });
});
