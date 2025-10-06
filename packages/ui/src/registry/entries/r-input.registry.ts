import type { PrimitiveRegistryEntry } from '../types';

export const rInputRegistryEntry: PrimitiveRegistryEntry = {
  name: 'r-input',
  displayName: 'Input',
  version: '0.1.0',
  status: 'published',

  sources: [
    {
      framework: 'lit',
      path: 'primitives/input/r-input.ts',
      language: 'typescript',
    },
    {
      framework: 'react',
      path: 'components/Input.tsx',
      language: 'typescript',
    },
  ],

  cognitiveLoad: 2 as const,

  accessibility: {
    wcagLevel: 'AAA',
    ariaRole: 'textbox',
    keyboardNavigation: ['Tab', 'Shift+Tab', 'Enter'],
    minimumTouchTarget: 44,
    contrastRequirement: {
      normalText: 7,
      largeText: 4.5,
    },
    screenReaderSupport: true,
    focusManagement: 'Standard input focus with visible ring indicator',
  },

  usageContext: {
    dos: [
      'Always provide clear labels using aria-label or associated label element',
      'Show validation errors immediately on blur for better UX',
      'Use appropriate input type (email, tel, url) for better mobile keyboards',
      'Provide placeholder text as hints, not as labels',
    ],
    donts: [
      'Never use placeholder as the only label (fails WCAG)',
      'Never disable autocomplete without user consent',
      'Never validate on every keystroke (cognitive overload)',
      'Never use red color alone to indicate errors',
    ],
    examples: [
      {
        title: 'Basic text input',
        code: '<r-input value="" placeholder="Enter your name"></r-input>',
        framework: 'lit',
      },
      {
        title: 'Email input with validation',
        code: '<r-input type="email" required pattern="[^@]+@[^@]+\\.[^@]+"></r-input>',
        framework: 'lit',
      },
      {
        title: 'Disabled input',
        code: '<r-input value="Read only" disabled></r-input>',
        framework: 'lit',
      },
    ],
  },

  rationale: {
    purpose: 'Foundation primitive for all text-based user input',
    attentionEconomics:
      'Low cognitive load (2/10) as text inputs are universally understood. Validation shown on blur prevents keystroke-level anxiety.',
    trustBuilding:
      'Immediate visual feedback on validation state. Clear error messages. Respects user input (no auto-correction unless explicit).',
    cognitiveLoadReasoning:
      'Rated 2/10 because inputs are familiar UI patterns. Validation adds minimal complexity when shown at appropriate times (blur, not keystroke).',
    designPrinciples: [
      'Progressive disclosure: Validation shown when needed',
      'Trust building: Clear feedback without nagging',
      'Accessibility first: WCAG AAA with proper ARIA',
      'Mobile-friendly: Appropriate input types trigger correct keyboards',
    ],
    tradeoffs: [
      {
        decision: 'Validate on blur, not on input',
        reasoning:
          'Prevents cognitive overload from real-time validation. Users can type freely without anxiety. Shows errors at natural pause points.',
      },
      {
        decision: 'Use native input element with CSS parts',
        reasoning:
          'Maximum browser compatibility and form integration. CSS parts allow full styling without Shadow DOM piercing issues.',
      },
    ],
  },

  dependencies: [],
  npmDependencies: ['lit'],

  category: 'input',
  tags: ['form', 'text-input', 'wcag-aaa', 'validation'],

  description: 'Headless text input primitive with validation states and ARIA support',
  docsUrl: 'https://rafters.realhandy.tech/docs/primitives/r-input',

  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
