/**
 * Individual Component Route - Static Generation
 *
 * Returns detailed component information with full design intelligence
 */

import { getComponent, getComponentRegistry } from '@/lib/registry/componentService';

// Force static generation
export const dynamic = 'force-static';

// Generate static params for all components
export async function generateStaticParams() {
  const registry = await getComponentRegistry();

  return registry.components.map((component) => ({
    name: component.name,
  }));
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET(request: Request, { params }: { params: Promise<{ name: string }> }) {
  try {
    const { name } = await params;

    if (!name) {
      return Response.json(
        { error: 'Component name is required' },
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    const component = await getComponent(name);

    if (!component) {
      return Response.json(
        {
          error: 'Component not found',
          message: `Component "${name}" does not exist in the registry`,
        },
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    return Response.json(component, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=31536000, immutable',
        ...corsHeaders,
      },
    });
  } catch (error) {
    const { name } = await params;
    console.error(`Registry component API error for ${name}:`, error);
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
