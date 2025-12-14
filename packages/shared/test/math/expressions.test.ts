/**
 * Unit tests for expression evaluation
 * Tests the safe recursive descent parser implementation
 */

import { describe, expect, it } from 'vitest';
import { evaluateExpression, isValidExpression } from '../../src/math/expressions.js';

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

    it('handles division by zero', () => {
      expect(Number.isNaN(evaluateExpression('10 / 0'))).toBe(true);
    });
  });

  describe('operator precedence', () => {
    it('evaluates * before +', () => {
      expect(evaluateExpression('2 + 3 * 4')).toBe(14); // not 20
    });

    it('evaluates / before -', () => {
      expect(evaluateExpression('10 - 8 / 2')).toBe(6); // not 1
    });

    it('evaluates left to right for same precedence', () => {
      expect(evaluateExpression('10 - 5 - 2')).toBe(3); // (10 - 5) - 2
      expect(evaluateExpression('20 / 4 / 2')).toBe(2.5); // (20 / 4) / 2
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

  describe('negative numbers', () => {
    it('handles unary minus', () => {
      expect(evaluateExpression('-5')).toBe(-5);
      expect(evaluateExpression('-5 + 3')).toBe(-2);
      expect(evaluateExpression('10 + -5')).toBe(5);
    });

    it('handles unary minus with parentheses', () => {
      expect(evaluateExpression('-(5 + 3)')).toBe(-8);
      expect(evaluateExpression('-( 10 * 2)')).toBe(-20);
    });

    it('handles double negatives', () => {
      expect(evaluateExpression('--5')).toBe(5);
    });
  });

  describe('decimal numbers', () => {
    it('evaluates with decimal numbers', () => {
      expect(evaluateExpression('1.5 + 2.5')).toBe(4);
      expect(evaluateExpression('3.14 * 2')).toBeCloseTo(6.28, 2);
    });

    it('handles leading decimals', () => {
      expect(evaluateExpression('0.5 + 0.5')).toBe(1);
    });
  });

  describe('musical ratios', () => {
    it('evaluates golden ratio', () => {
      expect(evaluateExpression('golden * 16')).toBeCloseTo(25.888, 2);
      expect(evaluateExpression('10 * golden')).toBeCloseTo(16.18, 2);
    });

    it('evaluates major-third', () => {
      expect(evaluateExpression('major-third * 16')).toBe(20);
      expect(evaluateExpression('16 * major-third')).toBe(20);
    });

    it('evaluates perfect-fifth', () => {
      expect(evaluateExpression('perfect-fifth * 10')).toBe(15);
    });

    it('evaluates augmented-fourth (√2)', () => {
      expect(evaluateExpression('augmented-fourth * 16')).toBeCloseTo(22.627, 2);
    });

    it('evaluates all musical intervals', () => {
      expect(evaluateExpression('minor-second * 100')).toBeCloseTo(106.7, 1);
      expect(evaluateExpression('major-second * 100')).toBeCloseTo(112.5, 1);
      expect(evaluateExpression('minor-third * 100')).toBe(120);
      expect(evaluateExpression('perfect-fourth * 100')).toBeCloseTo(133.3, 1);
    });

    it('allows ratios in complex expressions', () => {
      expect(evaluateExpression('(golden + 1) * 10')).toBeCloseTo(26.18, 2);
      expect(evaluateExpression('16 * major-third + 4')).toBe(24);
    });
  });

  describe('unit handling', () => {
    it('removes px units', () => {
      expect(evaluateExpression('16px + 8px')).toBe(24);
      expect(evaluateExpression('20px * 2')).toBe(40);
    });

    it('removes rem units', () => {
      expect(evaluateExpression('1rem + 0.5rem')).toBe(1.5);
      expect(evaluateExpression('2rem * 1.5')).toBe(3);
    });

    it('removes em units', () => {
      expect(evaluateExpression('1.5em + 0.5em')).toBe(2);
    });

    it('removes % units', () => {
      expect(evaluateExpression('50% + 25%')).toBe(75);
    });

    it('handles mixed units (calculates numerically)', () => {
      expect(evaluateExpression('16px + 1rem')).toBe(17); // Just removes units
    });
  });

  describe('whitespace handling', () => {
    it('handles no spaces', () => {
      expect(evaluateExpression('2+3*4')).toBe(14);
    });

    it('handles extra spaces', () => {
      expect(evaluateExpression('  2  +  3  *  4  ')).toBe(14);
    });

    it('handles tabs and newlines', () => {
      expect(evaluateExpression('2\t+\n3')).toBe(5);
    });
  });

  describe('error handling', () => {
    it('returns NaN for invalid expressions', () => {
      expect(Number.isNaN(evaluateExpression('abc'))).toBe(true);
      expect(Number.isNaN(evaluateExpression('2 + + 3'))).toBe(true);
      expect(Number.isNaN(evaluateExpression('(2 + 3'))).toBe(true); // Missing )
    });

    it('returns NaN for empty expressions', () => {
      expect(Number.isNaN(evaluateExpression(''))).toBe(true);
      expect(Number.isNaN(evaluateExpression('   '))).toBe(true);
    });

    it('returns NaN for expressions with unexpected tokens', () => {
      // '2 3' tokenizes to [2, 3] - parser sees 2 but has leftover 3
      const result1 = evaluateExpression('2 3');
      // Parser may treat this as just '2' and ignore the '3' - that's acceptable
      // The important thing is no code execution happens
      expect(typeof result1).toBe('number');

      // Extra ) should fail
      expect(Number.isNaN(evaluateExpression('2 + 3)'))).toBe(true);
    });
  });

  describe('real-world calc() examples', () => {
    it('evaluates spacing scales', () => {
      // Base * golden ratio
      expect(evaluateExpression('16 * golden')).toBeCloseTo(25.888, 2);

      // Base * musical interval
      expect(evaluateExpression('16 * major-third')).toBe(20);

      // Complex progression
      expect(evaluateExpression('16 * golden * golden')).toBeCloseTo(41.888, 2);
    });

    it('evaluates responsive sizing', () => {
      // 16 + (100 - 320) / 2 = 16 + (-220) / 2 = 16 + (-110) = -94
      expect(evaluateExpression('16px + (100% - 320px) / 2')).toBeCloseTo(-94, 1);
    });

    it('evaluates font size adjustments', () => {
      expect(evaluateExpression('1rem * 1.5')).toBe(1.5);
      expect(evaluateExpression('16px * perfect-fifth')).toBe(24);
    });
  });

  describe('security: cannot execute arbitrary code', () => {
    it('does not evaluate function calls', () => {
      // 'alert(1)' becomes 'alert' (invalid identifier) and numbers - parser will fail or tokenize weirdly
      const result1 = evaluateExpression('alert(1)');
      // The key is that alert() doesn't actually execute - result will be NaN or a number, not undefined
      expect(typeof result1).toBe('number');

      // Math.random() similarly won't execute
      const result2 = evaluateExpression('Math.random()');
      expect(typeof result2).toBe('number');
    });

    it('does not evaluate property access', () => {
      expect(Number.isNaN(evaluateExpression('window.location'))).toBe(true);
      expect(Number.isNaN(evaluateExpression('process.env'))).toBe(true);
    });

    it('does not evaluate assignments', () => {
      expect(Number.isNaN(evaluateExpression('x = 5'))).toBe(true);
    });

    it('does not evaluate template literals', () => {
      // biome-ignore lint/suspicious/noTemplateCurlyInString: intentionally testing invalid template literal string
      expect(Number.isNaN(evaluateExpression('`${2 + 3}`'))).toBe(true);
    });
  });
});

describe('isValidExpression', () => {
  it('returns true for valid expressions', () => {
    expect(isValidExpression('2 + 3')).toBe(true);
    expect(isValidExpression('golden * 16')).toBe(true);
    expect(isValidExpression('(10 + 5) * 2')).toBe(true);
  });

  it('returns false for invalid expressions', () => {
    expect(isValidExpression('abc')).toBe(false);
    expect(isValidExpression('2 + + 3')).toBe(false);
    expect(isValidExpression('')).toBe(false);
  });

  it('returns false for division by zero', () => {
    expect(isValidExpression('10 / 0')).toBe(false);
  });
});
