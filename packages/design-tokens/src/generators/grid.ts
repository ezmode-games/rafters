/**
 * Grid Generator - Tailwind-Native Tokens
 *
 * CSS Grid system that powers Tailwind utilities: grid-cols-*, grid-rows-*
 * Provides mathematical grid layouts for responsive design
 */

import type { Token } from '../index';

/**
 * Generate grid layout tokens for CSS Grid systems
 *
 * @returns Array of grid tokens with AI intelligence metadata
 */
export function generateGridTokens(): Token[] {
  const tokens: Token[] = [];

  // Grid template columns
  const gridColumns = [
    {
      name: 'auto-fit-sm',
      value: 'repeat(auto-fit, minmax(200px, 1fr))',
      meaning: 'Auto-fit grid for small cards',
      cognitiveLoad: 4,
      trustLevel: 'low' as const,
      usage: ['small-cards', 'thumbnails', 'compact-layouts'],
    },
    {
      name: 'auto-fit-md',
      value: 'repeat(auto-fit, minmax(280px, 1fr))',
      meaning: 'Auto-fit grid for medium cards',
      cognitiveLoad: 5,
      trustLevel: 'low' as const,
      usage: ['medium-cards', 'product-grids', 'content-blocks'],
    },
    {
      name: 'auto-fit-lg',
      value: 'repeat(auto-fit, minmax(360px, 1fr))',
      meaning: 'Auto-fit grid for large cards',
      cognitiveLoad: 6,
      trustLevel: 'medium' as const,
      usage: ['large-cards', 'feature-sections', 'hero-grids'],
    },
    {
      name: 'auto-fill-sm',
      value: 'repeat(auto-fill, minmax(200px, 1fr))',
      meaning: 'Auto-fill grid for small items',
      cognitiveLoad: 4,
      trustLevel: 'low' as const,
      usage: ['gallery', 'thumbnails', 'icon-grids'],
    },
    {
      name: 'auto-fill-md',
      value: 'repeat(auto-fill, minmax(280px, 1fr))',
      meaning: 'Auto-fill grid for medium items',
      cognitiveLoad: 5,
      trustLevel: 'low' as const,
      usage: ['portfolio', 'blog-grid', 'product-display'],
    },
    {
      name: 'auto-fill-lg',
      value: 'repeat(auto-fill, minmax(360px, 1fr))',
      meaning: 'Auto-fill grid for large items',
      cognitiveLoad: 6,
      trustLevel: 'medium' as const,
      usage: ['feature-showcase', 'large-content', 'dashboard-widgets'],
    },
    {
      name: '2-cols',
      value: 'repeat(2, 1fr)',
      meaning: 'Two equal columns',
      cognitiveLoad: 2,
      trustLevel: 'low' as const,
      usage: ['two-column', 'side-by-side', 'comparison'],
    },
    {
      name: '3-cols',
      value: 'repeat(3, 1fr)',
      meaning: 'Three equal columns',
      cognitiveLoad: 3,
      trustLevel: 'low' as const,
      usage: ['three-column', 'feature-trio', 'service-grid'],
    },
    {
      name: '4-cols',
      value: 'repeat(4, 1fr)',
      meaning: 'Four equal columns',
      cognitiveLoad: 4,
      trustLevel: 'low' as const,
      usage: ['four-column', 'team-grid', 'stats-display'],
    },
    {
      name: '12-cols',
      value: 'repeat(12, 1fr)',
      meaning: 'Twelve column layout system',
      cognitiveLoad: 8,
      trustLevel: 'high' as const,
      usage: ['complex-layouts', 'bootstrap-like', 'detailed-grids'],
    },
    {
      name: 'sidebar',
      value: '250px 1fr',
      meaning: 'Sidebar with main content',
      cognitiveLoad: 5,
      trustLevel: 'medium' as const,
      usage: ['sidebar-layout', 'navigation', 'admin-panels'],
    },
    {
      name: 'main-sidebar',
      value: '1fr 250px',
      meaning: 'Main content with sidebar',
      cognitiveLoad: 5,
      trustLevel: 'medium' as const,
      usage: ['content-first', 'article-sidebar', 'blog-layouts'],
    },
  ];

  for (let index = 0; index < gridColumns.length; index++) {
    const grid = gridColumns[index];
    tokens.push({
      name: grid.name,
      value: grid.value,
      category: 'grid-template-columns',
      namespace: 'grid-cols',
      semanticMeaning: grid.meaning,
      scalePosition: index,
      generateUtilityClass: true,
      applicableComponents: ['grid', 'layout', 'card-grid', 'dashboard'],
      accessibilityLevel: 'AAA',
      cognitiveLoad: grid.cognitiveLoad,
      trustLevel: grid.trustLevel,
      consequence: 'significant', // Layout changes affect entire page structure
      usageContext: grid.usage,
    });
  }

  // Grid template rows
  const gridRows = [
    {
      name: 'auto',
      value: 'auto',
      meaning: 'Auto-sizing rows',
      cognitiveLoad: 1,
      trustLevel: 'low' as const,
      usage: ['dynamic-content', 'flexible-height', 'content-driven'],
    },
    {
      name: 'header-main-footer',
      value: 'auto 1fr auto',
      meaning: 'Header, main content, footer layout',
      cognitiveLoad: 4,
      trustLevel: 'medium' as const,
      usage: ['page-layout', 'app-structure', 'standard-layout'],
    },
    {
      name: 'equal-2',
      value: 'repeat(2, 1fr)',
      meaning: 'Two equal rows',
      cognitiveLoad: 2,
      trustLevel: 'low' as const,
      usage: ['split-view', 'two-tier', 'before-after'],
    },
    {
      name: 'equal-3',
      value: 'repeat(3, 1fr)',
      meaning: 'Three equal rows',
      cognitiveLoad: 3,
      trustLevel: 'low' as const,
      usage: ['three-tier', 'section-grid', 'timeline'],
    },
    {
      name: 'masonry',
      value: 'masonry',
      meaning: 'Masonry layout rows',
      cognitiveLoad: 7,
      trustLevel: 'high' as const,
      usage: ['pinterest-style', 'dynamic-heights', 'gallery-masonry'],
    },
  ];

  for (let index = 0; index < gridRows.length; index++) {
    const grid = gridRows[index];
    tokens.push({
      name: grid.name,
      value: grid.value,
      category: 'grid-template-rows',
      namespace: 'grid-rows',
      semanticMeaning: grid.meaning,
      scalePosition: index,
      generateUtilityClass: true,
      applicableComponents: ['grid', 'layout', 'card-grid'],
      accessibilityLevel: 'AAA',
      cognitiveLoad: grid.cognitiveLoad,
      trustLevel: grid.trustLevel,
      consequence: 'significant', // Layout changes affect entire page structure
      usageContext: grid.usage,
    });
  }

  return tokens;
}
