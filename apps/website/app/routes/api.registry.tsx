/**
 * Registry API Route
 *
 * Returns registry metadata for AI consumption
 */

import { getRegistryMetadata } from '@/lib/registry/componentService';

export async function loader() {
  const registryData = await getRegistryMetadata();

  return new Response(JSON.stringify(registryData, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  return new Response('Method not allowed', { status: 405 });
}
