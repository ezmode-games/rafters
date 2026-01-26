/**
 * Playwright Component Testing Configuration
 * Tests React and Vue Dialog components in real browsers
 */

import { defineConfig, devices } from '@playwright/experimental-ct-react';

export default defineConfig({
  ctViteConfig: {
    server: {
      watch: {
        // Exclude large directories from vite's file watcher
        ignored: ['**/target/**', '**/node_modules/**', '**/.git/**'],
      },
    },
  },
  testDir: './test',
  testMatch: ['**/*.spec.{ts,tsx}'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',

  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    ctPort: 3100,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    // TODO: Enable when webkit browser is installed (requires sudo)
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'], hasTouch: true },
    },
    // TODO: Enable when webkit browser is installed (requires sudo)
    // {
    //   name: 'mobile-safari',
    //   use: { ...devices['iPhone 13'], hasTouch: true },
    // },
  ],
});
