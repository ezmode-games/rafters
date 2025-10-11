import { getComponent } from '../../../../../lib/registry/componentService';

export const prerender = true;

export async function GET({ params }: { params: { name: string; variant: string } }) {
  try {
    const componentName = params.name;
    const variantName = params.variant;

    if (!componentName || !variantName) {
      return new Response(JSON.stringify({ error: 'Component name and variant are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const component = await getComponent(componentName);

    if (!component) {
      return new Response(JSON.stringify({ error: 'Component not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Find the preview for this variant
    const preview = component.meta.rafters.previews?.find((p) => p.variant === variantName);

    if (!preview) {
      return new Response(JSON.stringify({ error: 'Preview variant not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Include CVA intelligence, CSS, and dependencies for complete rendering
    const cva = component.meta.rafters.intelligence?.cva;
    const css = cva?.css || '';
    const dependencies = component.dependencies || [];

    if (!cva) {
      return new Response(JSON.stringify({ error: 'CVA intelligence not found for preview' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const previewWithRenderingData = {
      ...preview,
      cva,
      css,
      dependencies,
    };

    return new Response(JSON.stringify(previewWithRenderingData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error fetching preview:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function getStaticPaths() {
  const { getRegistryMetadata } = await import('../../../../../lib/registry/componentService');
  const registry = await getRegistryMetadata();

  const paths = [];

  for (const component of registry.components || []) {
    const { getComponent: fetchComponent } = await import(
      '../../../../../lib/registry/componentService'
    );
    const fullComponent = await fetchComponent(component.name);

    if (fullComponent?.meta.rafters.previews) {
      for (const preview of fullComponent.meta.rafters.previews) {
        paths.push({
          params: { name: component.name, variant: preview.variant },
        });
      }
    }
  }

  return paths;
}
