/**
 * Registry Components List Route
 *
 * Returns all components with design intelligence
 */

import { type ComponentManifest, getComponentRegistry } from '@/lib/registry/componentService';

export async function loader() {
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

  return new Response(JSON.stringify(componentsData, null, 2), {
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
