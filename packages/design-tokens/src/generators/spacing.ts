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
 * Generate spacing scale based on mathematical system with responsive variants
 *
 * @param system - Mathematical progression: linear, golden ratio, or custom exponential
 * @param baseUnit - Base unit in rem (default: 4)
 * @param multiplier - Multiplier for custom system (default: 1.25, Tailwind-like)
 * @param steps - Number of steps to generate (default: 12)
 * @param generateResponsive - Generate viewport and container query variants (default: true)
 *
 * @returns Array of spacing tokens with AI intelligence metadata
 *
 * @example
 * ```typescript
 * // Generate Tailwind-like linear spacing (0, 1, 2, 3, 4...)
 * const linearSpacing = generateSpacingScale('linear', 4, 1.25, 12, true);
 *
 * // Generate golden ratio spacing for premium feel
 * const goldenSpacing = generateSpacingScale('golden', 4, 1.25, 8, true);
 *
 * // Custom exponential with tighter progression
 * const customSpacing = generateSpacingScale('custom', 4, 1.125, 10, true);
 * ```
 */
export function generateSpacingScale(
  system: 'linear' | 'golden' | 'custom',
  baseUnit = 4,
  multiplier = 1.25,
  steps = 12,
  generateResponsive = true
): Token[] {
  const tokens: Token[] = [];
  const breakpoints = generateResponsive ? ['sm', 'md', 'lg', 'xl'] : [];
  const containerSizes = generateResponsive ? ['xs', 'sm', 'md', 'lg', 'xl'] : [];

  for (let i = 0; i <= steps; i++) {
    let value: number;
    let name: string;

    switch (system) {
      case 'linear':
        value = baseUnit * (i === 0 ? 0 : i);
        name = i === 0 ? '0' : `${i}`;
        break;
      case 'golden':
        value = i === 0 ? 0 : baseUnit * GOLDEN_RATIO ** (i - 1);
        name = i === 0 ? '0' : `golden-${i}`;
        break;
      case 'custom':
        value = i === 0 ? 0 : baseUnit * multiplier ** (i - 1);
        name = i === 0 ? '0' : `scale-${i}`;
        break;
    }

    // Base token
    tokens.push({
      name,
      value: `${Math.round(value * 100) / 100}rem`,
      category: 'spacing',
      namespace: 'spacing',
      semanticMeaning: `Spacing step ${i} in ${system} scale`,
      mathRelationship:
        system === 'linear' ? `${baseUnit} * ${i}` : `${baseUnit} * ${multiplier}^${i - 1}`,
      scalePosition: i,
      generateUtilityClass: true,
      applicableComponents: ['all'],
      containerQueryAware: generateResponsive,
      viewportAware: generateResponsive,
      accessibilityLevel: 'AAA',
      cognitiveLoad: 1, // Spacing is foundational, minimal cognitive overhead
      trustLevel: 'low', // Non-critical, reversible
      consequence: 'reversible',
    });

    // Responsive variants (viewport-based)
    if (generateResponsive) {
      let bpIndex = 0;
      for (const bp of breakpoints) {
        const responsiveMultiplier = 1 + bpIndex * 0.125; // 1, 1.125, 1.25, 1.375, 1.5
        const responsiveValue = value * responsiveMultiplier;

        tokens.push({
          name: `${bp}-${name}`,
          value: `${Math.round(responsiveValue * 100) / 100}rem`,
          category: 'spacing',
          namespace: 'spacing',
          semanticMeaning: `Responsive spacing ${name} for ${bp} breakpoint`,
          mathRelationship: `(${system === 'linear' ? `${baseUnit} * ${i}` : `${baseUnit} * ${multiplier}^${i - 1}`}) * ${responsiveMultiplier}`,
          scalePosition: i,
          generateUtilityClass: true,
          applicableComponents: ['all'],
          viewportAware: true,
          generatedFrom: name,
          accessibilityLevel: 'AAA',
          cognitiveLoad: 1,
          trustLevel: 'low',
          consequence: 'reversible',
        });
        bpIndex++;
      }

      // Container query variants
      let containerIndex = 0;
      for (const container of containerSizes) {
        const containerMultiplier = 0.75 + containerIndex * 0.1875; // 0.75, 0.9375, 1.125, 1.3125, 1.5
        const containerValue = value * containerMultiplier;

        tokens.push({
          name: `@${container}-${name}`,
          value: `${Math.round(containerValue * 100) / 100}rem`,
          category: 'spacing',
          namespace: 'spacing',
          semanticMeaning: `Container-aware spacing ${name} for ${container} container`,
          mathRelationship: `(${system === 'linear' ? `${baseUnit} * ${i}` : `${baseUnit} * ${multiplier}^${i - 1}`}) * ${containerMultiplier}`,
          scalePosition: i,
          generateUtilityClass: true,
          applicableComponents: ['all'],
          containerQueryAware: true,
          generatedFrom: name,
          accessibilityLevel: 'AAA',
          cognitiveLoad: 1,
          trustLevel: 'low',
          consequence: 'reversible',
        });
        containerIndex++;
      }
    }
  }

  return tokens;
}
