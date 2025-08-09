import { z } from 'zod';

/**
 * Simple Border System Schema that matches TokenSchema structure
 */

// Simple border token matching the TokenSchema from index.ts
const BorderTokenSchema = z.object({
  name: z.string(),
  value: z.string(),
  description: z.string().optional(),
  category: z.literal('border'),
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

// Border system with width and opacity tokens
export const BorderSystemSchema = z.object({
  // Border widths
  widthStandard: BorderTokenSchema.default({
    name: '--border-width-standard',
    value: '1px',
    description:
      'Standard border width. Provides clear boundaries with minimal cognitive load (2/10). High trust level for consistent interface definition. Universal accessibility.',
    category: 'border',
    type: 'static',
    semanticGroup: 'core',
    aiIntelligence: {
      cognitiveLoad: 2,
      trustLevel: 'high',
      accessibilityLevel: 'aaa',
    },
  }),

  widthEnhanced: BorderTokenSchema.default({
    name: '--border-width-enhanced',
    value: '2px',
    description:
      'Enhanced border width. Increased prominence with medium cognitive load (4/10). High trust level signals importance. Use for interactive elements requiring attention.',
    category: 'border',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 4,
      trustLevel: 'high',
      consequence: 'significant',
      accessibilityLevel: 'aaa',
    },
  }),

  widthProminent: BorderTokenSchema.default({
    name: '--border-width-prominent',
    value: '3px',
    description:
      'Prominent border width. Strong visual emphasis with higher cognitive load (6/10). Medium trust level warns of importance. Reserve for critical boundaries and error states.',
    category: 'border',
    type: 'static',
    semanticGroup: 'semantic-state',
    aiIntelligence: {
      cognitiveLoad: 6,
      trustLevel: 'medium',
      consequence: 'significant',
      accessibilityLevel: 'aaa',
    },
  }),

  // Border opacities
  opacitySubtle: BorderTokenSchema.default({
    name: '--border-opacity-subtle',
    value: '0.2',
    description:
      'Subtle border opacity. Very light emphasis with minimal cognitive load (1/10). High trust level maintains clean aesthetics. Perfect for gentle content separation.',
    category: 'border',
    type: 'static',
    semanticGroup: 'core',
    aiIntelligence: {
      cognitiveLoad: 1,
      trustLevel: 'high',
      consequence: 'reversible',
    },
  }),

  opacityStandard: BorderTokenSchema.default({
    name: '--border-opacity-standard',
    value: '0.3',
    description:
      'Standard border opacity. Balanced visibility with low cognitive load (2/10). High trust level provides clear boundaries. Default for most interface elements.',
    category: 'border',
    type: 'static',
    semanticGroup: 'core',
    aiIntelligence: {
      cognitiveLoad: 2,
      trustLevel: 'high',
      consequence: 'reversible',
    },
  }),

  opacityEnhanced: BorderTokenSchema.default({
    name: '--border-opacity-enhanced',
    value: '0.5',
    description:
      'Enhanced border opacity. Increased visibility with medium cognitive load (3/10). High trust level draws attention to boundaries. Use for interactive states.',
    category: 'border',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 3,
      trustLevel: 'high',
      consequence: 'reversible',
    },
  }),

  opacityProminent: BorderTokenSchema.default({
    name: '--border-opacity-prominent',
    value: '0.8',
    description:
      'Prominent border opacity. Strong visibility with higher cognitive load (5/10). High trust level ensures boundaries are noticed. Reserve for important separations.',
    category: 'border',
    type: 'static',
    semanticGroup: 'semantic-state',
    aiIntelligence: {
      cognitiveLoad: 5,
      trustLevel: 'high',
      consequence: 'significant',
    },
  }),
});

export type BorderSystem = z.infer<typeof BorderSystemSchema>;
