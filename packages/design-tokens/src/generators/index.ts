/**
 * Design Token Generators
 *
 * Orchestrates all token generators to produce a complete base design system.
 * Each generator produces tokens for a specific namespace, which are then
 * combined and can be serialized to namespace-based JSON files.
 *
 * Color is the only namespace whose shape diverged from v1: families stay whole
 * (ColorValue with scale array) and per-position tokens carry ColorReference
 * values resolved at export. Every other namespace's generator and token shape
 * is ported drop-in from v1.
 */

import type { OKLCH, Token } from '@rafters/shared';
import { generateBreakpointTokens } from './breakpoint.js';
import { COLOR_SCALE_POSITIONS, type ColorFamilyInput, generateColorTokens } from './color.js';
import {
  type ColorPaletteBase,
  DEFAULT_BREAKPOINTS,
  DEFAULT_COLOR_PALETTE_BASES,
  DEFAULT_COLOR_SCALES,
  DEFAULT_CONTAINER_BREAKPOINTS,
  DEFAULT_DELAY_DEFINITIONS,
  DEFAULT_DEPTH_DEFINITIONS,
  DEFAULT_DURATION_DEFINITIONS,
  DEFAULT_EASING_DEFINITIONS,
  DEFAULT_ELEVATION_DEFINITIONS,
  DEFAULT_FILL_DEFINITIONS,
  DEFAULT_FOCUS_CONFIGS,
  DEFAULT_FONT_WEIGHTS,
  DEFAULT_RADIUS_DEFINITIONS,
  DEFAULT_SHADOW_DEFINITIONS,
  DEFAULT_SPACING_MULTIPLIERS,
  DEFAULT_TYPOGRAPHY_SCALE,
} from './defaults.js';
import { generateDepthTokens } from './depth.js';
import { generateElevationTokens } from './elevation.js';
import { generateFillTokens } from './fill.js';
import { generateFocusTokens } from './focus.js';
import { generateMotionTokens } from './motion.js';
import { generateRadiusTokens } from './radius.js';
import { generateSemanticTokens } from './semantic.js';
import { generateShadowTokens } from './shadow.js';
import { generateSpacingTokens } from './spacing.js';
import type { BaseSystemConfig, ResolvedSystemConfig } from './types.js';
import { DEFAULT_SYSTEM_CONFIG, resolveConfig } from './types.js';
import { generateTypographyTokens } from './typography.js';
import { generateTypographyCompositeTokens } from './typography-composite.js';

export { generateBreakpointTokens } from './breakpoint.js';
// Re-export everything from generators for downstream consumers
export {
  COLOR_SCALE_POSITIONS,
  type ColorFamilyInput,
  generateColorTokens,
} from './color.js';
export * from './defaults.js';
export { generateDepthTokens } from './depth.js';
export { generateElevationTokens } from './elevation.js';
export { generateFillTokens } from './fill.js';
export { generateFocusTokens } from './focus.js';
export { generateMotionTokens } from './motion.js';
export { generateRadiusTokens } from './radius.js';
export { generateSemanticTokens } from './semantic.js';
export { generateShadowTokens } from './shadow.js';
export { generateSpacingTokens } from './spacing.js';
export * from './types.js';
export { generateTypographyTokens } from './typography.js';
export { generateTypographyCompositeTokens } from './typography-composite.js';

/** Reference lightness used when generating a scale from a palette base. Matches v1's color generator. */
const PALETTE_BASE_LIGHTNESS = 0.55;

/**
 * Convert v1's hand-tuned scale Record + paletteBase Hue/Chroma sets into the
 * ColorFamilyInput[] shape the new color generator consumes. Hand-tuned scales
 * pass through; palette-base entries get a base OKLCH that the generator will
 * expand to a full scale via `generateOKLCHScale`.
 */
function buildColorFamilyInputs(
  customPaletteBases?: Record<string, ColorPaletteBase>,
): ColorFamilyInput[] {
  const families: ColorFamilyInput[] = [];

  // Hand-tuned scales first (e.g. neutral).
  for (const colorScale of DEFAULT_COLOR_SCALES) {
    const scaleArray = scaleRecordToArray(colorScale.scale);
    const base = scaleArray[COLOR_SCALE_POSITIONS.indexOf('500')] ?? scaleArray[5];
    if (!base) continue;
    families.push({
      name: colorScale.name,
      oklch: { l: base.l, c: base.c, h: base.h },
      scale: scaleArray,
    });
  }

  // Palette bases (hue + chroma) — generator computes the scale.
  const bases = customPaletteBases ?? DEFAULT_COLOR_PALETTE_BASES;
  for (const [name, base] of Object.entries(bases)) {
    families.push({
      name,
      oklch: { l: PALETTE_BASE_LIGHTNESS, c: base.chroma, h: base.hue },
    });
  }

  return families;
}

function scaleRecordToArray(scale: Record<string, OKLCH>): OKLCH[] {
  const out: OKLCH[] = [];
  for (const pos of COLOR_SCALE_POSITIONS) {
    const entry = scale[pos];
    if (entry) out.push(entry);
  }
  return out;
}

/** Generator binding — name + how to call the generator with its defaults. */
interface GeneratorDef {
  name: string;
  generate: (config: ResolvedSystemConfig) => { namespace: string; tokens: Token[] };
}

function createGeneratorDefs(colorPaletteBases?: Record<string, ColorPaletteBase>): GeneratorDef[] {
  const families = buildColorFamilyInputs(colorPaletteBases);
  return [
    {
      name: 'color',
      generate: (_config) => ({ namespace: 'color', tokens: generateColorTokens(families) }),
    },
    {
      name: 'spacing',
      generate: (config) => generateSpacingTokens(config, DEFAULT_SPACING_MULTIPLIERS),
    },
    {
      name: 'typography',
      generate: (config) =>
        generateTypographyTokens(config, DEFAULT_TYPOGRAPHY_SCALE, DEFAULT_FONT_WEIGHTS),
    },
    {
      name: 'breakpoint',
      generate: (config) =>
        generateBreakpointTokens(config, DEFAULT_BREAKPOINTS, DEFAULT_CONTAINER_BREAKPOINTS),
    },
    { name: 'semantic', generate: (config) => generateSemanticTokens(config) },
    {
      name: 'typography-composite',
      generate: (config) => generateTypographyCompositeTokens(config),
    },
    {
      name: 'radius',
      generate: (config) => generateRadiusTokens(config, DEFAULT_RADIUS_DEFINITIONS),
    },
    {
      name: 'shadow',
      generate: (config) => generateShadowTokens(config, DEFAULT_SHADOW_DEFINITIONS),
    },
    {
      name: 'depth',
      generate: (config) => generateDepthTokens(config, DEFAULT_DEPTH_DEFINITIONS),
    },
    {
      name: 'motion',
      generate: (config) =>
        generateMotionTokens(
          config,
          DEFAULT_DURATION_DEFINITIONS,
          DEFAULT_EASING_DEFINITIONS,
          DEFAULT_DELAY_DEFINITIONS,
        ),
    },
    {
      name: 'fill',
      generate: (config) => generateFillTokens(config, DEFAULT_FILL_DEFINITIONS),
    },
    {
      name: 'elevation',
      generate: (config) => generateElevationTokens(config, DEFAULT_ELEVATION_DEFINITIONS),
    },
    {
      name: 'focus',
      generate: (config) => generateFocusTokens(config, DEFAULT_FOCUS_CONFIGS),
    },
  ];
}

export interface BuildSystemResult {
  byNamespace: Map<string, Token[]>;
  allTokens: Token[];
  metadata: {
    generatedAt: string;
    config: ResolvedSystemConfig;
    tokenCount: number;
    namespaces: string[];
  };
}

/**
 * Generate the complete base design system. Drop-in equivalent to v1's
 * `generateBaseSystem`. Non-color generators emit the same shape v1 produces;
 * color uses the families-stay-whole shape from this package.
 */
export function buildSystem(config: Partial<BaseSystemConfig> = {}): BuildSystemResult {
  const mergedConfig: BaseSystemConfig = { ...DEFAULT_SYSTEM_CONFIG, ...config };
  const resolvedConfig = resolveConfig(mergedConfig);

  const byNamespace = new Map<string, Token[]>();
  const allTokens: Token[] = [];

  const generators = createGeneratorDefs(mergedConfig.colorPaletteBases);
  for (const { generate } of generators) {
    const result = generate(resolvedConfig);
    const existing = byNamespace.get(result.namespace) ?? [];
    byNamespace.set(result.namespace, [...existing, ...result.tokens]);
    allTokens.push(...result.tokens);
  }

  return {
    byNamespace,
    allTokens,
    metadata: {
      generatedAt: new Date().toISOString(),
      config: resolvedConfig,
      tokenCount: allTokens.length,
      namespaces: [...byNamespace.keys()],
    },
  };
}

/**
 * Generate tokens for specific namespaces only. Useful for re-running a slice
 * after a config change without paying for the whole graph.
 */
export function generateNamespaces(
  namespaces: readonly string[],
  config: Partial<BaseSystemConfig> = {},
): BuildSystemResult {
  const mergedConfig: BaseSystemConfig = { ...DEFAULT_SYSTEM_CONFIG, ...config };
  const resolvedConfig = resolveConfig(mergedConfig);

  const byNamespace = new Map<string, Token[]>();
  const allTokens: Token[] = [];

  const generators = createGeneratorDefs(mergedConfig.colorPaletteBases);
  const requested = generators.filter((g) => namespaces.includes(g.name));

  for (const { generate } of requested) {
    const result = generate(resolvedConfig);
    const existing = byNamespace.get(result.namespace) ?? [];
    byNamespace.set(result.namespace, [...existing, ...result.tokens]);
    allTokens.push(...result.tokens);
  }

  return {
    byNamespace,
    allTokens,
    metadata: {
      generatedAt: new Date().toISOString(),
      config: resolvedConfig,
      tokenCount: allTokens.length,
      namespaces: [...byNamespace.keys()],
    },
  };
}
