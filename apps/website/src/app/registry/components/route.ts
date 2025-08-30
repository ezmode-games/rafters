/**
 * Registry Components List Route - Static Generation
 *
 * Returns all components with design intelligence
 */

import { type ComponentManifest, getComponentRegistry } from '@/lib/registry/componentService';

// Force static generation
export const dynamic = 'force-static';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET() {
  try {
    const registryData = await getComponentRegistry();

    // Transform to simpler format for listing
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

    return Response.json(componentsData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=31536000, immutable',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('Registry components API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}
