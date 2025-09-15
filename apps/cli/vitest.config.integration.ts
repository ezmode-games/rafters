/**
 * Vitest configuration for CLI integration tests
 * Tests CLI commands in isolated environment
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.spec.ts'],
    exclude: ['test/**/*.test.ts', 'test/**/*.e2e.ts'],
    testTimeout: 30000, // CLI commands may take longer
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'test/', 'dist/', '**/*.d.ts'],
    },
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
});
