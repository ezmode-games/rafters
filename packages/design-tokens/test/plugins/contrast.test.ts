import type { ColorValue } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { contrastPlugin, TokenGraph } from '../../src/index.js';

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

describe('contrastPlugin', () => {
  it('declares dependency on the family name', () => {
    expect(contrastPlugin.dependsOn({ familyName: 'accent', basePosition: 5 })).toEqual(['accent']);
  });

  it('declares dependency on neutral family when present', () => {
    expect(
      contrastPlugin.dependsOn({
        familyName: 'accent',
        basePosition: 5,
        neutralFamilyName: 'gray',
      }),
    ).toEqual(['accent', 'gray']);
  });

  it('uses pre-computed foregroundReferences.auto when present', () => {
    const family = {
      name: 'accent',
      scale: minimalScale,
      foregroundReferences: { auto: { family: 'gray', position: '50' } },
    } as ColorValue;
    const g = new TokenGraph([contrastPlugin]);
    g.set('accent', family);
    g.bind('accent-fg', 'contrast', { familyName: 'accent', basePosition: 5 });
    expect(g.get('accent-fg')).toEqual({ family: 'gray', position: '50' });
  });

  it('uses WCAG AAA pair from family accessibility data', () => {
    const family: ColorValue = {
      name: 'accent',
      scale: minimalScale,
      accessibility: {
        wcagAAA: { normal: [[5, 0]], large: [] },
        wcagAA: { normal: [], large: [] },
      },
    };
    const g = new TokenGraph([contrastPlugin]);
    g.set('accent', family);
    g.bind('accent-fg', 'contrast', { familyName: 'accent', basePosition: 5 });
    expect(g.get('accent-fg')).toEqual({ family: 'accent', position: '50' });
  });

  it('falls back to WCAG AA when no AAA pair', () => {
    const family: ColorValue = {
      name: 'accent',
      scale: minimalScale,
      accessibility: {
        wcagAAA: { normal: [], large: [] },
        wcagAA: { normal: [[5, 10]], large: [] },
      },
    };
    const g = new TokenGraph([contrastPlugin]);
    g.set('accent', family);
    g.bind('accent-fg', 'contrast', { familyName: 'accent', basePosition: 5 });
    expect(g.get('accent-fg')).toEqual({ family: 'accent', position: '950' });
  });

  it('falls back to neutral family AAA when source has no usable contrast', () => {
    const family: ColorValue = { name: 'accent', scale: minimalScale };
    const neutral: ColorValue = {
      name: 'gray',
      scale: minimalScale,
      accessibility: {
        wcagAAA: { normal: [], large: [] },
        wcagAA: { normal: [], large: [] },
        onWhite: { aaa: [9], aa: [], normal: [], large: [] },
      },
    };
    const g = new TokenGraph([contrastPlugin]);
    g.set('accent', family);
    g.set('gray', neutral);
    g.bind('accent-fg', 'contrast', {
      familyName: 'accent',
      basePosition: 5,
      neutralFamilyName: 'gray',
    });
    expect(g.get('accent-fg')).toEqual({ family: 'gray', position: '900' });
  });

  it('falls back to neutral positional heuristic when neutral has no accessibility data', () => {
    const family: ColorValue = { name: 'accent', scale: minimalScale };
    const neutral: ColorValue = { name: 'gray', scale: minimalScale };
    const g = new TokenGraph([contrastPlugin]);
    g.set('accent', family);
    g.set('gray', neutral);
    g.bind('light-fg', 'contrast', {
      familyName: 'accent',
      basePosition: 3,
      neutralFamilyName: 'gray',
    });
    g.bind('dark-fg', 'contrast', {
      familyName: 'accent',
      basePosition: 8,
      neutralFamilyName: 'gray',
    });
    expect(g.get('light-fg')).toEqual({ family: 'gray', position: '900' });
    expect(g.get('dark-fg')).toEqual({ family: 'gray', position: '100' });
  });

  it('last resort: same family with high-contrast position', () => {
    const family: ColorValue = { name: 'accent', scale: minimalScale };
    const g = new TokenGraph([contrastPlugin]);
    g.set('accent', family);
    g.bind('fg-light', 'contrast', { familyName: 'accent', basePosition: 2 });
    g.bind('fg-dark', 'contrast', { familyName: 'accent', basePosition: 8 });
    expect(g.get('fg-light')).toEqual({ family: 'accent', position: '900' });
    expect(g.get('fg-dark')).toEqual({ family: 'accent', position: '100' });
  });
});
