/**
 * Breakpoint Generator
 *
 * Generates responsive breakpoint tokens for Tailwind v4 compatibility.
 * Uses container queries as the default (containerQueryAware: true).
 *
 * This generator is a pure function - it receives breakpoint definitions as input.
 * Default breakpoints are provided by the orchestrator from defaults.ts.
 */

import type { Token } from '@rafters/shared';
import type { BreakpointDef, ContainerBreakpointDef } from './defaults.js';
import type { GeneratorResult, ResolvedSystemConfig } from './types.js';
import { BREAKPOINT_SCALE } from './types.js';

/**
 * Generate breakpoint tokens from provided definitions
 */
export function generateBreakpointTokens(
  _config: ResolvedSystemConfig,
  breakpointDefs: Record<string, BreakpointDef>,
  containerBreakpointDefs: Record<string, ContainerBreakpointDef>,
): GeneratorResult {
  const tokens: Token[] = [];
  const timestamp = new Date().toISOString();

  // Viewport breakpoints (traditional media queries)
  for (const scale of BREAKPOINT_SCALE) {
    const def = breakpointDefs[scale];
    if (!def) continue;
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
        do: ['Use for page-level layout changes', 'Combine with container queries for components'],
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
  for (const [name, def] of Object.entries(containerBreakpointDefs)) {
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
        never: ['Use for page-level layout', 'Forget to set container-type on parent'],
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
    const def = breakpointDefs[scale];
    if (!def) continue;

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
      do: ['Use to disable or reduce animations', 'Provide alternative non-motion feedback'],
      never: ['Ignore reduced motion preference', 'Remove all visual feedback'],
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
      do: ['Use system color keywords', 'Ensure visible focus indicators'],
      never: ['Override with custom colors', 'Hide important visual information'],
    },
  });

  // Breakpoint reference
  tokens.push({
    name: 'breakpoint-scale',
    value: JSON.stringify({
      viewport: Object.fromEntries(Object.entries(breakpointDefs).map(([k, v]) => [k, v.minWidth])),
      container: Object.fromEntries(
        Object.entries(containerBreakpointDefs).map(([k, v]) => [k, v.minWidth]),
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
