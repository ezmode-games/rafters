/**
 * Playwright Component Testing Configuration
 *
 * This is the PRIMARY UI testing method for Rafters components.
 * Tests components in real browser environments with concurrent rendering,
 * validates design intelligence accessibility, and ensures cross-browser consistency.
 *
 * Why Playwright Component Testing over jsdom:
 * - React 19 concurrent features require real browser environment
 * - True browser rendering validates design intelligence
 * - Cross-browser consistency for component behavior
 * - Real user interaction testing (hover, focus, keyboard navigation)
 * - Visual regression testing capabilities
 */

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/experimental-ct-react';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  testDir: './test',
  testMatch: '**/*.component.{ts,tsx}',

  /* Run component tests in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only */
  forbidOnly: !!process.env.CI,

  /* Retry on CI for component test stability */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI for component consistency */
  workers: process.env.CI ? 2 : undefined,

  /* Reporter for component testing */
  reporter: [
    ['html', { outputFolder: 'playwright-report-components' }],
    ['json', { outputFile: 'test-results/component-results.json' }],
    ['junit', { outputFile: 'test-results/component-results.xml' }],
  ],

  /* Shared settings for component testing */
  use: {
    /* Collect trace when component test fails */
    trace: 'on-first-retry',

    /* Screenshot on failure for visual debugging */
    screenshot: 'only-on-failure',

    /* Video recording for complex component interactions */
    video: 'retain-on-failure',

    /* Component testing specific settings */
    ctViteConfig: {
      // Vite configuration for component testing
      resolve: {
        alias: {
          '@': resolve(__dirname, './src'),
          '@rafters/design-tokens': resolve(__dirname, '../design-tokens/src'),
          '@rafters/shared': resolve(__dirname, '../shared/src'),
        },
      },

      define: {
        // Enable React 19 concurrent features in tests
        __REACT_CONCURRENT_MODE__: true,
      },

      // CSS processing for design token testing
      css: {
        modules: {
          // Enable CSS modules for component isolation
          localsConvention: 'camelCase',
        },
      },

      // Optimize for component testing performance
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          '@radix-ui/react-dialog',
          '@radix-ui/react-slot',
          'class-variance-authority',
          'clsx',
          'tailwind-merge',
        ],
      },
    },
  },

  /* Configure projects for different browsers and contexts */
  projects: [
    {
      name: 'chromium-components',
      use: {
        ...devices['Desktop Chrome'],
        // Enable modern browser features for React 19 testing
        viewport: { width: 1280, height: 720 },
      },
    },

    {
      name: 'firefox-components',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
      },
    },

    {
      name: 'webkit-components',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
      },
    },

    /* Mobile component testing for responsive behavior */
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },

    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 12'],
      },
    },

    /* High DPI testing for design consistency */
    {
      name: 'high-dpi',
      use: {
        ...devices['Desktop Chrome'],
        deviceScaleFactor: 2,
        viewport: { width: 1280, height: 720 },
      },
    },

    /* Dark mode component testing */
    {
      name: 'dark-mode',
      use: {
        ...devices['Desktop Chrome'],
        colorScheme: 'dark',
        viewport: { width: 1280, height: 720 },
      },
    },

    /* Reduced motion testing for accessibility */
    {
      name: 'reduced-motion',
      use: {
        ...devices['Desktop Chrome'],
        reducedMotion: 'reduce',
        viewport: { width: 1280, height: 720 },
      },
    },

    /* High contrast testing for accessibility */
    {
      name: 'high-contrast',
      use: {
        ...devices['Desktop Chrome'],
        forcedColors: 'active',
        viewport: { width: 1280, height: 720 },
      },
    },
  ],

  /* Global test timeout for component testing */
  timeout: 30000,
  expect: {
    /* Timeout for component assertions */
    timeout: 10000,
  },
});
