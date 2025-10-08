import { exec } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import { glob } from 'glob';
import { z } from 'zod';

const execPromise = promisify(exec);

const PreviewIntelligenceSchema = z.object({
  component: z.string(),
  baseClasses: z.array(z.string()),
  propMappings: z.array(
    z.object({
      propName: z.string(),
      values: z.record(z.string(), z.array(z.string())),
    })
  ),
  allClasses: z.array(z.string()),
  criticalCSS: z.string().optional(),
});

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

export async function extractCriticalCSS(options: CriticalCSSOptions): Promise<CriticalCSSResult> {
  const { classes, minify = true } = options;

  if (classes.length === 0) {
    return {
      css: '',
      sizeBytes: 0,
      classCount: 0,
    };
  }

  const htmlTemplate = `<div class="${classes.join(' ')}"></div>`;
  const minifyFlag = minify ? '--minify' : '';

  try {
    const { stdout } = await execPromise(
      `echo '${htmlTemplate}' | pnpm tailwindcss ${minifyFlag}`,
      {
        cwd: 'packages/ui',
      }
    );

    const sizeBytes = Buffer.byteLength(stdout, 'utf-8');
    const sizeKB = sizeBytes / 1024;

    if (sizeKB > 50) {
      console.warn(`Large CSS bundle: ${sizeKB.toFixed(2)}KB`);
    }

    return {
      css: stdout,
      sizeBytes,
      classCount: classes.length,
    };
  } catch (error) {
    throw new Error(`Tailwind CLI not available, run: pnpm add -D tailwindcss - ${error}`);
  }
}

export async function processPreviews(): Promise<void> {
  const previewPaths = await glob('apps/website/public/registry/previews/*.json');

  let processedCount = 0;
  let totalSize = 0;

  for (const path of previewPaths) {
    try {
      const content = await readFile(path, 'utf-8');
      const intelligence = PreviewIntelligenceSchema.parse(JSON.parse(content)) as {
        component: string;
        baseClasses: string[];
        propMappings: Array<{
          propName: string;
          values: Record<string, string[]>;
        }>;
        allClasses: string[];
        criticalCSS?: string;
      };

      if (!intelligence.allClasses || intelligence.allClasses.length === 0) {
        console.warn(`No classes found for ${intelligence.component}`);
        continue;
      }

      const result = await extractCriticalCSS({
        classes: intelligence.allClasses,
        outputPath: path,
        minify: true,
      });

      intelligence.criticalCSS = result.css;

      await writeFile(path, JSON.stringify(intelligence, null, 2), 'utf-8');

      processedCount++;
      totalSize += result.sizeBytes;
      console.log(`✓ Generated CSS for ${intelligence.component} (${result.sizeBytes} bytes)`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Invalid preview intelligence format: ${path}`);
      }
      console.error(`✗ Failed to process ${path}:`, error);
    }
  }

  console.log(
    `\nGenerated critical CSS for ${processedCount} components (${(totalSize / 1024).toFixed(2)}KB total)`
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  processPreviews().catch(console.error);
}
