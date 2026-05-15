import { SCALE_POSITIONS } from '@rafters/color-utils';
import { type ColorReference, ColorReferenceSchema, type ColorValue } from '@rafters/shared';
import { z } from 'zod';
import { definePlugin } from '../plugin.js';

const StateTypeSchema = z.enum(['hover', 'active', 'focus', 'disabled']);
type StateType = z.infer<typeof StateTypeSchema>;

const StateInputSchema = z.object({
  familyName: z.string(),
  basePosition: z.number().int().min(0).max(10),
  stateType: StateTypeSchema,
});

type StateInput = z.infer<typeof StateInputSchema>;

type ColorValueWithStateRefs = ColorValue & {
  stateReferences?: Record<string, { family: string; position: string }>;
};

/**
 * Walk the family's WCAG-AAA pair ladder to derive a state variant.
 *
 * "Like invert/contrast" -- the family's pre-computed pair list is the
 * source of truth. No hardcoded offset matrix. State variants step along
 * the RANK of accessible positions (positions that appear in at least one
 * wcagAAA pair). A family with more AAA-compliant positions gives finer
 * state steps; a family with fewer gives coarser ones. The math reads
 * the family's actual data, not a global constant.
 *
 * Ladder = sorted unique positions in any wcagAAA.normal pair. Base
 * position must be on the ladder. Step per state type:
 *   hover    -> +1 rank (next accessible neighbour toward dark, clamped)
 *   active   -> +2 rank
 *   focus    -> +1 rank (same as hover; the visual cue is the ring)
 *   disabled -> closest ladder rank to the family midpoint (position 5)
 */
const STEP_BY_STATE: Record<StateType, (rank: number, ladder: readonly number[]) => number> = {
  hover: (rank) => rank + 1,
  active: (rank) => rank + 2,
  focus: (rank) => rank + 1,
  disabled: (_rank, ladder) => closestRankToMidpoint(ladder),
};

function closestRankToMidpoint(ladder: readonly number[]): number {
  let bestRank = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (let r = 0; r < ladder.length; r++) {
    const position = ladder[r];
    if (position === undefined) continue;
    const distance = Math.abs(position - 5);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestRank = r;
    }
  }
  return bestRank;
}

function collectLadder(pairs: readonly (readonly number[])[]): number[] {
  const positions = new Set<number>();
  for (const pair of pairs) {
    for (const position of pair) positions.add(position);
  }
  return Array.from(positions).sort((a, b) => a - b);
}

export const statePlugin = definePlugin<StateInput, ColorReference>({
  name: 'state',
  inputSchema: StateInputSchema,
  outputSchema: ColorReferenceSchema,
  dependsOn: (input) => [input.familyName],
  transform: (input, get) => {
    const family = get(input.familyName) as ColorValueWithStateRefs | undefined;
    if (!family) {
      throw new Error(`state plugin: family "${input.familyName}" not found in registry`);
    }

    const precomputed = family.stateReferences?.[input.stateType];
    if (precomputed) {
      return { family: precomputed.family, position: String(precomputed.position) };
    }

    const pairs = family.accessibility?.wcagAAA?.normal;
    if (!pairs || pairs.length === 0) {
      throw new Error(
        `state plugin: family "${input.familyName}" has no accessibility.wcagAAA.normal ladder (color generator must emit accessibility metadata)`,
      );
    }
    const ladder = collectLadder(pairs);
    const baseRank = ladder.indexOf(input.basePosition);
    if (baseRank === -1) {
      throw new Error(
        `state plugin: basePosition ${input.basePosition} for family "${input.familyName}" is not in the WCAG-AAA ladder`,
      );
    }

    const targetRank = STEP_BY_STATE[input.stateType](baseRank, ladder);
    const clampedRank = Math.max(0, Math.min(ladder.length - 1, targetRank));
    const targetIndex = ladder[clampedRank];
    if (targetIndex === undefined) {
      throw new Error(
        `state plugin: ladder lookup failed for rank ${clampedRank} on family "${input.familyName}"`,
      );
    }
    const position = SCALE_POSITIONS[targetIndex];
    if (!position) {
      throw new Error(
        `state plugin: invalid scale index ${targetIndex} for family "${input.familyName}"`,
      );
    }
    return { family: input.familyName, position };
  },
});
