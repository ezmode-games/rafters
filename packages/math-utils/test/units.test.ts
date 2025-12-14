/**
 * Unit tests for unit-aware mathematical operations
 * Tests CSS unit parsing, formatting, calculations, and conversions
 */

import { describe, expect, it } from 'vitest';
import {
  calculateWithUnits,
  convertUnit,
  evaluateWithUnits,
  formatUnit,
  parseUnit,
} from '../src/units.js';

describe('parseUnit', () => {
  describe('pixel units', () => {
    it('parses whole pixels', () => {
      expect(parseUnit('16px')).toEqual({ value: 16, unit: 'px' });
      expect(parseUnit('100px')).toEqual({ value: 100, unit: 'px' });
    });

    it('parses decimal pixels', () => {
      expect(parseUnit('16.5px')).toEqual({ value: 16.5, unit: 'px' });
      expect(parseUnit('1.25px')).toEqual({ value: 1.25, unit: 'px' });
    });

    it('parses negative pixels', () => {
      expect(parseUnit('-10px')).toEqual({ value: -10, unit: 'px' });
    });
  });

  describe('rem units', () => {
    it('parses rem values', () => {
      expect(parseUnit('1rem')).toEqual({ value: 1, unit: 'rem' });
      expect(parseUnit('1.5rem')).toEqual({ value: 1.5, unit: 'rem' });
      expect(parseUnit('0.875rem')).toEqual({ value: 0.875, unit: 'rem' });
    });
  });

  describe('percentage units', () => {
    it('parses percentages', () => {
      expect(parseUnit('100%')).toEqual({ value: 100, unit: '%' });
      expect(parseUnit('50%')).toEqual({ value: 50, unit: '%' });
      expect(parseUnit('33.333%')).toEqual({ value: 33.333, unit: '%' });
    });
  });

  describe('viewport units', () => {
    it('parses vw units', () => {
      expect(parseUnit('100vw')).toEqual({ value: 100, unit: 'vw' });
      expect(parseUnit('50vw')).toEqual({ value: 50, unit: 'vw' });
    });

    it('parses vh units', () => {
      expect(parseUnit('100vh')).toEqual({ value: 100, unit: 'vh' });
      expect(parseUnit('50vh')).toEqual({ value: 50, unit: 'vh' });
    });
  });

  describe('unitless values', () => {
    it('parses numbers without units', () => {
      expect(parseUnit('16')).toEqual({ value: 16, unit: '' });
      expect(parseUnit('1.5')).toEqual({ value: 1.5, unit: '' });
    });
  });

  describe('whitespace handling', () => {
    it('handles leading/trailing whitespace', () => {
      expect(parseUnit('  16px  ')).toEqual({ value: 16, unit: 'px' });
      expect(parseUnit('  1.5rem  ')).toEqual({ value: 1.5, unit: 'rem' });
    });
  });

  describe('error handling', () => {
    it('throws on invalid CSS values', () => {
      expect(() => parseUnit('invalid')).toThrow('Invalid CSS value');
      expect(() => parseUnit('px16')).toThrow('Invalid CSS value');
      expect(() => parseUnit('')).toThrow('Invalid CSS value');
    });
  });
});

describe('formatUnit', () => {
  it('formats pixel values', () => {
    expect(formatUnit({ value: 16, unit: 'px' })).toBe('16px');
    expect(formatUnit({ value: 1.5, unit: 'px' })).toBe('1.5px');
  });

  it('formats rem values', () => {
    expect(formatUnit({ value: 1, unit: 'rem' })).toBe('1rem');
    expect(formatUnit({ value: 1.5, unit: 'rem' })).toBe('1.5rem');
  });

  it('formats percentage values', () => {
    expect(formatUnit({ value: 100, unit: '%' })).toBe('100%');
    expect(formatUnit({ value: 50.5, unit: '%' })).toBe('50.5%');
  });

  it('formats unitless values', () => {
    expect(formatUnit({ value: 16, unit: '' })).toBe('16');
    expect(formatUnit({ value: 1.5, unit: '' })).toBe('1.5');
  });

  it('round-trips with parseUnit', () => {
    const testCases = ['16px', '1.5rem', '100%', '50vw', '16'];
    for (const testCase of testCases) {
      const parsed = parseUnit(testCase);
      const formatted = formatUnit(parsed);
      expect(formatted).toBe(testCase);
    }
  });
});

describe('calculateWithUnits', () => {
  describe('multiplication', () => {
    it('multiplies with scalar', () => {
      expect(calculateWithUnits('16px', '*', 2)).toBe('32px');
      expect(calculateWithUnits('1.5rem', '*', 2)).toBe('3rem');
    });

    it('multiplies with same units', () => {
      expect(calculateWithUnits('16px', '*', '2px')).toBe('32px');
    });

    it('preserves left unit for multiplication', () => {
      expect(calculateWithUnits('10px', '*', 3)).toBe('30px');
      expect(calculateWithUnits('2rem', '*', 1.5)).toBe('3rem');
    });
  });

  describe('division', () => {
    it('divides with scalar', () => {
      expect(calculateWithUnits('32px', '/', 2)).toBe('16px');
      expect(calculateWithUnits('3rem', '/', 2)).toBe('1.5rem');
    });

    it('throws on division by zero', () => {
      expect(() => calculateWithUnits('16px', '/', 0)).toThrow('Division by zero');
    });

    it('preserves left unit for division', () => {
      expect(calculateWithUnits('100%', '/', 2)).toBe('50%');
    });
  });

  describe('addition', () => {
    it('adds same units', () => {
      expect(calculateWithUnits('16px', '+', '8px')).toBe('24px');
      expect(calculateWithUnits('1rem', '+', '0.5rem')).toBe('1.5rem');
    });

    it('adds with unitless right operand', () => {
      expect(calculateWithUnits('16px', '+', 4)).toBe('20px');
    });

    it('throws on different units', () => {
      expect(() => calculateWithUnits('16px', '+', '1rem')).toThrow('Cannot add different units');
    });
  });

  describe('subtraction', () => {
    it('subtracts same units', () => {
      expect(calculateWithUnits('20px', '-', '5px')).toBe('15px');
      expect(calculateWithUnits('2rem', '-', '0.5rem')).toBe('1.5rem');
    });

    it('subtracts with unitless right operand', () => {
      expect(calculateWithUnits('20px', '-', 5)).toBe('15px');
    });

    it('throws on different units', () => {
      expect(() => calculateWithUnits('20px', '-', '1rem')).toThrow(
        'Cannot subtract different units',
      );
    });
  });
});

describe('convertUnit', () => {
  const defaultContext = {
    baseFontSize: 16,
    viewportWidth: 1920,
    viewportHeight: 1080,
  };

  describe('pixel conversions', () => {
    it('converts px to rem', () => {
      expect(convertUnit('16px', 'rem', defaultContext)).toBe('1rem');
      expect(convertUnit('32px', 'rem', defaultContext)).toBe('2rem');
      expect(convertUnit('24px', 'rem', defaultContext)).toBe('1.5rem');
    });

    it('converts px to vw', () => {
      const result = parseUnit(convertUnit('1920px', 'vw', defaultContext));
      expect(result.value).toBeCloseTo(100, 1);
      expect(result.unit).toBe('vw');
    });

    it('converts px to vh', () => {
      const result = parseUnit(convertUnit('1080px', 'vh', defaultContext));
      expect(result.value).toBeCloseTo(100, 1);
      expect(result.unit).toBe('vh');
    });
  });

  describe('rem conversions', () => {
    it('converts rem to px', () => {
      expect(convertUnit('1rem', 'px', defaultContext)).toBe('16px');
      expect(convertUnit('2rem', 'px', defaultContext)).toBe('32px');
      expect(convertUnit('1.5rem', 'px', defaultContext)).toBe('24px');
    });

    it('converts rem to vw', () => {
      const result = parseUnit(convertUnit('1rem', 'vw', defaultContext));
      expect(result.value).toBeCloseTo(0.833, 2); // 16px / 1920px * 100
      expect(result.unit).toBe('vw');
    });
  });

  describe('viewport conversions', () => {
    it('converts vw to px', () => {
      expect(convertUnit('100vw', 'px', defaultContext)).toBe('1920px');
      expect(convertUnit('50vw', 'px', defaultContext)).toBe('960px');
    });

    it('converts vh to px', () => {
      expect(convertUnit('100vh', 'px', defaultContext)).toBe('1080px');
      expect(convertUnit('50vh', 'px', defaultContext)).toBe('540px');
    });
  });

  describe('no conversion needed', () => {
    it('returns value unchanged if units match', () => {
      expect(convertUnit('16px', 'px', defaultContext)).toBe('16px');
      expect(convertUnit('1.5rem', 'rem', defaultContext)).toBe('1.5rem');
    });
  });

  describe('custom context', () => {
    it('uses custom base font size', () => {
      const customContext = { baseFontSize: 20 };
      expect(convertUnit('1rem', 'px', customContext)).toBe('20px');
      expect(convertUnit('20px', 'rem', customContext)).toBe('1rem');
    });

    it('uses custom viewport dimensions', () => {
      const customContext = { viewportWidth: 1000, viewportHeight: 800 };
      expect(convertUnit('100vw', 'px', customContext)).toBe('1000px');
      expect(convertUnit('100vh', 'px', customContext)).toBe('800px');
    });
  });

  describe('error handling', () => {
    it('throws on percentage without context', () => {
      expect(() => convertUnit('50%', 'px', defaultContext)).toThrow('Cannot convert percentage');
    });

    it('throws on unsupported unit conversions', () => {
      expect(() => convertUnit('10ch', 'px', defaultContext)).toThrow(
        'Unsupported unit conversion from',
      );
      // biome-ignore lint/suspicious/noExplicitAny: testing invalid unit type
      expect(() => convertUnit('16px', 'ch' as any, defaultContext)).toThrow(
        'Unsupported unit conversion to',
      );
    });
  });
});

describe('evaluateWithUnits', () => {
  describe('simple multiplication', () => {
    it('evaluates simple multiplication', () => {
      expect(evaluateWithUnits('16px * 1.5')).toBe('24px');
      expect(evaluateWithUnits('2rem * 2')).toBe('4rem');
    });

    it('handles decimal multipliers', () => {
      expect(evaluateWithUnits('10px * 0.5')).toBe('5px');
    });
  });

  describe('simple addition', () => {
    it('evaluates simple addition', () => {
      expect(evaluateWithUnits('16px + 8px')).toBe('24px');
      expect(evaluateWithUnits('1rem + 0.5rem')).toBe('1.5rem');
    });
  });

  describe('variable substitution', () => {
    it('substitutes variables in expressions', () => {
      expect(evaluateWithUnits('base * 2', { base: '16px' })).toBe('32px');
      expect(evaluateWithUnits('base * 1.5', { base: '16px' })).toBe('24px');
    });

    it('substitutes single variable in multiplication', () => {
      expect(evaluateWithUnits('spacing * 2', { spacing: '8px' })).toBe('16px');
    });
  });

  describe('error handling', () => {
    it('throws on complex expressions not yet supported', () => {
      expect(() => evaluateWithUnits('16px * 2 + 8px')).toThrow(
        /Invalid CSS value|Complex unit expressions not yet supported/,
      );
    });
  });
});

describe('real-world CSS use cases', () => {
  it('calculates responsive spacing', () => {
    expect(calculateWithUnits('16px', '*', 1.5)).toBe('24px');
    expect(calculateWithUnits('1rem', '*', 2)).toBe('2rem');
  });

  it('calculates container widths', () => {
    expect(calculateWithUnits('100%', '/', 2)).toBe('50%');
    const result = parseUnit(calculateWithUnits('100vw', '/', 3));
    expect(result.value).toBeCloseTo(33.333, 2);
    expect(result.unit).toBe('vw');
  });

  it('calculates fluid typography', () => {
    const context = { baseFontSize: 16, viewportWidth: 1920 };
    const pxValue = convertUnit('1rem', 'px', context);
    const vwValue = convertUnit(pxValue, 'vw', context);

    expect(pxValue).toBe('16px');
    expect(parseUnit(vwValue).value).toBeCloseTo(0.833, 2);
  });

  it('calculates spacing scale with multipliers', () => {
    const base = '4px';
    expect(calculateWithUnits(base, '*', 2)).toBe('8px');
    expect(calculateWithUnits(base, '*', 4)).toBe('16px');
    expect(calculateWithUnits(base, '*', 8)).toBe('32px');
  });
});
