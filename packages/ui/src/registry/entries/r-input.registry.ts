import type { PrimitiveRegistryEntry } from '../types';
import { CognitiveLoadSchema } from '../types';

export const rInputRegistryEntry: PrimitiveRegistryEntry = {
  name: 'r-input',
  displayName: 'Input',
  version: '0.1.0',
  status: 'published',

  sources: [
    {
      framework: 'lit',
      path: 'primitives/input/r-input.ts',
      exports: ['RInput'],
    },
    {
      framework: 'react',
      path: 'components/Input.tsx',
      exports: ['Input'],
    },
  ],

  cognitiveLoad: CognitiveLoadSchema.parse(2),

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
      'Pass variant and validationMessage to show errors with Rafters design patterns',
      'Use appropriate input type (email, tel, url) for better mobile keyboards',
      'Provide placeholder text as hints, not as labels',
      'Use schema prop with InputSchemas for automatic masking',
      'Use inputmode attribute to optimize mobile keyboard display',
    ],
    donts: [
      'Never use placeholder as the only label (fails WCAG)',
      'Never disable autocomplete without user consent',
      'Never create custom error UI (use Rafters variant/validationMessage)',
      'Never use red color alone to indicate errors',
    ],
    examples: [
      '<r-input value="" placeholder="Enter your name"></r-input>',
      '<r-input type="email" required pattern="[^@]+@[^@]+\\.[^@]+"></r-input>',
      '<r-input value="Read only" disabled></r-input>',
      '<Input schema={InputSchemas.phoneUS} placeholder="Phone number" />',
      '<Input variant="error" validationMessage="Email is required" />',
      '<Input mask="(000) 000-0000" inputmode="tel" placeholder="Phone" />',
      '<Input variant="success" validationMessage="Email verified!" />',
    ],
  },

  rationale: {
    purpose: 'Foundation primitive for all text-based user input with embedded design intelligence',
    attentionEconomics:
      'Low cognitive load (2/10) as text inputs are universally understood. Validation messages use Rafters trust-building patterns.',
    trustBuilding:
      'Visual feedback through variant styling. Error messages with proper ARIA. Sensitive data indicators. Respects user input.',
    cognitiveLoadReasoning:
      'Rated 2/10 because inputs are familiar UI patterns. Design intelligence handles validation presentation - AI agents control timing.',
    designPrinciples: [
      'Design intelligence: Input shows HOW to display errors, AI agents decide WHEN',
      'Trust building: Clear feedback with proper ARIA and visual indicators',
      'Accessibility first: WCAG AAA with proper semantic markup',
      'Mobile-friendly: Appropriate input types trigger correct keyboards',
    ],
    tradeoffs: [
      {
        decision: 'Render validation message when provided, no conditional logic',
        reasoning:
          'Design intelligence layer controls presentation. Application logic (InputGroup) controls behavior. Clear separation of concerns.',
      },
      {
        decision: 'Use native input element with Rafters design patterns',
        reasoning:
          'Maximum browser compatibility. Rafters styling encodes trust-building patterns for AI agents to learn from.',
      },
    ],
  },

  dependencies: [],
  npmDependencies: [
    { name: 'lit', version: '^3.0.0', optional: false },
    { name: 'masky-js', version: '^1.0.0', optional: false },
  ],

  category: 'form',
  tags: ['form', 'text-input', 'wcag-aaa', 'validation'],

  description: 'Headless text input primitive with validation states and ARIA support',
  docsUrl: 'https://rafters.realhandy.tech/docs/primitives/r-input',

  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
