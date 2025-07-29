import { Hono } from 'hono';

export const health = new Hono();

health.get('/', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime?.() || 0,
  });
});
