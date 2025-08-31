import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 120000, // 2 minutes per test for integration tests
    hookTimeout: 30000, // 30 seconds for setup/teardown
    // Disable threading for I/O-bound integration tests - creates contention
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true, // Run all tests in single process to avoid resource conflicts
      },
    },
    env: {
      NODE_ENV: 'test',
      VITEST: 'true',
    },
    // CI optimizations - shorter timeouts, sequential execution
    ...(process.env.CI && {
      testTimeout: 180000, // 3 minutes per test in CI
      include: ['test/**/*.{test,spec}.ts'],
    }),
  },
});
