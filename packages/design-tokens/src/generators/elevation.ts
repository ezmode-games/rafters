/**
 * Elevation Generator
 *
 * Generates elevation tokens that pair depth (z-index) with shadows.
 * This creates semantic "levels" that components can use for consistent
 * visual hierarchy across the design system.
 *
 * Each elevation level combines:
 * - Z-index (from depth tokens)
 * - Shadow (from shadow tokens)
 * - Semantic meaning for the MCP
 */

import type { Token } from '@rafters/shared';
import type { ResolvedSystemConfig, GeneratorResult } from './types.js';
import { ELEVATION_LEVELS } from './types.js';

/**
 * Elevation definitions
 * Maps semantic levels to depth + shadow pairings
 */
interface ElevationDef {
  depth: string;
  shadow: string;
  meaning: string;
  contexts: string[];
  useCase: string;
}

const ELEVATION_DEFINITIONS: Record<string, ElevationDef> = {
  surface: {
    depth: 'depth-base',
    shadow: 'shadow-none',
    meaning: 'Surface level - flat, in-flow elements',
    contexts: ['page-content', 'inline-elements', 'flat-cards'],
    useCase: 'Default level for content that doesn\'t need elevation',
  },
  raised: {
    depth: 'depth-base',
    shadow: 'shadow-sm',
    meaning: 'Slightly raised - subtle depth without z-index change',
    contexts: ['cards', 'panels', 'list-items'],
    useCase: 'Cards and containers that need subtle visual separation',
  },
  overlay: {
    depth: 'depth-dropdown',
    shadow: 'shadow',
    meaning: 'Overlay level - dropdowns and menus',
    contexts: ['dropdowns', 'select-menus', 'autocomplete', 'context-menus'],
    useCase: 'Elements that appear over content but aren\'t blocking',
  },
  sticky: {
    depth: 'depth-sticky',
    shadow: 'shadow-md',
    meaning: 'Sticky level - persistent navigation',
    contexts: ['sticky-header', 'sticky-sidebar', 'floating-nav'],
    useCase: 'Elements that stick to viewport edges during scroll',
  },
  modal: {
    depth: 'depth-modal',
    shadow: 'shadow-lg',
    meaning: 'Modal level - blocking dialogs',
    contexts: ['modals', 'dialogs', 'sheets', 'drawers'],
    useCase: 'Elements that block interaction with content below',
  },
  popover: {
    depth: 'depth-popover',
    shadow: 'shadow-xl',
    meaning: 'Popover level - above modals',
    contexts: ['popovers', 'nested-dialogs', 'command-palette'],
    useCase: 'Elements that can appear above modals (rare)',
  },
  tooltip: {
    depth: 'depth-tooltip',
    shadow: 'shadow-lg',
    meaning: 'Tooltip level - highest common UI',
    contexts: ['tooltips', 'toast-notifications', 'snackbars'],
    useCase: 'Transient information that appears above everything',
  },
};

/**
 * Generate elevation tokens
 */
export function generateElevationTokens(_config: ResolvedSystemConfig): GeneratorResult {
  const tokens: Token[] = [];
  const timestamp = new Date().toISOString();

  for (const level of ELEVATION_LEVELS) {
    const def = ELEVATION_DEFINITIONS[level]!;
    const scaleIndex = ELEVATION_LEVELS.indexOf(level);

    // Create composite elevation token
    tokens.push({
      name: `elevation-${level}`,
      value: JSON.stringify({
        depth: `var(--${def.depth})`,
        shadow: `var(--${def.shadow})`,
      }),
      category: 'elevation',
      namespace: 'elevation',
      semanticMeaning: def.meaning,
      usageContext: def.contexts,
      scalePosition: scaleIndex,
      elevationLevel: level,
      shadowToken: def.shadow,
      dependsOn: [def.depth, def.shadow],
      description: `${def.useCase}. Combines ${def.depth} with ${def.shadow}.`,
      generatedAt: timestamp,
      containerQueryAware: false,
      usagePatterns: {
        do: [`Use for ${def.contexts.slice(0, 2).join(', ')}`, 'Apply both z-index and shadow together'],
        never: [
          'Mix elevation levels within same component',
          'Use without considering stacking context',
        ],
      },
    });

    // Also create shorthand tokens for direct use
    tokens.push({
      name: `elevation-${level}-z`,
      value: `var(--${def.depth})`,
      category: 'elevation',
      namespace: 'elevation',
      semanticMeaning: `Z-index component of ${level} elevation`,
      dependsOn: [def.depth],
      description: `Z-index for ${level} elevation level.`,
      generatedAt: timestamp,
      containerQueryAware: false,
    });

    tokens.push({
      name: `elevation-${level}-shadow`,
      value: `var(--${def.shadow})`,
      category: 'elevation',
      namespace: 'elevation',
      semanticMeaning: `Shadow component of ${level} elevation`,
      dependsOn: [def.shadow],
      description: `Shadow for ${level} elevation level.`,
      generatedAt: timestamp,
      containerQueryAware: false,
    });
  }

  // Elevation scale reference
  tokens.push({
    name: 'elevation-scale',
    value: JSON.stringify({
      levels: Object.fromEntries(
        Object.entries(ELEVATION_DEFINITIONS).map(([k, v]) => [
          k,
          { depth: v.depth, shadow: v.shadow },
        ])
      ),
      note: 'Each elevation level pairs z-index with appropriate shadow',
    }),
    category: 'elevation',
    namespace: 'elevation',
    semanticMeaning: 'Elevation scale reference',
    description: 'Complete elevation scale showing depth/shadow pairings.',
    generatedAt: timestamp,
    containerQueryAware: false,
  });

  return {
    namespace: 'elevation',
    tokens,
  };
}
