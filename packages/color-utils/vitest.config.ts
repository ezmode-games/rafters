/**
 * Vitest configuration for @rafters/color-utils package
 * Tests OKLCH color utilities and accessibility calculations
 */

import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts', 'test/**/*.spec.ts', 'src/**/*.test.ts'],
    exclude: ['test/**/*.e2e.ts', 'node_modules/**/*'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.d.ts',
        'src/index.ts', // Re-export file
      ],
      thresholds: {
        global: {
          branches: 75,
          functions: 75,
          lines: 75,
          statements: 75,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@rafters/shared': resolve(__dirname, '../shared/src'),
    },
  },
});
