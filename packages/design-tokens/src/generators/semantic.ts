/**
 * Semantic Color Generator
 *
 * Generates semantic color tokens using the single source of truth from defaults.ts.
 * All semantic mappings (primary, secondary, destructive, success, warning, info,
 * highlight, sidebar tokens, chart colors, etc.) are defined in DEFAULT_SEMANTIC_COLOR_MAPPINGS.
 *
 * Uses ColorReference to point to color families + positions, allowing
 * the underlying colors to change while semantic meaning stays consistent.
 *
 * Supports both light and dark mode references.
 */

import type { ColorReference, Token } from '@rafters/shared';
import { DEFAULT_SEMANTIC_COLOR_MAPPINGS, type SemanticColorMapping } from './defaults.js';
import type { GeneratorResult, ResolvedSystemConfig } from './types.js';

/**
 * Helper to convert SemanticColorMapping to ColorReference for light mode
 */
function toColorRef(mapping: SemanticColorMapping): ColorReference {
  return { family: mapping.light.family, position: mapping.light.position };
}

/**
 * Get dark mode color reference from mapping
 */
function toDarkColorRef(mapping: SemanticColorMapping): ColorReference {
  return { family: mapping.dark.family, position: mapping.dark.position };
}

/**
 * Generate semantic color tokens from the single source of truth.
 *
 * Uses DEFAULT_SEMANTIC_COLOR_MAPPINGS from defaults.ts which contains
 * all semantic color definitions with proper color family references.
 */
export function generateSemanticTokens(_config: ResolvedSystemConfig): GeneratorResult {
  const tokens: Token[] = [];
  const timestamp = new Date().toISOString();

  for (const [name, mapping] of Object.entries(DEFAULT_SEMANTIC_COLOR_MAPPINGS)) {
    const lightRef = toColorRef(mapping);
    const darkRef = toDarkColorRef(mapping);

    // Build dependencies list - both light and dark mode colors
    const dependsOn: string[] = [`${lightRef.family}-${lightRef.position}`];
    if (darkRef.family !== lightRef.family || darkRef.position !== lightRef.position) {
      dependsOn.push(`${darkRef.family}-${darkRef.position}`);
    }

    tokens.push({
      name,
      value: lightRef, // Light mode is default value; dark mode lookup via DEFAULT_SEMANTIC_COLOR_MAPPINGS
      category: 'color',
      namespace: 'semantic',
      semanticMeaning: mapping.meaning,
      usageContext: mapping.contexts,
      trustLevel: mapping.trustLevel,
      consequence: mapping.consequence,
      dependsOn,
      description: `${mapping.meaning}. Light: ${lightRef.family}-${lightRef.position}, Dark: ${darkRef.family}-${darkRef.position}.`,
      generatedAt: timestamp,
      containerQueryAware: true,
      usagePatterns: {
        do: mapping.do,
        never: mapping.never,
      },
      requiresConfirmation:
        mapping.consequence === 'destructive' || mapping.consequence === 'permanent',
    });
  }

  return {
    namespace: 'semantic',
    tokens,
  };
}
