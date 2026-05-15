import type { ColorValue } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { invertPlugin, TokenGraph } from '../../src/index.js';
import { MINIMAL_SCALE as minimalScale } from './_fixtures.js';

describe('invertPlugin', () => {
  it('declares dependency on the family name', () => {
    expect(invertPlugin.dependsOn({ familyName: 'accent', basePosition: 5 })).toEqual(['accent']);
  });

  it('finds AAA-paired dark counterpart with sufficient distance', () => {
    const family: ColorValue = {
      name: 'accent',
      scale: minimalScale,
      accessibility: {
        wcagAAA: { normal: [[2, 9]], large: [] },
        wcagAA: { normal: [], large: [] },
      },
    };
    const g = new TokenGraph([invertPlugin]);
    g.seed('accent', family);
    g.bind('accent-dark', 'invert', { familyName: 'accent', basePosition: 2 });
    expect(g.get('accent-dark')).toEqual({ family: 'accent', position: '900' });
  });

  it('falls back to AA when AAA pair is too close', () => {
    const family: ColorValue = {
      name: 'accent',
      scale: minimalScale,
      accessibility: {
        wcagAAA: { normal: [[2, 4]], large: [] },
        wcagAA: { normal: [[2, 8]], large: [] },
      },
    };
    const g = new TokenGraph([invertPlugin]);
    g.seed('accent', family);
    g.bind('accent-dark', 'invert', { familyName: 'accent', basePosition: 2 });
    expect(g.get('accent-dark')).toEqual({ family: 'accent', position: '800' });
  });

  it('falls back to mathematical inversion when no usable WCAG pair', () => {
    const family: ColorValue = {
      name: 'accent',
      scale: minimalScale,
      accessibility: {
        wcagAAA: { normal: [[2, 3]], large: [] },
        wcagAA: { normal: [[2, 3]], large: [] },
      },
    };
    const g = new TokenGraph([invertPlugin]);
    g.seed('accent', family);
    g.bind('accent-dark', 'invert', { familyName: 'accent', basePosition: 2 });
    expect(g.get('accent-dark')).toEqual({ family: 'accent', position: '800' });
  });

  it('throws when family has no accessibility data at all', () => {
    const family: ColorValue = { name: 'accent', scale: minimalScale };
    const g = new TokenGraph([invertPlugin]);
    g.seed('accent', family);
    expect(() =>
      g.bind('accent-dark', 'invert', { familyName: 'accent', basePosition: 5 }),
    ).toThrow(/No WCAG accessibility data/);
  });
});
