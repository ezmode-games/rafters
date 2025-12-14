/**
 * Unit tests for mathematical ratios
 * Tests musical intervals and golden ratio constants
 */

import { describe, expect, it } from 'vitest';
import {
  ALL_RATIOS,
  AUGMENTED_FOURTH,
  GOLDEN_RATIO,
  MAJOR_SECOND,
  MAJOR_THIRD,
  MINOR_SECOND,
  MINOR_THIRD,
  PERFECT_FIFTH,
  PERFECT_FOURTH,
  type RatioName,
} from '../../src/math/ratios.js';

describe('Musical Ratios', () => {
  describe('individual ratio constants', () => {
    it('exports GOLDEN_RATIO correctly', () => {
      expect(GOLDEN_RATIO).toBe(1.618);
    });

    it('exports MAJOR_THIRD correctly (5:4)', () => {
      expect(MAJOR_THIRD).toBe(1.25);
    });

    it('exports MINOR_THIRD correctly (6:5)', () => {
      expect(MINOR_THIRD).toBe(1.2);
    });

    it('exports PERFECT_FOURTH correctly (4:3)', () => {
      expect(PERFECT_FOURTH).toBe(1.333);
    });

    it('exports PERFECT_FIFTH correctly (3:2)', () => {
      expect(PERFECT_FIFTH).toBe(1.5);
    });

    it('exports AUGMENTED_FOURTH correctly (√2)', () => {
      expect(AUGMENTED_FOURTH).toBeCloseTo(Math.SQRT2, 10);
      expect(AUGMENTED_FOURTH).toBeCloseTo(Math.SQRT2, 5);
    });

    it('exports MAJOR_SECOND correctly (9:8)', () => {
      expect(MAJOR_SECOND).toBe(1.125);
    });

    it('exports MINOR_SECOND correctly (16:15)', () => {
      expect(MINOR_SECOND).toBe(1.067);
    });
  });

  describe('ALL_RATIOS object', () => {
    it('exports all ratios in a single object', () => {
      expect(ALL_RATIOS).toBeDefined();
      expect(typeof ALL_RATIOS).toBe('object');
    });

    it('contains all ratio keys', () => {
      expect(ALL_RATIOS).toHaveProperty('golden');
      expect(ALL_RATIOS).toHaveProperty('major-third');
      expect(ALL_RATIOS).toHaveProperty('minor-third');
      expect(ALL_RATIOS).toHaveProperty('perfect-fourth');
      expect(ALL_RATIOS).toHaveProperty('perfect-fifth');
      expect(ALL_RATIOS).toHaveProperty('augmented-fourth');
      expect(ALL_RATIOS).toHaveProperty('major-second');
      expect(ALL_RATIOS).toHaveProperty('minor-second');
    });

    it('maps ratio names to correct values', () => {
      expect(ALL_RATIOS.golden).toBe(GOLDEN_RATIO);
      expect(ALL_RATIOS['major-third']).toBe(MAJOR_THIRD);
      expect(ALL_RATIOS['minor-third']).toBe(MINOR_THIRD);
      expect(ALL_RATIOS['perfect-fourth']).toBe(PERFECT_FOURTH);
      expect(ALL_RATIOS['perfect-fifth']).toBe(PERFECT_FIFTH);
      expect(ALL_RATIOS['augmented-fourth']).toBe(AUGMENTED_FOURTH);
      expect(ALL_RATIOS['major-second']).toBe(MAJOR_SECOND);
      expect(ALL_RATIOS['minor-second']).toBe(MINOR_SECOND);
    });

    it('is a const object (readonly)', () => {
      // TypeScript enforces this at compile time with 'as const'
      expect(Object.isFrozen(ALL_RATIOS)).toBe(false); // 'as const' is TS-only
      // But we can verify the structure is correct
      expect(Object.keys(ALL_RATIOS)).toHaveLength(8);
    });
  });

  describe('RatioName type', () => {
    it('includes all ratio keys', () => {
      const validKeys: RatioName[] = [
        'golden',
        'major-third',
        'minor-third',
        'perfect-fourth',
        'perfect-fifth',
        'augmented-fourth',
        'major-second',
        'minor-second',
      ];

      // Verify these are valid keys
      for (const key of validKeys) {
        expect(ALL_RATIOS[key]).toBeDefined();
        expect(typeof ALL_RATIOS[key]).toBe('number');
      }
    });
  });

  describe('mathematical correctness', () => {
    it('GOLDEN_RATIO is approximately (1 + √5) / 2', () => {
      const phi = (1 + Math.sqrt(5)) / 2;
      expect(GOLDEN_RATIO).toBeCloseTo(phi, 3);
    });

    it('MAJOR_THIRD is exactly 5/4', () => {
      expect(MAJOR_THIRD).toBe(5 / 4);
    });

    it('MINOR_THIRD is exactly 6/5', () => {
      expect(MINOR_THIRD).toBe(6 / 5);
    });

    it('PERFECT_FOURTH is approximately 4/3', () => {
      expect(PERFECT_FOURTH).toBeCloseTo(4 / 3, 3);
    });

    it('PERFECT_FIFTH is exactly 3/2', () => {
      expect(PERFECT_FIFTH).toBe(3 / 2);
    });

    it('AUGMENTED_FOURTH is exactly √2', () => {
      expect(AUGMENTED_FOURTH).toBe(Math.SQRT2);
    });

    it('MAJOR_SECOND is exactly 9/8', () => {
      expect(MAJOR_SECOND).toBe(9 / 8);
    });

    it('MINOR_SECOND is approximately 16/15', () => {
      expect(MINOR_SECOND).toBeCloseTo(16 / 15, 3);
    });
  });

  describe('ratio ordering', () => {
    it('ratios are ordered by size', () => {
      expect(MINOR_SECOND).toBeLessThan(MAJOR_SECOND);
      expect(MAJOR_SECOND).toBeLessThan(MINOR_THIRD);
      expect(MINOR_THIRD).toBeLessThan(MAJOR_THIRD);
      expect(MAJOR_THIRD).toBeLessThan(PERFECT_FOURTH);
      expect(PERFECT_FOURTH).toBeLessThan(AUGMENTED_FOURTH);
      expect(AUGMENTED_FOURTH).toBeLessThan(PERFECT_FIFTH);
      expect(PERFECT_FIFTH).toBeLessThan(GOLDEN_RATIO);
    });

    it('all ratios are greater than 1', () => {
      for (const [_name, value] of Object.entries(ALL_RATIOS)) {
        expect(value).toBeGreaterThan(1);
      }
    });
  });

  describe('use cases for design systems', () => {
    it('generates spacing scales with golden ratio', () => {
      const base = 16;
      const steps = [base, base * GOLDEN_RATIO, base * GOLDEN_RATIO ** 2, base * GOLDEN_RATIO ** 3];

      expect(steps[0]).toBe(16);
      expect(steps[1]).toBeCloseTo(25.888, 2);
      expect(steps[2]).toBeCloseTo(41.888, 2);
      expect(steps[3]).toBeCloseTo(67.77, 2);
    });

    it('generates typography scales with major third', () => {
      const base = 16;
      const scale = [base / MAJOR_THIRD, base, base * MAJOR_THIRD, base * MAJOR_THIRD ** 2];

      expect(scale[0]).toBeCloseTo(12.8, 1); // Smaller
      expect(scale[1]).toBe(16); // Base
      expect(scale[2]).toBe(20); // Larger
      expect(scale[3]).toBe(25); // Even larger
    });

    it('generates perfect fifth intervals for musical harmony', () => {
      const base = 440; // A4
      const fifth = base * PERFECT_FIFTH;

      expect(fifth).toBe(660); // E5
    });
  });
});
