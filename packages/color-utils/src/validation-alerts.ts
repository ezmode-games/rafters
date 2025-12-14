/**
 * Semantic Mapping Validation System
 *
 * Pure mathematical validation of user semantic assignments
 * No AI needed - uses WCAG standards, color theory, and UX principles
 */

import type { OKLCH } from '@rafters/shared';
import { calculateWCAGContrast } from './accessibility';

/**
 * Accessibility alert severity and types
 */
export interface AccessibilityAlert {
  severity: 'error' | 'warning' | 'caution';
  type: 'contrast' | 'cognitive-load' | 'color-vision' | 'cultural' | 'usability';
  message: string;
  suggestion: string;
  affectedTokens: string[];
  autoFix?: {
    token: string;
    newValue: string; // Color family + scale position
    reason: string;
  };
}

/**
 * User's semantic assignments from Studio right-click
 */
export interface SemanticMapping {
  [semanticToken: string]: {
    colorFamily: string; // "ocean-storm"
    scalePosition: number; // 800 (index in 50-950 scale)
    fullReference: string; // "ocean-storm-800"
    oklch: OKLCH; // Actual color value
  };
}

/**
 * Validate semantic mappings with mathematical precision
 * Returns array of accessibility alerts and suggestions
 */
export function validateSemanticMappings(
  mappings: SemanticMapping,
  _colorFamilies: Record<string, OKLCH[]>,
): AccessibilityAlert[] {
  const alerts: AccessibilityAlert[] = [];

  // 1. Contrast validation (WCAG mathematical standards)
  alerts.push(...validateContrastStandards(mappings));

  // 2. Cognitive load validation (color psychology principles)
  alerts.push(...validateCognitiveLoad(mappings));

  // 3. Usability patterns (interaction design principles)
  alerts.push(...validateUsabilityPatterns(mappings));

  // 4. Color vision accessibility (mathematical simulation)
  alerts.push(...validateColorVisionDeficiency(mappings));

  return alerts;
}

/**
 * Validate WCAG contrast standards between semantic token pairs
 */
function validateContrastStandards(mappings: SemanticMapping): AccessibilityAlert[] {
  const alerts: AccessibilityAlert[] = [];

  // Common background-foreground pairs
  const contrastPairs = [
    { bg: 'background', fg: 'foreground', minRatio: 4.5 },
    { bg: 'primary', fg: 'primary-foreground', minRatio: 4.5 },
    { bg: 'success', fg: 'success-foreground', minRatio: 4.5 },
    { bg: 'warning', fg: 'warning-foreground', minRatio: 4.5 },
    { bg: 'danger', fg: 'danger-foreground', minRatio: 4.5 },
    { bg: 'background', fg: 'border', minRatio: 3.0 }, // Lower standard for borders
  ];

  for (const pair of contrastPairs) {
    const bgMapping = mappings[pair.bg];
    const fgMapping = mappings[pair.fg];

    if (bgMapping && fgMapping) {
      const contrast = calculateWCAGContrast(fgMapping.oklch, bgMapping.oklch);

      if (contrast < pair.minRatio) {
        const severity = contrast < 3.0 ? 'error' : 'warning';
        alerts.push({
          severity,
          type: 'contrast',
          message: `${pair.fg} on ${pair.bg} has ${contrast.toFixed(1)}:1 contrast (needs ${pair.minRatio}:1)`,
          suggestion: `Use a darker color for ${pair.fg} or lighter for ${pair.bg}`,
          affectedTokens: [pair.bg, pair.fg],
          autoFix: generateContrastFix(bgMapping, fgMapping, pair.minRatio),
        });
      }
    }
  }

  return alerts;
}

/**
 * Validate cognitive load based on color psychology principles
 */
function validateCognitiveLoad(mappings: SemanticMapping): AccessibilityAlert[] {
  const alerts: AccessibilityAlert[] = [];

  // Semantic color expectations (mathematical hue ranges)
  const semanticExpectations = {
    success: { expectedHues: [120, 150], name: 'green' },
    warning: { expectedHues: [45, 75], name: 'orange/yellow' },
    danger: { expectedHues: [0, 30], name: 'red' },
    info: { expectedHues: [200, 240], name: 'blue' },
  };

  for (const [semantic, expectation] of Object.entries(semanticExpectations)) {
    const mapping = mappings[semantic];
    if (mapping) {
      const hue = mapping.oklch.h;
      const isInExpectedRange = expectation.expectedHues.some(
        (expectedHue) => Math.abs(hue - expectedHue) <= 30, // 30 degree tolerance
      );

      if (!isInExpectedRange) {
        alerts.push({
          severity: 'warning',
          type: 'cognitive-load',
          message: `${semantic} uses color - users typically expect ${expectation.name}`,
          suggestion: `Consider using a ${expectation.name} color for conventional ${semantic} indication`,
          affectedTokens: [semantic],
          autoFix: {
            token: semantic,
            newValue: generateSemanticColorSuggestion(semantic, expectation),
            reason: `Conventional ${expectation.name} reduces cognitive load`,
          },
        });
      }
    }
  }

  return alerts;
}

/**
 * Validate usability interaction patterns
 */
function validateUsabilityPatterns(mappings: SemanticMapping): AccessibilityAlert[] {
  const alerts: AccessibilityAlert[] = [];

  // Interactive state progressions should be visually distinct
  const stateProgressions = [
    ['primary', 'primary-hover', 'primary-focus', 'primary-active'],
    ['success', 'success-hover'],
    ['warning', 'warning-hover'],
    ['danger', 'danger-hover'],
  ];

  for (const progression of stateProgressions) {
    const mappedColors = progression.map((token) => mappings[token]).filter(Boolean);

    // Check for identical states (no visual feedback)
    for (let i = 0; i < mappedColors.length - 1; i++) {
      const current = mappedColors[i];
      const next = mappedColors[i + 1];

      if (current && next && colorsAreTooSimilar(current.oklch, next.oklch)) {
        const currentToken = progression[i];
        const nextToken = progression[i + 1];

        if (currentToken && nextToken) {
          alerts.push({
            severity: 'caution',
            type: 'usability',
            message: `${currentToken} and ${nextToken} are too similar - users won't see interaction feedback`,
            suggestion: `Make ${nextToken} noticeably different from ${currentToken}`,
            affectedTokens: [currentToken, nextToken],
            autoFix: {
              token: nextToken,
              newValue: generateDistinctStateColor(current, next),
              reason: 'Provide clear visual feedback for interaction states',
            },
          });
        }
      }
    }
  }

  return alerts;
}

/**
 * Validate color vision deficiency accessibility
 */
function validateColorVisionDeficiency(mappings: SemanticMapping): AccessibilityAlert[] {
  const alerts: AccessibilityAlert[] = [];

  // Check critical semantic pairs that must remain distinguishable
  const criticalPairs = [
    ['success', 'danger'],
    ['warning', 'danger'],
    ['primary', 'success'],
    ['info', 'primary'],
  ];

  for (const pair of criticalPairs) {
    const [token1, token2] = pair;
    if (!token1 || !token2) continue;

    const mapping1 = mappings[token1];
    const mapping2 = mappings[token2];

    if (mapping1 && mapping2) {
      // Simulate deuteranopia (most common color vision deficiency)
      const sim1 = simulateDeuteranopia(mapping1.oklch);
      const sim2 = simulateDeuteranopia(mapping2.oklch);

      if (colorsAreTooSimilar(sim1, sim2)) {
        alerts.push({
          severity: 'warning',
          type: 'color-vision',
          message: `${token1} and ${token2} become indistinguishable for red-green color vision deficiency`,
          suggestion: `Increase lightness or chroma difference between ${token1} and ${token2}`,
          affectedTokens: [token1, token2],
          autoFix: {
            token: token2,
            newValue: generateColorBlindAccessibleAlternative(mapping1.oklch, mapping2.oklch),
            reason: 'Ensure accessibility for red-green color vision deficiency',
          },
        });
      }
    }
  }

  return alerts;
}

/**
 * Helper: Check if two colors are too similar for user perception
 */
function colorsAreTooSimilar(color1: OKLCH, color2: OKLCH): boolean {
  // Delta E calculation for perceptual difference
  const deltaL = Math.abs(color1.l - color2.l);
  const deltaC = Math.abs(color1.c - color2.c);
  const deltaH = Math.abs(color1.h - color2.h);

  // Simplified Delta E - colors are too similar if all deltas are small
  return deltaL < 0.05 && deltaC < 0.02 && deltaH < 10;
}

/**
 * Helper: Simple deuteranopia simulation
 */
function simulateDeuteranopia(oklch: OKLCH): OKLCH {
  // Simplified simulation - shift red/green hues toward yellow/blue
  let adjustedHue = oklch.h;

  if (oklch.h >= 90 && oklch.h <= 150) {
    // Green range -> shift toward yellow
    adjustedHue = 60;
  } else if (oklch.h >= 330 || oklch.h <= 30) {
    // Red range -> shift toward yellow
    adjustedHue = 60;
  }

  return { ...oklch, h: adjustedHue };
}

/**
 * Helper: Generate contrast fix suggestion
 */
function generateContrastFix(
  _bgMapping: SemanticMapping[string],
  fgMapping: SemanticMapping[string],
  targetRatio: number,
) {
  // Suggest making foreground darker for better contrast
  const newScalePosition = Math.min(950, fgMapping.scalePosition + 200);

  return {
    token: `${fgMapping.fullReference.split('-')[0]}-foreground`,
    newValue: `${fgMapping.colorFamily}-${newScalePosition}`,
    reason: `Achieve ${targetRatio}:1 contrast ratio for WCAG compliance`,
  };
}

/**
 * Helper: Generate semantic color suggestion
 */
function generateSemanticColorSuggestion(
  semantic: string,
  _expectation: { expectedHues: number[]; name: string },
): string {
  // Return conventional color family name for this semantic
  const conventionalColors = {
    success: 'forest-crown-500',
    warning: 'sunset-flame-500',
    danger: 'crimson-fire-500',
    info: 'ocean-storm-500',
  };

  return conventionalColors[semantic as keyof typeof conventionalColors] || 'neutral-500';
}

/**
 * Helper: Generate distinct state color
 */
function generateDistinctStateColor(
  current: SemanticMapping[string],
  _next: SemanticMapping[string],
): string {
  // Make hover state noticeably darker
  const newScalePosition = Math.min(950, current.scalePosition + 100);
  return `${current.colorFamily}-${newScalePosition}`;
}

/**
 * Helper: Generate color blind accessible alternative
 */
function generateColorBlindAccessibleAlternative(_color1: OKLCH, _color2: OKLCH): string {
  // Suggest increasing lightness difference for accessibility
  return 'neutral-700'; // Simplified - would be more sophisticated in real implementation
}
