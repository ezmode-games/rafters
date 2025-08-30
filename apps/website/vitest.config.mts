import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'node', // Unit tests don't need browser environment
    include: ['test/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'], // Only .test files in test folder
    globals: true,
    setupFiles: ['./test/setup.ts'],
  },
});
