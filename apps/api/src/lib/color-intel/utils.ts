import {
  type ColorContext,
  calculateWCAGContrast,
  generateColorCacheKey,
  generateColorName,
  generateColorValue,
  generateHarmoniousPalette,
  getColorTemperature,
  isLightColor,
  meetsWCAGStandard,
  roundOKLCH,
  validateOKLCH,
} from '@rafters/color-utils';
import type { OKLCH } from '@rafters/shared';
import { getClaudeClient } from '../ai/claude/client';

// Remove duplicate interface - using ColorContext from color-utils

// Using validateOKLCH from @rafters/color-utils to avoid duplication

// Generate consistent cache key using unified rounding
export function generateCacheKey(oklch: OKLCH): string {
  const rounded = roundOKLCH(oklch);
  return `color-intel:${rounded.l}-${rounded.c}-${rounded.h}`;
}

// Generate color intelligence using Claude 3.5 Haiku
export async function generateColorIntelligence(
  oklch: OKLCH,
  context: ColorContext,
  apiKey: string,
  gatewayUrl?: string,
  cfToken?: string
) {
  const client = getClaudeClient(apiKey, gatewayUrl, cfToken);

  // Round color values for consistency
  const roundedColor = roundOKLCH(oklch);

  const contextInfo = [
    context.token ? `\nSemantic Role: ${context.token}` : '',
    context.name ? `\nColor Name: ${context.name}` : '',
  ].join('');

  const prompt = `You are a color theory expert and design system consultant. Analyze the provided OKLCH color and generate comprehensive design intelligence for AI agents and human designers.

Color: OKLCH(${roundedColor.l}, ${roundedColor.c}, ${roundedColor.h})${contextInfo}

Provide exhaustive analysis in this exact JSON structure:

{
  "suggestedName": "A beautiful, descriptive color name that captures this color's character and personality. Examples: 'ocean-depths', 'autumn-ember', 'forest-whisper'. Be creative and evocative.",
  "reasoning": "Detailed explanation of why this specific OKLCH combination works psychologically and visually. Include lightness perception, chroma intensity effects, and hue associations. 2-3 sentences.",
  "emotionalImpact": "Complete psychological response this color evokes in users. Cover emotional associations, cognitive effects, and behavioral influences. Include cultural universals and variations. 2-3 sentences.", 
  "culturalContext": "Cross-cultural color associations and meanings. Address Western, Eastern, and global contexts. Mention any cultural sensitivities or positive associations. 2-3 sentences.",
  "accessibilityNotes": "Comprehensive WCAG guidance including specific contrast ratios, recommended text colors, dark mode considerations, and color vision deficiency compatibility. Include specific shade recommendations. 2-3 sentences.",
  "usageGuidance": "Detailed use cases where this color excels, contexts to avoid, and interaction patterns. Cover UI components, brand applications, and design system roles. Include anti-patterns and warnings. 3-4 sentences."
}

Important guidelines:
- Be specific about OKLCH values and their perceptual effects
- Reference actual contrast ratios when possible
- Provide actionable recommendations, not generic advice
- Consider the semantic role context if provided
- Focus on design system and digital interface applications
- Do NOT generate harmonies - these are calculated mathematically

Return only valid JSON, no additional text.`;

  try {
    const responseText = await client.generateText({
      model: 'claude-3-5-haiku-20241022',
      maxTokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Parse the JSON response
    const intelligence = JSON.parse(responseText);

    // Validate the structure
    if (
      !intelligence.suggestedName ||
      !intelligence.reasoning ||
      !intelligence.emotionalImpact ||
      !intelligence.culturalContext ||
      !intelligence.accessibilityNotes ||
      !intelligence.usageGuidance
    ) {
      throw new Error('Incomplete intelligence response from Claude API');
    }

    return intelligence;
  } catch (error) {
    throw new Error(
      `Intelligence generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

// Calculate mathematical color data using color-utils
export function calculateColorData(oklch: OKLCH) {
  // Round input color for consistency
  const roundedColor = roundOKLCH(oklch);
  const white: OKLCH = { l: 1, c: 0, h: 0 };
  const black: OKLCH = { l: 0, c: 0, h: 0 };

  // Generate harmonies using rounded color
  const harmonies = {
    complementary: generateHarmoniousPalette(roundedColor, 'complementary', 1)[0],
    triadic: generateHarmoniousPalette(roundedColor, 'triadic', 2),
    analogous: generateHarmoniousPalette(roundedColor, 'analogous', 2),
    tetradic: generateHarmoniousPalette(roundedColor, 'tetradic', 3),
    monochromatic: generateHarmoniousPalette(roundedColor, 'monochromatic', 4),
  };

  // Calculate accessibility using rounded color
  const accessibility = {
    onWhite: {
      wcagAA: meetsWCAGStandard(roundedColor, white, 'AA', 'normal'),
      wcagAAA: meetsWCAGStandard(roundedColor, white, 'AAA', 'normal'),
      contrastRatio: calculateWCAGContrast(roundedColor, white),
    },
    onBlack: {
      wcagAA: meetsWCAGStandard(roundedColor, black, 'AA', 'normal'),
      wcagAAA: meetsWCAGStandard(roundedColor, black, 'AAA', 'normal'),
      contrastRatio: calculateWCAGContrast(roundedColor, black),
    },
  };

  // Color analysis using rounded color
  const analysis = {
    temperature: getColorTemperature(roundedColor),
    isLight: isLightColor(roundedColor),
    name: generateColorName(roundedColor),
  };

  return { harmonies, accessibility, analysis };
}
