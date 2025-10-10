/**
 * Component Preview Compilation
 *
 * Compiles React/Vue/Svelte components to plain JavaScript using Vite's build API.
 * Enables interactive component previews with Shadow DOM isolation.
 */

import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Preview } from '@rafters/shared';
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
  const { componentContent, framework, variant = 'default', props = {} } = options;

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

  // Create temporary directory for build
  const tempDir = join(tmpdir(), `rafters-preview-${Date.now()}`);
  const entryFile = join(tempDir, `preview-${variant}.tsx`);

  try {
    // Create temp directory
    mkdirSync(tempDir, { recursive: true });

    // Write component source to temp file
    writeFileSync(entryFile, componentContent, 'utf8');

    // Configure Vite build
    const result = await build({
      configFile: false,
      root: tempDir,
      build: {
        lib: {
          entry: entryFile,
          formats: ['es'],
          fileName: () => 'preview.js',
        },
        write: false, // Return output instead of writing
        minify: 'esbuild',
        rollupOptions: {
          external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              'react/jsx-runtime': 'jsxRuntime',
              'react/jsx-dev-runtime': 'jsxDevRuntime',
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
  } finally {
    // Clean up temp directory
    try {
      rmSync(tempDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.warn('Failed to clean up temp directory:', cleanupError);
    }
  }
}

/**
 * Compile all preview variants for a component
 * Currently generates a default preview; future: extract from metadata
 */
export async function compileAllPreviews(
  componentName: string,
  componentContent: string,
  framework: 'react'
): Promise<Preview[]> {
  // For now, just compile the default variant
  // Future: Parse component metadata to find all variants to generate
  const variants = ['default'];
  const previews: Preview[] = [];

  for (const variant of variants) {
    const preview = await compileComponentPreview({
      componentPath: `${componentName}.tsx`,
      componentContent,
      framework,
      variant,
      props: {},
    });

    // Only include successful compilations in registry
    if (!preview.error) {
      previews.push(preview);
    } else {
      console.warn(`Preview compilation failed for ${componentName} ${variant}:`, preview.error);
    }
  }

  return previews;
}
