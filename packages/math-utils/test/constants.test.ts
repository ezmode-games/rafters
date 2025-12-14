/**
 * Unit tests for mathematical constants and ratios
 * Tests musical intervals, mathematical constants, and ratio lookup functions
 */

import { describe, expect, it } from 'vitest';
import {
  ALL_RATIOS,
  getRatio,
  isValidRatio,
  MATHEMATICAL_CONSTANTS,
  MUSICAL_RATIOS,
} from '../src/constants.js';

describe('MUSICAL_RATIOS', () => {
  it('exports minor-second correctly (16:15)', () => {
    expect(MUSICAL_RATIOS['minor-second']).toBe(1.067);
  });

  it('exports major-second correctly (9:8)', () => {
    expect(MUSICAL_RATIOS['major-second']).toBe(1.125);
  });

  it('exports minor-third correctly (6:5)', () => {
    expect(MUSICAL_RATIOS['minor-third']).toBe(1.2);
  });

  it('exports major-third correctly (5:4)', () => {
    expect(MUSICAL_RATIOS['major-third']).toBe(1.25);
  });

  it('exports perfect-fourth correctly (4:3)', () => {
    expect(MUSICAL_RATIOS['perfect-fourth']).toBe(1.333);
  });

  it('exports augmented-fourth correctly (√2)', () => {
    expect(MUSICAL_RATIOS['augmented-fourth']).toBe(Math.SQRT2);
  });

  it('exports perfect-fifth correctly (3:2)', () => {
    expect(MUSICAL_RATIOS['perfect-fifth']).toBe(1.5);
  });
});

describe('MATHEMATICAL_CONSTANTS', () => {
  it('exports golden ratio correctly', () => {
    expect(MATHEMATICAL_CONSTANTS.golden).toBeCloseTo(1.618, 3);
    expect(MATHEMATICAL_CONSTANTS['golden-ratio']).toBeCloseTo(1.618, 3);
  });

  it('exports sqrt2 correctly', () => {
    expect(MATHEMATICAL_CONSTANTS.sqrt2).toBe(Math.SQRT2);
  });

  it('exports sqrt3 correctly', () => {
    expect(MATHEMATICAL_CONSTANTS.sqrt3).toBe(Math.sqrt(3));
  });

  it('exports sqrt5 correctly', () => {
    expect(MATHEMATICAL_CONSTANTS.sqrt5).toBe(Math.sqrt(5));
  });

  it('exports e correctly', () => {
    expect(MATHEMATICAL_CONSTANTS.e).toBe(Math.E);
  });

  it('exports pi correctly', () => {
    expect(MATHEMATICAL_CONSTANTS.pi).toBe(Math.PI);
  });

  it('exports silver ratio correctly', () => {
    expect(MATHEMATICAL_CONSTANTS.silver).toBe(1 + Math.SQRT2);
  });
});

describe('ALL_RATIOS', () => {
  it('combines musical ratios and mathematical constants', () => {
    expect(ALL_RATIOS).toBeDefined();
    expect(typeof ALL_RATIOS).toBe('object');
  });

  it('contains all musical ratios', () => {
    expect(ALL_RATIOS['minor-second']).toBe(1.067);
    expect(ALL_RATIOS['major-second']).toBe(1.125);
    expect(ALL_RATIOS['minor-third']).toBe(1.2);
    expect(ALL_RATIOS['major-third']).toBe(1.25);
    expect(ALL_RATIOS['perfect-fourth']).toBe(1.333);
    expect(ALL_RATIOS['augmented-fourth']).toBe(Math.SQRT2);
    expect(ALL_RATIOS['perfect-fifth']).toBe(1.5);
  });

  it('contains all mathematical constants', () => {
    expect(ALL_RATIOS.golden).toBeCloseTo(1.618, 3);
    expect(ALL_RATIOS.sqrt2).toBe(Math.SQRT2);
    expect(ALL_RATIOS.e).toBe(Math.E);
    expect(ALL_RATIOS.pi).toBe(Math.PI);
  });

  it('has at least 15 ratios/constants', () => {
    const keys = Object.keys(ALL_RATIOS);
    expect(keys.length).toBeGreaterThanOrEqual(15);
  });
});

describe('getRatio', () => {
  it('retrieves valid ratio by name', () => {
    expect(getRatio('golden')).toBeCloseTo(1.618, 3);
    expect(getRatio('major-third')).toBe(1.25);
    expect(getRatio('perfect-fifth')).toBe(1.5);
  });

  it('retrieves mathematical constants', () => {
    expect(getRatio('sqrt2')).toBe(Math.SQRT2);
    expect(getRatio('e')).toBe(Math.E);
    expect(getRatio('pi')).toBe(Math.PI);
  });

  it('throws on unknown ratio', () => {
    expect(() => getRatio('nonexistent')).toThrow('Unknown ratio: nonexistent');
  });

  it('includes available ratios in error message', () => {
    try {
      getRatio('invalid');
      // biome-ignore lint/suspicious/noExplicitAny: error type checking in tests
    } catch (error: any) {
      expect(error.message).toContain('Available ratios:');
      expect(error.message).toContain('golden');
      expect(error.message).toContain('major-third');
    }
  });
});

describe('isValidRatio', () => {
  it('returns true for valid musical ratios', () => {
    expect(isValidRatio('minor-second')).toBe(true);
    expect(isValidRatio('major-third')).toBe(true);
    expect(isValidRatio('perfect-fifth')).toBe(true);
  });

  it('returns true for valid mathematical constants', () => {
    expect(isValidRatio('golden')).toBe(true);
    expect(isValidRatio('sqrt2')).toBe(true);
    expect(isValidRatio('pi')).toBe(true);
  });

  it('returns false for invalid names', () => {
    expect(isValidRatio('nonexistent')).toBe(false);
    expect(isValidRatio('invalid-ratio')).toBe(false);
    expect(isValidRatio('')).toBe(false);
  });
});

describe('mathematical correctness', () => {
  it('golden ratio is approximately (1 + √5) / 2', () => {
    const phi = (1 + Math.sqrt(5)) / 2;
    expect(MATHEMATICAL_CONSTANTS.golden).toBeCloseTo(phi, 10);
  });

  it('major-third is exactly 5/4', () => {
    expect(MUSICAL_RATIOS['major-third']).toBe(5 / 4);
  });

  it('minor-third is exactly 6/5', () => {
    expect(MUSICAL_RATIOS['minor-third']).toBe(6 / 5);
  });

  it('perfect-fifth is exactly 3/2', () => {
    expect(MUSICAL_RATIOS['perfect-fifth']).toBe(3 / 2);
  });

  it('augmented-fourth is exactly √2', () => {
    expect(MUSICAL_RATIOS['augmented-fourth']).toBe(Math.SQRT2);
  });

  it('major-second is exactly 9/8', () => {
    expect(MUSICAL_RATIOS['major-second']).toBe(9 / 8);
  });
});

describe('ratio ordering', () => {
  it('musical ratios are ordered by size', () => {
    expect(MUSICAL_RATIOS['minor-second']).toBeLessThan(MUSICAL_RATIOS['major-second']);
    expect(MUSICAL_RATIOS['major-second']).toBeLessThan(MUSICAL_RATIOS['minor-third']);
    expect(MUSICAL_RATIOS['minor-third']).toBeLessThan(MUSICAL_RATIOS['major-third']);
    expect(MUSICAL_RATIOS['major-third']).toBeLessThan(MUSICAL_RATIOS['perfect-fourth']);
    expect(MUSICAL_RATIOS['perfect-fourth']).toBeLessThan(MUSICAL_RATIOS['augmented-fourth']);
    expect(MUSICAL_RATIOS['augmented-fourth']).toBeLessThan(MUSICAL_RATIOS['perfect-fifth']);
  });

  it('all ratios are greater than 1', () => {
    for (const value of Object.values(ALL_RATIOS)) {
      expect(value).toBeGreaterThan(1);
    }
  });
});

describe('design system use cases', () => {
  it('generates spacing scales with golden ratio', () => {
    const base = 16;
    const steps = [base, base * ALL_RATIOS.golden, base * ALL_RATIOS.golden ** 2];

    expect(steps[0]).toBe(16);
    expect(steps[1]).toBeCloseTo(25.888, 2);
    expect(steps[2]).toBeCloseTo(41.888, 2);
  });

  it('generates typography scales with major third', () => {
    const base = 16;
    const scale = [
      base / ALL_RATIOS['major-third'],
      base,
      base * ALL_RATIOS['major-third'],
      base * ALL_RATIOS['major-third'] ** 2,
    ];

    expect(scale[0]).toBeCloseTo(12.8, 1);
    expect(scale[1]).toBe(16);
    expect(scale[2]).toBe(20);
    expect(scale[3]).toBe(25);
  });

  it('generates perfect fifth intervals for musical harmony', () => {
    const base = 440; // A4
    const fifth = base * ALL_RATIOS['perfect-fifth'];

    expect(fifth).toBe(660); // E5
  });
});
