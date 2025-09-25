/**
 * Backdrop Generator Tests
 *
 * Validates backdrop blur token structure, mathematical progression,
 * and accessibility considerations for overlay and modal systems.
 */

import { TokenSchema } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { generateBackdropTokens } from '../../src/generators/backdrop.js';

describe('Backdrop Generator', () => {
  describe('generateBackdropTokens', () => {
    it('should generate complete backdrop blur token set', () => {
      const tokens = generateBackdropTokens();

      expect(tokens).toHaveLength(8);

      const expectedBlurs = ['none', 'sm', 'DEFAULT', 'md', 'lg', 'xl', '2xl', '3xl'];
      const tokenNames = tokens.map((t) => t.name);

      for (const blur of expectedBlurs) {
        expect(tokenNames).toContain(blur);
      }
    });

    it('should generate none backdrop blur token', () => {
      const tokens = generateBackdropTokens();
      const none = tokens.find((t) => t.name === 'none');

      expect(none).toBeDefined();
      expect(none?.value).toBe('0');
      expect(none?.category).toBe('backdrop-blur');
      expect(none?.namespace).toBe('backdrop-blur');
      expect(none?.semanticMeaning).toBe('No backdrop blur');
      expect(none?.cognitiveLoad).toBe(1);
      expect(none?.trustLevel).toBe('low');
      expect(none?.usageContext).toContain('no-blur');
      expect(none?.usageContext).toContain('clear-background');
    });

    it('should generate default backdrop blur token', () => {
      const tokens = generateBackdropTokens();
      const defaultBlur = tokens.find((t) => t.name === 'DEFAULT');

      expect(defaultBlur).toBeDefined();
      expect(defaultBlur?.value).toBe('8px');
      expect(defaultBlur?.semanticMeaning).toBe('Default backdrop blur for modals');
      expect(defaultBlur?.cognitiveLoad).toBe(3);
      expect(defaultBlur?.trustLevel).toBe('medium');
      expect(defaultBlur?.usageContext).toContain('modal-backdrop');
      expect(defaultBlur?.usageContext).toContain('standard-overlay');
    });

    it('should generate mathematical progression of blur values', () => {
      const tokens = generateBackdropTokens();

      const expectedValues = ['0', '4px', '8px', '12px', '16px', '24px', '40px', '64px'];

      for (let i = 0; i < expectedValues.length; i++) {
        expect(tokens[i].value).toBe(expectedValues[i]);
      }
    });

    it('should include proper math relationship metadata', () => {
      const tokens = generateBackdropTokens();

      const none = tokens.find((t) => t.name === 'none');
      expect(none?.mathRelationship).toBe('No blur');

      const sm = tokens.find((t) => t.name === 'sm');
      expect(sm?.mathRelationship).toBe('blur(4px)');

      const lg = tokens.find((t) => t.name === 'lg');
      expect(lg?.mathRelationship).toBe('blur(16px)');

      const xl3 = tokens.find((t) => t.name === '3xl');
      expect(xl3?.mathRelationship).toBe('blur(64px)');
    });

    it('should include proper cognitive load progression', () => {
      const tokens = generateBackdropTokens();

      // Should increase with blur intensity
      const none = tokens.find((t) => t.name === 'none');
      expect(none?.cognitiveLoad).toBe(1);

      const sm = tokens.find((t) => t.name === 'sm');
      expect(sm?.cognitiveLoad).toBe(2);

      const defaultBlur = tokens.find((t) => t.name === 'DEFAULT');
      expect(defaultBlur?.cognitiveLoad).toBe(3);

      const xl2 = tokens.find((t) => t.name === '2xl');
      expect(xl2?.cognitiveLoad).toBe(7);

      const xl3 = tokens.find((t) => t.name === '3xl');
      expect(xl3?.cognitiveLoad).toBe(8);
    });

    it('should include proper trust level assessment', () => {
      const tokens = generateBackdropTokens();

      // Lower blur values should have lower trust levels
      const none = tokens.find((t) => t.name === 'none');
      expect(none?.trustLevel).toBe('low');

      const sm = tokens.find((t) => t.name === 'sm');
      expect(sm?.trustLevel).toBe('low');

      // Medium blur values should have medium trust levels
      const defaultBlur = tokens.find((t) => t.name === 'DEFAULT');
      expect(defaultBlur?.trustLevel).toBe('medium');

      const md = tokens.find((t) => t.name === 'md');
      expect(md?.trustLevel).toBe('medium');

      // Higher blur values should have high trust levels
      const xl = tokens.find((t) => t.name === 'xl');
      expect(xl?.trustLevel).toBe('high');

      const xl3 = tokens.find((t) => t.name === '3xl');
      expect(xl3?.trustLevel).toBe('high');
    });

    it('should include usage context metadata', () => {
      const tokens = generateBackdropTokens();

      const sm = tokens.find((t) => t.name === 'sm');
      expect(sm?.usageContext).toContain('subtle-overlay');
      expect(sm?.usageContext).toContain('light-separation');

      const lg = tokens.find((t) => t.name === 'lg');
      expect(lg?.usageContext).toContain('strong-focus');
      expect(lg?.usageContext).toContain('clear-separation');

      const xl = tokens.find((t) => t.name === 'xl');
      expect(xl?.usageContext).toContain('dramatic-effect');
      expect(xl?.usageContext).toContain('artistic-backdrop');
    });

    it('should include proper component mappings', () => {
      const tokens = generateBackdropTokens();

      for (const token of tokens) {
        expect(token.applicableComponents).toContain('modal');
        expect(token.applicableComponents).toContain('dialog');
        expect(token.applicableComponents).toContain('overlay');
        expect(token.applicableComponents).toContain('backdrop');
      }
    });

    it('should include accessibility metadata', () => {
      const tokens = generateBackdropTokens();

      for (const token of tokens) {
        expect(token.accessibilityLevel).toBe('AAA');
        expect(token.generateUtilityClass).toBe(true);
      }
    });

    it('should include proper consequence assessment', () => {
      const tokens = generateBackdropTokens();

      // High trust level tokens should have significant consequences
      const xl = tokens.find((t) => t.name === 'xl');
      expect(xl?.consequence).toBe('significant');

      const xl2 = tokens.find((t) => t.name === '2xl');
      expect(xl2?.consequence).toBe('significant');

      const xl3 = tokens.find((t) => t.name === '3xl');
      expect(xl3?.consequence).toBe('significant');

      // Lower trust level tokens should be reversible
      const none = tokens.find((t) => t.name === 'none');
      expect(none?.consequence).toBe('reversible');

      const sm = tokens.find((t) => t.name === 'sm');
      expect(sm?.consequence).toBe('reversible');
    });

    it('should validate against TokenSchema', () => {
      const tokens = generateBackdropTokens();

      for (const token of tokens) {
        const result = TokenSchema.safeParse(token);
        expect(result.success).toBe(true);
      }
    });

    it('should include proper scale positions', () => {
      const tokens = generateBackdropTokens();

      for (let i = 0; i < tokens.length; i++) {
        expect(tokens[i].scalePosition).toBe(i);
      }
    });

    it('should include semantic meaning for all blur levels', () => {
      const tokens = generateBackdropTokens();

      for (const token of tokens) {
        expect(token.semanticMeaning).toBeTruthy();
        expect(typeof token.semanticMeaning).toBe('string');
        expect(token.semanticMeaning?.length).toBeGreaterThan(10);
      }
    });

    it('should have appropriate usage contexts for different blur levels', () => {
      const tokens = generateBackdropTokens();

      const none = tokens.find((t) => t.name === 'none');
      expect(none?.usageContext).toContain('transparent');

      const md = tokens.find((t) => t.name === 'md');
      expect(md?.usageContext).toContain('attention-focus');
      expect(md?.usageContext).toContain('medium-separation');

      const xl2 = tokens.find((t) => t.name === '2xl');
      expect(xl2?.usageContext).toContain('maximum-blur');
      expect(xl2?.usageContext).toContain('heavy-separation');

      const xl3 = tokens.find((t) => t.name === '3xl');
      expect(xl3?.usageContext).toContain('ultra-blur');
      expect(xl3?.usageContext).toContain('artistic-effects');
    });

    it('should have progressive blur values', () => {
      const tokens = generateBackdropTokens();

      // Extract numeric values and ensure progression
      const numericValues = tokens.map((t) => {
        if (t.value === '0') return 0;
        return parseInt(t.value as string, 10);
      });

      for (let i = 1; i < numericValues.length; i++) {
        expect(numericValues[i]).toBeGreaterThan(numericValues[i - 1]);
      }
    });

    it('should include proper blur function in math relationship', () => {
      const tokens = generateBackdropTokens();

      // All non-zero blur tokens should have blur() in math relationship
      const blurTokens = tokens.filter((t) => t.value !== '0');

      for (const token of blurTokens) {
        expect(token.mathRelationship).toContain('blur(');
        expect(token.mathRelationship).toContain('px)');
      }
    });
  });

  describe('Token Structure Validation', () => {
    it('should have consistent token structure', () => {
      const tokens = generateBackdropTokens();

      for (const token of tokens) {
        expect(token).toHaveProperty('name');
        expect(token).toHaveProperty('value');
        expect(token).toHaveProperty('category', 'backdrop-blur');
        expect(token).toHaveProperty('namespace', 'backdrop-blur');
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
      const tokens = generateBackdropTokens();

      for (const token of tokens) {
        // Values should be either '0' or end with 'px'
        expect(token.value === '0' || (token.value as string).endsWith('px')).toBe(true);
      }
    });

    it('should have appropriate usage contexts', () => {
      const tokens = generateBackdropTokens();

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
    it('should have correct Tailwind backdrop-blur scale values', () => {
      const tokens = generateBackdropTokens();

      // These are the actual Tailwind backdrop-blur values
      const expectedMapping = {
        none: '0',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px',
      };

      for (const [name, expectedValue] of Object.entries(expectedMapping)) {
        const token = tokens.find((t) => t.name === name);
        expect(token?.value).toBe(expectedValue);
      }
    });

    it('should follow mathematical progression pattern', () => {
      const tokens = generateBackdropTokens();

      // The progression should roughly follow: 0, 4, 8, 12, 16, 24, 40, 64
      // which is approximately linear for small values, then exponential
      const values = tokens.map((t) => (t.value === '0' ? 0 : parseInt(t.value as string, 10)));

      expect(values).toEqual([0, 4, 8, 12, 16, 24, 40, 64]);
    });
  });
});
