/**
 * Color Ramp Detector
 *
 * Shared utility used by importers to recover palette structure that is
 * otherwise lost when CSS custom properties are flat-lifted into tokens.
 *
 * A ramp is a set of sibling tokens whose names share a common prefix and
 * differ only by a trailing Tailwind-scale position (50/100/.../900/950).
 * When at least MIN_RAMP_STEPS contiguous-ish positions of a family are
 * present, they are grouped into a single DetectedPalette and removed from
 * the flat token list. Partial ramps (fewer steps) stay flat.
 *
 * Spacing-style numeric suffixes (--spacing-4, --spacing-8) are not picked
 * up because their positions are not in the Tailwind color scale set.
 */

import type { Token } from '@rafters/shared';

/**
 * Tailwind v4 color scale positions in canonical ascending order.
 * Used both for membership tests and for sorting palette steps.
 */
export const TAILWIND_RAMP_POSITIONS = [
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

export type TailwindRampPosition = (typeof TAILWIND_RAMP_POSITIONS)[number];

const POSITION_INDEX: Map<string, number> = new Map(TAILWIND_RAMP_POSITIONS.map((p, i) => [p, i]));

/**
 * Minimum number of Tailwind positions required for a ramp to be recognised.
 *
 * Aligned with the brand-system heuristic in #1401: seven steps is enough to
 * imply intentional ramp design (matches the 50, 100, 300, 500, 700, 900, 950
 * subset and any superset). Below this we treat the variables as incidental
 * and keep them flat.
 */
export const MIN_RAMP_STEPS = 7;

const NAME_PATTERN = /^(.+)-(\d+)$/;

export interface DetectedPaletteStep {
  position: TailwindRampPosition;
  token: Token;
}

export interface DetectedPalette {
  /** Family prefix shared by every step (e.g. "empire"). */
  name: string;
  /** Detected scale type. Only Tailwind is supported in #1402. */
  scale: 'tailwind';
  /** Steps ordered ascending by Tailwind position. */
  steps: DetectedPaletteStep[];
}

export interface RampDetectionResult {
  /** Palettes detected from the input. Empty if no ramps reached the threshold. */
  palettes: DetectedPalette[];
  /** Tokens that did not participate in any palette, preserved in input order. */
  remaining: Token[];
}

interface Candidate {
  prefix: string;
  steps: Map<TailwindRampPosition, Token>;
}

function isTailwindPosition(value: string): value is TailwindRampPosition {
  return POSITION_INDEX.has(value);
}

function splitName(name: string): { prefix: string; position: TailwindRampPosition } | null {
  const match = name.match(NAME_PATTERN);
  if (!match) return null;
  const [, prefix, positionRaw] = match;
  if (!prefix || !positionRaw) return null;
  if (!isTailwindPosition(positionRaw)) return null;
  return { prefix, position: positionRaw };
}

/**
 * Group tokens by `(prefix, tailwindPosition)` and emit palettes for any
 * group that reaches MIN_RAMP_STEPS. Tokens not promoted to a palette are
 * returned in `remaining`, preserving their original ordering.
 */
export function detectRamps(tokens: readonly Token[]): RampDetectionResult {
  const candidates: Map<string, Candidate> = new Map();
  const consumed: Set<Token> = new Set();

  for (const token of tokens) {
    const split = splitName(token.name);
    if (!split) continue;

    let candidate = candidates.get(split.prefix);
    if (!candidate) {
      candidate = { prefix: split.prefix, steps: new Map() };
      candidates.set(split.prefix, candidate);
    }
    if (!candidate.steps.has(split.position)) {
      candidate.steps.set(split.position, token);
    }
  }

  const palettes: DetectedPalette[] = [];
  for (const candidate of candidates.values()) {
    if (candidate.steps.size < MIN_RAMP_STEPS) continue;

    const steps: DetectedPaletteStep[] = [...candidate.steps.entries()]
      .map(([position, token]) => ({ position, token }))
      .sort(
        (a, b) => (POSITION_INDEX.get(a.position) ?? 0) - (POSITION_INDEX.get(b.position) ?? 0),
      );

    palettes.push({ name: candidate.prefix, scale: 'tailwind', steps });
    for (const step of steps) {
      consumed.add(step.token);
    }
  }

  palettes.sort((a, b) => a.name.localeCompare(b.name));

  const remaining = tokens.filter((t) => !consumed.has(t));
  return { palettes, remaining };
}
