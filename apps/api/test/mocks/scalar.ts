// Mock @scalar/hono-api-reference for workerd test environment
// Uses Vue/cva components that don't work in workerd

import type { Context, MiddlewareHandler } from 'hono';

export function Scalar(_options: unknown): MiddlewareHandler {
  return async (c: Context) => {
    return c.html('<html><body>API Reference (mocked in tests)</body></html>');
  };
}
