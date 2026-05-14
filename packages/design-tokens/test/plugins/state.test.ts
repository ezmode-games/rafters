import type { ColorValue } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { statePlugin, TokenGraph } from '../../src/index.js';
import { MINIMAL_SCALE as minimalScale } from './_fixtures.js';

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
    g.set('accent', family);
    g.bind('hover', 'state', { familyName: 'accent', basePosition: 5, stateType: 'hover' });
    g.bind('active', 'state', { familyName: 'accent', basePosition: 5, stateType: 'active' });
    expect(g.get('hover')).toEqual({ family: 'accent', position: '700' });
    expect(g.get('active')).toEqual({ family: 'accent', position: '800' });
  });

  it('applies positional offsets when no stateReferences', () => {
    const family: ColorValue = { name: 'accent', scale: minimalScale };
    const g = new TokenGraph([statePlugin]);
    g.set('accent', family);
    g.bind('hover', 'state', { familyName: 'accent', basePosition: 5, stateType: 'hover' });
    g.bind('active', 'state', { familyName: 'accent', basePosition: 5, stateType: 'active' });
    g.bind('focus', 'state', { familyName: 'accent', basePosition: 5, stateType: 'focus' });
    g.bind('disabled', 'state', { familyName: 'accent', basePosition: 5, stateType: 'disabled' });
    expect(g.get('hover')).toEqual({ family: 'accent', position: '600' });
    expect(g.get('active')).toEqual({ family: 'accent', position: '700' });
    expect(g.get('focus')).toEqual({ family: 'accent', position: '600' });
    expect(g.get('disabled')).toEqual({ family: 'accent', position: '300' });
  });

  it('clamps offsets at scale boundaries', () => {
    const family: ColorValue = { name: 'accent', scale: minimalScale };
    const g = new TokenGraph([statePlugin]);
    g.set('accent', family);
    g.bind('top-hover', 'state', { familyName: 'accent', basePosition: 10, stateType: 'hover' });
    g.bind('bottom-disabled', 'state', {
      familyName: 'accent',
      basePosition: 0,
      stateType: 'disabled',
    });
    expect(g.get('top-hover')).toEqual({ family: 'accent', position: '950' });
    expect(g.get('bottom-disabled')).toEqual({ family: 'accent', position: '50' });
  });

  it('rejects invalid stateType via Zod', () => {
    const g = new TokenGraph([statePlugin]);
    g.set('accent', { name: 'accent', scale: minimalScale });
    expect(() =>
      g.bind('x', 'state', { familyName: 'accent', basePosition: 5, stateType: 'pressed' }),
    ).toThrow();
  });
});
