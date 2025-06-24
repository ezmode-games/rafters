import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default [
  // Regular unit tests
  'vitest.config.ts',
  // Storybook tests project 
  {
    plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
    optimizeDeps: {
      include: ['react/jsx-dev-runtime'],
    },
    test: {
      name: 'storybook',
      browser: {
        enabled: true,
        headless: true,
        provider: 'playwright',
        instances: [{ browser: 'chromium' }],
        screenshotFailures: false,
        slowHijackESM: false,
      },
      setupFiles: ['.storybook/vitest.setup.ts'],
      testTimeout: 60000,
      hookTimeout: 60000,
    },
  },
];
