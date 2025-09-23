/**
 * Font Weight Generator Tests
 *
 * Validates font weight token structure, semantic weight progression,
 * and usage intelligence for different typography contexts.
 */

import { TokenSchema } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { generateFontWeightTokens } from '../../src/generators/font-weight.js';

describe('Font Weight Generator', () => {
  describe('generateFontWeightTokens', () => {
    it('should generate complete font weight token set', () => {
      const tokens = generateFontWeightTokens();

      expect(tokens).toHaveLength(9);

      const expectedWeights = [
        'thin',
        'extralight',
        'light',
        'normal',
        'medium',
        'semibold',
        'bold',
        'extrabold',
        'black',
      ];
      const tokenNames = tokens.map((t) => t.name);

      for (const weight of expectedWeights) {
        expect(tokenNames).toContain(weight);
      }
    });

    it('should generate normal weight token as baseline', () => {
      const tokens = generateFontWeightTokens();
      const normal = tokens.find((t) => t.name === 'normal');

      expect(normal).toBeDefined();
      expect(normal?.value).toBe('400');
      expect(normal?.category).toBe('font-weight');
      expect(normal?.namespace).toBe('font');
      expect(normal?.semanticMeaning).toBe('Normal weight for body text - optimal readability');
      expect(normal?.cognitiveLoad).toBe(1);
      expect(normal?.trustLevel).toBe('low');
      expect(normal?.usageContext).toContain('body-text');
      expect(normal?.usageContext).toContain('default');
    });

    it('should generate bold weight token', () => {
      const tokens = generateFontWeightTokens();
      const bold = tokens.find((t) => t.name === 'bold');

      expect(bold).toBeDefined();
      expect(bold?.value).toBe('700');
      expect(bold?.semanticMeaning).toBe('Bold for headings and emphasis - strong hierarchy');
      expect(bold?.cognitiveLoad).toBe(4);
      expect(bold?.usageContext).toContain('headings');
      expect(bold?.usageContext).toContain('important-text');
    });

    it('should generate mathematical progression of font weights', () => {
      const tokens = generateFontWeightTokens();

      const expectedValues = ['100', '200', '300', '400', '500', '600', '700', '800', '900'];

      for (let i = 0; i < expectedValues.length; i++) {
        expect(tokens[i].value).toBe(expectedValues[i]);
      }
    });

    it('should include proper cognitive load progression', () => {
      const tokens = generateFontWeightTokens();

      // Normal should be simplest
      const normal = tokens.find((t) => t.name === 'normal');
      expect(normal?.cognitiveLoad).toBe(1);

      // Light weights should be moderate
      const light = tokens.find((t) => t.name === 'light');
      expect(light?.cognitiveLoad).toBe(2);

      // Medium weights should be moderate
      const medium = tokens.find((t) => t.name === 'medium');
      expect(medium?.cognitiveLoad).toBe(2);

      // Heavy weights should be higher
      const extrabold = tokens.find((t) => t.name === 'extrabold');
      expect(extrabold?.cognitiveLoad).toBe(6);

      const black = tokens.find((t) => t.name === 'black');
      expect(black?.cognitiveLoad).toBe(8);
    });

    it('should include proper component mappings', () => {
      const tokens = generateFontWeightTokens();

      const bold = tokens.find((t) => t.name === 'bold');
      expect(bold?.applicableComponents).toContain('h1');
      expect(bold?.applicableComponents).toContain('h2');
      expect(bold?.applicableComponents).toContain('strong');
      expect(bold?.applicableComponents).toContain('button');

      const normal = tokens.find((t) => t.name === 'normal');
      expect(normal?.applicableComponents).toContain('p');
      expect(normal?.applicableComponents).toContain('span');
      expect(normal?.applicableComponents).toContain('body');

      const others = tokens.filter((t) => t.name !== 'bold' && t.name !== 'normal');
      for (const token of others) {
        expect(token.applicableComponents).toContain('text');
      }
    });

    it('should include accessibility considerations', () => {
      const tokens = generateFontWeightTokens();

      const thin = tokens.find((t) => t.name === 'thin');
      expect(thin?.accessibilityLevel).toBe('AA'); // Less accessible

      const extralight = tokens.find((t) => t.name === 'extralight');
      expect(extralight?.accessibilityLevel).toBe('AA'); // Less accessible

      const normal = tokens.find((t) => t.name === 'normal');
      expect(normal?.accessibilityLevel).toBe('AAA'); // Fully accessible

      const bold = tokens.find((t) => t.name === 'bold');
      expect(bold?.accessibilityLevel).toBe('AAA'); // Fully accessible
    });

    it('should include usage context metadata', () => {
      const tokens = generateFontWeightTokens();

      const thin = tokens.find((t) => t.name === 'thin');
      expect(thin?.usageContext).toContain('fine-print');
      expect(thin?.usageContext).toContain('subtle-text');

      const light = tokens.find((t) => t.name === 'light');
      expect(light?.usageContext).toContain('captions');
      expect(light?.usageContext).toContain('secondary-text');

      const semibold = tokens.find((t) => t.name === 'semibold');
      expect(semibold?.usageContext).toContain('subheadings');
      expect(semibold?.usageContext).toContain('ui-labels');

      const black = tokens.find((t) => t.name === 'black');
      expect(black?.usageContext).toContain('brand-text');
      expect(black?.usageContext).toContain('maximum-impact');
    });

    it('should have consistent trust levels', () => {
      const tokens = generateFontWeightTokens();

      // All font weights should have low trust level
      for (const token of tokens) {
        expect(token.trustLevel).toBe('low');
      }
    });

    it('should validate against TokenSchema', () => {
      const tokens = generateFontWeightTokens();

      for (const token of tokens) {
        const result = TokenSchema.safeParse(token);
        expect(result.success).toBe(true);

        if (!result.success) {
          console.log('Token validation failed:', token.name, result.error.errors);
        }
      }
    });

    it('should include semantic meaning for all weights', () => {
      const tokens = generateFontWeightTokens();

      for (const token of tokens) {
        expect(token.semanticMeaning).toBeTruthy();
        expect(typeof token.semanticMeaning).toBe('string');
        expect(token.semanticMeaning?.length).toBeGreaterThan(20);
      }
    });

    it('should have progressive numeric values', () => {
      const tokens = generateFontWeightTokens();

      // Extract numeric values and ensure progression
      const numericValues = tokens.map((t) => parseInt(t.value as string, 10));

      for (let i = 1; i < numericValues.length; i++) {
        expect(numericValues[i]).toBeGreaterThan(numericValues[i - 1]);
      }
    });

    it('should follow CSS font-weight standard values', () => {
      const tokens = generateFontWeightTokens();

      const expectedMapping = {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      };

      for (const [name, expectedValue] of Object.entries(expectedMapping)) {
        const token = tokens.find((t) => t.name === name);
        expect(token?.value).toBe(expectedValue);
      }
    });

    it('should have consistent token structure', () => {
      const tokens = generateFontWeightTokens();

      for (const token of tokens) {
        expect(token).toHaveProperty('name');
        expect(token).toHaveProperty('value');
        expect(token).toHaveProperty('category', 'font-weight');
        expect(token).toHaveProperty('namespace', 'font');
        expect(token).toHaveProperty('semanticMeaning');
        expect(token).toHaveProperty('scalePosition');
        expect(token).toHaveProperty('generateUtilityClass', true);
        expect(token).toHaveProperty('applicableComponents');
        expect(token).toHaveProperty('accessibilityLevel');
        expect(token).toHaveProperty('cognitiveLoad');
        expect(token).toHaveProperty('trustLevel', 'low');
        expect(token).toHaveProperty('consequence', 'reversible');
        expect(token).toHaveProperty('usageContext');
      }
    });

    it('should have proper scale positions', () => {
      const tokens = generateFontWeightTokens();

      for (let i = 0; i < tokens.length; i++) {
        expect(tokens[i].scalePosition).toBe(i);
      }
    });

    it('should include appropriate usage contexts', () => {
      const tokens = generateFontWeightTokens();

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
});
