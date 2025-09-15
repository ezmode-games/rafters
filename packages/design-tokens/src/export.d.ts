/**
 * Token Export System
 *
 * Exports tokens from TokenRegistry to various CSS formats
 * Works with the registry as the source of truth, not JSON files directly
 *
 * Supports:
 * - Tailwind CSS v4 with proper @theme syntax
 * - Standard CSS custom properties
 * - React Native style objects (future)
 */
import type { TokenRegistry } from './registry';
/**
 * Export tokens to Tailwind CSS v4 format
 * Generates @theme block with proper CSS custom properties
 * Respects dependency relationships when ordering output
 */
export declare function exportToTailwindCSS(registry: TokenRegistry): string;
/**
 * Export tokens to standard CSS custom properties
 * For projects not using Tailwind
 */
export declare function exportToCSSVariables(registry: TokenRegistry): string;
/**
 * Export color scales from ColorValue objects
 * Generates all shades (50-950) as individual CSS variables
 */
export declare function exportColorScales(registry: TokenRegistry): string;
/**
 * Main export function that combines all exports based on format
 */
export declare function exportTokensFromRegistry(registry: TokenRegistry, format?: 'tailwind' | 'css' | 'all'): string;
//# sourceMappingURL=export.d.ts.map