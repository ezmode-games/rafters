import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { colorIntel } from './routes/color-intel';

interface CloudflareBindings {
  VECTORIZE: VectorizeIndex;
  CLAUDE_API_KEY: string;
  CF_TOKEN: string;
  CLAUDE_GATEWAY_URL: string;
  AI: Ai;
}

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

export default app;
