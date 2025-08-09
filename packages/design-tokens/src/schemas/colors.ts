import { z } from 'zod';

/**
 * Simple Color System Schema that matches TokenSchema structure
 */

// Simple color token matching the TokenSchema from index.ts
const ColorTokenSchema = z.object({
  name: z.string(),
  value: z.string(),
  description: z.string().optional(),
  category: z.literal('color'),
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

// Color system with simple structure
export const ColorSystemSchema = z.object({
  // Core colors
  background: ColorTokenSchema.default({
    name: '--color-background',
    value: 'oklch(1 0 0)',
    description:
      'Core background color. Pure white foundation with zero cognitive load. Essential for readability and accessibility compliance.',
    category: 'color',
    type: 'static',
    semanticGroup: 'core',
  }),

  foreground: ColorTokenSchema.default({
    name: '--color-foreground',
    value: 'oklch(0.145 0 0)',
    description:
      'Primary text color. Near-black for maximum readability. Provides AAA contrast against background. Low cognitive load for sustained reading.',
    category: 'color',
    type: 'static',
    semanticGroup: 'core',
  }),

  // Brand colors
  primary: ColorTokenSchema.default({
    name: '--color-primary',
    value: 'oklch(0.205 0 0)',
    description:
      'Primary brand color. Draws attention to key actions. Medium cognitive load (3/10) signals importance. High trust level builds confidence. Significant consequences require user consideration.',
    category: 'color',
    type: 'dynamic',
    semanticGroup: 'brand',
    aiIntelligence: {
      cognitiveLoad: 3,
      trustLevel: 'high',
      consequence: 'significant',
    },
  }),

  // Semantic colors
  destructive: ColorTokenSchema.default({
    name: '--color-destructive',
    value: 'oklch(0.371 0 0)',
    description:
      'Destructive action color. Demands immediate attention with high cognitive load (8/10). Low trust level warns of danger. Destructive consequences require confirmation patterns.',
    category: 'color',
    type: 'dynamic',
    semanticGroup: 'semantic-state',
    aiIntelligence: {
      cognitiveLoad: 8,
      trustLevel: 'low',
      consequence: 'destructive',
    },
  }),

  success: ColorTokenSchema.default({
    name: '--color-success',
    value: 'oklch(0.556 0 0)',
    description:
      'Success confirmation color. Provides positive feedback with medium cognitive load (3/10). High trust level reinforces successful completion. Reversible consequences allow safe interaction.',
    category: 'color',
    type: 'dynamic',
    semanticGroup: 'semantic-state',
    aiIntelligence: {
      cognitiveLoad: 3,
      trustLevel: 'high',
      consequence: 'reversible',
    },
  }),

  // Surface colors
  card: ColorTokenSchema.default({
    name: '--color-card',
    value: 'oklch(1 0 0)',
    description:
      'Card background color. Pure white surface for contained content. Zero cognitive load maintains focus on card content. High trust level provides clean foundation.',
    category: 'color',
    type: 'static',
    semanticGroup: 'core',
  }),

  cardForeground: ColorTokenSchema.default({
    name: '--color-card-foreground',
    value: 'oklch(0.145 0 0)',
    description:
      'Card text color. Near-black for optimal readability on card surfaces. Low cognitive load supports content consumption. AAA contrast compliance.',
    category: 'color',
    type: 'static',
    semanticGroup: 'core',
  }),

  popover: ColorTokenSchema.default({
    name: '--color-popover',
    value: 'oklch(1 0 0)',
    description:
      'Popover background color. Pure white for floating content layers. Minimal cognitive load maintains focus hierarchy. High trust level ensures clarity.',
    category: 'color',
    type: 'static',
    semanticGroup: 'core',
  }),

  popoverForeground: ColorTokenSchema.default({
    name: '--color-popover-foreground',
    value: 'oklch(0.145 0 0)',
    description:
      'Popover text color. Near-black ensures readability in floating contexts. Low cognitive load supports quick information consumption.',
    category: 'color',
    type: 'static',
    semanticGroup: 'core',
  }),

  // Brand foreground
  primaryForeground: ColorTokenSchema.default({
    name: '--color-primary-foreground',
    value: 'oklch(0.985 0 0)',
    description:
      'Primary button text color. Near-white ensures contrast against primary backgrounds. Medium cognitive load balances with primary actions. High trust level for key interactions.',
    category: 'color',
    type: 'dynamic',
    semanticGroup: 'brand',
    aiIntelligence: {
      cognitiveLoad: 3,
      trustLevel: 'high',
      accessibilityLevel: 'aaa',
    },
  }),

  // Interactive colors
  secondary: ColorTokenSchema.default({
    name: '--color-secondary',
    value: 'oklch(0.97 0 0)',
    description:
      'Secondary background color. Very light gray for secondary actions. Low cognitive load (2/10) supports secondary hierarchy. High trust level maintains usability.',
    category: 'color',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 2,
      trustLevel: 'high',
      consequence: 'reversible',
    },
  }),

  secondaryForeground: ColorTokenSchema.default({
    name: '--color-secondary-foreground',
    value: 'oklch(0.205 0 0)',
    description:
      'Secondary button text color. Dark gray ensures readability on light secondary backgrounds. Low cognitive load supports secondary actions.',
    category: 'color',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 2,
      trustLevel: 'high',
      accessibilityLevel: 'aaa',
    },
  }),

  muted: ColorTokenSchema.default({
    name: '--color-muted',
    value: 'oklch(0.97 0 0)',
    description:
      'Muted background color. Very light gray for de-emphasized content. Minimal cognitive load (1/10) creates subtle backgrounds. High trust level maintains clarity.',
    category: 'color',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 1,
      trustLevel: 'high',
    },
  }),

  mutedForeground: ColorTokenSchema.default({
    name: '--color-muted-foreground',
    value: 'oklch(0.556 0 0)',
    description:
      'Muted text color. Medium gray for secondary text and metadata. Low cognitive load (2/10) reduces visual prominence. Medium trust level for supporting information.',
    category: 'color',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 2,
      trustLevel: 'medium',
      accessibilityLevel: 'aa',
    },
  }),

  accent: ColorTokenSchema.default({
    name: '--color-accent',
    value: 'oklch(0.97 0 0)',
    description:
      'Accent background color. Light gray for highlighted content. Medium cognitive load (3/10) draws subtle attention. High trust level supports accent patterns.',
    category: 'color',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 3,
      trustLevel: 'high',
      consequence: 'reversible',
    },
  }),

  accentForeground: ColorTokenSchema.default({
    name: '--color-accent-foreground',
    value: 'oklch(0.205 0 0)',
    description:
      'Accent text color. Dark gray ensures readability on accent backgrounds. Medium cognitive load balances with accent hierarchy.',
    category: 'color',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 3,
      trustLevel: 'high',
      accessibilityLevel: 'aaa',
    },
  }),

  // Additional semantic state colors
  destructiveForeground: ColorTokenSchema.default({
    name: '--color-destructive-foreground',
    value: 'oklch(0.985 0 0)',
    description:
      'Destructive button text color. Near-white ensures contrast against destructive backgrounds. High cognitive load (8/10) matches destructive actions. Low trust level warns of consequences.',
    category: 'color',
    type: 'dynamic',
    semanticGroup: 'semantic-state',
    aiIntelligence: {
      cognitiveLoad: 8,
      trustLevel: 'low',
      consequence: 'destructive',
      accessibilityLevel: 'aaa',
    },
  }),

  successForeground: ColorTokenSchema.default({
    name: '--color-success-foreground',
    value: 'oklch(0.985 0 0)',
    description:
      'Success button text color. Near-white ensures contrast against success backgrounds. Medium cognitive load (3/10) supports positive feedback. High trust level reinforces success.',
    category: 'color',
    type: 'dynamic',
    semanticGroup: 'semantic-state',
    aiIntelligence: {
      cognitiveLoad: 3,
      trustLevel: 'high',
      consequence: 'reversible',
      accessibilityLevel: 'aaa',
    },
  }),

  warning: ColorTokenSchema.default({
    name: '--color-warning',
    value: 'oklch(0.708 0 0)',
    description:
      'Warning color. Light gray for caution states. Medium-high cognitive load (6/10) demands attention without panic. Medium trust level suggests careful consideration.',
    category: 'color',
    type: 'dynamic',
    semanticGroup: 'semantic-state',
    aiIntelligence: {
      cognitiveLoad: 6,
      trustLevel: 'medium',
      consequence: 'significant',
    },
  }),

  warningForeground: ColorTokenSchema.default({
    name: '--color-warning-foreground',
    value: 'oklch(0.145 0 0)',
    description:
      'Warning text color. Near-black ensures readability on warning backgrounds. Medium-high cognitive load (6/10) maintains warning prominence. Medium trust level suggests caution.',
    category: 'color',
    type: 'dynamic',
    semanticGroup: 'semantic-state',
    aiIntelligence: {
      cognitiveLoad: 6,
      trustLevel: 'medium',
      consequence: 'significant',
      accessibilityLevel: 'aaa',
    },
  }),

  info: ColorTokenSchema.default({
    name: '--color-info',
    value: 'oklch(0.456 0 0)',
    description:
      'Information color. Medium-dark gray for informational content. Medium cognitive load (4/10) draws attention to helpful information. High trust level supports learning.',
    category: 'color',
    type: 'dynamic',
    semanticGroup: 'semantic-state',
    aiIntelligence: {
      cognitiveLoad: 4,
      trustLevel: 'high',
      consequence: 'reversible',
    },
  }),

  infoForeground: ColorTokenSchema.default({
    name: '--color-info-foreground',
    value: 'oklch(0.985 0 0)',
    description:
      'Information text color. Near-white ensures contrast against info backgrounds. Medium cognitive load (4/10) supports information hierarchy. High trust level encourages engagement.',
    category: 'color',
    type: 'dynamic',
    semanticGroup: 'semantic-state',
    aiIntelligence: {
      cognitiveLoad: 4,
      trustLevel: 'high',
      consequence: 'reversible',
      accessibilityLevel: 'aaa',
    },
  }),
});

export type ColorSystem = z.infer<typeof ColorSystemSchema>;
