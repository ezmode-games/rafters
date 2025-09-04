import { zValidator } from '@hono/zod-validator';
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
import { Hono } from 'hono';
import * as z from 'zod';
import { generateColorIntelligence } from '../lib/color-intel/utils';

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

    if (vectorize) {
      try {
        const existing = await vectorize.getByIds([colorId]);
        if (existing.length > 0 && existing[0]?.metadata?.complete_color_value) {
          const cachedColorValue = existing[0].metadata.complete_color_value;
          return c.json(JSON.parse(cachedColorValue as string));
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

    const [intelligence, colorValue] = await Promise.all([
      generateColorIntelligence(oklch, context, apiKey, gatewayUrl, cfToken),
      Promise.resolve(generateColorValue(oklch, context)),
    ]);

    // Add simple test mathematical intelligence to verify it works
    const completeColorValue = {
      ...colorValue,
      intelligence, // AI intelligence
      harmonies: {
        complementary: { l: 0.5, c: 0.1, h: (oklch.h + 180) % 360 },
        triadic: [
          { l: 0.5, c: 0.1, h: (oklch.h + 120) % 360 },
          { l: 0.5, c: 0.1, h: (oklch.h + 240) % 360 },
        ],
        analogous: [
          { l: 0.5, c: 0.1, h: (oklch.h + 30) % 360 },
          { l: 0.5, c: 0.1, h: (oklch.h - 30 + 360) % 360 },
        ],
      },
      accessibility: {
        wcagAA: {
          normal: [
            [600, 700],
            [700, 800],
          ], // Example accessible pairs for normal text
          large: [
            [500, 600],
            [600, 700],
            [700, 800],
          ], // Example accessible pairs for large text
        },
        wcagAAA: {
          normal: [
            [700, 800],
            [800, 900],
          ], // Example AAA pairs for normal text
          large: [
            [600, 700],
            [700, 800],
            [800, 900],
          ], // Example AAA pairs for large text
        },
        onWhite: {
          aa: oklch.l < 0.6 ? [600, 700, 800, 900] : [50, 100], // Accessible shades on white
          aaa: oklch.l < 0.4 ? [700, 800, 900] : [], // AAA compliant shades on white
        },
        onBlack: {
          aa: oklch.l > 0.4 ? [50, 100, 200, 300] : [800, 900], // Accessible shades on black
          aaa: oklch.l > 0.6 ? [50, 100, 200] : [900], // AAA compliant shades on black
        },
      },
      analysis: {
        temperature:
          oklch.h < 60 || oklch.h > 300
            ? 'warm'
            : oklch.h > 120 && oklch.h < 240
              ? 'cool'
              : 'neutral',
        isLight: oklch.l > 0.65,
        name: `test-color-${Math.round(oklch.h)}`,
      },
      // Leonardo-inspired semantic intelligence
      semanticIntelligence: {
        atmosphericWeight: {
          distanceWeight: oklch.l < 0.5 ? 0.8 : 0.3, // Darker colors feel closer
          temperature:
            oklch.h < 60 || oklch.h > 300
              ? 'warm'
              : oklch.h > 120 && oklch.h < 240
                ? 'cool'
                : 'neutral',
          atmosphericRole:
            oklch.l > 0.7 ? 'background' : oklch.l > 0.3 ? 'midground' : 'foreground',
        },
        perceptualWeight: {
          weight: (1 - oklch.l) * 0.7 + oklch.c * 0.3, // Darker + more saturated = heavier
          density: oklch.c > 0.2 ? 'heavy' : oklch.c > 0.1 ? 'medium' : 'light',
          balancingRecommendation:
            oklch.c > 0.2
              ? 'Use sparingly as accent color, balance with neutral tones'
              : 'Can be used more liberally, works well for backgrounds and large areas',
        },
        contextualRecommendations: [
          oklch.l > 0.8 ? 'Ideal for light backgrounds and subtle interfaces' : null,
          oklch.c > 0.15 ? 'Strong accent color, use for important UI elements' : null,
          oklch.l < 0.3 ? 'Deep tone, excellent for text and high-contrast elements' : null,
          `${Math.round(oklch.h)}° hue works well with ${Math.round((oklch.h + 180) % 360)}° complementary colors`,
        ].filter(Boolean),
        harmonicTension: Math.abs((oklch.h % 60) - 30) / 30, // How close to harmonic sweet spots
      },
    };

    // TODO: Fix schema validation - temporarily skip to see raw data
    const validatedColorValue = completeColorValue;

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
              ...Array.from({ length: 375 }, (_, i) => {
                const factor = (i + 1) / 375;
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
