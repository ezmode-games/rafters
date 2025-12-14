import { describe, expect, it } from 'vitest';

import {
  calculateProgressionStep,
  evaluateExpression,
  findClosestProgressionStep,
  interpolate,
} from '../src/calculations';

import { ALL_RATIOS, getRatio, isValidRatio } from '../src/constants';

describe('math-utils: evaluateExpression', () => {
  it('evaluates basic arithmetic and operator precedence', () => {
    expect(evaluateExpression('2 + 3 * 4')).toBe(14);
    expect(evaluateExpression('(2 + 3) * 4')).toBe(20);
  });

  it('substitutes named ratios and variables', () => {
    const goldenExpected = 16 * Number(ALL_RATIOS.golden);
    expect(evaluateExpression('16 * golden')).toBeCloseTo(goldenExpected, 6);

    const minorThird = Number(ALL_RATIOS['minor-third']);
    expect(evaluateExpression('{base} * minor-third', { base: 16 })).toBeCloseTo(
      16 * minorThird,
      6,
    );
  });
});

describe('math-utils: progressions and helpers', () => {
  it('calculates linear and ratio-based progression steps', () => {
    expect(calculateProgressionStep(4, 'linear', 4)).toBe(20);

    const goldenStep1 = calculateProgressionStep(16, 'golden', 1);
    expect(goldenStep1).toBeCloseTo(16 * getRatio('golden'), 6);
  });

  it('finds the closest progression step', () => {
    const res = findClosestProgressionStep(25, 16, 'golden', 10);
    // nearest golden progression step from 16 should be step 1 (≈25.888)
    expect(res.step).toBeGreaterThanOrEqual(0);
    expect(res.value).toBeCloseTo(16 * getRatio('golden') ** res.step, 3);
  });

  it('interpolates linearly and with easing', () => {
    expect(interpolate(10, 20, 0.5, 'linear')).toBe(15);

    const _ratio = getRatio('golden');
    const eased = interpolate(10, 20, 0.5, 'golden');
    // eased progress should be between linear and end
    expect(eased).toBeGreaterThan(15);
    expect(eased).toBeLessThan(20);
  });
});

describe('math-utils: constants', () => {
  it('exports ALL_RATIOS and helpers', () => {
    expect(isValidRatio('golden')).toBe(true);
    expect(getRatio('golden')).toBe(ALL_RATIOS.golden);
    expect(isValidRatio('non-existent-ratio')).toBe(false);
  });
});
