/**
 * Height Scale Generator
 *
 * Component height system with responsive variants and accessibility validation
 * Ensures proper touch targets and usability across devices
 */

import type { Token } from '../index.js';

/**
 * Mathematical constants for height generation
 */
const GOLDEN_RATIO = 1.618033988749;

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
  multiplier = 1.25,
  generateResponsive = true
): Token[] {
  const tokens: Token[] = [];
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
  const breakpoints = generateResponsive ? ['sm', 'md', 'lg', 'xl'] : [];
  const containerSizes = generateResponsive ? ['xs', 'sm', 'md', 'lg', 'xl'] : [];

  for (let i = 0; i < sizes.length; i++) {
    let value: number;

    switch (system) {
      case 'linear':
        value = baseUnit + i * 0.5; // 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6
        break;
      case 'golden':
        value = baseUnit * GOLDEN_RATIO ** (i * 0.5);
        break;
      case 'custom':
        value = baseUnit * multiplier ** (i * 0.5);
        break;
    }

    const touchTargetSizePx = value * 16; // Convert rem to px
    const meetsAccessibility = touchTargetSizePx >= 44; // WCAG AAA minimum

    // Base token
    tokens.push({
      name: `h-${sizes[i]}`,
      value: `${Math.round(value * 100) / 100}rem`,
      category: 'height',
      namespace: 'height',
      semanticMeaning: `Component height ${sizes[i]} for ${system} scale - ${meetsAccessibility ? 'meets' : 'below'} touch target guidelines`,
      mathRelationship:
        system === 'linear' ? `${baseUnit} + ${i * 0.5}` : `${baseUnit} * ${multiplier}^${i * 0.5}`,
      scalePosition: i,
      touchTargetSize: touchTargetSizePx,
      generateUtilityClass: true,
      applicableComponents: ['button', 'input', 'select', 'card'],
      containerQueryAware: generateResponsive,
      viewportAware: generateResponsive,
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

    // Responsive variants - heights grow on larger screens
    if (generateResponsive) {
      breakpoints.forEach((bp, bpIndex) => {
        const responsiveMultiplier = 1 + bpIndex * 0.1; // 1, 1.1, 1.2, 1.3, 1.4
        const responsiveValue = value * responsiveMultiplier;
        const responsiveTouchTarget = responsiveValue * 16;
        const responsiveMeetsAccessibility = responsiveTouchTarget >= 44;

        tokens.push({
          name: `${bp}-h-${sizes[i]}`,
          value: `${Math.round(responsiveValue * 100) / 100}rem`,
          category: 'height',
          namespace: 'height',
          semanticMeaning: `Responsive height ${sizes[i]} for ${bp} breakpoint - ${responsiveMeetsAccessibility ? 'meets' : 'below'} touch target guidelines`,
          mathRelationship: `(${system === 'linear' ? `${baseUnit} + ${i * 0.5}` : `${baseUnit} * ${multiplier}^${i * 0.5}`}) * ${responsiveMultiplier}`,
          scalePosition: i,
          touchTargetSize: responsiveTouchTarget,
          generateUtilityClass: true,
          applicableComponents: ['button', 'input', 'select', 'card'],
          viewportAware: true,
          generatedFrom: `h-${sizes[i]}`,
          accessibilityLevel: responsiveMeetsAccessibility ? 'AAA' : 'AA',
          cognitiveLoad: i < 2 ? 2 : i < 4 ? 3 : 4,
          trustLevel: 'low',
          consequence: 'reversible',
        });
      });

      // Container query variants - adapt to container size
      containerSizes.forEach((container, containerIndex) => {
        const containerMultiplier = 0.8 + containerIndex * 0.1; // 0.8, 0.9, 1.0, 1.1, 1.2
        const containerValue = value * containerMultiplier;
        const containerTouchTarget = containerValue * 16;
        const containerMeetsAccessibility = containerTouchTarget >= 44;

        tokens.push({
          name: `@${container}-h-${sizes[i]}`,
          value: `${Math.round(containerValue * 100) / 100}rem`,
          category: 'height',
          namespace: 'height',
          semanticMeaning: `Container-aware height ${sizes[i]} for ${container} container - ${containerMeetsAccessibility ? 'meets' : 'below'} touch target guidelines`,
          mathRelationship: `(${system === 'linear' ? `${baseUnit} + ${i * 0.5}` : `${baseUnit} * ${multiplier}^${i * 0.5}`}) * ${containerMultiplier}`,
          scalePosition: i,
          touchTargetSize: containerTouchTarget,
          generateUtilityClass: true,
          applicableComponents: ['button', 'input', 'select', 'card'],
          containerQueryAware: true,
          generatedFrom: `h-${sizes[i]}`,
          accessibilityLevel: containerMeetsAccessibility ? 'AAA' : 'AA',
          cognitiveLoad: i < 2 ? 2 : i < 4 ? 3 : 4,
          trustLevel: 'low',
          consequence: 'reversible',
        });
      });
    }
  }

  return tokens;
}
