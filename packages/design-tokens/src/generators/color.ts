/**
 * Color Generator
 *
 * Generates the neutral color family with 11-position scale.
 * Uses OKLCH color space for perceptually uniform lightness distribution.
 *
 * The neutral scale is the foundation - other color families can be added
 * but neutral is required for backgrounds, borders, and text.
 */

import type { Token, OKLCH, ColorValue } from '@rafters/shared';
import type { ResolvedSystemConfig, GeneratorResult } from './types.js';
import { COLOR_SCALE_POSITIONS } from './types.js';

/**
 * Neutral color OKLCH values based on shadcn zinc palette
 * Converted to OKLCH for perceptual uniformity
 *
 * These are the computed OKLCH equivalents of shadcn's zinc scale:
 * - 50: hsl(0 0% 98%)   -> oklch(0.985 0 0)
 * - 100: hsl(0 0% 96%)  -> oklch(0.967 0 0)
 * - 200: hsl(0 0% 90%)  -> oklch(0.920 0 0)
 * - 300: hsl(0 0% 83%)  -> oklch(0.869 0 0)
 * - 400: hsl(0 0% 64%)  -> oklch(0.707 0 0)
 * - 500: hsl(0 0% 45%)  -> oklch(0.552 0 0)
 * - 600: hsl(0 0% 32%)  -> oklch(0.442 0 0)
 * - 700: hsl(0 0% 25%)  -> oklch(0.370 0 0)
 * - 800: hsl(0 0% 15%)  -> oklch(0.269 0 0)
 * - 900: hsl(0 0% 9%)   -> oklch(0.200 0 0)
 * - 950: hsl(0 0% 4%)   -> oklch(0.141 0 0)
 */
const NEUTRAL_SCALE: Record<string, OKLCH> = {
  '50': { l: 0.985, c: 0, h: 0, alpha: 1 },
  '100': { l: 0.967, c: 0, h: 0, alpha: 1 },
  '200': { l: 0.920, c: 0, h: 0, alpha: 1 },
  '300': { l: 0.869, c: 0, h: 0, alpha: 1 },
  '400': { l: 0.707, c: 0, h: 0, alpha: 1 },
  '500': { l: 0.552, c: 0, h: 0, alpha: 1 },
  '600': { l: 0.442, c: 0, h: 0, alpha: 1 },
  '700': { l: 0.370, c: 0, h: 0, alpha: 1 },
  '800': { l: 0.269, c: 0, h: 0, alpha: 1 },
  '900': { l: 0.200, c: 0, h: 0, alpha: 1 },
  '950': { l: 0.141, c: 0, h: 0, alpha: 1 },
};

/**
 * Convert OKLCH to CSS string
 */
function oklchToCSS(oklch: OKLCH): string {
  const { l, c, h, alpha = 1 } = oklch;
  if (alpha < 1) {
    return `oklch(${l} ${c} ${h} / ${alpha})`;
  }
  return `oklch(${l} ${c} ${h})`;
}

/**
 * Generate neutral color family tokens
 */
export function generateColorTokens(_config: ResolvedSystemConfig): GeneratorResult {
  const tokens: Token[] = [];
  const timestamp = new Date().toISOString();

  // Build the complete scale array for ColorValue
  const scaleArray: OKLCH[] = COLOR_SCALE_POSITIONS.map((pos) => NEUTRAL_SCALE[pos]!);

  // Create the color family token with full intelligence
  const neutralFamily: ColorValue = {
    name: 'neutral',
    scale: scaleArray,
    token: 'neutral',
    use: 'Foundation neutral palette for backgrounds, borders, text, and UI chrome. Derived from shadcn zinc with OKLCH perceptual uniformity.',
  };

  // Create individual scale position tokens
  for (const position of COLOR_SCALE_POSITIONS) {
    const oklch = NEUTRAL_SCALE[position]!;
    const scaleIndex = COLOR_SCALE_POSITIONS.indexOf(position);

    tokens.push({
      name: `neutral-${position}`,
      value: oklchToCSS(oklch),
      category: 'color',
      namespace: 'color',
      semanticMeaning: `Neutral shade at ${position} level - ${
        scaleIndex < 4
          ? 'light background range'
          : scaleIndex < 7
            ? 'mid-tone for borders and secondary text'
            : 'dark foreground range'
      }`,
      usageContext: getUsageContext(position),
      scalePosition: scaleIndex,
      progressionSystem: 'custom', // Neutral uses custom OKLCH lightness curve
      description: `Neutral color at ${position} position (OKLCH L=${oklch.l})`,
      generatedAt: timestamp,
      containerQueryAware: true,
    });
  }

  // Create the family token that holds all the intelligence
  tokens.push({
    name: 'neutral',
    value: neutralFamily,
    category: 'color',
    namespace: 'color',
    semanticMeaning:
      'Complete neutral color family with 11-position scale for UI foundations',
    usageContext: [
      'backgrounds',
      'borders',
      'text',
      'dividers',
      'shadows',
      'overlays',
    ],
    description:
      'Neutral color family - the foundation of the design system. All UI chrome, backgrounds, and text colors derive from this scale.',
    generatedAt: timestamp,
    containerQueryAware: true,
    usagePatterns: {
      do: [
        'Use 50-200 for light mode backgrounds',
        'Use 800-950 for dark mode backgrounds',
        'Use 400-600 for borders and dividers',
        'Use 900-950 for primary text in light mode',
        'Use 50-100 for primary text in dark mode',
      ],
      never: [
        'Mix scale positions that have insufficient contrast',
        'Use without checking accessibility against background',
      ],
    },
  });

  return {
    namespace: 'color',
    tokens,
  };
}

/**
 * Get usage context based on scale position
 */
function getUsageContext(position: string): string[] {
  const pos = parseInt(position, 10);

  if (pos <= 100) {
    return ['backgrounds', 'cards', 'surfaces', 'light-mode-bg'];
  }
  if (pos <= 300) {
    return ['secondary-backgrounds', 'hover-states', 'subtle-borders'];
  }
  if (pos <= 500) {
    return ['borders', 'dividers', 'disabled-states', 'placeholder-text'];
  }
  if (pos <= 700) {
    return ['secondary-text', 'icons', 'input-borders'];
  }
  return ['primary-text', 'headings', 'dark-mode-bg', 'high-contrast-elements'];
}
