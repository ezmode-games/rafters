/**
 * Border Width Generator Tests
 *
 * Validates border width token structure, mathematical progression,
 * and usage context for component emphasis and structure.
 */

import { TokenSchema } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { generateBorderWidthTokens } from '../../src/generators/border-width.js';

describe('Border Width Generator', () => {
  describe('generateBorderWidthTokens', () => {
    it('should generate complete border width token set', () => {
      const tokens = generateBorderWidthTokens();

      expect(tokens).toHaveLength(5);

      const expectedWidths = ['0', 'DEFAULT', '2', '4', '8'];
      const tokenNames = tokens.map((t) => t.name);

      for (const width of expectedWidths) {
        expect(tokenNames).toContain(width);
      }
    });

    it('should generate zero border width token', () => {
      const tokens = generateBorderWidthTokens();
      const zero = tokens.find((t) => t.name === '0');

      expect(zero).toBeDefined();
      expect(zero?.value).toBe('0px');
      expect(zero?.category).toBe('border-width');
      expect(zero?.namespace).toBe('border');
      expect(zero?.semanticMeaning).toBe('No border');
      expect(zero?.cognitiveLoad).toBe(1);
      expect(zero?.trustLevel).toBe('low');
      expect(zero?.usageContext).toContain('borderless');
      expect(zero?.usageContext).toContain('clean-design');
    });

    it('should generate default border width token', () => {
      const tokens = generateBorderWidthTokens();
      const defaultWidth = tokens.find((t) => t.name === 'DEFAULT');

      expect(defaultWidth).toBeDefined();
      expect(defaultWidth?.value).toBe('1px');
      expect(defaultWidth?.semanticMeaning).toBe('Default border width');
      expect(defaultWidth?.cognitiveLoad).toBe(1);
      expect(defaultWidth?.trustLevel).toBe('low');
      expect(defaultWidth?.usageContext).toContain('standard-border');
      expect(defaultWidth?.usageContext).toContain('input-fields');
      expect(defaultWidth?.usageContext).toContain('cards');
    });

    it('should generate mathematical progression of border widths', () => {
      const tokens = generateBorderWidthTokens();

      const expectedValues = ['0px', '1px', '2px', '4px', '8px'];

      for (let i = 0; i < expectedValues.length; i++) {
        expect(tokens[i].value).toBe(expectedValues[i]);
      }
    });

    it('should include proper math relationship metadata', () => {
      const tokens = generateBorderWidthTokens();

      const zero = tokens.find((t) => t.name === '0');
      expect(zero?.mathRelationship).toBe('No border');

      const defaultWidth = tokens.find((t) => t.name === 'DEFAULT');
      expect(defaultWidth?.mathRelationship).toBe('1px (1x pixel)');

      const two = tokens.find((t) => t.name === '2');
      expect(two?.mathRelationship).toBe('2px (2x pixel)');

      const four = tokens.find((t) => t.name === '4');
      expect(four?.mathRelationship).toBe('4px (4x pixel)');

      const eight = tokens.find((t) => t.name === '8');
      expect(eight?.mathRelationship).toBe('8px (8x pixel)');
    });

    it('should include proper cognitive load progression', () => {
      const tokens = generateBorderWidthTokens();

      // Should increase with border thickness
      const zero = tokens.find((t) => t.name === '0');
      expect(zero?.cognitiveLoad).toBe(1);

      const defaultWidth = tokens.find((t) => t.name === 'DEFAULT');
      expect(defaultWidth?.cognitiveLoad).toBe(1);

      const two = tokens.find((t) => t.name === '2');
      expect(two?.cognitiveLoad).toBe(2);

      const four = tokens.find((t) => t.name === '4');
      expect(four?.cognitiveLoad).toBe(3);

      const eight = tokens.find((t) => t.name === '8');
      expect(eight?.cognitiveLoad).toBe(5);
    });

    it('should include proper trust level assessment', () => {
      const tokens = generateBorderWidthTokens();

      // Thin borders should have lower trust levels
      const zero = tokens.find((t) => t.name === '0');
      expect(zero?.trustLevel).toBe('low');

      const defaultWidth = tokens.find((t) => t.name === 'DEFAULT');
      expect(defaultWidth?.trustLevel).toBe('low');

      const two = tokens.find((t) => t.name === '2');
      expect(two?.trustLevel).toBe('low');

      // Thicker borders should have medium trust levels
      const four = tokens.find((t) => t.name === '4');
      expect(four?.trustLevel).toBe('medium');

      const eight = tokens.find((t) => t.name === '8');
      expect(eight?.trustLevel).toBe('medium');
    });

    it('should include usage context metadata', () => {
      const tokens = generateBorderWidthTokens();

      const defaultWidth = tokens.find((t) => t.name === 'DEFAULT');
      expect(defaultWidth?.usageContext).toContain('buttons');

      const two = tokens.find((t) => t.name === '2');
      expect(two?.usageContext).toContain('emphasis');
      expect(two?.usageContext).toContain('focus-states');

      const four = tokens.find((t) => t.name === '4');
      expect(four?.usageContext).toContain('strong-emphasis');
      expect(four?.usageContext).toContain('call-to-action');

      const eight = tokens.find((t) => t.name === '8');
      expect(eight?.usageContext).toContain('decorative');
      expect(eight?.usageContext).toContain('artistic');
      expect(eight?.usageContext).toContain('brand-elements');
    });

    it('should include proper component mappings based on width', () => {
      const tokens = generateBorderWidthTokens();

      // Thin borders should be suitable for all components
      const defaultWidth = tokens.find((t) => t.name === 'DEFAULT');
      expect(defaultWidth?.applicableComponents).toContain('input');
      expect(defaultWidth?.applicableComponents).toContain('card');
      expect(defaultWidth?.applicableComponents).toContain('button');

      const two = tokens.find((t) => t.name === '2');
      expect(two?.applicableComponents).toContain('input');
      expect(two?.applicableComponents).toContain('card');
      expect(two?.applicableComponents).toContain('button');

      // Thick borders should be for decorative elements
      const four = tokens.find((t) => t.name === '4');
      expect(four?.applicableComponents).toContain('decorative');
      expect(four?.applicableComponents).toContain('emphasis');

      const eight = tokens.find((t) => t.name === '8');
      expect(eight?.applicableComponents).toContain('decorative');
      expect(eight?.applicableComponents).toContain('emphasis');
    });

    it('should include accessibility metadata', () => {
      const tokens = generateBorderWidthTokens();

      for (const token of tokens) {
        expect(token.accessibilityLevel).toBe('AAA');
        expect(token.generateUtilityClass).toBe(true);
      }
    });

    it('should include proper consequence assessment', () => {
      const tokens = generateBorderWidthTokens();

      // Medium trust level tokens should have significant consequences
      const four = tokens.find((t) => t.name === '4');
      expect(four?.consequence).toBe('significant');

      const eight = tokens.find((t) => t.name === '8');
      expect(eight?.consequence).toBe('significant');

      // Low trust level tokens should be reversible
      const zero = tokens.find((t) => t.name === '0');
      expect(zero?.consequence).toBe('reversible');

      const defaultWidth = tokens.find((t) => t.name === 'DEFAULT');
      expect(defaultWidth?.consequence).toBe('reversible');

      const two = tokens.find((t) => t.name === '2');
      expect(two?.consequence).toBe('reversible');
    });

    it('should validate against TokenSchema', () => {
      const tokens = generateBorderWidthTokens();

      for (const token of tokens) {
        const result = TokenSchema.safeParse(token);
        expect(result.success).toBe(true);

        if (!result.success) {
          console.log('Token validation failed:', token.name, result.error.errors);
        }
      }
    });

    it('should include proper scale positions', () => {
      const tokens = generateBorderWidthTokens();

      for (let i = 0; i < tokens.length; i++) {
        expect(tokens[i].scalePosition).toBe(i);
      }
    });

    it('should include semantic meaning for all border widths', () => {
      const tokens = generateBorderWidthTokens();

      for (const token of tokens) {
        expect(token.semanticMeaning).toBeTruthy();
        expect(typeof token.semanticMeaning).toBe('string');
        expect(token.semanticMeaning?.length).toBeGreaterThan(5);
      }
    });

    it('should have appropriate usage contexts for different widths', () => {
      const tokens = generateBorderWidthTokens();

      const zero = tokens.find((t) => t.name === '0');
      expect(zero?.usageContext).toContain('minimal');

      const two = tokens.find((t) => t.name === '2');
      expect(two?.usageContext).toContain('highlighted-elements');

      const eight = tokens.find((t) => t.name === '8');
      expect(eight?.usageContext).toContain('hero-sections');
    });

    it('should have progressive border width values', () => {
      const tokens = generateBorderWidthTokens();

      // Extract numeric values and ensure progression
      const numericValues = tokens.map((t) => parseInt(t.value as string, 10));

      for (let i = 1; i < numericValues.length; i++) {
        expect(numericValues[i]).toBeGreaterThan(numericValues[i - 1]);
      }
    });

    it('should include proper pixel multiplier in math relationship', () => {
      const tokens = generateBorderWidthTokens();

      // All non-zero border tokens should have pixel multiplier in math relationship
      const borderTokens = tokens.filter((t) => t.name !== '0');

      for (const token of borderTokens) {
        if (token.name !== '0') {
          expect(token.mathRelationship).toContain('px');
          expect(token.mathRelationship).toContain('pixel)');
        }
      }
    });
  });

  describe('Token Structure Validation', () => {
    it('should have consistent token structure', () => {
      const tokens = generateBorderWidthTokens();

      for (const token of tokens) {
        expect(token).toHaveProperty('name');
        expect(token).toHaveProperty('value');
        expect(token).toHaveProperty('category', 'border-width');
        expect(token).toHaveProperty('namespace', 'border');
        expect(token).toHaveProperty('semanticMeaning');
        expect(token).toHaveProperty('scalePosition');
        expect(token).toHaveProperty('mathRelationship');
        expect(token).toHaveProperty('generateUtilityClass', true);
        expect(token).toHaveProperty('applicableComponents');
        expect(token).toHaveProperty('accessibilityLevel', 'AAA');
        expect(token).toHaveProperty('cognitiveLoad');
        expect(token).toHaveProperty('trustLevel');
        expect(token).toHaveProperty('consequence');
        expect(token).toHaveProperty('usageContext');
      }
    });

    it('should have valid value formats', () => {
      const tokens = generateBorderWidthTokens();

      for (const token of tokens) {
        // Values should end with 'px'
        expect((token.value as string).endsWith('px')).toBe(true);
      }
    });

    it('should have appropriate usage contexts', () => {
      const tokens = generateBorderWidthTokens();

      for (const token of tokens) {
        expect(Array.isArray(token.usageContext)).toBe(true);
        expect(token.usageContext?.length).toBeGreaterThan(0);

        if (token.usageContext) {
          for (const context of token.usageContext) {
            expect(typeof context).toBe('string');
            expect(context.length).toBeGreaterThan(0);
          }
        }
      }
    });
  });

  describe('Mathematical Accuracy', () => {
    it('should have correct Tailwind border width scale values', () => {
      const tokens = generateBorderWidthTokens();

      // These are the actual Tailwind border-width values
      const expectedMapping = {
        '0': '0px',
        DEFAULT: '1px',
        '2': '2px',
        '4': '4px',
        '8': '8px',
      };

      for (const [name, expectedValue] of Object.entries(expectedMapping)) {
        const token = tokens.find((t) => t.name === name);
        expect(token?.value).toBe(expectedValue);
      }
    });

    it('should follow mathematical progression pattern', () => {
      const tokens = generateBorderWidthTokens();

      // The progression should be: 0, 1, 2, 4, 8 (powers of 2 mostly)
      const values = tokens.map((t) => parseInt(t.value as string, 10));

      expect(values).toEqual([0, 1, 2, 4, 8]);
    });

    it('should have appropriate mathematical relationships', () => {
      const tokens = generateBorderWidthTokens();

      const two = tokens.find((t) => t.name === '2');
      expect(two?.mathRelationship).toContain('2x pixel');

      const four = tokens.find((t) => t.name === '4');
      expect(four?.mathRelationship).toContain('4x pixel');

      const eight = tokens.find((t) => t.name === '8');
      expect(eight?.mathRelationship).toContain('8x pixel');
    });
  });
});
