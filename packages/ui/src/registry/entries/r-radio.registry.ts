import type { PrimitiveRegistryEntry } from '../types';
import { CognitiveLoadSchema } from '../types';

export const rRadioRegistryEntry: PrimitiveRegistryEntry = {
  name: 'r-radio',
  displayName: 'Radio',
  version: '0.1.0',
  status: 'published',

  sources: [
    {
      framework: 'lit',
      path: 'primitives/radio/r-radio.ts',
      exports: ['RRadio'],
    },
    {
      framework: 'react',
      path: 'components/Radio.tsx',
      exports: ['Radio'],
    },
  ],

  cognitiveLoad: CognitiveLoadSchema.parse(3),

  accessibility: {
    wcagLevel: 'AAA',
    ariaRole: 'radio',
    keyboardNavigation: [
      'Tab',
      'Shift+Tab',
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'Space',
    ],
    minimumTouchTarget: 44,
    contrastRequirement: {
      normalText: 7,
      largeText: 4.5,
    },
    screenReaderSupport: true,
    focusManagement:
      'Roving tabindex pattern - only one radio in group is tabbable. Arrow keys navigate within group.',
    announcements: 'Screen readers announce radio state changes (checked/unchecked)',
  },

  usageContext: {
    dos: [
      'Always provide a name attribute to group related radio buttons',
      'Always provide a value attribute for each radio option',
      'Use aria-label or associated label element for accessibility',
      'Group related radios together visually and in DOM order',
      'Ensure only one radio in a group can be checked at a time',
      'Use Space key to select, Arrow keys to navigate',
    ],
    donts: [
      'Never allow multiple radios with the same name to be checked',
      'Never use radio buttons for binary on/off choices (use checkbox instead)',
      'Never disable all options in a group',
      'Never use radio without a name attribute',
      'Never use radio without a value attribute',
    ],
    examples: [
      '<r-radio name="size" value="small">Small</r-radio>',
      '<r-radio name="size" value="medium" checked>Medium</r-radio>',
      '<r-radio name="size" value="large">Large</r-radio>',
      '<r-radio name="color" value="red" aria-label="Red color">Red</r-radio>',
      '<r-radio name="option" value="disabled" disabled>Unavailable</r-radio>',
    ],
  },

  rationale: {
    purpose:
      'Foundation primitive for single-selection choice inputs following W3C ARIA radio pattern with WCAG AAA compliance',
    attentionEconomics:
      'Low-moderate cognitive load (3/10) as radio buttons are familiar. Arrow key navigation pattern requires brief learning but is standard.',
    trustBuilding:
      'Clear visual state (checked/unchecked). Predictable single-selection behavior. Roving tabindex reduces tab stops. Proper ARIA for screen readers.',
    cognitiveLoadReasoning:
      'Rated 3/10 because radios are familiar but require understanding of group behavior. Arrow key navigation adds slight complexity over checkboxes.',
    designPrinciples: [
      'Single selection: Only one radio in a group can be checked at a time',
      'Keyboard navigation: Arrow keys navigate within group, Tab moves between groups',
      'Roving tabindex: Only one radio per group is in tab order',
      'Accessibility first: WCAG AAA with proper ARIA roles and keyboard support',
      'Group coordination: Radios communicate via DOM queries using name attribute',
    ],
    tradeoffs: [
      {
        decision: 'Use DOM queries to find radio group instead of parent container pattern',
        reasoning:
          'More flexible - radios can be anywhere in document with same name. No wrapper component required. Follows native radio behavior.',
      },
      {
        decision: 'Use roving tabindex instead of making all radios tabbable',
        reasoning:
          'Reduces number of tab stops. Matches native radio group behavior. Arrow keys provide efficient navigation within group.',
      },
      {
        decision:
          'Auto-uncheck other radios on selection instead of requiring external state management',
        reasoning:
          'Simpler API. Radios are inherently stateful for single-selection. Matches native radio behavior. AI agents can rely on built-in behavior.',
      },
    ],
  },

  dependencies: [],
  npmDependencies: [{ name: 'lit', version: '^3.0.0', optional: false }],

  category: 'form',
  tags: ['form', 'radio', 'single-selection', 'wcag-aaa', 'keyboard-navigation'],

  description:
    'Headless radio button primitive with ARIA support, keyboard navigation, and single-selection group behavior',
  docsUrl: 'https://rafters.realhandy.tech/docs/primitives/r-radio',

  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
