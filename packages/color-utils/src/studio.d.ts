/**
 * Studio integration utilities for CSS and framework integration
 */
import type { OKLCH } from '@rafters/shared';
/**
 * Generate CSS custom properties from color palette
 */
export declare function generateCSSVariables(palette: Record<string, OKLCH>, prefix?: string): string;
/**
 * Generate Tailwind color configuration
 */
export declare function generateTailwindConfig(palette: Record<string, OKLCH>): Record<string, string>;
/**
 * Validate color string format (hex, rgb, hsl, oklch, named)
 */
export declare function isValidColorString(colorString: string): boolean;
/**
 * Parse any color string format to OKLCH
 */
export declare function parseColorString(colorString: string): OKLCH;
//# sourceMappingURL=studio.d.ts.map