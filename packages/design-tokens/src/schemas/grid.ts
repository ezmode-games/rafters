import { z } from 'zod';

/**
 * Grid Layout Intelligence Schema
 *
 * Minimal token set for grid-specific layout intelligence that extends
 * existing spacing and breakpoint systems. Designed to work with standard
 * Tailwind grid utilities while providing semantic meaning for AI agents.
 */

// Golden ratio constant for mathematical spacing relationships
const PHI = 1.618;

// Grid token schema matching the TokenSchema structure from index.ts
const GridTokenSchema = z.object({
  name: z.string(),
  value: z.string(),
  description: z.string().optional(),
  category: z.literal('grid'), // Grid-specific tokens
  type: z.enum(['static', 'dynamic']),
  semanticGroup: z.enum(['core', 'component', 'golden-ratio']).optional(),
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

/**
 * Grid Auto-Sizing Intelligence Tokens
 * Minimum item widths for auto-fit/auto-fill patterns with semantic meaning
 */
export const GridSizingSchema = z.object({
  // Small items - compact cards, list items
  itemMinWidthSm: GridTokenSchema.default({
    name: '--grid-item-min-width-sm',
    value: '200px', // 12.5rem - readable card minimum
    description:
      'Minimum readable card width for compact layouts. Ensures content remains scannable at smallest responsive size.',
    category: 'grid',
    type: 'static',
    semanticGroup: 'component',
    aiIntelligence: {
      cognitiveLoad: 2,
      trustLevel: 'high',
      accessibilityLevel: 'aa',
    },
  }),

  // Medium items - comfortable content width
  itemMinWidthMd: GridTokenSchema.default({
    name: '--grid-item-min-width-md',
    value: '280px', // 17.5rem - comfortable content width (golden ratio derived)
    description:
      'Comfortable content width following golden ratio principles. Optimal for mixed content types and reading comfort.',
    category: 'grid',
    type: 'static',
    semanticGroup: 'golden-ratio',
    aiIntelligence: {
      cognitiveLoad: 3,
      trustLevel: 'high',
      accessibilityLevel: 'aa',
    },
  }),

  // Large items - rich content minimum
  itemMinWidthLg: GridTokenSchema.default({
    name: '--grid-item-min-width-lg',
    value: '360px', // 22.5rem - rich content display
    description:
      'Rich content minimum width for detailed cards, feature showcases, and complex information display.',
    category: 'grid',
    type: 'static',
    semanticGroup: 'component',
    aiIntelligence: {
      cognitiveLoad: 4,
      trustLevel: 'high',
      accessibilityLevel: 'aa',
    },
  }),
});

/**
 * Cognitive Load Management Tokens
 * Miller's Law (7±2) implementation for viewport-aware grid limits
 */
export const GridCognitionSchema = z.object({
  // Mobile cognitive limits (small screen, touch interface)
  maxItemsMobile: GridTokenSchema.default({
    name: '--grid-max-items-mobile',
    value: '2', // Maximum 2 items for mobile cognitive capacity
    description:
      'Mobile cognitive load limit. Maximum 2 items per row to prevent overwhelm on small screens with touch interfaces.',
    category: 'grid',
    type: 'static',
    semanticGroup: 'core',
    aiIntelligence: {
      cognitiveLoad: 2,
      trustLevel: 'high',
      accessibilityLevel: 'aaa',
      consequence: 'significant',
    },
  }),

  // Tablet cognitive limits (medium screen, mixed interaction)
  maxItemsTablet: GridTokenSchema.default({
    name: '--grid-max-items-tablet',
    value: '4', // Comfortable 4-item scanning for tablets
    description:
      'Tablet cognitive load limit. 4 items maintain comfortable scanning patterns while utilizing available screen space.',
    category: 'grid',
    type: 'static',
    semanticGroup: 'core',
    aiIntelligence: {
      cognitiveLoad: 4,
      trustLevel: 'high',
      accessibilityLevel: 'aa',
      consequence: 'significant',
    },
  }),

  // Desktop cognitive limits (large screen, precise interaction)
  maxItemsDesktop: GridTokenSchema.default({
    name: '--grid-max-items-desktop',
    value: '6', // Miller's Law sweet spot for desktop
    description:
      "Desktop cognitive load limit. 6 items per row align with Miller's Law (7±2) for optimal information processing.",
    category: 'grid',
    type: 'static',
    semanticGroup: 'core',
    aiIntelligence: {
      cognitiveLoad: 6,
      trustLevel: 'medium',
      accessibilityLevel: 'aa',
      consequence: 'significant',
    },
  }),

  // Wide screen cognitive limits (ultra-wide, professional use)
  maxItemsWide: GridTokenSchema.default({
    name: '--grid-max-items-wide',
    value: '8', // Upper Miller's Law limit for professional interfaces
    description:
      'Wide screen cognitive load limit. 8 items maximum before cognitive overload, suitable for professional dashboards.',
    category: 'grid',
    type: 'static',
    semanticGroup: 'core',
    aiIntelligence: {
      cognitiveLoad: 8,
      trustLevel: 'medium',
      accessibilityLevel: 'aa',
      consequence: 'permanent', // Cognitive overload has lasting effects
    },
  }),
});

/**
 * Accessibility Enhancement Tokens
 * Touch target and screen reader navigation requirements
 */
export const GridAccessibilitySchema = z.object({
  // WCAG AAA touch target minimum
  touchTargetMin: GridTokenSchema.default({
    name: '--grid-touch-target-min',
    value: '44px', // WCAG AAA minimum touch target size
    description:
      'WCAG AAA minimum touch target size. Ensures interactive grid items meet accessibility standards for motor impairments.',
    category: 'grid',
    type: 'static',
    semanticGroup: 'core',
    aiIntelligence: {
      cognitiveLoad: 1,
      trustLevel: 'high',
      accessibilityLevel: 'aaa',
      consequence: 'significant',
      sensitivity: 'critical',
    },
  }),

  // Enhanced mobile comfort zone
  touchTargetIdeal: GridTokenSchema.default({
    name: '--grid-touch-target-ideal',
    value: '48px', // Enhanced mobile comfort (iOS HIG recommended)
    description:
      'Enhanced mobile comfort zone exceeding WCAG requirements. Provides generous touch targets for improved usability.',
    category: 'grid',
    type: 'static',
    semanticGroup: 'core',
    aiIntelligence: {
      cognitiveLoad: 1,
      trustLevel: 'high',
      accessibilityLevel: 'aaa',
      consequence: 'reversible',
      sensitivity: 'public',
    },
  }),

  // Focus indicator spacing
  focusGap: GridTokenSchema.default({
    name: '--grid-focus-gap',
    value: '2px', // Space for focus rings and indicators
    description:
      "Focus indicator spacing for keyboard navigation. Ensures focus rings don't overlap with adjacent grid items.",
    category: 'grid',
    type: 'static',
    semanticGroup: 'component',
    aiIntelligence: {
      cognitiveLoad: 1,
      trustLevel: 'high',
      accessibilityLevel: 'aaa',
      consequence: 'significant',
      sensitivity: 'critical',
    },
  }),

  // Screen reader landmark spacing
  landmarkSpacing: GridTokenSchema.default({
    name: '--grid-landmark-spacing',
    value: `${(PHI * 1.5).toFixed(3)}rem`, // φ * 1.5 ≈ 2.427rem - clear section boundaries
    description:
      'Screen reader landmark spacing using golden ratio. Creates clear section boundaries for assistive technology navigation.',
    category: 'grid',
    type: 'static',
    semanticGroup: 'golden-ratio',
    aiIntelligence: {
      cognitiveLoad: 2,
      trustLevel: 'high',
      accessibilityLevel: 'aaa',
      consequence: 'significant',
      sensitivity: 'critical',
    },
  }),
});

/**
 * Combined Grid System Schema
 * All grid-specific tokens in one cohesive system
 */
export const GridSystemSchema = z.object({
  // Auto-sizing intelligence
  sizing: GridSizingSchema,

  // Cognitive load management
  cognition: GridCognitionSchema,

  // Accessibility enhancements
  accessibility: GridAccessibilitySchema,
});

export type GridSystem = z.infer<typeof GridSystemSchema>;

/**
 * Default Grid System Instance
 * Ready-to-use grid tokens following Rafters design intelligence
 */
export const defaultGridSystem: GridSystem = {
  sizing: {
    itemMinWidthSm: {
      name: '--grid-item-min-width-sm',
      value: '200px',
      description:
        'Minimum readable card width for compact layouts. Ensures content remains scannable at smallest responsive size.',
      category: 'grid',
      type: 'static',
      semanticGroup: 'component',
      aiIntelligence: {
        cognitiveLoad: 2,
        trustLevel: 'high',
        accessibilityLevel: 'aa',
      },
    },
    itemMinWidthMd: {
      name: '--grid-item-min-width-md',
      value: '280px',
      description:
        'Comfortable content width following golden ratio principles. Optimal for mixed content types and reading comfort.',
      category: 'grid',
      type: 'static',
      semanticGroup: 'golden-ratio',
      aiIntelligence: {
        cognitiveLoad: 3,
        trustLevel: 'high',
        accessibilityLevel: 'aa',
      },
    },
    itemMinWidthLg: {
      name: '--grid-item-min-width-lg',
      value: '360px',
      description:
        'Rich content minimum width for detailed cards, feature showcases, and complex information display.',
      category: 'grid',
      type: 'static',
      semanticGroup: 'component',
      aiIntelligence: {
        cognitiveLoad: 4,
        trustLevel: 'high',
        accessibilityLevel: 'aa',
      },
    },
  },
  cognition: {
    maxItemsMobile: {
      name: '--grid-max-items-mobile',
      value: '2',
      description:
        'Mobile cognitive load limit. Maximum 2 items per row to prevent overwhelm on small screens with touch interfaces.',
      category: 'grid',
      type: 'static',
      semanticGroup: 'core',
      aiIntelligence: {
        cognitiveLoad: 2,
        trustLevel: 'high',
        accessibilityLevel: 'aaa',
        consequence: 'significant',
      },
    },
    maxItemsTablet: {
      name: '--grid-max-items-tablet',
      value: '4',
      description:
        'Tablet cognitive load limit. 4 items maintain comfortable scanning patterns while utilizing available screen space.',
      category: 'grid',
      type: 'static',
      semanticGroup: 'core',
      aiIntelligence: {
        cognitiveLoad: 4,
        trustLevel: 'high',
        accessibilityLevel: 'aa',
        consequence: 'significant',
      },
    },
    maxItemsDesktop: {
      name: '--grid-max-items-desktop',
      value: '6',
      description:
        "Desktop cognitive load limit. 6 items per row align with Miller's Law (7±2) for optimal information processing.",
      category: 'grid',
      type: 'static',
      semanticGroup: 'core',
      aiIntelligence: {
        cognitiveLoad: 6,
        trustLevel: 'medium',
        accessibilityLevel: 'aa',
        consequence: 'significant',
      },
    },
    maxItemsWide: {
      name: '--grid-max-items-wide',
      value: '8',
      description:
        'Wide screen cognitive load limit. 8 items maximum before cognitive overload, suitable for professional dashboards.',
      category: 'grid',
      type: 'static',
      semanticGroup: 'core',
      aiIntelligence: {
        cognitiveLoad: 8,
        trustLevel: 'medium',
        accessibilityLevel: 'aa',
        consequence: 'permanent',
      },
    },
  },
  accessibility: {
    touchTargetMin: {
      name: '--grid-touch-target-min',
      value: '44px',
      description:
        'WCAG AAA minimum touch target size. Ensures interactive grid items meet accessibility standards for motor impairments.',
      category: 'grid',
      type: 'static',
      semanticGroup: 'core',
      aiIntelligence: {
        cognitiveLoad: 1,
        trustLevel: 'high',
        accessibilityLevel: 'aaa',
        consequence: 'significant',
        sensitivity: 'critical',
      },
    },
    touchTargetIdeal: {
      name: '--grid-touch-target-ideal',
      value: '48px',
      description:
        'Enhanced mobile comfort zone exceeding WCAG requirements. Provides generous touch targets for improved usability.',
      category: 'grid',
      type: 'static',
      semanticGroup: 'core',
      aiIntelligence: {
        cognitiveLoad: 1,
        trustLevel: 'high',
        accessibilityLevel: 'aaa',
        consequence: 'reversible',
        sensitivity: 'public',
      },
    },
    focusGap: {
      name: '--grid-focus-gap',
      value: '2px',
      description:
        "Focus indicator spacing for keyboard navigation. Ensures focus rings don't overlap with adjacent grid items.",
      category: 'grid',
      type: 'static',
      semanticGroup: 'component',
      aiIntelligence: {
        cognitiveLoad: 1,
        trustLevel: 'high',
        accessibilityLevel: 'aaa',
        consequence: 'significant',
        sensitivity: 'critical',
      },
    },
    landmarkSpacing: {
      name: '--grid-landmark-spacing',
      value: `${(PHI * 1.5).toFixed(3)}rem`,
      description:
        'Screen reader landmark spacing using golden ratio. Creates clear section boundaries for assistive technology navigation.',
      category: 'grid',
      type: 'static',
      semanticGroup: 'golden-ratio',
      aiIntelligence: {
        cognitiveLoad: 2,
        trustLevel: 'high',
        accessibilityLevel: 'aaa',
        consequence: 'significant',
        sensitivity: 'critical',
      },
    },
  },
};
