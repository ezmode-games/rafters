import type { PrimitiveRegistryEntry } from '../types';
import { CognitiveLoadSchema } from '../types';

export const rDatepickerRegistryEntry: PrimitiveRegistryEntry = {
  name: 'r-datepicker',
  displayName: 'Datepicker',
  version: '0.1.0',
  status: 'published',

  sources: [
    {
      framework: 'lit',
      path: 'primitives/datepicker/r-datepicker.ts',
      exports: ['RDatepicker'],
    },
  ],

  cognitiveLoad: CognitiveLoadSchema.parse(5),

  accessibility: {
    wcagLevel: 'AAA',
    ariaRole: 'grid',
    keyboardNavigation: [
      'Tab',
      'Shift+Tab',
      'Enter',
      'Space',
      'Escape',
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
      'PageUp',
      'PageDown',
    ],
    minimumTouchTarget: 44,
    contrastRequirement: {
      normalText: 7,
      largeText: 4.5,
    },
    screenReaderSupport: true,
    focusManagement:
      'Grid-based focus management with roving tabindex. Arrow keys navigate dates, Enter/Space selects.',
  },

  usageContext: {
    dos: [
      'Use for single date selection with calendar UI',
      'Provide aria-label for accessible button text',
      'Use min/max props to constrain selectable date range',
      'Use ISO format (YYYY-MM-DD) for value, min, and max',
      'Provide name prop for form integration',
      'Ensure toggle button meets 44px touch target minimum',
    ],
    donts: [
      'Never use for date range selection (use DateRangePicker React component)',
      'Never use custom date formats (ISO only)',
      'Never disable keyboard navigation',
      'Never remove ARIA attributes from grid structure',
      'Never implement date range logic in primitive (React component responsibility)',
    ],
    examples: [
      '<r-datepicker value="2024-03-15"></r-datepicker>',
      '<r-datepicker expanded min="2024-01-01" max="2024-12-31"></r-datepicker>',
      '<r-datepicker name="appointment-date" value=""></r-datepicker>',
      '<r-datepicker disabled aria-label="Select appointment date"></r-datepicker>',
    ],
  },

  rationale: {
    purpose:
      'Foundation primitive for single date selection following W3C ARIA date picker pattern with WCAG AAA compliance',
    attentionEconomics:
      'Medium cognitive load (5/10) - calendar grids require spatial navigation. Clear visual hierarchy with today indicator and selected state.',
    trustBuilding:
      'Follows familiar calendar pattern. Visual feedback for selection. Keyboard navigation follows ARIA APG standard. Respects date constraints.',
    cognitiveLoadReasoning:
      'Rated 5/10 because calendar navigation requires understanding grid layout and keyboard patterns. Design intelligence provides clear focus indicators and selection feedback.',
    designPrinciples: [
      'ARIA APG compliance: Implements standard date picker dialog pattern',
      'Keyboard-first: Full keyboard navigation with arrow keys, Enter, Escape',
      'Touch-friendly: 44px minimum touch targets for WCAG AAA',
      'Single responsibility: Handles single date selection only (ranges are React concern)',
      'Form integration: Hidden input with name/value for form submission',
    ],
    tradeoffs: [
      {
        decision: 'Grid role for calendar instead of button grid',
        reasoning:
          'W3C ARIA APG specifies grid pattern for date pickers. Provides semantic structure for screen readers and standard keyboard navigation.',
      },
      {
        decision: 'Single date selection only, no range support',
        reasoning:
          'Primitive handles atomic date selection. Date ranges require complex state management best handled by React components (DateRangePicker).',
      },
      {
        decision: 'ISO date format (YYYY-MM-DD) only',
        reasoning:
          'Unambiguous format for international use. Formatting/localization is presentation layer concern (React components).',
      },
      {
        decision: 'Dialog modal pattern for calendar',
        reasoning:
          'Matches user expectations and W3C pattern. Ensures focus management and keyboard trap within calendar.',
      },
    ],
  },

  dependencies: [],
  npmDependencies: [{ name: 'lit', version: '^3.0.0', optional: false }],

  category: 'form',
  tags: ['form', 'date-input', 'calendar', 'wcag-aaa', 'aria-grid'],

  description:
    'Headless datepicker primitive with ARIA grid pattern, keyboard navigation, and single date selection',
  docsUrl: 'https://rafters.realhandy.tech/docs/primitives/r-datepicker',

  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
