import type { PrimitiveRegistryEntry } from '../types';
import { CognitiveLoadSchema } from '../types';

export const rSwitchRegistryEntry: PrimitiveRegistryEntry = {
  name: 'r-switch',
  displayName: 'Switch',
  version: '0.1.0',
  status: 'published',

  sources: [
    {
      framework: 'lit',
      path: 'primitives/switch/r-switch.ts',
      exports: ['RSwitch'],
    },
    {
      framework: 'react',
      path: 'components/Switch.tsx',
      exports: ['Switch'],
    },
  ],

  cognitiveLoad: CognitiveLoadSchema.parse(3),

  accessibility: {
    wcagLevel: 'AAA',
    ariaRole: 'switch',
    keyboardNavigation: ['Tab', 'Shift+Tab', 'Space'],
    minimumTouchTarget: 44,
    contrastRequirement: {
      normalText: 7,
      largeText: 4.5,
    },
    screenReaderSupport: true,
    focusManagement: 'Standard focus with visible ring indicator, maintains focus after toggle',
  },

  usageContext: {
    dos: [
      'Always provide clear labels using aria-label or associated label element',
      'Use for binary on/off states that take immediate effect',
      'Provide visual feedback for both on and off states',
      'Ensure minimum 44x44px touch target for WCAG AAA compliance',
      'Use descriptive labels that indicate the state being controlled',
      'Group related switches with appropriate headings or fieldsets',
    ],
    donts: [
      'Never use for actions that require confirmation (use button instead)',
      'Never use placeholder as the only label (fails WCAG)',
      'Never use color alone to indicate state (provide text or icons)',
      'Never create multi-step processes with switches alone',
      'Never disable switches without clear explanation',
    ],
    examples: [
      '<r-switch>Enable notifications</r-switch>',
      '<r-switch checked>Dark mode enabled</r-switch>',
      '<r-switch disabled>Cannot change this setting</r-switch>',
      '<r-switch name="notifications" value="enabled">Email notifications</r-switch>',
      '<r-switch aria-label="Toggle automatic updates">Auto-update</r-switch>',
    ],
  },

  rationale: {
    purpose: 'Binary on/off control following W3C ARIA switch pattern for immediate state changes',
    attentionEconomics:
      'Low cognitive load (3/10) as switches are familiar mobile UI patterns. Clear visual state indicators reduce cognitive burden.',
    trustBuilding:
      'Immediate visual feedback on state changes. ARIA attributes provide clear state to screen readers. Space key only (not Enter) follows switch pattern correctly.',
    cognitiveLoadReasoning:
      'Rated 3/10 because switches are familiar UI patterns from mobile devices. Single action (Space) to toggle reduces complexity. Binary states are easy to understand.',
    designPrinciples: [
      'Follow W3C ARIA switch pattern precisely - Space key only, not Enter',
      'Immediate feedback: State changes happen instantly without confirmation',
      'Binary clarity: Only two states (on/off) with clear visual distinction',
      'Accessibility first: WCAG AAA with proper ARIA roles and keyboard support',
      'Touch-friendly: 44x44px minimum touch target for mobile users',
    ],
    tradeoffs: [
      {
        decision: 'Use Space key only for toggle, not Enter',
        reasoning:
          'W3C ARIA switch pattern specifies Space key only. Enter is reserved for buttons and form submission. This distinction helps users understand the interaction model.',
      },
      {
        decision: 'No confirmation dialog on toggle',
        reasoning:
          'Switches represent immediate state changes. For actions requiring confirmation, use a button instead. This keeps the interaction model consistent and predictable.',
      },
      {
        decision: 'Simple checked/unchecked state with no intermediate states',
        reasoning:
          'Binary states are cognitively simpler. For multi-state selections, use radio buttons or select elements instead.',
      },
    ],
  },

  dependencies: [],
  npmDependencies: [{ name: 'lit', version: '^3.0.0', optional: false }],

  category: 'form',
  tags: ['form', 'switch', 'toggle', 'wcag-aaa', 'binary-state'],

  description:
    'Headless switch primitive for binary on/off states with WCAG AAA accessibility following W3C ARIA switch pattern',
  docsUrl: 'https://rafters.realhandy.tech/docs/primitives/r-switch',

  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
