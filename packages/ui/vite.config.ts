import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    projects: [
      // Regular unit tests
      {
        test: {
          name: 'unit',
          globals: true,
          environment: 'node',
          exclude: ['**/node_modules', '**/dist'],
          include: ['tests/**/*.test.ts'],
        },
      },
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
    ],
  },
});
