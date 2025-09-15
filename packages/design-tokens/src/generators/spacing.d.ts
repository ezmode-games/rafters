/**
 * Spacing Scale Generator
 *
 * Mathematical spacing system with responsive and container query variants
 * Supports linear, golden ratio, and custom exponential progressions
 */
import type { Token } from '../index';
/**
 * Generate spacing scale based on mathematical system
 *
 * @param system - Mathematical progression: linear, golden ratio, or custom exponential
 * @param baseUnit - Base unit in PIXELS (default: 4px = 0.25rem)
 * @param multiplier - Multiplier for custom system (default: 1.25, Tailwind-like)
 * @param steps - Number of steps to generate (default: 12)
 *
 * @returns Array of base spacing tokens with AI intelligence metadata
 *
 * @example
 * ```typescript
 * // Generate Tailwind-like linear spacing (0, 0.25rem, 0.5rem, 0.75rem, 1rem...)
 * const linearSpacing = generateSpacingScale('linear', 4, 1.25, 12);
 *
 * // Generate golden ratio spacing for premium feel
 * const goldenSpacing = generateSpacingScale('golden', 4, 1.25, 8);
 *
 * // Custom exponential with tighter progression
 * const customSpacing = generateSpacingScale('custom', 4, 1.125, 10);
 * ```
 */
export declare function generateSpacingScale(system: 'linear' | 'golden' | 'custom', baseUnit?: number, multiplier?: number, steps?: number): Token[];
//# sourceMappingURL=spacing.d.ts.map