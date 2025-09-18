/**
 * Spacing Scale Generator - Tailwind-Native Tokens
 *
 * Mathematical spacing system that powers Tailwind utilities: p-*, m-*, w-*, h-*, gap-*
 * These tokens enhance existing Tailwind utilities with mathematical relationships
 */

import type { Token } from '../index';

/**
 * Musical and mathematical ratios for spacing generation
 * Based on musical intervals for harmonious proportions
 */
const MINOR_SECOND = 1.067; // 16:15 ratio
const MAJOR_SECOND = 1.125; // 9:8 ratio
const MINOR_THIRD = 1.2; // 6:5 ratio
const MAJOR_THIRD = 1.25; // 5:4 ratio
const PERFECT_FOURTH = 1.333; // 4:3 ratio
const AUGMENTED_FOURTH = Math.SQRT2; // √2 ratio (tritone)
const PERFECT_FIFTH = 1.5; // 3:2 ratio
const GOLDEN_RATIO = 1.618033988749; // φ (phi)

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
        valuePx = i === 0 ? 0 : baseUnit * MINOR_SECOND ** (i - 1);
        name = i === 0 ? '0' : `${i}`;
        break;
      case 'major-second':
        valuePx = i === 0 ? 0 : baseUnit * MAJOR_SECOND ** (i - 1);
        name = i === 0 ? '0' : `${i}`;
        break;
      case 'minor-third':
        valuePx = i === 0 ? 0 : baseUnit * MINOR_THIRD ** (i - 1);
        name = i === 0 ? '0' : `${i}`;
        break;
      case 'major-third':
        valuePx = i === 0 ? 0 : baseUnit * MAJOR_THIRD ** (i - 1);
        name = i === 0 ? '0' : `${i}`;
        break;
      case 'perfect-fourth':
        valuePx = i === 0 ? 0 : baseUnit * PERFECT_FOURTH ** (i - 1);
        name = i === 0 ? '0' : `${i}`;
        break;
      case 'augmented-fourth':
        valuePx = i === 0 ? 0 : baseUnit * AUGMENTED_FOURTH ** (i - 1);
        name = i === 0 ? '0' : `${i}`;
        break;
      case 'perfect-fifth':
        valuePx = i === 0 ? 0 : baseUnit * PERFECT_FIFTH ** (i - 1);
        name = i === 0 ? '0' : `${i}`;
        break;
      case 'golden':
        valuePx = i === 0 ? 0 : baseUnit * GOLDEN_RATIO ** (i - 1);
        name = i === 0 ? '0' : `${i}`;
        break;
      case 'custom':
        valuePx = i === 0 ? 0 : baseUnit * multiplier ** (i - 1);
        name = i === 0 ? '0' : `scale-${i}`;
        break;
    }

    // Convert pixels to rem (16px = 1rem)
    const valueRem = valuePx / 16;

    // Base token only - Tailwind handles responsive variants automatically
    tokens.push({
      name,
      value: `${Math.round(valueRem * 100) / 100}rem`,
      category: 'spacing',
      namespace: 'spacing',
      semanticMeaning: `${system === 'linear' ? 'Mathematical' : system === 'golden' ? 'Golden ratio' : 'Exponential'} spacing step ${i}`,
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
