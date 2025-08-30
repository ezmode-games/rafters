import {
  type ColorIntelligenceResponse,
  ColorIntelligenceResponseSchema,
  type OKLCH,
} from '@rafters/shared';
import { type NextRequest, NextResponse } from 'next/server';
import {
  calculateColorData,
  generateCacheKey,
  generateColorIntelligence,
  validateOKLCH,
} from '../../../lib/color-intel/utils';

interface ColorIntelRequest {
  oklch: { l: number; c: number; h: number };
  token?: string;
  name?: string;
}

interface CloudflareEnv {
  RAFTERS_INTEL: KVNamespace;
  CLAUDE_API_KEY: string;
}

// Utility functions moved to lib/color-intel/utils.ts for testability

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    let body: ColorIntelRequest;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON', message: 'Request body must be valid JSON' },
        { status: 400 }
      );
    }

    // Validate OKLCH input
    if (!validateOKLCH(body.oklch)) {
      return NextResponse.json(
        {
          error: 'Invalid OKLCH values',
          message: 'OKLCH must have l (0-1), c (0+), h (0-360)',
        },
        { status: 400 }
      );
    }

    const oklch: OKLCH = body.oklch;
    const cacheKey = generateCacheKey(oklch);

    // Check cache first
    // In Cloudflare Workers with OpenNext, KV bindings are available on process.env
    const kvNamespace = (process.env as unknown as CloudflareEnv)?.RAFTERS_INTEL;
    if (kvNamespace) {
      try {
        const cached = await kvNamespace.get(cacheKey);
        if (cached) {
          console.log(`Cache hit: ${cacheKey}`);
          const cachedResponse = JSON.parse(cached);
          return NextResponse.json(cachedResponse);
        }
      } catch (cacheError) {
        console.warn('KV cache read failed:', cacheError);
        // Continue without cache
      }
    }

    // Generate intelligence and calculate mathematical data
    console.log(`Generating intelligence: ${cacheKey}`);

    const apiKey = process.env.CLAUDE_API_KEY || '';
    const [intelligence, { harmonies, accessibility, analysis }] = await Promise.all([
      generateColorIntelligence(oklch, { token: body.token, name: body.name }, apiKey),
      Promise.resolve(calculateColorData(oklch)),
    ]);

    // Build complete response
    const response: ColorIntelligenceResponse = {
      intelligence,
      harmonies,
      accessibility,
      analysis,
    };

    // Validate response against schema
    const validatedResponse = ColorIntelligenceResponseSchema.parse(response);

    // Cache the response
    if (kvNamespace) {
      try {
        await kvNamespace.put(cacheKey, JSON.stringify(validatedResponse));
        console.log(`Cached response: ${cacheKey}`);
      } catch (cacheError) {
        console.warn('KV cache write failed:', cacheError);
        // Continue without caching
      }
    }

    return NextResponse.json(validatedResponse);
  } catch (error) {
    console.error('Color intelligence API error:', error);

    if (error instanceof Error && error.message.includes('Intelligence generation failed')) {
      return NextResponse.json(
        { error: 'Intelligence generation failed', message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
