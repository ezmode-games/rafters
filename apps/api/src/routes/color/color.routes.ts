import { createRoute, z } from '@hono/zod-openapi';
import { ColorValueSchema } from '@rafters/shared';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';

// Schema for OKLCH path parameter (format: "0.500-0.120-240")
const OKLCHParamSchema = z
  .string()
  .regex(/^\d+\.\d{3}-\d+\.\d{3}-\d+$/, 'OKLCH format: L.LLL-C.CCC-H (e.g., 0.500-0.120-240)');

// Schema for search query parameters
const SearchQuerySchema = z.object({
  q: z
    .string()
    .min(1)
    .describe('Natural language search query (e.g., "ocean blue", "warm sunset")'),
  hue: z
    .enum(['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'magenta', 'neutral'])
    .optional(),
  lightness: z.enum(['dark', 'mid', 'light']).optional(),
  chroma: z.enum(['neutral', 'muted', 'saturated', 'vivid']).optional(),
  token: z.string().optional().describe('Filter by semantic token (e.g., "primary")'),
  limit: z.coerce.number().min(1).max(100).default(10),
});

// Schema for search results
const SearchResultSchema = z.object({
  results: z.array(
    z.object({
      color: ColorValueSchema,
      score: z.number().min(0).max(1),
    }),
  ),
  query: z.string(),
  total: z.number(),
});

// Schema for get response (includes generation status)
const ColorResponseSchema = z.object({
  color: ColorValueSchema.nullable(),
  status: z.enum(['found', 'generating', 'queued']),
  requestId: z.string().optional(),
});

/**
 * GET /color/:oklch
 * Get a color by exact OKLCH values
 * Returns cached color or triggers generation
 */
export const getColor = createRoute({
  method: 'get',
  path: '/color/{oklch}',
  request: {
    params: z.object({
      oklch: OKLCHParamSchema,
    }),
    query: z.object({
      sync: z.coerce.boolean().default(false).describe('Wait for AI generation if not cached'),
    }),
  },
  tags: ['Color'],
  summary: 'Get color by OKLCH values',
  description:
    'Retrieves a color from the cache or generates it. Use sync=true to wait for generation.',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(ColorResponseSchema, 'Color found or generated'),
    [HttpStatusCodes.ACCEPTED]: jsonContent(ColorResponseSchema, 'Color queued for generation'),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      z.object({ error: z.string() }),
      'Invalid OKLCH format',
    ),
  },
});

/**
 * GET /color/search
 * Semantic search for colors using natural language
 */
export const searchColors = createRoute({
  method: 'get',
  path: '/color/search',
  request: {
    query: SearchQuerySchema,
  },
  tags: ['Color'],
  summary: 'Search colors by natural language',
  description: 'Find colors matching a natural language query with optional category filters',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(SearchResultSchema, 'Search results'),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      z.object({ error: z.string() }),
      'Invalid search parameters',
    ),
  },
});

export type GetColorRoute = typeof getColor;
export type SearchColorsRoute = typeof searchColors;
