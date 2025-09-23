/**
 * Typography Generator Tests
 *
 * Validates typography scale tokens with mathematical progressions,
 * musical ratios, and responsive typography systems.
 */

import { TokenSchema } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { generateTypographyScale } from '../../src/generators/typography.js';

describe('Typography Generator', () => {
  describe('generateTypographyScale', () => {
    it('should generate complete typography scale with font sizes and line heights', () => {
      const tokens = generateTypographyScale('golden', 1);

      const fontSizeTokens = tokens.filter((t) => t.category === 'font-size');
      const lineHeightTokens = tokens.filter((t) => t.category === 'line-height');

      expect(fontSizeTokens).toHaveLength(13);
      expect(lineHeightTokens).toHaveLength(13);
      expect(tokens).toHaveLength(26);
    });

    it('should generate text-base as 1rem baseline', () => {
      const tokens = generateTypographyScale('golden', 1);
      const fontSizeTokens = tokens.filter((t) => t.category === 'font-size');
      const base = fontSizeTokens.find((t) => t.name === 'text-base');

      expect(base?.value).toBe('1rem');
      expect(base?.mathRelationship).toBeUndefined(); // Base token has no relationship
    });

    it('should generate mathematical relationships for derived sizes', () => {
      const tokens = generateTypographyScale('golden', 1);
      const fontSizeTokens = tokens.filter((t) => t.category === 'font-size');

      const lg = fontSizeTokens.find((t) => t.name === 'text-lg');
      expect(lg?.mathRelationship).toBe('{text-base} * golden^1');

      const xl = fontSizeTokens.find((t) => t.name === 'text-xl');
      expect(xl?.mathRelationship).toBe('{text-base} * golden^2');
    });

    it('should generate optimized line heights', () => {
      const tokens = generateTypographyScale('golden', 1);
      const lineHeightTokens = tokens.filter((t) => t.category === 'line-height');

      const baseLeading = lineHeightTokens.find((t) => t.name === 'leading-base');
      expect(baseLeading?.value).toBe('1.5'); // Optimal for body text

      const xlLeading = lineHeightTokens.find((t) => t.name === 'leading-xl');
      expect(parseFloat(xlLeading?.value as string)).toBeLessThan(1.5); // Tighter for large text
    });

    it('should support different musical ratio systems', () => {
      const systems = ['major-third', 'perfect-fourth', 'perfect-fifth'];

      for (const system of systems) {
        const tokens = generateTypographyScale(
          system as 'major-third' | 'perfect-fourth' | 'perfect-fifth',
          1
        );
        const fontSizeTokens = tokens.filter((t) => t.category === 'font-size');
        const base = fontSizeTokens.find((t) => t.name === 'text-base');

        expect(base?.progressionSystem).toBe(system);
        expect(base?.value).toBe('1rem');
      }
    });

    it('should validate against TokenSchema', () => {
      const tokens = generateTypographyScale('golden', 1);

      for (const token of tokens) {
        const result = TokenSchema.safeParse(token);
        expect(result.success).toBe(true);

        if (!result.success) {
          console.log('Token validation failed:', token.name, result.error.errors);
        }
      }
    });

    it('should include progressive cognitive load', () => {
      const tokens = generateTypographyScale('golden', 1);
      const fontSizeTokens = tokens.filter((t) => t.category === 'font-size');

      const xs = fontSizeTokens.find((t) => t.name === 'text-xs');
      expect(xs?.cognitiveLoad).toBe(3); // Small text complexity

      const base = fontSizeTokens.find((t) => t.name === 'text-base');
      expect(base?.cognitiveLoad).toBe(2); // Body text simplicity

      const xl9 = fontSizeTokens.find((t) => t.name === 'text-9xl');
      expect(xl9?.cognitiveLoad).toBe(8); // Display text complexity
    });

    it('should include appropriate usage contexts', () => {
      const tokens = generateTypographyScale('golden', 1);
      const fontSizeTokens = tokens.filter((t) => t.category === 'font-size');

      const xs = fontSizeTokens.find((t) => t.name === 'text-xs');
      expect(xs?.usageContext).toContain('captions');

      const base = fontSizeTokens.find((t) => t.name === 'text-base');
      expect(base?.usageContext).toContain('body-text');

      const xl5 = fontSizeTokens.find((t) => t.name === 'text-5xl');
      expect(xl5?.usageContext).toContain('headings');
    });

    it('should have consistent token structure', () => {
      const tokens = generateTypographyScale('golden', 1);

      for (const token of tokens) {
        expect(token).toHaveProperty('name');
        expect(token).toHaveProperty('value');
        expect(token).toHaveProperty('category');
        expect(token).toHaveProperty('namespace');
        expect(token).toHaveProperty('semanticMeaning');
        expect(token).toHaveProperty('generateUtilityClass', true);
        expect(token).toHaveProperty('applicableComponents');
        expect(token).toHaveProperty('accessibilityLevel');
        expect(token).toHaveProperty('cognitiveLoad');
        expect(token).toHaveProperty('trustLevel', 'low');
        expect(token).toHaveProperty('consequence', 'reversible');
      }
    });
  });
});
