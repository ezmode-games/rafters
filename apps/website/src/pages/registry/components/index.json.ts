/**
 * Registry Components List Route - Static Generation
 *
 * Returns all components with design intelligence for shadcn compatibility
 */

import {
  type ComponentManifest,
  getRegistryMetadata,
} from '../../../lib/registry/componentService';

export const prerender = true;

export async function GET() {
  try {
    const registryData = await getRegistryMetadata();

    // Transform to simpler format for listing (shadcn-compatible)
    const componentsData = {
      components: registryData.components.map((component: ComponentManifest) => ({
        name: component.name,
        description: component.description || '',
        version: component.meta?.rafters?.version || '0.1.0',
        type: component.type,
        intelligence: component.meta?.rafters?.intelligence
          ? {
              cognitiveLoad: component.meta.rafters.intelligence.cognitiveLoad,
              attentionEconomics: component.meta.rafters.intelligence.attentionEconomics,
              accessibility: component.meta.rafters.intelligence.accessibility,
            }
          : null,
        files: component.files?.map((f) => f.path) || [],
        dependencies: component.dependencies || [],
      })),
    };

    return new Response(JSON.stringify(componentsData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Registry components API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
