import path from 'node:path';
import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@scalar/hono-api-reference': path.resolve(__dirname, './test/mocks/scalar.ts'),
    },
  },
  test: {
    globals: true,
    include: ['test/**/*.test.ts'],
    poolOptions: {
      workers: {
        singleWorker: true,
        wrangler: { configPath: './wrangler.test.jsonc' },
        miniflare: {
          compatibilityDate: '2025-09-06',
          compatibilityFlags: ['nodejs_compat'],
        },
      },
    },
  },
});
