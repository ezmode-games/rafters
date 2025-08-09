import { z } from 'zod';

/**
 * Simple Shadow System Schema that matches TokenSchema structure
 */

// Simple shadow token matching the TokenSchema from index.ts
const ShadowTokenSchema = z.object({
  name: z.string(),
  value: z.string(),
  description: z.string().optional(),
  category: z.literal('shadow'),
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

// Shadow system with depth variations and interaction states
export const ShadowSystemSchema = z.object({
  // Basic depth shadows (Tailwind defaults)
  sm: ShadowTokenSchema.default({
    name: '--shadow-sm',
    value: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    description:
      'Small shadow depth. Subtle elevation with minimal cognitive load (1/10). High trust level provides gentle depth cues. Perfect for cards and buttons.',
    category: 'shadow',
    type: 'static',
    semanticGroup: 'core',
    aiIntelligence: {
      cognitiveLoad: 1,
      trustLevel: 'high',
      accessibilityLevel: 'aaa',
    },
  }),

  default: ShadowTokenSchema.default({
    name: '--shadow',
    value: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    description:
      'Default shadow depth. Standard elevation with low cognitive load (2/10). High trust level establishes clear layering. Most common shadow for components.',
    category: 'shadow',
    type: 'static',
    semanticGroup: 'core',
    aiIntelligence: {
      cognitiveLoad: 2,
      trustLevel: 'high',
      accessibilityLevel: 'aaa',
    },
  }),

  md: ShadowTokenSchema.default({
    name: '--shadow-md',
    value: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    description:
      'Medium shadow depth. Increased elevation with medium cognitive load (3/10). High trust level draws attention to layering. Good for modals and dropdowns.',
    category: 'shadow',
    type: 'static',
    semanticGroup: 'component',
    aiIntelligence: {
      cognitiveLoad: 3,
      trustLevel: 'high',
      consequence: 'reversible',
    },
  }),

  lg: ShadowTokenSchema.default({
    name: '--shadow-lg',
    value: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    description:
      'Large shadow depth. Prominent elevation with higher cognitive load (4/10). High trust level creates strong depth hierarchy. Use for important floating elements.',
    category: 'shadow',
    type: 'static',
    semanticGroup: 'component',
    aiIntelligence: {
      cognitiveLoad: 4,
      trustLevel: 'high',
      consequence: 'significant',
    },
  }),

  xl: ShadowTokenSchema.default({
    name: '--shadow-xl',
    value: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    description:
      'Extra large shadow depth. Dramatic elevation with high cognitive load (6/10). Medium trust level demands attention. Reserve for critical overlays and notifications.',
    category: 'shadow',
    type: 'static',
    semanticGroup: 'semantic-state',
    aiIntelligence: {
      cognitiveLoad: 6,
      trustLevel: 'medium',
      consequence: 'significant',
    },
  }),

  // Hover state shadows
  hoverSubtle: ShadowTokenSchema.default({
    name: '--shadow-hover-subtle',
    value: '0 1px 2px rgba(0, 0, 0, 0.05)',
    description:
      'Subtle hover shadow. Gentle feedback with very low cognitive load (1/10). High trust level provides minimal interaction cues. Perfect for low-emphasis hover states.',
    category: 'shadow',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 1,
      trustLevel: 'high',
      consequence: 'reversible',
    },
  }),

  hoverStandard: ShadowTokenSchema.default({
    name: '--shadow-hover-standard',
    value: '0 1px 3px rgba(0, 0, 0, 0.1)',
    description:
      'Standard hover shadow. Clear feedback with low cognitive load (2/10). High trust level confirms interaction. Default for most button hover states.',
    category: 'shadow',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 2,
      trustLevel: 'high',
      consequence: 'reversible',
    },
  }),

  hoverEnhanced: ShadowTokenSchema.default({
    name: '--shadow-hover-enhanced',
    value: '0 2px 4px rgba(0, 0, 0, 0.15)',
    description:
      'Enhanced hover shadow. Stronger feedback with medium cognitive load (3/10). High trust level emphasizes interactivity. Good for primary actions.',
    category: 'shadow',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 3,
      trustLevel: 'high',
      consequence: 'reversible',
    },
  }),

  hoverProminent: ShadowTokenSchema.default({
    name: '--shadow-hover-prominent',
    value: '0 4px 8px rgba(0, 0, 0, 0.2)',
    description:
      'Prominent hover shadow. Strong feedback with higher cognitive load (4/10). Medium trust level suggests important action. Use for critical interactive elements.',
    category: 'shadow',
    type: 'static',
    semanticGroup: 'semantic-state',
    aiIntelligence: {
      cognitiveLoad: 4,
      trustLevel: 'medium',
      consequence: 'significant',
    },
  }),

  // Special shadows
  inner: ShadowTokenSchema.default({
    name: '--shadow-inner',
    value: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    description:
      'Inner shadow effect. Subtle inset depth with low cognitive load (2/10). High trust level creates pressed appearance. Perfect for active button states.',
    category: 'shadow',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 2,
      trustLevel: 'high',
      consequence: 'reversible',
    },
  }),

  none: ShadowTokenSchema.default({
    name: '--shadow-none',
    value: 'none',
    description:
      'No shadow. Flat appearance with minimal cognitive load (1/10). High trust level maintains clean aesthetics. Use when depth is not needed.',
    category: 'shadow',
    type: 'static',
    semanticGroup: 'core',
    aiIntelligence: {
      cognitiveLoad: 1,
      trustLevel: 'high',
      consequence: 'reversible',
    },
  }),
});

export type ShadowSystem = z.infer<typeof ShadowSystemSchema>;
