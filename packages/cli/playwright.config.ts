import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'test/features/**/*.feature',
  steps: 'test/steps/**/*.ts',
});

export default defineConfig({
  testDir,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    trace: 'on-first-retry',
  },
  // CLI tests don't need browser, run in parallel
  fullyParallel: true,
  workers: 4,
});
