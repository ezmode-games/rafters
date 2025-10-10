/**
 * Registry Individual Component Route - Static Generation
 *
 * Returns specific component data with full design intelligence
 */

import { getComponent, getRegistryMetadata } from '../../../lib/registry/componentService';

export async function getStaticPaths() {
  const registry = await getRegistryMetadata();

  return (
    registry.components?.map((component) => ({
      params: { name: component.name },
    })) || []
  );
}

export async function GET({ params }: { params: { name: string } }) {
  try {
    const componentData = await getComponent(params.name);

    if (!componentData) {
      return new Response(JSON.stringify({ error: `Component '${params.name}' not found` }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return new Response(JSON.stringify(componentData), {
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
    console.error(`Registry component API error for ${params.name}:`, error);
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
