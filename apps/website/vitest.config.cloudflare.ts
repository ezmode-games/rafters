/**
 * Vitest configuration for Cloudflare Workers runtime integration tests
 * Uses @cloudflare/vitest-pool-workers for actual Workers environment
 */

import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig({
  test: {
    globals: true,
    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.spec.ts'],
    exclude: ['test/**/*.test.ts', 'test/**/*.e2e.ts'],
    poolOptions: {
      workers: {
        wrangler: { configPath: './wrangler.jsonc' },
        // Test bindings for Cloudflare services - overrides for testing
        bindings: {
          RAFTERS_INTEL: { type: 'kv' },
          DESIGN_TOKENS: { type: 'kv' },
          COMPONENT_REGISTRY: { type: 'kv' },
          RAFTERS_CACHE: { type: 'kv' },
          CLAUDE_API_KEY: 'test-api-key',
          ENVIRONMENT: 'test',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
});
