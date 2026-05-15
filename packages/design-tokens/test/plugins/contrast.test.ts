import type { ColorValue } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { contrastPlugin, TokenGraph } from '../../src/index.js';
import { MINIMAL_SCALE as minimalScale } from './_fixtures.js';

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

  it('throws when neutral family has no accessibility.onWhite data', () => {
    const family: ColorValue = { name: 'accent', scale: minimalScale };
    const neutral: ColorValue = { name: 'gray', scale: minimalScale };
    const g = new TokenGraph([contrastPlugin]);
    g.set('accent', family);
    g.set('gray', neutral);
    expect(() =>
      g.bind('light-fg', 'contrast', {
        familyName: 'accent',
        basePosition: 3,
        neutralFamilyName: 'gray',
      }),
    ).toThrow(/no accessibility\.onWhite data/);
  });

  it('throws when family has no foregroundReferences and no WCAG pairs', () => {
    const family: ColorValue = { name: 'accent', scale: minimalScale };
    const g = new TokenGraph([contrastPlugin]);
    g.set('accent', family);
    expect(() => g.bind('fg-light', 'contrast', { familyName: 'accent', basePosition: 2 })).toThrow(
      /no foregroundReferences and no accessibility WCAG pairs/,
    );
  });
});
