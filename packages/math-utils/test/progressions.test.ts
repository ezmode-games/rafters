/**
 * Unit tests for progression sequences (ratio-based, linear, exponential).
 */

import { describe, expect, it } from 'vitest';
import {
  exponentialSequence,
  generateFibonacciLike,
  generateModularScale,
  generateSequence,
  linearSequence,
  progression,
} from '../src/progressions.js';
import { DEFAULT_RATIOS, findRatio, type Ratio } from '../src/ratios.js';

const need = (name: string): Ratio => {
  const r = findRatio(DEFAULT_RATIOS, name);
  if (!r) throw new Error(`missing ${name}`);
  return r;
};

describe('progression', () => {
  it('computes a single ratio step', () => {
    expect(progression(need('minor-third'), 4, 0)).toBe(4);
    expect(progression(need('minor-third'), 4, 1)).toBeCloseTo(4.8, 6);
    expect(progression(need('minor-third'), 4, -1)).toBeCloseTo(4 / 1.2, 6);
    expect(progression(need('golden'), 10, 1)).toBeCloseTo(16.18, 2);
  });
});

describe('generateSequence', () => {
  it('generates from a ratio', () => {
    const seq = generateSequence(need('minor-third'), 16, 4);
    expect(seq[0]).toBe(16);
    expect(seq[1]).toBe(19.2);
    expect(seq[2]).toBe(23.04);
    expect(seq[3]).toBeCloseTo(27.648, 2);
  });

  it('honors startStep', () => {
    const seq = generateSequence(need('minor-third'), 4, 5, { startStep: -1 });
    expect(seq).toHaveLength(5);
    expect(seq[0]).toBeCloseTo(4 / 1.2, 6);
    expect(seq[1]).toBe(4);
    expect(seq[4]).toBeCloseTo(4 * 1.2 ** 3, 6);
  });

  it('honors includeZero', () => {
    const seq = generateSequence(need('golden'), 10, 3, { includeZero: true });
    expect(seq[0]).toBe(0);
    expect(seq[1]).toBe(10);
    expect(seq[2]).toBeCloseTo(16.18, 2);
  });
});

describe('linearSequence', () => {
  it('produces a base * (step+1) sequence', () => {
    expect(linearSequence(4, 5)).toEqual([4, 8, 12, 16, 20]);
  });

  it('honors includeZero', () => {
    expect(linearSequence(4, 5, { includeZero: true })).toEqual([0, 4, 8, 12, 16]);
  });
});

describe('exponentialSequence', () => {
  it('produces a base * mult^step sequence', () => {
    expect(exponentialSequence(16, 1.25, 4)).toEqual([16, 20, 25, 31.25]);
    expect(exponentialSequence(10, 2, 4)).toEqual([10, 20, 40, 80]);
  });

  it('honors includeZero', () => {
    expect(exponentialSequence(8, 1.25, 3, { includeZero: true })).toEqual([0, 8, 10]);
  });
});

describe('generateModularScale', () => {
  it('builds smaller and larger arrays from a ratio', () => {
    const scale = generateModularScale(need('major-third'), 16, 5);
    expect(scale.base).toBe(16);
    expect(scale.smaller).toHaveLength(5);
    expect(scale.larger).toHaveLength(5);
    expect(scale.larger[0]).toBe(20);
    expect(scale.larger[1]).toBe(25);
    expect(scale.larger[2]).toBe(31.25);
    expect(scale.smaller[4]).toBeCloseTo(12.8, 1);
  });

  it('defaults to 5 steps each side', () => {
    const scale = generateModularScale(need('minor-third'), 16);
    expect(scale.smaller).toHaveLength(5);
    expect(scale.larger).toHaveLength(5);
  });
});

describe('generateFibonacciLike', () => {
  it('builds golden Fibonacci', () => {
    const seq = generateFibonacciLike(need('golden'), 7);
    expect(seq[0]).toBe(1);
    expect(seq[1]).toBe(1);
    expect(seq[2]).toBeCloseTo(2.618, 2);
    expect(seq[3]).toBeCloseTo(5.236, 2);
  });

  it('builds Fibonacci with major-third', () => {
    const seq = generateFibonacciLike(need('major-third'), 5);
    expect(seq[0]).toBe(1);
    expect(seq[1]).toBe(1);
    expect(seq[2]).toBe(2.25);
    expect(seq[3]).toBe(3.8125);
  });

  it('builds Fibonacci with a user-defined ratio', () => {
    const r: Ratio = { name: 'three-halves', a: 3, b: 2 };
    const seq = generateFibonacciLike(r, 5);
    expect(seq[0]).toBe(1);
    expect(seq[1]).toBe(1);
    expect(seq[2]).toBe(2.5);
    expect(seq[3]).toBe(4.75);
    expect(seq[4]).toBe(9.625);
  });

  it('throws on length < 2', () => {
    expect(() => generateFibonacciLike(need('golden'), 1)).toThrow(
      'Fibonacci sequence requires at least 2 terms',
    );
  });
});
