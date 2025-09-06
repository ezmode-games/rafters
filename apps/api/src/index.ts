import type { OKLCH } from '@rafters/shared';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import queueHandler from './queue/process-colors-queue';
import { colorIntel } from './routes/color-intel';
import { seedQueue } from './routes/seed-queue';

// Message format for queue
interface ColorMessage {
  oklch: OKLCH;
  index: number;
  timestamp: string;
}

interface CloudflareBindings {
  VECTORIZE: VectorizeIndex;
  CLAUDE_API_KEY: string;
  CF_TOKEN: string;
  CLAUDE_GATEWAY_URL: string;
  COLOR_QUEUE: Queue;
}

const app = new Hono<{ Bindings: CloudflareBindings }>();

// CORS middleware
app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  })
);

// Mount routes
app.route('/api/color-intel', colorIntel);
app.route('/api/seed-queue', seedQueue);

// Scheduled function is no longer needed - queue system handles processing automatically

// Export the queue handler as a named export
export async function queue(batch: MessageBatch<ColorMessage>, env: CloudflareBindings) {
  await queueHandler.queue(batch, env);
}

// Default export for the Worker
export default {
  fetch: app.fetch,
  queue,
};
