import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node22',
  bundle: true,
  noExternal: ['@rafters/design-tokens', '@rafters/shared'],
  outDir: 'dist',
  clean: true,
});
