/**
 * Border Radius Generator Tests
 *
 * Validates mathematical progression, token structure, and visual hierarchy
 * for border-radius tokens with different mathematical systems.
 */

import { TokenSchema } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import {
  generateBorderRadiusScale,
  generateBorderRadiusTokens,
} from '../../src/generators/border-radius.js';

describe('Border Radius Generator', () => {
  describe('generateBorderRadiusScale', () => {
    it('should generate linear progression tokens', () => {
      const tokens = generateBorderRadiusScale('linear', 4, 1.5, 8);

      expect(tokens).toHaveLength(8);
      expect(tokens[0].name).toBe('rounded-none');
      expect(tokens[0].value).toBe('0rem');
      expect(tokens[1].name).toBe('rounded-sm');
      expect(tokens[1].value).toBe('0.25rem'); // 4px / 16
      expect(tokens[2].name).toBe('rounded-md');
      expect(tokens[2].value).toBe('0.5rem'); // 8px / 16
      expect(tokens[7].name).toBe('rounded-full');
      expect(tokens[7].value).toBe('9999px');
    });

    it('should generate golden ratio progression tokens', () => {
      const tokens = generateBorderRadiusScale('golden', 4, 1.5, 6);

      expect(tokens).toHaveLength(6);
      expect(tokens[0].name).toBe('rounded-none');
      expect(tokens[0].value).toBe('0rem');
      expect(tokens[1].name).toBe('rounded-sm');
      expect(tokens[1].value).toBe('0.25rem'); // Base: 4px / 16

      // Golden ratio progression: 4 * 1.618^step
      expect(tokens[2].name).toBe('rounded-md');
      expect(Number.parseFloat(tokens[2].value as string)).toBeCloseTo(0.4, 1); // ~6.47px / 16
      expect(tokens[3].name).toBe('rounded-lg');
      expect(Number.parseFloat(tokens[3].value as string)).toBeCloseTo(0.65, 1); // ~10.47px / 16
    });

    it('should generate major-third musical ratio progression', () => {
      const tokens = generateBorderRadiusScale('major-third', 4, 1.5, 5);

      expect(tokens).toHaveLength(5);
      expect(tokens[1].value).toBe('0.25rem'); // Base: 4px
      expect(tokens[2].name).toBe('rounded-md');
      // Major third ratio: 1.25, so 4 * 1.25 = 5px = 0.31rem
      expect(Number.parseFloat(tokens[2].value as string)).toBeCloseTo(0.31, 1);
    });

    it('should include mathematical metadata', () => {
      const tokens = generateBorderRadiusScale('golden', 4, 1.5, 5);

      // Check 'none' token (no math relationship)
      expect(tokens[0].generationRule).toBeUndefined();
      expect(tokens[0].progressionSystem).toBe('golden');
      expect(tokens[0].scalePosition).toBe(0);

      // Check 'sm' token (base token, no math relationship)
      expect(tokens[1].generationRule).toBeUndefined();
      expect(tokens[1].progressionSystem).toBe('golden');
      expect(tokens[1].scalePosition).toBe(1);

      // Check 'md' token (first derived token)
      expect(tokens[2].generationRule).toBe('{sm} * golden^1');
      expect(tokens[2].progressionSystem).toBe('golden');
      expect(tokens[2].scalePosition).toBe(2);

      // Check 'lg' token
      expect(tokens[3].generationRule).toBe('{sm} * golden^2');
      expect(tokens[3].progressionSystem).toBe('golden');
      expect(tokens[3].scalePosition).toBe(3);
    });

    it('should include visual hierarchy metadata', () => {
      const tokens = generateBorderRadiusScale('linear', 4, 1.5, 8);

      // Subtle tokens (none, sm, md)
      expect(tokens[0].cognitiveLoad).toBe(1);
      expect(tokens[1].cognitiveLoad).toBe(1);
      expect(tokens[2].cognitiveLoad).toBe(1);

      // Standard tokens (lg, xl, 2xl)
      expect(tokens[3].cognitiveLoad).toBe(2);
      expect(tokens[4].cognitiveLoad).toBe(2);
      expect(tokens[5].cognitiveLoad).toBe(2);

      // Dramatic tokens (3xl, full)
      expect(tokens[6].cognitiveLoad).toBe(3);
      expect(tokens[7].cognitiveLoad).toBe(3);
    });

    it('should include appropriate component mappings', () => {
      const tokens = generateBorderRadiusScale('linear', 4, 1.5, 8);

      // Subtle tokens should include basic components
      expect(tokens[1].applicableComponents).toContain('input');
      expect(tokens[1].applicableComponents).toContain('button');
      expect(tokens[1].applicableComponents).toContain('card');

      // Standard tokens should include modal/popover
      expect(tokens[3].applicableComponents).toContain('modal');
      expect(tokens[3].applicableComponents).toContain('popover');
      expect(tokens[3].applicableComponents).toContain('badge');

      // Dramatic tokens should include avatar/pill
      expect(tokens[6].applicableComponents).toContain('avatar');
      expect(tokens[6].applicableComponents).toContain('pill');
      expect(tokens[6].applicableComponents).toContain('circular-elements');
    });

    it('should include contextual usage metadata', () => {
      const tokens = generateBorderRadiusScale('linear', 4, 1.5, 8);

      // 'none' should include technical contexts
      expect(tokens[0].usageContext).toContain('technical-ui');
      expect(tokens[0].usageContext).toContain('data-tables');
      expect(tokens[0].usageContext).toContain('code-blocks');

      // Subtle tokens should include forms
      expect(tokens[1].usageContext).toContain('forms');
      expect(tokens[1].usageContext).toContain('inputs');

      // Standard tokens should include cards
      expect(tokens[3].usageContext).toContain('cards');
      expect(tokens[3].usageContext).toContain('modals');

      // Dramatic tokens should include brand elements
      expect(tokens[6].usageContext).toContain('avatars');
      expect(tokens[6].usageContext).toContain('badges');
      expect(tokens[6].usageContext).toContain('brand-elements');
    });

    it('should validate against TokenSchema', () => {
      const tokens = generateBorderRadiusScale('golden', 4, 1.5, 6);

      for (const token of tokens) {
        const result = TokenSchema.safeParse(token);
        expect(result.success).toBe(true);

        if (!result.success) {
          console.log('Token validation failed:', token.name, result.error.errors);
        }
      }
    });

    it('should handle custom progression system', () => {
      const tokens = generateBorderRadiusScale('custom', 4, 2.0, 5);

      expect(tokens).toHaveLength(5);
      expect(tokens[1].value).toBe('0.25rem'); // Base: 4px
      expect(tokens[2].value).toBe('0.5rem'); // 4 * 2.0 = 8px
      expect(tokens[3].value).toBe('1rem'); // 4 * 2.0^2 = 16px
      expect(tokens[2].generationRule).toBe('{sm} * custom^1');
      expect(tokens[3].generationRule).toBe('{sm} * custom^2');
    });

    it('should handle different base units', () => {
      const tokens = generateBorderRadiusScale('linear', 2, 1.5, 4);

      expect(tokens[1].value).toBe('0.13rem'); // 2px / 16 = 0.125, rounded to 0.13
      expect(tokens[2].value).toBe('0.25rem'); // 4px / 16 = 0.25
      expect(tokens[3].value).toBe('0.38rem'); // 6px / 16 = 0.375, rounded to 0.38
    });

    it('should limit steps to available names', () => {
      const tokens = generateBorderRadiusScale('linear', 4, 1.5, 20); // Request more than available

      expect(tokens).toHaveLength(8); // Should cap at 8 (length of names array)
      expect(tokens[tokens.length - 1].name).toBe('rounded-full');
    });
  });

  describe('generateBorderRadiusTokens (legacy)', () => {
    it('should generate tokens using default linear progression', () => {
      const tokens = generateBorderRadiusTokens();

      expect(tokens).toHaveLength(8);
      expect(tokens[0].name).toBe('rounded-none');
      expect(tokens[1].name).toBe('rounded-sm');
      expect(tokens[7].name).toBe('rounded-full');

      // Should use linear progression by default
      expect(tokens[1].progressionSystem).toBe('linear');
      expect(tokens[2].generationRule).toBe('{sm} + 4px');
    });

    it('should maintain backward compatibility', () => {
      const tokens = generateBorderRadiusTokens();

      // Should have same structure as new function
      for (const token of tokens) {
        expect(token).toHaveProperty('name');
        expect(token).toHaveProperty('value');
        expect(token).toHaveProperty('category', 'border-radius');
        expect(token).toHaveProperty('namespace', 'border');
        expect(token).toHaveProperty('generateUtilityClass', true);
      }
    });
  });

  describe('Mathematical Accuracy', () => {
    it('should produce accurate linear progression values', () => {
      const tokens = generateBorderRadiusScale('linear', 4, 1.5, 6);

      // none: 0, sm: 4, md: 8, lg: 12, xl: 16, 2xl: 20
      const expectedValues = [0, 4, 8, 12, 16, 20];

      for (let i = 0; i < expectedValues.length; i++) {
        if (tokens[i].name !== 'rounded-full') {
          const valueInPx = Number.parseFloat(tokens[i].value as string) * 16;
          expect(valueInPx).toBeCloseTo(expectedValues[i], 0);
        }
      }
    });

    it('should produce accurate golden ratio progression', () => {
      const tokens = generateBorderRadiusScale('golden', 4, 1.5, 5);
      const golden = 1.618033988749895; // More precise value

      // Check progression: 4 * golden^step
      const expectedValues = [0, 4, 4 * golden, 4 * golden ** 2, 4 * golden ** 3];

      for (let i = 0; i < expectedValues.length; i++) {
        const valueInPx = Number.parseFloat(tokens[i].value as string) * 16;
        expect(valueInPx).toBeCloseTo(expectedValues[i], 0); // Reduce precision requirement
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle zero steps gracefully', () => {
      const tokens = generateBorderRadiusScale('linear', 4, 1.5, 0);
      expect(tokens).toHaveLength(0);
    });

    it('should handle negative base unit by using absolute value', () => {
      const tokens = generateBorderRadiusScale('linear', -4, 1.5, 3);
      expect(tokens).toHaveLength(3);
      // Should still work with absolute value logic
      expect(tokens[1].value).toBe('0.25rem'); // abs(-4) = 4px
    });
  });
});
