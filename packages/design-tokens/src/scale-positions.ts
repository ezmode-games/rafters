import type { ColorValue } from '@rafters/shared';

export const INDEX_TO_POSITION = [
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

export const POSITION_TO_INDEX: Record<string, number> = {
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

export const MIN_WCAG_PAIR_DISTANCE = 3;

export function findBestWcagPair(
  sourceIndex: number,
  pairs: readonly (readonly number[])[],
  wantHigher: boolean,
): number | undefined {
  let best: number | undefined;
  let bestDistance = -1;
  for (const pair of pairs) {
    if (!pair || pair.length < 2) continue;
    const [a, b] = pair;
    if (a === undefined || b === undefined) continue;
    let partner: number | undefined;
    if (a === sourceIndex) partner = b;
    else if (b === sourceIndex) partner = a;
    else continue;
    if (wantHigher && partner <= sourceIndex) continue;
    if (!wantHigher && partner >= sourceIndex) continue;
    const distance = Math.abs(partner - sourceIndex);
    if (distance > bestDistance) {
      bestDistance = distance;
      best = partner;
    }
  }
  return best;
}

export function findDarkCounterpartIndex(lightIndex: number, colorValue: ColorValue): number {
  const aaaPairs = colorValue.accessibility?.wcagAAA?.normal ?? [];
  const aaPairs = colorValue.accessibility?.wcagAA?.normal ?? [];

  if (aaaPairs.length === 0 && aaPairs.length === 0) {
    throw new Error(
      `No WCAG accessibility data available for dark mode counterpart of index ${lightIndex}. ColorValue must include accessibility.wcagAAA or wcagAA pair matrices.`,
    );
  }

  const wantHigher = lightIndex <= 5;
  for (const pairs of [aaaPairs, aaPairs]) {
    const match = findBestWcagPair(lightIndex, pairs, wantHigher);
    if (match !== undefined && Math.abs(match - lightIndex) >= MIN_WCAG_PAIR_DISTANCE) {
      return match;
    }
  }
  return Math.max(0, Math.min(10, 10 - lightIndex));
}
