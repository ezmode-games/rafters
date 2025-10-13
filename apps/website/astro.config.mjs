import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
    imageService: 'cloudflare',
  }),
  build: {
    format: 'file',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    react(),
    mdx(),
    // Registry Generation Integration
    {
      name: 'registry-generator',
      hooks: {
        'astro:config:setup': ({ updateConfig }) => {
          // Ensure registry data is available at build time
          updateConfig({
            vite: {
              define: {
                // This ensures the registry data is bundled
                'process.env.REGISTRY_BUILD': '"true"',
              },
              ssr: {
                // Don't bundle Vite and build tools - they run at build time only
                external: ['vite', '@vitejs/plugin-react', 'rollup', 'esbuild'],
              },
            },
          });
        },
        'astro:build:start': () => {
          console.log('📋 Registry build started - component intelligence will be embedded');
        },
        'astro:build:done': ({ dir }) => {
          console.log(
            `✅ Registry build complete - static API routes generated at ${dir.pathname}`
          );
        },
      },
    },
  ],
});
