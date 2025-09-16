/**
 * Authentication Middleware for Protected Endpoints
 *
 * Prevents unauthorized access to queue endpoints and other sensitive APIs.
 */

import type { Context, Next } from 'hono';

interface AuthBindings {
  SEED_QUEUE_API_KEY: string;
}

/**
 * Edge-optimized API Key Authentication Middleware
 * Optimized for Cloudflare Workers with efficient header processing and caching
 */
export function requireApiKey() {
  return async (c: Context<{ Bindings: AuthBindings }>, next: Next) => {
    // Efficient header extraction - avoid double lookup
    const apiKey = c.req.header('X-API-Key');

    if (!apiKey) {
      // Edge-cacheable error response with immutable headers
      return c.json(
        {
          error: 'Authentication required',
          message: 'Missing X-API-Key header',
          code: 'MISSING_API_KEY',
        },
        401,
        {
          'Cache-Control': 'public, max-age=300', // Cache auth errors for 5min
          'Content-Type': 'application/json',
        }
      );
    }

    // Early validation of environment configuration
    const expectedKey = c.env.SEED_QUEUE_API_KEY;
    if (!expectedKey) {
      console.error('SEED_QUEUE_API_KEY environment variable not configured');
      return c.json(
        {
          error: 'Server configuration error',
          message: 'Authentication system not properly configured',
          code: 'AUTH_CONFIG_ERROR',
        },
        500,
        { 'Cache-Control': 'no-cache' }
      );
    }

    // Optimized timing-safe comparison with early length check
    if (!timingSafeEqual(apiKey, expectedKey)) {
      // Efficient security logging with minimal object allocation
      const securityEvent = {
        ip: c.req.header('CF-Connecting-IP') || 'unknown',
        path: c.req.path,
        timestamp: Date.now(), // Use timestamp for better performance
      };

      console.warn('Unauthorized access attempt:', securityEvent);

      return c.json(
        {
          error: 'Invalid API key',
          message: 'The provided API key is not valid',
          code: 'INVALID_API_KEY',
        },
        403,
        {
          'Cache-Control': 'no-cache, no-store',
          'Content-Type': 'application/json',
        }
      );
    }

    // Valid API key, proceed to next middleware/handler
    await next();
  };
}

/**
 * Timing-safe string comparison to prevent timing attacks
 * Compares strings in constant time regardless of where they differ
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Development/staging bypass middleware
 * Allows certain operations in non-production environments
 */
export function allowDevelopment() {
  return async (c: Context, next: Next) => {
    const environment = c.req.header('CF-Worker-Environment') || 'production';

    if (environment === 'development' || environment === 'staging') {
      // In development, check for a simple bypass header
      const devKey = c.req.header('X-Dev-Key');
      if (devKey === 'dev-queue-access') {
        await next();
        return;
      }
    }

    // Production or no dev bypass, require full auth
    return requireApiKey()(c, next);
  };
}
