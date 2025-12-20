/**
 * Shadow Generator
 *
 * Generates shadow tokens derived from the spacing progression.
 * Uses minor-third (1.2) ratio for harmonious shadow scale.
 *
 * This generator is a pure function - it receives shadow definitions as input.
 * Default shadow values are provided by the orchestrator from defaults.ts.
 */

import { getRatio } from '@rafters/math-utils';
import type { Token } from '@rafters/shared';
import type { ShadowDef } from './defaults.js';
import type { GeneratorResult, ResolvedSystemConfig } from './types.js';
import { SHADOW_SCALE } from './types.js';

/**
 * Generate shadow CSS value from definition
 */
function generateShadowValue(def: ShadowDef, baseSpacing: number): string {
  if (def.opacity === 0) {
    return 'none';
  }

  const shadows: string[] = [];

  // Primary shadow
  const yOffset = Math.round(def.yOffset * baseSpacing * 100) / 100;
  const blur = Math.round(def.blur * baseSpacing * 100) / 100;
  const spread = Math.round(def.spread * baseSpacing * 100) / 100;

  shadows.push(`0 ${yOffset}px ${blur}px ${spread}px rgb(0 0 0 / ${def.opacity})`);

  // Inner shadow for more depth if defined
  if (def.innerShadow) {
    const innerY = Math.round(def.innerShadow.yOffset * baseSpacing * 100) / 100;
    const innerBlur = Math.round(def.innerShadow.blur * baseSpacing * 100) / 100;
    const innerSpread = Math.round(def.innerShadow.spread * baseSpacing * 100) / 100;

    shadows.push(
      `0 ${innerY}px ${innerBlur}px ${innerSpread}px rgb(0 0 0 / ${def.innerShadow.opacity})`,
    );
  }

  return shadows.join(', ');
}

/**
 * Generate shadow tokens from provided definitions
 */
export function generateShadowTokens(
  config: ResolvedSystemConfig,
  shadowDefs: Record<string, ShadowDef>,
): GeneratorResult {
  const tokens: Token[] = [];
  const timestamp = new Date().toISOString();
  const { baseSpacingUnit, progressionRatio } = config;
  const ratioValue = getRatio(progressionRatio);

  // Shadow reference token
  tokens.push({
    name: 'shadow-base-unit',
    value: `${baseSpacingUnit}px`,
    category: 'shadow',
    namespace: 'shadow',
    semanticMeaning: 'Base unit for shadow calculations - tied to spacing for consistency',
    usageContext: ['calculation-reference'],
    progressionSystem: progressionRatio as 'minor-third',
    dependsOn: ['spacing-base'],
    description: `Shadows derive from spacing base (${baseSpacingUnit}px) for visual consistency.`,
    generatedAt: timestamp,
    containerQueryAware: false,
  });

  // Generate tokens for each shadow level
  for (const scale of SHADOW_SCALE) {
    const def = shadowDefs[scale];
    if (!def) continue;
    const scaleIndex = SHADOW_SCALE.indexOf(scale);
    const value = generateShadowValue(def, baseSpacingUnit);

    tokens.push({
      name: scale === 'DEFAULT' ? 'shadow' : `shadow-${scale}`,
      value,
      category: 'shadow',
      namespace: 'shadow',
      semanticMeaning: def.meaning,
      usageContext: def.contexts,
      scalePosition: scaleIndex,
      progressionSystem: progressionRatio as 'minor-third',
      dependsOn: scale === 'none' ? [] : ['shadow-base-unit'],
      description: `Shadow ${scale}: ${def.meaning}. Y: ${def.yOffset}×base, Blur: ${def.blur}×base`,
      generatedAt: timestamp,
      containerQueryAware: false,
      usagePatterns: {
        do:
          scale === 'none'
            ? ['Use for flat elements', 'Use for disabled states']
            : scaleIndex <= 2
              ? ['Use for subtle depth', 'Use for cards at rest']
              : scaleIndex <= 4
                ? ['Use for hovering elements', 'Use for focus states']
                : ['Use for floating elements', 'Use for modals'],
        never:
          scale === 'none'
            ? ['Use on interactive elements that need depth feedback']
            : ["Use shadows that don't match element's semantic depth"],
      },
    });
  }

  // Add colored shadow variant tokens
  const coloredShadows = [
    {
      name: 'shadow-primary',
      desc: 'Primary colored shadow for emphasis',
      color: 'var(--primary)',
      opacity: 0.2,
    },
    {
      name: 'shadow-destructive',
      desc: 'Destructive colored shadow for warnings',
      color: 'var(--destructive)',
      opacity: 0.2,
    },
  ];

  for (const { name, desc, color, opacity } of coloredShadows) {
    const baseDef = shadowDefs.DEFAULT;
    if (!baseDef) continue;
    const yOffset = Math.round(baseDef.yOffset * baseSpacingUnit * 100) / 100;
    const blur = Math.round(baseDef.blur * baseSpacingUnit * 100) / 100;
    const spread = Math.round(baseDef.spread * baseSpacingUnit * 100) / 100;

    tokens.push({
      name,
      value: `0 ${yOffset}px ${blur}px ${spread}px color-mix(in oklch, ${color} ${opacity * 100}%, transparent)`,
      category: 'shadow',
      namespace: 'shadow',
      semanticMeaning: desc,
      usageContext: ['branded-elements', 'emphasis'],
      dependsOn: ['shadow', color.replace('var(--', '').replace(')', '')],
      description: `${desc}. Uses color-mix for proper OKLCH blending.`,
      generatedAt: timestamp,
      containerQueryAware: false,
    });
  }

  // Progression metadata
  tokens.push({
    name: 'shadow-progression',
    value: JSON.stringify({
      ratio: progressionRatio,
      ratioValue,
      baseUnit: baseSpacingUnit,
      note: 'Shadow values derived from spacing progression for visual harmony',
    }),
    category: 'shadow',
    namespace: 'shadow',
    semanticMeaning: 'Metadata about the shadow progression system',
    description: `Shadows use ${progressionRatio} progression from spacing base.`,
    generatedAt: timestamp,
    containerQueryAware: false,
  });

  return {
    namespace: 'shadow',
    tokens,
  };
}
