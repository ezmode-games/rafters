/**
 * Color analysis functions for perceptual color properties
 */
import type { OKLCH } from '@rafters/shared';
/**
 * Calculate perceptual distance between two colors using Delta E in OKLCH space
 * This is a simplified version - real Delta E calculations are more complex
 */
export declare function calculateColorDistance(color1: OKLCH, color2: OKLCH): number;
/**
 * Determine if color is light or dark based on perceptual lightness
 * Uses OKLCH lightness with adjustments for chroma
 */
export declare function isLightColor(color: OKLCH): boolean;
/**
 * Calculate color temperature (warm/cool/neutral)
 * Based on hue angle and chroma intensity
 */
export declare function getColorTemperature(color: OKLCH): 'warm' | 'cool' | 'neutral';
//# sourceMappingURL=analysis.d.ts.map