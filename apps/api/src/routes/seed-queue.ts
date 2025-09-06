/**
 * Queue Seeding Route
 *
 * HTTP endpoint to trigger seeding of color messages to the queue
 */

import type {
  OKLCH,
  SeedQueueErrorResponse,
  SeedQueueInfoResponse,
  SeedQueueSuccessResponse,
} from '@rafters/shared';
import { Hono } from 'hono';

// Message format that matches what the consumer expects
interface ColorMessage {
  oklch: OKLCH;
  index: number;
  timestamp: string;
}

interface CloudflareBindings {
  COLOR_QUEUE: Queue;
}

const app = new Hono<{ Bindings: CloudflareBindings }>();

/**
 * Generate strategic OKLCH matrix for comprehensive color coverage
 */
function generateStrategicMatrix(config: {
  lightnessSteps: number;
  chromaSteps: number;
  hueSteps: number;
}): OKLCH[] {
  const colors: OKLCH[] = [];

  // Generate evenly distributed lightness values (0.1 to 0.9)
  for (let lStep = 0; lStep < config.lightnessSteps; lStep++) {
    const l = 0.1 + (0.8 * lStep) / (config.lightnessSteps - 1);

    // Generate evenly distributed chroma values (0.05 to 0.25)
    for (let cStep = 0; cStep < config.chromaSteps; cStep++) {
      const c = 0.05 + (0.2 * cStep) / (config.chromaSteps - 1);

      // Generate evenly distributed hue values (0 to 359)
      for (let hStep = 0; hStep < config.hueSteps; hStep++) {
        const h = (360 * hStep) / config.hueSteps;

        colors.push({ l, c, h });
      }
    }
  }

  return colors;
}

/**
 * Get standard fallback colors
 */
function getStandardColors(): OKLCH[] {
  return [
    { l: 0.98, c: 0.01, h: 0 }, // Near white
    { l: 0.05, c: 0.01, h: 0 }, // Near black
    { l: 0.45, c: 0.15, h: 240 }, // Primary blue
    { l: 0.55, c: 0.25, h: 15 }, // Error red
    { l: 0.75, c: 0.2, h: 135 }, // Success green
    { l: 0.65, c: 0.18, h: 60 }, // Warning yellow
    { l: 0.85, c: 0.05, h: 180 }, // Info cyan
    { l: 0.5, c: 0.2, h: 300 }, // Purple
    { l: 0.7, c: 0.15, h: 30 }, // Orange
    { l: 0.6, c: 0.22, h: 120 }, // Green
  ];
}

/**
 * POST /seed - Trigger color queue seeding
 */
app.post('/', async (c) => {
  try {
    console.log('🎨 Starting queue-based color seeding...');

    // Generate strategic matrix: 9L × 5C × 12H = 540 colors
    const strategicColors = generateStrategicMatrix({
      lightnessSteps: 9,
      chromaSteps: 5,
      hueSteps: 12,
    });
    console.log(`✓ Generated ${strategicColors.length} strategic colors`);

    // Get standard colors (simplified for Worker environment)
    const standardColors = getStandardColors();
    console.log(`✓ Using ${standardColors.length} standard colors`);

    // Combine all colors
    const allColors = [...strategicColors, ...standardColors];
    console.log(`📊 Total colors to process: ${allColors.length}`);

    // Send colors to queue in batches (max 100 per batch)
    const batchSize = 100;
    const timestamp = new Date().toISOString();
    let totalSent = 0;

    for (let i = 0; i < allColors.length; i += batchSize) {
      const batch = allColors.slice(i, i + batchSize);

      // Prepare batch messages in the format expected by consumer
      const messages = batch.map((oklch, batchIndex) => ({
        body: {
          oklch,
          index: i + batchIndex,
          timestamp,
        } as ColorMessage,
      }));

      try {
        // Send batch to queue using Cloudflare Queue JavaScript API
        await c.env.COLOR_QUEUE.sendBatch(messages);
        totalSent += messages.length;

        console.log(
          `✅ Sent batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allColors.length / batchSize)} (${totalSent}/${allColors.length} colors)`
        );
      } catch (error) {
        console.error(`❌ Failed to send batch ${Math.floor(i / batchSize) + 1}:`, error);
        throw error;
      }

      // Small delay between batches to avoid overwhelming the queue
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    console.log('🎉 Queue seeding complete!');

    return c.json({
      success: true,
      message: 'Successfully seeded colors to queue',
      stats: {
        strategicColors: strategicColors.length,
        standardColors: standardColors.length,
        totalColors: allColors.length,
        totalSent,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Queue seeding failed:', error);

    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      500
    );
  }
});

/**
 * GET /seed - Show seeding status
 */
app.get('/', async (c) => {
  return c.json({
    endpoint: '/api/seed-queue',
    method: 'POST',
    description: 'Trigger seeding of color messages to the processing queue',
    expectedColors: {
      strategic: '540 (9L × 5C × 12H matrix)',
      standard: '10 (design system colors)',
      total: 550,
    },
  });
});

export { app as seedQueue };
