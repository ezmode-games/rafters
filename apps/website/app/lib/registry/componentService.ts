/**
 * Component Service
 *
 * Manages loading and processing of components for the registry API.
 * Uses generated registry manifest with embedded JSDoc intelligence.
 */

// Import the generated manifest from TypeScript file
import { registryManifest } from './registryData';

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

// Load the generated registry manifest
function loadGeneratedManifest(): GeneratedManifest {
  return JSON.parse(JSON.stringify(registryManifest)) as GeneratedManifest;
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

export async function getComponentRegistry(): Promise<{
  components: ComponentManifest[];
}> {
  const manifest = loadGeneratedManifest();

  const components = manifest.components.map(convertToComponentManifest);

  return { components };
}

export async function getComponent(name: string): Promise<ComponentManifest | null> {
  const registry = await getComponentRegistry();
  return registry.components.find((c) => c.name.toLowerCase() === name.toLowerCase()) || null;
}

// Registry metadata for AI consumption
export async function getRegistryMetadata() {
  const manifest = loadGeneratedManifest();

  return {
    $schema: 'https://rafters.dev/schemas/registry.json',
    name: 'Rafters AI Design Intelligence Registry',
    version: '1.0.0',
    description: 'Components with embedded design reasoning for AI agents',
    baseUrl: 'https://rafters.realhandy.tech/api/registry',
    components: manifest.components.map((component) => ({
      name: component.name,
      description: component.description || '',
      version: component.meta?.rafters?.version || '0.1.0',
      type: component.type,
      cognitiveLoad: component.meta?.rafters?.intelligence?.cognitiveLoad || 0,
      dependencies: component.dependencies,
      files: [component.path],
    })),
    totalComponents: manifest.total,
    lastUpdated: manifest.lastUpdated,
  };
}
