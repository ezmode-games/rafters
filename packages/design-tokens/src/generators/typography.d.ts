/**
 * Typography Scale Generator
 *
 * Musical harmony-based typography system with responsive variants
 * Uses mathematical ratios from music theory for pleasing proportions
 */
import type { Token } from '../index';
/**
 * Generate typography scale using golden ratio or musical intervals with responsive variants
 *
 * @param system - Musical interval or mathematical ratio for scaling
 * @param baseSize - Base font size in rem (default: 1rem = 16px)
 * @param generateResponsive - Generate viewport and container query variants (default: true)
 *
 * @returns Array of typography tokens with AI intelligence metadata and paired line heights
 *
 * @example
 * ```typescript
 * // Generate golden ratio typography for premium feel
 * const goldenType = generateTypographyScale('golden', 1, true);
 *
 * // Generate major third scale for balanced harmony
 * const harmonicType = generateTypographyScale('major-third', 1, true);
 *
 * // Generate perfect fifth for dramatic scaling
 * const dramaticType = generateTypographyScale('perfect-fifth', 1, true);
 * ```
 */
export declare function generateTypographyScale(system?: 'golden' | 'major-second' | 'minor-third' | 'major-third' | 'perfect-fourth' | 'perfect-fifth', baseSize?: number): Token[];
//# sourceMappingURL=typography.d.ts.map