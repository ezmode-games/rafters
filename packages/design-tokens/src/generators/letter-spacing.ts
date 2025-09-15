/**
 * Letter Spacing Generator
 *
 * Typography spacing system for readability and emphasis
 */

import type { Token } from '../index';

/**
 * Generate letter spacing tokens
 *
 * @returns Array of letter spacing tokens with AI intelligence metadata
 */
export function generateLetterSpacingTokens(): Token[] {
  const tokens: Token[] = [];

  const spacings = [
    {
      name: 'tighter',
      value: '-0.05em',
      meaning: 'Tighter letter spacing for large text',
      cognitiveLoad: 3,
      trustLevel: 'low' as const,
      usage: ['headings', 'display-text', 'tight-layouts'],
    },
    {
      name: 'tight',
      value: '-0.025em',
      meaning: 'Slightly tighter spacing',
      cognitiveLoad: 2,
      trustLevel: 'low' as const,
      usage: ['subheadings', 'labels', 'compact-text'],
    },
    {
      name: 'normal',
      value: '0em',
      meaning: 'Normal letter spacing',
      cognitiveLoad: 1,
      trustLevel: 'low' as const,
      usage: ['body-text', 'paragraphs', 'default'],
    },
    {
      name: 'wide',
      value: '0.025em',
      meaning: 'Wider spacing for readability',
      cognitiveLoad: 2,
      trustLevel: 'low' as const,
      usage: ['captions', 'small-text', 'readability'],
    },
    {
      name: 'wider',
      value: '0.05em',
      meaning: 'Wide spacing for emphasis',
      cognitiveLoad: 3,
      trustLevel: 'low' as const,
      usage: ['emphasis', 'buttons', 'call-to-action'],
    },
    {
      name: 'widest',
      value: '0.1em',
      meaning: 'Maximum spacing for display text',
      cognitiveLoad: 4,
      trustLevel: 'low' as const,
      usage: ['display', 'hero-text', 'branding'],
    },
  ];

  for (let index = 0; index < spacings.length; index++) {
    const spacing = spacings[index];
    tokens.push({
      name: spacing.name,
      value: spacing.value,
      category: 'letter-spacing',
      namespace: 'tracking',
      semanticMeaning: spacing.meaning,
      scalePosition: index,
      generateUtilityClass: true,
      applicableComponents: spacing.name.includes('wide')
        ? ['h1', 'h2', 'display']
        : spacing.name.includes('tight')
          ? ['body', 'caption']
          : ['text'],
      accessibilityLevel: 'AAA',
      cognitiveLoad: spacing.cognitiveLoad,
      trustLevel: spacing.trustLevel,
      consequence: 'reversible',
      usageContext: spacing.usage,
    });
  }

  return tokens;
}
