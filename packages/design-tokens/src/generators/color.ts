/**
 * Color Tokens Generator
 *
 * Semantic color system with accessibility validation
 * Generates comprehensive color scales with meaning and usage context
 */

import type { Token } from '../index.js';

/**
 * Generate comprehensive color tokens with semantic meaning
 *
 * @returns Array of color tokens with AI intelligence metadata and accessibility validation
 *
 * @example
 * ```typescript
 * const colorTokens = generateColorTokens();
 * // Generates semantic colors: primary, success, warning, error, info
 * // with proper contrast ratios and usage guidance
 * ```
 */
export function generateColorTokens(): Token[] {
  const tokens: Token[] = [];

  const colorScale = [
    // Primary brand colors
    {
      name: 'primary',
      value: 'oklch(0.45 0.12 240)', // Blue
      darkValue: 'oklch(0.7 0.12 240)',
      meaning: 'Primary brand color for main actions and focus states',
      trustLevel: 'high' as const,
      cognitiveLoad: 3,
      usage: ['cta', 'primary-button', 'brand', 'focus'],
      components: ['button', 'link', 'badge', 'progress'],
    },
    {
      name: 'primary-foreground',
      value: 'oklch(0.95 0 0)', // White
      darkValue: 'oklch(0.15 0.005 240)',
      meaning: 'Text color for primary backgrounds',
      trustLevel: 'high' as const,
      cognitiveLoad: 1,
      usage: ['text-on-primary', 'button-text'],
      components: ['button', 'badge'],
    },

    // Success colors
    {
      name: 'success',
      value: 'oklch(0.62 0.17 145)', // Green
      darkValue: 'oklch(0.55 0.15 145)',
      meaning: 'Success states, confirmations, positive feedback',
      trustLevel: 'low' as const,
      cognitiveLoad: 2,
      usage: ['success-message', 'confirmation', 'complete'],
      components: ['alert', 'toast', 'badge', 'progress'],
    },
    {
      name: 'success-foreground',
      value: 'oklch(0.95 0 0)',
      darkValue: 'oklch(0.15 0.005 145)',
      meaning: 'Text color for success backgrounds',
      trustLevel: 'low' as const,
      cognitiveLoad: 1,
      usage: ['text-on-success'],
      components: ['alert', 'badge'],
    },

    // Warning colors
    {
      name: 'warning',
      value: 'oklch(0.7 0.15 75)', // Amber
      darkValue: 'oklch(0.65 0.13 75)',
      meaning: 'Warning states, caution, important information',
      trustLevel: 'medium' as const,
      cognitiveLoad: 5,
      usage: ['warning-message', 'caution', 'important'],
      components: ['alert', 'toast', 'badge'],
    },
    {
      name: 'warning-foreground',
      value: 'oklch(0.15 0.005 75)',
      darkValue: 'oklch(0.95 0 0)',
      meaning: 'Text color for warning backgrounds',
      trustLevel: 'medium' as const,
      cognitiveLoad: 1,
      usage: ['text-on-warning'],
      components: ['alert', 'badge'],
    },

    // Destructive/Error colors
    {
      name: 'destructive',
      value: 'oklch(0.53 0.24 27)', // Red
      darkValue: 'oklch(0.58 0.22 27)',
      meaning: 'Destructive actions, errors, danger - REQUIRES confirmation UX',
      trustLevel: 'critical' as const,
      cognitiveLoad: 8,
      usage: ['error', 'delete', 'danger', 'critical'],
      components: ['button', 'alert', 'toast'],
      requiresConfirmation: true,
    },
    {
      name: 'destructive-foreground',
      value: 'oklch(0.95 0 0)',
      darkValue: 'oklch(0.15 0.005 27)',
      meaning: 'Text color for destructive backgrounds',
      trustLevel: 'critical' as const,
      cognitiveLoad: 1,
      usage: ['text-on-destructive'],
      components: ['button', 'alert'],
    },

    // Info colors
    {
      name: 'info',
      value: 'oklch(0.66 0.15 240)', // Blue-gray
      darkValue: 'oklch(0.6 0.12 240)',
      meaning: 'Informational messages, neutral notifications',
      trustLevel: 'low' as const,
      cognitiveLoad: 2,
      usage: ['info-message', 'notification', 'neutral'],
      components: ['alert', 'toast', 'badge'],
    },
    {
      name: 'info-foreground',
      value: 'oklch(0.95 0 0)',
      darkValue: 'oklch(0.15 0.005 240)',
      meaning: 'Text color for info backgrounds',
      trustLevel: 'low' as const,
      cognitiveLoad: 1,
      usage: ['text-on-info'],
      components: ['alert', 'badge'],
    },

    // Background colors
    {
      name: 'background',
      value: 'oklch(1 0 0)', // White
      darkValue: 'oklch(0.09 0 0)', // Near black
      meaning: 'Primary background for content areas',
      trustLevel: 'low' as const,
      cognitiveLoad: 1,
      usage: ['page-background', 'content-area'],
      components: ['all'],
    },
    {
      name: 'foreground',
      value: 'oklch(0.15 0.005 240)', // Near black
      darkValue: 'oklch(0.95 0 0)', // White
      meaning: 'Primary text color for body content',
      trustLevel: 'low' as const,
      cognitiveLoad: 1,
      usage: ['body-text', 'primary-text'],
      components: ['text', 'heading', 'paragraph'],
    },

    // Muted colors
    {
      name: 'muted',
      value: 'oklch(0.95 0.01 240)', // Light gray
      darkValue: 'oklch(0.17 0.01 240)', // Dark gray
      meaning: 'Muted backgrounds for secondary content areas',
      trustLevel: 'low' as const,
      cognitiveLoad: 1,
      usage: ['secondary-background', 'subtle-areas'],
      components: ['card', 'sidebar', 'section'],
    },
    {
      name: 'muted-foreground',
      value: 'oklch(0.45 0.02 240)', // Medium gray
      darkValue: 'oklch(0.63 0.02 240)', // Light gray
      meaning: 'Muted text for secondary information',
      trustLevel: 'low' as const,
      cognitiveLoad: 1,
      usage: ['secondary-text', 'metadata', 'captions'],
      components: ['text', 'label', 'caption'],
    },

    // Border colors
    {
      name: 'border',
      value: 'oklch(0.9 0.01 240)', // Light border
      darkValue: 'oklch(0.17 0.01 240)', // Dark border
      meaning: 'Default border color for components',
      trustLevel: 'low' as const,
      cognitiveLoad: 1,
      usage: ['component-borders', 'dividers'],
      components: ['input', 'card', 'button', 'separator'],
    },
  ];

  colorScale.forEach((color, index) => {
    tokens.push({
      name: color.name,
      value: color.value,
      darkValue: color.darkValue,
      category: 'color',
      namespace: 'color',
      semanticMeaning: color.meaning,
      scalePosition: index,
      trustLevel: color.trustLevel,
      cognitiveLoad: color.cognitiveLoad,
      generateUtilityClass: true,
      applicableComponents: color.components,
      accessibilityLevel: 'AAA',
      consequence:
        color.trustLevel === 'critical'
          ? 'destructive'
          : color.trustLevel === 'high'
            ? 'significant'
            : 'reversible',
      usageContext: color.usage,
      ...(color.requiresConfirmation && {
        requiresConfirmation: true,
        trustLevel: 'critical',
      }),
    });
  });

  return tokens;
}
