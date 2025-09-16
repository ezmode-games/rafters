import { type ColorContext, roundOKLCH } from '@rafters/color-utils';
import type { OKLCH } from '@rafters/shared';

async function generateWithWorkersAI(
  oklch: OKLCH,
  context: ColorContext,
  perceptualWeight?: { weight: number; density: 'light' | 'medium' | 'heavy' },
  aiBinding?: Ai
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
      content:
        'You are a color theory expert and design system consultant. Generate comprehensive color intelligence for design systems. Be precise, creative, and systematic in your analysis.',
    },
    {
      role: 'user',
      content: `Analyze this OKLCH color: OKLCH(${roundedColor.l}, ${roundedColor.c}, ${roundedColor.h})${contextInfo}

Generate analysis in this exact JSON format:

{
  "suggestedName": "A distinctive, evocative color name that captures this color's unique character. Be creative but descriptive.",
  "reasoning": "Explain why this OKLCH combination works psychologically and visually. Include lightness, chroma, and hue effects. 2-3 sentences.",
  "emotionalImpact": "Complete psychological response this color evokes. Cover emotions, cognitive effects, behavioral influences. 2-3 sentences.",
  "culturalContext": "Cross-cultural color associations. Address Western, Eastern, global contexts. 2-3 sentences.",
  "accessibilityNotes": "WCAG guidance with specific contrast ratios, recommended text colors, dark mode considerations. 2-3 sentences.",
  "usageGuidance": "Detailed use cases, contexts to avoid, interaction patterns. Cover UI components, brand applications. 3-4 sentences."${
    perceptualWeight
      ? `,
  "balancingGuidance": "Based on perceptual weight ${perceptualWeight.weight.toFixed(2)} (${perceptualWeight.density} density), provide specific visual balance guidance. Area ratios, UI element types, layout equilibrium strategies. 2-3 sentences."`
      : ''
  }
}

Be specific about OKLCH values and their perceptual effects. Focus on unique, non-generic insights.`,
    },
  ];

  const response = await aiBinding.run(
    '@cf/meta/llama-4-scout-17b-16e-instruct',
    {
      messages,
      max_tokens: 800,
      temperature: 0.7,
    },
    {
      gateway: {
        id: 'colors',
        // Enable caching and skip_cache for better performance
        cacheTtl: 3600, // Cache AI responses for 1 hour
        collectLogs: false, // Disable logging for better performance
      },
    }
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

export async function generateColorIntelligence(
  oklch: OKLCH,
  context: ColorContext,
  _apiKey: string,
  _gatewayUrl?: string,
  _cfToken?: string,
  perceptualWeight?: { weight: number; density: 'light' | 'medium' | 'heavy' },
  aiBinding?: Ai
) {
  if (!aiBinding) {
    throw new Error('AI binding required for color intelligence generation');
  }

  return generateWithWorkersAI(oklch, context, perceptualWeight, aiBinding);
}
