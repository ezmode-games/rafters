import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { glob } from 'glob';
import { z } from 'zod';

const ClassMappingSchema = z.object({
  propName: z.string(),
  values: z.record(z.string(), z.array(z.string())),
});

const PreviewIntelligenceSchema = z.object({
  component: z.string(),
  baseClasses: z.array(z.string()),
  propMappings: z.array(ClassMappingSchema),
  allClasses: z.array(z.string()),
});

export type ClassMapping = z.infer<typeof ClassMappingSchema>;
export type PreviewIntelligence = z.infer<typeof PreviewIntelligenceSchema>;

export async function extractBaseClasses(source: string): Promise<string[]> {
  const baseMatch = source.match(/cn\(\s*'([^']+)'/);
  if (!baseMatch) return [];

  return baseMatch[1]
    .split(' ')
    .map((c) => c.trim())
    .filter(Boolean);
}

export async function extractClassMappings(source: string): Promise<ClassMapping[]> {
  const mappings: ClassMapping[] = [];
  const objectRegex = /\{([^}]+)\}/g;

  for (const objectMatch of source.matchAll(objectRegex)) {
    const objContent = objectMatch[1];
    const lineRegex = /'([^']+)':\s*(\w+)\s*===\s*'([^']+)'/g;
    const propMappings: Record<string, Record<string, string[]>> = {};

    for (const lineMatch of objContent.matchAll(lineRegex)) {
      const [, classes, propName, propValue] = lineMatch;

      if (!propMappings[propName]) {
        propMappings[propName] = {};
      }

      propMappings[propName][propValue] = classes
        .split(' ')
        .map((c) => c.trim())
        .filter(Boolean);
    }

    for (const [propName, values] of Object.entries(propMappings)) {
      mappings.push({ propName, values });
    }
  }

  return mappings;
}

export async function processComponent(path: string): Promise<PreviewIntelligence> {
  try {
    const source = await readFile(path, 'utf-8');
    const componentName = basename(path, '.tsx').toLowerCase();

    const baseClasses = await extractBaseClasses(source);
    const propMappings = await extractClassMappings(source);

    if (propMappings.length === 0) {
      console.warn(`No class mappings found for ${componentName}`);
    }

    const allClasses = [
      ...baseClasses,
      ...propMappings.flatMap((m) => Object.values(m.values).flat()),
    ];

    const intelligence: PreviewIntelligence = {
      component: componentName,
      baseClasses,
      propMappings,
      allClasses,
    };

    return PreviewIntelligenceSchema.parse(intelligence);
  } catch (error) {
    throw new Error(`Failed to read component: ${path} - ${error}`);
  }
}

export async function main(): Promise<void> {
  const componentPaths = await glob('src/components/*.tsx');
  const outputDir = join('..', '..', 'apps', 'website', 'public', 'registry', 'previews');

  try {
    await mkdir(outputDir, { recursive: true });
  } catch (error) {
    throw new Error(`Failed to create output directory: ${outputDir} - ${error}`);
  }

  let processedCount = 0;
  let errorCount = 0;

  for (const path of componentPaths) {
    try {
      const intelligence = await processComponent(path);
      const outputPath = join(outputDir, `${intelligence.component}.json`);

      await writeFile(outputPath, JSON.stringify(intelligence, null, 2), 'utf-8');

      processedCount++;
      console.log(`✓ Extracted ${intelligence.component}`);
    } catch (error) {
      errorCount++;
      console.error(`✗ Failed to process ${path}:`, error);
    }
  }

  console.log(`\nProcessed ${processedCount} components (${errorCount} errors)`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
