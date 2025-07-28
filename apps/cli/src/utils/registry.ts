import { z } from 'zod';

export const IntelligenceSchema = z.object({
  cognitiveLoad: z.number().min(1).max(10),
  attentionEconomics: z.string(),
  accessibility: z.string(),
  trustBuilding: z.string(),
  semanticMeaning: z.string(),
});

export const ComponentManifestSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string(),
  intelligence: IntelligenceSchema,
  files: z.object({
    component: z.string(),
    story: z.string().optional(),
    types: z.string().optional(),
  }),
  dependencies: z.array(z.string()),
});

export const RegistrySchema = z.object({
  components: z.array(ComponentManifestSchema),
});

export type Intelligence = z.infer<typeof IntelligenceSchema>;
export type ComponentManifest = z.infer<typeof ComponentManifestSchema>;
export type Registry = z.infer<typeof RegistrySchema>;

// For now, we'll use local components from our main project
// Later this would fetch from a real registry
export async function fetchComponentRegistry(): Promise<Registry> {
  // Mock registry data based on our actual components
  const components: ComponentManifest[] = [
    {
      name: 'Button',
      version: '1.0.0',
      description: 'Action triggers with attention economics and trust-building patterns',
      intelligence: {
        cognitiveLoad: 3,
        attentionEconomics: 'Size hierarchy: sm=tertiary, md=secondary, lg=primary',
        accessibility: '44px touch targets, WCAG AAA contrast, keyboard navigation',
        trustBuilding: 'Destructive variant requires confirmation patterns',
        semanticMeaning:
          'Primary=main action, Secondary=optional, Destructive=careful consideration',
      },
      files: {
        component: 'button.tsx',
        story: 'button-intelligence.stories.tsx',
      },
      dependencies: ['@radix-ui/react-slot'],
    },
    {
      name: 'Input',
      version: '1.0.0',
      description: 'Form fields with validation intelligence and state feedback',
      intelligence: {
        cognitiveLoad: 4,
        attentionEconomics: 'Clear validation states guide attention to errors',
        accessibility: 'ARIA labels, error announcements, 44px touch targets',
        trustBuilding: 'Progressive validation feedback builds confidence',
        semanticMeaning: 'Validation states communicate system understanding',
      },
      files: {
        component: 'input.tsx',
        story: 'input-intelligence.stories.tsx',
      },
      dependencies: [],
    },
    {
      name: 'Card',
      version: '1.0.0',
      description: 'Content containers with cognitive load optimization',
      intelligence: {
        cognitiveLoad: 2,
        attentionEconomics: 'Subtle elevation guides content hierarchy',
        accessibility: 'Semantic landmarks, focus management for interactive cards',
        trustBuilding: 'Consistent spacing builds visual reliability',
        semanticMeaning: 'Container intelligence communicates content relationships',
      },
      files: {
        component: 'card.tsx',
        story: 'card-intelligence.stories.tsx',
      },
      dependencies: [],
    },
    {
      name: 'Select',
      version: '1.0.0',
      description: 'Choice components with interaction intelligence',
      intelligence: {
        cognitiveLoad: 5,
        attentionEconomics: 'Clear focus states reduce choice anxiety',
        accessibility: 'Full keyboard navigation, screen reader announcements',
        trustBuilding: 'Predictable interaction patterns build user confidence',
        semanticMeaning: 'Selection state clearly communicates user choices',
      },
      files: {
        component: 'select.tsx',
        story: 'select-intelligence.stories.tsx',
      },
      dependencies: ['@radix-ui/react-select'],
    },
    {
      name: 'Dialog',
      version: '1.0.0',
      description: 'Modal interactions with trust-building confirmation patterns',
      intelligence: {
        cognitiveLoad: 7,
        attentionEconomics: 'Focus trap and backdrop direct attention appropriately',
        accessibility: 'Focus management, escape handling, ARIA modal patterns',
        trustBuilding: 'Clear actions and consequences reduce modal anxiety',
        semanticMeaning: 'Modal timing communicates action importance',
      },
      files: {
        component: 'dialog.tsx',
        story: 'dialog-intelligence.stories.tsx',
      },
      dependencies: ['@radix-ui/react-dialog'],
    },
    {
      name: 'Label',
      version: '1.0.0',
      description: 'Information delivery with semantic clarity and context',
      intelligence: {
        cognitiveLoad: 1,
        attentionEconomics: 'Typography hierarchy guides information processing',
        accessibility: 'Semantic relationships via htmlFor and aria-describedby',
        trustBuilding: 'Consistent language patterns build user confidence',
        semanticMeaning: 'Information types mapped to appropriate visual treatments',
      },
      files: {
        component: 'label.tsx',
        story: 'label-intelligence.stories.tsx',
      },
      dependencies: [],
    },
    {
      name: 'Tabs',
      version: '1.0.0',
      description: 'Navigation with cognitive load management and content organization',
      intelligence: {
        cognitiveLoad: 4,
        attentionEconomics: 'Active state clearly communicates current context',
        accessibility: 'Arrow key navigation, role=tablist, aria-selected',
        trustBuilding: 'Predictable tab behavior reduces navigation uncertainty',
        semanticMeaning: 'Tab grouping communicates related content relationships',
      },
      files: {
        component: 'tabs.tsx',
        story: 'tabs-intelligence.stories.tsx',
      },
      dependencies: ['@radix-ui/react-tabs'],
    },
  ];

  return { components };
}

export async function fetchComponent(componentName: string): Promise<ComponentManifest | null> {
  const registry = await fetchComponentRegistry();
  return (
    registry.components.find((c) => c.name.toLowerCase() === componentName.toLowerCase()) || null
  );
}
