import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Primitives Component Testing
 *
 * Tests Web Components in isolation with accessibility validation via axe-core
 */
export default defineConfig({
  testDir: './test',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['json']] : [['html', { open: 'never' }]],

  use: {
    trace: 'on-first-retry',
    baseURL: 'http://localhost:3100',
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
