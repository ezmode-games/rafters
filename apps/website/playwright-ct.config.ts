import { defineConfig, devices } from '@playwright/experimental-ct-react';

/**
 * Playwright Component Testing Configuration
 *
 * Tests React components in isolation using Playwright's component testing
 * Perfect for testing ComponentPreview Shadow DOM functionality
 */
export default defineConfig({
  testDir: './test',
  testMatch: '**/*.component.{ts,tsx}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['json']] : [['html', { open: 'never' }]],

  use: {
    trace: 'on-first-retry',
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
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
