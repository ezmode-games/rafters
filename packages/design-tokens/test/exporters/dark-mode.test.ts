import type { OKLCH } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { computeDarkScale } from '../../src/index.js';

describe('computeDarkScale', () => {
  const lightScale: OKLCH[] = Array.from({ length: 11 }, (_, i) => ({
    l: 1 - i * 0.09,
    c: 0.05,
    h: 240,
    alpha: 1,
  }));

  it('returns the same number of positions as the input', () => {
    const dark = computeDarkScale(lightScale);
    expect(dark).toHaveLength(11);
  });

  it('mirrors position 50 lightness into position 950 region', () => {
    const dark = computeDarkScale(lightScale);
    expect(dark[0]?.l).toBeCloseTo(lightScale[10]?.l ?? 0, 5);
    expect(dark[10]?.l).toBeCloseTo(lightScale[0]?.l ?? 0, 5);
  });

  it('reduces chroma for dark-context perceptual match', () => {
    const dark = computeDarkScale(lightScale);
    for (let i = 0; i < dark.length; i++) {
      const d = dark[i];
      const sourceMirror = lightScale[10 - i];
      if (!d || !sourceMirror) continue;
      expect(d.c).toBeCloseTo(sourceMirror.c * 0.85, 5);
    }
  });

  it('preserves hue', () => {
    const dark = computeDarkScale(lightScale);
    for (const d of dark) {
      expect(d.h).toBe(240);
    }
  });
});
