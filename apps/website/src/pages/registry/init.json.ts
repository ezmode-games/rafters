/**
 * Init Endpoint
 * GET /registry/init.json
 *
 * Returns the payload for `rafters init` - theme.css and config
 */

import type { APIRoute } from 'astro';
import { generateInitPayload } from '../../lib/registry/initService';

export const prerender = true;

export const GET: APIRoute = async () => {
  const payload = generateInitPayload();

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
