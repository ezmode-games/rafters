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
 *
 * Each token gets a generationRule so the dependency graph can auto-cascade
 * when the underlying color family changes:
 * - contrast:auto for foreground tokens (WCAG-safe pairing)
 * - state:hover/active/focus/disabled for state variants
 * - scale:N for direct position references (base, border, ring, subtle)
 */

import type { Binding, ColorReference, Token } from '@rafters/shared';
import { DEFAULT_SEMANTIC_COLOR_MAPPINGS, type SemanticColorMapping } from './defaults.js';
import type { GeneratorResult, ResolvedSystemConfig } from './types.js';

const POSITION_TO_INDEX: Record<string, number> = {
  '50': 0,
  '100': 1,
  '200': 2,
  '300': 3,
  '400': 4,
  '500': 5,
  '600': 6,
  '700': 7,
  '800': 8,
  '900': 9,
  '950': 10,
};

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
 * Determine the generation rule for a semantic token based on its name and role.
 *
 * Pattern matching:
 * - *-foreground, *-text, *-contrast -> contrast:auto (WCAG pair lookup)
 * - *-hover -> state:hover
 * - *-active -> state:active
 * - *-focus -> state:focus
 * - *-disabled -> state:disabled
 * - everything else -> scale:position (direct reference)
 */
function deriveGenerationRule(name: string, lightRef: ColorReference): string {
  // Foreground/text tokens need WCAG contrast pairing
  if (name.endsWith('-foreground') || name.endsWith('-text') || name.endsWith('-contrast')) {
    return 'contrast:auto';
  }

  // State variant tokens
  if (name.endsWith('-hover') && !name.endsWith('-hover-foreground')) {
    return 'state:hover';
  }
  if (name.endsWith('-active') && !name.endsWith('-active-foreground')) {
    return 'state:active';
  }
  if (name.endsWith('-focus') && !name.endsWith('-focus-foreground')) {
    return 'state:focus';
  }
  if (name.endsWith('-disabled') && !name.endsWith('-disabled-foreground')) {
    return 'state:disabled';
  }

  // Everything else: direct scale position reference
  return `scale:${lightRef.position}`;
}

/**
 * Build a Binding for a semantic token from its light-mode reference.
 *
 * The mapping in DEFAULT_SEMANTIC_COLOR_MAPPINGS already encodes the
 * designer's chosen position for each semantic role. The binding's job on
 * family remap is to keep that chosen position and just swap the family --
 * so every semantic token binds to the scale plugin at its mapped position,
 * regardless of -foreground / -hover / -active / -focus / -disabled suffix.
 *
 * Suffix-driven plugins (contrast, state) exist for users to opt into
 * explicitly via registry.bind(); the generator does not auto-apply them
 * because doing so overrides the designer's mapped position with the
 * plugin's computed answer (the v1 cascade bug).
 */
function deriveBinding(lightRef: ColorReference): Binding | undefined {
  const scalePosition = POSITION_TO_INDEX[lightRef.position];
  if (scalePosition === undefined) return undefined;
  return { plugin: 'scale', input: { familyName: lightRef.family, scalePosition } };
}

/**
 * Generate semantic color tokens from the single source of truth.
 *
 * Uses DEFAULT_SEMANTIC_COLOR_MAPPINGS from defaults.ts which contains
 * all semantic color definitions with proper color family references.
 *
 * Each token includes a generationRule so the registry's dependency graph
 * can automatically cascade changes when color families are updated.
 */
export function generateSemanticTokens(_config: ResolvedSystemConfig): GeneratorResult {
  const tokens: Token[] = [];
  const timestamp = new Date().toISOString();

  for (const [name, mapping] of Object.entries(DEFAULT_SEMANTIC_COLOR_MAPPINGS)) {
    const lightRef = toColorRef(mapping);
    const darkRef = toDarkColorRef(mapping);

    // dependsOn[0] = the color family token (for ColorValue/WCAG data access)
    // dependsOn[1] = dark mode position token (for Tailwind exporter)
    const familyDep = lightRef.family;
    const darkTokenName = `${darkRef.family}-${darkRef.position}`;
    const dependsOn: string[] = [familyDep];
    if (darkTokenName !== familyDep) {
      dependsOn.push(darkTokenName);
    }

    const generationRule = deriveGenerationRule(name, lightRef);
    const binding = deriveBinding(lightRef);

    tokens.push({
      name,
      value: lightRef, // Light mode is default value; dark mode lookup via dependsOn[1]
      category: 'color',
      namespace: 'semantic',
      ...(binding ? { binding } : {}),
      semanticMeaning: mapping.meaning,
      usageContext: mapping.contexts,
      trustLevel: mapping.trustLevel,
      consequence: mapping.consequence,
      dependsOn,
      generationRule,
      description: `${mapping.meaning}. Light: ${lightRef.family}-${lightRef.position}, Dark: ${darkRef.family}-${darkRef.position}.`,
      generatedAt: timestamp,
      containerQueryAware: true,
      userOverride: null,
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
