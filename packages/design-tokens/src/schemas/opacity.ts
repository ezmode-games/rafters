import { z } from 'zod';

/**
 * Simple Opacity System Schema that matches TokenSchema structure
 */

// Simple opacity token matching the TokenSchema from index.ts
const OpacityTokenSchema = z.object({
  name: z.string(),
  value: z.string(),
  description: z.string().optional(),
  category: z.literal('opacity'),
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

// Opacity system for background alpha values and transparency
export const OpacitySystemSchema = z.object({
  // Background alpha values for layering
  bgSubtle: OpacityTokenSchema.default({
    name: '--alpha-bg-subtle',
    value: '0.05',
    description:
      'Subtle background alpha. Very light overlay with minimal cognitive load (1/10). High trust level maintains readability. Perfect for gentle background tints.',
    category: 'opacity',
    type: 'static',
    semanticGroup: 'core',
    aiIntelligence: {
      cognitiveLoad: 1,
      trustLevel: 'high',
      accessibilityLevel: 'aaa',
    },
  }),

  bgStandard: OpacityTokenSchema.default({
    name: '--alpha-bg-standard',
    value: '0.1',
    description:
      'Standard background alpha. Balanced overlay with low cognitive load (2/10). High trust level provides clear layering. Default for most background applications.',
    category: 'opacity',
    type: 'static',
    semanticGroup: 'core',
    aiIntelligence: {
      cognitiveLoad: 2,
      trustLevel: 'high',
      accessibilityLevel: 'aaa',
    },
  }),

  bgEnhanced: OpacityTokenSchema.default({
    name: '--alpha-bg-enhanced',
    value: '0.15',
    description:
      'Enhanced background alpha. Stronger overlay with medium cognitive load (3/10). High trust level draws attention to layered content. Good for highlighted areas.',
    category: 'opacity',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 3,
      trustLevel: 'high',
      consequence: 'reversible',
    },
  }),

  bgProminent: OpacityTokenSchema.default({
    name: '--alpha-bg-prominent',
    value: '0.2',
    description:
      'Prominent background alpha. Strong overlay with higher cognitive load (4/10). High trust level ensures layering is noticed. Use for important background emphasis.',
    category: 'opacity',
    type: 'static',
    semanticGroup: 'semantic-state',
    aiIntelligence: {
      cognitiveLoad: 4,
      trustLevel: 'high',
      consequence: 'significant',
    },
  }),
});

export type OpacitySystem = z.infer<typeof OpacitySystemSchema>;
