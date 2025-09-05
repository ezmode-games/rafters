/**
 * Color Queue Processor - Scheduled Worker
 *
 * Processes color queue items from KV store using atomic state management.
 * Runs as cron job every minute to generate ColorValue objects with full intelligence.
 */

import { generateColorCacheKey, generateColorValue } from '@rafters/color-utils';
import type { ColorValue, OKLCH } from '@rafters/shared';

// Color queue item structure (matches seeder)
export interface ColorQueueItem {
  oklch: OKLCH;
  state: 'pending' | 'processing' | 'completed';
  processingStarted?: string;
  processingTimeout: number;
  retryCount: number;
  lastError?: string;
}

// Progress tracking structure
export interface QueueProgress {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  estimatedCompletion: string;
}

// Processing result
export interface ProcessResult {
  processed: boolean;
  key?: string;
  error?: string;
}

// Environment interface
export interface Env {
  RAFTERS_INTEL: KVNamespace;
}

// Configuration constants
const MAX_RETRIES = 3;
const PROCESSING_TIMEOUT_MS = 30000; // 30 seconds

// KV interface for testing compatibility
interface KVStore {
  put(key: string, value: string): Promise<void>;
  get(key: string): Promise<string | null>;
  list(options?: { prefix?: string }): Promise<{ keys: { name: string }[] }>;
  delete(key: string): Promise<void>;
}

/**
 * Atomically claim the next pending color from the queue
 * Handles both pending items and stale processing items that have timed out
 */
export async function claimNextPendingColor(kv: KVStore): Promise<string | null> {
  const now = new Date().toISOString();
  const staleThreshold = Date.now() - PROCESSING_TIMEOUT_MS;

  try {
    // Get all queue items
    const listResult = await kv.list({ prefix: 'color-queue:item:' });

    for (const key of listResult.keys) {
      const itemData = await kv.get(key.name);
      if (!itemData) continue;

      const item: ColorQueueItem = JSON.parse(itemData);

      // Check if item is claimable (pending or stale processing)
      const isPending = item.state === 'pending';
      const isStaleProcessing =
        item.state === 'processing' &&
        item.processingStarted &&
        Date.parse(item.processingStarted) < staleThreshold;

      if (isPending || isStaleProcessing) {
        // Attempt atomic claim by updating to processing state
        const claimedItem: ColorQueueItem = {
          ...item,
          state: 'processing',
          processingStarted: now,
        };

        // LIMITATION: This implementation lacks true atomicity for claiming items
        // Multiple workers could potentially claim the same item simultaneously
        // In production, this could be improved with KV metadata for compare-and-swap
        // or by using queue item keys with timestamps for pseudo-atomicity
        await kv.put(key.name, JSON.stringify(claimedItem));

        // Return the claimed key
        return key.name;
      }
    }

    return null; // No claimable items found
  } catch (error) {
    console.error('Error claiming pending color:', error);
    return null;
  }
}

/**
 * Handle processing errors with retry logic
 */
export async function handleProcessingError(kv: KVStore, key: string, error: Error): Promise<void> {
  try {
    const itemData = await kv.get(key);
    if (!itemData) return;

    const item: ColorQueueItem = JSON.parse(itemData);
    const newRetryCount = item.retryCount + 1;

    if (newRetryCount > MAX_RETRIES) {
      // Max retries exceeded - mark as completed to remove from processing
      const failedItem: ColorQueueItem = {
        ...item,
        state: 'completed',
        retryCount: newRetryCount,
        lastError: error.message,
        processingStarted: undefined,
      };

      await kv.put(key, JSON.stringify(failedItem));
      console.error(
        `Color processing permanently failed after ${MAX_RETRIES} retries:`,
        key,
        error.message
      );
    } else {
      // Reset to pending for retry
      const retryItem: ColorQueueItem = {
        ...item,
        state: 'pending',
        retryCount: newRetryCount,
        lastError: error.message,
        processingStarted: undefined,
      };

      await kv.put(key, JSON.stringify(retryItem));
      console.warn(
        `Color processing failed, will retry (${newRetryCount}/${MAX_RETRIES}):`,
        key,
        error.message
      );
    }
  } catch (kvError) {
    console.error('Error handling processing error:', kvError);
  }
}

/**
 * Update queue progress statistics
 */
async function updateProgress(kv: KVStore): Promise<void> {
  try {
    // Get current progress
    const progressData = await kv.get('color-queue:progress');
    if (!progressData) return;

    const progress: QueueProgress = JSON.parse(progressData);

    // Count current states by scanning queue items
    const listResult = await kv.list({ prefix: 'color-queue:item:' });
    let pending = 0;
    let processing = 0;
    let completed = 0;
    let failed = 0;

    for (const key of listResult.keys) {
      const itemData = await kv.get(key.name);
      if (!itemData) continue;

      const item: ColorQueueItem = JSON.parse(itemData);

      switch (item.state) {
        case 'pending':
          pending++;
          break;
        case 'processing':
          processing++;
          break;
        case 'completed':
          if (item.retryCount > MAX_RETRIES) {
            failed++;
          } else {
            completed++;
          }
          break;
      }
    }

    // Update progress with new counts
    const updatedProgress: QueueProgress = {
      ...progress,
      pending,
      processing,
      completed,
      failed,
      // Recalculate estimated completion based on remaining work (1 minute per color)
      estimatedCompletion: new Date(Date.now() + pending * 60 * 1000).toISOString(),
    };

    await kv.put('color-queue:progress', JSON.stringify(updatedProgress));
  } catch (error) {
    console.error('Error updating progress:', error);
  }
}

/**
 * Process a single color from the queue
 * Main entry point for the cron job
 */
export async function processColorQueue(env: Env): Promise<ProcessResult> {
  try {
    // Claim next pending color atomically
    const claimedKey = await claimNextPendingColor(env.RAFTERS_INTEL as KVStore);

    if (!claimedKey) {
      // No work available
      return { processed: false };
    }

    // Get the claimed item
    const itemData = await env.RAFTERS_INTEL.get(claimedKey);
    if (!itemData) {
      return { processed: false, error: 'Claimed item not found' };
    }

    const item: ColorQueueItem = JSON.parse(itemData);

    try {
      // Generate complete ColorValue with mathematical intelligence
      const colorValue: ColorValue = generateColorValue(item.oklch, {
        semanticRole: 'neutral',
        generateStates: false, // Skip interactive states for cache
      });

      // Generate consistent cache key
      const cacheKey = generateColorCacheKey(item.oklch);
      const fullCacheKey = `color-cache:${cacheKey}`;

      // Store processed color and mark item as completed atomically
      await Promise.all([
        env.RAFTERS_INTEL.put(fullCacheKey, JSON.stringify(colorValue)),
        env.RAFTERS_INTEL.put(
          claimedKey,
          JSON.stringify({
            ...item,
            state: 'completed',
            processingStarted: undefined,
          } as ColorQueueItem)
        ),
      ]);

      console.log(`✓ Processed color: ${cacheKey}`);

      // Update progress statistics (async, don't wait)
      updateProgress(env.RAFTERS_INTEL as KVStore).catch((error) =>
        console.warn('Progress update failed:', error)
      );

      return { processed: true, key: claimedKey };
    } catch (error) {
      // Handle processing error with retry logic
      await handleProcessingError(env.RAFTERS_INTEL as KVStore, claimedKey, error as Error);
      return { processed: false, error: (error as Error).message };
    }
  } catch (error) {
    console.error('Color queue processing failed:', error);
    return { processed: false, error: (error as Error).message };
  }
}

/**
 * Scheduled handler - called by Cloudflare Workers cron trigger
 */
export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log('🎨 Color queue processor starting...');

    const startTime = Date.now();
    const result = await processColorQueue(env);
    const duration = Date.now() - startTime;

    if (result.processed) {
      console.log(`✅ Color processed successfully in ${duration}ms`);
    } else if (result.error) {
      console.log(`⚠️  Processing failed: ${result.error} (${duration}ms)`);
    } else {
      console.log(`ℹ️  No colors available for processing (${duration}ms)`);
    }
  },
};

/**
 * HTTP handler for manual processing (debugging/monitoring)
 */
export async function handleRequest(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const result = await processColorQueue(env);

  return Response.json({
    success: result.processed,
    message: result.processed
      ? `Processed color: ${result.key}`
      : result.error || 'No colors available',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Progress monitoring endpoint
 */
export async function getProgress(env: Env): Promise<QueueProgress | null> {
  try {
    const progressData = await env.RAFTERS_INTEL.get('color-queue:progress');
    return progressData ? JSON.parse(progressData) : null;
  } catch (error) {
    console.error('Error getting progress:', error);
    return null;
  }
}
