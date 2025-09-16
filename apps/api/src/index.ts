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

const app = new Hono<{ Bindings: CloudflareBindings }>();

// Edge-optimized CORS with domain restriction and caching
app.use(
  '*',
  cors({
    origin: (origin) => {
      // Allow localhost for development and realhandy.tech domains for production
      if (!origin) return '*'; // Same-origin requests
      if (origin.includes('localhost') || origin.endsWith('.realhandy.tech')) {
        return origin;
      }
      throw new Error('CORS policy violation');
    },
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'X-API-Key'],
    maxAge: 86400, // Cache preflight for 24 hours (reduces OPTIONS requests)
    credentials: false, // Disable for better edge caching
  })
);

app.route('/api/color-intel', colorIntel);
app.route('/api/seed-queue', seedQueue);

export default {
  fetch: app.fetch,
  async queue(batch: MessageBatch<ColorSeedMessage>, env: CloudflareBindings): Promise<void> {
    await processColorSeedBatch(batch, env, app);
  },
};
