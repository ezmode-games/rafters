import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { studioApiPlugin } from './src/api/vite-plugin';

// Project path is set by the CLI command `rafters studio`
const projectPath = process.env.RAFTERS_PROJECT_PATH || process.cwd();

export default defineConfig({
  plugins: [react(), tailwindcss(), studioApiPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      // Alias for project's CSS output - enables HMR for rafters.vars.css
      '@rafters-output': resolve(projectPath, '.rafters', 'output'),
    },
  },
  server: {
    port: 7777,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
