/**
 * Registry API Route - Static Generation
 *
 * Returns registry metadata for AI consumption
 */

import { getRegistryMetadata } from '@/lib/registry/componentService';

// Force static generation
export const dynamic = 'force-static';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET() {
  try {
    const registryData = await getRegistryMetadata();

    return Response.json(registryData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=31536000, immutable',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('Registry API error:', error);
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
