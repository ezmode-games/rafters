/**
 * Component Service
 *
 * Manages loading and processing of components for the registry API.
 * Uses shared registry data for consistency across the system.
 */

import type { ComponentManifest } from '@rafters/shared';
import {
  COMPONENT_INTELLIGENCE_MAP,
  REGISTRY_MANIFEST,
  type RegistryManifestComponent,
} from '@rafters/shared';

// Convert manifest component to shadcn-compatible format
function convertToComponentManifest(
  manifestComponent: RegistryManifestComponent
): ComponentManifest {
  const meta = COMPONENT_INTELLIGENCE_MAP[manifestComponent.name] || {
    description: `${manifestComponent.name} component`,
    dependencies: ['class-variance-authority', 'clsx'],
    intelligence: {
      cognitiveLoad: 3,
      attentionEconomics: 'Standard interaction patterns',
      accessibility: 'WCAG compliant design',
      trustBuilding: 'Consistent user experience',
      semanticMeaning: 'Semantic HTML structure',
    },
  };

  return {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: manifestComponent.name,
    type: manifestComponent.type as 'registry:component',
    description: meta.description,
    dependencies: meta.dependencies,
    files: [
      {
        path: manifestComponent.path,
        type: manifestComponent.type,
        content: manifestComponent.content,
      },
    ],
    meta: {
      rafters: {
        intelligence: meta.intelligence,
        version: manifestComponent.version,
      },
    },
  };
}

export async function getComponentRegistry(): Promise<{ components: ComponentManifest[] }> {
  const components = REGISTRY_MANIFEST.components
    .filter((comp) => comp.status === 'published')
    .map(convertToComponentManifest);

  return { components };
}

export async function getComponent(name: string): Promise<ComponentManifest | null> {
  const registry = await getComponentRegistry();
  return registry.components.find((c) => c.name.toLowerCase() === name.toLowerCase()) || null;
}
