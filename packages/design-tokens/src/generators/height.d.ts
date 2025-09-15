/**
 * Height Scale Generator
 *
 * Component height system with responsive variants and accessibility validation
 * Ensures proper touch targets and usability across devices
 */
import type { Token } from '../index';
/**
 * Generate height scale for component sizing with responsive variants
 *
 * @param system - Mathematical progression: linear, golden ratio, or custom exponential
 * @param baseUnit - Base unit in rem (default: 2.5 for good touch targets)
 * @param multiplier - Multiplier for custom system (default: 1.25)
 * @param generateResponsive - Generate viewport and container query variants (default: true)
 *
 * @returns Array of height tokens with AI intelligence metadata and accessibility validation
 *
 * @example
 * ```typescript
 * // Generate standard linear height scale
 * const heights = generateHeightScale('linear', 2.5, 1.25, true);
 *
 * // Generate golden ratio heights for premium feel
 * const goldenHeights = generateHeightScale('golden', 2.5, 1.25, true);
 *
 * // Custom exponential progression
 * const customHeights = generateHeightScale('custom', 2.5, 1.125, true);
 * ```
 */
export declare function generateHeightScale(system?: 'linear' | 'golden' | 'custom', baseUnit?: number, // rem
multiplier?: number): Token[];
//# sourceMappingURL=height.d.ts.map