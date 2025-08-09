/**
 * Smart Color Tool with OKLCH and AAA compliance
 * Uses superRefine() with color-utils for intelligent state generation
 */

import {
  adjustChroma,
  calculateWCAGContrast,
  darken,
  findAccessibleColor,
  generateOKLCHScale,
  generateSemanticColorSuggestions,
  lighten,
} from '@rafters/color-utils';
import type { OKLCH } from '@rafters/shared';
import { z } from 'zod';

// Cognitive load constants for color weight analysis
const COGNITIVE_LOAD_LOW_WEIGHT_THRESHOLD = 400;
const COGNITIVE_LOAD_HIGH_WEIGHT_THRESHOLD = 800;
const COGNITIVE_LOAD_LOW = 3;
const COGNITIVE_LOAD_MEDIUM = 4;
const COGNITIVE_LOAD_HIGH = 6;

/**
 * Base OKLCH Color Schema with validation
 */
const OKLCHSchema = z.object({
  l: z.number().min(0).max(1),
  c: z.number().min(0),
  h: z.number().min(0).max(360),
  alpha: z.number().min(0).max(1).default(1),
});

/**
 * Smart Color Token with automatic state generation
 * Uses superRefine() to generate AAA compliant hover/focus states
 */
export const SmartColorTokenSchema = z
  .object({
    name: z.string(),
    base: OKLCHSchema,
    background: OKLCHSchema.optional(),
    description: z.string().optional(),
    category: z.literal('color'),
    type: z.enum(['static', 'dynamic']).default('dynamic'),
    semanticGroup: z
      .enum(['core', 'brand', 'interactive', 'semantic-state', 'component'])
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
  })
  .superRefine((data, ctx) => {
    // Smart state generation using color-utils
    const baseColor = data.base;
    const bgColor = data.background || { l: 1, c: 0, h: 0, alpha: 1 }; // Default white background

    try {
      // Generate AAA compliant states automatically
      const hoverColor = findAccessibleColor(lighten(baseColor, 0.1), bgColor, 'WCAG-AAA');

      const focusColor = findAccessibleColor(adjustChroma(baseColor, 0.05), bgColor, 'WCAG-AAA');

      const activeColor = findAccessibleColor(darken(baseColor, 0.15), bgColor, 'WCAG-AAA');

      // Validate contrast ratios
      const baseContrast = calculateWCAGContrast(baseColor, bgColor);
      const hoverContrast = calculateWCAGContrast(hoverColor, bgColor);
      const focusContrast = calculateWCAGContrast(focusColor, bgColor);
      const activeContrast = calculateWCAGContrast(activeColor, bgColor);

      // Add generated states to the parsed object
      Object.assign(data, {
        states: {
          base: baseColor,
          hover: hoverColor,
          focus: focusColor,
          active: activeColor,
        },
        accessibility: {
          baseContrast,
          hoverContrast,
          focusContrast,
          activeContrast,
          meetsAAA:
            baseContrast >= 7.0 &&
            hoverContrast >= 7.0 &&
            focusContrast >= 7.0 &&
            activeContrast >= 7.0,
        },
      });

      // Update accessibility level based on actual contrast
      if (data.aiIntelligence && baseContrast >= 7.0) {
        data.aiIntelligence.accessibilityLevel = 'aaa';
      } else if (data.aiIntelligence && baseContrast >= 4.5) {
        data.aiIntelligence.accessibilityLevel = 'aa';
      }
    } catch (error) {
      ctx.addIssue({
        code: 'custom',
        message: `Failed to generate accessible color states: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  });

export type SmartColorToken = z.infer<typeof SmartColorTokenSchema> & {
  states: {
    base: OKLCH;
    hover: OKLCH;
    focus: OKLCH;
    active: OKLCH;
  };
  accessibility: {
    baseContrast: number;
    hoverContrast: number;
    focusContrast: number;
    activeContrast: number;
    meetsAAA: boolean;
  };
};

/**
 * Generate intelligent color scale with semantic suggestions
 */
export function generateIntelligentColorScale(
  baseColor: OKLCH,
  background?: OKLCH
): {
  scale: Record<string, OKLCH>;
  semantic: ReturnType<typeof generateSemanticColorSuggestions>;
  smartTokens: SmartColorToken[];
} {
  const scale = generateOKLCHScale(baseColor);
  const semantic = generateSemanticColorSuggestions(baseColor);

  // Create smart tokens for primary scale - only use accessible weights
  const accessibleWeights = ['400', '500', '600', '700', '800', '900']; // Skip light weights for text
  const smartTokens: SmartColorToken[] = accessibleWeights.map((weight) => {
    const color = scale[weight];
    return SmartColorTokenSchema.parse({
      name: `--color-primary-${weight}`,
      base: color,
      background,
      description: `Primary color ${weight} with intelligent state generation`,
      category: 'color' as const,
      type: 'dynamic' as const,
      semanticGroup: 'brand',
      aiIntelligence: {
        cognitiveLoad:
          Number.parseInt(weight) <= COGNITIVE_LOAD_LOW_WEIGHT_THRESHOLD
            ? COGNITIVE_LOAD_LOW
            : Number.parseInt(weight) >= COGNITIVE_LOAD_HIGH_WEIGHT_THRESHOLD
              ? COGNITIVE_LOAD_HIGH
              : COGNITIVE_LOAD_MEDIUM,
        trustLevel: 'high',
        accessibilityLevel: 'aaa',
      },
    }) as SmartColorToken;
  });

  return {
    scale,
    semantic,
    smartTokens,
  };
}

/**
 * Create design system color tokens with intelligent state management
 */
export function createColorDesignSystem(
  primaryColor: OKLCH,
  background: OKLCH = { l: 1, c: 0, h: 0, alpha: 1 }
) {
  const primarySystem = generateIntelligentColorScale(primaryColor, background);
  const semanticSuggestions = primarySystem.semantic;

  // Generate semantic color tokens
  const semanticTokens: SmartColorToken[] = [];

  for (const [semanticType, colors] of Object.entries(semanticSuggestions)) {
    colors.forEach((color, index) => {
      // Ensure semantic color is accessible against background
      const accessibleColor = findAccessibleColor(color, background, 'WCAG-AAA');

      const token = SmartColorTokenSchema.parse({
        name: `--color-${semanticType}-${index + 1}`,
        base: accessibleColor,
        background,
        description: `${semanticType} color option ${index + 1} with AAA compliance`,
        category: 'color' as const,
        type: 'dynamic' as const,
        semanticGroup: 'semantic-state',
        aiIntelligence: {
          cognitiveLoad: semanticType === 'danger' ? 8 : semanticType === 'warning' ? 6 : 4,
          trustLevel: semanticType === 'success' ? 'high' : 'medium',
          accessibilityLevel: 'aaa',
          consequence: semanticType === 'danger' ? 'destructive' : 'significant',
        },
      }) as SmartColorToken;
      semanticTokens.push(token);
    });
  }

  return {
    primary: primarySystem,
    semantic: semanticTokens,
    allTokens: [...primarySystem.smartTokens, ...semanticTokens],
  };
}

/**
 * Export CSS custom properties from smart color tokens
 */
export function exportColorTokensToCSS(tokens: SmartColorToken[]): string {
  let css = ':root {\n';

  for (const token of tokens) {
    const { states } = token;

    // Base color
    css += `  ${token.name}: oklch(${states.base.l} ${states.base.c} ${states.base.h});\n`;

    // State variants
    css += `  ${token.name}-hover: oklch(${states.hover.l} ${states.hover.c} ${states.hover.h});\n`;
    css += `  ${token.name}-focus: oklch(${states.focus.l} ${states.focus.c} ${states.focus.h});\n`;
    css += `  ${token.name}-active: oklch(${states.active.l} ${states.active.c} ${states.active.h});\n`;
  }

  css += '}\n';
  return css;
}
