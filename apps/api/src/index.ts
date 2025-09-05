import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { colorIntel } from './routes/color-intel';
import { colorQueueProgress } from './routes/color-queue-progress';
import { processColorQueue } from './scheduled/process-colors';

interface CloudflareBindings {
  VECTORIZE: VectorizeIndex;
  CLAUDE_API_KEY: string;
  CF_TOKEN: string;
  CLAUDE_GATEWAY_URL: string;
  RAFTERS_INTEL: KVNamespace;
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
app.route('/api/color-queue', colorQueueProgress);

// Export the scheduled function as a named export
export async function scheduled(
  event: ScheduledEvent,
  env: CloudflareBindings,
  ctx: ExecutionContext
) {
  await processColorQueue({ RAFTERS_INTEL: env.RAFTERS_INTEL });
}

// Default export for the Worker
export default {
  fetch: app.fetch,
  scheduled,
};
