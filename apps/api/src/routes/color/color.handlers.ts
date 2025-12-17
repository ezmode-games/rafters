import type { OKLCH } from '@rafters/shared';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import {
  buildQueryFilter,
  type ChromaCategory,
  generateQueryEmbedding,
  type HueCategory,
  type LightnessCategory,
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
 * GET /color/:oklch
 * Get a color by exact OKLCH values
 *
 * TODO: Implement buildColorValue() when generator system is rebuilt
 * - generateColorValue() was deleted, needs redesign
 * - Should compose: generateOKLCHScale, generateHarmony, generateAccessibilityMetadata,
 *   calculateAtmosphericWeight, calculatePerceptualWeight, generateSemanticColorSuggestions
 * - Plus AI intelligence from generateColorIntelligence()
 */
export const getColor: AppRouteHandler<GetColorRoute> = async (c) => {
  const { oklch: oklchParam } = c.req.valid('param');
  const { sync: _sync } = c.req.valid('query');

  const oklch = parseOKLCH(oklchParam);
  const vectorId = `${oklch.l.toFixed(3)}-${oklch.c.toFixed(3)}-${Math.round(oklch.h)}`;

  // Try cache lookup
  try {
    const results = await c.env.VECTORIZE.getByIds([vectorId]);
    if (results.length > 0 && results[0]?.metadata) {
      const metadata = results[0].metadata as unknown as VectorMetadata;
      return c.json(
        {
          color: metadata.color,
          status: 'found' as const,
        },
        HttpStatusCodes.OK,
      );
    }
  } catch {
    // Cache miss or error
  }

  // TODO: Generator system needs rebuild
  // For now, return not implemented
  return c.json(
    {
      color: null,
      status: 'queued' as const,
      requestId: `stub-${vectorId}`,
    },
    HttpStatusCodes.ACCEPTED,
  );
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
    const metadata = match.metadata as unknown as VectorMetadata;
    return {
      color: metadata.color,
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
