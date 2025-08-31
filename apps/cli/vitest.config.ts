import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 120000, // 2 minutes per test for integration tests
    hookTimeout: 30000, // 30 seconds for setup/teardown
    env: {
      NODE_ENV: 'test',
      VITEST: 'true',
    },
    // Only run integration tests in CI with higher timeout
    ...(process.env.CI && {
      testTimeout: 180000, // 3 minutes per test in CI
      include: ['test/**/*.{test,spec}.ts'],
    }),
  },
});
