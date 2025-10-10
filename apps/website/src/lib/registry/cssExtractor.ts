/**
 * Tailwind Critical CSS Extraction
 *
 * Generates minimal critical CSS for component previews using Tailwind's JIT compiler.
 * Extracts classes from CVA intelligence in the registry and generates scoped CSS.
 */

import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { type ComponentManifest, ComponentManifestSchema } from '@rafters/shared';
import { getRegistryMetadata } from './componentService.js';

export interface CriticalCSSOptions {
  classes: string[];
  outputPath: string;
  minify?: boolean;
}

export interface CriticalCSSResult {
  css: string;
  sizeBytes: number;
  classCount: number;
}

/**
 * Extract critical CSS for specific Tailwind classes using JIT compiler
 */
export async function extractCriticalCSS(options: CriticalCSSOptions): Promise<CriticalCSSResult> {
  const { classes, outputPath, minify = true } = options;

  if (classes.length === 0) {
    return { css: '', sizeBytes: 0, classCount: 0 };
  }

  // Generate HTML template with all classes
  const template = `<div class="${classes.join(' ')}"></div>`;

  // Spawn Tailwind CLI process
  const args = ['--input=-', '--output=-'];
  if (minify) {
    args.push('--minify');
  }

  return new Promise((resolve, reject) => {
    const tailwind = spawn('tailwindcss', args, {
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    tailwind.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    tailwind.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    tailwind.on('error', (error) => {
      if (error.message.includes('ENOENT')) {
        reject(new Error('Tailwind CLI not available, run: pnpm add -D tailwindcss'));
      } else {
        reject(error);
      }
    });

    tailwind.on('close', async (code) => {
      if (code !== 0) {
        reject(new Error(`Tailwind CSS generation failed: ${stderr}`));
        return;
      }

      const css = stdout.trim();
      const sizeBytes = Buffer.byteLength(css, 'utf8');
      const sizeKB = (sizeBytes / 1024).toFixed(2);

      if (sizeBytes > 50 * 1024) {
        console.warn(`Large CSS bundle for ${outputPath}: ${sizeKB}KB`);
      }

      // Write CSS to output file
      try {
        await mkdir(dirname(outputPath), { recursive: true });
        await writeFile(outputPath, css, 'utf8');
      } catch (error) {
        reject(
          new Error(
            `Failed to write CSS to ${outputPath}: ${error instanceof Error ? error.message : String(error)}`
          )
        );
        return;
      }

      resolve({
        css,
        sizeBytes,
        classCount: classes.length,
      });
    });

    // Write template to stdin
    tailwind.stdin.write(template);
    tailwind.stdin.end();
  });
}

/**
 * Process all components from registry and generate critical CSS
 */
export async function processComponents(outputDir?: string): Promise<void> {
  console.log('[cssExtractor] Loading registry components...');

  let components: ComponentManifest[];

  try {
    const registry = getRegistryMetadata();
    components = registry.components;

    // Validate with Zod
    for (const component of components) {
      ComponentManifestSchema.parse(component);
    }
  } catch (error) {
    throw new Error(
      `Failed to load registry: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  console.log(`[cssExtractor] Processing ${components.length} components...`);

  const cssOutputDir = outputDir || join(process.cwd(), 'public/registry/css');
  let successCount = 0;
  let failCount = 0;
  let totalBytes = 0;

  for (const component of components) {
    const cva = component.meta?.rafters?.intelligence?.cva;

    if (!cva || !cva.allClasses || cva.allClasses.length === 0) {
      console.log(`[cssExtractor] Skipping ${component.name} (no CVA classes)`);
      continue;
    }

    try {
      const outputPath = join(cssOutputDir, `${component.name}.css`);
      const result = await extractCriticalCSS({
        classes: cva.allClasses,
        outputPath,
        minify: true,
      });

      totalBytes += result.sizeBytes;
      successCount++;

      const sizeKB = (result.sizeBytes / 1024).toFixed(2);
      console.log(`[cssExtractor] ${component.name}: ${result.classCount} classes, ${sizeKB}KB`);
    } catch (error) {
      failCount++;
      console.error(
        `[cssExtractor] Failed to generate CSS for ${component.name}:`,
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  const totalKB = (totalBytes / 1024).toFixed(2);
  console.log(
    `[cssExtractor] Complete: ${successCount} succeeded, ${failCount} failed, ${totalKB}KB total`
  );

  if (failCount > 0) {
    throw new Error(`Critical CSS extraction failed for ${failCount} components`);
  }
}
