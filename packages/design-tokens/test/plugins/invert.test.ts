import type { ColorValue } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { invertPlugin, TokenGraph } from '../../src/index.js';

const minimalScale = [
  { l: 0.97, c: 0.02, h: 240 },
  { l: 0.93, c: 0.05, h: 240 },
  { l: 0.85, c: 0.1, h: 240 },
  { l: 0.75, c: 0.14, h: 240 },
  { l: 0.65, c: 0.16, h: 240 },
  { l: 0.55, c: 0.18, h: 240 },
  { l: 0.45, c: 0.18, h: 240 },
  { l: 0.35, c: 0.16, h: 240 },
  { l: 0.25, c: 0.14, h: 240 },
  { l: 0.18, c: 0.1, h: 240 },
  { l: 0.12, c: 0.07, h: 240 },
];

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
    g.set('accent', family);
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
    g.set('accent', family);
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
    g.set('accent', family);
    g.bind('accent-dark', 'invert', { familyName: 'accent', basePosition: 2 });
    expect(g.get('accent-dark')).toEqual({ family: 'accent', position: '800' });
  });

  it('throws when family has no accessibility data at all', () => {
    const family: ColorValue = { name: 'accent', scale: minimalScale };
    const g = new TokenGraph([invertPlugin]);
    g.set('accent', family);
    expect(() =>
      g.bind('accent-dark', 'invert', { familyName: 'accent', basePosition: 5 }),
    ).toThrow(/No WCAG accessibility data/);
  });
});
