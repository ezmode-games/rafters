/**
 * Grayscale Design System - Barrel file with intelligent defaults
 * Exports structured schemas with AI intelligence baked in
 */

// Export all schema modules
export * from './schemas/colors';
export * from './schemas/typography';
export * from './schemas/spacing';
export * from './schemas/state';
export * from './schemas/motion';
export * from './schemas/border';
export * from './schemas/shadow';
export * from './schemas/ring';
export * from './schemas/opacity';

import { z } from 'zod';
import { BorderSystemSchema } from './schemas/border';
import { ColorSystemSchema } from './schemas/colors';
import { MotionSystemSchema } from './schemas/motion';
import { OpacitySystemSchema } from './schemas/opacity';
import { RingSystemSchema } from './schemas/ring';
import { ShadowSystemSchema } from './schemas/shadow';
import { SpacingSystemSchema } from './schemas/spacing';
import { StateSystemSchema } from './schemas/state';
import { TypographySystemSchema } from './schemas/typography';

// Complete design system with all intelligence
export const GrayscaleDesignSystemSchema = z
  .object({
    colors: ColorSystemSchema,
    typography: TypographySystemSchema,
    spacing: SpacingSystemSchema,
    state: StateSystemSchema,
    motion: MotionSystemSchema,
    border: BorderSystemSchema,
    shadow: ShadowSystemSchema,
    ring: RingSystemSchema,
    opacity: OpacitySystemSchema,

    // System-wide intelligence metadata
    meta: z.object({
      version: z.string().default('1.0.0'),
      name: z.string().default('Rafters Grayscale'),
      description: z.string().default('AI-intelligent grayscale design system'),

      // Cross-system intelligence
      overallCognitiveLoad: z.number().default(0),
      designCoherence: z.number().min(1).max(10).default(10),
      accessibilityScore: z.number().min(1).max(10).default(10),

      // AI capabilities
      intelligenceFeatures: z
        .array(
          z.enum([
            'automatic-contrast',
            'golden-ratio-harmony',
            'cognitive-load-tracking',
            'trust-building-optimization',
            'accessibility-compliance',
            'semantic-color-mapping',
          ])
        )
        .default([
          'automatic-contrast',
          'golden-ratio-harmony',
          'cognitive-load-tracking',
          'trust-building-optimization',
          'accessibility-compliance',
          'semantic-color-mapping',
        ]),
    }),
  })
  .transform((data) => {
    // Calculate cross-system intelligence metrics from individual tokens
    const allTokens = [
      ...Object.values(data.colors),
      ...Object.values(data.typography),
      ...Object.values(data.spacing),
      ...Object.values(data.state),
      ...Object.values(data.motion.timing),
      ...Object.values(data.motion.easing),
      ...Object.values(data.border),
      ...Object.values(data.shadow),
      ...Object.values(data.ring),
      ...Object.values(data.opacity),
    ];

    const tokensCognitiveLoad = allTokens
      .filter((token) => token.aiIntelligence?.cognitiveLoad)
      .map((token) => token.aiIntelligence!.cognitiveLoad!);

    const avgCognitiveLoad =
      tokensCognitiveLoad.length > 0
        ? tokensCognitiveLoad.reduce((sum, load) => sum + load, 0) / tokensCognitiveLoad.length
        : 3;

    const aaaTokens = allTokens.filter(
      (token) => token.aiIntelligence?.accessibilityLevel === 'aaa'
    );
    const accessibilityScore = (aaaTokens.length / allTokens.length) * 10;

    return {
      ...data,
      meta: {
        ...data.meta,
        overallCognitiveLoad: Math.round(avgCognitiveLoad),
        accessibilityScore: Math.round(accessibilityScore * 10) / 10,
      },
    };
  });

// Default instance with all grayscale intelligence
export const defaultGrayscaleSystem = GrayscaleDesignSystemSchema.parse({
  colors: {},
  typography: {},
  spacing: {},
  state: {},
  motion: {
    timing: {},
    easing: {},
  },
  border: {},
  shadow: {},
  ring: {},
  opacity: {},
  meta: {},
});

export type GrayscaleDesignSystem = z.infer<typeof GrayscaleDesignSystemSchema>;
