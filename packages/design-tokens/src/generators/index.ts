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
export { generateAspectRatioTokens } from './aspect-ratio';
export { generateBackdropTokens } from './backdrop';
export { generateBorderRadiusTokens } from './border-radius';
export { generateBorderWidthTokens } from './border-width';
export { generateBreakpointTokens } from './breakpoint';
export { generateColorTokens } from './color';
export { generateDepthScale } from './depth';
export { generateFontFamilyTokens } from './font-family';
export { generateFontWeightTokens } from './font-weight';
export { generateGridTokens } from './grid';
export { generateHeightScale } from './height';
export { generateLetterSpacingTokens } from './letter-spacing';
export { generateMotionTokens } from './motion';
export { generateOpacityTokens } from './opacity';
export { generateSpacingScale } from './spacing';
export { generateTouchTargetTokens } from './touch-target';
export { generateTransformTokens } from './transform';
export { generateTypographyScale } from './typography';
export { generateWidthTokens } from './width';

// Import for generateAllTokens function
import type { Token } from '@rafters/shared';
import { generateAspectRatioTokens } from './aspect-ratio';
import { generateBackdropTokens } from './backdrop';
import { generateBorderRadiusTokens } from './border-radius';
import { generateBorderWidthTokens } from './border-width';
import { generateBreakpointTokens } from './breakpoint';
import { generateColorTokens } from './color';
import { generateDepthScale } from './depth';
import { generateFontFamilyTokens } from './font-family';
import { generateFontWeightTokens } from './font-weight';
import { generateGridTokens } from './grid';
// TODO: Add heightScale generator when height tokens are implemented
// import { generateHeightScale } from './height';
import { generateLetterSpacingTokens } from './letter-spacing';
import { generateMotionTokens } from './motion';
import { generateOpacityTokens } from './opacity';
import { generateSpacingScale } from './spacing';
import { generateTouchTargetTokens } from './touch-target';
import { generateTransformTokens } from './transform';
import { generateTypographyScale } from './typography';
import { generateWidthTokens } from './width';

/**
 * Generate all design tokens using all generators
 * AI intelligence enrichment happens separately via TokenRegistry
 *
 * @returns Complete set of design tokens for a design system
 */
export async function generateAllTokens(): Promise<Token[]> {
  const colorTokens = await generateColorTokens(); // Async color generation with API calls

  return [
    ...generateSpacingScale('linear', 4, 1.25, 12),
    ...generateDepthScale('exponential', 10),
    // Height tokens removed - spacing scale generates h-* utilities automatically
    ...generateTypographyScale('golden', 1),
    ...colorTokens, // AI-enhanced color tokens from API
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
