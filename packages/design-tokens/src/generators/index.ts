/**
 * Design Token Generators
 *
 * Mathematical token generation system with AI intelligence metadata.
 * Each generator creates tokens with semantic meaning, accessibility info,
 * and usage context for AI agent decision-making.
 *
 * All generators follow consistent patterns:
 * - Semantic naming with usage context
 * - AI intelligence metadata (cognitive load, trust level, etc.)
 * - Accessibility validation where applicable
 * - Mathematical relationships for scaling
 * - Responsive and container query variants where relevant
 */

// Import all generators from the main index file
import {
  generateAspectRatioTokens,
  generateBackdropTokens,
  generateBorderRadiusTokens,
  generateBorderWidthTokens,
  generateBreakpointTokens,
  generateColorTokens,
  generateDepthScale,
  generateFontFamilyTokens,
  generateFontWeightTokens,
  generateGridTokens,
  generateHeightScale,
  generateLetterSpacingTokens,
  generateMotionTokens,
  generateOpacityTokens,
  generateSpacingScale,
  generateTouchTargetTokens,
  generateTransformTokens,
  generateTypographyScale,
  generateWidthTokens,
} from '../index.js';

// Re-export all generators for external use
export { generateSpacingScale };
export { generateDepthScale };
export { generateHeightScale };
export { generateTypographyScale };
export { generateColorTokens };
export { generateMotionTokens };
export { generateBorderRadiusTokens };
export { generateTouchTargetTokens };
export { generateOpacityTokens };
export { generateFontFamilyTokens };
export { generateFontWeightTokens };
export { generateLetterSpacingTokens };
export { generateBreakpointTokens };
export { generateAspectRatioTokens };
export { generateGridTokens };
export { generateTransformTokens };
export { generateWidthTokens };
export { generateBackdropTokens };
export { generateBorderWidthTokens };

/**
 * Generate all design tokens using all generators
 *
 * @returns Complete set of design tokens for a design system
 */
export function generateAllTokens(): import('../index.js').Token[] {
  return [
    ...generateSpacingScale('linear', 4, 1.25, 12, true),
    ...generateDepthScale('exponential', 10),
    ...generateHeightScale('linear', 2.5, 1.25, true),
    ...generateTypographyScale('golden', 1, true),
    ...generateColorTokens(),
    ...generateMotionTokens(),
    ...generateBorderRadiusTokens(),
    ...generateTouchTargetTokens(),
    ...generateOpacityTokens(),
    ...generateFontFamilyTokens(),
    ...generateFontWeightTokens(),
    ...generateLetterSpacingTokens(),
    ...generateBreakpointTokens(),
    ...generateAspectRatioTokens(),
    ...generateGridTokens(),
    ...generateTransformTokens(),
    ...generateWidthTokens(),
    ...generateBackdropTokens(),
    ...generateBorderWidthTokens(),
  ];
}
