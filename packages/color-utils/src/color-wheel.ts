/**
 * colorWheel: generate a complete 11-family semantic color system from a single OKLCH seed.
 *
 * Dispatches to harmony-specific functions. Complementary is fully deterministic.
 * All other harmony types delegate to complementaryWheel until their specific
 * semantic role mappings are designed.
 */

import type { ColorValue, OKLCH } from '@rafters/shared';
import { buildColorValue } from './builder.js';
import { roundOKLCH } from './conversion.js';
import { adjustHue } from './manipulation.js';

export type HarmonyType =
  | 'complementary'
  | 'triadic'
  | 'tetradic'
  | 'analogous'
  | 'split-complementary';

export interface ColorWheelOptions {
  chromaDistribution?: 'gaussian' | 'flat';
}

/**
 * Keys are palette identifiers (`${role}-family`), distinct from the bare
 * semantic role names (`primary`, `accent`, etc.) owned by
 * `DEFAULT_SEMANTIC_COLOR_MAPPINGS`. The suffix prevents a name collision when
 * the system is pushed into a `TokenRegistry` that also has semantic role
 * tokens. See rafters issue #1440.
 */
export interface SemanticColorSystem {
  'primary-family': ColorValue;
  'secondary-family': ColorValue;
  'tertiary-family': ColorValue;
  'accent-family': ColorValue;
  'highlight-family': ColorValue;
  'neutral-family': ColorValue;
  'muted-family': ColorValue;
  'success-family': ColorValue;
  'warning-family': ColorValue;
  'destructive-family': ColorValue;
  'info-family': ColorValue;
}

/**
 * Apply gaussian chroma distribution centered at L=0.6 with sigma=0.25.
 * Reduces chroma at light and dark extremes, preserving peak saturation
 * near mid-tones where colors are most perceptually legible.
 *
 * Applied to: secondary, tertiary, highlight, neutral, muted.
 * NOT applied to: primary (exact designer choice), accent (needs full chroma),
 * status colors (success/warning/destructive/info must remain recognizable).
 */
function applyGaussianChroma(oklch: OKLCH): OKLCH {
  const peakL = 0.6;
  const sigma = 0.25;
  const gaussian = Math.exp(-((oklch.l - peakL) ** 2) / (2 * sigma ** 2));
  return { ...oklch, c: oklch.c * gaussian };
}

/**
 * Derive secondary lightness from the primary's accessibility matrix.
 *
 * Uses primary's wcagAAA.normal pairs to find the scale position farthest from
 * primary in lightness that still passes AAA. That position's OKLCH lightness
 * becomes secondary's lightness, ensuring AAA contrast between primary and secondary.
 *
 * Falls back to the opposite-end heuristic (dark seed -> light secondary, vice versa)
 * if the accessibility matrix yields no AAA pairs.
 */
function resolveSecondaryLightness(primaryColorValue: ColorValue, primaryOklch: OKLCH): number {
  const aaaPairs = primaryColorValue.accessibility?.wcagAAA?.normal ?? [];
  const scale = primaryColorValue.scale;

  // Find the pair with the greatest lightness distance from primary
  let bestL: number | null = null;
  let bestDistance = 0;

  for (const pair of aaaPairs) {
    const idxA = pair[0];
    const idxB = pair[1];
    if (idxA === undefined || idxB === undefined) continue;

    // Both indices in the pair are from the primary scale.
    // We want the one that is farthest in lightness from primary.
    for (const idx of [idxA, idxB]) {
      const scaleColor = scale[idx];
      if (!scaleColor) continue;
      const dist = Math.abs(scaleColor.l - primaryOklch.l);
      if (dist > bestDistance) {
        bestDistance = dist;
        bestL = scaleColor.l;
      }
    }
  }

  if (bestL !== null) {
    return bestL;
  }

  // Fallback: opposite end of the lightness range
  return primaryOklch.l > 0.5 ? 0.25 : 0.75;
}

/**
 * Full complementary color wheel.
 *
 * Palettes (returned under `${role}-family` keys):
 *   primary-family     - the seed as-is
 *   secondary-family   - same hue, opposite lightness end (AAA against primary), chroma * 0.33
 *   accent-family      - complement (+180), full chroma
 *   tertiary-family    - CTA from complement hue, chroma * 1.2 (max 0.30), L clamped 0.45-0.65
 *   highlight-family   - secondary math applied to tertiary hue
 *   neutral-family     - seed hue, chroma * 0.02, L = 0.50
 *   muted-family       - seed hue, chroma * 0.05, L = 0.85
 *   success-family     - hue 145, L 0.55, C = min(0.18, seed.c * 0.9)
 *   warning-family     - hue 85,  L 0.75, C = min(0.18, seed.c * 0.9)
 *   destructive-family - hue 25,  L 0.55, C = min(0.20, seed.c)
 *   info-family        - hue 230, L 0.58, C = min(0.15, seed.c * 0.85)
 */
function complementaryWheel(seed: OKLCH, options: ColorWheelOptions): SemanticColorSystem {
  const useGaussian = (options.chromaDistribution ?? 'gaussian') === 'gaussian';
  const alpha = seed.alpha ?? 1;

  // primary-family: exact designer seed
  const primaryColorValue = buildColorValue(seed, { token: 'primary-family' });

  // secondary-family: same hue, AAA-verified lightness from primary matrix, chroma * 0.33
  const secondaryL = resolveSecondaryLightness(primaryColorValue, seed);
  const secondaryOklch: OKLCH = { l: secondaryL, c: seed.c * 0.33, h: seed.h, alpha };
  const secondaryFinal = useGaussian ? applyGaussianChroma(secondaryOklch) : secondaryOklch;
  const secondaryColorValue = buildColorValue(roundOKLCH(secondaryFinal), {
    token: 'secondary-family',
  });

  // accent-family: pure complement, full chroma -- no gaussian (needs full chroma)
  const accentOklch = adjustHue(seed, 180);
  const accentColorValue = buildColorValue(accentOklch, { token: 'accent-family' });

  // tertiary-family: CTA from complement hue, chroma boosted but capped, mid lightness
  const tertiaryRaw: OKLCH = {
    l: Math.max(0.45, Math.min(0.65, seed.l)),
    c: Math.min(0.3, seed.c * 1.2),
    h: accentOklch.h,
    alpha,
  };
  const tertiaryFinal = useGaussian ? applyGaussianChroma(tertiaryRaw) : tertiaryRaw;
  const tertiaryColorValue = buildColorValue(roundOKLCH(tertiaryFinal), {
    token: 'tertiary-family',
  });

  // highlight-family: secondary math applied to tertiary hue
  // AAA lightness from the tertiary's accessibility matrix, same desaturation as secondary.
  const highlightL = resolveSecondaryLightness(tertiaryColorValue, tertiaryFinal);
  const highlightOklch: OKLCH = {
    l: highlightL,
    c: tertiaryFinal.c * 0.33,
    h: tertiaryFinal.h,
    alpha,
  };
  const highlightFinal = useGaussian ? applyGaussianChroma(highlightOklch) : highlightOklch;
  const highlightColorValue = buildColorValue(roundOKLCH(highlightFinal), {
    token: 'highlight-family',
  });

  // neutral-family: seed hue, very low chroma, mid lightness
  const neutralOklch: OKLCH = { l: 0.5, c: seed.c * 0.02, h: seed.h, alpha };
  const neutralFinal = useGaussian ? applyGaussianChroma(neutralOklch) : neutralOklch;
  const neutralColorValue = buildColorValue(roundOKLCH(neutralFinal), { token: 'neutral-family' });

  // muted-family: seed hue, slightly more chroma than neutral, high lightness
  const mutedOklch: OKLCH = { l: 0.85, c: seed.c * 0.05, h: seed.h, alpha };
  const mutedFinal = useGaussian ? applyGaussianChroma(mutedOklch) : mutedOklch;
  const mutedColorValue = buildColorValue(roundOKLCH(mutedFinal), { token: 'muted-family' });

  // status families -- no gaussian, must stay recognizable
  const successColorValue = buildColorValue(
    roundOKLCH({ l: 0.55, c: Math.min(0.18, seed.c * 0.9), h: 145, alpha }),
    { token: 'success-family' },
  );
  const warningColorValue = buildColorValue(
    roundOKLCH({ l: 0.75, c: Math.min(0.18, seed.c * 0.9), h: 85, alpha }),
    { token: 'warning-family' },
  );
  const destructiveColorValue = buildColorValue(
    roundOKLCH({ l: 0.55, c: Math.min(0.2, seed.c), h: 25, alpha }),
    { token: 'destructive-family' },
  );
  const infoColorValue = buildColorValue(
    roundOKLCH({ l: 0.58, c: Math.min(0.15, seed.c * 0.85), h: 230, alpha }),
    { token: 'info-family' },
  );

  return {
    'primary-family': primaryColorValue,
    'secondary-family': secondaryColorValue,
    'tertiary-family': tertiaryColorValue,
    'accent-family': accentColorValue,
    'highlight-family': highlightColorValue,
    'neutral-family': neutralColorValue,
    'muted-family': mutedColorValue,
    'success-family': successColorValue,
    'warning-family': warningColorValue,
    'destructive-family': destructiveColorValue,
    'info-family': infoColorValue,
  };
}

/**
 * Generate a complete 11-family semantic color system from a single OKLCH seed.
 *
 * Dispatches to harmony-specific functions. Complementary is fully deterministic.
 * Triadic, tetradic, analogous, and split-complementary delegate to complementaryWheel
 * until their correct semantic role mappings are designed.
 *
 * @param seed - Base color in OKLCH
 * @param harmony - Harmony relationship type
 * @param options - Optional configuration (chromaDistribution: 'gaussian' | 'flat')
 * @returns SemanticColorSystem with 11 fully-built ColorValues
 *
 * @example
 * ```ts
 * import { colorWheel } from '@rafters/color-utils';
 *
 * const system = colorWheel(
 *   { l: 0.5, c: 0.15, h: 240, alpha: 1 },
 *   'complementary'
 * );
 *
 * console.log(system['primary-family'].name);   // e.g. "slate-bold-sapphire"
 * console.log(system['destructive-family'].accessibility?.onWhite.wcagAAA); // true/false
 * ```
 */
export function colorWheel(
  seed: OKLCH,
  harmony: HarmonyType,
  options?: ColorWheelOptions,
): SemanticColorSystem {
  const opts = options ?? {};

  switch (harmony) {
    case 'complementary':
      return complementaryWheel(seed, opts);

    // Stubs: correct semantic role mappings need design research.
    // Delegating to complementary until those mappings are known.
    case 'triadic':
    case 'tetradic':
    case 'analogous':
    case 'split-complementary':
      return complementaryWheel(seed, opts);
  }
}
