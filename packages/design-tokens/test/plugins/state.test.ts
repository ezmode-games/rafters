import type { ColorValue } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { statePlugin, TokenGraph } from '../../src/index.js';
import { MINIMAL_SCALE as minimalScale } from './_fixtures.js';

// Realistic-ish accessibility metadata: every position pairs with every position
// that has at least a 4-step lightness gap. The set of positions in the ladder
// is {0, 1, 2, ..., 10} (all positions show up in some pair).
const fullLadderAccessibility = {
  wcagAAA: {
    normal: [
      [0, 8],
      [0, 9],
      [0, 10],
      [1, 8],
      [1, 9],
      [1, 10],
      [2, 9],
      [2, 10],
      [3, 10],
      [7, 0],
      [8, 0],
      [9, 0],
      [10, 0],
    ],
    large: [],
  },
  wcagAA: { normal: [], large: [] },
  onWhite: { wcagAA: true, wcagAAA: true, contrastRatio: 7, aa: [], aaa: [] },
  onBlack: { wcagAA: true, wcagAAA: true, contrastRatio: 7, aa: [], aaa: [] },
};

describe('statePlugin', () => {
  it('declares dependency on the family name', () => {
    expect(
      statePlugin.dependsOn({ familyName: 'accent', basePosition: 5, stateType: 'hover' }),
    ).toEqual(['accent']);
  });

  it('uses pre-computed stateReferences when present', () => {
    const family = {
      name: 'accent',
      scale: minimalScale,
      stateReferences: {
        hover: { family: 'accent', position: '700' },
        active: { family: 'accent', position: '800' },
      },
    } as ColorValue;
    const g = new TokenGraph([statePlugin]);
    g.seed('accent', family);
    g.bind('hover', 'state', { familyName: 'accent', basePosition: 5, stateType: 'hover' });
    g.bind('active', 'state', { familyName: 'accent', basePosition: 5, stateType: 'active' });
    expect(g.get('hover')).toEqual({ family: 'accent', position: '700' });
    expect(g.get('active')).toEqual({ family: 'accent', position: '800' });
  });

  it('walks the WCAG-AAA ladder for hover/active/focus', () => {
    // Ladder positions sorted: [0, 1, 2, 3, 7, 8, 9, 10].
    // Base 8 has rank 5 in the ladder.
    // hover  rank +1 -> rank 6 -> position 9.
    // active rank +2 -> rank 7 -> position 10.
    // focus  rank +1 -> rank 6 -> position 9 (same as hover).
    const family = {
      name: 'accent',
      scale: minimalScale,
      accessibility: fullLadderAccessibility,
    } as ColorValue;
    const g = new TokenGraph([statePlugin]);
    g.seed('accent', family);
    g.bind('hover', 'state', { familyName: 'accent', basePosition: 8, stateType: 'hover' });
    g.bind('active', 'state', { familyName: 'accent', basePosition: 8, stateType: 'active' });
    g.bind('focus', 'state', { familyName: 'accent', basePosition: 8, stateType: 'focus' });
    expect(g.get('hover')).toEqual({ family: 'accent', position: '900' });
    expect(g.get('active')).toEqual({ family: 'accent', position: '950' });
    expect(g.get('focus')).toEqual({ family: 'accent', position: '900' });
  });

  it('disabled returns the ladder rank closest to the family midpoint (position 5)', () => {
    // Ladder positions sorted: [0, 1, 2, 3, 7, 8, 9, 10]. Closest to 5 is 3 (distance 2)
    // or 7 (distance 2) -- first hit wins, which is rank 3 -> position 3.
    const family = {
      name: 'accent',
      scale: minimalScale,
      accessibility: fullLadderAccessibility,
    } as ColorValue;
    const g = new TokenGraph([statePlugin]);
    g.seed('accent', family);
    g.bind('disabled', 'state', { familyName: 'accent', basePosition: 8, stateType: 'disabled' });
    expect(g.get('disabled')).toEqual({ family: 'accent', position: '300' });
  });

  it('clamps ladder steps at the top boundary', () => {
    const family = {
      name: 'accent',
      scale: minimalScale,
      accessibility: fullLadderAccessibility,
    } as ColorValue;
    const g = new TokenGraph([statePlugin]);
    g.seed('accent', family);
    // Base at position 10 has the top rank. hover +1 clamps to top -> position 10.
    g.bind('top-hover', 'state', { familyName: 'accent', basePosition: 10, stateType: 'hover' });
    expect(g.get('top-hover')).toEqual({ family: 'accent', position: '950' });
  });

  it('throws when the family has no accessibility.wcagAAA ladder', () => {
    const family: ColorValue = { name: 'accent', scale: minimalScale };
    const g = new TokenGraph([statePlugin]);
    g.seed('accent', family);
    expect(() =>
      g.bind('hover', 'state', { familyName: 'accent', basePosition: 5, stateType: 'hover' }),
    ).toThrow(/no accessibility\.wcagAAA\.normal ladder/);
  });

  it('throws when basePosition is not on the ladder', () => {
    // Ladder = [0, 1, 2, 3, 7, 8, 9, 10]; 5 is not on it.
    const family = {
      name: 'accent',
      scale: minimalScale,
      accessibility: fullLadderAccessibility,
    } as ColorValue;
    const g = new TokenGraph([statePlugin]);
    g.seed('accent', family);
    expect(() =>
      g.bind('hover', 'state', { familyName: 'accent', basePosition: 5, stateType: 'hover' }),
    ).toThrow(/not in the WCAG-AAA ladder/);
  });

  it('rejects invalid stateType via Zod', () => {
    const family = {
      name: 'accent',
      scale: minimalScale,
      accessibility: fullLadderAccessibility,
    } as ColorValue;
    const g = new TokenGraph([statePlugin]);
    g.seed('accent', family);
    expect(() =>
      g.bind('x', 'state', { familyName: 'accent', basePosition: 5, stateType: 'pressed' }),
    ).toThrow();
  });
});
