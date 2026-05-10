import { describe, expect, it } from 'vitest';

import {
  calculateProgressionStep,
  evaluateExpression,
  findClosestProgressionStep,
  interpolate,
} from '../src/calculations';
import { DEFAULT_RATIOS, findRatio, ratioValue } from '../src/ratios';

const golden = findRatio(DEFAULT_RATIOS, 'golden');
const minorThird = findRatio(DEFAULT_RATIOS, 'minor-third');
if (!golden || !minorThird) throw new Error('Default ratio fixture missing');

describe('math-utils: evaluateExpression', () => {
  it('evaluates basic arithmetic and operator precedence', () => {
    expect(evaluateExpression('2 + 3 * 4')).toBe(14);
    expect(evaluateExpression('(2 + 3) * 4')).toBe(20);
  });

  it('substitutes named ratios from the default registry', () => {
    expect(evaluateExpression('16 * golden')).toBeCloseTo(16 * ratioValue(golden), 6);
    expect(evaluateExpression('{base} * minor-third', { variables: { base: 16 } })).toBeCloseTo(
      16 * ratioValue(minorThird),
      6,
    );
  });

  it('substitutes named ratios from a caller-supplied registry', () => {
    const custom = [{ name: 'spice', a: 7, b: 4 }];
    expect(evaluateExpression('8 * spice', { ratios: custom })).toBeCloseTo(8 * (7 / 4), 6);
  });
});

describe('math-utils: progressions and helpers', () => {
  it('computes ratio-based progression steps', () => {
    expect(calculateProgressionStep(16, golden, 1)).toBeCloseTo(16 * ratioValue(golden), 6);
    expect(calculateProgressionStep(4, minorThird, 0)).toBe(4);
  });

  it('finds the closest progression step', () => {
    const res = findClosestProgressionStep(25, 16, golden, 10);
    expect(res.step).toBeGreaterThanOrEqual(0);
    expect(res.value).toBeCloseTo(16 * ratioValue(golden) ** res.step, 3);
  });

  it('interpolates linearly and with ratio easing', () => {
    expect(interpolate(10, 20, 0.5)).toBe(15);
    const eased = interpolate(10, 20, 0.5, golden);
    expect(eased).toBeGreaterThan(15);
    expect(eased).toBeLessThan(20);
  });
});
