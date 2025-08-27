/**
 * Width Generator
 *
 * Width token system for component sizing
 */

import type { Token } from '../index.js';

/**
 * Generate width tokens for component sizing
 *
 * @returns Array of width tokens with AI intelligence metadata
 */
export function generateWidthTokens(): Token[] {
  const tokens: Token[] = [];

  const widthScale = [
    {
      name: 'min',
      value: 'min-content',
      meaning: 'Minimum content width',
      cognitiveLoad: 3,
      trustLevel: 'low' as const,
      usage: ['intrinsic-sizing', 'content-driven', 'flexible-layouts'],
    },
    {
      name: 'max',
      value: 'max-content',
      meaning: 'Maximum content width',
      cognitiveLoad: 4,
      trustLevel: 'low' as const,
      usage: ['natural-width', 'content-expansion', 'inline-content'],
    },
    {
      name: 'fit',
      value: 'fit-content',
      meaning: 'Fit content width',
      cognitiveLoad: 3,
      trustLevel: 'low' as const,
      usage: ['adaptive-sizing', 'responsive-content', 'dynamic-width'],
    },
    {
      name: 'full',
      value: '100%',
      meaning: 'Full width',
      cognitiveLoad: 1,
      trustLevel: 'low' as const,
      usage: ['full-width', 'container-fill', 'block-elements'],
    },
    {
      name: 'screen',
      value: '100vw',
      meaning: 'Full viewport width',
      cognitiveLoad: 5,
      trustLevel: 'medium' as const,
      usage: ['viewport-width', 'full-screen', 'edge-to-edge'],
    },
    {
      name: 'prose',
      value: '65ch',
      meaning: 'Optimal reading width',
      cognitiveLoad: 2,
      trustLevel: 'low' as const,
      usage: ['reading-content', 'articles', 'typography', 'readability'],
    },
    {
      name: 'dialog-sm',
      value: '320px',
      meaning: 'Small dialog width',
      cognitiveLoad: 3,
      trustLevel: 'medium' as const,
      usage: ['small-modals', 'confirmations', 'simple-dialogs'],
    },
    {
      name: 'dialog-md',
      value: '480px',
      meaning: 'Medium dialog width',
      cognitiveLoad: 4,
      trustLevel: 'medium' as const,
      usage: ['standard-modals', 'forms', 'content-dialogs'],
    },
    {
      name: 'dialog-lg',
      value: '640px',
      meaning: 'Large dialog width',
      cognitiveLoad: 5,
      trustLevel: 'medium' as const,
      usage: ['large-modals', 'detailed-forms', 'rich-content'],
    },
    {
      name: 'dialog-xl',
      value: '800px',
      meaning: 'Extra large dialog width',
      cognitiveLoad: 6,
      trustLevel: 'high' as const,
      usage: ['complex-modals', 'multi-column', 'advanced-interfaces'],
    },
    {
      name: 'sidebar',
      value: '280px',
      meaning: 'Standard sidebar width',
      cognitiveLoad: 3,
      trustLevel: 'medium' as const,
      usage: ['navigation-sidebar', 'standard-nav', 'side-panels'],
    },
    {
      name: 'sidebar-sm',
      value: '240px',
      meaning: 'Compact sidebar width',
      cognitiveLoad: 2,
      trustLevel: 'low' as const,
      usage: ['compact-nav', 'minimal-sidebar', 'icon-nav'],
    },
    {
      name: 'sidebar-lg',
      value: '320px',
      meaning: 'Wide sidebar width',
      cognitiveLoad: 4,
      trustLevel: 'medium' as const,
      usage: ['wide-navigation', 'rich-sidebar', 'detailed-nav'],
    },
  ];

  for (let index = 0; index < widthScale.length; index++) {
    const width = widthScale[index];
    tokens.push({
      name: width.name,
      value: width.value,
      category: 'width',
      namespace: 'w',
      semanticMeaning: width.meaning,
      scalePosition: index,
      generateUtilityClass: true,
      applicableComponents: width.name.includes('dialog')
        ? ['dialog', 'modal']
        : width.name.includes('sidebar')
          ? ['sidebar', 'navigation']
          : width.name === 'prose'
            ? ['content', 'article']
            : ['layout'],
      accessibilityLevel: 'AAA',
      cognitiveLoad: width.cognitiveLoad,
      trustLevel: width.trustLevel,
      consequence: width.trustLevel === 'high' ? 'significant' : 'reversible',
      usageContext: width.usage,
    });
  }

  return tokens;
}
