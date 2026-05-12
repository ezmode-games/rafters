import type { ColorReference, ColorValue } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { COLOR_SCALE_POSITIONS, generateColorTokens } from '../../src/index.js';

describe('generateColorTokens', () => {
  it('emits one family token + 11 position tokens per family', () => {
    const tokens = generateColorTokens([{ name: 'neutral', oklch: { l: 0.5, c: 0, h: 0 } }]);
    expect(tokens).toHaveLength(12);
    expect(tokens[0]?.name).toBe('neutral');
    expect(tokens[0]?.namespace).toBe('color');
  });

  it('family token value is a ColorValue with 11-position scale', () => {
    const tokens = generateColorTokens([{ name: 'neutral', oklch: { l: 0.5, c: 0, h: 0 } }]);
    const family = tokens.find((t) => t.name === 'neutral');
    const value = family?.value as ColorValue;
    expect(value.scale).toHaveLength(11);
    expect(value.name).toBe('neutral');
  });

  it('position tokens carry ColorReference values pointing into the family', () => {
    const tokens = generateColorTokens([{ name: 'neutral', oklch: { l: 0.5, c: 0, h: 0 } }]);
    const pos500 = tokens.find((t) => t.name === 'neutral-500');
    expect(pos500?.value).toEqual({ family: 'neutral', position: '500' } satisfies ColorReference);
  });

  it('position tokens have no dependsOn and no generationRule', () => {
    const tokens = generateColorTokens([{ name: 'neutral', oklch: { l: 0.5, c: 0, h: 0 } }]);
    const pos500 = tokens.find((t) => t.name === 'neutral-500');
    expect(pos500?.dependsOn).toBeUndefined();
    expect(pos500?.generationRule).toBeUndefined();
  });

  it('emits a position token for every COLOR_SCALE_POSITIONS entry', () => {
    const tokens = generateColorTokens([{ name: 'neutral', oklch: { l: 0.5, c: 0, h: 0 } }]);
    const positionNames = tokens.filter((t) => t.name.startsWith('neutral-')).map((t) => t.name);
    for (const pos of COLOR_SCALE_POSITIONS) {
      expect(positionNames).toContain(`neutral-${pos}`);
    }
  });

  it('handles multiple families independently', () => {
    const tokens = generateColorTokens([
      { name: 'neutral', oklch: { l: 0.5, c: 0, h: 0 } },
      { name: 'ocean-blue', oklch: { l: 0.5, c: 0.18, h: 240 } },
    ]);
    expect(tokens).toHaveLength(24);
    expect(tokens.find((t) => t.name === 'ocean-blue-500')?.value).toEqual({
      family: 'ocean-blue',
      position: '500',
    });
  });

  it('accepts a pre-generated scale and uses it directly', () => {
    const customScale = Array.from({ length: 11 }, (_, i) => ({
      l: 1 - i * 0.09,
      c: 0.1,
      h: 180,
      alpha: 1,
    }));
    const tokens = generateColorTokens([
      { name: 'custom', oklch: { l: 0.5, c: 0.1, h: 180 }, scale: customScale },
    ]);
    const family = tokens.find((t) => t.name === 'custom');
    expect((family?.value as ColorValue).scale).toEqual(customScale);
  });

  it('throws when a pre-generated scale has the wrong length', () => {
    expect(() =>
      generateColorTokens([
        {
          name: 'wrong',
          oklch: { l: 0.5, c: 0.1, h: 180 },
          scale: [{ l: 0.5, c: 0.1, h: 180, alpha: 1 }],
        },
      ]),
    ).toThrow(/exactly 11 positions/);
  });
});
