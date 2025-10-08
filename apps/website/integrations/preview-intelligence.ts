import { exec } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { promisify } from 'node:util';
import type { AstroIntegration } from 'astro';

const execPromise = promisify(exec);

export interface PreviewIntelligenceOptions {
  outputDir?: string;
  minifyCSS?: boolean;
}

export function previewIntelligence(options: PreviewIntelligenceOptions = {}): AstroIntegration {
  const { outputDir = 'apps/website/public/registry/previews' } = options;

  return {
    name: 'rafters-preview-intelligence',
    hooks: {
      'astro:build:start': async () => {
        console.log('[preview-intelligence] Starting extraction...');

        try {
          await mkdir(outputDir, { recursive: true });
        } catch (error) {
          throw new Error(`Failed to create registry directory: ${error}`);
        }

        try {
          console.log('[preview-intelligence] Extracting classes...');
          const { stdout: extractOutput } = await execPromise('pnpm --filter=ui extract:preview');
          console.log(extractOutput);

          console.log('[preview-intelligence] Generating critical CSS...');
          const { stdout: cssOutput } = await execPromise('pnpm --filter=ui extract:css');
          console.log(cssOutput);

          console.log('[preview-intelligence] Extraction complete');
        } catch (error) {
          if (error instanceof Error && 'stderr' in error) {
            throw new Error(
              `Preview intelligence extraction failed: ${(error as { stderr: string }).stderr}`
            );
          }
          throw error;
        }
      },
    },
  };
}
