/**
 * Shadow Generator
 *
 * Generates shadow tokens derived from the spacing progression.
 * Uses minor-third (1.2) ratio for harmonious shadow scale.
 *
 * Shadow blur and spread values follow the spacing scale,
 * creating visual consistency between spacing and depth.
 */

import type { Token } from '@rafters/shared';
import { getRatio } from '@rafters/math-utils';
import type { ResolvedSystemConfig, GeneratorResult } from './types.js';
import { SHADOW_SCALE } from './types.js';

/**
 * Shadow definitions
 * Each shadow level uses spacing-derived values for consistency
 *
 * Format: y-offset, blur, spread, color opacity
 * All derived from base spacing unit using minor-third progression
 */
interface ShadowDef {
  /** Y offset multiplier of base spacing */
  yOffset: number;
  /** Blur radius multiplier of base spacing */
  blur: number;
  /** Spread radius multiplier of base spacing */
  spread: number;
  /** Color opacity (0-1) */
  opacity: number;
  /** Additional inner shadow for depth */
  innerShadow?: {
    yOffset: number;
    blur: number;
    spread: number;
    opacity: number;
  };
  meaning: string;
  contexts: string[];
}

const SHADOW_DEFINITIONS: Record<string, ShadowDef> = {
  none: {
    yOffset: 0,
    blur: 0,
    spread: 0,
    opacity: 0,
    meaning: 'No shadow - flat appearance',
    contexts: ['flat-elements', 'inline', 'disabled'],
  },
  xs: {
    yOffset: 0.25,
    blur: 0.5,
    spread: 0,
    opacity: 0.05,
    meaning: 'Extra small shadow - subtle depth hint',
    contexts: ['subtle-cards', 'list-items', 'hover-states'],
  },
  sm: {
    yOffset: 0.25,
    blur: 1,
    spread: 0,
    opacity: 0.06,
    innerShadow: {
      yOffset: 0.25,
      blur: 0.5,
      spread: 0,
      opacity: 0.1,
    },
    meaning: 'Small shadow - slight elevation',
    contexts: ['cards', 'buttons', 'inputs'],
  },
  DEFAULT: {
    yOffset: 0.5,
    blur: 1.5,
    spread: -0.25,
    opacity: 0.1,
    innerShadow: {
      yOffset: 0.25,
      blur: 0.5,
      spread: 0,
      opacity: 0.1,
    },
    meaning: 'Default shadow - standard elevation',
    contexts: ['cards', 'dropdowns', 'floating-elements'],
  },
  md: {
    yOffset: 1,
    blur: 2,
    spread: -0.5,
    opacity: 0.1,
    innerShadow: {
      yOffset: 0.5,
      blur: 1,
      spread: -0.25,
      opacity: 0.1,
    },
    meaning: 'Medium shadow - noticeable elevation',
    contexts: ['hovering-cards', 'active-elements', 'focus-states'],
  },
  lg: {
    yOffset: 2,
    blur: 4,
    spread: -0.75,
    opacity: 0.1,
    innerShadow: {
      yOffset: 1,
      blur: 2,
      spread: -0.5,
      opacity: 0.1,
    },
    meaning: 'Large shadow - significant elevation',
    contexts: ['modals', 'dialogs', 'floating-panels'],
  },
  xl: {
    yOffset: 5,
    blur: 6,
    spread: -1,
    opacity: 0.1,
    innerShadow: {
      yOffset: 2,
      blur: 4,
      spread: -0.75,
      opacity: 0.1,
    },
    meaning: 'Extra large shadow - high elevation',
    contexts: ['large-modals', 'sheet-dialogs', 'command-palettes'],
  },
  '2xl': {
    yOffset: 6,
    blur: 12,
    spread: -2,
    opacity: 0.25,
    meaning: 'Maximum shadow - highest elevation',
    contexts: ['critical-modals', 'overlays', 'drawer-panels'],
  },
};

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

  shadows.push(
    `0 ${yOffset}px ${blur}px ${spread}px rgb(0 0 0 / ${def.opacity})`
  );

  // Inner shadow for more depth if defined
  if (def.innerShadow) {
    const innerY = Math.round(def.innerShadow.yOffset * baseSpacing * 100) / 100;
    const innerBlur = Math.round(def.innerShadow.blur * baseSpacing * 100) / 100;
    const innerSpread = Math.round(def.innerShadow.spread * baseSpacing * 100) / 100;

    shadows.push(
      `0 ${innerY}px ${innerBlur}px ${innerSpread}px rgb(0 0 0 / ${def.innerShadow.opacity})`
    );
  }

  return shadows.join(', ');
}

/**
 * Generate shadow tokens
 */
export function generateShadowTokens(config: ResolvedSystemConfig): GeneratorResult {
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
    const def = SHADOW_DEFINITIONS[scale]!;
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
            : ['Use shadows that don\'t match element\'s semantic depth'],
      },
    });
  }

  // Add colored shadow variant tokens
  const coloredShadows = [
    { name: 'shadow-primary', desc: 'Primary colored shadow for emphasis', color: 'var(--primary)', opacity: 0.2 },
    { name: 'shadow-destructive', desc: 'Destructive colored shadow for warnings', color: 'var(--destructive)', opacity: 0.2 },
  ];

  for (const { name, desc, color, opacity } of coloredShadows) {
    const baseDef = SHADOW_DEFINITIONS['DEFAULT']!;
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
