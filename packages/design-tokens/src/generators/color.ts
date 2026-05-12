import { generateOKLCHScale } from '@rafters/color-utils';
import type { ColorValue, OKLCH, Token } from '@rafters/shared';

export interface ColorFamilyInput {
  /** Family name, e.g. 'neutral', 'ocean-blue'. Becomes the token name. */
  name: string;
  /** Base OKLCH for the family. The generator derives the full 11-position scale from this. */
  oklch: { l: number; c: number; h: number };
  /** Optional pre-generated scale. If provided, skips derivation. Must be exactly 11 positions. */
  scale?: readonly OKLCH[];
}

/** Standard 11-position scale, light-to-dark, matching Tailwind + the v1 schema's index convention. */
export const COLOR_SCALE_POSITIONS = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950',
] as const;

export type ColorScalePosition = (typeof COLOR_SCALE_POSITIONS)[number];

/**
 * Generate color tokens for a set of families. Emits:
 *  - one family token per input — `value: ColorValue { scale: OKLCH[11] }` (the source of truth)
 *  - 11 per-position tokens per family — `value: ColorReference { family, position }` (pointers)
 *
 * Position tokens have no `dependsOn` and no `generationRule`. They're pure references
 * the exporter resolves through the family's scale at emit time. No cascade involvement.
 */
export function generateColorTokens(families: readonly ColorFamilyInput[]): Token[] {
  const tokens: Token[] = [];
  const generatedAt = new Date().toISOString();

  for (const family of families) {
    const scale = family.scale ? [...family.scale] : scaleFromBase(family.oklch);
    if (scale.length !== COLOR_SCALE_POSITIONS.length) {
      throw new Error(
        `generateColorTokens: family "${family.name}" scale must have exactly 11 positions, got ${scale.length}`,
      );
    }

    const colorValue: ColorValue = {
      name: family.name,
      scale,
    };

    tokens.push({
      name: family.name,
      value: colorValue,
      category: 'color',
      namespace: 'color',
      generatedAt,
      userOverride: null,
    } as Token);

    for (let i = 0; i < COLOR_SCALE_POSITIONS.length; i++) {
      const position = COLOR_SCALE_POSITIONS[i];
      if (position === undefined) continue;
      tokens.push({
        name: `${family.name}-${position}`,
        value: { family: family.name, position },
        category: 'color',
        namespace: 'color',
        scalePosition: i,
        generatedAt,
        userOverride: null,
      } as Token);
    }
  }

  return tokens;
}

function scaleFromBase(base: { l: number; c: number; h: number }): OKLCH[] {
  const record = generateOKLCHScale({ ...base, alpha: 1 });
  const out: OKLCH[] = [];
  for (const pos of COLOR_SCALE_POSITIONS) {
    const entry = record[pos];
    if (!entry) {
      throw new Error(
        `generateOKLCHScale missing position "${pos}" for base ${JSON.stringify(base)}`,
      );
    }
    out.push(entry);
  }
  return out;
}
