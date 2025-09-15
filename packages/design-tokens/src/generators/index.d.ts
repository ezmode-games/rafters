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
import type { Token } from '@rafters/shared';
/**
 * Generate all design tokens using all generators
 * AI intelligence enrichment happens separately via TokenRegistry
 *
 * @returns Complete set of design tokens for a design system
 */
export declare function generateAllTokens(): Promise<Token[]>;
//# sourceMappingURL=index.d.ts.map