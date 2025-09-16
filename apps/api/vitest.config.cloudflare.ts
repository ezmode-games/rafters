/**
 * Vitest configuration for Cloudflare Workers API testing
 * Uses actual Workers runtime with KV, R2, D1 bindings
 */

import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig({
  test: {
    globals: true,
    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.spec.ts', 'test/**/*.test.ts'],
    poolOptions: {
      workers: {
        wrangler: { configPath: './wrangler.jsonc' },
        bindings: {
          // Cloudflare service bindings for testing
          RAFTERS_INTEL: { type: 'kv' },
          RAFTERS_CACHE: { type: 'kv' },
          RAFTERS_COLORS: { type: 'd1', databaseName: 'rafters-colors' },
          COLOR_SEED_QUEUE: { type: 'queue' },

          // External API keys (not tested - external service availability)
          CLAUDE_API_KEY: 'test-api-key',
          CF_TOKEN: 'test-cf-token',
          CLAUDE_GATEWAY_URL: 'https://gateway.example.com',
          SEED_QUEUE_API_KEY: 'test-queue-api-key',

          // Environment variables
          ENVIRONMENT: 'test',
          DEBUG: 'true',
        },
        miniflare: {
          // Miniflare configuration for local testing
          kvNamespaces: ['RAFTERS_INTEL', 'RAFTERS_CACHE'],
          d1Databases: ['RAFTERS_COLORS'],
          queueProducers: ['COLOR_SEED_QUEUE'],
          // Isolated storage for each test
          compatibilityDate: '2025-09-15',
          compatibilityFlags: ['nodejs_compat'],
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
