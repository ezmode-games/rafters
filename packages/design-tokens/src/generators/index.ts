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

// Import all generators from individual files
export { generateAspectRatioTokens } from './aspect-ratio.js';
export { generateBackdropTokens } from './backdrop.js';
export { generateBorderRadiusTokens } from './border-radius.js';
export { generateBorderWidthTokens } from './border-width.js';
export { generateBreakpointTokens } from './breakpoint.js';
export { generateColorTokens } from './color.js';
export { generateDepthScale } from './depth.js';
export { generateFontFamilyTokens } from './font-family.js';
export { generateFontWeightTokens } from './font-weight.js';
export { generateGridTokens } from './grid.js';
export { generateHeightScale } from './height.js';
export { generateLetterSpacingTokens } from './letter-spacing.js';
export { generateMotionTokens } from './motion.js';
export { generateOpacityTokens } from './opacity.js';
export { generateSpacingScale } from './spacing.js';
export { generateTouchTargetTokens } from './touch-target.js';
export { generateTransformTokens } from './transform.js';
export { generateTypographyScale } from './typography.js';
export { generateWidthTokens } from './width.js';

// Import for generateAllTokens function
import type { Token } from '@rafters/shared';
import { generateAspectRatioTokens } from './aspect-ratio.js';
import { generateBackdropTokens } from './backdrop.js';
import { generateBorderRadiusTokens } from './border-radius.js';
import { generateBorderWidthTokens } from './border-width.js';
import { generateBreakpointTokens } from './breakpoint.js';
import { generateColorTokens } from './color.js';
import { generateDepthScale } from './depth.js';
import { generateFontFamilyTokens } from './font-family.js';
import { generateFontWeightTokens } from './font-weight.js';
import { generateGridTokens } from './grid.js';
import { generateHeightScale } from './height.js';
import { generateLetterSpacingTokens } from './letter-spacing.js';
import { generateMotionTokens } from './motion.js';
import { generateOpacityTokens } from './opacity.js';
import { generateSpacingScale } from './spacing.js';
import { generateTouchTargetTokens } from './touch-target.js';
import { generateTransformTokens } from './transform.js';
import { generateTypographyScale } from './typography.js';
import { generateWidthTokens } from './width.js';

/**
 * Generate all design tokens using all generators
 *
 * @returns Complete set of design tokens for a design system
 */
export function generateAllTokens(): Token[] {
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
