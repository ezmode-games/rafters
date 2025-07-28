/**
 * @rafters/design-tokens
 *
 * Generated design systems and semantic tokens for the Rafters AI intelligence system.
 * This package manages design token generation and Tailwind CSS output.
 */
import type { DesignSystem, OKLCH } from '@rafters/shared';
/**
 * Generate complete design system from primary color
 */
export declare function generateDesignSystem(primaryColor: OKLCH, config: {
    name: string;
    typography?: {
        heading: string;
        body: string;
        mono: string;
    };
}): DesignSystem;
/**
 * Export design system as Tailwind CSS v4+ theme
 */
export declare function exportToTailwind(system: DesignSystem): string;
