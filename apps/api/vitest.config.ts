/**
 * Vitest configuration for unit tests
 * Uses Node.js environment for fast, isolated unit testing
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts'],
    exclude: ['test/**/*.spec.ts'], // Integration tests use .spec.ts
    setupFiles: [],
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
});
