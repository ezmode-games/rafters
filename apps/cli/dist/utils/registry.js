/**
 * Registry API client for fetching components from rafters.realhandy.tech
 */
import { z } from 'zod';
// Rafters intelligence schemas
export const IntelligenceSchema = z.object({
    cognitiveLoad: z.number().min(0).max(10),
    attentionEconomics: z.string(),
    accessibility: z.string(),
    trustBuilding: z.string(),
    semanticMeaning: z.string(),
});
export const UsagePatternsSchema = z.object({
    dos: z.array(z.string()),
    nevers: z.array(z.string()),
});
export const DesignGuideSchema = z.object({
    name: z.string(),
    url: z.string(),
});
export const ExampleSchema = z.object({
    title: z.string().optional(),
    code: z.string(),
    description: z.string().optional(),
});
// Shadcn registry file schema
const RegistryFileSchema = z.object({
    path: z.string(),
    content: z.string(),
    type: z.string(),
    target: z.string().optional(),
});
// Main component manifest schema - matches shadcn registry-item.json with Rafters extensions
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
    files: z.array(RegistryFileSchema).optional(),
    content: z.string().optional(), // For simple single-file components
    path: z.string().optional(), // Component file path
    tailwind: z.record(z.string(), z.unknown()).optional(),
    cssVars: z.record(z.string(), z.unknown()).optional(),
    css: z.array(z.string()).optional(),
    envVars: z.record(z.string(), z.string()).optional(),
    categories: z.array(z.string()).optional(),
    docs: z.string().optional(),
    // Expanded Rafters intelligence metadata in the meta field
    meta: z
        .object({
        rafters: z
            .object({
            version: z.string(),
            intelligence: IntelligenceSchema,
            usagePatterns: UsagePatternsSchema,
            designGuides: z.array(DesignGuideSchema),
            examples: z.array(ExampleSchema),
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
// Registry configuration
function getRegistryBaseUrl() {
    return process.env.RAFTERS_REGISTRY_URL || 'https://rafters.realhandy.tech/registry';
}
const REGISTRY_TIMEOUT = 10000; // 10 seconds
// HTTP client response schema
const RegistryResponseSchema = z.unknown();
// HTTP client with error handling
async function fetchFromRegistry(endpoint) {
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
    }
    catch (error) {
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
export async function fetchComponentRegistry() {
    const data = await fetchFromRegistry('/components');
    // Transform the API response to match shadcn registry format
    if (data && typeof data === 'object' && 'components' in data) {
        return {
            $schema: 'https://ui.shadcn.com/schema/registry.json',
            name: 'Rafters AI Design Intelligence Registry',
            components: data.components,
        };
    }
    return RegistrySchema.parse(data);
}
/**
 * Fetch a specific component by name from the hosted API
 */
export async function fetchComponent(componentName) {
    try {
        const data = await fetchFromRegistry(`/components/${encodeURIComponent(componentName)}`);
        return ComponentManifestSchema.parse(data);
    }
    catch (error) {
        // Try searching the full registry if direct fetch fails
        try {
            const registry = await fetchComponentRegistry();
            return (registry.components?.find((c) => c.name.toLowerCase() === componentName.toLowerCase()) ||
                null);
        }
        catch (registryError) {
            throw new Error(`Component '${componentName}' not found: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
