import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineWorkersConfig({
  plugins: [tsconfigPaths()],
  test: {
    poolOptions: {
      workers: {
        wrangler: {
          configPath: './wrangler.jsonc',
        },
        bindings: {
          // Ensure KV is available for testing
          RAFTERS_INTEL: { type: 'kv' },
          // Environment variables
          CLAUDE_API_KEY: 'test-api-key-for-miniflare',
        },
      },
    },
    include: ['test/**/*.spec.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'], // Only .spec files for Cloudflare integration tests
    globals: true,
  },
});
