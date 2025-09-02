/**
 * Spacing Scale Generator
 *
 * Mathematical spacing system with responsive and container query variants
 * Supports linear, golden ratio, and custom exponential progressions
 */

import type { Token } from '../index.js';

/**
 * Mathematical constants for spacing generation
 */
const GOLDEN_RATIO = 1.618033988749;

/**
 * Generate spacing scale based on mathematical system
 *
 * @param system - Mathematical progression: linear, golden ratio, or custom exponential
 * @param baseUnit - Base unit in PIXELS (default: 4px = 0.25rem)
 * @param multiplier - Multiplier for custom system (default: 1.25, Tailwind-like)
 * @param steps - Number of steps to generate (default: 12)
 *
 * @returns Array of base spacing tokens with AI intelligence metadata
 *
 * @example
 * ```typescript
 * // Generate Tailwind-like linear spacing (0, 0.25rem, 0.5rem, 0.75rem, 1rem...)
 * const linearSpacing = generateSpacingScale('linear', 4, 1.25, 12);
 *
 * // Generate golden ratio spacing for premium feel
 * const goldenSpacing = generateSpacingScale('golden', 4, 1.25, 8);
 *
 * // Custom exponential with tighter progression
 * const customSpacing = generateSpacingScale('custom', 4, 1.125, 10);
 * ```
 */
export function generateSpacingScale(
  system: 'linear' | 'golden' | 'custom',
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
      case 'golden':
        valuePx = i === 0 ? 0 : baseUnit * GOLDEN_RATIO ** (i - 1);
        name = i === 0 ? '0' : `golden-${i}`;
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
      semanticMeaning: `Spacing step ${i} in ${system} scale`,
      mathRelationship:
        system === 'linear'
          ? `${baseUnit}px * ${i} / 16`
          : `${baseUnit}px * ${multiplier}^${i - 1} / 16`,
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
