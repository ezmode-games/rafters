/**
 * Spacing Generator Tests
 *
 * Validates spacing scale tokens with mathematical progressions,
 * integration with math-utils, and comprehensive scaling systems.
 */

import { TokenSchema } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { generateSpacingScale } from '../../src/generators/spacing.js';

describe('Spacing Generator', () => {
  describe('generateSpacingScale', () => {
    it('should generate linear spacing progression by default', () => {
      const tokens = generateSpacingScale('linear', 4, 1.25, 8);

      expect(tokens).toHaveLength(9); // 0 through 8

      // Check linear progression
      expect(tokens[0].name).toBe('0');
      expect(tokens[0].value).toBe('0rem');
      expect(tokens[1].name).toBe('1');
      expect(tokens[1].value).toBe('0.25rem'); // 4px / 16
      expect(tokens[2].name).toBe('2');
      expect(tokens[2].value).toBe('0.5rem'); // 8px / 16
    });

    it('should generate golden ratio progression', () => {
      const tokens = generateSpacingScale('golden', 4, 1.25, 6);

      expect(tokens).toHaveLength(7); // 0 through 6

      expect(tokens[0].value).toBe('0rem');
      expect(tokens[1].value).toBe('0.25rem'); // Base: 4px

      // Golden ratio progression: 4 * golden^(i-1)
      expect(Number.parseFloat(tokens[2].value as string)).toBeCloseTo(0.4, 1); // ~6.47px / 16
      expect(Number.parseFloat(tokens[3].value as string)).toBeCloseTo(0.65, 1); // ~10.47px / 16
    });

    it('should generate musical ratio progressions', () => {
      const tokens = generateSpacingScale('major-third', 4, 1.25, 5);

      expect(tokens).toHaveLength(6); // 0 through 5

      expect(tokens[1].value).toBe('0.25rem'); // Base: 4px
      // Major third ratio: 1.25, so 4 * 1.25 = 5px = 0.31rem
      expect(Number.parseFloat(tokens[2].value as string)).toBeCloseTo(0.31, 1);
    });

    it('should generate custom exponential progression', () => {
      const tokens = generateSpacingScale('custom', 4, 2.0, 4);

      expect(tokens).toHaveLength(5); // 0 through 4

      expect(tokens[1].value).toBe('0.25rem'); // Base: 4px
      expect(tokens[2].value).toBe('0.5rem'); // 4 * 2.0 = 8px
      expect(tokens[3].value).toBe('1rem'); // 4 * 2.0^2 = 16px
      expect(tokens[4].value).toBe('2rem'); // 4 * 2.0^3 = 32px
    });

    it('should include mathematical metadata for derived tokens', () => {
      const tokens = generateSpacingScale('golden', 4, 1.25, 5);

      // Base tokens (0, 1) should not have math relationships
      expect(tokens[0].mathRelationship).toBeUndefined();
      expect(tokens[1].mathRelationship).toBeUndefined();

      // Derived tokens should have math relationships
      expect(tokens[2].mathRelationship).toBe('{1} * golden^1');
      expect(tokens[3].mathRelationship).toBe('{1} * golden^2');
      expect(tokens[4].mathRelationship).toBe('{1} * golden^3');
    });

    it('should include progression system metadata', () => {
      const tokens = generateSpacingScale('perfect-fourth', 4, 1.25, 4);

      for (const token of tokens) {
        expect(token.progressionSystem).toBe('perfect-fourth');
      }
    });

    it('should include proper scale positions', () => {
      const tokens = generateSpacingScale('linear', 4, 1.25, 6);

      for (let i = 0; i < tokens.length; i++) {
        expect(tokens[i].scalePosition).toBe(i);
      }
    });

    it('should include semantic meaning based on system', () => {
      const tokens = generateSpacingScale('linear', 4, 1.25, 3);

      expect(tokens[0].semanticMeaning).toBe('Mathematical spacing step 0');
      expect(tokens[1].semanticMeaning).toBe('Mathematical spacing step 1');
      expect(tokens[2].semanticMeaning).toBe('Mathematical spacing step 2');
    });

    it('should generate proper token structure', () => {
      const tokens = generateSpacingScale('linear', 4, 1.25, 3);

      for (const token of tokens) {
        expect(token.category).toBe('spacing');
        expect(token.namespace).toBe('spacing');
        expect(token.generateUtilityClass).toBe(true);
        expect(token.applicableComponents).toEqual(['all']);
        expect(token.accessibilityLevel).toBe('AAA');
        expect(token.cognitiveLoad).toBe(1);
        expect(token.trustLevel).toBe('low');
        expect(token.consequence).toBe('reversible');
      }
    });

    it('should handle different musical ratios', () => {
      const systems = [
        'minor-second',
        'major-second',
        'minor-third',
        'major-third',
        'perfect-fourth',
        'augmented-fourth',
        'perfect-fifth',
      ];

      for (const system of systems) {
        const tokens = generateSpacingScale(
          system as
            | 'minor-second'
            | 'major-second'
            | 'minor-third'
            | 'major-third'
            | 'perfect-fourth'
            | 'augmented-fourth'
            | 'perfect-fifth',
          4,
          1.25,
          3
        );
        expect(tokens).toHaveLength(4);
        expect(tokens[0].value).toBe('0rem');
        expect(tokens[1].value).toBe('0.25rem');
        expect(tokens[1].progressionSystem).toBe(system);
      }
    });

    it('should convert pixels to rem correctly', () => {
      const tokens = generateSpacingScale('linear', 16, 1.25, 2); // 16px base

      expect(tokens[1].value).toBe('1rem'); // 16px / 16 = 1rem
      expect(tokens[2].value).toBe('2rem'); // 32px / 16 = 2rem
    });

    it('should handle custom system with proper naming', () => {
      const tokens = generateSpacingScale('custom', 4, 1.5, 3);

      expect(tokens[0].name).toBe('0');
      expect(tokens[1].name).toBe('scale-1');
      expect(tokens[2].name).toBe('scale-2');
      expect(tokens[3].name).toBe('scale-3');
    });

    it('should validate against TokenSchema', () => {
      const tokens = generateSpacingScale('golden', 4, 1.25, 5);

      for (const token of tokens) {
        const result = TokenSchema.safeParse(token);
        expect(result.success).toBe(true);

        if (!result.success) {
          console.log('Token validation failed:', token.name, result.error.errors);
        }
      }
    });

    it('should handle zero steps', () => {
      const tokens = generateSpacingScale('linear', 4, 1.25, 0);

      expect(tokens).toHaveLength(1); // Just the zero token
      expect(tokens[0].name).toBe('0');
      expect(tokens[0].value).toBe('0rem');
    });

    it('should round rem values appropriately', () => {
      const tokens = generateSpacingScale('linear', 3, 1.25, 2); // 3px base

      // 3px / 16 = 0.1875rem, should round to 0.19rem
      expect(tokens[1].value).toBe('0.19rem');
    });

    it('should handle large step counts', () => {
      const tokens = generateSpacingScale('linear', 4, 1.25, 20);

      expect(tokens).toHaveLength(21); // 0 through 20
      expect(tokens[0].value).toBe('0rem');
      expect(tokens[20].value).toBe('5rem'); // 4px * 20 = 80px = 5rem
    });

    it('should include proper math relationships for linear system', () => {
      const tokens = generateSpacingScale('linear', 4, 1.25, 4);

      expect(tokens[2].mathRelationship).toBe('{1} * 2');
      expect(tokens[3].mathRelationship).toBe('{1} * 3');
      expect(tokens[4].mathRelationship).toBe('{1} * 4');
    });

    it('should handle different base units correctly', () => {
      const tokens = generateSpacingScale('linear', 8, 1.25, 2); // 8px base

      expect(tokens[1].value).toBe('0.5rem'); // 8px / 16 = 0.5rem
      expect(tokens[2].value).toBe('1rem'); // 16px / 16 = 1rem
    });

    it('should generate semantic meanings for different systems', () => {
      const goldenTokens = generateSpacingScale('golden', 4, 1.25, 2);
      const linearTokens = generateSpacingScale('linear', 4, 1.25, 2);

      expect(goldenTokens[1].semanticMeaning).toContain('Golden ratio');
      expect(linearTokens[1].semanticMeaning).toContain('Mathematical');
    });
  });

  describe('Mathematical Accuracy', () => {
    it('should produce accurate linear progression values', () => {
      const tokens = generateSpacingScale('linear', 4, 1.25, 5);

      // Linear: 0, 4, 8, 12, 16, 20 pixels
      const expectedValues = [0, 4, 8, 12, 16, 20];

      for (let i = 0; i < expectedValues.length; i++) {
        const valueInPx = parseFloat(tokens[i].value as string) * 16;
        expect(valueInPx).toBeCloseTo(expectedValues[i], 0);
      }
    });

    it('should produce accurate golden ratio progression', () => {
      const tokens = generateSpacingScale('golden', 4, 1.25, 4);
      const golden = 1.618033988749895;

      // Check progression: 4 * golden^(step-1)
      const expectedValues = [0, 4, 4 * golden, 4 * golden ** 2, 4 * golden ** 3];

      for (let i = 0; i < expectedValues.length; i++) {
        const valueInPx = parseFloat(tokens[i].value as string) * 16;
        expect(valueInPx).toBeCloseTo(expectedValues[i], 0);
      }
    });

    it('should produce accurate custom exponential progression', () => {
      const tokens = generateSpacingScale('custom', 4, 1.5, 3);

      // Custom 1.5 ratio: 0, 4, 6, 9, 13.5 pixels
      const expectedValues = [0, 4, 6, 9];

      for (let i = 0; i < expectedValues.length; i++) {
        const valueInPx = parseFloat(tokens[i].value as string) * 16;
        expect(valueInPx).toBeCloseTo(expectedValues[i], 0);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle negative base unit directly', () => {
      const tokens = generateSpacingScale('linear', -4, 1.25, 2);

      expect(tokens).toHaveLength(3);
      expect(tokens[1].value).toBe('-0.25rem'); // -4px / 16 = -0.25rem
    });

    it('should handle zero multiplier gracefully', () => {
      const tokens = generateSpacingScale('custom', 4, 0, 2);

      expect(tokens).toHaveLength(3);
      expect(tokens[0].value).toBe('0rem');
      expect(tokens[1].value).toBe('0.25rem');
      // Zero multiplier should still work for base
    });

    it('should handle negative steps gracefully', () => {
      const tokens = generateSpacingScale('linear', 4, 1.25, -1);

      expect(tokens).toHaveLength(0); // No tokens generated for negative steps
    });
  });

  describe('Parameter Validation', () => {
    it('should use default parameters when not provided', () => {
      const tokens = generateSpacingScale('linear');

      expect(tokens.length).toBeGreaterThan(0);
      expect(tokens[0].value).toBe('0rem');
      expect(tokens[1].value).toBe('0.25rem'); // Default 4px base
    });

    it('should handle all supported musical systems', () => {
      const musicalSystems = [
        'minor-second',
        'major-second',
        'minor-third',
        'major-third',
        'perfect-fourth',
        'augmented-fourth',
        'perfect-fifth',
      ];

      for (const system of musicalSystems) {
        const tokens = generateSpacingScale(
          system as
            | 'minor-second'
            | 'major-second'
            | 'minor-third'
            | 'major-third'
            | 'perfect-fourth'
            | 'augmented-fourth'
            | 'perfect-fifth',
          4,
          1.25,
          2
        );
        expect(tokens.length).toBe(3);
        expect(tokens[1].progressionSystem).toBe(system);
      }
    });
  });
});
