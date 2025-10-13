/**
 * Tailwind Critical CSS Extraction
 *
 * Generates minimal critical CSS for component previews using Tailwind's JIT compiler.
 * CSS is embedded in CVA intelligence for use by r-component-preview web component.
 */

import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export interface CriticalCSSOptions {
  classes: string[];
  minify?: boolean;
}

export interface CriticalCSSResult {
  css: string;
  sizeBytes: number;
  classCount: number;
}

/**
 * Extract critical CSS for specific Tailwind classes using JIT compiler
 * Returns CSS string to be embedded in CVA intelligence
 */
export async function extractCriticalCSS(options: CriticalCSSOptions): Promise<CriticalCSSResult> {
  const { classes, minify = true } = options;

  if (classes.length === 0) {
    return { css: '', sizeBytes: 0, classCount: 0 };
  }

  // Use complete design system CSS - need absolute path since temp file is in tmpdir
  const globalsPath = resolve(process.cwd(), 'src/data/globals.css');
  const template = `@import "tailwindcss";
@import "${globalsPath}";

<div class="${classes.join(' ')}"></div>`;

  // Write template to temp file in workspace (Tailwind v4 CLI needs to be in project to resolve @import)
  const tempInputPath = resolve(process.cwd(), '.astro', `tailwind-input-${Date.now()}.css`);
  await writeFile(tempInputPath, template);

  // Spawn Tailwind CLI process using --input flag instead of stdin
  const args = ['exec', 'tailwindcss', '--input', tempInputPath];
  if (minify) {
    args.push('-m');
  }

  return new Promise((resolve, reject) => {
    const tailwind = spawn('pnpm', args, {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'pipe'],
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
        reject(new Error('Tailwind CLI not available, run: pnpm add -D @tailwindcss/cli'));
      } else {
        reject(error);
      }
    });

    tailwind.on('close', (code) => {
      if (code !== 0) {
        reject(
          new Error(
            `Tailwind CSS generation failed (code ${code}): ${stderr || 'No error output'}\nStdout: ${stdout}`
          )
        );
        return;
      }

      const css = stdout.trim();
      const sizeBytes = Buffer.byteLength(css, 'utf8');
      const sizeKB = (sizeBytes / 1024).toFixed(2);

      if (sizeBytes > 50 * 1024) {
        console.warn(`Large CSS for classes (${sizeKB}KB): ${classes.slice(0, 5).join(', ')}...`);
      }

      resolve({
        css,
        sizeBytes,
        classCount: classes.length,
      });
    });
  });
}
