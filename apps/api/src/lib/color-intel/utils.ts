import { roundOKLCH } from '@rafters/color-utils';
import {
  type ColorIntelligence,
  ColorIntelligenceSchema,
  type OKLCH,
  OKLCHSchema,
} from '@rafters/shared';
import { z } from 'zod';

// Input validation schema for the pure function
const PureColorIntelligenceInputSchema = z.object({
  oklch: OKLCHSchema,
  aiBinding: z.any(), // Ai binding type
});

// Pure function that only takes OKLCH and AI binding
export const generateColorIntelligence = async (
  oklch: OKLCH,
  aiBinding: Ai
): Promise<ColorIntelligence> => {
  // Validate inputs
  const input = PureColorIntelligenceInputSchema.parse({ oklch, aiBinding });

  const roundedColor = roundOKLCH(input.oklch);

  const messages = [
    {
      role: 'system',
      content:
        'You are a color theory expert and design system consultant. Generate comprehensive color intelligence for design systems. Be precise, creative, and systematic in your analysis.',
    },
    {
      role: 'user',
      content: `Analyze this OKLCH color: OKLCH(${roundedColor.l}, ${roundedColor.c}, ${roundedColor.h})

Generate analysis in this exact JSON format:

{
  "suggestedName": "A distinctive, evocative color name that captures this color's unique character. Be creative but descriptive.",
  "reasoning": "Explain why this OKLCH combination works psychologically and visually. Include lightness, chroma, and hue effects. 2-3 sentences.",
  "emotionalImpact": "Complete psychological response this color evokes. Cover emotions, cognitive effects, behavioral influences. 2-3 sentences.",
  "culturalContext": "Cross-cultural color associations. Address Western, Eastern, global contexts. 2-3 sentences.",
  "accessibilityNotes": "WCAG guidance with specific contrast ratios, recommended text colors, dark mode considerations. 2-3 sentences.",
  "usageGuidance": "Detailed use cases, contexts to avoid, interaction patterns. Cover UI components, brand applications. 3-4 sentences."
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
        cacheTtl: 3600,
        collectLogs: false,
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

  const intelligence = {
    suggestedName: parsedResponse.suggestedName || 'Unknown Color',
    reasoning: parsedResponse.reasoning || 'No reasoning provided',
    emotionalImpact: parsedResponse.emotionalImpact || 'No emotional impact analysis',
    culturalContext: parsedResponse.culturalContext || 'No cultural context provided',
    accessibilityNotes: parsedResponse.accessibilityNotes || 'No accessibility notes',
    usageGuidance: parsedResponse.usageGuidance || 'No usage guidance provided',
  };

  // Validate output against schema
  return ColorIntelligenceSchema.parse(intelligence);
};

export function generateCacheKey(oklch: OKLCH): string {
  const rounded = roundOKLCH(oklch);
  return `color-intel:${rounded.l}-${rounded.c}-${rounded.h}`;
}
