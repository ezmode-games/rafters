/**
 * Color Generator
 *
 * Generates color family tokens with 11-position scale.
 * Uses OKLCH color space for perceptually uniform lightness distribution.
 *
 * This generator is a pure function - it receives color scales as input.
 * Default scales are provided by the orchestrator from defaults.ts.
 */

import type { ColorValue, OKLCH, Token } from '@rafters/shared';
import type { ColorScaleInput } from './defaults.js';
import type { GeneratorResult, ResolvedSystemConfig } from './types.js';
import { COLOR_SCALE_POSITIONS } from './types.js';

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
 * Generate color family tokens from provided color scales
 */
export function generateColorTokens(
  _config: ResolvedSystemConfig,
  colorScales: ColorScaleInput[],
): GeneratorResult {
  const tokens: Token[] = [];
  const timestamp = new Date().toISOString();

  for (const colorScale of colorScales) {
    const { name, scale, description } = colorScale;

    // Build the complete scale array for ColorValue
    const scaleArray: OKLCH[] = COLOR_SCALE_POSITIONS.map((pos) => scale[pos]).filter(
      (v): v is OKLCH => v !== undefined,
    );

    // Create the color family token with full intelligence
    const colorFamily: ColorValue = {
      name,
      scale: scaleArray,
      token: name,
      use: description ?? `${name} color palette for UI elements.`,
    };

    // Create individual scale position tokens
    for (const position of COLOR_SCALE_POSITIONS) {
      const oklch = scale[position];
      if (!oklch) continue;
      const scaleIndex = COLOR_SCALE_POSITIONS.indexOf(position);

      tokens.push({
        name: `${name}-${position}`,
        value: oklchToCSS(oklch),
        category: 'color',
        namespace: 'color',
        semanticMeaning: `${name} shade at ${position} level - ${
          scaleIndex < 4
            ? 'light background range'
            : scaleIndex < 7
              ? 'mid-tone for borders and secondary text'
              : 'dark foreground range'
        }`,
        usageContext: getUsageContext(position),
        scalePosition: scaleIndex,
        progressionSystem: 'custom', // Color uses custom OKLCH lightness curve
        description: `${name} color at ${position} position (OKLCH L=${oklch.l})`,
        generatedAt: timestamp,
        containerQueryAware: true,
      });
    }

    // Create the family token that holds all the intelligence
    tokens.push({
      name,
      value: colorFamily,
      category: 'color',
      namespace: 'color',
      semanticMeaning: `Complete ${name} color family with 11-position scale`,
      usageContext: ['backgrounds', 'borders', 'text', 'dividers', 'shadows', 'overlays'],
      description:
        description ??
        `${name} color family - all shades from light to dark for this color palette.`,
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
  }

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
