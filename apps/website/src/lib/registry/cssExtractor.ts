/**
 * Tailwind Critical CSS Extraction
 *
 * Generates minimal critical CSS for component previews using Tailwind's JIT compiler.
 * CSS is embedded in CVA intelligence for use by r-component-preview web component.
 */

import { spawn } from 'node:child_process';

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

    tailwind.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Tailwind CSS generation failed: ${stderr}`));
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

    // Write template to stdin
    tailwind.stdin.write(template);
    tailwind.stdin.end();
  });
}
