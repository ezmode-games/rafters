/**
 * Border Radius Generator
 *
 * Generates border radius tokens using mathematical progressions.
 * Uses minor-third (1.2) ratio for harmonious radius scale.
 *
 * Base radius of 6px matches shadcn aesthetic.
 */

import type { Token } from '@rafters/shared';
import { getRatio } from '@rafters/math-utils';
import type { ResolvedSystemConfig, GeneratorResult } from './types.js';
import { RADIUS_SCALE } from './types.js';

/**
 * Radius scale multipliers
 * Follows a progression from the base radius
 */
const RADIUS_VALUES: Record<string, { multiplier: number | 'full' | 'none'; meaning: string; contexts: string[] }> = {
  none: {
    multiplier: 'none',
    meaning: 'No border radius - sharp corners',
    contexts: ['sharp-corners', 'table-cells', 'inline-elements'],
  },
  sm: {
    multiplier: 0.5,
    meaning: 'Small radius for subtle rounding',
    contexts: ['badges', 'tags', 'small-elements', 'inline-blocks'],
  },
  DEFAULT: {
    multiplier: 1,
    meaning: 'Default radius - primary UI elements',
    contexts: ['buttons', 'inputs', 'cards', 'dropdowns'],
  },
  md: {
    multiplier: 1.2, // Minor third step up
    meaning: 'Medium radius for containers',
    contexts: ['cards', 'panels', 'dialogs'],
  },
  lg: {
    multiplier: 1.44, // Two minor third steps
    meaning: 'Large radius for prominent containers',
    contexts: ['modals', 'large-cards', 'feature-panels'],
  },
  xl: {
    multiplier: 1.728, // Three minor third steps
    meaning: 'Extra large radius for emphasized elements',
    contexts: ['hero-cards', 'featured-sections'],
  },
  '2xl': {
    multiplier: 2.074, // Four minor third steps
    meaning: 'Maximum meaningful radius',
    contexts: ['pills', 'large-avatars', 'emphasized-buttons'],
  },
  '3xl': {
    multiplier: 2.488, // Five minor third steps
    meaning: 'Very large radius for special cases',
    contexts: ['stadium-shapes', 'special-emphasis'],
  },
  full: {
    multiplier: 'full',
    meaning: 'Fully rounded - circles and pills',
    contexts: ['avatars', 'pill-buttons', 'circular-elements'],
  },
};

/**
 * Generate border radius tokens
 */
export function generateRadiusTokens(config: ResolvedSystemConfig): GeneratorResult {
  const tokens: Token[] = [];
  const timestamp = new Date().toISOString();
  const { baseRadius, progressionRatio } = config;
  const ratioValue = getRatio(progressionRatio);

  // Base radius token
  tokens.push({
    name: 'radius-base',
    value: `${baseRadius}px`,
    category: 'radius',
    namespace: 'radius',
    semanticMeaning: 'Base border radius - all other radii derive from this value',
    usageContext: ['calculation-reference'],
    progressionSystem: progressionRatio as 'minor-third',
    description: `Base radius (${baseRadius}px). Scale uses ${progressionRatio} progression (${ratioValue}).`,
    generatedAt: timestamp,
    containerQueryAware: false,
    usagePatterns: {
      do: ['Reference as the calculation base'],
      never: ['Change without understanding scale impact'],
    },
  });

  // Generate tokens for each scale position
  for (const scale of RADIUS_SCALE) {
    const def = RADIUS_VALUES[scale]!;
    const scaleIndex = RADIUS_SCALE.indexOf(scale);
    let value: string;
    let mathRelationship: string;

    if (def.multiplier === 'none') {
      value = '0';
      mathRelationship = '0';
    } else if (def.multiplier === 'full') {
      value = '9999px';
      mathRelationship = 'infinite (9999px)';
    } else {
      const computed = Math.round(baseRadius * def.multiplier * 100) / 100;
      value = `${computed}px`;
      mathRelationship = `${baseRadius} × ${def.multiplier}`;
    }

    tokens.push({
      name: scale === 'DEFAULT' ? 'radius' : `radius-${scale}`,
      value,
      category: 'radius',
      namespace: 'radius',
      semanticMeaning: def.meaning,
      usageContext: def.contexts,
      scalePosition: scaleIndex,
      progressionSystem: progressionRatio as 'minor-third',
      mathRelationship,
      dependsOn: def.multiplier === 'none' || def.multiplier === 'full' ? [] : ['radius-base'],
      description: `Border radius ${scale}: ${value} (${mathRelationship})`,
      generatedAt: timestamp,
      containerQueryAware: false,
    });
  }

  return {
    namespace: 'radius',
    tokens,
  };
}
