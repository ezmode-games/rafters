/**
 * Complete Tailwind CSS v4 Exporter - Registry-Based
 *
 * Generates complete globals.css file with:
 * - @theme block with all tokens from registry
 * - @theme inline for Tailwind class mappings
 * - :root block for semantic token assignments
 * - @media dark mode block
 * - All keyframes for animations
 * - Container queries with proper sizing
 *
 * Uses TokenRegistry as single source of truth for ALL tokens
 */
import type { TokenRegistry } from '../registry';
/**
 * Complete Tailwind CSS v4 export from TokenRegistry
 * Generates full globals.css file structure
 */
export declare function exportToTailwindV4Complete(registry: TokenRegistry): string;
//# sourceMappingURL=tailwind-v4.d.ts.map