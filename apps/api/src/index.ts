/**
 * Rafters API - Cloudflare Workers entry point
 * Provides color intelligence and design token services
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { z } from 'zod';

// Environment bindings interface
interface Env {
  RAFTERS_INTEL: KVNamespace;
  RAFTERS_CACHE: KVNamespace;
  RAFTERS_COLORS: D1Database;
  CLAUDE_API_KEY: string;
  OPENAI_API_KEY: string;
  ENVIRONMENT: string;
  DEBUG: string;
}

const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use('*', cors());
app.use('*', logger());

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    environment: c.env.ENVIRONMENT || 'unknown',
    timestamp: new Date().toISOString(),
  });
});

// Color intelligence endpoint
const ColorRequestSchema = z.object({
  color: z.string().min(1, 'Color is required'),
  format: z.enum(['hex', 'rgb', 'hsl', 'oklch']).optional().default('hex'),
});

app.post('/api/color/intelligence', async (c) => {
  try {
    const body = await c.req.json();
    const { color, format } = ColorRequestSchema.parse(body);

    // Check cache first
    const cacheKey = `color:${color}:${format}`;
    const cached = await c.env.RAFTERS_CACHE.get(cacheKey);

    if (cached) {
      return c.json(JSON.parse(cached));
    }

    // Generate color intelligence (would use Claude API in real implementation)
    const intelligence = {
      color,
      format,
      accessibility: {
        contrastRatio: 4.5, // Placeholder
        wcagLevel: 'AA' as const,
      },
      psychology: {
        emotion: 'trust',
        meaning: 'professional',
      },
      usage: {
        primary: color.includes('blue'),
        backgrounds: true,
        text: false,
      },
      generated: new Date().toISOString(),
    };

    // Cache the result
    await c.env.RAFTERS_CACHE.put(cacheKey, JSON.stringify(intelligence), {
      expirationTtl: 86400, // 24 hours
    });

    return c.json(intelligence);
  } catch (error) {
    console.error('Color intelligence error:', error);
    return c.json({ error: 'Failed to generate color intelligence' }, 500);
  }
});

// Design tokens endpoint
app.get('/api/tokens/:category', async (c) => {
  try {
    const category = c.req.param('category');

    // Get tokens from KV storage
    const tokens = await c.env.RAFTERS_INTEL.get(`tokens:${category}`);

    if (!tokens) {
      return c.json({ error: 'Tokens not found' }, 404);
    }

    return c.json(JSON.parse(tokens));
  } catch (error) {
    console.error('Tokens error:', error);
    return c.json({ error: 'Failed to retrieve tokens' }, 500);
  }
});

export default app;
