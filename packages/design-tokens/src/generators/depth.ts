/**
 * Depth Scale Generator - Mixed Token Types
 *
 * Shadows: Tailwind-Native tokens that enhance shadow-* utilities
 * Z-Index: Rafters-Enhanced tokens with semantic layering intelligence (z-modal vs z-[1000])
 */

import type { Token } from '../index';

/**
 * Generate depth scale (shadows and z-index) with semantic layering system
 *
 * @param _system - Mathematical progression (currently exponential only)
 * @param _baseMultiplier - Base multiplier for exponential progression
 *
 * @returns Array of depth tokens with semantic intelligence
 *
 * @example
 * ```typescript
 * const depthTokens = generateDepthScale('exponential', 10);
 * // Shadow tokens: --shadow-sm, --shadow-lg (enhance Tailwind)
 * // Z-index tokens: --z-modal, --z-dropdown (semantic layering)
 * ```
 */
export function generateDepthScale(
  _system: 'linear' | 'exponential' = 'exponential',
  _baseMultiplier = 10
): Token[] {
  const tokens: Token[] = [];

  // Shadow tokens with semantic names
  const shadowScale = [
    {
      name: 'shadow-none',
      value: 'none',
      meaning: 'No shadow, flat appearance',
      cognitiveLoad: 1,
      trustLevel: 'low' as const,
    },
    {
      name: 'shadow-sm',
      value: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      meaning: 'Subtle depth for cards',
      cognitiveLoad: 2,
      trustLevel: 'low' as const,
    },
    {
      name: 'shadow-base',
      value: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      meaning: 'Standard card shadow',
      cognitiveLoad: 2,
      trustLevel: 'low' as const,
    },
    {
      name: 'shadow-md',
      value: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      meaning: 'Elevated components',
      cognitiveLoad: 3,
      trustLevel: 'medium' as const,
    },
    {
      name: 'shadow-lg',
      value: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      meaning: 'Floating elements',
      cognitiveLoad: 4,
      trustLevel: 'medium' as const,
    },
    {
      name: 'shadow-xl',
      value: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      meaning: 'Modal/dialog shadow',
      cognitiveLoad: 5,
      trustLevel: 'high' as const,
    },
    {
      name: 'shadow-2xl',
      value: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      meaning: 'Maximum elevation',
      cognitiveLoad: 6,
      trustLevel: 'high' as const,
    },
  ];

  // Semantic z-index layers
  const zLayers = [
    {
      name: 'z-base',
      value: 0,
      meaning: 'Base content layer',
      cognitiveLoad: 1,
      trustLevel: 'low' as const,
    },
    {
      name: 'z-sticky',
      value: 10,
      meaning: 'Sticky elements (headers, sidebars)',
      cognitiveLoad: 2,
      trustLevel: 'low' as const,
    },
    {
      name: 'z-dropdown',
      value: 100,
      meaning: 'Dropdowns and select menus',
      cognitiveLoad: 4,
      trustLevel: 'medium' as const,
    },
    {
      name: 'z-modal',
      value: 1000,
      meaning: 'Modal dialogs and overlays',
      cognitiveLoad: 7,
      trustLevel: 'high' as const,
    },
    {
      name: 'z-popover',
      value: 5000,
      meaning: 'Popovers and tooltips',
      cognitiveLoad: 3,
      trustLevel: 'medium' as const,
    },
    {
      name: 'z-notification',
      value: 10000,
      meaning: 'Toast notifications and alerts',
      cognitiveLoad: 5,
      trustLevel: 'medium' as const,
    },
    {
      name: 'z-tooltip',
      value: 50000,
      meaning: 'Tooltips (highest priority)',
      cognitiveLoad: 2,
      trustLevel: 'low' as const,
    },
    {
      name: 'z-max',
      value: 2147483647,
      meaning: 'Maximum z-index value',
      cognitiveLoad: 8,
      trustLevel: 'critical' as const,
    },
  ];

  // Generate shadow tokens
  let shadowIndex = 0;
  for (const shadow of shadowScale) {
    tokens.push({
      name: shadow.name.replace('shadow-', ''),
      value: shadow.value,
      category: 'shadow',
      namespace: 'shadow',
      semanticMeaning: shadow.meaning,
      scalePosition: shadowIndex,
      generateUtilityClass: true,
      applicableComponents: ['card', 'modal', 'dropdown', 'tooltip', 'popover'],
      cognitiveLoad: shadow.cognitiveLoad,
      trustLevel: shadow.trustLevel,
      accessibilityLevel: 'AAA',
      consequence: 'reversible',
    });
    shadowIndex++;
  }

  // Generate semantic z-index tokens
  let zLayerIndex = 0;
  for (const layer of zLayers) {
    tokens.push({
      name: layer.name.replace('z-', ''),
      value: layer.value.toString(),
      category: 'z-index',
      namespace: 'z',
      semanticMeaning: layer.meaning,
      scalePosition: zLayerIndex,
      generateUtilityClass: true,
      applicableComponents: layer.name.includes('modal')
        ? ['modal', 'dialog', 'sheet']
        : layer.name.includes('dropdown')
          ? ['dropdown', 'select', 'menu']
          : layer.name.includes('tooltip')
            ? ['tooltip', 'hint']
            : layer.name.includes('notification')
              ? ['toast', 'alert', 'snackbar']
              : ['overlay'],
      cognitiveLoad: layer.cognitiveLoad,
      trustLevel: layer.trustLevel,
      accessibilityLevel: 'AAA',
      consequence: layer.trustLevel === 'critical' ? 'significant' : 'reversible',
    });
    zLayerIndex++;
  }

  return tokens;
}
