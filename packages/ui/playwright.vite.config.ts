/**
 * Vite configuration for Playwright Component Testing
 * Handles TypeScript decorators for Lit Web Components
 *
 * CRITICAL: Lit uses experimental decorators (@customElement, @property)
 * which are NOT supported by esbuild. This config uses vite-plugin-ts
 * to transpile TypeScript files using the TypeScript compiler instead,
 * which properly supports experimental decorators.
 *
 * The decorator support requires:
 * - experimentalDecorators: true (enables legacy decorator syntax)
 * - useDefineForClassFields: false (Lit compatibility requirement)
 *
 * Without vite-plugin-ts, you'll get: "Error: Unsupported decorator location: field"
 */

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import typescript from 'vite-plugin-ts';

export default defineConfig({
  plugins: [
    // React plugin for JSX/TSX support
    react(),

    // TypeScript plugin for experimental decorator support
    // This replaces esbuild's TS transpilation with tsc for .ts files
    // allowing experimental decorators to work with Lit Web Components
    typescript({
      // Use tsconfig settings for decorators
      tsconfig: {
        experimentalDecorators: true,
        useDefineForClassFields: false,
      },
      // Only transpile .ts files (let React plugin handle .tsx)
      include: ['**/*.ts'],
      exclude: ['**/*.tsx', '**/*.test.ts', '**/*.spec.ts'],
    }),
  ],

  resolve: {
    alias: {
      '@rafters/shared': new URL('../shared/src', import.meta.url).pathname,
    },
  },

  optimizeDeps: {
    include: ['lit', 'react', 'react-dom'],
    exclude: ['@rafters/ui'],
    // Note: esbuildOptions don't support experimental decorators
    // The vite-plugin-ts handles decorator transpilation before esbuild
    esbuildOptions: {
      target: 'es2020',
    },
  },
});
