import { defineConfig, devices } from '@playwright/experimental-ct-react';

/**
 * Playwright Component Testing Configuration for Rafters UI
 * Tests React components in isolation using Tailwind v4
 */
export default defineConfig({
  testDir: './test',
  testMatch: ['**/*.component.{ts,tsx}', '**/*.spec.{ts,tsx}'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // CI-friendly reporter configuration
  reporter: process.env.CI ? [['json'], ['junit']] : [['html', { open: 'never' }]],

  use: {
    trace: 'on-first-retry',
    ctPort: 3100,
    ctTemplateDir: './playwright',
    ctViteConfig: './playwright.vite.config.ts',
  },

  // Simplified browser testing for CI
  projects: process.env.CI
    ? [
        {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'] },
        },
      ]
    : [
        {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'] },
        },
        {
          name: 'firefox',
          use: { ...devices['Desktop Firefox'] },
        },
        {
          name: 'webkit',
          use: { ...devices['Desktop Safari'] },
        },
      ],
});
