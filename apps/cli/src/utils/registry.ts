/**
 * Registry API client for fetching components from rafters.realhandy.tech
 */

import {
  type ComponentManifest,
  ComponentManifestSchema,
  type RegistryResponse,
  RegistryResponseSchema,
} from '@rafters/shared';

// Re-export types from shared package
export type { ComponentManifest } from '@rafters/shared';
export type Registry = RegistryResponse;

// Registry configuration
function getRegistryBaseUrl(): string {
  // Prefer explicit environment variable, fallback to old endpoint if set, else use new default
  if (process.env.RAFTERS_REGISTRY_URL) {
    return process.env.RAFTERS_REGISTRY_URL;
  }
  if (process.env.RAFTERS_REGISTRY_API_URL) {
    // Warn about deprecated usage
    console.warn(
      '[rafters-cli] RAFTERS_REGISTRY_API_URL is deprecated. Please use RAFTERS_REGISTRY_URL for /registry endpoint.'
    );
    return process.env.RAFTERS_REGISTRY_API_URL;
  }
  return 'https://rafters.realhandy.tech/registry';
}
const REGISTRY_TIMEOUT = 10000; // 10 seconds

// HTTP client with error handling
async function fetchFromRegistry(endpoint: string): Promise<unknown> {
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
    return data;
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

  return RegistryResponseSchema.parse(data);
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
    } catch (_registryError) {
      throw new Error(
        `Component '${componentName}' not found: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
