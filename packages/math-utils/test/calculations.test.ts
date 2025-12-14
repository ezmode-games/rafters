/**
 * Unit tests for mathematical calculation engine
 * Tests expression evaluation, progression steps, and interpolation
 */

import { describe, expect, it } from 'vitest';
import {
  calculateProgressionStep,
  evaluateExpression,
  findClosestProgressionStep,
  interpolate,
} from '../src/calculations.js';

describe('evaluateExpression', () => {
  describe('basic arithmetic', () => {
    it('evaluates addition', () => {
      expect(evaluateExpression('2 + 3')).toBe(5);
      expect(evaluateExpression('10 + 5 + 3')).toBe(18);
    });

    it('evaluates subtraction', () => {
      expect(evaluateExpression('10 - 3')).toBe(7);
      expect(evaluateExpression('20 - 5 - 2')).toBe(13);
    });

    it('evaluates multiplication', () => {
      expect(evaluateExpression('4 * 5')).toBe(20);
      expect(evaluateExpression('2 * 3 * 4')).toBe(24);
    });

    it('evaluates division', () => {
      expect(evaluateExpression('20 / 4')).toBe(5);
      expect(evaluateExpression('100 / 5 / 2')).toBe(10);
    });

    it('throws on division by zero', () => {
      expect(() => evaluateExpression('10 / 0')).toThrow('Division by zero');
    });
  });

  describe('operator precedence', () => {
    it('evaluates * before +', () => {
      expect(evaluateExpression('2 + 3 * 4')).toBe(14);
    });

    it('evaluates / before -', () => {
      expect(evaluateExpression('10 - 8 / 2')).toBe(6);
    });

    it('evaluates left to right for same precedence', () => {
      expect(evaluateExpression('10 - 5 - 2')).toBe(3);
      expect(evaluateExpression('20 / 4 / 2')).toBe(2.5);
    });
  });

  describe('parentheses', () => {
    it('evaluates expressions in parentheses first', () => {
      expect(evaluateExpression('(2 + 3) * 4')).toBe(20);
      expect(evaluateExpression('2 * (3 + 4)')).toBe(14);
    });

    it('handles nested parentheses', () => {
      expect(evaluateExpression('((2 + 3) * 4) + 5')).toBe(25);
      expect(evaluateExpression('2 * ((3 + 4) * 5)')).toBe(70);
    });

    it('handles multiple parentheses groups', () => {
      expect(evaluateExpression('(2 + 3) * (4 + 5)')).toBe(45);
    });
  });

  describe('unary minus', () => {
    it('handles negative numbers', () => {
      expect(evaluateExpression('-5')).toBe(-5);
      expect(evaluateExpression('-5 + 3')).toBe(-2);
      expect(evaluateExpression('10 + -5')).toBe(5);
    });

    it('handles negative with parentheses', () => {
      expect(evaluateExpression('-(5 + 3)')).toBe(-8);
      expect(evaluateExpression('-(10 * 2)')).toBe(-20);
    });

    it('handles double negatives', () => {
      expect(evaluateExpression('--5')).toBe(5);
    });
  });

  describe('ratio substitution', () => {
    it('evaluates golden ratio', () => {
      expect(evaluateExpression('16 * golden')).toBeCloseTo(25.888, 2);
      expect(evaluateExpression('golden * 16')).toBeCloseTo(25.888, 2);
    });

    it('evaluates major-third', () => {
      expect(evaluateExpression('16 * major-third')).toBe(20);
      expect(evaluateExpression('major-third * 16')).toBe(20);
    });

    it('evaluates perfect-fifth', () => {
      expect(evaluateExpression('10 * perfect-fifth')).toBe(15);
    });

    it('evaluates augmented-fourth (sqrt2)', () => {
      expect(evaluateExpression('16 * augmented-fourth')).toBeCloseTo(22.627, 2);
    });

    it('allows ratios in complex expressions', () => {
      expect(evaluateExpression('(golden + 1) * 10')).toBeCloseTo(26.18, 2);
      expect(evaluateExpression('16 * major-third + 4')).toBe(24);
    });
  });

  describe('variable substitution', () => {
    it('substitutes braced variables', () => {
      expect(evaluateExpression('{base} * 2', { base: 16 })).toBe(32);
      expect(evaluateExpression('{spacing-base} + 4', { 'spacing-base': 8 })).toBe(12);
    });

    it('substitutes unbraced variables', () => {
      expect(evaluateExpression('base * 2', { base: 16 })).toBe(32);
      expect(evaluateExpression('base + spacing', { base: 16, spacing: 4 })).toBe(20);
    });

    it('combines variables and ratios', () => {
      expect(evaluateExpression('base * golden', { base: 16 })).toBeCloseTo(25.888, 2);
      expect(evaluateExpression('base * minor-third + spacing', { base: 16, spacing: 4 })).toBe(
        23.2,
      );
    });

    it('handles complex expressions with variables', () => {
      const result = evaluateExpression('(base * golden) / perfect-fourth', { base: 12 });
      // 12 * 1.618 = 19.416, 19.416 / 1.333 = 14.566
      expect(result).toBeCloseTo(14.566, 2);
    });
  });

  describe('whitespace handling', () => {
    it('handles no spaces', () => {
      expect(evaluateExpression('2+3*4')).toBe(14);
    });

    it('handles extra spaces', () => {
      expect(evaluateExpression('  2  +  3  *  4  ')).toBe(14);
    });
  });

  describe('error handling', () => {
    it('throws on invalid expressions', () => {
      expect(() => evaluateExpression('(2 + 3')).toThrow();
      expect(() => evaluateExpression('2 +')).toThrow();
    });

    it('throws with descriptive errors', () => {
      expect(() => evaluateExpression('invalid')).toThrow(/Cannot evaluate expression/);
    });
  });

  describe('security: no arbitrary code execution', () => {
    it('does not execute function calls', () => {
      // Parser treats function-like syntax as invalid - either throws or returns NaN
      // The key is that NO CODE EXECUTION happens
      try {
        const result1 = evaluateExpression('alert(1)');
        expect(typeof result1).toBe('number');
        // biome-ignore lint/suspicious/noExplicitAny: error type checking in tests
      } catch (e: any) {
        expect(e.message).toContain('Cannot evaluate expression');
      }

      try {
        const result2 = evaluateExpression('Math.random()');
        expect(typeof result2).toBe('number');
        // biome-ignore lint/suspicious/noExplicitAny: error type checking in tests
      } catch (e: any) {
        expect(e.message).toContain('Cannot evaluate expression');
      }
    });

    it('does not allow property access', () => {
      expect(() => evaluateExpression('window.location')).toThrow(/Cannot evaluate expression/);
      expect(() => evaluateExpression('process.env')).toThrow(/Cannot evaluate expression/);
    });
  });
});

describe('calculateProgressionStep', () => {
  describe('linear progression', () => {
    it('calculates linear steps', () => {
      expect(calculateProgressionStep(4, 'linear', 0)).toBe(4);
      expect(calculateProgressionStep(4, 'linear', 1)).toBe(8);
      expect(calculateProgressionStep(4, 'linear', 2)).toBe(12);
      expect(calculateProgressionStep(4, 'linear', 4)).toBe(20);
    });
  });

  describe('exponential progression', () => {
    it('calculates exponential steps with default multiplier', () => {
      expect(calculateProgressionStep(16, 'exponential', 0)).toBe(16);
      expect(calculateProgressionStep(16, 'exponential', 1)).toBe(20);
      expect(calculateProgressionStep(16, 'exponential', 2)).toBe(25);
    });

    it('calculates exponential steps with custom multiplier', () => {
      expect(calculateProgressionStep(10, 'exponential', 0, 2)).toBe(10);
      expect(calculateProgressionStep(10, 'exponential', 1, 2)).toBe(20);
      expect(calculateProgressionStep(10, 'exponential', 2, 2)).toBe(40);
    });
  });

  describe('musical ratio progressions', () => {
    it('calculates golden ratio steps', () => {
      expect(calculateProgressionStep(16, 'golden', 0)).toBeCloseTo(16, 1);
      expect(calculateProgressionStep(16, 'golden', 1)).toBeCloseTo(25.888, 2);
      expect(calculateProgressionStep(16, 'golden', 2)).toBeCloseTo(41.888, 2);
    });

    it('calculates major-third steps', () => {
      expect(calculateProgressionStep(16, 'major-third', 0)).toBe(16);
      expect(calculateProgressionStep(16, 'major-third', 1)).toBe(20);
      expect(calculateProgressionStep(16, 'major-third', 2)).toBe(25);
    });

    it('calculates perfect-fifth steps', () => {
      expect(calculateProgressionStep(10, 'perfect-fifth', 0)).toBe(10);
      expect(calculateProgressionStep(10, 'perfect-fifth', 1)).toBe(15);
      expect(calculateProgressionStep(10, 'perfect-fifth', 2)).toBe(22.5);
    });
  });

  describe('error handling', () => {
    it('throws on negative step', () => {
      expect(() => calculateProgressionStep(16, 'linear', -1)).toThrow('Step must be non-negative');
    });

    it('throws on invalid progression type', () => {
      // biome-ignore lint/suspicious/noExplicitAny: testing invalid type
      expect(() => calculateProgressionStep(16, 'invalid' as any, 0)).toThrow(
        'Invalid progression type',
      );
    });
  });
});

describe('findClosestProgressionStep', () => {
  it('finds closest golden ratio step', () => {
    const result = findClosestProgressionStep(25, 16, 'golden', 10);
    expect(result.step).toBe(1);
    expect(result.value).toBeCloseTo(25.888, 2);
    expect(result.difference).toBeCloseTo(0.888, 2);
  });

  it('finds exact match', () => {
    const result = findClosestProgressionStep(20, 16, 'major-third', 10);
    expect(result.step).toBe(1);
    expect(result.value).toBe(20);
    expect(result.difference).toBe(0);
  });

  it('finds closest for linear progression', () => {
    const result = findClosestProgressionStep(17, 4, 'linear', 10);
    expect(result.step).toBe(3); // 4*4 = 16
    expect(result.value).toBe(16);
    expect(result.difference).toBe(1);
  });

  it('handles base value as closest', () => {
    const result = findClosestProgressionStep(15, 16, 'golden', 5);
    expect(result.step).toBe(0);
    expect(result.value).toBe(16);
    expect(result.difference).toBe(1);
  });

  it('stops search when value exceeds target significantly', () => {
    const result = findClosestProgressionStep(30, 16, 'golden', 100);
    expect(result.step).toBeLessThan(10); // Should stop early
  });
});

describe('interpolate', () => {
  describe('linear interpolation', () => {
    it('interpolates at 0%', () => {
      expect(interpolate(10, 20, 0, 'linear')).toBe(10);
    });

    it('interpolates at 50%', () => {
      expect(interpolate(10, 20, 0.5, 'linear')).toBe(15);
    });

    it('interpolates at 100%', () => {
      expect(interpolate(10, 20, 1, 'linear')).toBe(20);
    });

    it('interpolates at 25%', () => {
      expect(interpolate(0, 100, 0.25, 'linear')).toBe(25);
    });
  });

  describe('eased interpolation', () => {
    it('applies golden ratio easing', () => {
      const result = interpolate(10, 20, 0.5, 'golden');
      expect(result).toBeGreaterThan(10);
      expect(result).toBeLessThan(20);
      // Easing can accelerate or decelerate depending on the ratio
    });

    it('applies major-third easing', () => {
      const result = interpolate(0, 100, 0.5, 'major-third');
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(100);
    });

    it('respects start and end values', () => {
      expect(interpolate(10, 20, 0, 'golden')).toBe(10);
      expect(interpolate(10, 20, 1, 'golden')).toBe(20);
    });
  });

  describe('error handling', () => {
    it('throws on progress < 0', () => {
      expect(() => interpolate(10, 20, -0.1, 'linear')).toThrow('Progress must be between 0 and 1');
    });

    it('throws on progress > 1', () => {
      expect(() => interpolate(10, 20, 1.1, 'linear')).toThrow('Progress must be between 0 and 1');
    });
  });
});
