import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.resolve(__dirname, '../../../packages/ui/src/components');
const manifestPath = path.resolve(__dirname, '../registry-manifest.json');

// Rafters intelligence schema
const IntelligenceSchema = z.object({
  cognitiveLoad: z.number().min(0).max(10),
  attentionEconomics: z.string(),
  accessibility: z.string(),
  trustBuilding: z.string(),
  semanticMeaning: z.string(),
});

const UsagePatternsSchema = z.object({
  dos: z.array(z.string()),
  nevers: z.array(z.string()),
});

const DesignGuideSchema = z.object({
  name: z.string(),
  url: z.string(),
});

const ExampleSchema = z.object({
  title: z.string().optional(),
  code: z.string(),
  description: z.string().optional(),
});

// Expanded component schema with meta.rafters
const ComponentSchema = z.object({
  name: z.string(),
  path: z.string(),
  type: z.string(),
  description: z.string().optional(),
  content: z.string(),
  dependencies: z.array(z.string()),
  docs: z.string().optional(),
  meta: z
    .object({
      rafters: z.object({
        version: z.string(),
        intelligence: IntelligenceSchema,
        usagePatterns: UsagePatternsSchema,
        designGuides: z.array(DesignGuideSchema),
        examples: z.array(ExampleSchema),
      }),
    })
    .optional(),
});

const ManifestSchema = z.object({
  components: z.array(ComponentSchema),
  total: z.number(),
  lastUpdated: z.string(),
});

/**
 * Parse JSDoc comment from component file
 */
function parseJSDocComment(content: string) {
  // Extract the main JSDoc comment at the top of the file
  const jsdocMatch = content.match(/\/\*\*([\s\S]*?)\*\//);
  if (!jsdocMatch) {
    throw new Error('No JSDoc comment found');
  }

  const jsdocContent = jsdocMatch[1];

  // Parse the description (first line before any @tags)
  const descriptionMatch = jsdocContent.match(/^\s*\*\s*(.+?)(?=\s*\*\s*@|\s*\*\/|$)/);
  const description = descriptionMatch ? descriptionMatch[1].trim() : '';

  // Helper to extract tag values
  const getTag = (tag: string): string | null => {
    const match = jsdocContent.match(
      new RegExp(`@${tag}\\s+(.+?)(?=\\s*\\*\\s*@|\\s*\\*\\/|\\s*\\*\\s*$)`, 's')
    );
    return match ? match[1].trim().replace(/\s*\*\s*/g, ' ') : null;
  };

  // Helper to extract numeric tag values
  const getNumericTag = (tag: string): number | null => {
    const value = getTag(tag);
    if (!value) return null;
    const match = value.match(/(\d+(?:\.\d+)?)/);
    return match ? Number.parseFloat(match[1]) : null;
  };

  // Parse usage patterns (multiline)
  const parseUsagePatterns = () => {
    const usagePatternsMatch = jsdocContent.match(
      /@usage-patterns\s+([\s\S]*?)(?=\s*\*\s*@|\s*\*\/|$)/
    );
    if (!usagePatternsMatch) return { dos: [], nevers: [] };

    const content = usagePatternsMatch[1].replace(/\s*\*\s*/g, '\n');
    const dos = [...content.matchAll(/DO:\s*(.+)/g)].map((m) => m[1].trim());
    const nevers = [...content.matchAll(/NEVER:\s*(.+)/g)].map((m) => m[1].trim());

    return { dos, nevers };
  };

  // Parse design guides
  const parseDesignGuides = () => {
    const guidesMatch = jsdocContent.match(/@design-guides\s+([\s\S]*?)(?=\s*\*\s*@|\s*\*\/|$)/);
    if (!guidesMatch) return [];

    const content = guidesMatch[1].replace(/\s*\*\s*/g, '\n');
    const guides = [...content.matchAll(/-\s*(.+?):\s*(https?:\/\/[^\s]+)/g)].map((m) => ({
      name: m[1].trim(),
      url: m[2].trim(),
    }));

    return guides;
  };

  // Parse examples from @example blocks
  const parseExamples = () => {
    const exampleMatch = jsdocContent.match(/@example\s+([\s\S]*?)(?=\s*\*\s*@|\s*\*\/|$)/);
    if (!exampleMatch) return [];

    const content = exampleMatch[1].replace(/\s*\*\s*/g, '\n').trim();

    // Extract code blocks and comments
    const examples = [];
    const codeBlockRegex = /```(\w+)?\s*([\s\S]*?)```/g;

    for (const match of content.matchAll(codeBlockRegex)) {
      const code = match[2].trim();
      // Look for comment before the code block as title/description
      const beforeCode = content.substring(0, match.index).trim();
      const lines = beforeCode.split('\n');
      const lastLine = lines[lines.length - 1]?.trim();
      const title = lastLine?.startsWith('//') ? lastLine.replace('//', '').trim() : undefined;

      examples.push({
        title,
        code,
      });
    }

    return examples;
  };

  return {
    description,
    registryName: getTag('registry-name'),
    registryVersion: getTag('registry-version') || '0.1.0',
    registryStatus:
      (getTag('registry-status') as 'published' | 'draft' | 'depreciated') || 'published',
    registryPath: getTag('registry-path'),
    registryType: getTag('registry-type') || 'registry:component',
    cognitiveLoad: getNumericTag('cognitive-load') || 0,
    attentionEconomics: getTag('attention-economics') || '',
    accessibility: getTag('accessibility') || '',
    trustBuilding: getTag('trust-building') || '',
    semanticMeaning: getTag('semantic-meaning') || '',
    dependencies:
      getTag('dependencies')
        ?.split(',')
        .map((s) => s.trim())
        .filter(Boolean) || [],
    usagePatterns: parseUsagePatterns(),
    designGuides: parseDesignGuides(),
    examples: parseExamples(),
  };
}

function extractDependencies(content: string): string[] {
  const dependencies = new Set<string>();

  // Match import statements for external packages
  const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
  const matches = content.match(importRegex) || [];

  for (const matchStr of matches) {
    // Extract the import path from the match string
    const pathMatch = matchStr.match(/from\s+['"]([^'"]+)['"]/);
    if (!pathMatch) continue;

    const importPath = pathMatch[1];

    // Only include external dependencies (not relative imports)
    if (!importPath.startsWith('.') && !importPath.startsWith('@/')) {
      // Extract package name from scoped packages like @radix-ui/react-progress
      const packageName = importPath.startsWith('@')
        ? importPath.split('/').slice(0, 2).join('/')
        : importPath.split('/')[0];

      dependencies.add(packageName);
    }
  }

  // Remove common dependencies that are usually already installed
  const commonDeps = new Set([
    'react',
    'react-dom',
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
  ]);
  return Array.from(dependencies).filter((dep) => !commonDeps.has(dep));
}

/**
 * Process a single component file and extract all metadata
 */
function processComponent(fileName: string) {
  const filePath = path.join(componentsDir, fileName);
  const content = fs.readFileSync(filePath, 'utf8');

  try {
    const jsdoc = parseJSDocComment(content);
    const autoDeps = extractDependencies(content);

    // Combine JSDoc deps with auto-extracted deps
    const allDeps = [...new Set([...jsdoc.dependencies, ...autoDeps])];

    // Generate docs URL (could point to storybook or main docs)
    const componentName = fileName.replace('.tsx', '');
    const docsUrl = `https://rafters.realhandy.tech/storybook/?path=/docs/03-components-${componentName.toLowerCase()}--overview`;

    const component = {
      name: jsdoc.registryName || componentName.toLowerCase(),
      path: jsdoc.registryPath || `components/ui/${fileName}`,
      type: jsdoc.registryType,
      description: jsdoc.description,
      content,
      dependencies: allDeps,
      docs: docsUrl,
      meta: {
        rafters: {
          version: jsdoc.registryVersion,
          intelligence: {
            cognitiveLoad: jsdoc.cognitiveLoad,
            attentionEconomics: jsdoc.attentionEconomics,
            accessibility: jsdoc.accessibility,
            trustBuilding: jsdoc.trustBuilding,
            semanticMeaning: jsdoc.semanticMeaning,
          },
          usagePatterns: jsdoc.usagePatterns,
          designGuides: jsdoc.designGuides,
          examples: jsdoc.examples,
        },
      },
    };

    return { component, status: jsdoc.registryStatus };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`Warning: Could not parse JSDoc for ${fileName}: ${message}`);
    return null;
  }
}

// Process all component files
const componentFiles = fs
  .readdirSync(componentsDir)
  .filter((file) => file.endsWith('.tsx'))
  .filter((file) => file !== 'RaftersLogo.tsx'); // Skip logo as requested

const processedComponents = componentFiles
  .map(processComponent)
  .filter((result): result is NonNullable<typeof result> => result !== null);

// Only include published components
const publishedComponents = processedComponents
  .filter((result) => result.status === 'published')
  .map((result) => result.component);

// Generate final manifest
const manifest = {
  components: publishedComponents,
  total: publishedComponents.length,
  lastUpdated: new Date().toISOString(),
};

// Validate the manifest against our schema
try {
  const validatedManifest = ManifestSchema.parse(manifest);
  fs.writeFileSync(manifestPath, `${JSON.stringify(validatedManifest, null, 2)}\n`);
  console.log(`✅ Registry manifest generated: ${manifestPath}`);
  console.log(`   📦 ${validatedManifest.total} published components`);
  console.log('   🧠 All with embedded AI intelligence metadata');
} catch (error) {
  console.error('❌ Validation failed:', error);
  process.exit(1);
}
