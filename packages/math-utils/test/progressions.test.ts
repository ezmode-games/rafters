/**
 * Unit tests for mathematical progression systems
 * Tests sequence generation, musical scales, Fibonacci-like sequences, and modular scales
 */

import { describe, expect, it } from 'vitest';
import {
  createProgression,
  generateFibonacciLike,
  generateModularScale,
  generateMusicalScale,
  generateProgression,
} from '../src/progressions.js';

describe('generateProgression', () => {
  describe('linear progression', () => {
    it('generates basic linear sequence', () => {
      const result = generateProgression('linear', { baseValue: 4, steps: 5 });
      expect(result).toEqual([4, 8, 12, 16, 20]);
    });

    it('includes zero when requested', () => {
      const result = generateProgression('linear', { baseValue: 4, steps: 5, includeZero: true });
      expect(result).toEqual([0, 4, 8, 12, 16]);
    });

    it('handles single step', () => {
      const result = generateProgression('linear', { baseValue: 10, steps: 1 });
      expect(result).toEqual([10]);
    });
  });

  describe('exponential progression', () => {
    it('generates exponential sequence with default multiplier', () => {
      const result = generateProgression('exponential', { baseValue: 16, steps: 4 });
      expect(result).toEqual([16, 20, 25, 31.25]);
    });

    it('generates exponential sequence with custom multiplier', () => {
      const result = generateProgression('exponential', { baseValue: 10, steps: 4, multiplier: 2 });
      expect(result).toEqual([10, 20, 40, 80]);
    });

    it('includes zero when requested', () => {
      const result = generateProgression('exponential', {
        baseValue: 8,
        steps: 3,
        includeZero: true,
      });
      expect(result).toEqual([0, 8, 10]);
    });
  });

  describe('golden ratio progression', () => {
    it('generates golden ratio sequence', () => {
      const result = generateProgression('golden', { baseValue: 1, steps: 4 });
      expect(result[0]).toBeCloseTo(1, 10);
      expect(result[1]).toBeCloseTo(1.618, 3);
      expect(result[2]).toBeCloseTo(2.618, 3);
      expect(result[3]).toBeCloseTo(4.236, 3);
    });

    it('generates golden ratio from base 16', () => {
      const result = generateProgression('golden', { baseValue: 16, steps: 3 });
      expect(result[0]).toBeCloseTo(16, 1);
      expect(result[1]).toBeCloseTo(25.888, 2);
      expect(result[2]).toBeCloseTo(41.888, 2);
    });

    it('includes zero when requested', () => {
      const result = generateProgression('golden', { baseValue: 10, steps: 3, includeZero: true });
      expect(result[0]).toBe(0);
      expect(result[1]).toBeCloseTo(10, 1);
      expect(result[2]).toBeCloseTo(16.18, 2);
    });
  });

  describe('musical ratio progressions', () => {
    it('generates minor-third progression', () => {
      const result = generateProgression('minor-third', { baseValue: 16, steps: 4 });
      expect(result[0]).toBe(16);
      expect(result[1]).toBe(19.2);
      expect(result[2]).toBe(23.04);
      expect(result[3]).toBeCloseTo(27.648, 2);
    });

    it('generates major-third progression', () => {
      const result = generateProgression('major-third', { baseValue: 16, steps: 4 });
      expect(result).toEqual([16, 20, 25, 31.25]);
    });

    it('generates perfect-fifth progression', () => {
      const result = generateProgression('perfect-fifth', { baseValue: 10, steps: 3 });
      expect(result).toEqual([10, 15, 22.5]);
    });
  });

  describe('error handling', () => {
    it('throws on invalid progression type', () => {
      // biome-ignore lint/suspicious/noExplicitAny: testing invalid type
      expect(() => generateProgression('invalid' as any, { baseValue: 10, steps: 3 })).toThrow(
        'Invalid progression type',
      );
    });
  });
});

describe('generateMusicalScale', () => {
  it('generates perfect-fourth scale for 1 octave', () => {
    const result = generateMusicalScale('perfect-fourth', 16, 1);
    expect(result).toHaveLength(12); // 12 semitones per octave
    expect(result[0]).toBeCloseTo(16, 1);
  });

  it('generates major-third scale', () => {
    const result = generateMusicalScale('major-third', 10, 1);
    expect(result).toHaveLength(12);
    expect(result[0]).toBe(10);
    expect(result[1]).toBe(12.5);
  });

  it('generates multiple octaves', () => {
    const result = generateMusicalScale('perfect-fifth', 16, 2);
    expect(result).toHaveLength(24); // 24 semitones for 2 octaves
  });

  it('defaults to 1 octave when not specified', () => {
    const result = generateMusicalScale('minor-third', 8);
    expect(result).toHaveLength(12);
  });
});

describe('generateFibonacciLike', () => {
  describe('with ratio names', () => {
    it('generates golden Fibonacci sequence', () => {
      const result = generateFibonacciLike('golden', 7);
      expect(result).toHaveLength(7);
      expect(result[0]).toBe(1);
      expect(result[1]).toBe(1);
      // Each subsequent term is previous * golden + term before that
      expect(result[2]).toBeCloseTo(2.618, 2);
      expect(result[3]).toBeCloseTo(5.236, 2);
    });

    it('generates major-third Fibonacci', () => {
      const result = generateFibonacciLike('major-third', 5);
      expect(result[0]).toBe(1);
      expect(result[1]).toBe(1);
      expect(result[2]).toBe(2.25); // 1 * 1.25 + 1
      expect(result[3]).toBe(3.8125); // 2.25 * 1.25 + 1
    });
  });

  describe('with custom ratios', () => {
    it('generates Fibonacci with custom ratio 1.5', () => {
      const result = generateFibonacciLike(1.5, 6);
      expect(result[0]).toBe(1);
      expect(result[1]).toBe(1);
      expect(result[2]).toBe(2.5); // 1 * 1.5 + 1
      expect(result[3]).toBe(4.75); // 2.5 * 1.5 + 1
      expect(result[4]).toBe(9.625); // 4.75 * 1.5 + 2.5
      expect(result[5]).toBe(19.1875); // 9.625 * 1.5 + 4.75
    });

    it('generates Fibonacci with ratio 2', () => {
      const result = generateFibonacciLike(2, 5);
      expect(result[0]).toBe(1);
      expect(result[1]).toBe(1);
      expect(result[2]).toBe(3); // 1 * 2 + 1
      expect(result[3]).toBe(7); // 3 * 2 + 1
      expect(result[4]).toBe(17); // 7 * 2 + 3
    });
  });

  describe('error handling', () => {
    it('throws on length < 2', () => {
      expect(() => generateFibonacciLike('golden', 1)).toThrow(
        'Fibonacci sequence requires at least 2 terms',
      );
      expect(() => generateFibonacciLike('golden', 0)).toThrow(
        'Fibonacci sequence requires at least 2 terms',
      );
    });
  });
});

describe('generateModularScale', () => {
  it('generates modular scale with major-third', () => {
    const result = generateModularScale('major-third', 16, 5);

    expect(result.base).toBe(16);
    expect(result.smaller).toHaveLength(5);
    expect(result.larger).toHaveLength(5);

    // Smaller sizes (going down)
    expect(result.smaller[4]).toBeCloseTo(12.8, 1); // 16 / 1.25
    expect(result.smaller[3]).toBeCloseTo(10.24, 2); // 16 / 1.25^2
    expect(result.smaller[2]).toBeCloseTo(8.192, 2); // 16 / 1.25^3

    // Larger sizes (going up)
    expect(result.larger[0]).toBe(20); // 16 * 1.25
    expect(result.larger[1]).toBe(25); // 16 * 1.25^2
    expect(result.larger[2]).toBe(31.25); // 16 * 1.25^3
  });

  it('generates modular scale with golden ratio', () => {
    const result = generateModularScale('golden', 16, 3);

    expect(result.base).toBe(16);
    expect(result.smaller).toHaveLength(3);
    expect(result.larger).toHaveLength(3);

    expect(result.larger[0]).toBeCloseTo(25.888, 2);
    expect(result.larger[1]).toBeCloseTo(41.888, 2);
  });

  it('generates modular scale with perfect-fifth', () => {
    const result = generateModularScale('perfect-fifth', 100, 2);

    expect(result.base).toBe(100);
    expect(result.smaller[1]).toBeCloseTo(66.667, 2); // 100 / 1.5
    expect(result.smaller[0]).toBeCloseTo(44.444, 2); // 100 / 1.5^2
    expect(result.larger[0]).toBe(150); // 100 * 1.5
    expect(result.larger[1]).toBe(225); // 100 * 1.5^2
  });

  it('defaults to 5 steps when not specified', () => {
    const result = generateModularScale('minor-third', 16);

    expect(result.smaller).toHaveLength(5);
    expect(result.larger).toHaveLength(5);
  });

  it('generates typography scale use case', () => {
    const result = generateModularScale('major-third', 16, 5);

    // Common typography sizes
    expect(result.larger[0]).toBe(20); // H5
    expect(result.larger[1]).toBe(25); // H4
    expect(result.larger[2]).toBe(31.25); // H3
    expect(result.larger[3]).toBeCloseTo(39.06, 2); // H2
    expect(result.larger[4]).toBeCloseTo(48.83, 2); // H1
  });
});

describe('createProgression', () => {
  describe('minor-third progression', () => {
    const progression = createProgression('minor-third');

    it('exposes type and ratio', () => {
      expect(progression.type).toBe('minor-third');
      expect(progression.ratio).toBe(1.2);
    });

    it('computes step 0 as base value', () => {
      expect(progression.compute(4, 0)).toBe(4);
      expect(progression.compute(16, 0)).toBe(16);
    });

    it('computes positive steps (larger values)', () => {
      expect(progression.compute(4, 1)).toBeCloseTo(4.8, 2); // 4 * 1.2
      expect(progression.compute(4, 2)).toBeCloseTo(5.76, 2); // 4 * 1.2^2
      expect(progression.compute(4, 3)).toBeCloseTo(6.912, 2); // 4 * 1.2^3
    });

    it('computes negative steps (smaller values)', () => {
      expect(progression.compute(4, -1)).toBeCloseTo(3.333, 2); // 4 / 1.2
      expect(progression.compute(4, -2)).toBeCloseTo(2.778, 2); // 4 / 1.2^2
    });

    it('generates sequence from start step', () => {
      const seq = progression.generateSequence(4, 5, { startStep: -1 });
      expect(seq).toHaveLength(5);
      expect(seq[0]).toBeCloseTo(3.333, 2); // step -1
      expect(seq[1]).toBeCloseTo(4, 2); // step 0
      expect(seq[2]).toBeCloseTo(4.8, 2); // step 1
      expect(seq[3]).toBeCloseTo(5.76, 2); // step 2
      expect(seq[4]).toBeCloseTo(6.912, 2); // step 3
    });

    it('generates sequence with includeZero', () => {
      const seq = progression.generateSequence(4, 3, { includeZero: true });
      expect(seq[0]).toBe(0);
      // When includeZero is true, the remaining values start from step 1
      expect(seq[1]).toBeCloseTo(4.8, 2); // step 1
      expect(seq[2]).toBeCloseTo(5.76, 2); // step 2
    });
  });

  describe('golden ratio progression', () => {
    const progression = createProgression('golden');

    it('exposes type and ratio', () => {
      expect(progression.type).toBe('golden');
      expect(progression.ratio).toBeCloseTo(1.618, 3);
    });

    it('computes values correctly', () => {
      expect(progression.compute(10, 0)).toBe(10);
      expect(progression.compute(10, 1)).toBeCloseTo(16.18, 2);
      expect(progression.compute(10, -1)).toBeCloseTo(6.18, 2);
    });
  });

  describe('linear progression', () => {
    const progression = createProgression('linear');

    it('exposes type and ratio', () => {
      expect(progression.type).toBe('linear');
      expect(progression.ratio).toBe(1);
    });

    it('computes as base * (step + 1)', () => {
      expect(progression.compute(4, 0)).toBe(4); // 4 * 1
      expect(progression.compute(4, 1)).toBe(8); // 4 * 2
      expect(progression.compute(4, 2)).toBe(12); // 4 * 3
    });
  });

  describe('exponential progression', () => {
    const progression = createProgression('exponential');

    it('uses default multiplier of 1.25', () => {
      expect(progression.ratio).toBe(1.25);
    });

    it('computes exponential values', () => {
      expect(progression.compute(16, 0)).toBe(16);
      expect(progression.compute(16, 1)).toBe(20); // 16 * 1.25
      expect(progression.compute(16, 2)).toBe(25); // 16 * 1.25^2
    });
  });

  describe('design-tokens use cases', () => {
    it('radius scale with minor-third', () => {
      const progression = createProgression('minor-third');
      const baseRadius = 4;

      // Radius scale: sm(-1), DEFAULT(0), md(1), lg(2), xl(3), 2xl(4), 3xl(5)
      expect(progression.compute(baseRadius, -1)).toBeCloseTo(3.33, 2); // sm
      expect(progression.compute(baseRadius, 0)).toBe(4); // DEFAULT
      expect(progression.compute(baseRadius, 1)).toBeCloseTo(4.8, 2); // md
      expect(progression.compute(baseRadius, 2)).toBeCloseTo(5.76, 2); // lg
      expect(progression.compute(baseRadius, 3)).toBeCloseTo(6.91, 2); // xl
      expect(progression.compute(baseRadius, 4)).toBeCloseTo(8.29, 2); // 2xl
      expect(progression.compute(baseRadius, 5)).toBeCloseTo(9.95, 2); // 3xl
    });

    it('motion duration scale with minor-third', () => {
      const progression = createProgression('minor-third');
      const baseDuration = 150;

      // Duration scale: fast(-1), normal(0), slow(1), slower(2)
      expect(progression.compute(baseDuration, -1)).toBeCloseTo(125, 0); // fast
      expect(progression.compute(baseDuration, 0)).toBe(150); // normal
      expect(progression.compute(baseDuration, 1)).toBeCloseTo(180, 0); // slow
      expect(progression.compute(baseDuration, 2)).toBeCloseTo(216, 0); // slower
    });
  });
});

describe('real-world design system use cases', () => {
  it('generates spacing scale with golden ratio', () => {
    const spacing = generateProgression('golden', { baseValue: 4, steps: 8 });

    expect(spacing[0]).toBeCloseTo(4, 1); // xs
    expect(spacing[1]).toBeCloseTo(6.472, 2); // sm
    expect(spacing[2]).toBeCloseTo(10.472, 2); // md
    expect(spacing[3]).toBeCloseTo(16.944, 2); // lg
    expect(spacing[4]).toBeCloseTo(27.416, 2); // xl
  });

  it('generates typography scale with minor-third', () => {
    const type = generateProgression('minor-third', { baseValue: 16, steps: 7 });

    expect(type[0]).toBe(16); // Base
    expect(type[1]).toBe(19.2); // Step 1
    expect(type[2]).toBe(23.04); // Step 2
    expect(type[3]).toBeCloseTo(27.648, 2); // Step 3
  });

  it('generates exponential easing curve', () => {
    const easing = generateProgression('exponential', {
      baseValue: 0.1,
      steps: 10,
      multiplier: 1.2,
    });

    expect(easing[0]).toBeCloseTo(0.1, 2);
    expect(easing[9]).toBeCloseTo(0.516, 2); // Exponential growth
  });
});
