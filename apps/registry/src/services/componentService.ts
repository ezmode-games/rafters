/**
 * Component Service
 *
 * Manages loading and processing of components from the filesystem
 * for the registry API. In production, this could be backed by a database
 * or CDN, but for now we'll read from the packages/ui structure.
 */

import type { ComponentManifest } from '@rafters/shared';

// This would normally come from a database or be generated during build
// For now, we'll create the shadcn-compatible registry data structure
export async function getComponentRegistry(): Promise<{ components: ComponentManifest[] }> {
  // In a real implementation, this would read from packages/ui or a database
  // For now, return the hardcoded registry that matches what the CLI expects

  const components: ComponentManifest[] = [
    {
      $schema: 'https://ui.shadcn.com/schema/registry-item.json',
      name: 'button',
      type: 'registry:component',
      description:
        'Interactive button component with AI-embedded design intelligence and trust-building patterns',
      dependencies: ['@radix-ui/react-slot', 'class-variance-authority', 'clsx'],
      files: [
        {
          path: 'components/ui/button.tsx',
          type: 'registry:component',
          content: '', // Will be populated from actual file
        },
      ],
      meta: {
        rafters: {
          intelligence: {
            cognitiveLoad: 3,
            attentionEconomics:
              'Size hierarchy: sm=tertiary actions, md=secondary interactions, lg=primary calls-to-action',
            accessibility:
              'WCAG AAA compliant with 44px minimum touch targets, high contrast ratios, and screen reader optimization',
            trustBuilding:
              'Destructive actions require confirmation patterns. Loading states prevent double-submission. Visual feedback reinforces user actions.',
            semanticMeaning:
              'Variant mapping: primary=main actions, secondary=supporting actions, destructive=irreversible actions with safety patterns',
          },
          version: '1.0.0',
        },
      },
    },
    {
      $schema: 'https://ui.shadcn.com/schema/registry-item.json',
      name: 'input',
      type: 'registry:component',
      description: 'Form input component with validation states and accessibility-first design',
      dependencies: ['class-variance-authority', 'clsx'],
      files: [
        {
          path: 'components/ui/input.tsx',
          type: 'registry:component',
          content: '',
        },
      ],
      meta: {
        rafters: {
          intelligence: {
            cognitiveLoad: 4,
            attentionEconomics:
              'State hierarchy: default=ready, focus=active input, error=requires attention, success=validation passed',
            accessibility:
              'Screen reader labels, validation announcements, keyboard navigation, high contrast support',
            trustBuilding:
              'Clear validation feedback, error recovery patterns, progressive enhancement',
            semanticMeaning:
              'Type-appropriate validation: email=format validation, password=security indicators, number=range constraints',
          },
          version: '1.0.0',
        },
      },
    },
    {
      $schema: 'https://ui.shadcn.com/schema/registry-item.json',
      name: 'card',
      type: 'registry:component',
      description:
        'Flexible container component for grouping related content with semantic structure',
      dependencies: ['class-variance-authority', 'clsx'],
      files: [
        {
          path: 'components/ui/card.tsx',
          type: 'registry:component',
          content: '',
        },
      ],
      meta: {
        rafters: {
          intelligence: {
            cognitiveLoad: 2,
            attentionEconomics:
              'Elevation hierarchy: flat=background content, raised=interactive cards, floating=modal content',
            accessibility:
              'Proper heading structure, landmark roles, keyboard navigation for interactive cards',
            trustBuilding:
              'Consistent spacing, predictable interaction patterns, clear content boundaries',
            semanticMeaning:
              'Structural roles: article=standalone content, section=grouped content, aside=supplementary information',
          },
          version: '1.0.0',
        },
      },
    },
    {
      $schema: 'https://ui.shadcn.com/schema/registry-item.json',
      name: 'select',
      type: 'registry:component',
      description: 'Dropdown selection component with search and accessibility features',
      dependencies: ['@radix-ui/react-select', 'class-variance-authority', 'clsx'],
      files: [
        {
          path: 'components/ui/select.tsx',
          type: 'registry:component',
          content: '',
        },
      ],
      meta: {
        rafters: {
          intelligence: {
            cognitiveLoad: 5,
            attentionEconomics:
              'State management: closed=compact display, open=full options, searching=filtered results',
            accessibility:
              'Keyboard navigation, screen reader announcements, focus management, option grouping',
            trustBuilding:
              'Search functionality, clear selection indication, undo patterns for accidental selections',
            semanticMeaning:
              'Option structure: value=data, label=display, group=categorization, disabled=unavailable choices',
          },
          version: '1.0.0',
        },
      },
    },
    {
      $schema: 'https://ui.shadcn.com/schema/registry-item.json',
      name: 'dialog',
      type: 'registry:component',
      description: 'Modal dialog component with focus management and escape patterns',
      dependencies: ['@radix-ui/react-dialog', 'class-variance-authority', 'clsx'],
      files: [
        {
          path: 'components/ui/dialog.tsx',
          type: 'registry:component',
          content: '',
        },
      ],
      meta: {
        rafters: {
          intelligence: {
            cognitiveLoad: 6,
            attentionEconomics:
              'Attention capture: modal=full attention, drawer=partial attention, popover=contextual attention',
            accessibility:
              'Focus trapping, escape key handling, backdrop dismissal, screen reader announcements',
            trustBuilding:
              'Clear close mechanisms, confirmation for destructive actions, non-blocking for informational content',
            semanticMeaning:
              'Usage patterns: modal=blocking workflow, drawer=supplementary, alert=urgent information',
          },
          version: '1.0.0',
        },
      },
    },
    {
      $schema: 'https://ui.shadcn.com/schema/registry-item.json',
      name: 'label',
      type: 'registry:component',
      description: 'Form label component with semantic variants and accessibility associations',
      dependencies: ['class-variance-authority', 'clsx'],
      files: [
        {
          path: 'components/ui/label.tsx',
          type: 'registry:component',
          content: '',
        },
      ],
      meta: {
        rafters: {
          intelligence: {
            cognitiveLoad: 2,
            attentionEconomics:
              'Information hierarchy: field=required label, hint=helpful guidance, error=attention needed',
            accessibility:
              'Form association, screen reader optimization, color-independent error indication',
            trustBuilding:
              'Clear requirement indication, helpful hints, non-punitive error messaging',
            semanticMeaning:
              'Variant meanings: field=input association, hint=guidance, error=validation feedback, success=confirmation',
          },
          version: '1.0.0',
        },
      },
    },
    {
      $schema: 'https://ui.shadcn.com/schema/registry-item.json',
      name: 'tabs',
      type: 'registry:component',
      description: 'Tabbed interface component with keyboard navigation and ARIA compliance',
      dependencies: ['@radix-ui/react-tabs', 'class-variance-authority', 'clsx'],
      files: [
        {
          path: 'components/ui/tabs.tsx',
          type: 'registry:component',
          content: '',
        },
      ],
      meta: {
        rafters: {
          intelligence: {
            cognitiveLoad: 4,
            attentionEconomics:
              'Content organization: visible=current context, hidden=available contexts, active=user focus',
            accessibility:
              'Arrow key navigation, tab focus management, panel association, screen reader support',
            trustBuilding:
              'Persistent selection, clear active indication, predictable navigation patterns',
            semanticMeaning:
              'Structure: tablist=navigation, tab=option, tabpanel=content, selected=current view',
          },
          version: '1.0.0',
        },
      },
    },
  ];

  return { components };
}

export async function getComponent(name: string): Promise<ComponentManifest | null> {
  const registry = await getComponentRegistry();
  return registry.components.find((c) => c.name.toLowerCase() === name.toLowerCase()) || null;
}
