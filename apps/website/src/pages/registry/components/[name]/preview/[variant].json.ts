import type { Preview } from '@rafters/shared';
import { getComponent } from '../../../../../lib/registry/componentService';

// In-memory cache for compiled previews
// Clear cache by modifying this line
const previewCache = new Map<string, Preview>(); // v2

// NOTE: prerender disabled to allow dynamic routes in dev mode without getStaticPaths() errors
// export const prerender = true;

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

    // Check cache first
    const cacheKey = `${componentName}:${variantName}`;
    let preview = previewCache.get(cacheKey);

    // If not in cache, compile it
    if (!preview) {
      const component = await getComponent(componentName);

      if (!component) {
        return new Response(JSON.stringify({ error: 'Component not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const cva = component.meta.rafters.intelligence?.cva;
      const dependencies = component.dependencies || [];

      if (!cva) {
        return new Response(JSON.stringify({ error: 'CVA intelligence not found for preview' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Compile the preview on-demand
      const { compileComponentPreview } = await import(
        '../../../../../lib/registry/previewCompiler'
      );
      const componentFile = component.files[0];
      const componentPath = `/Users/seansilvius/projects/realhandy/rafters/packages/ui/src/${componentFile.path}`;

      const compiledPreview = await compileComponentPreview({
        componentPath,
        componentContent: componentFile.content,
        framework: 'react',
        variant: variantName,
        props: {},
      });

      if (compiledPreview.error) {
        return new Response(JSON.stringify({ error: compiledPreview.error }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Build complete preview with CVA and CSS
      preview = {
        ...compiledPreview,
        cva: {
          baseClasses: cva.baseClasses,
          propMappings: cva.propMappings,
          allClasses: cva.allClasses,
        },
        css: cva.css,
        dependencies,
      };

      // Cache it
      previewCache.set(cacheKey, preview);
    }

    return new Response(JSON.stringify(preview, null, 2), {
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
  const { compileAllPreviews } = await import('../../../../../lib/registry/previewCompiler');
  const registry = await getRegistryMetadata();

  const paths = [];

  for (const component of registry.components || []) {
    const { getComponent: fetchComponent } = await import(
      '../../../../../lib/registry/componentService'
    );
    const fullComponent = await fetchComponent(component.name);

    // Compile previews on-demand during getStaticPaths
    if (fullComponent) {
      const cva = fullComponent.meta.rafters.intelligence?.cva;
      if (cva) {
        const componentFile = fullComponent.files[0];
        const componentPath = `/Users/seansilvius/projects/realhandy/rafters/packages/ui/src/${componentFile.path}`;

        const previews = await compileAllPreviews(
          fullComponent.name,
          componentPath,
          componentFile.content,
          'react',
          cva,
          cva.css,
          fullComponent.dependencies
        );

        // Cache each preview for GET handler
        for (const preview of previews) {
          const cacheKey = `${fullComponent.name}:${preview.variant}`;
          previewCache.set(cacheKey, preview);

          paths.push({
            params: { name: fullComponent.name, variant: preview.variant },
          });
        }
      }
    }
  }

  return paths;
}
