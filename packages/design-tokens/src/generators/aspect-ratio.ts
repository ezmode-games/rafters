/**
 * Aspect Ratio Generator - Tailwind-Native Tokens
 *
 * Mathematical aspect ratio system that powers Tailwind utilities: aspect-*
 * Provides proportional ratios including golden ratio and common media formats
 */

import type { Token } from '../index';

/**
 * Generate aspect ratio tokens
 *
 * @returns Array of aspect ratio tokens with AI intelligence metadata
 */
export function generateAspectRatioTokens(): Token[] {
  const tokens: Token[] = [];

  const ratios = [
    {
      name: 'square',
      value: '1 / 1',
      meaning: 'Square aspect ratio for avatars and icons',
      cognitiveLoad: 1,
      trustLevel: 'low' as const,
      usage: ['avatars', 'icons', 'logos', 'buttons', 'thumbnails'],
    },
    {
      name: 'video',
      value: '16 / 9',
      meaning: 'Video aspect ratio for media content',
      cognitiveLoad: 2,
      trustLevel: 'low' as const,
      usage: ['video', 'media', 'hero-images', 'presentations'],
    },
    {
      name: 'photo',
      value: '4 / 3',
      meaning: 'Photo aspect ratio for images',
      cognitiveLoad: 2,
      trustLevel: 'low' as const,
      usage: ['photos', 'images', 'galleries', 'previews'],
    },
    {
      name: 'golden',
      value: '1.618 / 1',
      meaning: 'Golden ratio for aesthetic layouts',
      cognitiveLoad: 4,
      trustLevel: 'medium' as const,
      usage: ['aesthetic-layouts', 'artistic', 'design-focused'],
    },
    {
      name: 'portrait',
      value: '3 / 4',
      meaning: 'Portrait orientation',
      cognitiveLoad: 3,
      trustLevel: 'low' as const,
      usage: ['portraits', 'mobile-media', 'vertical-content'],
    },
    {
      name: 'landscape',
      value: '4 / 3',
      meaning: 'Landscape orientation',
      cognitiveLoad: 3,
      trustLevel: 'low' as const,
      usage: ['landscapes', 'horizontal-media', 'wide-content'],
    },
    {
      name: 'ultrawide',
      value: '21 / 9',
      meaning: 'Ultrawide aspect ratio',
      cognitiveLoad: 5,
      trustLevel: 'medium' as const,
      usage: ['ultrawide', 'cinematic', 'banner', 'header-images'],
    },
  ];

  for (let index = 0; index < ratios.length; index++) {
    const ratio = ratios[index];
    tokens.push({
      name: ratio.name,
      value: ratio.value,
      category: 'aspect-ratio',
      namespace: 'aspect',
      semanticMeaning: ratio.meaning,
      scalePosition: index,
      generateUtilityClass: true,
      applicableComponents: ratio.name.includes('video')
        ? ['video', 'iframe', 'embed']
        : ratio.name.includes('square')
          ? ['avatar', 'icon', 'logo']
          : ratio.name.includes('photo')
            ? ['img', 'figure']
            : ['media'],
      accessibilityLevel: 'AAA',
      cognitiveLoad: ratio.cognitiveLoad,
      trustLevel: ratio.trustLevel,
      consequence: 'reversible',
      usageContext: ratio.usage,
    });
  }

  return tokens;
}
