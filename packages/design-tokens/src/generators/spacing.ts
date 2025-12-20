/**
 * Spacing Generator
 *
 * Generates spacing tokens using mathematical progressions from @rafters/math-utils.
 * Default uses minor-third (1.2) ratio for harmonious, connected feel.
 *
 * Spacing is the foundation that motion, shadows, and other derived values build upon.
 */

import type { Token } from '@rafters/shared';
import { generateProgression, getRatio } from '@rafters/math-utils';
import type { ResolvedSystemConfig, GeneratorResult } from './types.js';
import { SPACING_SCALE } from './types.js';

/**
 * Spacing scale multipliers for Tailwind-compatible output
 * Maps scale names to their multiplier of the base unit
 *
 * The progression uses minor-third (1.2) ratio for values above 4,
 * while maintaining Tailwind's established small values for compatibility.
 */
const SPACING_MULTIPLIERS: Record<string, number> = {
  '0': 0,
  '0.5': 0.5,
  '1': 1,
  '1.5': 1.5,
  '2': 2,
  '2.5': 2.5,
  '3': 3,
  '3.5': 3.5,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  '11': 11,
  '12': 12,
  '14': 14,
  '16': 16,
  '20': 20,
  '24': 24,
  '28': 28,
  '32': 32,
  '36': 36,
  '40': 40,
  '44': 44,
  '48': 48,
  '52': 52,
  '56': 56,
  '60': 60,
  '64': 64,
  '72': 72,
  '80': 80,
  '96': 96,
};

/**
 * Generate spacing tokens
 */
export function generateSpacingTokens(config: ResolvedSystemConfig): GeneratorResult {
  const tokens: Token[] = [];
  const timestamp = new Date().toISOString();
  const { baseSpacingUnit, progressionRatio } = config;

  // Get the actual ratio value for reference
  const ratioValue = getRatio(progressionRatio);

  // Generate the progression for reference (used in documentation)
  const progression = generateProgression(progressionRatio as 'minor-third', {
    baseValue: baseSpacingUnit,
    steps: 10,
    includeZero: true,
  });

  // Base unit token - the foundation everything else derives from
  tokens.push({
    name: 'spacing-base',
    value: `${baseSpacingUnit}px`,
    category: 'spacing',
    namespace: 'spacing',
    semanticMeaning: 'Foundation spacing unit - all spacing derives from this value',
    usageContext: ['base-unit', 'calculation-reference'],
    progressionSystem: progressionRatio as 'minor-third',
    description: `Base spacing unit (${baseSpacingUnit}px). Multiply by scale values for actual spacing.`,
    generatedAt: timestamp,
    containerQueryAware: true,
    usagePatterns: {
      do: [
        'Reference in calculations for consistent spacing',
        'Use as the multiplier base for custom spacing',
      ],
      never: [
        'Use directly in components without scaling',
        'Override without understanding the ripple effects',
      ],
    },
  });

  // Generate tokens for each scale position
  for (const scale of SPACING_SCALE) {
    const multiplier = SPACING_MULTIPLIERS[scale]!;
    const value = baseSpacingUnit * multiplier;
    const scaleIndex = SPACING_SCALE.indexOf(scale);

    // Determine semantic meaning based on value
    let meaning: string;
    let usageContext: string[];

    if (multiplier === 0) {
      meaning = 'Zero spacing - remove all spacing';
      usageContext = ['reset', 'collapse'];
    } else if (multiplier <= 1) {
      meaning = 'Micro spacing for tight layouts and inline elements';
      usageContext = ['inline-spacing', 'icon-gaps', 'tight-layouts'];
    } else if (multiplier <= 4) {
      meaning = 'Small spacing for component internals and related elements';
      usageContext = ['component-padding', 'related-elements', 'form-fields'];
    } else if (multiplier <= 12) {
      meaning = 'Medium spacing for section separation and breathing room';
      usageContext = ['section-padding', 'card-padding', 'list-gaps'];
    } else if (multiplier <= 32) {
      meaning = 'Large spacing for major section breaks and layout gaps';
      usageContext = ['layout-gaps', 'section-margins', 'page-padding'];
    } else {
      meaning = 'Extra large spacing for page-level layout and hero sections';
      usageContext = ['hero-spacing', 'page-margins', 'major-sections'];
    }

    tokens.push({
      name: `spacing-${scale}`,
      value: value === 0 ? '0' : `${value}px`,
      category: 'spacing',
      namespace: 'spacing',
      semanticMeaning: meaning,
      usageContext,
      scalePosition: scaleIndex,
      progressionSystem: progressionRatio as 'minor-third',
      mathRelationship: `${baseSpacingUnit} * ${multiplier}`,
      dependsOn: ['spacing-base'],
      generationRule: `calc({spacing-base} * ${multiplier})`,
      description: `Spacing at scale ${scale} = ${value}px (${baseSpacingUnit}px × ${multiplier})`,
      generatedAt: timestamp,
      containerQueryAware: true,
    });
  }

  // Add progression metadata token for reference
  tokens.push({
    name: 'spacing-progression',
    value: JSON.stringify({
      ratio: progressionRatio,
      ratioValue,
      baseUnit: baseSpacingUnit,
      sample: progression.map((v) => Math.round(v * 100) / 100),
    }),
    category: 'spacing',
    namespace: 'spacing',
    semanticMeaning: 'Metadata about the spacing progression system',
    description: `Spacing uses ${progressionRatio} progression (ratio ${ratioValue}) from base ${baseSpacingUnit}px. Sample values: ${progression.slice(0, 5).map((v) => Math.round(v)).join(', ')}...`,
    generatedAt: timestamp,
    containerQueryAware: false,
    usagePatterns: {
      do: [
        'Reference when adding custom spacing values',
        'Use ratio for deriving new consistent values',
      ],
      never: ['Use raw values in production CSS'],
    },
  });

  return {
    namespace: 'spacing',
    tokens,
  };
}
