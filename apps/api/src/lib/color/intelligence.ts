import { roundOKLCH } from '@rafters/color-utils';
import type { OKLCH } from '@rafters/shared';

interface ColorContext {
  token?: string;
  name?: string;
}

async function generateWithWorkersAI(
  oklch: OKLCH,
  context: ColorContext,
  perceptualWeight: { weight: number; density: 'light' | 'medium' | 'heavy' } | undefined,
  aiBinding: Ai,
) {
  const roundedColor = roundOKLCH(oklch);

  const contextInfo = [
    context.token ? `\nSemantic Role: ${context.token}` : '',
    context.name ? `\nColor Name: ${context.name}` : '',
    perceptualWeight
      ? `\nPerceptual Weight: ${perceptualWeight.weight.toFixed(2)} (${perceptualWeight.density})`
      : '',
  ].join('');

  const messages = [
    {
      role: 'system',
      content: `You are a color naming specialist. Your job is to create UNIQUE, MEMORABLE names for colors.

CRITICAL RULES:
- NEVER use generic words: Azure, Ocean, Sky, Forest, Midnight, Royal, Deep, Soft, Light, Dark, Pale, Bright
- NEVER use compound words like "Something Blue" or "Blue Something"
- Names should be 1-2 words maximum, evocative and unexpected
- Think: places, materials, moments, textures, emotions, objects
- Good examples: Corsica, Patina, Driftwood, Verdigris, Clementine, Pewter, Thistle, Celadon
- Bad examples: Ocean Blue, Deep Azure, Soft Sky, Royal Purple, Midnight Blue`,
    },
    {
      role: 'user',
      content: `Color: OKLCH(${roundedColor.l}, ${roundedColor.c}, ${roundedColor.h})
Lightness: ${roundedColor.l < 0.3 ? 'dark' : roundedColor.l > 0.7 ? 'light' : 'mid-tone'}
Chroma: ${roundedColor.c < 0.05 ? 'neutral/gray' : roundedColor.c < 0.15 ? 'muted' : 'saturated'}
Hue: ${roundedColor.h}deg${contextInfo}

Generate JSON:
{
  "suggestedName": "Single unique word or short phrase. NO generic color words.",
  "reasoning": "Why this OKLCH combination works. Reference L=${roundedColor.l}, C=${roundedColor.c}, H=${roundedColor.h} specifically.",
  "emotionalImpact": "Psychological response. Be specific to THIS color's unique position in OKLCH space.",
  "culturalContext": "Cross-cultural associations for this specific hue/chroma/lightness combination.",
  "accessibilityNotes": "WCAG guidance with L=${roundedColor.l} lightness. Contrast recommendations.",
  "usageGuidance": "UI use cases based on chroma ${roundedColor.c} and lightness ${roundedColor.l}."${
    perceptualWeight
      ? `,
  "balancingGuidance": "Weight ${perceptualWeight.weight.toFixed(2)} (${perceptualWeight.density}). Area ratios and balance strategies."`
      : ''
  }
}`,
    },
  ];

  const response = await aiBinding.run(
    '@cf/meta/llama-4-scout-17b-16e-instruct',
    {
      messages,
      max_tokens: 800,
      temperature: 0.85, // Higher temperature for more unique names
    },
    {
      gateway: {
        id: 'colors',
        cacheTtl: 86400, // Cache for 24 hours - 3 decimal OKLCH precision makes keys unique enough
        collectLogs: false,
      },
    },
  );

  let parsedResponse: Record<string, string>;
  try {
    const jsonMatch = response.response.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : response.response;
    parsedResponse = JSON.parse(jsonString);
  } catch (_error) {
    throw new Error('Invalid AI response format');
  }

  return {
    suggestedName: parsedResponse.suggestedName || 'Unknown Color',
    reasoning: parsedResponse.reasoning || 'No reasoning provided',
    emotionalImpact: parsedResponse.emotionalImpact || 'No emotional impact analysis',
    culturalContext: parsedResponse.culturalContext || 'No cultural context provided',
    accessibilityNotes: parsedResponse.accessibilityNotes || 'No accessibility notes',
    usageGuidance: parsedResponse.usageGuidance || 'No usage guidance provided',
    balancingGuidance: parsedResponse.balancingGuidance || undefined,
  };
}

export function generateCacheKey(oklch: OKLCH): string {
  const rounded = roundOKLCH(oklch);
  return `color-intel:${rounded.l}-${rounded.c}-${rounded.h}`;
}

export async function generateColorIntelligence(oklch: OKLCH, aiBinding: Ai) {
  return generateWithWorkersAI(oklch, {}, undefined, aiBinding);
}
