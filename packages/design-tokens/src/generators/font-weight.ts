/**
 * Font Weight Generator
 *
 * Typography weight system with semantic meaning
 */

import type { Token } from '../index';

export function generateFontWeightTokens(): Token[] {
  const tokens: Token[] = [];

  const weights = [
    {
      name: 'thin',
      value: '100',
      meaning: 'Thin weight for delicate text - use sparingly',
      cognitiveLoad: 3,
      usage: ['fine-print', 'subtle-text'],
    },
    {
      name: 'extralight',
      value: '200',
      meaning: 'Extra light weight - elegant but less readable',
      cognitiveLoad: 3,
      usage: ['decorative', 'large-text'],
    },
    {
      name: 'light',
      value: '300',
      meaning: 'Light weight for subtle text - good readability',
      cognitiveLoad: 2,
      usage: ['captions', 'metadata', 'secondary-text'],
    },
    {
      name: 'normal',
      value: '400',
      meaning: 'Normal weight for body text - optimal readability',
      cognitiveLoad: 1,
      usage: ['body-text', 'paragraphs', 'default'],
    },
    {
      name: 'medium',
      value: '500',
      meaning: 'Medium weight for emphasis - balanced visibility',
      cognitiveLoad: 2,
      usage: ['labels', 'form-text', 'emphasis'],
    },
    {
      name: 'semibold',
      value: '600',
      meaning: 'Semi-bold for subheadings - clear hierarchy',
      cognitiveLoad: 3,
      usage: ['subheadings', 'section-titles', 'ui-labels'],
    },
    {
      name: 'bold',
      value: '700',
      meaning: 'Bold for headings and emphasis - strong hierarchy',
      cognitiveLoad: 4,
      usage: ['headings', 'important-text', 'buttons'],
    },
    {
      name: 'extrabold',
      value: '800',
      meaning: 'Extra bold for strong emphasis - high impact',
      cognitiveLoad: 6,
      usage: ['hero-text', 'display', 'emphasis'],
    },
    {
      name: 'black',
      value: '900',
      meaning: 'Black weight for maximum impact - use sparingly',
      cognitiveLoad: 8,
      usage: ['brand-text', 'hero', 'maximum-impact'],
    },
  ];

  for (let index = 0; index < weights.length; index++) {
    const weight = weights[index];
    tokens.push({
      name: weight.name,
      value: weight.value,
      category: 'font-weight',
      namespace: 'font-weight',
      semanticMeaning: weight.meaning,
      scalePosition: index,
      generateUtilityClass: true,
      applicableComponents:
        weight.name === 'bold'
          ? ['h1', 'h2', 'h3', 'strong', 'button']
          : weight.name === 'normal'
            ? ['p', 'span', 'body', 'text']
            : ['text'],
      accessibilityLevel: weight.name === 'thin' || weight.name === 'extralight' ? 'AA' : 'AAA',
      cognitiveLoad: weight.cognitiveLoad,
      trustLevel: 'low',
      consequence: 'reversible',
      usageContext: weight.usage,
    });
  }

  return tokens;
}
