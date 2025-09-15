/**
 * Color Intelligence API Integration Tests
 *
 * Tests the Hono-based color intelligence API running on Cloudflare Workers.
 * Uses actual Workers runtime for true integration testing.
 */

import { createExecutionContext, env } from 'cloudflare:test';
import { describe, expect, test } from 'vitest';

describe('Color Intelligence API - Cloudflare Workers Integration', () => {
  test('API routes are accessible', async () => {
    const ctx = createExecutionContext();

    // Test that environment is available
    expect(env).toBeDefined();
    expect(ctx).toBeDefined();

    // Basic smoke test - API should be importable
    const app = await import('../src/index');
    expect(app).toBeDefined();
  });

  test('can access KV bindings in Workers environment', async () => {
    // Test KV access (this works in Workers but not in OpenNext)
    expect(env.RAFTERS_INTEL).toBeDefined();

    // Test basic KV operations
    await env.RAFTERS_INTEL.put('test:key', 'test-value');
    const retrieved = await env.RAFTERS_INTEL.get('test:key');
    expect(retrieved).toBe('test-value');
  });
});
