/**
 * Depth Scale Generator (Shadows and Z-Index)
 *
 * Generates semantic shadow and z-index tokens for visual hierarchy and layering
 */
import type { Token } from '../index';
/**
 * Generate depth scale (shadows and z-index) with semantic layering system
 *
 * @param _system - Mathematical progression (currently exponential only)
 * @param _baseMultiplier - Base multiplier for exponential progression
 *
 * @returns Array of depth tokens (shadows and z-index) with AI intelligence metadata
 *
 * @example
 * ```typescript
 * const depthTokens = generateDepthScale('exponential', 10);
 * // Generates: shadow tokens (none, sm, base, md, lg, xl, 2xl)
 * // and z-index tokens (base, sticky, dropdown, modal, popover, notification, tooltip)
 * ```
 */
export declare function generateDepthScale(_system?: 'linear' | 'exponential', _baseMultiplier?: number): Token[];
//# sourceMappingURL=depth.d.ts.map