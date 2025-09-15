/**
 * Font Family Generator
 *
 * Semantic font stack system with fallbacks
 */

import type { Token } from '../index';

/**
 * Generate font family tokens
 *
 * @returns Array of font family tokens with AI intelligence metadata
 */
export function generateFontFamilyTokens(): Token[] {
  const tokens: Token[] = [];

  const fontFamilies = [
    {
      name: 'sans',
      value: '"Inter", system-ui, sans-serif',
      meaning: 'Primary sans-serif for UI and body text - optimized for readability',
      cognitiveLoad: 1,
      trustLevel: 'low' as const,
      usage: ['body-text', 'ui-text', 'buttons', 'forms', 'navigation'],
      personality: 'clean, modern, readable',
    },
    {
      name: 'serif',
      value: '"Crimson Text", Georgia, serif',
      meaning: 'Serif font for editorial content - traditional, trustworthy feel',
      cognitiveLoad: 2,
      trustLevel: 'low' as const,
      usage: ['articles', 'blog-posts', 'editorial', 'long-form'],
      personality: 'traditional, authoritative, elegant',
    },
    {
      name: 'mono',
      value: '"JetBrains Mono", "Fira Code", monospace',
      meaning: 'Monospace font for code and data - technical precision',
      cognitiveLoad: 3,
      trustLevel: 'low' as const,
      usage: ['code', 'data', 'tables', 'technical', 'programming'],
      personality: 'technical, precise, systematic',
    },
    {
      name: 'display',
      value: '"Inter Display", system-ui, sans-serif',
      meaning: 'Display font for headings and marketing - optimized for large sizes',
      cognitiveLoad: 4,
      trustLevel: 'medium' as const,
      usage: ['headings', 'hero-text', 'marketing', 'branding', 'display'],
      personality: 'bold, attention-grabbing, modern',
    },
  ];

  for (let index = 0; index < fontFamilies.length; index++) {
    const font = fontFamilies[index];
    tokens.push({
      name: font.name,
      value: font.value,
      category: 'font-family',
      namespace: 'font',
      semanticMeaning: font.meaning,
      scalePosition: index,
      generateUtilityClass: true,
      applicableComponents:
        font.name === 'mono'
          ? ['code', 'pre', 'kbd', 'data-table']
          : font.name === 'display'
            ? ['h1', 'h2', 'hero', 'heading']
            : font.name === 'serif'
              ? ['article', 'blog', 'content', 'text']
              : ['all'],
      accessibilityLevel: 'AAA',
      cognitiveLoad: font.cognitiveLoad,
      trustLevel: font.trustLevel,
      consequence: 'reversible',
      usageContext: font.usage,
    });
  }

  return tokens;
}
