import {
  calculateAPCAContrast,
  calculateAtmosphericWeight,
  calculatePerceptualWeight,
  calculateWCAGContrast,
  generateAccessibilityMetadata,
  generateColorName,
  generateHarmony,
  generateOKLCHScale,
  generateSemanticColorSuggestions,
  getColorTemperature,
  isLightColor,
} from '@rafters/color-utils';
import type { ColorValue, OKLCH } from '@rafters/shared';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { generateColorIntelligence } from '@/lib/color/intelligence';
import {
  buildQueryFilter,
  type ChromaCategory,
  generateColorEmbedding,
  generateQueryEmbedding,
  type HueCategory,
  type LightnessCategory,
  parseVectorMetadata,
  type VectorMetadata,
} from '@/lib/color/vector';
import type { AppRouteHandler } from '@/lib/types';
import type { GetColorRoute, SearchColorsRoute } from './color.routes';

/**
 * Parse OKLCH from path parameter format "L.LLL-C.CCC-H"
 */
function parseOKLCH(param: string): OKLCH {
  const [l, c, h] = param.split('-').map(Number);
  return { l, c, h, alpha: 1 };
}

/**
 * Build ColorValue from OKLCH using pure math (no AI)
 * Fast path for generators and testing
 */
function buildMathOnlyColorValue(oklch: OKLCH): ColorValue {
  // Generate the 11-position scale
  const scaleRecord = generateOKLCHScale(oklch);
  const scalePositions = [
    '50',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
    '950',
  ];
  const scale = scalePositions
    .map((pos) => scaleRecord[pos])
    .filter((v): v is OKLCH => v !== undefined);

  // Generate harmonies
  const harmony = generateHarmony(oklch);

  // Generate accessibility metadata
  const accessibilityMeta = generateAccessibilityMetadata(scale);

  // Calculate contrast on white/black
  const white: OKLCH = { l: 1, c: 0, h: 0, alpha: 1 };
  const black: OKLCH = { l: 0, c: 0, h: 0, alpha: 1 };
  const contrastOnWhite = calculateWCAGContrast(oklch, white);
  const contrastOnBlack = calculateWCAGContrast(oklch, black);
  const apcaOnWhite = calculateAPCAContrast(oklch, white);
  const apcaOnBlack = calculateAPCAContrast(oklch, black);

  // Get analysis
  const temperature = getColorTemperature(oklch);
  const light = isLightColor(oklch);

  // Get weights
  const atmospheric = calculateAtmosphericWeight(oklch);
  const perceptual = calculatePerceptualWeight(oklch);

  // Get semantic suggestions
  const semanticSuggestions = generateSemanticColorSuggestions(oklch);

  // Build the ColorValue
  const colorValue: ColorValue = {
    name: generateColorName(oklch),
    scale,
    tokenId: `color-${oklch.l.toFixed(3)}-${oklch.c.toFixed(3)}-${Math.round(oklch.h)}`,

    // Harmonies - map to schema format
    harmonies: {
      complementary: harmony.complementary,
      triadic: [harmony.triadic1, harmony.triadic2],
      analogous: [harmony.analogous1, harmony.analogous2],
      tetradic: [harmony.tetradic1, harmony.tetradic2, harmony.tetradic3],
      monochromatic: scale.slice(0, 5), // First 5 scale positions
    },

    // Accessibility
    accessibility: {
      wcagAA: accessibilityMeta.wcagAA,
      wcagAAA: accessibilityMeta.wcagAAA,
      onWhite: {
        wcagAA: contrastOnWhite >= 4.5,
        wcagAAA: contrastOnWhite >= 7,
        contrastRatio: contrastOnWhite,
        aa: accessibilityMeta.onWhite.aa,
        aaa: accessibilityMeta.onWhite.aaa,
      },
      onBlack: {
        wcagAA: contrastOnBlack >= 4.5,
        wcagAAA: contrastOnBlack >= 7,
        contrastRatio: contrastOnBlack,
        aa: accessibilityMeta.onBlack.aa,
        aaa: accessibilityMeta.onBlack.aaa,
      },
      apca: {
        onWhite: apcaOnWhite,
        onBlack: apcaOnBlack,
        minFontSize: Math.abs(apcaOnWhite) >= 60 ? 16 : Math.abs(apcaOnWhite) >= 45 ? 24 : 32,
      },
    },

    // Analysis
    analysis: {
      temperature,
      isLight: light,
      name: generateColorName(oklch),
    },

    // Atmospheric weight
    atmosphericWeight: atmospheric,

    // Perceptual weight
    perceptualWeight: perceptual,

    // Semantic suggestions
    semanticSuggestions,
  };

  return colorValue;
}

/**
 * GET /color/:oklch
 * Get a color by exact OKLCH values
 *
 * Query params:
 * - adhoc=true: Fast path using pure math (no AI, no vector lookup)
 * - sync=true: Wait for AI generation if not cached (requires !adhoc)
 */
export const getColor: AppRouteHandler<GetColorRoute> = async (c) => {
  const { oklch: oklchParam } = c.req.valid('param');
  const { sync, adhoc } = c.req.valid('query');

  const oklch = parseOKLCH(oklchParam);
  const vectorId = `${oklch.l.toFixed(3)}-${oklch.c.toFixed(3)}-${Math.round(oklch.h)}`;

  // Fast path: ad-hoc math-only response (no AI, no vector lookup)
  if (adhoc) {
    const colorValue = buildMathOnlyColorValue(oklch);
    return c.json(
      {
        color: colorValue,
        status: 'found' as const,
      },
      HttpStatusCodes.OK,
    );
  }

  // Standard path: Try cache lookup first
  try {
    const results = await c.env.VECTORIZE.getByIds([vectorId]);
    if (results.length > 0 && results[0]?.metadata) {
      const rawMetadata = results[0].metadata as unknown as VectorMetadata;
      const parsed = parseVectorMetadata(rawMetadata);
      return c.json(
        {
          color: parsed.color,
          status: 'found' as const,
        },
        HttpStatusCodes.OK,
      );
    }
  } catch {
    // Cache miss or error - fall through to generation
  }

  // If not sync, return math-only immediately
  if (!sync) {
    const colorValue = buildMathOnlyColorValue(oklch);
    return c.json(
      {
        color: colorValue,
        status: 'generating' as const,
        requestId: `pending-ai-${vectorId}`,
      },
      HttpStatusCodes.OK,
    );
  }

  // Sync mode: Generate AI intelligence and store to Vectorize
  const colorValue = buildMathOnlyColorValue(oklch);

  try {
    // Generate AI intelligence with uncertainty quantification
    const intelligence = await generateColorIntelligence(oklch, c.env.AI, c.env.CORE_API);

    // Add intelligence to color value
    const colorWithIntelligence: ColorValue = {
      ...colorValue,
      intelligence: {
        reasoning: intelligence.reasoning,
        emotionalImpact: intelligence.emotionalImpact,
        culturalContext: intelligence.culturalContext,
        accessibilityNotes: intelligence.accessibilityNotes,
        usageGuidance: intelligence.usageGuidance,
        balancingGuidance: intelligence.balancingGuidance,
        metadata: intelligence.metadata,
      },
    };

    // Generate embedding and store to Vectorize
    const { embedding, metadata } = await generateColorEmbedding(colorWithIntelligence, c.env.AI);

    await c.env.VECTORIZE.upsert([
      {
        id: vectorId,
        values: embedding,
        metadata: metadata as unknown as Record<string, string | number | boolean | string[]>,
      },
    ]);

    return c.json(
      {
        color: colorWithIntelligence,
        status: 'found' as const,
      },
      HttpStatusCodes.OK,
    );
  } catch (error) {
    // AI generation failed - return math-only with error info
    console.error('AI generation failed:', error);
    return c.json(
      {
        color: colorValue,
        status: 'error' as const,
        error: error instanceof Error ? error.message : 'AI generation failed',
      },
      HttpStatusCodes.OK,
    );
  }
};

/**
 * GET /color/search
 * Semantic search for colors
 */
export const searchColors: AppRouteHandler<SearchColorsRoute> = async (c) => {
  const { q, hue, lightness, chroma, token, limit } = c.req.valid('query');

  // Generate embedding for the search query
  const queryEmbedding = await generateQueryEmbedding(q, c.env.AI);

  // Build filter from query params
  const filter = buildQueryFilter({
    hue_category: hue as HueCategory | undefined,
    lightness: lightness as LightnessCategory | undefined,
    chroma: chroma as ChromaCategory | undefined,
    token,
  });

  // Query Vectorize
  const hasFilter = Object.keys(filter).length > 0;
  const searchResults = await c.env.VECTORIZE.query(queryEmbedding, {
    topK: limit,
    filter: hasFilter ? (filter as Record<string, string | number | boolean>) : undefined,
    returnMetadata: 'all',
  });

  // Map results to response format
  const results = searchResults.matches.map((match) => {
    const rawMetadata = match.metadata as unknown as VectorMetadata;
    const parsed = parseVectorMetadata(rawMetadata);
    return {
      color: parsed.color,
      score: match.score,
    };
  });

  return c.json(
    {
      results,
      query: q,
      total: results.length,
    },
    HttpStatusCodes.OK,
  );
};
