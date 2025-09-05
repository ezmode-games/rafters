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

// Scheduled function for cron triggers
export const scheduled: ExportedHandlerScheduledHandler<CloudflareBindings> = async (
  event,
  env,
  _ctx
) => {
  console.log('🎨 Color queue cron triggered at:', new Date(event.scheduledTime).toISOString());

  const startTime = Date.now();
  const result = await processColorQueue({ RAFTERS_INTEL: env.RAFTERS_INTEL });
  const duration = Date.now() - startTime;

  if (result.processed) {
    console.log(`✅ Color processed successfully in ${duration}ms`);
  } else if (result.error) {
    console.log(`⚠️  Processing failed: ${result.error} (${duration}ms)`);
  } else {
    console.log(`ℹ️  No colors available for processing (${duration}ms)`);
  }
};

export default app;
