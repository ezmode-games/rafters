/**
 * Individual Component Route
 *
 * Returns detailed component information with full design intelligence
 */

import { getComponent } from '@/lib/registry/componentService';
import type { Route } from './+types/api.registry.components.$name';

export async function loader({ params }: Route.LoaderArgs) {
  const { name } = params;

  if (!name) {
    return new Response(JSON.stringify({ error: 'Component name is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const component = await getComponent(name);

  if (!component) {
    return new Response(
      JSON.stringify({
        error: 'Component not found',
        message: `Component "${name}" does not exist in the registry`,
      }),
      {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(JSON.stringify(component, null, 2), {
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
