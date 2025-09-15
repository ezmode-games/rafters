/**
 * OKLCH color manipulation functions
 */
import type { OKLCH } from '@rafters/shared';
/**
 * Lighten a color by increasing its lightness
 */
export declare function lighten(color: OKLCH, amount: number): OKLCH;
/**
 * Darken a color by decreasing its lightness
 */
export declare function darken(color: OKLCH, amount: number): OKLCH;
/**
 * Adjust the chroma (saturation) of a color
 */
export declare function adjustChroma(color: OKLCH, amount: number): OKLCH;
/**
 * Adjust the hue of a color by degrees
 */
export declare function adjustHue(color: OKLCH, degrees: number): OKLCH;
/**
 * Generate surface color from base color
 */
export declare function generateSurfaceColor(baseColor: OKLCH): OKLCH;
//# sourceMappingURL=manipulation.d.ts.map