/**
 * @rafters/color-utils
 *
 * OKLCH color utilities, accessibility calculations, and color vision simulation
 * for the Rafters AI design intelligence system.
 */
import type { OKLCH, ColorVisionType } from '@rafters/shared';
/**
 * Convert hex color to OKLCH
 * This is a simplified conversion - in production we'd use a proper color library
 */
export declare function hexToOKLCH(hex: string): OKLCH;
/**
 * Convert OKLCH to CSS oklch() string
 */
export declare function oklchToCSS(oklch: OKLCH): string;
/**
 * Generate perceptually uniform lightness scale
 * Creates a scale from 50-950 similar to Tailwind
 */
export declare function generateLightnessScale(baseColor: OKLCH): Record<number, OKLCH>;
/**
 * Calculate WCAG contrast ratio between two OKLCH colors
 * Simplified implementation - use proper library in production
 */
export declare function calculateContrast(foreground: OKLCH, background: OKLCH): number;
/**
 * Check if contrast meets WCAG standards
 */
export declare function meetsContrastStandard(foreground: OKLCH, background: OKLCH, standard?: 'AA' | 'AAA', largeText?: boolean): boolean;
/**
 * Simulate color vision deficiency
 * Simplified simulation - use proper library in production
 */
export declare function simulateColorVision(color: OKLCH, type: ColorVisionType): OKLCH;
/**
 * Generate semantic colors that work across all color vision types
 */
export declare function generateSemanticColors(primary: OKLCH): {
    success: OKLCH;
    warning: OKLCH;
    danger: OKLCH;
    info: OKLCH;
};
