/**
 * Vitest configuration for @rafters/design-tokens package
 * Tests token parsing, generation, and export functionality
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
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@rafters/shared': resolve(__dirname, '../shared/src'),
      '@rafters/color-utils': resolve(__dirname, '../color-utils/src'),
      '@rafters/math-utils': resolve(__dirname, '../math-utils/src'),
    },
  },
});
