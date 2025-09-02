import { generateColorCacheKey, validateOKLCH } from '@rafters/color-utils';
import { type ColorIntelligenceResponse, ColorIntelligenceResponseSchema } from '@rafters/shared';
import { Hono } from 'hono';
import { calculateColorData, generateColorIntelligence } from '../lib/color-intel/utils';

interface CloudflareBindings {
  RAFTERS_INTEL: KVNamespace;
  CLAUDE_API_KEY: string;
  CLAUDE_GATEWAY_URL?: string; // Optional CF Gateway URL
  CF_TOKEN?: string; // CF AI Gateway authentication token
}

interface ColorIntelRequest {
  oklch: { l: number; c: number; h: number };
  token?: string;
  name?: string;
}

const colorIntel = new Hono<{ Bindings: CloudflareBindings }>();

colorIntel.post('/', async (c) => {
  try {
    // Parse request body
    let body: ColorIntelRequest;
    try {
      body = await c.req.json();
    } catch (error) {
      return c.json({ error: 'Invalid JSON', message: 'Request body must be valid JSON' }, 400);
    }

    // Validate OKLCH input
    if (!validateOKLCH(body.oklch)) {
      return c.json(
        {
          error: 'Invalid OKLCH values',
          message: 'OKLCH must have l (0-1), c (0+), h (0-360)',
        },
        400
      );
    }

    const oklch = body.oklch;
    const cacheKey = generateColorCacheKey(oklch, { token: body.token, name: body.name });

    // Check cache first
    const kvNamespace = c.env.RAFTERS_INTEL;
    console.log('KV Namespace available:', !!kvNamespace);

    if (kvNamespace) {
      try {
        const cached = await kvNamespace.get(cacheKey);
        if (cached) {
          console.log(`Cache hit: ${cacheKey}`);
          const cachedResponse = JSON.parse(cached);
          return c.json(cachedResponse);
        }
      } catch (cacheError) {
        console.warn('KV cache read failed:', cacheError);
      }
    }

    // Generate intelligence and calculate mathematical data
    console.log(`Generating intelligence: ${cacheKey}`);

    const apiKey = c.env.CLAUDE_API_KEY;
    if (!apiKey) {
      return c.json({ error: 'Missing API key', message: 'CLAUDE_API_KEY not set' }, 500);
    }

    const gatewayUrl = c.env.CLAUDE_GATEWAY_URL;
    const cfToken = c.env.CF_TOKEN;
    const [intelligence, { harmonies, accessibility, analysis }] = await Promise.all([
      generateColorIntelligence(
        oklch,
        { token: body.token, name: body.name },
        apiKey,
        gatewayUrl,
        cfToken
      ),
      Promise.resolve(calculateColorData(oklch)),
    ]);

    // Build complete response
    const response: ColorIntelligenceResponse = {
      intelligence,
      harmonies,
      accessibility,
      analysis,
    };

    // Validate response
    const validatedResponse = ColorIntelligenceResponseSchema.parse(response);

    // Cache the response
    if (kvNamespace) {
      try {
        await kvNamespace.put(cacheKey, JSON.stringify(validatedResponse));
        console.log(`Cached response: ${cacheKey}`);
      } catch (cacheError) {
        console.warn('KV cache write failed:', cacheError);
      }
    }

    return c.json(validatedResponse);
  } catch (error) {
    console.error('Color intelligence API error:', error);

    if (error instanceof Error && error.message.includes('Intelligence generation failed')) {
      return c.json({ error: 'Intelligence generation failed', message: error.message }, 500);
    }

    return c.json({ error: 'Internal server error', message: 'An unexpected error occurred' }, 500);
  }
});

export { colorIntel };
