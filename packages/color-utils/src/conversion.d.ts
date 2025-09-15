/**
 * OKLCH color conversion functions using colorjs.io
 */
import type { OKLCH } from '@rafters/shared';
/**
 * Convert OKLCH color object to hex string
 */
export declare function oklchToHex(oklch: OKLCH): string;
/**
 * Convert OKLCH to CSS oklch() function string
 */
export declare function oklchToCSS(oklch: OKLCH): string;
/**
 * Convert hex string to OKLCH color object
 */
export declare function hexToOKLCH(hex: string): OKLCH;
/**
 * Round OKLCH values to standard precision for consistency
 * L and C: 2 decimal places, H: whole degrees, Alpha: 2 decimal places
 * Prevents floating point precision issues and optimizes cache keys
 */
export declare function roundOKLCH(oklch: OKLCH): OKLCH;
//# sourceMappingURL=conversion.d.ts.map