/**
 * Spacing Scale Generator - Tailwind-Native Tokens
 *
 * Mathematical spacing system that powers Tailwind utilities: p-*, m-*, w-*, h-*, gap-*
 * These tokens enhance existing Tailwind utilities with mathematical relationships
 */

import { MATHEMATICAL_CONSTANTS, MUSICAL_RATIOS } from '@rafters/shared';
import type { Token } from '../index';

/**
 * Generate spacing scale based on mathematical system
 *
 * @param system - Mathematical progression: linear, musical intervals, or custom exponential
 * @param baseUnit - Base unit in PIXELS (default: 4px = 0.25rem)
 * @param multiplier - Multiplier for custom system (default: 1.25, Tailwind-like)
 * @param steps - Number of steps to generate (default: 12)
 *
 * @returns Array of spacing tokens that power Tailwind utilities
 *
 * @example
 * ```typescript
 * // Generate mathematical spacing scale
 * const spacing = generateSpacingScale('linear', 4, 1.25, 12);
 * // Result: --spacing-0: 0rem, --spacing-1: 0.25rem, --spacing-4: 1rem...
 * // Powers: p-4, m-4, w-4, h-4, gap-4 utilities
 * ```
 */
export function generateSpacingScale(
  system:
    | 'linear'
    | 'minor-second'
    | 'major-second'
    | 'minor-third'
    | 'major-third'
    | 'perfect-fourth'
    | 'augmented-fourth'
    | 'perfect-fifth'
    | 'golden'
    | 'custom',
  baseUnit = 4,
  multiplier = 1.25,
  steps = 12
): Token[] {
  const tokens: Token[] = [];

  for (let i = 0; i <= steps; i++) {
    let valuePx: number;
    let name: string;

    switch (system) {
      case 'linear':
        valuePx = baseUnit * (i === 0 ? 0 : i);
        name = i === 0 ? '0' : `${i}`;
        break;
      case 'minor-second':
        valuePx = i === 0 ? 0 : baseUnit * MUSICAL_RATIOS['minor-second'] ** (i - 1);
        name = i === 0 ? '0' : `${i}`;
        break;
      case 'major-second':
        valuePx = i === 0 ? 0 : baseUnit * MUSICAL_RATIOS['major-second'] ** (i - 1);
        name = i === 0 ? '0' : `${i}`;
        break;
      case 'minor-third':
        valuePx = i === 0 ? 0 : baseUnit * MUSICAL_RATIOS['minor-third'] ** (i - 1);
        name = i === 0 ? '0' : `${i}`;
        break;
      case 'major-third':
        valuePx = i === 0 ? 0 : baseUnit * MUSICAL_RATIOS['major-third'] ** (i - 1);
        name = i === 0 ? '0' : `${i}`;
        break;
      case 'perfect-fourth':
        valuePx = i === 0 ? 0 : baseUnit * MUSICAL_RATIOS['perfect-fourth'] ** (i - 1);
        name = i === 0 ? '0' : `${i}`;
        break;
      case 'augmented-fourth':
        valuePx = i === 0 ? 0 : baseUnit * MUSICAL_RATIOS['augmented-fourth'] ** (i - 1);
        name = i === 0 ? '0' : `${i}`;
        break;
      case 'perfect-fifth':
        valuePx = i === 0 ? 0 : baseUnit * MUSICAL_RATIOS['perfect-fifth'] ** (i - 1);
        name = i === 0 ? '0' : `${i}`;
        break;
      case 'golden':
        valuePx = i === 0 ? 0 : baseUnit * MATHEMATICAL_CONSTANTS.golden ** (i - 1);
        name = i === 0 ? '0' : `${i}`;
        break;
      case 'custom':
        valuePx = i === 0 ? 0 : baseUnit * multiplier ** (i - 1);
        name = i === 0 ? '0' : `scale-${i}`;
        break;
    }

    // Convert pixels to rem (16px = 1rem)
    const valueRem = valuePx / 16;

    // Determine mathRelationship for non-zero, non-base tokens
    let mathRelationship: string | undefined;
    if (i > 1 && valuePx > 0) {
      // Skip 0 and base (1)
      const baseTokenName = '1';
      if (system === 'linear') {
        mathRelationship = `{${baseTokenName}} * ${i}`;
      } else {
        mathRelationship = `{${baseTokenName}} * ${system}^${i - 1}`;
      }
    }

    // Base token only - Tailwind handles responsive variants automatically
    tokens.push({
      name,
      value: `${Math.round(valueRem * 100) / 100}rem`,
      category: 'spacing',
      namespace: 'spacing',
      semanticMeaning: `${system === 'linear' ? 'Mathematical' : system === 'golden' ? 'Golden ratio' : 'Exponential'} spacing step ${i}`,
      mathRelationship,
      progressionSystem: system,
      scalePosition: i,
      generateUtilityClass: true,
      applicableComponents: ['all'],
      accessibilityLevel: 'AAA',
      cognitiveLoad: 1, // Spacing is foundational, minimal cognitive overhead
      trustLevel: 'low', // Non-critical, reversible
      consequence: 'reversible',
    });
  }

  return tokens;
}
