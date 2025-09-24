import path from 'node:path';
import { defineConfig } from 'vitest/config';

/**
 * Root Vitest Configuration for Monorepo
 *
 * Provides base configuration for all workspace projects with:
 * - TypeScript path mapping for monorepo packages
 * - Shared test utilities and setup
 * - Optimized performance defaults
 * - Future-ready extensibility patterns
 */
export default defineConfig({
  resolve: {
    alias: {
      // Monorepo package aliases for easy imports in tests
      '@rafters/ui': path.resolve(__dirname, './packages/ui/src'),
      '@rafters/shared': path.resolve(__dirname, './packages/shared/src'),
      '@rafters/design-tokens': path.resolve(__dirname, './packages/design-tokens/src'),

      // Test utilities aliases
      '@test/utils': path.resolve(__dirname, './test/utils'),
      '@test/fixtures': path.resolve(__dirname, './test/fixtures'),
      '@test/mocks': path.resolve(__dirname, './test/mocks'),
    },
  },

  test: {
    // Global test configuration
    globals: true,
    environment: 'node',

    // Performance optimizations
    pool: 'forks',
    fileParallelism: true,
    isolate: true,

    // Timeout configurations
    testTimeout: 30000,
    hookTimeout: 30000,
    teardownTimeout: 10000,

    // Setup files for global test configuration
    setupFiles: ['./test/setup/global.setup.ts'],

    // Global excludes
    exclude: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.next/**',
      'out/**',
      'coverage/**',
      'test-results/**',
      'playwright-report*/**',
    ],

    // Reporter configuration for CI/local development
    reporter: process.env.CI ? ['verbose', 'github-actions', 'junit'] : ['verbose', 'html'],

    outputFile: {
      junit: './test-results/junit.xml',
      html: './test-results/html/index.html',
    },

    // Coverage configuration (base settings)
    coverage: {
      enabled: false, // Enabled per workspace project
      provider: 'v8',
      clean: true,
      cleanOnRerun: true,
      reporter: ['text', 'json', 'lcov', 'html'],
      reportsDirectory: './coverage',

      // Global coverage excludes
      exclude: [
        'coverage/**',
        'dist/**',
        'build/**',
        '.next/**',
        'out/**',
        'test/**',
        'test-results/**',
        'vitest.*.ts',
        'vitest.workspace.ts',
        '**/*.d.ts',
        '**/*.config.{js,ts,mjs,mts}',
        '**/*.test.{js,ts,jsx,tsx}',
        '**/*.spec.{js,ts,jsx,tsx}',
        '**/*.e2e.{js,ts,jsx,tsx}',
        '**/types/**',
        '**/node_modules/**',
      ],
    },

    // Watch mode optimizations
    watch: {
      // Ignore files that don't affect tests
      exclude: [
        'node_modules/**',
        'dist/**',
        'build/**',
        '.next/**',
        'coverage/**',
        'test-results/**',
        '*.md',
        '*.json',
        '*.yaml',
        '*.yml',
      ],
    },

    // Retry configuration for flaky tests
    retry: process.env.CI ? 2 : 0,

    // Concurrent test execution limits
    maxConcurrency: process.env.CI ? 4 : 8,

    // TypeScript configuration
    typecheck: {
      enabled: true,
      only: false,
      tsconfig: './tsconfig.json',
    },
  },

  // ESBuild optimizations
  esbuild: {
    target: 'node22',
  },

  // Define global constants for tests
  define: {
    __TEST__: true,
    __VERSION__: JSON.stringify(process.env.npm_package_version || '0.0.0'),
  },
});
