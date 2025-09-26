import { zValidator } from '@hono/zod-validator';
import { ColorValueSchema, generateColorValue, validateOKLCH } from '@rafters/shared';
import { Hono } from 'hono';
import * as z from 'zod';
import { generateColorIntelligence } from '../lib/color-intel/utils';
import {
  calculateInputConfidence,
  D1UncertaintyClient,
  scoreResponseQuality,
} from '../lib/uncertainty/client';

// Local OKLCH schema to avoid import issues
const OKLCHSchema = z.object({
  l: z.number().min(0).max(1),
  c: z.number().min(0),
  h: z.number().min(0).max(360),
  alpha: z.number().min(0).max(1).optional(),
});

// Vectorize requires exactly 384 dimensions for color intelligence vectors
// Structure: 4 OKLCH values + 5 semantic dimensions + 375 mathematical functions
// The 375 additional dimensions provide deterministic mathematical encoding
// of color relationships using trigonometric functions of OKLCH components
const VECTORIZE_ADDITIONAL_DIMENSIONS = 375;

/**
 * Generate deterministic vector dimensions with optimized mathematical functions
 * Edge-optimized for Cloudflare Workers with minimal memory allocation
 * Uses pre-computed constants and efficient trigonometric patterns
 */
function generateVectorDimensions(oklch: { l: number; c: number; h: number }): number[] {
  // Pre-allocate array for better memory efficiency in Workers
  const dimensions = new Array<number>(VECTORIZE_ADDITIONAL_DIMENSIONS);

  // Pre-compute expensive operations once
  const hueRad = (oklch.h * Math.PI) / 180;
  const hueCos = Math.cos(hueRad);
  const chromaScale = oklch.c * 10; // Scale chroma for better distribution
  const lightnessScale = oklch.l * 2; // Scale lightness for better distribution
  const chromaLightness = oklch.c * oklch.l;

  // Optimized generation with pre-computed values and efficient loops
  let i = 0;

  // Batch 1: Hue-based trigonometric variations (125 dimensions)
  for (; i < 125; i++) {
    const factor = (i + 1) * 0.002666667; // Pre-compute division: 1/375
    dimensions[i] = Math.sin(hueRad * factor) * chromaScale * lightnessScale;
  }

  // Batch 2: Chroma-lightness combinations (125 dimensions)
  for (; i < 250; i++) {
    const factor = (i - 124) * 0.008; // Pre-compute: 1/125
    dimensions[i] = Math.cos(hueRad * factor) * chromaLightness;
  }

  // Batch 3: Complex harmonic relationships (125 dimensions)
  for (; i < VECTORIZE_ADDITIONAL_DIMENSIONS; i++) {
    const factor = (i - 249) * 0.008; // Pre-compute: 1/125
    const harmonic = Math.sin(factor * Math.PI);
    const modulation = hueCos * factor * 0.01; // Use pre-computed cosine
    dimensions[i] = harmonic * modulation * chromaLightness;
  }

  return dimensions;
}

const ColorIntelRequest = z.object({
  oklch: OKLCHSchema,
  expire: z.boolean().optional(), // Force cache invalidation, skip AI generation
});

const colorIntel = new Hono<{ Bindings: Env }>();

colorIntel.post('/', zValidator('json', ColorIntelRequest), async (c) => {
  const startTime = Date.now();
  let predictionId: string | undefined;

  try {
    const data = c.req.valid('json');

    // Validate OKLCH input
    if (!validateOKLCH(data.oklch)) {
      return c.json(
        {
          error: 'Invalid OKLCH values',
          message: 'OKLCH must have l (0-1), c (0+), h (0-360)',
        },
        400
      );
    }

    const oklch = data.oklch;
    const colorId = `oklch-${oklch.l.toFixed(2)}-${oklch.c.toFixed(2)}-${oklch.h.toFixed(0)}`;
    const vectorize = c.env.VECTORIZE;

    // Initialize uncertainty client
    const uncertaintyClient = new D1UncertaintyClient(c.env.DB);

    // Check for existing cached data
    let existingIntelligence = null;
    if (vectorize) {
      try {
        const existing = await vectorize.getByIds([colorId]);
        if (existing.length > 0 && existing[0]?.metadata?.complete_color_value) {
          const cachedColorValue = JSON.parse(existing[0].metadata.complete_color_value as string);

          // If expire flag is not set, return cached data
          if (!data.expire) {
            return c.json(cachedColorValue);
          }

          // If expire flag is set, save existing AI intelligence for reuse
          existingIntelligence = cachedColorValue.intelligence;
        }
      } catch (vectorError) {
        console.warn('Vectorize read failed:', vectorError);
      }
    }

    // Generate fresh mathematical data, reuse existing AI intelligence if available
    const colorValue = generateColorValue(oklch);

    let intelligence: {
      suggestedName: string;
      reasoning: string;
      emotionalImpact: string;
      culturalContext: string;
      accessibilityNotes: string;
      usageGuidance: string;
      balancingGuidance?: string; // New field for perceptual weight recommendations
    };

    // Calculate input confidence once for reuse
    const inputConfidence = calculateInputConfidence(oklch);

    if (existingIntelligence) {
      // Reuse existing AI intelligence when expire flag is set
      intelligence = existingIntelligence;
    } else {
      // Record prediction before AI generation
      predictionId = await uncertaintyClient.recordPrediction({
        service: 'component',
        prediction: {
          oklch: oklch,
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
          metadata: {
            cached: false,
            vectorizeEnabled: !!vectorize,
          },
        },
      });

      // Generate new AI intelligence using Workers AI
      intelligence = await generateColorIntelligence(oklch, c.env.AI);

      // Validate AI response quality and record outcome
      if (predictionId) {
        const responseQuality = scoreResponseQuality(intelligence);
        const processingTime = Date.now() - startTime;

        await uncertaintyClient.updateOutcome(predictionId, {
          actualOutcome: {
            intelligenceGenerated: true,
            responseQuality: responseQuality,
            completeness: {
              suggestedName: !!intelligence.suggestedName,
              reasoning: !!intelligence.reasoning,
              emotionalImpact: !!intelligence.emotionalImpact,
              culturalContext: !!intelligence.culturalContext,
              accessibilityNotes: !!intelligence.accessibilityNotes,
              usageGuidance: !!intelligence.usageGuidance,
            },
            processingTime: processingTime,
            aiProvider: 'workers-ai',
          },
        });
      }
    }

    // Replace any <AI_GENERATE> tokens with AI-generated content
    const processedColorValue = { ...colorValue };
    if (processedColorValue.perceptualWeight?.balancingRecommendation === '<AI_GENERATE>') {
      processedColorValue.perceptualWeight.balancingRecommendation =
        intelligence.balancingGuidance ||
        `Weight: ${processedColorValue.perceptualWeight.weight.toFixed(2)} - ${processedColorValue.perceptualWeight.density} visual density`;
    }

    // Calculate confidence metadata for the response
    const confidenceMetadata = predictionId
      ? {
          predictionId,
          confidence: inputConfidence,
          uncertaintyBounds: {
            lower: Math.max(0, inputConfidence - 0.1),
            upper: Math.min(1, inputConfidence + 0.05),
            confidenceInterval: 0.95,
          },
          qualityScore: scoreResponseQuality(intelligence),
          method: 'bootstrap' as const,
        }
      : undefined;

    // Use mathematical color intelligence from generateColorValue
    const completeColorValue = {
      ...processedColorValue,
      intelligence: {
        ...intelligence, // AI intelligence from Workers AI
        metadata: confidenceMetadata, // Add uncertainty quantification metadata
      },
    };

    // Validate completeColorValue against ColorValueSchema
    const validatedColorValue = ColorValueSchema.parse(completeColorValue);

    // Store in Vectorize with optimized vector generation
    if (vectorize) {
      try {
        // Pre-compute semantic dimensions for efficiency
        const hueRad = (oklch.h * Math.PI) / 180;
        const isWarmHue = oklch.h < 60 || oklch.h > 300 ? 1 : 0;
        const isLightColor = oklch.l > 0.65 ? 1 : 0;
        const isHighChroma = oklch.c > 0.15 ? 1 : 0;

        await vectorize.upsert([
          {
            id: colorId,
            values: [
              oklch.l,
              oklch.c,
              oklch.h,
              oklch.alpha || 1,
              // Pre-computed semantic dimensions for better performance
              isWarmHue, // Warm hues (red-yellow range)
              isLightColor, // Light colors
              isHighChroma, // High chroma/saturation
              Math.sin(hueRad), // Hue as sine (use pre-computed)
              Math.cos(hueRad), // Hue as cosine (use pre-computed)
              // Fill remaining dimensions with optimized mathematical functions
              ...generateVectorDimensions(oklch),
            ],
            metadata: {
              complete_color_value: JSON.stringify(validatedColorValue),
            },
          },
        ]);
      } catch (vectorError) {
        console.warn('Vectorize write failed:', vectorError);
      }
    }

    // Return with edge-optimized caching headers
    return c.json(validatedColorValue, 200, {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400', // Cache 1hr client, 24hr edge
      'Content-Type': 'application/json',
      ETag: `"${colorId}"`, // Enable conditional requests
    });
  } catch (error) {
    console.error('Color intelligence API error:', error);

    // If we have a predictionId, record the error as an outcome
    if (predictionId) {
      try {
        const uncertaintyClient = new D1UncertaintyClient(c.env.DB);
        await uncertaintyClient.updateOutcome(predictionId, {
          actualOutcome: {
            intelligenceGenerated: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            processingTime: Date.now() - startTime,
            stage: 'error',
          },
        });
      } catch (uncertaintyError) {
        console.warn('Failed to record error outcome:', uncertaintyError);
      }
    }

    if (error instanceof z.ZodError) {
      return c.json(
        {
          error: 'Validation failed',
          message: error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
        },
        400
      );
    }

    return c.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      },
      500
    );
  }
});

export { colorIntel };
