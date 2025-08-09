/**
 * Registry API client for fetching components from rafters.realhandy.tech
 */

import { z } from 'zod';

// Shadcn-compatible registry schemas with AI intelligence
export const IntelligenceSchema = z.object({
  cognitiveLoad: z.number().min(1).max(10),
  attentionEconomics: z.string(),
  accessibility: z.string(),
  trustBuilding: z.string(),
  semanticMeaning: z.string(),
});

// Shadcn registry file schema
const RegistryFileSchema = z.object({
  path: z.string(),
  content: z.string(),
  type: z.string(),
  target: z.string().optional(),
});

// Main component manifest schema - matches shadcn registry-item.json
export const ComponentManifestSchema = z.object({
  $schema: z.string().optional(),
  name: z.string(),
  type: z.enum([
    'registry:component',
    'registry:lib',
    'registry:style',
    'registry:block',
    'registry:page',
    'registry:hook',
  ]),
  description: z.string().optional(),
  title: z.string().optional(),
  author: z.string().optional(),
  dependencies: z.array(z.string()).optional().default([]),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(RegistryFileSchema),
  tailwind: z.record(z.string(), z.unknown()).optional(),
  cssVars: z.record(z.string(), z.unknown()).optional(),
  css: z.array(z.string()).optional(),
  envVars: z.record(z.string(), z.string()).optional(),
  categories: z.array(z.string()).optional(),
  docs: z.string().optional(),
  // Our AI intelligence metadata in the meta field
  meta: z
    .object({
      rafters: z
        .object({
          intelligence: IntelligenceSchema,
          version: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

// Registry response schema - matches shadcn format
export const RegistrySchema = z.object({
  $schema: z.string().optional(),
  name: z.string().optional(),
  homepage: z.string().optional(),
  components: z.array(ComponentManifestSchema).optional(),
  items: z.array(ComponentManifestSchema).optional(),
});

export type Intelligence = z.infer<typeof IntelligenceSchema>;
export type ComponentManifest = z.infer<typeof ComponentManifestSchema>;
export type Registry = z.infer<typeof RegistrySchema>;

// Registry configuration
function getRegistryBaseUrl(): string {
  return process.env.RAFTERS_REGISTRY_URL || 'https://rafters-registry.realhandy.tech';
}
const REGISTRY_TIMEOUT = 10000; // 10 seconds

// HTTP client response schema
const RegistryResponseSchema = z.unknown();

// HTTP client with error handling
async function fetchFromRegistry(
  endpoint: string
): Promise<z.infer<typeof RegistryResponseSchema>> {
  const url = `${getRegistryBaseUrl()}${endpoint}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REGISTRY_TIMEOUT);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'rafters-cli/1.0.0',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Registry API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return RegistryResponseSchema.parse(data);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(`Registry request timeout after ${REGISTRY_TIMEOUT}ms`);
      }
      throw new Error(`Failed to fetch from registry: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Fetch complete component registry from the hosted API
 */
export async function fetchComponentRegistry(): Promise<Registry> {
  const data = await fetchFromRegistry('/components');

  // Transform the API response to match shadcn registry format
  if (data && typeof data === 'object' && 'components' in data) {
    return {
      $schema: 'https://ui.shadcn.com/schema/registry.json',
      name: 'Rafters AI Design Intelligence Registry',
      components: (data as { components: unknown[] }).components as ComponentManifest[],
    };
  }

  return RegistrySchema.parse(data);
}

/**
 * Fetch a specific component by name from the hosted API
 */
export async function fetchComponent(componentName: string): Promise<ComponentManifest | null> {
  try {
    const data = await fetchFromRegistry(`/components/${encodeURIComponent(componentName)}`);
    return ComponentManifestSchema.parse(data);
  } catch (error) {
    // Try searching the full registry if direct fetch fails
    try {
      const registry = await fetchComponentRegistry();
      return (
        registry.components?.find((c) => c.name.toLowerCase() === componentName.toLowerCase()) ||
        null
      );
    } catch (registryError) {
      throw new Error(
        `Component '${componentName}' not found: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
