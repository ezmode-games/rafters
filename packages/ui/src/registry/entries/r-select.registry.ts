import type { PrimitiveRegistryEntry } from '../types';
import { CognitiveLoadSchema } from '../types';

export const rSelectRegistryEntry: PrimitiveRegistryEntry = {
  name: 'r-select',
  displayName: 'Select',
  version: '0.1.0',
  status: 'published',

  sources: [
    {
      framework: 'lit',
      path: 'primitives/select/r-select.ts',
      exports: ['RSelect'],
    },
  ],

  cognitiveLoad: CognitiveLoadSchema.parse(4),

  accessibility: {
    wcagLevel: 'AAA',
    ariaRole: 'listbox',
    keyboardNavigation: [
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
      'Enter',
      'Space',
      'Tab',
      'Shift+Tab',
    ],
    minimumTouchTarget: 44,
    contrastRequirement: {
      normalText: 7,
      largeText: 4.5,
    },
    screenReaderSupport: true,
    focusManagement:
      'Listbox with aria-activedescendant tracking. Options use role="option" with aria-selected state.',
  },

  usageContext: {
    dos: [
      'Always provide aria-label or aria-labelledby for the select',
      'Use data-value attribute on options for consistent value handling',
      'Set multiple attribute for multi-selection mode',
      'Provide clear option labels that are screen reader friendly',
      'Use slot="option" on all option elements',
      'Ensure minimum 44px touch target height for WCAG AAA compliance',
    ],
    donts: [
      'Never omit aria-label or aria-labelledby (fails WCAG)',
      'Never use without keyboard navigation (fails WCAG 2.1.1)',
      'Never make options too small (fails WCAG 2.5.5 AAA)',
      'Never use color alone to indicate selection state',
      'Never nest interactive elements inside options',
    ],
    examples: [
      '<r-select aria-label="Choose fruit"><div slot="option" data-value="apple">Apple</div></r-select>',
      '<r-select multiple aria-label="Select colors"><div slot="option" data-value="red">Red</div></r-select>',
      '<r-select disabled aria-label="Unavailable"><div slot="option" data-value="x">N/A</div></r-select>',
      '<r-select name="country" aria-label="Select country"><div slot="option" data-value="us">USA</div></r-select>',
    ],
  },

  rationale: {
    purpose:
      'Foundation primitive for single or multiple selection from a list following W3C ARIA listbox pattern with WCAG AAA compliance',
    attentionEconomics:
      'Moderate cognitive load (4/10) as selects require users to scan options and make decisions. Clear visual hierarchy and keyboard navigation reduce cognitive burden.',
    trustBuilding:
      'Visual feedback through aria-selected state. Keyboard navigation follows ARIA APG patterns. Clear focus indicators build user confidence.',
    cognitiveLoadReasoning:
      'Rated 4/10 because selecting from options requires mental processing to compare choices. ARIA patterns and keyboard shortcuts help experienced users, but scanning options always requires attention.',
    designPrinciples: [
      'ARIA Authoring Practices: Follows W3C ARIA listbox pattern precisely',
      'Keyboard navigation: Arrow keys, Home/End, Space/Enter for complete keyboard access',
      'Accessibility first: WCAG AAA with proper ARIA roles and states',
      'Flexible selection: Supports both single and multiple selection modes',
    ],
    tradeoffs: [
      {
        decision: 'Use aria-activedescendant instead of roving tabindex',
        reasoning:
          'ARIA listbox pattern recommends activedescendant for screen reader compatibility. Container stays focusable while tracking active option via ARIA.',
      },
      {
        decision: 'Slot-based architecture for options',
        reasoning:
          'Allows maximum flexibility in option rendering while maintaining semantic structure. Primitive manages ARIA attributes, consumers control presentation.',
      },
      {
        decision: 'Comma-separated value string for multiple selection',
        reasoning:
          'Simple API that works with form serialization. Primitive handles parsing internally while exposing clean event data.',
      },
    ],
  },

  dependencies: [],
  npmDependencies: [{ name: 'lit', version: '^3.0.0', optional: false }],

  category: 'form',
  tags: ['form', 'select', 'listbox', 'wcag-aaa', 'aria', 'keyboard-navigation'],

  description:
    'Headless select primitive with ARIA listbox pattern supporting single and multiple selection modes with WCAG AAA compliance',
  docsUrl: 'https://rafters.realhandy.tech/docs/primitives/r-select',

  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
