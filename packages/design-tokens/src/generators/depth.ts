/**
 * Depth Generator
 *
 * Generates z-index tokens for stacking context management.
 * Uses a semantic naming system rather than arbitrary numbers.
 *
 * Each level has a clear purpose and enough gaps between values
 * to allow for intermediate layers when needed.
 */

import type { Token } from '@rafters/shared';
import type { ResolvedSystemConfig, GeneratorResult } from './types.js';
import { DEPTH_LEVELS } from './types.js';

/**
 * Depth level definitions
 * Values have 10-unit gaps for insertion flexibility
 */
interface DepthDef {
  value: number;
  meaning: string;
  contexts: string[];
  stackingContext: boolean;
}

const DEPTH_DEFINITIONS: Record<string, DepthDef> = {
  base: {
    value: 0,
    meaning: 'Base layer - document flow elements',
    contexts: ['regular-content', 'in-flow-elements'],
    stackingContext: false,
  },
  dropdown: {
    value: 10,
    meaning: 'Dropdown menus and select options',
    contexts: ['dropdowns', 'select-menus', 'autocomplete'],
    stackingContext: true,
  },
  sticky: {
    value: 20,
    meaning: 'Sticky elements - headers, navigation',
    contexts: ['sticky-header', 'sticky-nav', 'floating-actions'],
    stackingContext: true,
  },
  fixed: {
    value: 30,
    meaning: 'Fixed elements - always visible',
    contexts: ['fixed-header', 'fixed-footer', 'fab-buttons'],
    stackingContext: true,
  },
  modal: {
    value: 40,
    meaning: 'Modal dialogs - blocking overlays',
    contexts: ['modals', 'dialogs', 'sheets'],
    stackingContext: true,
  },
  popover: {
    value: 50,
    meaning: 'Popovers above modals',
    contexts: ['popovers', 'nested-menus', 'command-palette'],
    stackingContext: true,
  },
  tooltip: {
    value: 60,
    meaning: 'Tooltips - highest common layer',
    contexts: ['tooltips', 'toast-notifications'],
    stackingContext: true,
  },
};

/**
 * Generate depth (z-index) tokens
 */
export function generateDepthTokens(_config: ResolvedSystemConfig): GeneratorResult {
  const tokens: Token[] = [];
  const timestamp = new Date().toISOString();

  for (const level of DEPTH_LEVELS) {
    const def = DEPTH_DEFINITIONS[level]!;
    const scaleIndex = DEPTH_LEVELS.indexOf(level);

    tokens.push({
      name: `depth-${level}`,
      value: String(def.value),
      category: 'depth',
      namespace: 'depth',
      semanticMeaning: def.meaning,
      usageContext: def.contexts,
      scalePosition: scaleIndex,
      description: `Z-index ${def.value} for ${level} layer. ${def.stackingContext ? 'Creates new stacking context.' : 'In document flow.'}`,
      generatedAt: timestamp,
      containerQueryAware: false,
      usagePatterns: {
        do:
          level === 'base'
            ? ['Let elements flow naturally', 'Avoid z-index unless needed']
            : ['Use for ' + def.contexts.join(', '), 'Ensure proper isolation'],
        never: [
          'Use arbitrary z-index values',
          'Create z-index battles between components',
          'Skip levels without good reason',
        ],
      },
    });
  }

  // Add special depth tokens
  tokens.push({
    name: 'depth-below',
    value: '-1',
    category: 'depth',
    namespace: 'depth',
    semanticMeaning: 'Below base layer - backgrounds, decorative elements',
    usageContext: ['background-decorations', 'behind-content'],
    description: 'Z-index -1 for elements that should appear behind base content.',
    generatedAt: timestamp,
    containerQueryAware: false,
    usagePatterns: {
      do: ['Use for decorative backgrounds', 'Use for pseudo-element layers'],
      never: ['Use for interactive elements', 'Rely on for critical content'],
    },
  });

  tokens.push({
    name: 'depth-max',
    value: '9999',
    category: 'depth',
    namespace: 'depth',
    semanticMeaning: 'Maximum layer - emergency overlay (e.g., dev tools)',
    usageContext: ['debug-overlays', 'emergency-ui'],
    description: 'Maximum z-index 9999 for special cases only.',
    generatedAt: timestamp,
    containerQueryAware: false,
    usagePatterns: {
      do: ['Use only for dev/debug tools', 'Document why this is needed'],
      never: [
        'Use in production UI',
        'Use to "win" z-index conflicts',
        'Use without questioning if the architecture is wrong',
      ],
    },
  });

  // Reference token for intermediate values
  tokens.push({
    name: 'depth-scale',
    value: JSON.stringify({
      gap: 10,
      note: 'Each level has 10-unit gaps for intermediate values',
      levels: Object.fromEntries(
        Object.entries(DEPTH_DEFINITIONS).map(([k, v]) => [k, v.value])
      ),
    }),
    category: 'depth',
    namespace: 'depth',
    semanticMeaning: 'Depth scale reference',
    description: 'Reference for z-index scale structure. 10-unit gaps allow intermediate values.',
    generatedAt: timestamp,
    containerQueryAware: false,
  });

  return {
    namespace: 'depth',
    tokens,
  };
}
