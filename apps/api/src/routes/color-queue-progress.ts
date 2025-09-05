/**
 * Color Queue Progress API Route
 *
 * Provides real-time progress monitoring for the color queue processing
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getProgress } from '../scheduled/process-colors.js';

const app = new Hono<{ Bindings: { RAFTERS_INTEL: KVNamespace } }>();

// Enable CORS for frontend monitoring
app.use(
  '*',
  cors({
    origin: ['https://rafters.realhandy.tech', 'http://localhost:3000'],
    allowMethods: ['GET'],
    allowHeaders: ['Content-Type'],
  })
);

/**
 * GET /color-queue/progress
 * Returns current processing progress statistics
 */
app.get('/progress', async (c) => {
  try {
    const progress = await getProgress(c.env);

    if (!progress) {
      return c.json(
        {
          error: 'No progress data found',
          message: 'Color queue may not be initialized',
        },
        404
      );
    }

    // Calculate additional metrics
    const totalProcessed = progress.completed + progress.failed;
    const completionPercentage = Math.round((totalProcessed / progress.total) * 100);
    const remainingTime = Math.max(
      0,
      new Date(progress.estimatedCompletion).getTime() - Date.now()
    );
    const remainingMinutes = Math.round(remainingTime / 1000 / 60);

    return c.json({
      ...progress,
      metrics: {
        completionPercentage,
        totalProcessed,
        remainingMinutes,
        isComplete: totalProcessed >= progress.total,
      },
    });
  } catch (error) {
    console.error('Progress API error:', error);
    return c.json(
      {
        error: 'Failed to fetch progress',
        message: (error as Error).message,
      },
      500
    );
  }
});

/**
 * GET /color-queue/status
 * Returns detailed queue status for debugging
 */
app.get('/status', async (c) => {
  try {
    const kv = c.env.RAFTERS_INTEL;

    // Sample some queue items for debugging
    const listResult = await kv.list({ prefix: 'color-queue:item:', limit: 10 });
    const sampleItems = [];

    for (const key of listResult.keys.slice(0, 5)) {
      const itemData = await kv.get(key.name);
      if (itemData) {
        sampleItems.push({
          key: key.name,
          item: JSON.parse(itemData),
        });
      }
    }

    // Check for stuck processing items
    const now = Date.now();
    let stuckCount = 0;

    for (const key of listResult.keys) {
      const itemData = await kv.get(key.name);
      if (itemData) {
        const item = JSON.parse(itemData);
        if (
          item.state === 'processing' &&
          item.processingStarted &&
          now - Date.parse(item.processingStarted) > 30000
        ) {
          stuckCount++;
        }
      }
    }

    return c.json({
      totalQueueItems: listResult.keys.length,
      sampleItems,
      stuckProcessingItems: stuckCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Status API error:', error);
    return c.json(
      {
        error: 'Failed to fetch status',
        message: (error as Error).message,
      },
      500
    );
  }
});

export default app;
