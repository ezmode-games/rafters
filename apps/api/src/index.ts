import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { processColorSeedBatch } from './lib/queue/consumer';
import type { ColorSeedMessage } from './lib/queue/publisher';
import { archive } from './routes/archive';
import { colorIntel } from './routes/color-intel';
import { seedQueue } from './routes/seed-queue';
import { uncertainty } from './routes/uncertainty';

const app = new Hono<{ Bindings: Env }>();

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

app.route('/api/archive', archive);
app.route('/api/color-intel', colorIntel);
app.route('/api/seed-queue', seedQueue);
app.route('/api/uncertainty/predictions', uncertainty);

export default {
  fetch: app.fetch,
  async queue(batch: MessageBatch<ColorSeedMessage>, env: Env): Promise<void> {
    await processColorSeedBatch(batch, env, app);
  },
};
