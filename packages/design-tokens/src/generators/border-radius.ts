/**
 * Border Radius Generator - Visual Softness Scale
 *
 * Mathematical progression system for border-radius values focused on visual hierarchy
 * and component softness. Uses different mathematical progression than spacing.
 */

import { MATHEMATICAL_CONSTANTS, MUSICAL_RATIOS } from '@rafters/shared';
import type { Token } from '../index';

/**
 * Generate border-radius scale for visual softness progression
 *
 * @param system - Mathematical progression: linear, golden ratio, or musical intervals
 * @param baseUnit - Base unit in pixels (default: 4px for subtle rounding)
 * @param multiplier - Multiplier for custom system (default: 1.5 for good visual steps)
 * @param steps - Number of steps to generate (default: 8)
 *
 * @returns Array of border-radius tokens with visual hierarchy metadata
 *
 * @example
 * ```typescript
 * // Generate linear border-radius scale
 * const radii = generateBorderRadiusScale('linear', 4, 1.5, 8);
 * // Result: rounded-none (0), rounded-sm (4px), rounded (8px), etc.
 *
 * // Generate golden ratio for premium feel
 * const goldenRadii = generateBorderRadiusScale('golden', 4, 1.5, 8);
 * ```
 */
export function generateBorderRadiusScale(
  system:
    | 'linear'
    | 'golden'
    | 'major-third'
    | 'perfect-fourth'
    | 'perfect-fifth'
    | 'custom' = 'linear',
  baseUnit = 4,
  multiplier = 1.5,
  steps = 8
): Token[] {
  const tokens: Token[] = [];

  // Use absolute value to handle negative base units gracefully
  const absBaseUnit = Math.abs(baseUnit);

  // Border radius names following Tailwind convention
  const names = ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'];

  for (let i = 0; i < Math.min(steps, names.length); i++) {
    const name = names[i];
    let valuePx: number;

    if (name === 'none') {
      valuePx = 0;
    } else if (name === 'full') {
      valuePx = 9999; // Large value for full rounding
    } else {
      // Calculate value based on system (skip none, account for full)
      const step = i - 1; // Adjust for 'none' at index 0

      switch (system) {
        case 'linear':
          valuePx = absBaseUnit + step * absBaseUnit;
          break;
        case 'golden':
          valuePx = absBaseUnit * MATHEMATICAL_CONSTANTS.golden ** step;
          break;
        case 'major-third':
          valuePx = absBaseUnit * MUSICAL_RATIOS['major-third'] ** step;
          break;
        case 'perfect-fourth':
          valuePx = absBaseUnit * MUSICAL_RATIOS['perfect-fourth'] ** step;
          break;
        case 'perfect-fifth':
          valuePx = absBaseUnit * MUSICAL_RATIOS['perfect-fifth'] ** step;
          break;
        case 'custom':
          valuePx = absBaseUnit * multiplier ** step;
          break;
      }
    }

    // Convert to rem for consistency (16px = 1rem)
    const valueRem = name === 'full' ? '9999px' : `${Math.round((valuePx / 16) * 100) / 100}rem`;

    // Determine visual hierarchy and usage context
    const isSubtle = i <= 2; // none, sm, md
    const isStandard = i >= 3 && i <= 5; // lg, xl, 2xl
    const isDramatic = i >= 6; // 3xl, full

    // Determine mathRelationship for non-zero, non-full tokens
    let mathRelationship: string | undefined;
    if (i > 1 && name !== 'full') {
      const baseTokenName = 'sm'; // sm is the base (index 1)
      const steps = i - 1; // Calculate steps from base
      if (system === 'linear') {
        mathRelationship = `{${baseTokenName}} + ${steps * absBaseUnit}px`;
      } else {
        mathRelationship = `{${baseTokenName}} * ${system}^${steps}`;
      }
    }

    tokens.push({
      name: `rounded-${name}`,
      value: valueRem,
      category: 'border-radius',
      namespace: 'border',
      semanticMeaning: `${name === 'none' ? 'Sharp' : name === 'full' ? 'Fully rounded' : 'Progressively rounded'} corners for ${isSubtle ? 'subtle' : isStandard ? 'standard' : 'dramatic'} visual softness`,
      mathRelationship,
      progressionSystem: system,
      scalePosition: i,
      generateUtilityClass: true,
      applicableComponents: [
        ...(isSubtle ? ['input', 'button', 'card'] : []),
        ...(isStandard ? ['modal', 'popover', 'badge'] : []),
        ...(isDramatic ? ['avatar', 'pill', 'circular-elements'] : []),
      ],
      accessibilityLevel: 'AAA',
      cognitiveLoad: isSubtle ? 1 : isStandard ? 2 : 3,
      trustLevel: 'low',
      consequence: 'reversible',
      usageContext: [
        ...(name === 'none' ? ['technical-ui', 'data-tables', 'code-blocks'] : []),
        ...(isSubtle ? ['forms', 'inputs', 'subtle-containers'] : []),
        ...(isStandard ? ['cards', 'modals', 'interactive-elements'] : []),
        ...(isDramatic ? ['avatars', 'badges', 'brand-elements'] : []),
      ],
    });
  }

  return tokens;
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use generateBorderRadiusScale instead
 */
export function generateBorderRadiusTokens(): Token[] {
  return generateBorderRadiusScale('linear', 4, 1.5, 8);
}
