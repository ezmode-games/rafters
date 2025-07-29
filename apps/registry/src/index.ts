/**
 * Rafters Component Registry API
 *
 * Provides REST endpoints for AI-trainable components with embedded design intelligence.
 * Built with Hono for Cloudflare Workers deployment.
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { components } from './routes/components';
import { health } from './routes/health';
import { registry } from './routes/registry';

const app = new Hono();

// CORS configuration for CLI and web access
app.use(
  '/*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);

// Health check endpoint
app.route('/health', health);

// Registry metadata endpoints
app.route('/registry', registry);

// Component endpoints
app.route('/components', components);

// Root endpoint
app.get('/', (c) => {
  return c.json({
    name: 'Rafters Component Registry',
    version: '1.0.0',
    description: 'AI-first design intelligence system component registry',
    endpoints: {
      health: '/health',
      registry: '/registry',
      components: '/components',
      component: '/components/{name}',
    },
    documentation: 'https://docs.rafters.dev/registry',
  });
});

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      error: 'Not Found',
      message: 'The requested resource was not found',
      endpoints: ['/health', '/registry', '/components'],
    },
    404
  );
});

// Error handler
app.onError((err, c) => {
  console.error('Registry API Error:', err);
  return c.json(
    {
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    },
    500
  );
});

export default app;
