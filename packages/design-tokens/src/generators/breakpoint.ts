/**
 * Breakpoint Generator
 *
 * Responsive breakpoint and container system
 */

import type { Token } from '../index.js';

/**
 * Generate breakpoint and container tokens
 *
 * @returns Array of breakpoint and container tokens with AI intelligence metadata
 */
export function generateBreakpointTokens(): Token[] {
  const tokens: Token[] = [];

  const breakpoints = [
    {
      name: 'xs',
      value: '320px',
      meaning: 'Extra small mobile devices',
      cognitiveLoad: 2,
      trustLevel: 'low' as const,
      usage: ['mobile-first', 'small-phones', 'basic-layout'],
    },
    {
      name: 'sm',
      value: '640px',
      meaning: 'Small tablets and large phones',
      cognitiveLoad: 3,
      trustLevel: 'low' as const,
      usage: ['tablets', 'landscape-phones', 'expanded-layout'],
    },
    {
      name: 'md',
      value: '768px',
      meaning: 'Medium tablets',
      cognitiveLoad: 4,
      trustLevel: 'low' as const,
      usage: ['tablets', 'small-laptops', 'grid-layouts'],
    },
    {
      name: 'lg',
      value: '1024px',
      meaning: 'Large tablets and small laptops',
      cognitiveLoad: 5,
      trustLevel: 'low' as const,
      usage: ['laptops', 'desktop-first', 'complex-layouts'],
    },
    {
      name: 'xl',
      value: '1280px',
      meaning: 'Large laptops and desktops',
      cognitiveLoad: 6,
      trustLevel: 'low' as const,
      usage: ['desktops', 'wide-screens', 'full-layouts'],
    },
    {
      name: '2xl',
      value: '1536px',
      meaning: 'Large desktops and ultrawide',
      cognitiveLoad: 7,
      trustLevel: 'medium' as const,
      usage: ['ultrawide', 'large-displays', 'maximum-layouts'],
    },
  ];

  for (let index = 0; index < breakpoints.length; index++) {
    const bp = breakpoints[index];
    tokens.push({
      name: bp.name,
      value: bp.value,
      category: 'breakpoint',
      namespace: 'screen',
      semanticMeaning: bp.meaning,
      scalePosition: index,
      generateUtilityClass: false, // Breakpoints are used differently
      applicableComponents: ['layout', 'grid', 'responsive'],
      viewportAware: true,
      accessibilityLevel: 'AAA',
      cognitiveLoad: bp.cognitiveLoad,
      trustLevel: bp.trustLevel,
      consequence: 'significant', // Layout changes affect entire experience
      usageContext: bp.usage,
    });
  }

  // Container tokens
  const containers = [
    {
      name: 'xs',
      value: '20rem',
      meaning: 'Extra small container (320px)',
      cognitiveLoad: 2,
      usage: ['mobile-content', 'narrow-layouts', 'constrained'],
    },
    {
      name: 'sm',
      value: '24rem',
      meaning: 'Small container (384px)',
      cognitiveLoad: 3,
      usage: ['tablet-content', 'forms', 'modals'],
    },
    {
      name: 'md',
      value: '28rem',
      meaning: 'Medium container (448px)',
      cognitiveLoad: 4,
      usage: ['content-blocks', 'cards', 'articles'],
    },
    {
      name: 'lg',
      value: '32rem',
      meaning: 'Large container (512px)',
      cognitiveLoad: 5,
      usage: ['main-content', 'sidebars', 'panels'],
    },
    {
      name: 'xl',
      value: '36rem',
      meaning: 'Extra large container (576px)',
      cognitiveLoad: 6,
      usage: ['wide-content', 'dashboards', 'complex-ui'],
    },
    {
      name: '2xl',
      value: '42rem',
      meaning: 'Max width container (672px)',
      cognitiveLoad: 7,
      usage: ['reading-width', 'optimal-line-length', 'typography'],
    },
    {
      name: '3xl',
      value: '48rem',
      meaning: 'Ultra wide container (768px)',
      cognitiveLoad: 8,
      usage: ['wide-layouts', 'data-tables', 'expansive-content'],
    },
    {
      name: '4xl',
      value: '56rem',
      meaning: 'Maximum container (896px)',
      cognitiveLoad: 9,
      usage: ['full-width', 'hero-sections', 'maximum-content'],
    },
  ];

  for (let index = 0; index < containers.length; index++) {
    const container = containers[index];
    tokens.push({
      name: container.name,
      value: container.value,
      category: 'container',
      namespace: 'container',
      semanticMeaning: container.meaning,
      scalePosition: index,
      generateUtilityClass: true,
      applicableComponents: ['layout', 'wrapper', 'max-width'],
      containerQueryAware: true,
      accessibilityLevel: 'AAA',
      cognitiveLoad: container.cognitiveLoad,
      trustLevel: 'medium' as const,
      consequence: 'significant', // Container changes affect layout
      usageContext: container.usage,
    });
  }

  return tokens;
}
