import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import * as z from 'zod';

import {
  calculateWCAGContrast,
  generateColorValue,
  generateHarmony,
  getColorTemperature,
  isLightColor,
  meetsWCAGStandard,
  validateOKLCH,
} from '@rafters/color-utils';
import { ColorValueSchema, OKLCHSchema } from '@rafters/shared';
import { generateColorIntelligence } from '../lib/color-intel/utils';

// Vectorize requires exactly 384 dimensions for color intelligence vectors
// Structure: 4 OKLCH values + 5 semantic dimensions + 375 mathematical functions
// The 375 additional dimensions provide deterministic mathematical encoding
// of color relationships using trigonometric functions of OKLCH components
const VECTORIZE_ADDITIONAL_DIMENSIONS = 375;

interface CloudflareBindings {
  VECTORIZE: VectorizeIndex;
  CLAUDE_API_KEY: string;
  CF_TOKEN: string;
  CLAUDE_GATEWAY_URL: string;
}

const ColorIntelRequest = z.object({
  oklch: OKLCHSchema,
  token: z.string().optional(),
  name: z.string().optional(),
  expire: z.boolean().optional(), // Force cache invalidation, skip AI generation
});

const colorIntel = new Hono<{ Bindings: CloudflareBindings }>();

colorIntel.post('/', zValidator('json', ColorIntelRequest), async (c) => {
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

    // Generate AI intelligence and mathematical data
    const apiKey = c.env.CLAUDE_API_KEY;
    if (!apiKey) {
      return c.json({ error: 'Missing API key', message: 'CLAUDE_API_KEY not set' }, 500);
    }

    const gatewayUrl = c.env.CLAUDE_GATEWAY_URL;
    const cfToken = c.env.CF_TOKEN;
    const context = { token: data.token, name: data.name };

    // Generate fresh mathematical data, reuse existing AI intelligence if available
    const colorValue = generateColorValue(oklch, context);

    let intelligence: {
      suggestedName: string;
      reasoning: string;
      emotionalImpact: string;
      culturalContext: string;
      accessibilityNotes: string;
      usageGuidance: string;
    };
    if (existingIntelligence) {
      // Reuse existing AI intelligence when expire flag is set
      intelligence = existingIntelligence;
    } else {
      // Generate new AI intelligence only if none exists
      intelligence = await generateColorIntelligence(oklch, context, apiKey, gatewayUrl, cfToken);
    }

    // Use mathematical color intelligence from generateColorValue
    const completeColorValue = {
      ...colorValue,
      intelligence, // AI intelligence from Claude API
    };

    // Validate completeColorValue against ColorValueSchema
    const validatedColorValue = ColorValueSchema.parse(completeColorValue);

    // Store in Vectorize for future semantic search
    if (vectorize) {
      try {
        await vectorize.upsert([
          {
            id: colorId,
            values: [
              oklch.l,
              oklch.c,
              oklch.h,
              oklch.alpha || 1,
              // Deterministic semantic dimensions based on OKLCH only
              oklch.h < 60 || oklch.h > 300 ? 1 : 0, // Warm hues (red-yellow range)
              oklch.l > 0.65 ? 1 : 0, // Light colors
              oklch.c > 0.15 ? 1 : 0, // High chroma/saturation
              Math.sin((oklch.h * Math.PI) / 180), // Hue as sine
              Math.cos((oklch.h * Math.PI) / 180), // Hue as cosine
              // Fill remaining dimensions with deterministic mathematical functions of OKLCH
              ...Array.from({ length: VECTORIZE_ADDITIONAL_DIMENSIONS }, (_, i) => {
                const factor = (i + 1) / VECTORIZE_ADDITIONAL_DIMENSIONS;
                return Math.sin(oklch.h * factor) * oklch.c * oklch.l;
              }),
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

    return c.json(validatedColorValue);
  } catch (error) {
    console.error('Color intelligence API error:', error);

    if (error instanceof z.ZodError) {
      return c.json(
        {
          error: 'Validation failed',
          message: error.issues
            .map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`)
            .join(', '),
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
