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
        bindings: {
          // Test bindings for Cloudflare services
          RAFTERS_INTEL: { type: 'kv' },
          RAFTERS_CACHE: { type: 'kv' },
        },
        miniflare: {
          // Additional Miniflare configuration
          kvNamespaces: ['RAFTERS_INTEL', 'RAFTERS_CACHE'],
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
