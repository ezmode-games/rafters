/**
 * Accessibility contrast calculation and compliance checking functions
 */
import type { OKLCH } from '@rafters/shared';
/**
 * Calculate WCAG 2.1 contrast ratio between two colors
 */
export declare function calculateWCAGContrast(foreground: OKLCH, background: OKLCH): number;
/**
 * Calculate APCA contrast for modern accessibility
 * Uses the official APCA algorithm via apca-w3 library
 */
export declare function calculateAPCAContrast(foreground: OKLCH, background: OKLCH): number;
/**
 * Check if color pair meets WCAG contrast standards
 */
export declare function meetsWCAGStandard(foreground: OKLCH, background: OKLCH, level: 'AA' | 'AAA', textSize: 'normal' | 'large'): boolean;
/**
 * Check if color pair meets APCA contrast standards
 */
export declare function meetsAPCAStandard(foreground: OKLCH, background: OKLCH, textSize: number): boolean;
/**
 * Pre-computed accessibility contrast matrix interface
 * Stores WCAG AA/AAA compliance pairs as indices into color scales
 */
export interface AccessibilityMetadata {
    wcagAA: {
        normal: number[][];
        large: number[][];
    };
    wcagAAA: {
        normal: number[][];
        large: number[][];
    };
    onWhite: {
        aa: number[];
        aaa: number[];
    };
    onBlack: {
        aa: number[];
        aaa: number[];
    };
}
/**
 * Generate pre-computed accessibility metadata for a color scale
 * Eliminates expensive on-demand contrast calculations by storing all valid pairs as indices
 */
export declare function generateAccessibilityMetadata(scale: OKLCH[]): AccessibilityMetadata;
/**
 * Find the closest accessible color to target color
 */
export declare function findAccessibleColor(targetColor: OKLCH, backgroundColor: OKLCH, standard: 'WCAG-AA' | 'WCAG-AAA' | 'APCA'): OKLCH;
//# sourceMappingURL=accessibility.d.ts.map