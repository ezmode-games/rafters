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
  // CLI integration tests use module-level context for step state sharing
  // Run sequentially to avoid test isolation issues
  fullyParallel: false,
  workers: 1,
  // Skip studio tests - they require full dev environment with all packages built
  // Run separately with: pnpm exec playwright test --grep "studio"
  testIgnore: ['**/studio.feature.spec.js'],
});
