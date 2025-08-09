import { z } from 'zod';

/**
 * Simple Spacing System Schema that matches TokenSchema structure
 */

// Simple spacing token matching the TokenSchema from index.ts
const SpacingTokenSchema = z.object({
  name: z.string(),
  value: z.string(),
  description: z.string().optional(),
  category: z.literal('spacing'),
  type: z.enum(['static', 'dynamic']),
  semanticGroup: z
    .enum(['core', 'brand', 'interactive', 'semantic-state', 'component', 'golden-ratio'])
    .optional(),
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

// Spacing system with golden ratio progression
export const SpacingSystemSchema = z.object({
  // Golden ratio based spacing scale
  minimal: SpacingTokenSchema.default({
    name: '--spacing-minimal',
    value: '0.382rem',
    description:
      'Minimal spacing. Golden ratio φ^-2 for micro-adjustments and fine details. Very low cognitive load (1/10) maintains clean layouts without visual weight.',
    category: 'spacing',
    type: 'static',
    semanticGroup: 'golden-ratio',
    aiIntelligence: {
      cognitiveLoad: 1,
      trustLevel: 'high',
    },
  }),

  tight: SpacingTokenSchema.default({
    name: '--spacing-tight',
    value: '0.618rem',
    description:
      'Tight spacing. Golden ratio φ^-1 for compact layouts and dense information. Low cognitive load (2/10) creates intimacy without claustrophobia.',
    category: 'spacing',
    type: 'static',
    semanticGroup: 'golden-ratio',
    aiIntelligence: {
      cognitiveLoad: 2,
      trustLevel: 'high',
    },
  }),

  base: SpacingTokenSchema.default({
    name: '--spacing-base',
    value: '1rem',
    description:
      'Base spacing unit. Foundation of the spacing system. Moderate cognitive load (3/10) provides comfortable standard rhythm for component padding and margins.',
    category: 'spacing',
    type: 'static',
    semanticGroup: 'core',
    aiIntelligence: {
      cognitiveLoad: 3,
      trustLevel: 'high',
    },
  }),

  comfortable: SpacingTokenSchema.default({
    name: '--spacing-comfortable',
    value: '1.618rem',
    description:
      'Comfortable spacing. Golden ratio φ^1 for generous breathing room. Medium cognitive load (4/10) enhances readability and reduces visual tension.',
    category: 'spacing',
    type: 'static',
    semanticGroup: 'golden-ratio',
    aiIntelligence: {
      cognitiveLoad: 4,
      trustLevel: 'high',
    },
  }),

  generous: SpacingTokenSchema.default({
    name: '--spacing-generous',
    value: '2.618rem',
    description:
      'Generous spacing. Golden ratio φ^2 for major section separation. Higher cognitive load (5/10) creates clear content boundaries and hierarchy.',
    category: 'spacing',
    type: 'static',
    semanticGroup: 'golden-ratio',
    aiIntelligence: {
      cognitiveLoad: 5,
      trustLevel: 'high',
    },
  }),

  architectural: SpacingTokenSchema.default({
    name: '--spacing-architectural',
    value: '4.236rem',
    description:
      'Architectural spacing. Golden ratio φ^3 for major page structure. High cognitive load (6/10) creates dramatic separation and establishes strong layout hierarchy.',
    category: 'spacing',
    type: 'static',
    semanticGroup: 'golden-ratio',
    aiIntelligence: {
      cognitiveLoad: 6,
      trustLevel: 'medium',
    },
  }),
});

export type SpacingSystem = z.infer<typeof SpacingSystemSchema>;
