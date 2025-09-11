/**
 * Component Service - Astro Edition
 *
 * Manages loading and processing of components for the registry API.
 * Uses shared Zod schemas for type safety and validation.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  type ComponentManifest,
  ComponentManifestSchema,
  type DesignGuide,
  DesignGuideSchema,
  type Example,
  ExampleSchema,
  type Intelligence,
  IntelligenceSchema,
  type RegistryResponse,
  RegistryResponseSchema,
  type UsagePatterns,
  UsagePatternsSchema,
} from '@rafters/shared';

// Cache for components to avoid re-parsing
let componentsCache: ComponentManifest[] | null = null;

/**
 * Parse JSDoc comments from component source code
 */
function parseJSDocFromSource(content: string, filename: string): ComponentManifest | null {
  // Extract JSDoc comment block
  const jsdocMatch = content.match(/\/\*\*\s*\n([\s\S]*?)\*\//);
  if (!jsdocMatch) {
    return null;
  }

  const jsdocContent = jsdocMatch[1];

  // Extract registry metadata
  const registryName = extractJSDocTag(jsdocContent, 'registry-name');
  const registryVersion = extractJSDocTag(jsdocContent, 'registry-version') || '0.1.0';
  const registryPath = extractJSDocTag(jsdocContent, 'registry-path');
  const registryType = extractJSDocTag(jsdocContent, 'registry-type') || 'registry:component';

  if (!registryName) {
    return null;
  }

  // Extract intelligence metadata using Zod schema
  const intelligence: Intelligence = IntelligenceSchema.parse({
    cognitiveLoad: Number.parseFloat(
      extractJSDocTag(jsdocContent, 'cognitive-load')?.split('/')[0] || '0'
    ),
    attentionEconomics: extractJSDocTag(jsdocContent, 'attention-economics') || '',
    accessibility: extractJSDocTag(jsdocContent, 'accessibility') || '',
    trustBuilding: extractJSDocTag(jsdocContent, 'trust-building') || '',
    semanticMeaning: extractJSDocTag(jsdocContent, 'semantic-meaning') || '',
  });

  // Extract usage patterns using Zod schema - handle multiline content
  const dos: string[] = [];
  const nevers: string[] = [];

  // Find the full usage-patterns block (multiline)
  const usagePatternsMatch = jsdocContent.match(
    /@usage-patterns\s*\n([\s\S]*?)(?=@[a-z-]+|\*\/|$)/
  );
  if (usagePatternsMatch) {
    const usagePatternsRaw = usagePatternsMatch[1];
    const lines = usagePatternsRaw.split('\n');
    for (const line of lines) {
      const trimmed = line.trim().replace(/^\*\s*/, ''); // Remove leading asterisk and spaces
      if (trimmed.startsWith('DO:')) {
        dos.push(trimmed.substring(3).trim());
      } else if (trimmed.startsWith('NEVER:')) {
        nevers.push(trimmed.substring(6).trim());
      }
    }
  }

  const usagePatterns: UsagePatterns = UsagePatternsSchema.parse({
    dos,
    nevers,
  });

  // Extract design guides using Zod schema
  const designGuidesRaw = extractJSDocTag(jsdocContent, 'design-guides') || '';
  const designGuides: DesignGuide[] = [];

  if (designGuidesRaw) {
    const lines = designGuidesRaw.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('-')) {
        const match = trimmed.match(/-\s*(.+?):\s*(.+)/);
        if (match) {
          designGuides.push(
            DesignGuideSchema.parse({
              name: match[1].trim(),
              url: match[2].trim(),
            })
          );
        }
      }
    }
  }

  // Extract dependencies (filter out invalid ones)
  const dependenciesRaw = extractJSDocTag(jsdocContent, 'dependencies') || '';
  const dependencies = dependenciesRaw
    .split(',')
    .map((dep) => dep.trim())
    .filter((dep) => dep.length > 0 && dep !== '@rafters/design-tokens/motion'); // Filter out invalid dependencies

  // Extract examples using Zod schema
  const exampleMatch = jsdocContent.match(/@example\s*\n\s*```tsx?\s*\n([\s\S]*?)```/);
  const examples: Example[] = [];
  if (exampleMatch) {
    examples.push(
      ExampleSchema.parse({
        code: exampleMatch[1].trim(),
      })
    );
  }

  // Generate docs URL
  const docs = `https://rafters.realhandy.tech/docs/components/${registryName}`;

  // Build component manifest using Zod schema
  const componentManifest: ComponentManifest = ComponentManifestSchema.parse({
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: registryName,
    type: registryType as 'registry:component',
    description: '',
    dependencies,
    files: [
      {
        path: registryPath || `components/ui/${filename}`,
        content,
        type: 'registry:component',
      },
    ],
    docs,
    meta: {
      rafters: {
        version: registryVersion,
        intelligence,
        usagePatterns,
        designGuides,
        examples,
      },
    },
  });

  return componentManifest;
}

/**
 * Extract a specific JSDoc tag value
 */
function extractJSDocTag(jsdocContent: string, tagName: string): string | null {
  const regex = new RegExp(`@${tagName}\\s+(.+)`, 'i');
  const match = jsdocContent.match(regex);
  return match ? match[1].trim() : null;
}

/**
 * Load and parse all components from the UI package
 */
function loadComponents(): ComponentManifest[] {
  if (componentsCache) {
    return componentsCache;
  }

  const componentsDir = join(process.cwd(), '../../packages/ui/src/components');
  const components: ComponentManifest[] = [];

  try {
    const files = readdirSync(componentsDir);

    for (const file of files) {
      if (file.endsWith('.tsx')) {
        const filePath = join(componentsDir, file);
        const content = readFileSync(filePath, 'utf-8');

        const componentData = parseJSDocFromSource(content, file);
        if (componentData) {
          components.push(componentData);
        }
      }
    }
  } catch (error) {
    console.error('Error loading components:', error);
  }

  componentsCache = components;
  return components;
}

/**
 * Get all components for the registry
 */
export function getAllComponents(): ComponentManifest[] {
  return loadComponents();
}

/**
 * Get a specific component by name
 */
export function getComponent(name: string): ComponentManifest | null {
  const components = loadComponents();
  return components.find((comp) => comp.name.toLowerCase() === name.toLowerCase()) || null;
}

/**
 * Get the registry manifest (components list endpoint)
 */
export function getRegistryManifest(): RegistryResponse {
  const components = loadComponents();

  return RegistryResponseSchema.parse({
    $schema: 'https://rafters.dev/schemas/registry.json',
    name: 'Rafters AI Design Intelligence Registry',
    homepage: 'https://rafters.realhandy.tech',
    components,
  });
}

/**
 * Get registry metadata for the root registry endpoint
 */
export function getRegistryMetadata(): RegistryResponse {
  const components = loadComponents();

  // Calculate intelligence averages
  const totalCognitiveLoad = components.reduce((sum, comp) => {
    return sum + (comp.meta?.rafters?.intelligence?.cognitiveLoad || 0);
  }, 0);
  const avgCognitiveLoad = components.length > 0 ? totalCognitiveLoad / components.length : 0;

  return RegistryResponseSchema.parse({
    $schema: 'https://rafters.dev/schemas/registry.json',
    name: 'Rafters AI Design Intelligence Registry',
    homepage: 'https://rafters.realhandy.tech',
    components: components.map((comp) => ({
      ...comp,
      // Add computed metadata for the registry root
      description: comp.description || `${comp.name} component with embedded design intelligence`,
    })),
    // Note: Adding intelligence stats here, but they're not in the Zod schema
    // We may need to extend the schema in shared if we want this data validated
  });
}

// Re-export types from shared for convenience
export type {
  ComponentManifest,
  Intelligence,
  UsagePatterns,
  DesignGuide,
  Example,
  RegistryResponse,
};
