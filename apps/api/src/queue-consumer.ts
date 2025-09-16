/**
 * Cloudflare Queue Consumer Entry Point
 *
 * Handles color seed processing queue messages.
 * Creates main Hono app instance for internal API calls.
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { processColorSeedBatch } from './lib/queue/consumer';
import type { ColorSeedMessage } from './lib/queue/publisher';
import { colorIntel } from './routes/color-intel';
import { seedQueue } from './routes/seed-queue';

interface CloudflareBindings {
  VECTORIZE: VectorizeIndex;
  CLAUDE_API_KEY: string;
  CF_TOKEN: string;
  CLAUDE_GATEWAY_URL: string;
  AI: Ai;
  COLOR_SEED_QUEUE: Queue;
  SEED_QUEUE_API_KEY: string;
}

// Create the same app structure as index.ts for internal API calls
const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  })
);

app.route('/api/color-intel', colorIntel);
app.route('/api/seed-queue', seedQueue);

export default {
  async queue(batch: MessageBatch<ColorSeedMessage>, env: CloudflareBindings): Promise<void> {
    await processColorSeedBatch(batch, env, app);
  },
};
