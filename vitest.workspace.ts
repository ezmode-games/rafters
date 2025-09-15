import { defineWorkspace } from 'vitest/config';

/**
 * Monorepo Testing Architecture - Root Workspace Configuration
 *
 * This workspace orchestrates testing across all packages and apps with:
 * - Dependency-aware test execution
 * - Parallel execution with intelligent caching
 * - Environment-specific configurations
 * - Progressive test stages (unit → integration → e2e)
 * - Future-ready patterns for scaling
 */
export default defineWorkspace([
  // ========================================
  // UNIT TESTING WORKSPACE
  // ========================================
  {
    extends: './vitest.config.ts',
    test: {
      name: 'unit',
      include: [
        'packages/**/*.test.ts',
        'packages/**/*.test.tsx',
        'apps/**/*.test.ts',
        'apps/**/*.test.tsx',
      ],
      exclude: [
        'node_modules/**',
        'dist/**',
        'build/**',
        '.next/**',
        '**/*.spec.ts', // Integration tests
        '**/*.e2e.ts', // E2E tests
      ],
      environment: 'node',
      pool: 'forks',
      poolOptions: {
        forks: {
          singleFork: false,
          isolate: true,
        },
      },
      // Optimize for speed
      fileParallelism: true,
      coverage: {
        enabled: true,
        provider: 'v8',
        reporter: ['json', 'lcov', 'text'],
        reportsDirectory: './coverage/unit',
        include: ['packages/*/src/**', 'apps/*/src/**'],
        exclude: [
          'packages/*/test/**',
          'apps/*/test/**',
          '**/*.d.ts',
          '**/*.test.*',
          '**/*.spec.*',
          '**/*.e2e.*',
        ],
        thresholds: {
          global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
          },
        },
      },
    },
  },

  // ========================================
  // INTEGRATION TESTING WORKSPACE
  // Cloudflare Workers environment
  // ========================================
  {
    test: {
      name: 'integration',
      include: [
        'packages/**/*.spec.ts',
        'packages/**/*.spec.tsx',
        'apps/**/*.spec.ts',
        'apps/**/*.spec.tsx',
      ],
      exclude: ['node_modules/**', 'dist/**', 'build/**', '.next/**'],
      pool: '@cloudflare/vitest-pool-workers',
      poolOptions: {
        workers: {
          singleWorker: false,
          wrangler: {
            configPath: './wrangler.jsonc',
          },
          // Mock bindings for testing
          bindings: {
            RAFTERS_INTEL: { type: 'kv' },
            NODE_ENV: 'test',
          },
        },
      },
      coverage: {
        enabled: true,
        provider: 'v8',
        reporter: ['json', 'lcov'],
        reportsDirectory: './coverage/integration',
        include: ['packages/*/src/**', 'apps/*/src/**'],
        exclude: ['packages/*/test/**', 'apps/*/test/**', '**/*.d.ts', '**/*.test.*', '**/*.e2e.*'],
      },
    },
  },

  // ========================================
  // COMPONENT TESTING WORKSPACE
  // Playwright Component Testing
  // ========================================
  {
    test: {
      name: 'component',
      include: [
        'packages/ui/src/**/*.component.test.ts',
        'packages/ui/src/**/*.component.test.tsx',
        'apps/website/src/**/*.component.test.ts',
        'apps/website/src/**/*.component.test.tsx',
      ],
      exclude: ['node_modules/**', 'dist/**', 'build/**'],
      environment: 'happy-dom',
      setupFiles: ['./test/setup/component.setup.ts'],
      coverage: {
        enabled: true,
        provider: 'v8',
        reporter: ['json', 'lcov'],
        reportsDirectory: './coverage/component',
        include: ['packages/ui/src/**', 'apps/website/src/components/**'],
      },
    },
  },

  // ========================================
  // PACKAGE-SPECIFIC CONFIGURATIONS
  // ========================================

  // UI Package - Component-focused testing
  {
    extends: './packages/ui/vitest.config.ts',
    test: {
      name: 'ui-package',
      root: './packages/ui',
      include: ['src/**/*.test.{ts,tsx}'],
      environment: 'happy-dom',
      setupFiles: ['./test/setup.ts'],
    },
  },

  // Color Utils - Pure function testing
  {
    extends: './packages/color-utils/vitest.config.ts',
    test: {
      name: 'color-utils',
      root: './packages/color-utils',
      include: ['src/**/*.test.{ts,tsx}'],
      environment: 'node',
    },
  },

  // Shared Package - Utility testing
  {
    extends: './packages/shared/vitest.config.ts',
    test: {
      name: 'shared',
      root: './packages/shared',
      include: ['src/**/*.test.{ts,tsx}'],
      environment: 'node',
    },
  },

  // Design Tokens - Token validation testing
  {
    extends: './packages/design-tokens/vitest.config.ts',
    test: {
      name: 'design-tokens',
      root: './packages/design-tokens',
      include: ['src/**/*.test.{ts,tsx}'],
      environment: 'node',
    },
  },

  // ========================================
  // APP-SPECIFIC CONFIGURATIONS
  // ========================================

  // Website App - Full-stack testing
  {
    extends: './apps/website/vitest.config.ts',
    test: {
      name: 'website-unit',
      root: './apps/website',
      include: ['src/**/*.test.{ts,tsx}'],
      environment: 'node',
    },
  },

  // API App - Cloudflare Workers testing
  {
    extends: './apps/api/vitest.config.ts',
    test: {
      name: 'api',
      root: './apps/api',
      include: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}'],
      pool: '@cloudflare/vitest-pool-workers',
    },
  },

  // CLI App - Node.js testing
  {
    extends: './apps/cli/vitest.config.ts',
    test: {
      name: 'cli',
      root: './apps/cli',
      include: ['src/**/*.test.{ts,tsx}'],
      environment: 'node',
    },
  },
]);
