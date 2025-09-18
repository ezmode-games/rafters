/**
 * Typography Scale Generator - Tailwind-Native Tokens
 *
 * Mathematical typography system that powers Tailwind utilities: text-*, leading-*
 * Uses musical ratios (golden ratio, perfect fourth, etc.) for harmonious proportions
 */

import type { Token } from '../index';

/**
 * Musical and mathematical ratios for typography generation
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
 * Generate typography scale using golden ratio or musical intervals with responsive variants
 *
 * @param system - Musical interval or mathematical ratio for scaling
 * @param baseSize - Base font size in rem (default: 1rem = 16px)
 * @param generateResponsive - Generate viewport and container query variants (default: true)
 *
 * @returns Array of typography tokens that power Tailwind text utilities
 *
 * @example
 * ```typescript
 * // Generate mathematical typography scale
 * const typography = generateTypographyScale('golden', 1);
 * // Result: --text-lg: 1.125rem, --leading-lg: 1.5
 * // Powers: text-lg, leading-lg utilities
 * ```
 */
export function generateTypographyScale(
  system:
    | 'minor-second'
    | 'major-second'
    | 'minor-third'
    | 'major-third'
    | 'perfect-fourth'
    | 'augmented-fourth'
    | 'perfect-fifth'
    | 'golden' = 'golden',
  baseSize = 1 // rem
): Token[] {
  const tokens: Token[] = [];
  const sizes = [
    'xs', // Small text, captions
    'sm', // Small paragraphs
    'base', // Body text (16px default)
    'lg', // Large text
    'xl', // Small headings
    '2xl', // H4-H5 headings
    '3xl', // H3 headings
    '4xl', // H2 headings
    '5xl', // H1 headings
    '6xl', // Display headings
    '7xl', // Large display
    '8xl', // Hero text
    '9xl', // Massive display
  ];

  let ratio: number;
  switch (system) {
    case 'minor-second':
      ratio = MINOR_SECOND;
      break;
    case 'major-second':
      ratio = MAJOR_SECOND;
      break;
    case 'minor-third':
      ratio = MINOR_THIRD;
      break;
    case 'major-third':
      ratio = MAJOR_THIRD;
      break;
    case 'perfect-fourth':
      ratio = PERFECT_FOURTH;
      break;
    case 'augmented-fourth':
      ratio = AUGMENTED_FOURTH;
      break;
    case 'perfect-fifth':
      ratio = PERFECT_FIFTH;
      break;
    case 'golden':
      ratio = GOLDEN_RATIO;
      break;
  }

  // Start from base (index 2), go down for xs/sm, up for lg+
  for (let i = 0; i < sizes.length; i++) {
    const steps = i - 2; // -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10

    // Use original phi scale sequence
    const value = baseSize * ratio ** steps;

    // Determine cognitive load and usage context based on size
    const isBodyText = i >= 1 && i <= 3;
    const isHeading = i >= 4;
    const isDisplay = i >= 9;

    // Base font size token
    tokens.push({
      name: `text-${sizes[i]}`,
      value: `${Math.round(value * 1000) / 1000}rem`,
      category: 'font-size',
      namespace: 'font-size',
      semanticMeaning: `Typography size ${sizes[i]} using ${system} ratio - ${isDisplay ? 'display/hero' : isHeading ? 'heading' : 'body/ui'} text`,
      scalePosition: i,
      generateUtilityClass: true,
      applicableComponents: ['text', 'heading', 'label', 'button'],
      accessibilityLevel: 'AAA',
      cognitiveLoad: isDisplay ? 8 : isHeading ? 5 : isBodyText ? 2 : 3,
      trustLevel: 'low',
      consequence: 'reversible',
      usageContext: [
        ...(i <= 1 ? ['captions', 'metadata', 'fine-print'] : []),
        ...(isBodyText ? ['body-text', 'paragraphs', 'ui-text'] : []),
        ...(isHeading ? ['headings', 'section-titles'] : []),
        ...(isDisplay ? ['hero', 'display', 'marketing'] : []),
      ],
    });

    // Base line height token - optimized for readability
    const fontSize = value;
    const lineHeight = fontSize < 1 ? 1.6 : fontSize > 2 ? 1.2 : 1.5;

    tokens.push({
      name: `leading-${sizes[i]}`,
      value: lineHeight.toString(),
      category: 'line-height',
      namespace: 'line-height',
      semanticMeaning: `Line height optimized for ${sizes[i]} text readability - ${lineHeight >= 1.5 ? 'comfortable' : 'tight'} spacing`,
      generateUtilityClass: true,
      applicableComponents: ['text', 'heading', 'paragraph'],
      accessibilityLevel: lineHeight >= 1.5 ? 'AAA' : 'AA',
      cognitiveLoad: 1, // Line height is foundational
      trustLevel: 'low',
      consequence: 'reversible',
      usageContext: ['readability', 'text-spacing', 'vertical-rhythm'],
    });
  }

  return tokens;
}
