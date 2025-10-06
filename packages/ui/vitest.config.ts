/**
 * Vitest configuration for @rafters/ui package
 * Tests React components, hooks, and utilities
 */

import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    include: [
      'test/**/*.test.ts',
      'test/**/*.test.tsx',
      'src/**/*.test.ts',
      'src/**/*.test.tsx',
      'src/**/__tests__/**/*.test.*',
    ],
    exclude: ['test/**/*.spec.ts', 'test/**/*.e2e.ts', 'node_modules/**/*'],
    server: {
      deps: {
        inline: ['masky-js'],
      },
    },
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.d.ts',
        'src/index.ts', // Re-export file
        'src/components/index.ts', // Re-export file
        'src/hooks/index.ts', // Re-export file
        'src/lib/index.ts', // Re-export file
        'src/providers/index.ts', // Re-export file
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
    },
  },
});
