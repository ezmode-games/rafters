/**
 * Tests for mathematical progression systems
 */

import { describe, expect, it } from 'vitest';
import {
  generateFibonacciLike,
  generateModularScale,
  generateMusicalScale,
  generateProgression,
} from '../../src/math-utils/progressions.js';

describe('Mathematical Progressions', () => {
  describe('generateProgression', () => {
    it('should generate linear progression', () => {
      const result = generateProgression('linear', {
        baseValue: 4,
        steps: 5,
        includeZero: true,
      });

      expect(result).toEqual([0, 4, 8, 12, 16]);
    });

    it('should generate golden ratio progression', () => {
      const result = generateProgression('golden', {
        baseValue: 1,
        steps: 4,
      });

      expect(result).toHaveLength(4);
      expect(result[0]).toBe(1);
      expect(result[1]).toBeCloseTo(1.618, 3);
      expect(result[2]).toBeCloseTo(2.618, 3);
      expect(result[3]).toBeCloseTo(4.236, 3);
    });

    it('should generate minor-third musical progression', () => {
      const result = generateProgression('minor-third', {
        baseValue: 16,
        steps: 4,
      });

      expect(result).toHaveLength(4);
      expect(result[0]).toBe(16);
      expect(result[1]).toBeCloseTo(19.2, 1);
      expect(result[2]).toBeCloseTo(23.04, 1);
      expect(result[3]).toBeCloseTo(27.648, 1);
    });

    it('should generate exponential progression with custom multiplier', () => {
      const result = generateProgression('exponential', {
        baseValue: 2,
        steps: 4,
        multiplier: 1.5,
      });

      expect(result).toEqual([2, 3, 4.5, 6.75]);
    });

    it('should throw error for invalid progression type', () => {
      expect(() => {
        generateProgression('invalid' as never, { baseValue: 1, steps: 3 });
      }).toThrow('Invalid progression type');
    });
  });

  describe('generateMusicalScale', () => {
    it('should generate perfect-fourth scale', () => {
      const result = generateMusicalScale('perfect-fourth', 16, 1);

      expect(result).toHaveLength(12); // 12 semitones per octave
      expect(result[0]).toBe(16);
      expect(result[1]).toBeCloseTo(21.33, 1);
    });
  });

  describe('generateModularScale', () => {
    it('should generate modular typography scale', () => {
      const result = generateModularScale('major-third', 16, 3);

      expect(result.base).toBe(16);
      expect(result.smaller).toHaveLength(3);
      expect(result.larger).toHaveLength(3);

      // Check smaller sizes are decreasing
      expect(result.smaller[0]).toBeLessThan(result.smaller[1]);
      expect(result.smaller[1]).toBeLessThan(result.smaller[2]);
      expect(result.smaller[2]).toBeLessThan(result.base);

      // Check larger sizes are increasing
      expect(result.larger[0]).toBeGreaterThan(result.base);
      expect(result.larger[1]).toBeGreaterThan(result.larger[0]);
      expect(result.larger[2]).toBeGreaterThan(result.larger[1]);
    });
  });

  describe('generateFibonacciLike', () => {
    it('should generate golden Fibonacci sequence', () => {
      const result = generateFibonacciLike('golden', 7);

      expect(result).toHaveLength(7);
      expect(result[0]).toBe(1);
      expect(result[1]).toBe(1);
      // Each subsequent term should follow the pattern
      expect(result[2]).toBeCloseTo(2.618, 2);
      expect(result[3]).toBeCloseTo(5.236, 2);
    });

    it('should throw error for sequences less than 2 terms', () => {
      expect(() => {
        generateFibonacciLike('golden', 1);
      }).toThrow('Fibonacci sequence requires at least 2 terms');
    });
  });
});
