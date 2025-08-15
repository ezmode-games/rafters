import { z } from 'zod';

/**
 * Simple Ring System Schema that matches TokenSchema structure
 */

// Simple ring token matching the TokenSchema from index.ts
const RingTokenSchema = z.object({
  name: z.string(),
  value: z.string(),
  description: z.string().optional(),
  category: z.literal('ring'),
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

// Ring system for focus states and emphasis
export const RingSystemSchema = z.object({
  // Ring widths
  widthStandard: RingTokenSchema.default({
    name: '--ring-width-standard',
    value: '2px',
    description:
      'Standard ring width for focus states. Clear accessibility indication with medium cognitive load (3/10). High trust level ensures keyboard navigation visibility. AAA accessibility compliant.',
    category: 'ring',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 3,
      trustLevel: 'high',
      accessibilityLevel: 'aaa',
    },
  }),

  widthEnhanced: RingTokenSchema.default({
    name: '--ring-width-enhanced',
    value: '3px',
    description:
      'Enhanced ring width for prominent focus states. Stronger accessibility indication with higher cognitive load (4/10). High trust level draws attention to focus. Use for important interactive elements.',
    category: 'ring',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 4,
      trustLevel: 'high',
      consequence: 'significant',
      accessibilityLevel: 'aaa',
    },
  }),

  widthProminent: RingTokenSchema.default({
    name: '--ring-width-prominent',
    value: '4px',
    description:
      'Prominent ring width for critical focus states. Maximum accessibility indication with high cognitive load (6/10). Medium trust level warns of importance. Reserve for error states and destructive actions.',
    category: 'ring',
    type: 'static',
    semanticGroup: 'semantic-state',
    aiIntelligence: {
      cognitiveLoad: 6,
      trustLevel: 'medium',
      consequence: 'destructive',
      accessibilityLevel: 'aaa',
    },
  }),

  // Ring offsets
  offsetStandard: RingTokenSchema.default({
    name: '--ring-offset-standard',
    value: '2px',
    description:
      'Standard ring offset from element boundary. Provides clear separation with low cognitive load (2/10). High trust level ensures focus ring visibility against backgrounds.',
    category: 'ring',
    type: 'static',
    semanticGroup: 'core',
    aiIntelligence: {
      cognitiveLoad: 2,
      trustLevel: 'high',
      accessibilityLevel: 'aaa',
    },
  }),

  offsetEnhanced: RingTokenSchema.default({
    name: '--ring-offset-enhanced',
    value: '3px',
    description:
      'Enhanced ring offset for better visibility. Increased separation with medium cognitive load (3/10). High trust level ensures focus rings work on complex backgrounds.',
    category: 'ring',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 3,
      trustLevel: 'high',
      consequence: 'significant',
      accessibilityLevel: 'aaa',
    },
  }),

  // Ring opacities
  opacityStandard: RingTokenSchema.default({
    name: '--ring-opacity-standard',
    value: '0.5',
    description:
      'Standard ring opacity. Balanced visibility with medium cognitive load (3/10). High trust level provides clear focus indication without overwhelming. Default for most focus states.',
    category: 'ring',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 3,
      trustLevel: 'high',
      accessibilityLevel: 'aaa',
    },
  }),

  opacityEnhanced: RingTokenSchema.default({
    name: '--ring-opacity-enhanced',
    value: '0.7',
    description:
      'Enhanced ring opacity for increased visibility. Stronger indication with higher cognitive load (4/10). High trust level ensures focus is unmissable. Good for important form elements.',
    category: 'ring',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 4,
      trustLevel: 'high',
      consequence: 'significant',
      accessibilityLevel: 'aaa',
    },
  }),

  opacityProminent: RingTokenSchema.default({
    name: '--ring-opacity-prominent',
    value: '0.9',
    description:
      'Prominent ring opacity for maximum visibility. Very strong indication with high cognitive load (6/10). Medium trust level demands attention. Use for error states and critical warnings.',
    category: 'ring',
    type: 'static',
    semanticGroup: 'semantic-state',
    aiIntelligence: {
      cognitiveLoad: 6,
      trustLevel: 'medium',
      consequence: 'destructive',
      accessibilityLevel: 'aaa',
    },
  }),
});

export type RingSystem = z.infer<typeof RingSystemSchema>;
