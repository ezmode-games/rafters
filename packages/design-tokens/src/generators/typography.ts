/**
 * Typography Generator
 *
 * Generates typography tokens using mathematical progressions.
 * Uses minor-third (1.2) ratio for a harmonious type scale.
 *
 * Default font: Noto Sans Variable (supports all weights, excellent i18n)
 */

import type { Token } from '@rafters/shared';
import { generateModularScale, getRatio } from '@rafters/math-utils';
import type { ResolvedSystemConfig, GeneratorResult } from './types.js';
import { TYPOGRAPHY_SCALE } from './types.js';

/**
 * Font weight definitions
 */
const FONT_WEIGHTS = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
} as const;

/**
 * Line height mappings for each type scale
 * Tighter for large text, looser for small text
 */
const LINE_HEIGHTS: Record<string, string> = {
  xs: '1.5',
  sm: '1.5',
  base: '1.5',
  lg: '1.5',
  xl: '1.4',
  '2xl': '1.35',
  '3xl': '1.3',
  '4xl': '1.25',
  '5xl': '1.2',
  '6xl': '1.15',
  '7xl': '1.1',
  '8xl': '1.1',
  '9xl': '1.1',
};

/**
 * Letter spacing adjustments for each type scale
 * Tighter for large text, normal/looser for small text
 */
const LETTER_SPACING: Record<string, string> = {
  xs: '0.025em',
  sm: '0.01em',
  base: '0',
  lg: '0',
  xl: '-0.01em',
  '2xl': '-0.015em',
  '3xl': '-0.02em',
  '4xl': '-0.025em',
  '5xl': '-0.03em',
  '6xl': '-0.035em',
  '7xl': '-0.04em',
  '8xl': '-0.04em',
  '9xl': '-0.04em',
};

/**
 * Generate typography tokens
 */
export function generateTypographyTokens(config: ResolvedSystemConfig): GeneratorResult {
  const tokens: Token[] = [];
  const timestamp = new Date().toISOString();
  const { baseFontSize, fontFamily, monoFontFamily, progressionRatio } = config;

  const ratioValue = getRatio(progressionRatio);

  // Generate modular scale for font sizes
  const modularScale = generateModularScale(progressionRatio as 'minor-third', baseFontSize, 6);

  // Map scale positions to computed sizes
  const fontSizes: Record<string, number> = {
    xs: modularScale.smaller[4] ?? baseFontSize * 0.75,
    sm: modularScale.smaller[3] ?? baseFontSize * 0.875,
    base: modularScale.base,
    lg: modularScale.larger[0] ?? baseFontSize * 1.125,
    xl: modularScale.larger[1] ?? baseFontSize * 1.25,
    '2xl': modularScale.larger[2] ?? baseFontSize * 1.5,
    '3xl': modularScale.larger[3] ?? baseFontSize * 1.875,
    '4xl': modularScale.larger[4] ?? baseFontSize * 2.25,
    '5xl': modularScale.larger[5] ?? baseFontSize * 3,
    '6xl': (modularScale.larger[5] ?? baseFontSize * 3) * ratioValue,
    '7xl': (modularScale.larger[5] ?? baseFontSize * 3) * ratioValue ** 2,
    '8xl': (modularScale.larger[5] ?? baseFontSize * 3) * ratioValue ** 3,
    '9xl': (modularScale.larger[5] ?? baseFontSize * 3) * ratioValue ** 4,
  };

  // Font family tokens
  tokens.push({
    name: 'font-sans',
    value: fontFamily,
    category: 'typography',
    namespace: 'typography',
    semanticMeaning: 'Primary font family for UI text',
    usageContext: ['body-text', 'ui-elements', 'buttons', 'forms'],
    description: 'Sans-serif font family. Noto Sans Variable provides excellent language support and all weight variations.',
    generatedAt: timestamp,
    containerQueryAware: false,
    localeAware: true,
    usagePatterns: {
      do: [
        'Use for all UI text',
        'Rely on variable font for weight variations',
      ],
      never: [
        'Mix with other sans-serif fonts',
        'Use fixed font files when variable is available',
      ],
    },
  });

  tokens.push({
    name: 'font-mono',
    value: monoFontFamily,
    category: 'typography',
    namespace: 'typography',
    semanticMeaning: 'Monospace font family for code',
    usageContext: ['code-blocks', 'inline-code', 'technical-data', 'tabular-numbers'],
    description: 'System monospace stack for code and technical content.',
    generatedAt: timestamp,
    containerQueryAware: false,
    usagePatterns: {
      do: [
        'Use for all code content',
        'Use for tabular number displays',
      ],
      never: [
        'Use for body text',
        'Use for UI elements',
      ],
    },
  });

  // Base font size token
  tokens.push({
    name: 'font-size-base',
    value: `${baseFontSize}px`,
    category: 'typography',
    namespace: 'typography',
    semanticMeaning: 'Base font size - all other sizes derive from this',
    usageContext: ['body-text', 'calculation-reference'],
    progressionSystem: progressionRatio as 'minor-third',
    description: `Base font size (${baseFontSize}px). Typography scale uses ${progressionRatio} ratio (${ratioValue}).`,
    generatedAt: timestamp,
    containerQueryAware: true,
    usagePatterns: {
      do: ['Reference as the root calculation base'],
      never: ['Change without understanding full scale impact'],
    },
  });

  // Generate font size tokens
  for (const scale of TYPOGRAPHY_SCALE) {
    const size = fontSizes[scale]!;
    const roundedSize = Math.round(size * 100) / 100;
    const remSize = Math.round((size / baseFontSize) * 1000) / 1000;
    const scaleIndex = TYPOGRAPHY_SCALE.indexOf(scale);
    const lineHeight = LINE_HEIGHTS[scale]!;
    const letterSpacing = LETTER_SPACING[scale]!;

    let meaning: string;
    let usageContext: string[];

    if (scaleIndex <= 1) {
      meaning = 'Small text for captions, labels, and secondary information';
      usageContext = ['captions', 'labels', 'helper-text', 'metadata'];
    } else if (scaleIndex <= 3) {
      meaning = 'Body text range for primary content';
      usageContext = ['body-text', 'paragraphs', 'ui-text'];
    } else if (scaleIndex <= 6) {
      meaning = 'Heading text for section titles';
      usageContext = ['headings', 'section-titles', 'emphasis'];
    } else {
      meaning = 'Display text for hero sections and major headings';
      usageContext = ['hero-text', 'display-headings', 'marketing'];
    }

    tokens.push({
      name: `font-size-${scale}`,
      value: `${remSize}rem`,
      category: 'typography',
      namespace: 'typography',
      lineHeight,
      semanticMeaning: meaning,
      usageContext,
      scalePosition: scaleIndex,
      progressionSystem: progressionRatio as 'minor-third',
      mathRelationship: scaleIndex === 2 ? 'base' : `base × ${ratioValue}^${scaleIndex - 2}`,
      dependsOn: ['font-size-base'],
      description: `Font size ${scale} = ${roundedSize}px (${remSize}rem). Line height: ${lineHeight}, letter spacing: ${letterSpacing}`,
      generatedAt: timestamp,
      containerQueryAware: true,
    });

    // Also create line-height tokens
    tokens.push({
      name: `line-height-${scale}`,
      value: lineHeight,
      category: 'typography',
      namespace: 'typography',
      semanticMeaning: `Line height for ${scale} text size`,
      dependsOn: [`font-size-${scale}`],
      description: `Line height ${lineHeight} for ${scale} text. Tighter for large text, looser for small.`,
      generatedAt: timestamp,
      containerQueryAware: false,
    });

    // And letter-spacing tokens
    tokens.push({
      name: `letter-spacing-${scale}`,
      value: letterSpacing,
      category: 'typography',
      namespace: 'typography',
      semanticMeaning: `Letter spacing for ${scale} text size`,
      dependsOn: [`font-size-${scale}`],
      description: `Letter spacing ${letterSpacing} for ${scale} text. Negative for large text improves readability.`,
      generatedAt: timestamp,
      containerQueryAware: false,
    });
  }

  // Generate font weight tokens
  for (const [name, weight] of Object.entries(FONT_WEIGHTS)) {
    tokens.push({
      name: `font-weight-${name}`,
      value: String(weight),
      category: 'typography',
      namespace: 'typography',
      semanticMeaning: `${name.charAt(0).toUpperCase() + name.slice(1)} font weight (${weight})`,
      usageContext: name === 'normal' ? ['body-text'] : name === 'medium' || name === 'semibold' ? ['headings', 'emphasis', 'labels'] : name === 'bold' || name === 'extrabold' ? ['strong-emphasis', 'display'] : ['special-cases'],
      description: `Font weight ${weight} (${name})`,
      generatedAt: timestamp,
      containerQueryAware: false,
    });
  }

  // Typography scale metadata
  tokens.push({
    name: 'typography-progression',
    value: JSON.stringify({
      ratio: progressionRatio,
      ratioValue,
      baseFontSize,
      scale: Object.fromEntries(
        Object.entries(fontSizes).map(([k, v]) => [k, Math.round(v * 100) / 100])
      ),
    }),
    category: 'typography',
    namespace: 'typography',
    semanticMeaning: 'Metadata about the typography progression system',
    description: `Typography uses ${progressionRatio} progression (ratio ${ratioValue}) from base ${baseFontSize}px.`,
    generatedAt: timestamp,
    containerQueryAware: false,
  });

  return {
    namespace: 'typography',
    tokens,
  };
}
