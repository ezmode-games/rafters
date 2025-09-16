/**
 * Vitest configuration for Cloudflare Workers API testing
 * Uses actual Workers runtime with KV, R2, D1 bindings
 */

import { defineWorkersProject } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersProject({
  test: {
    globals: true,
    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.spec.ts', 'test/**/*.test.ts'],
    poolOptions: {
      workers: {
        singleWorker: true,
        miniflare: {
          compatibilityFlags: ['nodejs_compat'],
          queueConsumers: {
            COLOR_SEED_QUEUE: { maxBatchTimeout: 0.05 /* 50ms */ },
          },
        },
        wrangler: { configPath: './wrangler.jsonc' },
      },
    },
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
});
