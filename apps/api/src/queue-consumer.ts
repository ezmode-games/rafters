/**
 * Cloudflare Queue Consumer Entry Point
 *
 * Handles color seed processing queue messages.
 * Creates main Hono app instance for internal API calls.
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { processColorSeedBatch } from '@/lib/queue/consumer';
import type { ColorSeedMessage } from '@/lib/queue/publisher';
import { color } from '@/routes/color';
import { queue } from '@/routes/queue';

// Create the same app structure as index.ts for internal API calls
const app = new Hono<{ Bindings: Env }>();

app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  }),
);

app.route('/api/color', color);
app.route('/api/queue', queue);

export default {
  async queue(batch: MessageBatch<ColorSeedMessage>, env: Env): Promise<void> {
    await processColorSeedBatch(batch, env, app);
  },
};
