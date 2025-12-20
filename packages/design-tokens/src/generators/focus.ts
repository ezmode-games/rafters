/**
 * Focus Generator
 *
 * Generates focus ring tokens for WCAG 2.2 compliance.
 * Focus indicators are critical for keyboard navigation and accessibility.
 *
 * WCAG 2.2 Focus Visible requirements:
 * - Focus indicator must be at least 2px thick
 * - Must have 3:1 contrast against adjacent colors
 * - Must enclose the component or have minimum area
 */

import type { Token } from '@rafters/shared';
import type { ResolvedSystemConfig, GeneratorResult } from './types.js';

/**
 * Focus ring styles
 */
const FOCUS_STYLES = ['solid', 'dashed', 'double'] as const;

/**
 * Focus ring configurations for different contexts
 */
interface FocusConfig {
  width: number;
  offset: number;
  style: typeof FOCUS_STYLES[number];
  meaning: string;
  contexts: string[];
}

const FOCUS_CONFIGS: Record<string, FocusConfig> = {
  default: {
    width: 2,
    offset: 2,
    style: 'solid',
    meaning: 'Default focus ring - suitable for most interactive elements',
    contexts: ['buttons', 'links', 'inputs', 'selects'],
  },
  inset: {
    width: 2,
    offset: -2,
    style: 'solid',
    meaning: 'Inset focus ring - for elements where external ring would be cut off',
    contexts: ['cards', 'containers', 'overflow-hidden'],
  },
  thick: {
    width: 3,
    offset: 2,
    style: 'solid',
    meaning: 'Thick focus ring - for high-visibility needs',
    contexts: ['critical-actions', 'primary-cta', 'accessibility-mode'],
  },
  subtle: {
    width: 1,
    offset: 2,
    style: 'solid',
    meaning: 'Subtle focus ring - for dense UIs with many focusable elements',
    contexts: ['table-cells', 'list-items', 'dense-ui'],
  },
};

/**
 * Generate focus tokens
 */
export function generateFocusTokens(config: ResolvedSystemConfig): GeneratorResult {
  const tokens: Token[] = [];
  const timestamp = new Date().toISOString();
  const { focusRingWidth } = config;

  // Base focus width token
  tokens.push({
    name: 'focus-ring-width',
    value: `${focusRingWidth}px`,
    category: 'focus',
    namespace: 'focus',
    semanticMeaning: 'Default focus ring width - WCAG 2.2 requires minimum 2px',
    usageContext: ['focus-indicators', 'keyboard-navigation'],
    accessibilityLevel: 'AA',
    focusRingWidth: `${focusRingWidth}px`,
    description: `Focus ring width ${focusRingWidth}px. WCAG 2.2 requires minimum 2px for visibility.`,
    generatedAt: timestamp,
    containerQueryAware: false,
    usagePatterns: {
      do: [
        'Use for all focus-visible states',
        'Ensure 3:1 contrast against adjacent colors',
      ],
      never: [
        'Reduce below 2px',
        'Remove focus rings without alternative indicator',
      ],
    },
  });

  // Focus ring color token (references semantic ring color)
  tokens.push({
    name: 'focus-ring-color',
    value: 'var(--ring)',
    category: 'focus',
    namespace: 'focus',
    semanticMeaning: 'Focus ring color - inherits from semantic ring token',
    usageContext: ['focus-indicators'],
    dependsOn: ['ring'],
    focusRingColor: 'var(--ring)',
    description: 'Focus ring color. Uses semantic ring token for theme consistency.',
    generatedAt: timestamp,
    containerQueryAware: false,
    highContrastMode: 'Highlight',
  });

  // Generate focus ring configuration tokens
  for (const [name, focusConfig] of Object.entries(FOCUS_CONFIGS)) {
    tokens.push({
      name: name === 'default' ? 'focus-ring' : `focus-ring-${name}`,
      value: JSON.stringify({
        width: `${focusConfig.width}px`,
        offset: `${focusConfig.offset}px`,
        style: focusConfig.style,
        color: 'var(--ring)',
      }),
      category: 'focus',
      namespace: 'focus',
      semanticMeaning: focusConfig.meaning,
      usageContext: focusConfig.contexts,
      focusRingWidth: `${focusConfig.width}px`,
      focusRingColor: 'var(--ring)',
      focusRingOffset: `${focusConfig.offset}px`,
      focusRingStyle: focusConfig.style,
      dependsOn: ['ring', 'focus-ring-width'],
      accessibilityLevel: focusConfig.width >= 2 ? 'AA' : undefined,
      description: `${focusConfig.meaning}. Width: ${focusConfig.width}px, Offset: ${focusConfig.offset}px.`,
      generatedAt: timestamp,
      containerQueryAware: false,
      highContrastMode: 'Highlight',
      usagePatterns: {
        do:
          name === 'default'
            ? ['Use as the default focus indicator', 'Apply to all interactive elements']
            : name === 'inset'
              ? ['Use when external ring would be clipped', 'Use for contained elements']
              : name === 'thick'
                ? ['Use for critical actions', 'Use in accessibility-focused modes']
                : ['Use in dense UIs', 'Ensure sufficient contrast'],
        never: [
          'Remove without providing alternative focus indicator',
          'Use colors with insufficient contrast',
        ],
      },
    });

    // Also create CSS-ready outline shorthand
    const outlineValue =
      focusConfig.offset >= 0
        ? `${focusConfig.width}px ${focusConfig.style} var(--ring)`
        : `${focusConfig.width}px ${focusConfig.style} var(--ring)`;

    tokens.push({
      name: name === 'default' ? 'focus-outline' : `focus-outline-${name}`,
      value: outlineValue,
      category: 'focus',
      namespace: 'focus',
      semanticMeaning: `CSS outline shorthand for ${name} focus ring`,
      usageContext: ['css-outline-property'],
      dependsOn: ['ring'],
      description: `CSS outline value: ${outlineValue}. Use with outline-offset: ${focusConfig.offset}px.`,
      generatedAt: timestamp,
      containerQueryAware: false,
    });

    tokens.push({
      name: name === 'default' ? 'focus-offset' : `focus-offset-${name}`,
      value: `${focusConfig.offset}px`,
      category: 'focus',
      namespace: 'focus',
      semanticMeaning: `Focus ring offset for ${name} style`,
      focusRingOffset: `${focusConfig.offset}px`,
      description: `Focus offset ${focusConfig.offset}px for ${name} focus style.`,
      generatedAt: timestamp,
      containerQueryAware: false,
    });
  }

  // Focus-within variant for containers
  tokens.push({
    name: 'focus-within-ring',
    value: JSON.stringify({
      width: `${focusRingWidth}px`,
      offset: '0px',
      style: 'solid',
      color: 'var(--ring)',
    }),
    category: 'focus',
    namespace: 'focus',
    semanticMeaning: 'Focus ring for containers with focused descendants',
    usageContext: ['form-groups', 'card-actions', 'list-containers'],
    focusRingWidth: `${focusRingWidth}px`,
    focusRingColor: 'var(--ring)',
    focusRingOffset: '0px',
    focusRingStyle: 'solid',
    dependsOn: ['ring'],
    description: 'Focus indicator for containers using :focus-within pseudo-class.',
    generatedAt: timestamp,
    containerQueryAware: false,
    usagePatterns: {
      do: [
        'Use on containers with focusable children',
        'Combine with child focus styles',
      ],
      never: [
        'Use as replacement for child focus indicators',
        'Apply to non-container elements',
      ],
    },
  });

  // High contrast mode overrides
  tokens.push({
    name: 'focus-high-contrast',
    value: JSON.stringify({
      width: '3px',
      offset: '2px',
      style: 'solid',
      color: 'Highlight',
    }),
    category: 'focus',
    namespace: 'focus',
    semanticMeaning: 'Focus ring for Windows High Contrast Mode',
    usageContext: ['high-contrast-mode', 'forced-colors'],
    focusRingWidth: '3px',
    focusRingOffset: '2px',
    focusRingStyle: 'solid',
    highContrastMode: 'Highlight',
    description: 'High contrast focus ring using system Highlight color.',
    generatedAt: timestamp,
    containerQueryAware: false,
    usagePatterns: {
      do: [
        'Apply in @media (forced-colors: active)',
        'Use system color keywords',
      ],
      never: [
        'Override in forced-colors mode',
        'Use custom colors in high contrast',
      ],
    },
  });

  return {
    namespace: 'focus',
    tokens,
  };
}
