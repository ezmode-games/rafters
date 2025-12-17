/**
 * Text embedding generation for semantic color search
 * Uses Workers AI to create meaningful embeddings from color intelligence text
 */

import type { ColorValue, OKLCH } from '@rafters/shared';

// bge-small-en-v1.5 produces 384 dimensions
export const VECTORIZE_DIMENSIONS = 384;

/**
 * Hue categories for metadata filtering
 */
export type HueCategory =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'cyan'
  | 'blue'
  | 'purple'
  | 'magenta'
  | 'neutral';

export function getHueCategory(hue: number, chroma: number): HueCategory {
  // Neutral/achromatic colors have very low chroma
  if (chroma < 0.02) return 'neutral';

  // Map hue degrees to categories
  if (hue >= 345 || hue < 15) return 'red';
  if (hue >= 15 && hue < 45) return 'orange';
  if (hue >= 45 && hue < 75) return 'yellow';
  if (hue >= 75 && hue < 165) return 'green';
  if (hue >= 165 && hue < 195) return 'cyan';
  if (hue >= 195 && hue < 270) return 'blue';
  if (hue >= 270 && hue < 315) return 'purple';
  return 'magenta'; // 315-345
}

export type LightnessCategory = 'dark' | 'mid' | 'light';

export function getLightnessCategory(lightness: number): LightnessCategory {
  if (lightness < 0.35) return 'dark';
  if (lightness > 0.65) return 'light';
  return 'mid';
}

export type ChromaCategory = 'neutral' | 'muted' | 'saturated' | 'vivid';

export function getChromaCategory(chroma: number): ChromaCategory {
  if (chroma < 0.02) return 'neutral';
  if (chroma < 0.08) return 'muted';
  if (chroma < 0.18) return 'saturated';
  return 'vivid';
}

/**
 * Metadata stored with each vector for filtering and retrieval
 */
export interface VectorMetadata {
  // Indexed fields for filtering
  hue_category: HueCategory;
  lightness: LightnessCategory;
  chroma: ChromaCategory;
  token?: string; // semantic role if assigned

  // Full color data for retrieval
  color: ColorValue;
}

/**
 * Build vector metadata from ColorValue
 */
export function buildVectorMetadata(color: ColorValue): VectorMetadata {
  // Get base color from scale[5] (the 500 step) or first available
  const baseColor: OKLCH = color.scale[5] ?? color.scale[0] ?? { l: 0.5, c: 0, h: 0, alpha: 1 };

  return {
    hue_category: getHueCategory(baseColor.h, baseColor.c),
    lightness: getLightnessCategory(baseColor.l),
    chroma: getChromaCategory(baseColor.c),
    token: color.token,
    color,
  };
}

/**
 * Combine intelligence fields into a single searchable text
 * Prioritizes name and emotional content for better semantic matching
 */
export function buildEmbeddingText(color: ColorValue): string {
  const parts: string[] = [];

  // Name is most important for searches like "ocean blue"
  if (color.name) {
    parts.push(color.name);
    parts.push(color.name); // Repeat for emphasis
  }

  // Intelligence fields
  if (color.intelligence) {
    parts.push(color.intelligence.suggestedName);
    parts.push(color.intelligence.emotionalImpact);
    parts.push(color.intelligence.reasoning);
    parts.push(color.intelligence.culturalContext);
    if (color.intelligence.usageGuidance) {
      parts.push(color.intelligence.usageGuidance);
    }
  }

  // Token/semantic role
  if (color.token) {
    parts.push(`semantic role: ${color.token}`);
  }

  // Analysis
  if (color.analysis) {
    parts.push(`${color.analysis.temperature} ${color.analysis.name}`);
  }

  return parts.filter(Boolean).join('. ');
}

/**
 * Generate text embedding using Workers AI
 * Returns 384-dimension vector for Vectorize storage
 */
interface EmbeddingResponse {
  shape?: number[];
  data?: number[][];
  pooling?: string;
}

export async function generateEmbedding(text: string, aiBinding: Ai): Promise<number[]> {
  const response = (await aiBinding.run('@cf/baai/bge-small-en-v1.5', {
    text: [text],
  })) as EmbeddingResponse;

  const embedding = response.data?.[0];

  if (!embedding || embedding.length !== VECTORIZE_DIMENSIONS) {
    throw new Error(
      `Invalid embedding response: expected ${VECTORIZE_DIMENSIONS} dimensions, got ${embedding?.length ?? 0}`,
    );
  }

  return embedding;
}

/**
 * Generate embedding from ColorValue
 * Returns embedding vector and metadata for Vectorize upsert
 */
export async function generateColorEmbedding(
  color: ColorValue,
  aiBinding: Ai,
): Promise<{ embedding: number[]; metadata: VectorMetadata }> {
  const text = buildEmbeddingText(color);
  const embedding = await generateEmbedding(text, aiBinding);
  const metadata = buildVectorMetadata(color);

  return { embedding, metadata };
}

/**
 * Generate embedding for a search query
 * Used when user searches with natural language like "ocean blue" or "warm sunset"
 */
export async function generateQueryEmbedding(query: string, aiBinding: Ai): Promise<number[]> {
  return generateEmbedding(query, aiBinding);
}

/**
 * Build vector ID from OKLCH values
 * Uses the base color (scale[5]) for consistent IDs
 */
export function buildVectorId(color: ColorValue): string {
  const baseColor: OKLCH = color.scale[5] ?? color.scale[0] ?? { l: 0.5, c: 0, h: 0, alpha: 1 };
  return `${baseColor.l.toFixed(3)}-${baseColor.c.toFixed(3)}-${Math.round(baseColor.h)}`;
}

/**
 * Query filters for Vectorize
 */
export interface ColorQueryFilter {
  hue_category?: HueCategory | HueCategory[];
  lightness?: LightnessCategory | LightnessCategory[];
  chroma?: ChromaCategory | ChromaCategory[];
  token?: string;
}

/**
 * Build Vectorize filter from query options
 */
export function buildQueryFilter(filter: ColorQueryFilter): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  if (filter.hue_category) {
    result.hue_category = Array.isArray(filter.hue_category)
      ? { $in: filter.hue_category }
      : filter.hue_category;
  }

  if (filter.lightness) {
    result.lightness = Array.isArray(filter.lightness)
      ? { $in: filter.lightness }
      : filter.lightness;
  }

  if (filter.chroma) {
    result.chroma = Array.isArray(filter.chroma) ? { $in: filter.chroma } : filter.chroma;
  }

  if (filter.token) {
    result.token = filter.token;
  }

  return result;
}
