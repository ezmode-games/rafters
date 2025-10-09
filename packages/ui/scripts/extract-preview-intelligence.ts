/**
 * Component Class Intelligence Extractor
 *
 * Extracts prop-to-class mappings from React framework components using CVA (class-variance-authority).
 * Parses cva() configurations to determine which CSS classes are applied based on prop values.
 *
 * @example
 * ```bash
 * pnpm tsx scripts/extract-preview-intelligence.ts
 * ```
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const __dirname = dirname(fileURLToPath(import.meta.url));

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

export interface ClassMapping {
  propName: string;
  values: Record<string, string[]>;
}

export interface PreviewIntelligence {
  component: string;
  baseClasses: string[];
  propMappings: ClassMapping[];
  allClasses: string[];
}

/**
 * Extract base classes from cva() first argument
 */
export async function extractBaseClasses(source: string): Promise<string[]> {
  const baseClasses: string[] = [];

  // Find cva() call and extract first argument (base classes)
  const cvaMatch = source.match(/cva\(\s*'([^']+)'/);
  if (!cvaMatch) return baseClasses;

  const classString = cvaMatch[1];
  const classes = classString.split(/\s+/).filter((c) => c.length > 0);
  baseClasses.push(...classes);

  return baseClasses;
}

/**
 * Extract prop-to-class mappings from cva() variants object
 * Groups by prop name with all values as Record<string, string[]>
 */
export async function extractClassMappings(source: string): Promise<ClassMapping[]> {
  const mappings: ClassMapping[] = [];

  // Find cva() call - match the entire config object
  const cvaMatch = source.match(/cva\(\s*'[^']+',\s*\{([\s\S]*?)\}\s*\)/);
  if (!cvaMatch) return mappings;

  const cvaConfig = cvaMatch[1];

  // Extract variants object using proper brace matching
  const variantsStart = cvaConfig.indexOf('variants:');
  if (variantsStart === -1) return mappings;

  // Find the opening brace for variants
  const variantsOpenBrace = cvaConfig.indexOf('{', variantsStart);
  if (variantsOpenBrace === -1) return mappings;

  // Match braces to find the closing brace for variants
  let depth = 1;
  let variantsEnd = variantsOpenBrace + 1;
  while (depth > 0 && variantsEnd < cvaConfig.length) {
    if (cvaConfig[variantsEnd] === '{') depth++;
    if (cvaConfig[variantsEnd] === '}') depth--;
    variantsEnd++;
  }

  const variantsContent = cvaConfig.substring(variantsOpenBrace + 1, variantsEnd - 1);

  // Parse each variant prop group
  // Need to handle nested objects properly, including multi-line string values
  const lines = variantsContent.split('\n');
  let currentProp: string | null = null;
  let currentValues: Record<string, string[]> = {};
  let inPropGroup = false;
  let braceDepth = 0;
  let currentValueName: string | null = null;
  let accumulatedValue = '';
  let inMultiLineValue = false;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    // Detect start of a prop group: "propName: {"
    const propStartMatch = trimmed.match(/^(\w+):\s*\{/);
    if (propStartMatch && braceDepth === 0) {
      // Save previous prop if exists
      if (currentProp) {
        mappings.push({
          propName: currentProp,
          values: currentValues,
        });
      }

      currentProp = propStartMatch[1];
      currentValues = {};
      inPropGroup = true;
      braceDepth = 1;
      inMultiLineValue = false;
      currentValueName = null;
      accumulatedValue = '';
      continue;
    }

    if (inPropGroup) {
      // Handle multi-line string values (continuation)
      if (inMultiLineValue) {
        // Check if this line starts with a quote (opening quote for value that was on previous line)
        const openQuoteMatch = trimmed.match(/^'([^']+)',?\s*$/);
        if (openQuoteMatch) {
          // Complete single-line value starting on next line
          accumulatedValue = openQuoteMatch[1];
          if (currentValueName && currentProp) {
            const classes = accumulatedValue
              .trim()
              .split(/\s+/)
              .filter((c) => c.length > 0);
            currentValues[currentValueName] = classes;
          }
          inMultiLineValue = false;
          currentValueName = null;
          accumulatedValue = '';
          continue;
        }

        // Look for closing quote (multi-line string continuation)
        const closeMatch = trimmed.match(/^([^']*)',?\s*$/);
        if (closeMatch) {
          accumulatedValue += ` ${closeMatch[1]}`;
          if (currentValueName && currentProp) {
            const classes = accumulatedValue
              .trim()
              .split(/\s+/)
              .filter((c) => c.length > 0);
            currentValues[currentValueName] = classes;
          }
          inMultiLineValue = false;
          currentValueName = null;
          accumulatedValue = '';
        } else {
          // Still accumulating multi-line value
          accumulatedValue += ` ${trimmed}`;
        }
        continue;
      }

      // Try single-line value match first
      const singleLineMatch = trimmed.match(/^(\w+):\s*'([^']*)',?$/);
      if (singleLineMatch && currentProp) {
        const value = singleLineMatch[1];
        const classString = singleLineMatch[2];
        const classes =
          classString.length > 0 ? classString.split(/\s+/).filter((c) => c.length > 0) : [];
        currentValues[value] = classes;
        continue;
      }

      // Try multi-line value start: "valueName: 'classes..."
      const multiLineStartMatch = trimmed.match(/^(\w+):\s*'([^']*)$/);
      if (multiLineStartMatch && currentProp) {
        currentValueName = multiLineStartMatch[1];
        accumulatedValue = multiLineStartMatch[2];
        inMultiLineValue = true;
        continue;
      }

      // Try value name without opening quote on same line: "valueName:"
      const valueNameOnlyMatch = trimmed.match(/^(\w+):\s*$/);
      if (valueNameOnlyMatch && currentProp) {
        currentValueName = valueNameOnlyMatch[1];
        accumulatedValue = '';
        inMultiLineValue = true;
        continue;
      }

      // Track brace depth
      const closingBraces = (trimmed.match(/\}/g) || []).length;
      braceDepth -= closingBraces;

      // End of prop group
      if (braceDepth === 0) {
        if (currentProp) {
          mappings.push({
            propName: currentProp,
            values: currentValues,
          });
        }
        currentProp = null;
        currentValues = {};
        inPropGroup = false;
        inMultiLineValue = false;
        currentValueName = null;
        accumulatedValue = '';
      }
    }
  }

  // Handle last prop if file ends
  if (currentProp) {
    mappings.push({
      propName: currentProp,
      values: currentValues,
    });
  }

  return mappings;
}

/**
 * Process a single component file
 */
export async function processComponent(path: string): Promise<PreviewIntelligence> {
  let source: string;
  try {
    source = await readFile(path, 'utf-8');
  } catch (_error) {
    throw new Error(`Failed to read component: ${path}`);
  }

  // Extract component name from file path
  const fileName = path.split('/').pop() || '';
  const component = fileName.replace(/\.tsx?$/, '').toLowerCase();

  // Extract base classes and prop mappings
  const baseClasses = await extractBaseClasses(source);
  const propMappings = await extractClassMappings(source);

  // Collect all classes (base + mapped)
  const allClasses = new Set<string>(baseClasses);
  for (const mapping of propMappings) {
    for (const classes of Object.values(mapping.values)) {
      for (const className of classes) {
        allClasses.add(className);
      }
    }
  }

  const intelligence: PreviewIntelligence = {
    component,
    baseClasses,
    propMappings,
    allClasses: Array.from(allClasses),
  };

  // Validate with Zod schema
  PreviewIntelligenceSchema.parse(intelligence);

  // Log warning if no cva() patterns found
  if (baseClasses.length === 0 && propMappings.length === 0) {
    console.warn(`No class mappings found for ${component}`);
  }

  return intelligence;
}

/**
 * Main entry point - process Button and Input components
 */
export async function main(): Promise<void> {
  const components = [
    join(__dirname, '../src/components/Button.tsx'),
    join(__dirname, '../src/components/Input.tsx'),
  ];

  // Ensure output directory exists
  const outputDir = join(__dirname, '../../../apps/website/public/registry/previews');
  try {
    await mkdir(outputDir, { recursive: true });
  } catch (_error) {
    throw new Error('Preview registry directory not found');
  }

  const results: PreviewIntelligence[] = [];

  for (const componentPath of components) {
    try {
      const intelligence = await processComponent(componentPath);
      results.push(intelligence);
      console.log(`Extracted intelligence for ${intelligence.component}`);

      // Write output
      const outputPath = join(outputDir, `${intelligence.component}.json`);
      await writeFile(outputPath, JSON.stringify(intelligence, null, 2));
      console.log(`Wrote intelligence to ${outputPath}`);
    } catch (error) {
      console.error(`Failed to process ${componentPath}:`, error);
      // Continue processing remaining components
    }
  }

  console.log(`\nProcessed ${results.length} components`);
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
