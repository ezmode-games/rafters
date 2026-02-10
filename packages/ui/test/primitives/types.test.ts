import { describe, expect, it } from 'vitest';
import type {
  InteractiveMode,
  MoveDelta,
  NormalizedPoint,
  OklchColor,
  OklchColorAlpha,
} from '../../src/primitives/types';

describe('Color Picker Types', () => {
  it('NormalizedPoint holds left and top coordinates', () => {
    const point: NormalizedPoint = { left: 0.5, top: 0.3 };
    expect(Object.keys(point).sort()).toEqual(['left', 'top']);
  });

  it('MoveDelta holds dLeft and dTop offsets', () => {
    const delta: MoveDelta = { dLeft: 0.01, dTop: -0.01 };
    expect(Object.keys(delta).sort()).toEqual(['dLeft', 'dTop']);
  });

  it('InteractiveMode accepts all three literals', () => {
    const modes: InteractiveMode[] = ['1d-horizontal', '1d-vertical', '2d'];
    expect(modes).toHaveLength(3);
  });

  it('OklchColor holds l, c, h channels', () => {
    const color: OklchColor = { l: 0.7, c: 0.15, h: 250 };
    expect(Object.keys(color).sort()).toEqual(['c', 'h', 'l']);
  });

  it('OklchColorAlpha extends OklchColor with optional alpha', () => {
    const opaque: OklchColorAlpha = { l: 0.7, c: 0.15, h: 250 };
    expect(opaque.alpha).toBeUndefined();

    const translucent: OklchColorAlpha = { l: 0.7, c: 0.15, h: 250, alpha: 0.8 };
    expect(translucent.alpha).toBe(0.8);
  });
});
