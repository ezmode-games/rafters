/**
 * Component Service
 *
 * Manages loading and processing of components for the registry API.
 * Uses generated registry manifest with embedded JSDoc intelligence.
 */

// Import the generated manifest directly as a JSON module
// @ts-ignore - JSON import is supported in Workers
import generatedManifest from '@/registry-manifest.json';

// Type definitions for our generated registry manifest
interface RaftersIntelligence {
  cognitiveLoad: number;
  attentionEconomics: string;
  accessibility: string;
  trustBuilding: string;
  semanticMeaning: string;
}

interface UsagePatterns {
  dos: string[];
  nevers: string[];
}

interface DesignGuide {
  name: string;
  url: string;
}

interface Example {
  title?: string;
  code: string;
  description?: string;
}

interface GeneratedComponent {
  name: string;
  path: string;
  type: string;
  description?: string;
  content: string;
  dependencies: string[];
  docs?: string;
  meta?: {
    rafters: {
      version: string;
      intelligence: RaftersIntelligence;
      usagePatterns: UsagePatterns;
      designGuides: DesignGuide[];
      examples: Example[];
    };
  };
}

interface GeneratedManifest {
  components: GeneratedComponent[];
  total: number;
  lastUpdated: string;
}

// Shadcn-compatible ComponentManifest type
export interface ComponentManifest {
  $schema?: string;
  name: string;
  type:
    | 'registry:component'
    | 'registry:lib'
    | 'registry:style'
    | 'registry:block'
    | 'registry:page'
    | 'registry:hook';
  description?: string;
  dependencies?: string[];
  files?: Array<{
    path: string;
    type: string;
    content: string;
  }>;
  docs?: string;
  meta?: {
    rafters?: {
      version: string;
      intelligence: RaftersIntelligence;
      usagePatterns: UsagePatterns;
      designGuides: DesignGuide[];
      examples: Example[];
    };
  };
}

// Load the generated registry manifest (already imported as JSON module)
function loadGeneratedManifest(): GeneratedManifest {
  return generatedManifest as GeneratedManifest;
}

// Convert generated component to shadcn-compatible format
function convertToComponentManifest(component: GeneratedComponent): ComponentManifest {
  return {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: component.name,
    type: component.type as ComponentManifest['type'],
    description: component.description,
    dependencies: component.dependencies,
    docs: component.docs,
    files: [
      {
        path: component.path,
        type: component.type,
        content: component.content,
      },
    ],
    meta: component.meta,
  };
}

export async function getComponentRegistry(): Promise<{ components: ComponentManifest[] }> {
  const manifest = loadGeneratedManifest();

  const components = manifest.components.map(convertToComponentManifest);

  return { components };
}

export async function getComponent(name: string): Promise<ComponentManifest | null> {
  const registry = await getComponentRegistry();
  return registry.components.find((c) => c.name.toLowerCase() === name.toLowerCase()) || null;
}
