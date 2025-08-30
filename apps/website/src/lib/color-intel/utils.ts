import {
  calculateWCAGContrast,
  generateColorName,
  generateHarmoniousPalette,
  getColorTemperature,
  isLightColor,
  meetsWCAGStandard,
} from '@rafters/color-utils';
import type { OKLCH } from '@rafters/shared';
import { getClaudeClient } from '../ai/claude/client';

interface ColorContext {
  token?: string;
  name?: string;
}

// Validate OKLCH input values
export function validateOKLCH(oklch: unknown): oklch is OKLCH {
  if (!oklch || typeof oklch !== 'object') {
    return false;
  }

  const candidate = oklch as Record<string, unknown>;
  const { l, c, h } = candidate;

  if (typeof l !== 'number' || l < 0 || l > 1) {
    return false;
  }

  if (typeof c !== 'number' || c < 0) {
    return false;
  }

  if (typeof h !== 'number' || h < 0 || h > 360) {
    return false;
  }

  return true;
}

// Generate consistent cache key
export function generateCacheKey(oklch: OKLCH): string {
  return `color-intel:${oklch.l.toFixed(3)}-${oklch.c.toFixed(3)}-${oklch.h.toFixed(1)}`;
}

// Generate color intelligence using Claude 3.5 Haiku
export async function generateColorIntelligence(
  oklch: OKLCH,
  context: ColorContext,
  apiKey: string
) {
  const client = getClaudeClient(apiKey);

  const contextInfo = [
    context.token ? `\nSemantic Role: ${context.token}` : '',
    context.name ? `\nColor Name: ${context.name}` : '',
  ].join('');

  const prompt = `You are a color theory expert and design system consultant. Analyze the provided OKLCH color and generate comprehensive design intelligence for AI agents and human designers.

Color: OKLCH(${oklch.l}, ${oklch.c}, ${oklch.h})${contextInfo}

Provide exhaustive analysis in this exact JSON structure:

{
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
    console.error('Claude API error:', error);
    throw new Error(
      `Intelligence generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

// Calculate mathematical color data using color-utils
export function calculateColorData(oklch: OKLCH) {
  const white: OKLCH = { l: 1, c: 0, h: 0 };
  const black: OKLCH = { l: 0, c: 0, h: 0 };

  // Generate harmonies
  const harmonies = {
    complementary: generateHarmoniousPalette(oklch, 'complementary', 1)[0],
    triadic: generateHarmoniousPalette(oklch, 'triadic', 2),
    analogous: generateHarmoniousPalette(oklch, 'analogous', 2),
    tetradic: generateHarmoniousPalette(oklch, 'tetradic', 3),
    monochromatic: generateHarmoniousPalette(oklch, 'monochromatic', 4),
  };

  // Calculate accessibility
  const accessibility = {
    onWhite: {
      wcagAA: meetsWCAGStandard(oklch, white, 'AA', 'normal'),
      wcagAAA: meetsWCAGStandard(oklch, white, 'AAA', 'normal'),
      contrastRatio: calculateWCAGContrast(oklch, white),
    },
    onBlack: {
      wcagAA: meetsWCAGStandard(oklch, black, 'AA', 'normal'),
      wcagAAA: meetsWCAGStandard(oklch, black, 'AAA', 'normal'),
      contrastRatio: calculateWCAGContrast(oklch, black),
    },
  };

  // Color analysis
  const analysis = {
    temperature: getColorTemperature(oklch),
    isLight: isLightColor(oklch),
    name: generateColorName(oklch),
  };

  return { harmonies, accessibility, analysis };
}
