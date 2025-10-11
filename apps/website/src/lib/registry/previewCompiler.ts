/**
 * Component Preview Compilation
 *
 * Compiles React/Vue/Svelte components to plain JavaScript using Vite's build API.
 * Enables interactive component previews with Shadow DOM isolation.
 */

import { parse } from 'node:path';
import type { Preview } from '@rafters/shared';
import { PreviewCVASchema } from '@rafters/shared';
import type { z } from 'zod';
import react from '@vitejs/plugin-react';
import { build } from 'vite';

export interface PreviewCompilationOptions {
  componentPath: string;
  componentContent: string;
  framework: 'react' | 'vue' | 'svelte';
  variant?: string;
  props?: Record<string, unknown>;
}

export interface CompiledPreview {
  framework: 'react' | 'vue' | 'svelte';
  variant: string;
  props: Record<string, unknown>;
  compiledJs: string;
  sizeBytes: number;
  error?: string;
}

/**
 * Compile a single component preview using Vite's build API
 */
export async function compileComponentPreview(
  options: PreviewCompilationOptions
): Promise<CompiledPreview> {
  const { framework, variant = 'default', props = {} } = options;

  // Validate framework
  if (!['react', 'vue', 'svelte'].includes(framework)) {
    return {
      framework,
      variant,
      props,
      compiledJs: '',
      sizeBytes: 0,
      error: `Unsupported framework: ${framework}`,
    };
  }

  try {
    // Use the actual component file location for proper import resolution
    const { dir: componentDir } = parse(options.componentPath);

    // Configure Vite build
    const result = await build({
      configFile: false,
      root: componentDir,
      build: {
        lib: {
          entry: options.componentPath,
          formats: ['es'],
          fileName: () => 'preview.js',
        },
        write: false, // Return output instead of writing
        minify: 'esbuild',
        rollupOptions: {
          external: [
            'react',
            'react-dom',
            'react/jsx-runtime',
            'react/jsx-dev-runtime',
            'class-variance-authority',
            '@rafters/shared',
            'masky-js',
            /^@radix-ui\//,
            /^@rafters\//,
          ],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              'react/jsx-runtime': 'jsxRuntime',
              'react/jsx-dev-runtime': 'jsxDevRuntime',
              'class-variance-authority': 'cva',
            },
          },
        },
      },
      plugins: framework === 'react' ? [react()] : [],
      logLevel: 'warn',
    });

    // Extract compiled JavaScript
    const output = Array.isArray(result) ? result[0] : result;
    if (!('output' in output)) {
      throw new Error('Unexpected build output format');
    }

    const chunk = output.output[0];
    if (!('code' in chunk)) {
      throw new Error('No code in build output');
    }

    const compiledJs = chunk.code;
    const sizeBytes = Buffer.byteLength(compiledJs, 'utf8');
    const sizeKB = (sizeBytes / 1024).toFixed(2);

    // Warn for large output
    if (sizeBytes > 100 * 1024) {
      console.warn(`Large compiled preview (${sizeKB}KB) for variant: ${variant}`);
    }

    return {
      framework,
      variant,
      props,
      compiledJs,
      sizeBytes,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown compilation error';
    return {
      framework,
      variant,
      props,
      compiledJs: '',
      sizeBytes: 0,
      error: `Vite build failed: ${errorMessage}`,
    };
  }
}

/**
 * Compile all preview variants for a component
 * Currently generates a default preview; future: extract from metadata
 */
export async function compileAllPreviews(
  componentName: string,
  componentFilePath: string,
  componentContent: string,
  framework: 'react',
  cva: z.infer<typeof PreviewCVASchema>,
  css: string,
  dependencies: string[]
): Promise<Preview[]> {
  // For now, just compile the default variant
  // Future: Parse component metadata to find all variants to generate
  const variants = ['default'];
  const previews: Preview[] = [];

  for (const variant of variants) {
    const preview = await compileComponentPreview({
      componentPath: componentFilePath,
      componentContent,
      framework,
      variant,
      props: {},
    });

    // Only include successful compilations in registry
    if (!preview.error) {
      previews.push({
        ...preview,
        cva,
        css,
        dependencies,
      });
    } else {
      console.warn(`Preview compilation failed for ${componentName} ${variant}:`, preview.error);
    }
  }

  return previews;
}
