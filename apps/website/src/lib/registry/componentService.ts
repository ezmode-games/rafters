/**
 * Component Service - Astro Edition
 *
 * Manages loading and processing of components for the registry API.
 * Uses shared Zod schemas for type safety and validation.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  type ComponentManifest,
  ComponentManifestSchema,
  type CVAIntelligence,
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
import { parse, type Spec } from 'comment-parser';
import { extractBaseClasses, extractClassMappings } from './cvaExtractor';

// Cache for components to avoid re-parsing
let componentsCache: ComponentManifest[] | null = null;

/**
 * Parse JSDoc comments from component source code using comment-parser
 */
function parseJSDocFromSource(content: string, filename: string): ComponentManifest | null {
  try {
    // Parse JSDoc comment using comment-parser
    const parsed = parse(content);
    if (!parsed || parsed.length === 0) {
      return null;
    }

    const comment = parsed[0];

    // Extract registry metadata (camelCase tags)
    const registryName = findTagValue(comment.tags, 'registryName');
    const registryVersion = findTagValue(comment.tags, 'registryVersion') || '0.1.0';
    const registryPath = findTagValue(comment.tags, 'registryPath');
    const registryType = findTagValue(comment.tags, 'registryType') || 'registry:component';

    if (!registryName) {
      return null;
    }

    // Extract intelligence metadata (prioritize camelCase, fallback to kebab-case)
    const cognitiveLoadRaw =
      findTagValue(comment.tags, 'cognitiveLoad') || findTagValue(comment.tags, 'cognitive-load');
    const cognitiveLoad = parseCognitiveLoad(cognitiveLoadRaw);

    const attentionEconomics =
      findTagValue(comment.tags, 'attentionEconomics') ||
      findTagValue(comment.tags, 'attention-economics') ||
      '';
    const accessibility = findTagValue(comment.tags, 'accessibility') || '';
    const trustBuilding =
      findTagValue(comment.tags, 'trustBuilding') ||
      findTagValue(comment.tags, 'trust-building') ||
      '';
    const semanticMeaning =
      findTagValue(comment.tags, 'semanticMeaning') ||
      findTagValue(comment.tags, 'semantic-meaning') ||
      '';

    // Extract CVA class mappings if component uses class-variance-authority
    let cva: CVAIntelligence | undefined;
    if (
      content.includes("from 'class-variance-authority'") ||
      content.includes('from "class-variance-authority"')
    ) {
      const baseClasses = extractBaseClasses(content);
      const propMappings = extractClassMappings(content);

      if (baseClasses.length > 0 || propMappings.length > 0) {
        const allClasses = new Set<string>(baseClasses);
        for (const mapping of propMappings) {
          for (const classes of Object.values(mapping.values)) {
            for (const className of classes) {
              allClasses.add(className);
            }
          }
        }

        cva = {
          baseClasses,
          propMappings,
          allClasses: Array.from(allClasses),
        };
      }
    }

    const intelligence: Intelligence = IntelligenceSchema.parse({
      cognitiveLoad,
      attentionEconomics,
      accessibility,
      trustBuilding,
      semanticMeaning,
      cva,
    });

    // Extract usage patterns (camelCase or kebab-case)
    const usagePatternsTag = comment.tags.find(
      (tag) => tag.tag === 'usagePatterns' || tag.tag === 'usage-patterns'
    );
    const usagePatterns: UsagePatterns = parseUsagePatterns(usagePatternsTag?.description || '');

    // Extract design guides (camelCase or kebab-case)
    const designGuidesTag = comment.tags.find(
      (tag) => tag.tag === 'designGuides' || tag.tag === 'design-guides'
    );
    const designGuides: DesignGuide[] = parseDesignGuides(designGuidesTag?.description || '');

    // Extract dependencies (separate local: files from npm packages)
    const dependenciesRaw = findTagValue(comment.tags, 'dependencies') || '';
    const allDeps = dependenciesRaw
      .split(',')
      .map((dep) => dep.trim())
      .filter((dep) => dep.length > 0 && dep !== '@rafters/design-tokens/motion');

    // Separate local files from npm dependencies
    const localFiles: string[] = [];
    const dependencies: string[] = [];

    for (const dep of allDeps) {
      if (dep.startsWith('local:')) {
        localFiles.push(dep.substring(6)); // Remove 'local:' prefix
      } else {
        dependencies.push(dep);
      }
    }

    // Extract examples
    const exampleTags = comment.tags.filter((tag) => tag.tag === 'example');
    const examples: Example[] = [];
    for (const tag of exampleTags) {
      const codeMatch = tag.description.match(
        /```(?:tsx?|typescript|javascript)?\s*\n([\s\S]*?)```/
      );
      const code = codeMatch ? codeMatch[1].trim() : tag.description.trim();
      if (code) {
        examples.push(ExampleSchema.parse({ code }));
      }
    }

    // Generate docs URL
    const docs = `https://rafters.realhandy.tech/docs/components/${registryName}`;

    // Build files array - include local dependencies
    const files = [
      {
        path: registryPath || `components/ui/${filename}`,
        content,
        type: registryType as 'registry:component',
      },
    ];

    // Add local dependency files from UI package primitives
    const primitivesBaseDir = join(process.cwd(), '../../packages/ui/src');
    for (const localFile of localFiles) {
      try {
        const localFilePath = join(primitivesBaseDir, localFile);
        const localContent = readFileSync(localFilePath, 'utf-8');
        files.push({
          path: localFile,
          content: localContent,
          type: 'registry:primitive' as const,
        });
      } catch (error) {
        console.warn(`Could not load local dependency: ${localFile}`, error);
      }
    }

    // Build component manifest using Zod schema
    const componentManifest: ComponentManifest = ComponentManifestSchema.parse({
      $schema: 'https://ui.shadcn.com/schema/registry-item.json',
      name: registryName,
      type: registryType as 'registry:component',
      description: '',
      dependencies,
      files,
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
  } catch (error) {
    console.error('Error parsing component:', filename, error);
    return null;
  }
}

/**
 * Find a tag value from comment-parser tags
 */
function findTagValue(tags: Spec[], tagName: string): string | null {
  const tag = tags.find((t) => t.tag === tagName);
  if (!tag) return null;

  // For simple tags like @registryName container, the value is in 'name' field
  // For complex tags with descriptions, the value is in 'description' field
  const value = tag.name?.trim() || tag.description?.trim() || '';
  return value || null;
}

/**
 * Parse cognitive load from various formats
 */
function parseCognitiveLoad(value: string | null): number {
  if (!value) return 0;
  const match = value.match(/^(\d+)(?:\/\d+)?/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

/**
 * Parse usage patterns from multiline content
 * Handles content flattened by comment-parser (without newlines)
 */
function parseUsagePatterns(content: string): UsagePatterns {
  const dos: string[] = [];
  const nevers: string[] = [];

  // Split by 'DO:' and 'NEVER:' patterns since comment-parser flattens multiline content
  const parts = content.split(/\s+(?=(?:DO:|NEVER:))/);

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith('DO:')) {
      dos.push(trimmed.substring(3).trim());
    } else if (trimmed.startsWith('NEVER:')) {
      nevers.push(trimmed.substring(6).trim());
    }
  }

  return UsagePatternsSchema.parse({ dos, nevers });
}

/**
 * Parse design guides from multiline content
 */
function parseDesignGuides(content: string): DesignGuide[] {
  const guides: DesignGuide[] = [];

  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('-')) {
      const match = trimmed.match(/-\s*(.+?):\s*(.+)/);
      if (match) {
        try {
          guides.push(
            DesignGuideSchema.parse({
              name: match[1].trim(),
              url: match[2].trim(),
            })
          );
        } catch (_error) {
          console.warn('Failed to parse design guide:', trimmed);
        }
      }
    }
  }

  return guides;
}

/**
 * Load primitives from UI package
 */
function loadPrimitives(): ComponentManifest[] {
  const primitivesBaseDir = join(process.cwd(), '../../packages/ui/src/primitives');
  const primitives: ComponentManifest[] = [];

  try {
    const primitiveTypes = readdirSync(primitivesBaseDir);

    for (const primitiveType of primitiveTypes) {
      const primitiveDir = join(primitivesBaseDir, primitiveType);

      // Skip if not a directory (e.g., index.ts file)
      try {
        if (!statSync(primitiveDir).isDirectory()) {
          continue;
        }
      } catch {
        continue;
      }

      const files = readdirSync(primitiveDir);

      for (const file of files) {
        if (file.endsWith('.ts') && !file.endsWith('.test.ts') && !file.endsWith('.spec.ts')) {
          const filePath = join(primitiveDir, file);
          const content = readFileSync(filePath, 'utf-8');

          const primitiveData = parseJSDocFromSource(content, file);
          if (primitiveData) {
            primitives.push(primitiveData);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error loading primitives:', error);
  }

  return primitives;
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

  // Load primitives and add to components
  const primitives = loadPrimitives();
  components.push(...primitives);

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
  const _avgCognitiveLoad = components.length > 0 ? totalCognitiveLoad / components.length : 0;

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
