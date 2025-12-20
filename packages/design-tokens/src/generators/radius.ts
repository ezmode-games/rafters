/**
 * Border Radius Generator
 *
 * Generates border radius tokens using mathematical progressions.
 * Uses minor-third (1.2) ratio for harmonious radius scale.
 *
 * This generator is a pure function - it receives radius definitions as input.
 * Default radius values are provided by the orchestrator from defaults.ts.
 */

import { getRatio } from '@rafters/math-utils';
import type { Token } from '@rafters/shared';
import type { RadiusDef } from './defaults.js';
import type { GeneratorResult, ResolvedSystemConfig } from './types.js';
import { RADIUS_SCALE } from './types.js';

/**
 * Generate border radius tokens from provided definitions
 */
export function generateRadiusTokens(
  config: ResolvedSystemConfig,
  radiusDefs: Record<string, RadiusDef>,
): GeneratorResult {
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
    const def = radiusDefs[scale];
    if (!def) continue;
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
