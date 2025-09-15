/**
 * Advanced harmony generation for design systems
 * Inspired by Leonardo's color theory approach
 */
import type { OKLCH } from '@rafters/shared';
/**
 * Generate a Rafters harmony plus optimal gray
 * Based on advanced color theory and perceptual optimization
 */
export declare function generateHarmony(baseColor: OKLCH): {
    base: OKLCH;
    complementary: OKLCH;
    analogous1: OKLCH;
    analogous2: OKLCH;
    triadic1: OKLCH;
    triadic2: OKLCH;
    tetradic1: OKLCH;
    tetradic2: OKLCH;
    tetradic3: OKLCH;
    splitComplementary1: OKLCH;
    splitComplementary2: OKLCH;
    neutral?: OKLCH;
};
/**
 * Generate Rafters semantic harmony by mapping traditional color theory to design system roles
 * Uses Leonardo theory to intelligently assign traditional harmonies to UI semantics
 */
export declare function generateRaftersHarmony(baseColor: OKLCH): {
    primary: OKLCH;
    secondary: OKLCH;
    tertiary: OKLCH;
    accent: OKLCH;
    highlight: OKLCH;
    surface: OKLCH;
    neutral: OKLCH;
};
/**
 * Generate semantic color suggestions based on color theory and conventional expectations
 * Each semantic color gets multiple suggestions for user choice
 */
export declare function generateSemanticColorSuggestions(baseColor: OKLCH): {
    danger: OKLCH[];
    success: OKLCH[];
    warning: OKLCH[];
    info: OKLCH[];
};
/**
 * Generate OKLCH color scale from base color optimized for accessibility
 * Creates 50-950 scale with contrast-based lightness progression
 * Optimized for both light and dark mode usage patterns
 */
export declare function generateOKLCHScale(baseColor: OKLCH): Record<string, OKLCH>;
/**
 * Colors get cooler and lighter with distance
 * Applied to UI: background colors should be cooler/lighter, foreground warmer/darker
 */
export declare function calculateAtmosphericWeight(color: OKLCH): {
    distanceWeight: number;
    temperature: 'warm' | 'neutral' | 'cool';
    atmosphericRole: 'background' | 'midground' | 'foreground';
};
/**
 * some colors feel "heavier" than others
 * Used for visual balance in UI layouts
 */
export declare function calculatePerceptualWeight(color: OKLCH): {
    weight: number;
    density: 'light' | 'medium' | 'heavy';
    balancingRecommendation: string;
};
/**
 * semantic color enhancement
 * Applies atmospheric perspective, simultaneous contrast, and perceptual weight
 */
export declare function generateSemanticColors(baseColor: OKLCH, semanticSuggestions: ReturnType<typeof generateSemanticColorSuggestions>): {
    danger: {
        colors: (OKLCH & {
            atmosphericWeight: ReturnType<typeof calculateAtmosphericWeight>;
            perceptualWeight: ReturnType<typeof calculatePerceptualWeight>;
            enhancedVersion?: OKLCH;
            harmonicTension?: number;
        })[];
        contextualRecommendations: string[];
    };
    success: {
        colors: (OKLCH & {
            atmosphericWeight: ReturnType<typeof calculateAtmosphericWeight>;
            perceptualWeight: ReturnType<typeof calculatePerceptualWeight>;
            enhancedVersion?: OKLCH;
            harmonicTension?: number;
        })[];
        contextualRecommendations: string[];
    };
    warning: {
        colors: (OKLCH & {
            atmosphericWeight: ReturnType<typeof calculateAtmosphericWeight>;
            perceptualWeight: ReturnType<typeof calculatePerceptualWeight>;
            enhancedVersion?: OKLCH;
            harmonicTension?: number;
        })[];
        contextualRecommendations: string[];
    };
    info: {
        colors: (OKLCH & {
            atmosphericWeight: ReturnType<typeof calculateAtmosphericWeight>;
            perceptualWeight: ReturnType<typeof calculatePerceptualWeight>;
            enhancedVersion?: OKLCH;
            harmonicTension?: number;
        })[];
        contextualRecommendations: string[];
    };
};
//# sourceMappingURL=harmony.d.ts.map