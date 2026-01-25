import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const isA11yRun = process.env.VITEST_A11Y === '1';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    include: isA11yRun
      ? ['test/**/*.a11y.{ts,tsx}']
      : ['src/**/*.test.{ts,tsx}', 'test/**/*.test.{ts,tsx}'],
    exclude: isA11yRun
      ? ['test/**/*.spec.{ts,tsx}', 'test/**/*.e2e.{ts,tsx}']
      : ['test/**/*.a11y.{ts,tsx}', 'test/**/*.spec.{ts,tsx}', 'test/**/*.e2e.{ts,tsx}'],
    // Limit parallelism for a11y tests (axe-core is memory-intensive)
    ...(isA11yRun && {
      pool: 'threads',
      poolOptions: {
        threads: {
          maxThreads: 4,
          minThreads: 1,
        },
      },
    }),
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}'],
    },
  },
});
