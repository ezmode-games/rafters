import { z } from 'zod';

/**
 * Simple Typography System Schema that matches TokenSchema structure
 */

// Simple typography token matching the TokenSchema from index.ts
const TypographyTokenSchema = z.object({
  name: z.string(),
  value: z.string(),
  description: z.string().optional(),
  category: z.literal('typography'),
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

// Typography system with simple structure
export const TypographySystemSchema = z.object({
  // Font families
  fontFamily: TypographyTokenSchema.default({
    name: '--font-family-sans',
    value: '"Inter", system-ui, sans-serif',
    description:
      'Primary font family. Inter provides excellent readability across all sizes. System fallbacks ensure reliability. Optimized for interface and content use.',
    category: 'typography',
    type: 'static',
    semanticGroup: 'core',
  }),

  fontFamilyMono: TypographyTokenSchema.default({
    name: '--font-family-mono',
    value: '"JetBrains Mono", "Fira Code", monospace',
    description:
      'Monospace font family. JetBrains Mono enhances code readability with ligatures and clear character distinction. Essential for technical content and data display.',
    category: 'typography',
    type: 'static',
    semanticGroup: 'core',
  }),

  // Font sizes with golden ratio scaling
  hero: TypographyTokenSchema.default({
    name: '--font-size-hero',
    value: '4.854rem',
    description:
      'Hero text size. Golden ratio φ^4 scaling creates dramatic impact. Very high cognitive load (9/10) demands attention. Use sparingly for maximum effectiveness. AAA accessibility compliant.',
    category: 'typography',
    type: 'static',
    semanticGroup: 'golden-ratio',
    aiIntelligence: {
      cognitiveLoad: 9,
      trustLevel: 'high',
      accessibilityLevel: 'aaa',
    },
  }),

  display: TypographyTokenSchema.default({
    name: '--font-size-display',
    value: '3rem',
    description:
      'Display text size. Golden ratio φ^3 scaling for major headings. High cognitive load (7/10) establishes clear hierarchy. Ideal for section headers and important announcements.',
    category: 'typography',
    type: 'static',
    semanticGroup: 'golden-ratio',
    aiIntelligence: {
      cognitiveLoad: 7,
      trustLevel: 'high',
      accessibilityLevel: 'aaa',
    },
  }),

  section: TypographyTokenSchema.default({
    name: '--font-size-section',
    value: '1.875rem',
    description:
      'Section heading size. Golden ratio φ^2 creates balanced hierarchy. Moderate cognitive load (5/10) organizes content without overwhelming. Perfect for subsection headers.',
    category: 'typography',
    type: 'static',
    semanticGroup: 'golden-ratio',
    aiIntelligence: {
      cognitiveLoad: 5,
      trustLevel: 'high',
      accessibilityLevel: 'aaa',
    },
  }),

  body: TypographyTokenSchema.default({
    name: '--font-size-body',
    value: '1rem',
    description:
      'Body text size. Optimized for sustained reading with minimal cognitive load (2/10). High trust level ensures comfortable content consumption. AAA accessibility for all users.',
    category: 'typography',
    type: 'static',
    semanticGroup: 'core',
    aiIntelligence: {
      cognitiveLoad: 2,
      trustLevel: 'high',
      accessibilityLevel: 'aaa',
    },
  }),

  small: TypographyTokenSchema.default({
    name: '--font-size-small',
    value: '0.875rem',
    description:
      'Small text size. Golden ratio φ^-1 maintains proportional harmony. Very low cognitive load (1/10) for secondary information. Use for captions, metadata, and supporting details.',
    category: 'typography',
    type: 'static',
    semanticGroup: 'golden-ratio',
    aiIntelligence: {
      cognitiveLoad: 1,
      trustLevel: 'medium',
      accessibilityLevel: 'aa',
    },
  }),
});

export type TypographySystem = z.infer<typeof TypographySystemSchema>;
