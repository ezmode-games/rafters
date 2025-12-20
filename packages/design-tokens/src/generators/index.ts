/**
 * Design Token Generators
 *
 * Orchestrates all token generators to produce a complete base design system.
 * Each generator produces tokens for a specific namespace, which are then
 * combined and can be serialized to namespace-based JSON files.
 *
 * The generators use:
 * - @rafters/math-utils for mathematical progressions (minor-third 1.2 ratio)
 * - OKLCH color space for perceptually uniform colors
 * - Full Token schema with intelligence metadata for MCP access
 */

import type { Token } from '@rafters/shared';
import type { BaseSystemConfig, ResolvedSystemConfig, GeneratorFn } from './types.js';
import { DEFAULT_SYSTEM_CONFIG, resolveConfig } from './types.js';

// Import all generators
import { generateColorTokens } from './color.js';
import { generateSpacingTokens } from './spacing.js';
import { generateTypographyTokens } from './typography.js';
import { generateSemanticTokens } from './semantic.js';
import { generateRadiusTokens } from './radius.js';
import { generateShadowTokens } from './shadow.js';
import { generateDepthTokens } from './depth.js';
import { generateElevationTokens } from './elevation.js';
import { generateMotionTokens } from './motion.js';
import { generateFocusTokens } from './focus.js';
import { generateBreakpointTokens } from './breakpoint.js';

// Export all generators individually
export { generateColorTokens } from './color.js';
export { generateSpacingTokens } from './spacing.js';
export { generateTypographyTokens } from './typography.js';
export { generateSemanticTokens } from './semantic.js';
export { generateRadiusTokens } from './radius.js';
export { generateShadowTokens } from './shadow.js';
export { generateDepthTokens } from './depth.js';
export { generateElevationTokens } from './elevation.js';
export { generateMotionTokens } from './motion.js';
export { generateFocusTokens } from './focus.js';
export { generateBreakpointTokens } from './breakpoint.js';

// Export types
export * from './types.js';

/**
 * All available generators in dependency order
 * Generators that depend on others come after their dependencies
 */
const ALL_GENERATORS: Array<{ name: string; fn: GeneratorFn }> = [
  // Foundation tokens (no dependencies)
  { name: 'color', fn: generateColorTokens },
  { name: 'spacing', fn: generateSpacingTokens },
  { name: 'typography', fn: generateTypographyTokens },
  { name: 'breakpoint', fn: generateBreakpointTokens },

  // Semantic tokens (depend on color)
  { name: 'semantic', fn: generateSemanticTokens },

  // Derived tokens (depend on spacing/foundation)
  { name: 'radius', fn: generateRadiusTokens },
  { name: 'shadow', fn: generateShadowTokens },
  { name: 'depth', fn: generateDepthTokens },
  { name: 'motion', fn: generateMotionTokens },

  // Composite tokens (depend on multiple)
  { name: 'elevation', fn: generateElevationTokens },
  { name: 'focus', fn: generateFocusTokens },
];

/**
 * Result of running all generators
 */
export interface GenerateAllResult {
  /** All tokens by namespace */
  byNamespace: Map<string, Token[]>;

  /** Flat array of all tokens */
  allTokens: Token[];

  /** Generation metadata */
  metadata: {
    generatedAt: string;
    config: ResolvedSystemConfig;
    tokenCount: number;
    namespaces: string[];
  };
}

/**
 * Generate the complete base design system
 *
 * @param config - Optional configuration overrides
 * @returns All tokens organized by namespace
 *
 * @example
 * ```typescript
 * // Generate with defaults (baseSpacingUnit=4, minor-third progression)
 * const result = generateBaseSystem();
 *
 * // Generate with different progression (all values recalculated)
 * const result = generateBaseSystem({
 *   progressionRatio: 'perfect-fourth', // 1.333 ratio - whole system regenerates
 * });
 *
 * // Override specific derived values while keeping the system
 * const result = generateBaseSystem({
 *   baseFontSizeOverride: 18, // Override computed font size
 * });
 *
 * // Access tokens by namespace
 * const spacingTokens = result.byNamespace.get('spacing');
 *
 * // Serialize to JSON files
 * for (const [namespace, tokens] of result.byNamespace) {
 *   fs.writeFileSync(
 *     `.rafters/tokens/${namespace}.json`,
 *     JSON.stringify(tokens, null, 2)
 *   );
 * }
 * ```
 */
export function generateBaseSystem(config: Partial<BaseSystemConfig> = {}): GenerateAllResult {
  const mergedConfig: BaseSystemConfig = {
    ...DEFAULT_SYSTEM_CONFIG,
    ...config,
  };

  // Resolve derived values from baseSpacingUnit
  const resolvedConfig = resolveConfig(mergedConfig);

  const byNamespace = new Map<string, Token[]>();
  const allTokens: Token[] = [];

  for (const { fn } of ALL_GENERATORS) {
    const result = fn(resolvedConfig);
    byNamespace.set(result.namespace, result.tokens);
    allTokens.push(...result.tokens);
  }

  return {
    byNamespace,
    allTokens,
    metadata: {
      generatedAt: new Date().toISOString(),
      config: resolvedConfig,
      tokenCount: allTokens.length,
      namespaces: Array.from(byNamespace.keys()),
    },
  };
}

/**
 * Generate tokens for specific namespaces only
 *
 * @param namespaces - Array of namespace names to generate
 * @param config - Optional configuration overrides
 * @returns Tokens for requested namespaces only
 *
 * @example
 * ```typescript
 * // Generate only color and semantic tokens
 * const result = generateNamespaces(['color', 'semantic']);
 * ```
 */
export function generateNamespaces(
  namespaces: string[],
  config: Partial<BaseSystemConfig> = {}
): GenerateAllResult {
  const mergedConfig: BaseSystemConfig = {
    ...DEFAULT_SYSTEM_CONFIG,
    ...config,
  };

  // Resolve derived values from baseSpacingUnit
  const resolvedConfig = resolveConfig(mergedConfig);

  const byNamespace = new Map<string, Token[]>();
  const allTokens: Token[] = [];

  const requestedGenerators = ALL_GENERATORS.filter(
    (g) => namespaces.includes(g.name)
  );

  for (const { fn } of requestedGenerators) {
    const result = fn(resolvedConfig);
    byNamespace.set(result.namespace, result.tokens);
    allTokens.push(...result.tokens);
  }

  return {
    byNamespace,
    allTokens,
    metadata: {
      generatedAt: new Date().toISOString(),
      config: resolvedConfig,
      tokenCount: allTokens.length,
      namespaces: Array.from(byNamespace.keys()),
    },
  };
}

/**
 * Convert tokens to namespace-based JSON structure
 * Ready for writing to .rafters/tokens/ directory
 *
 * @param result - Result from generateBaseSystem or generateNamespaces
 * @returns Object with namespace keys and token arrays as values
 *
 * @example
 * ```typescript
 * const result = generateBaseSystem();
 * const jsonFiles = toNamespaceJSON(result);
 *
 * // jsonFiles = {
 * //   color: [...tokens],
 * //   spacing: [...tokens],
 * //   ...
 * // }
 * ```
 */
export function toNamespaceJSON(result: GenerateAllResult): Record<string, Token[]> {
  const output: Record<string, Token[]> = {};

  for (const [namespace, tokens] of result.byNamespace) {
    output[namespace] = tokens;
  }

  return output;
}

/**
 * Get a flat map of token name to token for quick lookups
 *
 * @param result - Result from generateBaseSystem or generateNamespaces
 * @returns Map of token names to Token objects
 */
export function toTokenMap(result: GenerateAllResult): Map<string, Token> {
  const map = new Map<string, Token>();

  for (const token of result.allTokens) {
    map.set(token.name, token);
  }

  return map;
}

/**
 * Get list of all available namespaces
 */
export function getAvailableNamespaces(): string[] {
  return ALL_GENERATORS.map((g) => g.name);
}

/**
 * Get generator metadata
 */
export function getGeneratorInfo(): Array<{ name: string; description: string }> {
  return [
    { name: 'color', description: 'Neutral color family with 11-position OKLCH scale' },
    { name: 'spacing', description: 'Spacing scale using minor-third (1.2) progression' },
    { name: 'typography', description: 'Typography scale with font sizes, weights, line heights' },
    { name: 'breakpoint', description: 'Viewport and container query breakpoints' },
    { name: 'semantic', description: 'Semantic color tokens (primary, destructive, success, etc.)' },
    { name: 'radius', description: 'Border radius scale using minor-third progression' },
    { name: 'shadow', description: 'Shadow scale derived from spacing progression' },
    { name: 'depth', description: 'Z-index scale for stacking context management' },
    { name: 'motion', description: 'Duration, easing, and delay tokens for animations' },
    { name: 'elevation', description: 'Elevation levels pairing depth with shadows' },
    { name: 'focus', description: 'Focus ring tokens for WCAG 2.2 compliance' },
  ];
}
