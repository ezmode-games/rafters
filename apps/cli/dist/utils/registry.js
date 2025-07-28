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
    tailwind: z.record(z.unknown()).optional(),
    cssVars: z.record(z.unknown()).optional(),
    css: z.array(z.string()).optional(),
    envVars: z.record(z.string()).optional(),
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
// Registry configuration
const REGISTRY_BASE_URL = process.env.RAFTERS_REGISTRY_URL || 'https://rafters.realhandy.tech/registry';
const REGISTRY_TIMEOUT = 10000; // 10 seconds
// HTTP client response schema
const RegistryResponseSchema = z.unknown();
// HTTP client with error handling
async function fetchFromRegistry(endpoint) {
    const url = `${REGISTRY_BASE_URL}${endpoint}`;
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
    try {
        const data = await fetchFromRegistry('/components');
        return RegistrySchema.parse(data);
    }
    catch (error) {
        // Fallback to mock data if registry is unavailable
        console.warn('Registry API unavailable, using fallback data:', error);
        return getFallbackRegistry();
    }
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
        console.warn(`Component '${componentName}' not found in registry:`, error);
        // Fallback to registry search
        const registry = await fetchComponentRegistry();
        return (registry.components.find((c) => c.name.toLowerCase() === componentName.toLowerCase()) || null);
    }
}
/**
 * Fallback registry data when API is unavailable
 * This ensures the CLI continues to work during development/outages
 * Uses shadcn-compatible format with rafters intelligence in meta
 */
function getFallbackRegistry() {
    const components = [
        {
            $schema: 'https://ui.shadcn.com/schema/registry-item.json',
            name: 'button',
            type: 'registry:component',
            description: 'Action triggers with attention economics and trust-building patterns',
            dependencies: ['@radix-ui/react-slot'],
            files: [
                {
                    path: 'components/ui/button.tsx',
                    type: 'registry:component',
                    content: '// Button component will be fetched from registry',
                },
            ],
            meta: {
                rafters: {
                    intelligence: {
                        cognitiveLoad: 3,
                        attentionEconomics: 'Size hierarchy: sm=tertiary, md=secondary, lg=primary',
                        accessibility: '44px touch targets, WCAG AAA contrast, keyboard navigation',
                        trustBuilding: 'Destructive variant requires confirmation patterns',
                        semanticMeaning: 'Primary=main action, Secondary=optional, Destructive=careful consideration',
                    },
                    version: '1.0.0',
                },
            },
        },
        {
            $schema: 'https://ui.shadcn.com/schema/registry-item.json',
            name: 'input',
            type: 'registry:component',
            description: 'Form fields with validation intelligence and state feedback',
            dependencies: [],
            files: [
                {
                    path: 'components/ui/input.tsx',
                    type: 'registry:component',
                    content: '// Input component will be fetched from registry',
                },
            ],
            meta: {
                rafters: {
                    intelligence: {
                        cognitiveLoad: 4,
                        attentionEconomics: 'Clear validation states guide attention to errors',
                        accessibility: 'ARIA labels, error announcements, 44px touch targets',
                        trustBuilding: 'Progressive validation feedback builds confidence',
                        semanticMeaning: 'Validation states communicate system understanding',
                    },
                    version: '1.0.0',
                },
            },
        },
        {
            $schema: 'https://ui.shadcn.com/schema/registry-item.json',
            name: 'card',
            type: 'registry:component',
            description: 'Content containers with cognitive load optimization',
            dependencies: [],
            files: [
                {
                    path: 'components/ui/card.tsx',
                    type: 'registry:component',
                    content: '// Card component will be fetched from registry',
                },
            ],
            meta: {
                rafters: {
                    intelligence: {
                        cognitiveLoad: 2,
                        attentionEconomics: 'Subtle elevation guides content hierarchy',
                        accessibility: 'Semantic landmarks, focus management for interactive cards',
                        trustBuilding: 'Consistent spacing builds visual reliability',
                        semanticMeaning: 'Container intelligence communicates content relationships',
                    },
                    version: '1.0.0',
                },
            },
        },
    ];
    return { components };
}
