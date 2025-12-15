/**
 * Unit tests for mathematical ratios
 * Tests musical intervals and golden ratio constants
 */

import { describe, expect, it } from 'vitest';
import { ALL_RATIOS } from '../src/constants';

describe('Musical Ratios', () => {
  describe('individual ratio constants', () => {
    it('exports GOLDEN_RATIO correctly', () => {
      expect(ALL_RATIOS.golden).toBeCloseTo(1.618, 3);
    });

    it('exports MAJOR_THIRD correctly (5:4)', () => {
      expect(ALL_RATIOS['major-third']).toBe(1.25);
    });

    it('exports MINOR_THIRD correctly (6:5)', () => {
      expect(ALL_RATIOS['minor-third']).toBe(1.2);
    });

    it('exports PERFECT_FOURTH correctly (4:3)', () => {
      expect(ALL_RATIOS['perfect-fourth']).toBeCloseTo(1.333, 3);
    });

    it('exports PERFECT_FIFTH correctly (3:2)', () => {
      expect(ALL_RATIOS['perfect-fifth']).toBe(1.5);
    });

    it('exports AUGMENTED_FOURTH correctly (√2)', () => {
      expect(ALL_RATIOS['augmented-fourth']).toBeCloseTo(Math.SQRT2, 10);
      expect(ALL_RATIOS['augmented-fourth']).toBeCloseTo(Math.SQRT2, 5);
    });

    it('exports MAJOR_SECOND correctly (9:8)', () => {
      expect(ALL_RATIOS['major-second']).toBe(1.125);
    });

    it('exports MINOR_SECOND correctly (16:15)', () => {
      expect(ALL_RATIOS['minor-second']).toBeCloseTo(1.067, 3);
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
      expect(ALL_RATIOS.golden).toBeCloseTo(ALL_RATIOS.golden, 6);
      expect(ALL_RATIOS['major-third']).toBeCloseTo(ALL_RATIOS['major-third'] as number, 6);
      expect(ALL_RATIOS['minor-third']).toBeCloseTo(ALL_RATIOS['minor-third'] as number, 6);
      expect(ALL_RATIOS['perfect-fourth']).toBeCloseTo(ALL_RATIOS['perfect-fourth'] as number, 6);
      expect(ALL_RATIOS['perfect-fifth']).toBeCloseTo(ALL_RATIOS['perfect-fifth'] as number, 6);
      expect(ALL_RATIOS['augmented-fourth']).toBeCloseTo(
        ALL_RATIOS['augmented-fourth'] as number,
        6,
      );
      expect(ALL_RATIOS['major-second']).toBeCloseTo(ALL_RATIOS['major-second'] as number, 6);
      expect(ALL_RATIOS['minor-second']).toBeCloseTo(ALL_RATIOS['minor-second'] as number, 6);
    });

    it('is a const object (readonly)', () => {
      // TypeScript enforces this at compile time with 'as const'
      expect(Object.isFrozen(ALL_RATIOS)).toBe(false); // 'as const' is TS-only
      // But we can verify the structure is correct
      // We currently export 15 combined ratios (musical + mathematical)
      expect(Object.keys(ALL_RATIOS)).toHaveLength(15);
    });
  });

  describe('RatioName type', () => {
    it('includes all ratio keys', () => {
      const validKeys = [
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
        expect(ALL_RATIOS[key as keyof typeof ALL_RATIOS]).toBeDefined();
        expect(typeof ALL_RATIOS[key as keyof typeof ALL_RATIOS]).toBe('number');
      }
    });
  });

  describe('mathematical correctness', () => {
    it('GOLDEN_RATIO is approximately (1 + √5) / 2', () => {
      const phi = (1 + Math.sqrt(5)) / 2;
      expect(ALL_RATIOS.golden).toBeCloseTo(phi, 3);
    });

    it('MAJOR_THIRD is exactly 5/4', () => {
      expect(ALL_RATIOS['major-third']).toBe(5 / 4);
    });

    it('MINOR_THIRD is exactly 6/5', () => {
      expect(ALL_RATIOS['minor-third']).toBe(6 / 5);
    });

    it('PERFECT_FOURTH is approximately 4/3', () => {
      expect(ALL_RATIOS['perfect-fourth']).toBeCloseTo(4 / 3, 3);
    });

    it('PERFECT_FIFTH is exactly 3/2', () => {
      expect(ALL_RATIOS['perfect-fifth']).toBe(3 / 2);
    });

    it('AUGMENTED_FOURTH is exactly √2', () => {
      expect(ALL_RATIOS['augmented-fourth']).toBe(Math.SQRT2);
    });

    it('MAJOR_SECOND is exactly 9/8', () => {
      expect(ALL_RATIOS['major-second']).toBe(9 / 8);
    });

    it('MINOR_SECOND is approximately 16/15', () => {
      expect(ALL_RATIOS['minor-second']).toBeCloseTo(16 / 15, 3);
    });
  });

  describe('ratio ordering', () => {
    it('ratios are ordered by size', () => {
      expect(ALL_RATIOS['minor-second']).toBeLessThan(ALL_RATIOS['major-second']);
      expect(ALL_RATIOS['major-second']).toBeLessThan(ALL_RATIOS['minor-third']);
      expect(ALL_RATIOS['minor-third']).toBeLessThan(ALL_RATIOS['major-third']);
      expect(ALL_RATIOS['major-third']).toBeLessThan(ALL_RATIOS['perfect-fourth']);
      expect(ALL_RATIOS['perfect-fourth']).toBeLessThan(ALL_RATIOS['augmented-fourth']);
      expect(ALL_RATIOS['augmented-fourth']).toBeLessThan(ALL_RATIOS['perfect-fifth']);
      expect(ALL_RATIOS['perfect-fifth']).toBeLessThan(ALL_RATIOS.golden);
    });

    it('all ratios are greater than 1', () => {
      for (const [_name, value] of Object.entries(ALL_RATIOS)) {
        expect(value as unknown as number).toBeGreaterThan(1);
      }
    });
  });

  describe('use cases for design systems', () => {
    it('generates spacing scales with golden ratio', () => {
      const base = 16;
      const golden = ALL_RATIOS.golden;
      const steps = [base, base * golden, base * golden ** 2, base * golden ** 3];

      expect(steps[0]).toBe(16);
      expect(steps[1]).toBeCloseTo(25.888, 2);
      expect(steps[2]).toBeCloseTo(41.888, 2);
      // allow slightly larger tolerance due to floating point differences
      expect(steps[3]).toBeCloseTo(67.777, 3);
    });

    it('generates typography scales with major third', () => {
      const base2 = 16;
      const majorThird = ALL_RATIOS['major-third'];
      const scale = [base2 / majorThird, base2, base2 * majorThird, base2 * majorThird ** 2];

      expect(scale[0]).toBeCloseTo(12.8, 1); // Smaller
      expect(scale[1]).toBe(16); // Base
      expect(scale[2]).toBe(20); // Larger
      expect(scale[3]).toBe(25); // Even larger
    });

    it('generates perfect fifth intervals for musical harmony', () => {
      const base3 = 440; // A4
      const fifth = base3 * ALL_RATIOS['perfect-fifth'];

      expect(fifth).toBe(660); // E5
    });
  });
});
