import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  build:
    command === 'build'
      ? {
          lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'RaftersStudio',
            formats: ['es', 'cjs'],
            fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
          },
          rollupOptions: {
            external: [
              'react',
              'react-dom',
              'gsap',
              'lucide-react',
              'react-colorful',
              'clsx',
              'tailwind-merge',
            ],
            output: {
              globals: {
                react: 'React',
                'react-dom': 'ReactDOM',
                gsap: 'gsap',
                'lucide-react': 'LucideReact',
                'react-colorful': 'ReactColorful',
                clsx: 'clsx',
                'tailwind-merge': 'tailwindMerge',
              },
            },
          },
        }
      : {},
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
}));
