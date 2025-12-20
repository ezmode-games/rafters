import { roundOKLCH } from '@rafters/color-utils';
import type { OKLCH } from '@rafters/shared';
import {
  buildConfidenceMetadata,
  calculateInputConfidence,
  scoreResponseQuality,
  UncertaintyClient,
} from '@/lib/uncertainty/client';

interface ColorContext {
  token?: string;
  name?: string;
}

interface ColorIntelligence {
  reasoning: string;
  emotionalImpact: string;
  culturalContext: string;
  accessibilityNotes: string;
  usageGuidance: string;
  balancingGuidance?: string;
  metadata?: {
    predictionId: string;
    confidence: number;
    uncertaintyBounds: {
      lower: number;
      upper: number;
      confidenceInterval: number;
    };
    qualityScore: number;
    method: 'bootstrap' | 'quantile' | 'ensemble' | 'bayesian' | 'conformal';
  };
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
      content: `You are a color analysis specialist. Your job is to provide insights about colors in OKLCH color space, focusing on emotional impact, cultural context, accessibility, and usage guidance.`,
    },
    {
      role: 'user',
      content: `Color: OKLCH(${roundedColor.l}, ${roundedColor.c}, ${roundedColor.h})
Lightness: ${roundedColor.l < 0.3 ? 'dark' : roundedColor.l > 0.7 ? 'light' : 'mid-tone'}
Chroma: ${roundedColor.c < 0.05 ? 'neutral/gray' : roundedColor.c < 0.15 ? 'muted' : 'saturated'}
Hue: ${roundedColor.h}deg${contextInfo}

Generate JSON:
{
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

/**
 * Generate color intelligence with uncertainty quantification
 *
 * Records prediction before AI call and outcome after, attaching
 * confidence metadata to the response.
 */
export async function generateColorIntelligence(
  oklch: OKLCH,
  aiBinding: Ai,
  platformApi?: Fetcher,
): Promise<ColorIntelligence> {
  const startTime = Date.now();
  const colorId = generateCacheKey(oklch);
  const inputConfidence = calculateInputConfidence(oklch);

  let predictionId: string | null = null;

  // Record prediction before AI generation (if platform API available)
  if (platformApi) {
    const uncertaintyClient = new UncertaintyClient(platformApi);
    predictionId = await uncertaintyClient.recordPrediction({
      service: 'component',
      prediction: {
        oklch,
        expectedAnalysis: 'color_intelligence',
        inputQuality: {
          validOKLCH: true,
          lightnessRange: oklch.l,
          chromaLevel: oklch.c,
          hueValue: oklch.h,
        },
      },
      confidence: inputConfidence,
      method: 'bootstrap',
      context: {
        requestId: colorId,
        timestamp: new Date().toISOString(),
        metadata: { cached: false },
      },
    });
  }

  // Generate AI intelligence
  const intelligence = await generateWithWorkersAI(oklch, {}, undefined, aiBinding);

  // Record outcome after AI generation
  if (platformApi && predictionId) {
    const uncertaintyClient = new UncertaintyClient(platformApi);
    const processingTime = Date.now() - startTime;

    await uncertaintyClient.updateOutcome(predictionId, {
      actualOutcome: {
        intelligenceGenerated: true,
        responseQuality: scoreResponseQuality(intelligence),
        completeness: {
          reasoning: !!intelligence.reasoning,
          emotionalImpact: !!intelligence.emotionalImpact,
          culturalContext: !!intelligence.culturalContext,
          accessibilityNotes: !!intelligence.accessibilityNotes,
          usageGuidance: !!intelligence.usageGuidance,
        },
        processingTime,
        aiProvider: 'workers-ai',
      },
    });
  }

  // Build and attach confidence metadata
  const qualityScore = scoreResponseQuality(intelligence);
  const metadata = buildConfidenceMetadata(predictionId, inputConfidence, qualityScore);

  return {
    ...intelligence,
    metadata: metadata ?? undefined,
  };
}
