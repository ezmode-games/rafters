import type { ColorValue } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { scalePlugin, TokenGraph } from '../../src/index.js';
import { MINIMAL_SCALE } from './_fixtures.js';

const minimalAccent: ColorValue = { name: 'accent', scale: MINIMAL_SCALE };

describe('scalePlugin', () => {
  it('declares dependency on the family name', () => {
    expect(scalePlugin.dependsOn({ familyName: 'accent', scalePosition: 5 })).toEqual(['accent']);
  });

  it('returns ColorReference with mapped position string', () => {
    const g = new TokenGraph([scalePlugin]);
    g.set('accent', minimalAccent);
    g.bind('accent-500', 'scale', { familyName: 'accent', scalePosition: 5 });
    expect(g.get('accent-500')).toEqual({ family: 'accent', position: '500' });
  });

  it('maps all 11 positions correctly', () => {
    const g = new TokenGraph([scalePlugin]);
    g.set('accent', minimalAccent);
    const expected = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
    for (let i = 0; i < 11; i++) {
      g.bind(`accent-${expected[i]}`, 'scale', { familyName: 'accent', scalePosition: i });
      expect(g.get(`accent-${expected[i]}`)).toEqual({ family: 'accent', position: expected[i] });
    }
  });

  it('throws if family is not registered', () => {
    const g = new TokenGraph([scalePlugin]);
    expect(() => g.bind('x', 'scale', { familyName: 'missing', scalePosition: 5 })).toThrow(
      /family "missing" not found/,
    );
  });

  it('rejects out-of-range scalePosition via Zod', () => {
    const g = new TokenGraph([scalePlugin]);
    g.set('accent', minimalAccent);
    expect(() => g.bind('x', 'scale', { familyName: 'accent', scalePosition: 11 })).toThrow();
    expect(() => g.bind('x', 'scale', { familyName: 'accent', scalePosition: -1 })).toThrow();
  });
});
