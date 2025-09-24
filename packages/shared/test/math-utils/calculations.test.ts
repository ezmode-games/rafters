/**
 * Tests for mathematical calculation engine
 */

import { describe, expect, it } from 'vitest';
import {
  calculateProgressionStep,
  evaluateExpression,
  findClosestProgressionStep,
  interpolate,
} from '../../src/math-utils/calculations.js';

describe('Mathematical Calculations', () => {
  describe('evaluateExpression', () => {
    it('should evaluate simple ratio expressions', () => {
      const result = evaluateExpression('16 * golden');
      expect(result).toBeCloseTo(25.8885, 3);
    });

    it('should evaluate expressions with variables', () => {
      const result = evaluateExpression('base * minor-third + spacing', {
        base: 16,
        spacing: 4,
      });
      expect(result).toBeCloseTo(23.2, 1);
    });

    it('should evaluate complex expressions with parentheses', () => {
      const result = evaluateExpression('(base * golden) / perfect-fourth', {
        base: 12,
      });
      expect(result).toBeCloseTo(14.566, 2);
    });

    it('should throw error for unsafe expressions', () => {
      expect(() => {
        evaluateExpression('alert("hack")');
      }).toThrow('Unsafe expression');
    });

    it('should throw error for invalid expressions', () => {
      expect(() => {
        evaluateExpression('16 * unknown-ratio');
      }).toThrow('Cannot evaluate expression');
    });
  });

  describe('calculateProgressionStep', () => {
    it('should calculate linear progression step', () => {
      const result = calculateProgressionStep(4, 'linear', 3);
      expect(result).toBe(16); // 4 * (3 + 1)
    });

    it('should calculate golden ratio progression step', () => {
      const result = calculateProgressionStep(16, 'golden', 2);
      expect(result).toBeCloseTo(41.887, 2); // 16 * 1.618^2
    });

    it('should calculate exponential progression step', () => {
      const result = calculateProgressionStep(2, 'exponential', 3, 1.5);
      expect(result).toBeCloseTo(6.75, 2); // 2 * 1.5^3
    });

    it('should throw error for negative steps', () => {
      expect(() => {
        calculateProgressionStep(16, 'golden', -1);
      }).toThrow('Step must be non-negative');
    });
  });

  describe('findClosestProgressionStep', () => {
    it('should find closest golden ratio step', () => {
      const result = findClosestProgressionStep(25, 16, 'golden', 10);

      expect(result.step).toBe(1);
      expect(result.value).toBeCloseTo(25.888, 2);
      expect(result.difference).toBeCloseTo(0.888, 2);
    });

    it('should find closest linear step', () => {
      const result = findClosestProgressionStep(14, 4, 'linear', 10);

      expect(result.step).toBe(2); // 4 * 3 = 12 is closest
      expect(result.value).toBe(12);
      expect(result.difference).toBe(2);
    });
  });

  describe('interpolate', () => {
    it('should perform linear interpolation', () => {
      const result = interpolate(10, 20, 0.5, 'linear');
      expect(result).toBe(15);
    });

    it('should perform eased interpolation with golden ratio', () => {
      const result = interpolate(10, 20, 0.5, 'golden');
      expect(result).toBeCloseTo(16.18, 1);
    });

    it('should throw error for invalid progress values', () => {
      expect(() => {
        interpolate(10, 20, 1.5, 'linear');
      }).toThrow('Progress must be between 0 and 1');

      expect(() => {
        interpolate(10, 20, -0.5, 'linear');
      }).toThrow('Progress must be between 0 and 1');
    });
  });
});
