import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { colorIntel } from './routes/color-intel';
import { test } from './routes/test';

interface CloudflareBindings {
  RAFTERS_INTEL: KVNamespace;
  CLAUDE_API_KEY: string;
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
app.route('/api/test', test);

export default app;
