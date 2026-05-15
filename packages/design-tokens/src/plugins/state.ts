import { SCALE_POSITIONS } from '@rafters/color-utils';
import { type ColorReference, ColorReferenceSchema, type ColorValue } from '@rafters/shared';
import { z } from 'zod';
import { definePlugin } from '../plugin.js';

const StateTypeSchema = z.enum(['hover', 'active', 'focus', 'disabled']);
type StateType = z.infer<typeof StateTypeSchema>;

const StateInputSchema = z.object({
  from: z.string(),
  stateType: StateTypeSchema,
});

type StateInput = z.infer<typeof StateInputSchema>;

type ColorValueWithStateRefs = ColorValue & {
  stateReferences?: Record<string, { family: string; position: string }>;
};

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
 * Walk the family's WCAG-AAA pair ladder to derive a state variant from a
 * parent token's current value.
 *
 * "Like invert/contrast" -- the family's pre-computed pair list is the source
 * of truth. No hardcoded offset matrix. The `from` input is a TOKEN NAME --
 * the cascade re-runs this transform whenever the parent's value changes, so
 * the state variant always reflects the parent's current family and position.
 *
 * Ladder = sorted unique positions in any wcagAAA.normal pair. Parent
 * position must be on the ladder. Step per state type:
 *   hover    -> +1 rank
 *   active   -> +2 rank
 *   focus    -> +1 rank (same as hover; the visual cue is the ring)
 *   disabled -> ladder rank closest to family midpoint (position 5)
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

function nearestRankOnLadder(ladder: readonly number[], position: number): number {
  let bestRank = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (let r = 0; r < ladder.length; r++) {
    const candidate = ladder[r];
    if (candidate === undefined) continue;
    const distance = Math.abs(candidate - position);
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
  dependsOn: (input) => [input.from],
  transform: (input, get) => {
    const parent = get(input.from);
    if (!parent || typeof parent !== 'object' || !('family' in parent) || !('position' in parent)) {
      throw new Error(
        `state plugin: parent token "${input.from}" did not resolve to a ColorReference`,
      );
    }
    const parentRef = parent as { family: string; position: unknown };
    if (typeof parentRef.position !== 'string') {
      throw new Error(`state plugin: parent token "${input.from}" position is not a scale string`);
    }
    const basePosition = POSITION_TO_INDEX[parentRef.position];
    if (basePosition === undefined) {
      throw new Error(
        `state plugin: parent token "${input.from}" position "${parentRef.position}" is not a known scale step`,
      );
    }

    const family = get(parentRef.family) as ColorValueWithStateRefs | undefined;
    if (!family) {
      throw new Error(
        `state plugin: family "${parentRef.family}" (from "${input.from}") not in registry`,
      );
    }

    const precomputed = family.stateReferences?.[input.stateType];
    if (precomputed) {
      return { family: precomputed.family, position: String(precomputed.position) };
    }

    const pairs = family.accessibility?.wcagAAA?.normal;
    if (!pairs || pairs.length === 0) {
      throw new Error(
        `state plugin: family "${parentRef.family}" has no accessibility.wcagAAA.normal ladder (color generator must emit accessibility metadata)`,
      );
    }
    const ladder = collectLadder(pairs);
    // If the parent position isn't itself on the AAA ladder, snap to the
    // nearest ladder rank. Avoids throwing for positions like '600' that may
    // not have any AAA partner in a given family but are valid scale steps.
    const baseRank = nearestRankOnLadder(ladder, basePosition);

    const targetRank = STEP_BY_STATE[input.stateType](baseRank, ladder);
    const clampedRank = Math.max(0, Math.min(ladder.length - 1, targetRank));
    const targetIndex = ladder[clampedRank];
    if (targetIndex === undefined) {
      throw new Error(
        `state plugin: ladder lookup failed for rank ${clampedRank} on family "${parentRef.family}"`,
      );
    }
    const position = SCALE_POSITIONS[targetIndex];
    if (!position) {
      throw new Error(
        `state plugin: invalid scale index ${targetIndex} for family "${parentRef.family}"`,
      );
    }
    return { family: parentRef.family, position };
  },
});
