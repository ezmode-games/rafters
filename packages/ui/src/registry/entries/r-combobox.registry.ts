import type { PrimitiveRegistryEntry } from '../types';
import { CognitiveLoadSchema } from '../types';

export const rComboboxRegistryEntry: PrimitiveRegistryEntry = {
  name: 'r-combobox',
  displayName: 'Combobox',
  version: '0.1.0',
  status: 'published',

  sources: [
    {
      framework: 'lit',
      path: 'primitives/combobox/r-combobox.ts',
      exports: ['RCombobox'],
    },
  ],

  cognitiveLoad: CognitiveLoadSchema.parse(5),

  accessibility: {
    wcagLevel: 'AAA',
    ariaRole: 'combobox',
    keyboardNavigation: [
      'Tab',
      'Shift+Tab',
      'ArrowDown',
      'ArrowUp',
      'Enter',
      'Escape',
      'Home',
      'End',
    ],
    minimumTouchTarget: 44,
    contrastRequirement: {
      normalText: 7,
      largeText: 4.5,
    },
    screenReaderSupport: true,
    focusManagement: 'Active option tracked via aria-activedescendant with keyboard navigation',
  },

  usageContext: {
    dos: [
      'Always provide aria-label or aria-labelledby for screen readers',
      'Use role="option" on all selectable items in the listbox',
      'Provide visual feedback for the currently focused option',
      "Keep option lists to 7±2 items when possible (Miller's Law)",
      'Group related options with meaningful categories for larger lists',
      'Use the expanded property to control listbox visibility',
    ],
    donts: [
      'Never use without accessible labels',
      'Never mix combobox with standard select for single-choice scenarios',
      'Never disable keyboard navigation',
      'Never rely on color alone to indicate the active option',
      'Never implement custom filtering logic in the primitive (use React component layer)',
    ],
    examples: [
      '<r-combobox value="" placeholder="Select option"><div slot="listbox" role="listbox"><div role="option">Option 1</div></div></r-combobox>',
      '<r-combobox aria-label="Country" expanded><div slot="listbox" role="listbox"><div role="option">USA</div><div role="option">Canada</div></div></r-combobox>',
      '<r-combobox disabled placeholder="Loading..."></r-combobox>',
      '<r-combobox name="country" value="USA"></r-combobox>',
    ],
  },

  rationale: {
    purpose:
      'Foundation primitive for searchable selection controls following W3C ARIA combobox pattern',
    attentionEconomics:
      'Medium cognitive load (5/10) as comboboxes require understanding of both input and selection. Progressive disclosure reduces initial cognitive load by hiding options until needed.',
    trustBuilding:
      'Clear keyboard navigation patterns. Visual feedback for active options. Proper ARIA attributes for screen readers. Respects user input with autocomplete disabled.',
    cognitiveLoadReasoning:
      'Rated 5/10 because comboboxes combine input and selection interactions. Design intelligence handles ARIA management and keyboard navigation - React components control filtering and option rendering.',
    designPrinciples: [
      'ARIA compliance: Follows W3C ARIA combobox pattern with proper roles and attributes',
      'Keyboard first: Full keyboard navigation with Arrow keys, Enter, Escape, Home, and End',
      'Accessibility first: WCAG AAA with proper focus management and screen reader support',
      'Separation of concerns: Primitive handles interaction, React components handle filtering',
    ],
    tradeoffs: [
      {
        decision: 'No built-in filtering logic in the primitive',
        reasoning:
          'Filtering logic belongs in the React component layer. Primitive focuses on ARIA compliance and keyboard navigation.',
      },
      {
        decision: 'Use aria-activedescendant for active option management',
        reasoning:
          'Following W3C ARIA pattern. Enables proper screen reader announcements without moving DOM focus.',
      },
      {
        decision: 'Slot-based listbox for maximum flexibility',
        reasoning:
          'Allows consuming components to control option rendering and styling while primitive manages interactions.',
      },
    ],
  },

  dependencies: [],
  npmDependencies: [{ name: 'lit', version: '^3.0.0', optional: false }],

  category: 'form',
  tags: ['form', 'combobox', 'select', 'wcag-aaa', 'aria', 'keyboard-navigation'],

  description:
    'Headless combobox primitive following W3C ARIA pattern with keyboard navigation and screen reader support',
  docsUrl: 'https://rafters.realhandy.tech/docs/primitives/r-combobox',

  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
