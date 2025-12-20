/**
 * Breakpoint Generator
 *
 * Generates responsive breakpoint tokens for Tailwind v4 compatibility.
 * Uses container queries as the default (containerQueryAware: true).
 *
 * Breakpoints follow common device patterns while remaining flexible
 * for custom container-based layouts.
 */

import type { Token } from '@rafters/shared';
import type { ResolvedSystemConfig, GeneratorResult } from './types.js';
import { BREAKPOINT_SCALE } from './types.js';

/**
 * Breakpoint definitions
 * Values match Tailwind's default breakpoints for compatibility
 */
interface BreakpointDef {
  minWidth: number;
  meaning: string;
  devices: string[];
  contexts: string[];
}

const BREAKPOINT_DEFINITIONS: Record<string, BreakpointDef> = {
  sm: {
    minWidth: 640,
    meaning: 'Small screens - landscape phones, small tablets',
    devices: ['phone-landscape', 'small-tablet'],
    contexts: ['mobile-first', 'compact-layouts'],
  },
  md: {
    minWidth: 768,
    meaning: 'Medium screens - tablets, small laptops',
    devices: ['tablet-portrait', 'small-laptop'],
    contexts: ['tablet-layouts', 'sidebar-visible'],
  },
  lg: {
    minWidth: 1024,
    meaning: 'Large screens - laptops, small desktops',
    devices: ['tablet-landscape', 'laptop', 'small-desktop'],
    contexts: ['desktop-layouts', 'multi-column'],
  },
  xl: {
    minWidth: 1280,
    meaning: 'Extra large screens - desktops',
    devices: ['desktop', 'large-laptop'],
    contexts: ['wide-layouts', 'dashboard'],
  },
  '2xl': {
    minWidth: 1536,
    meaning: 'Extra extra large screens - large desktops, monitors',
    devices: ['large-desktop', 'external-monitor'],
    contexts: ['ultra-wide', 'data-dense'],
  },
};

/**
 * Container query breakpoints (for component-level responsiveness)
 * These are relative to container size, not viewport
 */
const CONTAINER_BREAKPOINTS: Record<string, { minWidth: number; meaning: string }> = {
  'cq-xs': { minWidth: 320, meaning: 'Extra small container - minimal space' },
  'cq-sm': { minWidth: 384, meaning: 'Small container - card-sized' },
  'cq-md': { minWidth: 448, meaning: 'Medium container - panel-sized' },
  'cq-lg': { minWidth: 512, meaning: 'Large container - sidebar-sized' },
  'cq-xl': { minWidth: 576, meaning: 'Extra large container - main content area' },
};

/**
 * Generate breakpoint tokens
 */
export function generateBreakpointTokens(_config: ResolvedSystemConfig): GeneratorResult {
  const tokens: Token[] = [];
  const timestamp = new Date().toISOString();

  // Viewport breakpoints (traditional media queries)
  for (const scale of BREAKPOINT_SCALE) {
    const def = BREAKPOINT_DEFINITIONS[scale]!;
    const scaleIndex = BREAKPOINT_SCALE.indexOf(scale);

    tokens.push({
      name: `breakpoint-${scale}`,
      value: `${def.minWidth}px`,
      category: 'breakpoint',
      namespace: 'breakpoint',
      semanticMeaning: def.meaning,
      usageContext: def.contexts,
      scalePosition: scaleIndex,
      viewportAware: true,
      containerQueryAware: false, // Viewport breakpoints are not CQ-based
      description: `Viewport breakpoint at ${def.minWidth}px. Targets: ${def.devices.join(', ')}.`,
      generatedAt: timestamp,
      usagePatterns: {
        do: [
          'Use for page-level layout changes',
          'Combine with container queries for components',
        ],
        never: [
          'Use viewport queries for component internals',
          'Assume specific device from breakpoint',
        ],
      },
    });

    // Also create the media query string for convenience
    tokens.push({
      name: `screen-${scale}`,
      value: `(min-width: ${def.minWidth}px)`,
      category: 'breakpoint',
      namespace: 'breakpoint',
      semanticMeaning: `Media query for ${scale} breakpoint`,
      dependsOn: [`breakpoint-${scale}`],
      viewportAware: true,
      containerQueryAware: false,
      description: `Media query: @media (min-width: ${def.minWidth}px)`,
      generatedAt: timestamp,
    });
  }

  // Container query breakpoints
  for (const [name, def] of Object.entries(CONTAINER_BREAKPOINTS)) {
    tokens.push({
      name: `breakpoint-${name}`,
      value: `${def.minWidth}px`,
      category: 'breakpoint',
      namespace: 'breakpoint',
      semanticMeaning: def.meaning,
      usageContext: ['component-responsive', 'container-queries'],
      containerQueryAware: true,
      viewportAware: false,
      description: `Container query breakpoint at ${def.minWidth}px. ${def.meaning}.`,
      generatedAt: timestamp,
      usagePatterns: {
        do: [
          'Use for component-level responsiveness',
          'Prefer over viewport queries for reusable components',
        ],
        never: [
          'Use for page-level layout',
          'Forget to set container-type on parent',
        ],
      },
    });

    // Container query syntax
    tokens.push({
      name: `container-${name}`,
      value: `(min-width: ${def.minWidth}px)`,
      category: 'breakpoint',
      namespace: 'breakpoint',
      semanticMeaning: `Container query for ${name}`,
      dependsOn: [`breakpoint-${name}`],
      containerQueryAware: true,
      description: `Container query: @container (min-width: ${def.minWidth}px)`,
      generatedAt: timestamp,
    });
  }

  // Max-width variants for range queries
  for (const scale of BREAKPOINT_SCALE) {
    const def = BREAKPOINT_DEFINITIONS[scale]!;

    tokens.push({
      name: `breakpoint-${scale}-max`,
      value: `${def.minWidth - 1}px`,
      category: 'breakpoint',
      namespace: 'breakpoint',
      semanticMeaning: `Maximum width before ${scale} breakpoint`,
      dependsOn: [`breakpoint-${scale}`],
      viewportAware: true,
      containerQueryAware: false,
      description: `Max-width ${def.minWidth - 1}px (just before ${scale} breakpoint).`,
      generatedAt: timestamp,
    });
  }

  // Reduced motion breakpoint (accessibility)
  tokens.push({
    name: 'breakpoint-motion-reduce',
    value: '(prefers-reduced-motion: reduce)',
    category: 'breakpoint',
    namespace: 'breakpoint',
    semanticMeaning: 'Media query for reduced motion preference',
    usageContext: ['accessibility', 'vestibular-safe'],
    reducedMotionAware: true,
    animationSafe: true,
    containerQueryAware: false,
    description: 'Media query for users preferring reduced motion.',
    generatedAt: timestamp,
    usagePatterns: {
      do: [
        'Use to disable or reduce animations',
        'Provide alternative non-motion feedback',
      ],
      never: [
        'Ignore reduced motion preference',
        'Remove all visual feedback',
      ],
    },
  });

  // Dark mode breakpoint
  tokens.push({
    name: 'breakpoint-dark',
    value: '(prefers-color-scheme: dark)',
    category: 'breakpoint',
    namespace: 'breakpoint',
    semanticMeaning: 'Media query for dark mode preference',
    usageContext: ['theming', 'dark-mode'],
    containerQueryAware: false,
    description: 'Media query for users preferring dark color scheme.',
    generatedAt: timestamp,
  });

  // High contrast breakpoint
  tokens.push({
    name: 'breakpoint-high-contrast',
    value: '(prefers-contrast: more)',
    category: 'breakpoint',
    namespace: 'breakpoint',
    semanticMeaning: 'Media query for high contrast preference',
    usageContext: ['accessibility', 'high-contrast'],
    accessibilityLevel: 'AAA',
    containerQueryAware: false,
    description: 'Media query for users preferring increased contrast.',
    generatedAt: timestamp,
  });

  // Forced colors (Windows High Contrast Mode)
  tokens.push({
    name: 'breakpoint-forced-colors',
    value: '(forced-colors: active)',
    category: 'breakpoint',
    namespace: 'breakpoint',
    semanticMeaning: 'Media query for forced colors mode (Windows High Contrast)',
    usageContext: ['accessibility', 'high-contrast', 'windows'],
    accessibilityLevel: 'AAA',
    containerQueryAware: false,
    description: 'Media query for Windows High Contrast Mode.',
    generatedAt: timestamp,
    usagePatterns: {
      do: [
        'Use system color keywords',
        'Ensure visible focus indicators',
      ],
      never: [
        'Override with custom colors',
        'Hide important visual information',
      ],
    },
  });

  // Breakpoint reference
  tokens.push({
    name: 'breakpoint-scale',
    value: JSON.stringify({
      viewport: Object.fromEntries(
        Object.entries(BREAKPOINT_DEFINITIONS).map(([k, v]) => [k, v.minWidth])
      ),
      container: Object.fromEntries(
        Object.entries(CONTAINER_BREAKPOINTS).map(([k, v]) => [k, v.minWidth])
      ),
      note: 'Container queries are preferred for component responsiveness',
    }),
    category: 'breakpoint',
    namespace: 'breakpoint',
    semanticMeaning: 'Breakpoint scale reference',
    description: 'Complete breakpoint scale for viewport and container queries.',
    generatedAt: timestamp,
    containerQueryAware: true,
  });

  return {
    namespace: 'breakpoint',
    tokens,
  };
}
