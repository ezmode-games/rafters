/**
 * Height Generator - Tailwind-Native Tokens (Semantic)
 *
 * Semantic height system that powers Tailwind utilities: h-screen, h-full, etc.
 * Provides contextual sizing beyond the mathematical spacing scale
 */

import { MATHEMATICAL_CONSTANTS } from '@rafters/shared';
import type { Token } from '../index';

/**
 * Generate height scale for component sizing with responsive variants
 *
 * @param system - Mathematical progression: linear, golden ratio, or custom exponential
 * @param baseUnit - Base unit in rem (default: 2.5 for good touch targets)
 * @param multiplier - Multiplier for custom system (default: 1.25)
 * @param generateResponsive - Generate viewport and container query variants (default: true)
 *
 * @returns Array of height tokens with AI intelligence metadata and accessibility validation
 *
 * @example
 * ```typescript
 * // Generate standard linear height scale
 * const heights = generateHeightScale('linear', 2.5, 1.25, true);
 *
 * // Generate golden ratio heights for premium feel
 * const goldenHeights = generateHeightScale('golden', 2.5, 1.25, true);
 *
 * // Custom exponential progression
 * const customHeights = generateHeightScale('custom', 2.5, 1.125, true);
 * ```
 */
export function generateHeightScale(
  system: 'linear' | 'golden' | 'custom' = 'linear',
  baseUnit = 2.5, // rem
  multiplier = 1.25
): Token[] {
  const tokens: Token[] = [];
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];

  for (let i = 0; i < sizes.length; i++) {
    let value: number;

    switch (system) {
      case 'linear':
        value = baseUnit + i * 0.5; // 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6
        break;
      case 'golden':
        value = baseUnit * MATHEMATICAL_CONSTANTS.golden ** (i * 0.5);
        break;
      case 'custom':
        value = baseUnit * multiplier ** (i * 0.5);
        break;
    }

    const touchTargetSizePx = value * 16; // Convert rem to px
    const meetsAccessibility = touchTargetSizePx >= 44; // WCAG AAA minimum

    // Base token only - Tailwind handles responsive variants automatically
    tokens.push({
      name: `h-${sizes[i]}`,
      value: `${Math.round(value * 100) / 100}rem`,
      category: 'height',
      namespace: 'height',
      semanticMeaning: `Component height ${sizes[i]} for ${system} scale - ${meetsAccessibility ? 'meets' : 'below'} touch target guidelines`,
      mathRelationship:
        i === 0
          ? undefined
          : system === 'linear'
            ? `{h-${sizes[0]}} + ${i * 0.5}rem`
            : `{h-${sizes[0]}} * ${system}^${i * 0.5}`,
      progressionSystem: system,
      scalePosition: i,
      touchTargetSize: touchTargetSizePx,
      generateUtilityClass: true,
      applicableComponents: ['button', 'input', 'select', 'card'],
      accessibilityLevel: meetsAccessibility ? 'AAA' : 'AA',
      cognitiveLoad: i < 2 ? 2 : i < 4 ? 3 : 4, // Smaller = simpler
      trustLevel: 'low',
      consequence: 'reversible',
      usageContext: [
        ...(i < 2 ? ['compact-ui', 'dense-layout'] : []),
        ...(i >= 2 && i < 5 ? ['standard-components', 'forms'] : []),
        ...(i >= 5 ? ['hero-elements', 'prominent-cta'] : []),
      ],
    });
  }

  return tokens;
}
