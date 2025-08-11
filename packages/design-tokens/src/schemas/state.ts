import { z } from 'zod';

/**
 * Simple State System Schema that matches TokenSchema structure
 */

// Simple state token matching the TokenSchema from index.ts
const StateTokenSchema = z.object({
  name: z.string(),
  value: z.string(),
  description: z.string().optional(),
  category: z.literal('state'),
  type: z.enum(['static', 'dynamic']),
  semanticGroup: z.enum(['core', 'brand', 'interactive', 'semantic-state', 'component']).optional(),
  aiIntelligence: z
    .object({
      cognitiveLoad: z.number().min(1).max(10).optional(),
      trustLevel: z.enum(['low', 'medium', 'high']).optional(),
      accessibilityLevel: z.enum(['aa', 'aaa']).optional(),
      consequence: z.enum(['reversible', 'significant', 'permanent', 'destructive']).optional(),
      sensitivity: z.enum(['public', 'personal', 'financial', 'critical']).optional(),
    })
    .optional(),
});

// State system with opacity and timing tokens
export const StateSystemSchema = z.object({
  // Opacity states
  hover: StateTokenSchema.default({
    name: '--opacity-hover',
    value: '0.9',
    description:
      'Hover state opacity. Provides subtle feedback with low cognitive load (2/10). High trust level ensures predictable behavior. Reversible consequence allows safe exploration.',
    category: 'state',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 2,
      trustLevel: 'high',
      consequence: 'reversible',
    },
  }),

  active: StateTokenSchema.default({
    name: '--opacity-active',
    value: '0.95',
    description:
      'Active state opacity. Confirms user interaction with medium cognitive load (3/10). High trust level provides clear feedback. Reversible consequence maintains user confidence.',
    category: 'state',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 3,
      trustLevel: 'high',
      consequence: 'reversible',
    },
  }),

  disabled: StateTokenSchema.default({
    name: '--opacity-disabled',
    value: '0.6',
    description:
      'Disabled state opacity. Clearly communicates unavailability with higher cognitive load (5/10). High trust level shows system state honestly. Significant consequence prevents user frustration.',
    category: 'state',
    type: 'static',
    semanticGroup: 'semantic-state',
    aiIntelligence: {
      cognitiveLoad: 5,
      trustLevel: 'high',
      consequence: 'significant',
    },
  }),

  // NOTE: Timing tokens moved to motion/timing.ts for better semantic organization
  // These are kept for backwards compatibility and will be deprecated

  // Additional opacity states
  hoverSubtle: StateTokenSchema.default({
    name: '--opacity-hover-subtle',
    value: '0.95',
    description:
      'Subtle hover opacity. Very gentle feedback with minimal cognitive load (1/10). High trust level maintains subtlety. Perfect for low-emphasis interactions.',
    category: 'state',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 1,
      trustLevel: 'high',
      consequence: 'reversible',
    },
  }),

  hoverEnhanced: StateTokenSchema.default({
    name: '--opacity-hover-enhanced',
    value: '0.85',
    description:
      'Enhanced hover opacity. Stronger feedback with medium cognitive load (4/10). High trust level provides clear interaction cues. For prominent interactive elements.',
    category: 'state',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 4,
      trustLevel: 'high',
      consequence: 'reversible',
    },
  }),

  hoverCritical: StateTokenSchema.default({
    name: '--opacity-hover-critical',
    value: '0.8',
    description:
      'Critical hover opacity. Strong feedback with high cognitive load (6/10). Medium trust level warns of importance. Use for destructive or high-consequence actions.',
    category: 'state',
    type: 'static',
    semanticGroup: 'semantic-state',
    aiIntelligence: {
      cognitiveLoad: 6,
      trustLevel: 'medium',
      consequence: 'significant',
    },
  }),

  loading: StateTokenSchema.default({
    name: '--opacity-loading',
    value: '0.8',
    description:
      'Loading state opacity. Communicates processing with medium cognitive load (4/10). High trust level shows system is working. Reassures users during wait states.',
    category: 'state',
    type: 'static',
    semanticGroup: 'semantic-state',
    aiIntelligence: {
      cognitiveLoad: 4,
      trustLevel: 'high',
      consequence: 'reversible',
    },
  }),

  // Additional duration tokens - DEPRECATED: Use motion/timing.ts instead

  // Delay tokens
  delayNone: StateTokenSchema.default({
    name: '--delay-none',
    value: '0ms',
    description:
      'No delay. Immediate action with minimal cognitive load (1/10). High trust level enables instant interaction. Default for most user actions.',
    category: 'state',
    type: 'static',
    semanticGroup: 'core',
    aiIntelligence: {
      cognitiveLoad: 1,
      trustLevel: 'high',
      consequence: 'reversible',
    },
  }),

  delayBrief: StateTokenSchema.default({
    name: '--delay-brief',
    value: '200ms',
    description:
      'Brief delay. Short pause with low cognitive load (2/10). High trust level prevents accidental actions. Ideal for hover confirmations.',
    category: 'state',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 2,
      trustLevel: 'high',
      consequence: 'reversible',
    },
  }),

  delayStandard: StateTokenSchema.default({
    name: '--delay-standard',
    value: '300ms',
    description:
      'Standard delay. Comfortable pause with medium cognitive load (3/10). High trust level balances speed and safety. Good for dropdown menus.',
    category: 'state',
    type: 'static',
    semanticGroup: 'core',
    aiIntelligence: {
      cognitiveLoad: 3,
      trustLevel: 'high',
      consequence: 'reversible',
    },
  }),

  delayDeliberate: StateTokenSchema.default({
    name: '--delay-deliberate',
    value: '500ms',
    description:
      'Deliberate delay. Intentional pause with higher cognitive load (5/10). High trust level forces consideration. Use for important confirmations.',
    category: 'state',
    type: 'static',
    semanticGroup: 'semantic-state',
    aiIntelligence: {
      cognitiveLoad: 5,
      trustLevel: 'high',
      consequence: 'significant',
    },
  }),

  delayCautious: StateTokenSchema.default({
    name: '--delay-cautious',
    value: '1000ms',
    description:
      'Cautious delay. Extended pause with high cognitive load (8/10). Medium trust level may frustrate users. Reserve for destructive actions requiring confirmation.',
    category: 'state',
    type: 'static',
    semanticGroup: 'semantic-state',
    aiIntelligence: {
      cognitiveLoad: 8,
      trustLevel: 'medium',
      consequence: 'destructive',
    },
  }),

  // Scaling tokens
  scaleActive: StateTokenSchema.default({
    name: '--scale-active',
    value: '0.98',
    description:
      'Active scale. Subtle press feedback with low cognitive load (2/10). High trust level confirms interaction. Standard for button press states.',
    category: 'state',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 2,
      trustLevel: 'high',
      consequence: 'reversible',
    },
  }),

  scalePressed: StateTokenSchema.default({
    name: '--scale-pressed',
    value: '0.96',
    description:
      'Pressed scale. Stronger press feedback with medium cognitive load (3/10). High trust level provides tactile sensation. Enhanced for important buttons.',
    category: 'state',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 3,
      trustLevel: 'high',
      consequence: 'reversible',
    },
  }),

  scaleHoverSubtle: StateTokenSchema.default({
    name: '--scale-hover-subtle',
    value: '1.01',
    description:
      'Subtle hover scale. Gentle growth effect with low cognitive load (2/10). High trust level suggests interactivity. Perfect for card hover states.',
    category: 'state',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 2,
      trustLevel: 'high',
      consequence: 'reversible',
    },
  }),
});

export type StateSystem = z.infer<typeof StateSystemSchema>;
