/**
 * Cloudflare Queue Consumer - Color Processing
 *
 * Replaces the KV-based manual queue with proper Cloudflare Queues.
 *
 * Key improvements over KV approach:
 * - True atomic message delivery (no race conditions)
 * - Automatic retry with exponential backoff
 * - Batch processing (up to 10 colors per invocation)
 * - Dead letter queue for permanent failures
 * - No manual state management required
 */

import { generateColorCacheKey } from '@rafters/color-utils';
import type { OKLCH } from '@rafters/shared';

// Message structure from queue producer
interface ColorMessage {
  oklch: OKLCH;
  index: number;
  timestamp: string;
}

// Environment interface
interface Env {
  VECTORIZE: VectorizeIndex;
  CLAUDE_API_KEY: string;
  CF_TOKEN: string;
  CLAUDE_GATEWAY_URL: string;
}

// Processing statistics for monitoring
interface ProcessingStats {
  processed: number;
  failed: number;
  cached: number;
  errors: string[];
  duration: number;
}

/**
 * Process a single color message
 * Hit the color-intel API to generate full intelligence and store in both KV and Vectorize
 */
async function processColorMessage(
  message: ColorMessage,
  _env: Env,
  messageId: string
): Promise<{ success: boolean; error?: string; cacheKey?: string }> {
  try {
    // Hit the color-intel API internally to get full intelligence + Vectorize storage
    const response = await fetch('https://rafters.realhandy.tech/api/color-intel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oklch: message.oklch,
      }),
    });

    if (!response.ok) {
      throw new Error(`Color intel API failed: ${response.status}`);
    }

    const _colorData = await response.json();
    const cacheKey = generateColorCacheKey(message.oklch);

    console.log(`✅ Generated full intelligence: ${cacheKey}`);

    return {
      success: true,
      cacheKey,
    };
  } catch (error) {
    console.error(`Failed to process color message ${messageId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Main queue consumer handler
 * Processes batches of color messages automatically delivered by Cloudflare Queues
 */
export async function processColorBatch(
  batch: MessageBatch<ColorMessage>,
  env: Env
): Promise<void> {
  const startTime = Date.now();
  const stats: ProcessingStats = {
    processed: 0,
    failed: 0,
    cached: 0,
    errors: [],
    duration: 0,
  };

  console.log(`🎨 Processing batch of ${batch.messages.length} colors...`);

  // Process all messages in the batch
  const results = await Promise.allSettled(
    batch.messages.map(async (message) => {
      const messageId = message.id;
      const colorMessage = message.body;

      console.log(
        `Processing color ${messageId}: L=${colorMessage.oklch.l.toFixed(2)} C=${colorMessage.oklch.c.toFixed(2)} H=${colorMessage.oklch.h.toFixed(0)}`
      );

      const result = await processColorMessage(colorMessage, env, messageId);

      if (result.success) {
        stats.processed++;
        stats.cached++;

        // Acknowledge successful processing
        message.ack();

        console.log(`✅ Cached color: ${result.cacheKey}`);
        return { success: true, messageId, cacheKey: result.cacheKey };
      }
      stats.failed++;
      stats.errors.push(`${messageId}: ${result.error}`);

      // Retry the message (automatic retry via queue config)
      message.retry();

      console.error(`❌ Failed to process ${messageId}: ${result.error}`);
      return { success: false, messageId, error: result.error };
    })
  );

  // Calculate final stats
  stats.duration = Date.now() - startTime;
  const successCount = results.filter((r) => r.status === 'fulfilled' && r.value.success).length;
  const failureCount = results.length - successCount;

  // Log batch completion summary
  console.log('🎉 Batch processing complete!');
  console.log(`✅ Successfully processed: ${successCount}/${batch.messages.length} colors`);
  console.log(`❌ Failed: ${failureCount}/${batch.messages.length} colors`);
  console.log(`⏱️  Batch duration: ${stats.duration}ms`);
  console.log(
    `🚀 Processing rate: ${Math.round(successCount / (stats.duration / 1000))} colors/second`
  );

  if (stats.errors.length > 0) {
    console.warn('⚠️  Batch errors:', stats.errors.slice(0, 5)); // Log first 5 errors
  }
}

/**
 * Queue consumer export for Cloudflare Workers
 * This replaces the scheduled handler pattern
 */
export default {
  async queue(batch: MessageBatch<ColorMessage>, env: Env): Promise<void> {
    try {
      await processColorBatch(batch, env);
    } catch (error) {
      console.error('Queue batch processing failed:', error);

      // Retry all messages in the batch on unexpected errors
      for (const message of batch.messages) {
        message.retry();
      }
    }
  },
};

/**
 * Optional: HTTP endpoint for manual processing/monitoring
 * Can trigger single color processing for testing
 */
export async function handleManualProcessing(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = (await request.json()) as { oklch: OKLCH };

    if (!body.oklch) {
      return new Response('Missing oklch in request body', { status: 400 });
    }

    const colorMessage: ColorMessage = {
      oklch: body.oklch,
      index: 0,
      timestamp: new Date().toISOString(),
    };

    const result = await processColorMessage(colorMessage, env, 'manual');

    return Response.json({
      success: result.success,
      cacheKey: result.cacheKey,
      error: result.error,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
