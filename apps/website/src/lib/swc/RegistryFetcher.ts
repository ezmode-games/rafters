/**
 * Registry Component Fetcher - Issue #130
 *
 * Fetches component data from the Rafters registry API with intelligent caching
 * and error handling for build-time usage.
 */

import { z } from 'zod';
import type { FetchResult, RegistryComponent, RegistryError } from './types';

// Using inline schemas for now - shared package has build issues
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

type ComponentManifest = z.infer<typeof ComponentManifestSchema>;

// Branded type for component names to prevent type errors
type ComponentName = string & { readonly __brand: unique symbol };

export function validateComponentName(name: string): ComponentName {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new Error('Component name cannot be empty or null');
  }
  if (name.trim() !== name) {
    throw new Error('Component name cannot have leading or trailing whitespace');
  }
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(name)) {
    throw new Error('Component name must contain only lowercase letters, numbers, and hyphens');
  }
  return name as ComponentName;
}

// Required fields validation
const REQUIRED_FIELDS = ['name', 'type', 'files'] as const;

const REQUIRED_FILE_FIELDS = ['path', 'content', 'type'] as const;

// Cache entry interface with timestamp for TTL
interface CacheEntry {
  component: RegistryComponent;
  timestamp: number;
}

/**
 * Registry Component Fetcher with caching and error handling
 */
export class RegistryComponentFetcher {
  private cache: Map<string, CacheEntry> = new Map();
  private baseUrl: string;
  private readonly MAX_CACHE_SIZE = 100;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(baseUrl = 'https://rafters.realhandy.tech') {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch a single component from the registry with caching
   */
  async fetchComponent(componentName: string): Promise<FetchResult> {
    // Validate input first
    this.validateComponentNameInput(componentName);
    const validatedName = validateComponentName(componentName);

    const startTime = Date.now();

    // 1. Check cache first and evict expired entries
    this.evictExpiredEntries();

    if (this.cache.has(validatedName)) {
      const cacheEntry = this.cache.get(validatedName);
      if (!cacheEntry) {
        throw new Error(`Cache entry not found for ${validatedName}`);
      }
      return {
        component: cacheEntry.component,
        fromCache: true,
        fetchTime: Date.now() - startTime,
        registryUrl: `${this.baseUrl}/registry/components/${validatedName}`,
      };
    }

    // 2. Fetch from registry API if not cached
    const componentData = await this.fetchFromRegistry(validatedName);

    // 3. Validate response structure
    const validatedComponent = this.validateRegistryResponse(componentData, validatedName);

    // 4. Store in cache with size management
    this.addToCache(validatedName, validatedComponent);

    // 5. Return component data with metadata
    const fetchTime = Date.now() - startTime;
    return {
      component: validatedComponent,
      fromCache: false,
      fetchTime,
      registryUrl: `${this.baseUrl}/registry/components/${validatedName}`,
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
  private async fetchFromRegistry(componentName: ComponentName): Promise<ComponentManifest> {
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
        throw this.createRegistryError(
          `HTTP ${response.status}: ${response.statusText}`,
          componentName,
          url,
          response.status
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw this.createRegistryError(
            'Registry request timeout after 10000ms',
            componentName,
            url
          );
        }
        if (error.name === 'RegistryError') {
          throw error; // Already properly formatted
        }
        throw this.createRegistryError(
          `Failed to fetch from registry: ${error.message}`,
          componentName,
          url
        );
      }
      throw error;
    }
  }

  /**
   * Validate response structure and required fields
   */
  private validateRegistryResponse(data: unknown, componentName: ComponentName): RegistryComponent {
    try {
      // First try to parse with shared schema for validation
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
      throw this.createRegistryError(
        `Registry response validation failed for component '${componentName}': ${
          error instanceof Error ? error.message : 'Unknown validation error'
        }`,
        componentName,
        `${this.baseUrl}/registry/components/${componentName}`
      );
    }
  }

  /**
   * Validate component name input for security and format
   */
  private validateComponentNameInput(name: string): void {
    if (!name || typeof name !== 'string') {
      throw new Error('Component name must be a non-empty string');
    }

    if (name.trim() === '') {
      throw new Error('Component name cannot be empty or only whitespace');
    }

    if (name.length > 100) {
      throw new Error('Component name cannot exceed 100 characters');
    }

    // Prevent potential XSS or injection attacks
    if (/<|>|&|"|'|`/.test(name)) {
      throw new Error('Component name contains invalid characters');
    }
  }

  /**
   * Create a properly formatted RegistryError
   */
  private createRegistryError(
    message: string,
    componentName: ComponentName,
    url: string,
    statusCode?: number
  ): RegistryError {
    const error = new Error(message) as RegistryError;
    error.name = 'RegistryError';
    error.componentName = componentName;
    error.registryUrl = url;
    if (statusCode) {
      error.statusCode = statusCode;
    }
    return error;
  }

  /**
   * Add component to cache with size management
   */
  private addToCache(componentName: ComponentName, component: RegistryComponent): void {
    // If cache is at max size, remove oldest entry
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(componentName, {
      component,
      timestamp: Date.now(),
    });
  }

  /**
   * Remove expired entries from cache
   */
  private evictExpiredEntries(): void {
    const now = Date.now();
    for (const [key, value] of this.cache) {
      if (now - value.timestamp > this.CACHE_TTL) {
        this.cache.delete(key);
      }
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
  getCacheStats(): { size: number; keys: string[]; ttl: number; maxSize: number } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      ttl: this.CACHE_TTL,
      maxSize: this.MAX_CACHE_SIZE,
    };
  }
}
