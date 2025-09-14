/**
 * Registry Component Fetcher - Issue #130
 *
 * Fetches component data from the Rafters registry API with intelligent caching
 * and error handling for build-time usage.
 */

import { z } from 'zod';
import type { FetchResult, RegistryComponent, RegistryError } from './types';

// Inline schemas to avoid dependency issues with @rafters/shared
const ComponentFileSchema = z.object({
  path: z.string(),
  content: z.string(),
  type: z.string(),
  target: z.string().optional(),
});

const ComponentIntelligenceSchema = z.object({
  cognitiveLoad: z.number().min(0).max(10),
  attentionEconomics: z.string(),
  accessibility: z.string(),
  trustBuilding: z.string(),
  semanticMeaning: z.string(),
  usagePatterns: z
    .object({
      dos: z.array(z.string()),
      nevers: z.array(z.string()),
    })
    .optional(),
  designGuides: z
    .array(
      z.object({
        name: z.string(),
        url: z.string(),
      })
    )
    .optional(),
  examples: z
    .array(
      z.object({
        code: z.string(),
      })
    )
    .optional(),
});

const ComponentManifestSchema = z.object({
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
  dependencies: z.array(z.string()).optional().default([]),
  files: z.array(ComponentFileSchema),
  meta: z
    .object({
      rafters: z
        .object({
          version: z.string(),
          intelligence: ComponentIntelligenceSchema.optional(),
          usagePatterns: z
            .object({
              dos: z.array(z.string()),
              nevers: z.array(z.string()),
            })
            .optional(),
          designGuides: z
            .array(
              z.object({
                name: z.string(),
                url: z.string(),
              })
            )
            .optional(),
          examples: z
            .array(
              z.object({
                code: z.string(),
              })
            )
            .optional(),
        })
        .optional(),
    })
    .optional(),
});

// Required fields validation
const REQUIRED_FIELDS = ['name', 'type', 'files'] as const;

const REQUIRED_FILE_FIELDS = ['path', 'content', 'type'] as const;

/**
 * Registry Component Fetcher with caching and error handling
 */
export class RegistryComponentFetcher {
  private cache: Map<string, RegistryComponent> = new Map();
  private baseUrl: string;

  constructor(baseUrl = 'https://rafters.realhandy.tech') {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch a single component from the registry with caching
   */
  async fetchComponent(componentName: string): Promise<FetchResult> {
    const startTime = Date.now();

    // 1. Check cache first
    if (this.cache.has(componentName)) {
      const component = this.cache.get(componentName)!;
      return {
        component,
        fromCache: true,
        fetchTime: Date.now() - startTime,
        registryUrl: `${this.baseUrl}/registry/components/${componentName}`,
      };
    }

    // 2. Fetch from registry API if not cached
    const component = await this.fetchFromRegistry(componentName);

    // 3. Validate response structure
    const validatedComponent = this.validateRegistryResponse(component, componentName);

    // 4. Store in cache
    this.cache.set(componentName, validatedComponent);

    // 5. Return component data with metadata
    return {
      component: validatedComponent,
      fromCache: false,
      fetchTime: Date.now() - startTime,
      registryUrl: `${this.baseUrl}/registry/components/${componentName}`,
    };
  }

  /**
   * Fetch multiple components in parallel with error isolation
   */
  async fetchMultipleComponents(componentNames: string[]): Promise<Map<string, FetchResult>> {
    const results = new Map<string, FetchResult>();

    // Use Promise.allSettled to handle individual failures gracefully
    const promises = componentNames.map(async (name) => {
      try {
        const result = await this.fetchComponent(name);
        return { name, result, error: null };
      } catch (error) {
        return { name, result: null, error: error as Error };
      }
    });

    const settled = await Promise.allSettled(promises);

    for (const outcome of settled) {
      if (outcome.status === 'fulfilled' && outcome.value.result) {
        results.set(outcome.value.name, outcome.value.result);
      }
      // Log errors but don't throw - allow partial success
      if (outcome.status === 'fulfilled' && outcome.value.error) {
        console.warn(
          `Failed to fetch component '${outcome.value.name}':`,
          outcome.value.error.message
        );
      }
      if (outcome.status === 'rejected') {
        console.warn('Unexpected error in fetchMultipleComponents:', outcome.reason);
      }
    }

    return results;
  }

  /**
   * HTTP fetch with proper error handling
   */
  private async fetchFromRegistry(componentName: string): Promise<any> {
    const url = `${this.baseUrl}/registry/components/${encodeURIComponent(componentName)}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'rafters-swc/1.0.0',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`) as RegistryError;
        error.name = 'RegistryError';
        error.componentName = componentName;
        error.statusCode = response.status;
        error.registryUrl = url;
        throw error;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          const timeoutError = new Error(`Registry request timeout after 10000ms`) as RegistryError;
          timeoutError.name = 'RegistryError';
          timeoutError.componentName = componentName;
          timeoutError.registryUrl = url;
          throw timeoutError;
        }
        if (error.name === 'RegistryError') {
          throw error; // Already properly formatted
        }
        const networkError = new Error(
          `Failed to fetch from registry: ${error.message}`
        ) as RegistryError;
        networkError.name = 'RegistryError';
        networkError.componentName = componentName;
        networkError.registryUrl = url;
        throw networkError;
      }
      throw error;
    }
  }

  /**
   * Validate response structure and required fields
   */
  private validateRegistryResponse(data: unknown, componentName: string): RegistryComponent {
    try {
      // First try to parse with inline schema for validation
      const parsed = ComponentManifestSchema.parse(data);

      // Additional validation for required fields
      for (const field of REQUIRED_FIELDS) {
        if (!(field in parsed) || parsed[field as keyof typeof parsed] === undefined) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Validate files array structure
      if (!Array.isArray(parsed.files) || parsed.files.length === 0) {
        throw new Error('Component must have at least one file');
      }

      for (const [index, file] of parsed.files.entries()) {
        for (const field of REQUIRED_FILE_FIELDS) {
          if (!(field in file) || file[field as keyof typeof file] === undefined) {
            throw new Error(`Missing required file field '${field}' in file ${index}`);
          }
        }
      }

      // Ensure at least one file with content
      const hasContent = parsed.files.some(
        (file) => file.content && file.content.trim().length > 0
      );
      if (!hasContent) {
        throw new Error('Component must have at least one file with non-empty content');
      }

      // Transform to our expected interface
      const registryComponent: RegistryComponent = {
        name: parsed.name,
        type: parsed.type,
        description: parsed.description || '',
        dependencies: parsed.dependencies || [],
        files: parsed.files.map((file) => ({
          path: file.path,
          content: file.content,
          type: file.type,
        })),
        meta: parsed.meta?.rafters
          ? {
              rafters: {
                version: parsed.meta.rafters.version,
                intelligence: parsed.meta.rafters.intelligence,
                usagePatterns: parsed.meta.rafters.usagePatterns,
                designGuides: parsed.meta.rafters.designGuides,
                examples: parsed.meta.rafters.examples,
              },
            }
          : undefined,
      };

      return registryComponent;
    } catch (error) {
      const validationError = new Error(
        `Registry response validation failed for component '${componentName}': ${
          error instanceof Error ? error.message : 'Unknown validation error'
        }`
      ) as RegistryError;
      validationError.name = 'RegistryError';
      validationError.componentName = componentName;
      validationError.registryUrl = `${this.baseUrl}/registry/components/${componentName}`;
      throw validationError;
    }
  }

  /**
   * Clear specific component or entire cache
   */
  clearCache(componentName?: string): void {
    if (componentName) {
      this.cache.delete(componentName);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Return cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}
