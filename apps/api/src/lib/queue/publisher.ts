/**
 * Cloudflare Queue Publisher for Color Seed Generation
 *
 * Publishes color generation jobs to the queue for async processing.
 * Reuses the same message format as the color-intel API endpoint.
 */

import type { OKLCH } from '@rafters/shared';

/**
 * Color seed message format for Cloudflare Queue
 *
 * @interface ColorSeedMessage
 * @property oklch - OKLCH color values (L: 0-1, C: 0+, H: 0-360)
 * @property token - Optional semantic role (primary, danger, success, warning, info, etc.)
 * @property name - Optional color name override (otherwise AI-generated)
 * @property requestId - Unique tracking identifier for the message
 * @property timestamp - Unix timestamp when message was created
 */
export interface ColorSeedMessage {
  oklch: OKLCH;
  token?: string;
  name?: string;
  requestId?: string;
  timestamp: number;
}

/**
 * Result of queue publishing operations
 *
 * @interface QueuePublishResult
 * @property success - Whether the publishing operation succeeded
 * @property requestId - Tracking identifier for the published messages
 * @property error - Error message if publishing failed
 * @property queuedCount - Number of messages successfully queued
 */
export interface QueuePublishResult {
  success: boolean;
  requestId?: string;
  error?: string;
  queuedCount?: number;
}

/**
 * Color Seed Queue Publisher
 *
 * Handles publishing color generation jobs to Cloudflare Queues for asynchronous processing.
 * Supports single colors, batch operations, and systematic color spectrum generation.
 *
 * @example
 * ```typescript
 * const publisher = new ColorSeedPublisher(env.COLOR_SEED_QUEUE);
 * const result = await publisher.publishSingle(
 *   { l: 0.65, c: 0.12, h: 240 },
 *   { token: 'primary', name: 'ocean-blue' }
 * );
 * ```
 */
export class ColorSeedPublisher {
  constructor(private queue: Queue) {}

  /**
   * Publish a single color generation job to the queue
   *
   * @param oklch - OKLCH color values to process
   * @param options - Optional color metadata
   * @param options.token - Semantic role (primary, danger, success, etc.)
   * @param options.name - Override suggested color name
   * @param options.requestId - Custom tracking identifier
   * @returns Promise resolving to publish result with success status and tracking info
   *
   * @example
   * ```typescript
   * const result = await publisher.publishSingle(
   *   { l: 0.55, c: 0.15, h: 355 },
   *   { token: 'danger', name: 'critical-red' }
   * );
   *
   * if (result.success) {
   *   console.log(`Queued color with ID: ${result.requestId}`);
   * }
   * ```
   */
  async publishSingle(
    oklch: OKLCH,
    options?: {
      token?: string;
      name?: string;
      requestId?: string;
    }
  ): Promise<QueuePublishResult> {
    try {
      const message: ColorSeedMessage = {
        oklch,
        token: options?.token,
        name: options?.name,
        requestId: options?.requestId || crypto.randomUUID(),
        timestamp: Date.now(),
      };

      await this.queue.send(message, {
        contentType: 'json',
      });

      return {
        success: true,
        requestId: message.requestId,
        queuedCount: 1,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Publish multiple color generation jobs as a batch
   *
   * Efficiently processes large sets of colors by batching them into groups of 100
   * (Cloudflare Queues limit). Includes rate limiting to respect 400 messages/second.
   *
   * @param colors - Array of colors to process (max 1000 recommended)
   * @param colors[].oklch - OKLCH color values
   * @param colors[].token - Optional semantic role
   * @param colors[].name - Optional color name override
   * @param options - Batch configuration options
   * @param options.batchId - Custom batch identifier for tracking
   * @returns Promise resolving to batch result with total queued count
   *
   * @example
   * ```typescript
   * const colors = [
   *   { oklch: { l: 0.5, c: 0.1, h: 0 }, token: 'danger' },
   *   { oklch: { l: 0.6, c: 0.15, h: 120 }, token: 'success' }
   * ];
   *
   * const result = await publisher.publishBatch(colors, {
   *   batchId: 'design-system-colors'
   * });
   *
   * console.log(`Queued ${result.queuedCount} colors`);
   * ```
   */
  async publishBatch(
    colors: Array<{
      oklch: OKLCH;
      token?: string;
      name?: string;
    }>,
    options?: {
      batchId?: string;
    }
  ): Promise<QueuePublishResult> {
    try {
      // Cloudflare Queues limits batches to 100 messages
      const BATCH_LIMIT = 100;
      const batches = this.chunkArray(colors, BATCH_LIMIT);
      let totalQueued = 0;
      const batchId = options?.batchId || crypto.randomUUID();

      for (const [index, batch] of batches.entries()) {
        const messages = batch.map((color) => ({
          body: {
            oklch: color.oklch,
            token: color.token,
            name: color.name,
            requestId: `${batchId}-${index}-${crypto.randomUUID()}`,
            timestamp: Date.now(),
          } as ColorSeedMessage,
          options: {
            contentType: 'json' as const,
          },
        }));

        await this.queue.sendBatch(messages);
        totalQueued += messages.length;

        // Dynamic rate limiting based on batch size and 400 msg/sec limit
        if (index < batches.length - 1) {
          // Calculate optimal delay: (messages/400) * 1000ms, minimum 50ms
          const optimalDelay = Math.max(50, (messages.length / 400) * 1000);
          await this.delay(optimalDelay);
        }
      }

      return {
        success: true,
        requestId: batchId,
        queuedCount: totalQueued,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Generate and publish a spectrum of colors for seeding
   *
   * Creates a systematic grid of OKLCH colors across lightness, chroma, and hue dimensions.
   * This is essential for comprehensive color space exploration and vector similarity training.
   *
   * @param config - Spectrum generation configuration
   * @param config.lightnessSteps - Number of lightness steps (1-20, default 9)
   * @param config.chromaSteps - Number of chroma steps (1-20, default 5)
   * @param config.hueSteps - Number of hue steps (1-36, default 12)
   * @param config.baseName - Base name for generated colors (default 'spectrum-seed')
   * @returns Promise resolving to spectrum result with total generated count
   *
   * @example
   * ```typescript
   * // Generate 540 colors (9×5×12)
   * const result = await publisher.publishSpectrum({
   *   lightnessSteps: 9,    // 0.1 to 0.9
   *   chromaSteps: 5,       // 0.0 to 0.4
   *   hueSteps: 12,         // 30° intervals
   *   baseName: 'design-system'
   * });
   *
   * console.log(`Generated ${result.queuedCount} colors for processing`);
   * // Expected: "Generated 540 colors for processing"
   * ```
   *
   * @remarks
   * The spectrum creates comprehensive color coverage:
   * - Lightness: Linear steps from 0.1 to 0.9
   * - Chroma: Linear steps from 0.0 to maximum
   * - Hue: Equal intervals around color wheel
   * - Total colors: lightnessSteps × chromaSteps × hueSteps
   */
  async publishSpectrum(config: {
    lightnessSteps: number; // e.g., 9 steps from 0.1 to 0.9
    chromaSteps: number; // e.g., 5 steps from 0.0 to 0.4
    hueSteps: number; // e.g., 12 steps (30° intervals)
    baseName?: string; // e.g., 'spectrum-seed'
  }): Promise<QueuePublishResult> {
    const colors: Array<{ oklch: OKLCH; token: string; name: string }> = [];

    // Generate spectrum grid
    for (let l = 0; l < config.lightnessSteps; l++) {
      const lightness = 0.1 + (l / (config.lightnessSteps - 1)) * 0.8; // 0.1 to 0.9

      for (let c = 0; c < config.chromaSteps; c++) {
        const chroma = (c / (config.chromaSteps - 1)) * 0.4; // 0.0 to 0.4

        for (let h = 0; h < config.hueSteps; h++) {
          const hue = (h / config.hueSteps) * 360; // 0° to 330°

          const oklch: OKLCH = {
            l: Math.round(lightness * 100) / 100,
            c: Math.round(chroma * 100) / 100,
            h: Math.round(hue),
          };

          colors.push({
            oklch,
            token: 'spectrum-seed',
            name: config.baseName
              ? `${config.baseName}-l${Math.round(lightness * 100)}-c${Math.round(chroma * 100)}-h${Math.round(hue)}`
              : `spectrum-l${Math.round(lightness * 100)}-c${Math.round(chroma * 100)}-h${Math.round(hue)}`,
          });
        }
      }
    }

    // Spectrum generation complete
    return this.publishBatch(colors, { batchId: `spectrum-${Date.now()}` });
  }

  /**
   * Utility: Split array into chunks of specified size
   */
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Utility: Simple delay for rate limiting
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
