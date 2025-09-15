/**
 * Unified Color Object Generator
 *
 * Single source of truth for creating complete ColorValue objects
 * Used by: API, Studio, and design-tokens generator
 * Eliminates duplication of complex mathematical color logic
 */
import type { ColorValue, OKLCH } from '@rafters/shared';
/**
 * Color context validation using shared schemas
 * Simple approach that leverages existing Zod validation
 */
export type ColorContext = {
    token?: string;
    name?: string;
    usage?: string;
    generateStates?: boolean;
    semanticRole?: 'brand' | 'semantic' | 'neutral';
};
/**
 * Generate complete ColorValue with full mathematical intelligence
 * This is the single source of truth used by API, Studio, and generators
 */
export declare function generateColorValue(baseColor: OKLCH, context?: ColorContext): ColorValue;
/**
 * Calculate mathematical color metadata for token generation
 * Provides consistent metadata calculation across all systems
 */
export declare function calculateColorMetadata(colorValue: ColorValue): {
    trustLevel: "medium" | "low" | "high" | "critical";
    cognitiveLoad: number;
    consequence: "reversible" | "significant" | "destructive";
};
/**
 * Generate cache key for color intelligence
 * Consistent cache key generation across API and Studio
 */
export declare function generateColorCacheKey(oklch: OKLCH, context?: ColorContext): string;
/**
 * Validate OKLCH values for safety
 * Shared validation logic across all systems
 */
export declare function validateOKLCH(oklch: unknown): oklch is OKLCH;
//# sourceMappingURL=generator.d.ts.map