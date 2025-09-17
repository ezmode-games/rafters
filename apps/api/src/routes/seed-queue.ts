/**
 * Color Seed Queue Routes
 *
 * Endpoints for triggering color seed generation jobs via Cloudflare Queues.
 * Allows bulk color processing without blocking HTTP requests.
 */

import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { ColorSeedPublisher } from '../lib/queue/publisher';
import { requireApiKey } from '../middleware/auth';

// Validation schemas
const OKLCHSchema = z.object({
  l: z.number().min(0).max(1),
  c: z.number().min(0),
  h: z.number().min(0).max(360),
  alpha: z.number().min(0).max(1).optional(),
});

const SingleColorSchema = z.object({
  oklch: OKLCHSchema,
  token: z.string().optional(),
  name: z.string().optional(),
});

const BatchColorSchema = z.object({
  colors: z.array(SingleColorSchema).max(1000), // Limit to 1000 colors per request
  batchId: z.string().optional(),
});

const SpectrumConfigSchema = z.object({
  lightnessSteps: z.number().min(1).max(20).default(9),
  chromaSteps: z.number().min(1).max(20).default(5),
  hueSteps: z.number().min(1).max(36).default(12),
  baseName: z.string().optional().default('spectrum-seed'),
});

const app = new Hono<{ Bindings: Env }>();

// Apply API key authentication to ALL queue endpoints
app.use('*', requireApiKey());

/**
 * POST /single - Queue a single color for processing
 */
app.post('/single', zValidator('json', SingleColorSchema), async (c) => {
  try {
    const { oklch, token, name } = c.req.valid('json');
    const publisher = new ColorSeedPublisher(c.env.COLOR_SEED_QUEUE);

    const result = await publisher.publishSingle(oklch, { token, name });

    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }

    return c.json({
      success: true,
      message: 'Color queued for processing',
      requestId: result.requestId,
      queuedCount: result.queuedCount,
    });
  } catch (error) {
    console.error('Single color queue error:', error);
    return c.json(
      {
        error: 'Failed to queue color for processing',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * POST /batch - Queue multiple colors for processing
 */
app.post('/batch', zValidator('json', BatchColorSchema), async (c) => {
  try {
    const { colors, batchId } = c.req.valid('json');
    const publisher = new ColorSeedPublisher(c.env.COLOR_SEED_QUEUE);

    const result = await publisher.publishBatch(colors, { batchId });

    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }

    return c.json({
      success: true,
      message: `${result.queuedCount} colors queued for processing`,
      batchId: result.requestId,
      queuedCount: result.queuedCount,
    });
  } catch (error) {
    console.error('Batch color queue error:', error);
    return c.json(
      {
        error: 'Failed to queue colors for processing',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * POST /spectrum - Generate and queue a spectrum of colors
 */
app.post('/spectrum', zValidator('json', SpectrumConfigSchema), async (c) => {
  try {
    const config = c.req.valid('json');
    const publisher = new ColorSeedPublisher(c.env.COLOR_SEED_QUEUE);

    // Calculate expected number of colors
    const expectedCount = config.lightnessSteps * config.chromaSteps * config.hueSteps;

    console.log(
      `Generating spectrum: ${config.lightnessSteps}L × ${config.chromaSteps}C × ${config.hueSteps}H = ${expectedCount} colors`
    );

    const result = await publisher.publishSpectrum(config);

    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }

    return c.json({
      success: true,
      message: `Spectrum of ${result.queuedCount} colors queued for processing`,
      spectrumId: result.requestId,
      config: {
        lightnessSteps: config.lightnessSteps,
        chromaSteps: config.chromaSteps,
        hueSteps: config.hueSteps,
        totalColors: result.queuedCount,
      },
      estimatedProcessingTime: `${Math.ceil((result.queuedCount || 0) / 400)} seconds`, // Based on 400 msg/sec limit
    });
  } catch (error) {
    console.error('Spectrum generation error:', error);
    return c.json(
      {
        error: 'Failed to generate and queue spectrum',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * GET /status - Get queue publisher status
 */
app.get('/status', async (c) => {
  return c.json({
    status: 'operational',
    publisher: 'color-seed-queue',
    security: {
      authentication: 'API key required',
      header: 'X-API-Key',
      note: 'All endpoints require valid API key to prevent abuse',
    },
    limits: {
      maxBatchSize: 100,
      maxRequestSize: 1000,
      rateLimit: '400 messages/second',
      maxMessageSize: '128 KB',
    },
    endpoints: {
      single: 'POST /single - Queue single color',
      batch: 'POST /batch - Queue multiple colors',
      spectrum: 'POST /spectrum - Generate color spectrum',
      status: 'GET /status - This endpoint',
    },
    usage: {
      headers: ['X-API-Key: your-api-key'],
      example: 'curl -H "X-API-Key: xxx" -X POST /api/seed-queue/single',
    },
  });
});

export { app as seedQueue };
