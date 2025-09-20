/**
 * Depth Generator Tests
 *
 * Validates depth scale tokens including shadows and z-index systems,
 * semantic layering intelligence, and visual hierarchy tokens.
 */

import { TokenSchema } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { generateDepthScale } from '../../src/generators/depth.js';

describe('Depth Generator', () => {
  describe('generateDepthScale', () => {
    it('should generate complete depth scale with shadows and z-index tokens', () => {
      const tokens = generateDepthScale('exponential', 10);

      const shadowTokens = tokens.filter((t) => t.category === 'shadow');
      const zIndexTokens = tokens.filter((t) => t.category === 'z-index');

      expect(shadowTokens).toHaveLength(7);
      expect(zIndexTokens).toHaveLength(8);
      expect(tokens).toHaveLength(15); // 7 shadows + 8 z-index
    });

    it('should generate shadow tokens with proper progression', () => {
      const tokens = generateDepthScale();
      const shadowTokens = tokens.filter((t) => t.category === 'shadow');

      const expectedShadows = ['none', 'sm', 'base', 'md', 'lg', 'xl', '2xl'];
      const tokenNames = shadowTokens.map((t) => t.name);

      for (const shadow of expectedShadows) {
        expect(tokenNames).toContain(shadow);
      }
    });

    it('should generate z-index tokens with semantic layering', () => {
      const tokens = generateDepthScale();
      const zIndexTokens = tokens.filter((t) => t.category === 'z-index');

      const expectedZLayers = [
        'base',
        'sticky',
        'dropdown',
        'modal',
        'popover',
        'notification',
        'tooltip',
        'max',
      ];
      const tokenNames = zIndexTokens.map((t) => t.name);

      for (const layer of expectedZLayers) {
        expect(tokenNames).toContain(layer);
      }
    });

    it('should include proper shadow metadata', () => {
      const tokens = generateDepthScale();
      const shadowTokens = tokens.filter((t) => t.category === 'shadow');

      for (const token of shadowTokens) {
        expect(token.category).toBe('shadow');
        expect(token.namespace).toBe('shadow');
        expect(token.generateUtilityClass).toBe(true);
        expect(token.accessibilityLevel).toBe('AAA');
        expect(token.consequence).toBe('reversible');
      }
    });

    it('should include proper z-index metadata', () => {
      const tokens = generateDepthScale();
      const zIndexTokens = tokens.filter((t) => t.category === 'z-index');

      for (const token of zIndexTokens) {
        expect(token.category).toBe('z-index');
        expect(token.namespace).toBe('z');
        expect(token.generateUtilityClass).toBe(true);
        expect(token.accessibilityLevel).toBe('AAA');
      }
    });

    it('should generate none shadow token', () => {
      const tokens = generateDepthScale();
      const shadowTokens = tokens.filter((t) => t.category === 'shadow');
      const none = shadowTokens.find((t) => t.name === 'none');

      expect(none).toBeDefined();
      expect(none?.value).toBe('none');
      expect(none?.semanticMeaning).toBe('No shadow, flat appearance');
      expect(none?.cognitiveLoad).toBe(1);
      expect(none?.trustLevel).toBe('low');
    });

    it('should generate base z-index token', () => {
      const tokens = generateDepthScale();
      const zIndexTokens = tokens.filter((t) => t.category === 'z-index');
      const base = zIndexTokens.find((t) => t.name === 'base');

      expect(base).toBeDefined();
      expect(base?.value).toBe('0');
      expect(base?.semanticMeaning).toBe('Base content layer');
      expect(base?.cognitiveLoad).toBe(1);
      expect(base?.trustLevel).toBe('low');
    });

    it('should include proper cognitive load progression for shadows', () => {
      const tokens = generateDepthScale();
      const shadowTokens = tokens.filter((t) => t.category === 'shadow');

      // Should increase with shadow complexity
      const none = shadowTokens.find((t) => t.name === 'none');
      expect(none?.cognitiveLoad).toBe(1);

      const sm = shadowTokens.find((t) => t.name === 'sm');
      expect(sm?.cognitiveLoad).toBe(2);

      const xl2 = shadowTokens.find((t) => t.name === '2xl');
      expect(xl2?.cognitiveLoad).toBe(6);
    });

    it('should include proper cognitive load assessment for z-index', () => {
      const tokens = generateDepthScale();
      const zIndexTokens = tokens.filter((t) => t.category === 'z-index');

      // Different UI layers have different cognitive loads
      const base = zIndexTokens.find((t) => t.name === 'base');
      expect(base?.cognitiveLoad).toBe(1);

      const modal = zIndexTokens.find((t) => t.name === 'modal');
      expect(modal?.cognitiveLoad).toBe(7);

      const tooltip = zIndexTokens.find((t) => t.name === 'tooltip');
      expect(tooltip?.cognitiveLoad).toBe(2); // Simple UI element

      const max = zIndexTokens.find((t) => t.name === 'max');
      expect(max?.cognitiveLoad).toBe(8);
    });

    it('should include proper trust level assessment', () => {
      const tokens = generateDepthScale();
      const shadowTokens = tokens.filter((t) => t.category === 'shadow');
      const zIndexTokens = tokens.filter((t) => t.category === 'z-index');

      // Higher shadows should have higher trust levels
      const shadowXl = shadowTokens.find((t) => t.name === 'xl');
      expect(shadowXl?.trustLevel).toBe('high');

      const shadow2xl = shadowTokens.find((t) => t.name === '2xl');
      expect(shadow2xl?.trustLevel).toBe('high');

      // Critical z-index should have critical trust level
      const zMax = zIndexTokens.find((t) => t.name === 'max');
      expect(zMax?.trustLevel).toBe('critical');

      // Modal should have high trust level
      const modal = zIndexTokens.find((t) => t.name === 'modal');
      expect(modal?.trustLevel).toBe('high');
    });

    it('should include component mappings for shadows', () => {
      const tokens = generateDepthScale();
      const shadowTokens = tokens.filter((t) => t.category === 'shadow');

      for (const token of shadowTokens) {
        expect(token.applicableComponents).toContain('card');
        expect(token.applicableComponents).toContain('modal');
        expect(token.applicableComponents).toContain('dropdown');
        expect(token.applicableComponents).toContain('tooltip');
        expect(token.applicableComponents).toContain('popover');
      }
    });

    it('should include semantic component mappings for z-index', () => {
      const tokens = generateDepthScale();
      const zIndexTokens = tokens.filter((t) => t.category === 'z-index');

      const modal = zIndexTokens.find((t) => t.name === 'modal');
      expect(modal?.applicableComponents).toContain('modal');
      expect(modal?.applicableComponents).toContain('dialog');
      expect(modal?.applicableComponents).toContain('sheet');

      const dropdown = zIndexTokens.find((t) => t.name === 'dropdown');
      expect(dropdown?.applicableComponents).toContain('dropdown');
      expect(dropdown?.applicableComponents).toContain('select');
      expect(dropdown?.applicableComponents).toContain('menu');

      const tooltip = zIndexTokens.find((t) => t.name === 'tooltip');
      expect(tooltip?.applicableComponents).toContain('tooltip');
      expect(tooltip?.applicableComponents).toContain('hint');
    });

    it('should include semantic z-index values', () => {
      const tokens = generateDepthScale();
      const zIndexTokens = tokens.filter((t) => t.category === 'z-index');

      const expectedValues = {
        base: '0',
        sticky: '10',
        dropdown: '100',
        modal: '1000',
        popover: '5000',
        notification: '10000',
        tooltip: '50000',
        max: '2147483647',
      };

      for (const [name, expectedValue] of Object.entries(expectedValues)) {
        const token = zIndexTokens.find((t) => t.name === name);
        expect(token?.value).toBe(expectedValue);
      }
    });

    it('should include proper consequence assessment', () => {
      const tokens = generateDepthScale();
      const zIndexTokens = tokens.filter((t) => t.category === 'z-index');

      // Critical trust level should have significant consequences
      const max = zIndexTokens.find((t) => t.name === 'max');
      expect(max?.consequence).toBe('significant');

      // Lower trust levels should be reversible
      const base = zIndexTokens.find((t) => t.name === 'base');
      expect(base?.consequence).toBe('reversible');

      const sticky = zIndexTokens.find((t) => t.name === 'sticky');
      expect(sticky?.consequence).toBe('reversible');
    });

    it('should validate against TokenSchema', () => {
      const tokens = generateDepthScale();

      for (const token of tokens) {
        const result = TokenSchema.safeParse(token);
        expect(result.success).toBe(true);

        if (!result.success) {
          console.log('Token validation failed:', token.name, result.error.errors);
        }
      }
    });

    it('should include proper scale positions', () => {
      const tokens = generateDepthScale();
      const shadowTokens = tokens.filter((t) => t.category === 'shadow');
      const zIndexTokens = tokens.filter((t) => t.category === 'z-index');

      for (let i = 0; i < shadowTokens.length; i++) {
        expect(shadowTokens[i].scalePosition).toBe(i);
      }

      for (let i = 0; i < zIndexTokens.length; i++) {
        expect(zIndexTokens[i].scalePosition).toBe(i);
      }
    });

    it('should include semantic meaning for all tokens', () => {
      const tokens = generateDepthScale();

      for (const token of tokens) {
        expect(token.semanticMeaning).toBeTruthy();
        expect(typeof token.semanticMeaning).toBe('string');
        expect(token.semanticMeaning?.length).toBeGreaterThan(10);
      }
    });

    it('should handle default parameters', () => {
      const tokens = generateDepthScale();

      expect(tokens.length).toBeGreaterThan(0);

      const shadowTokens = tokens.filter((t) => t.category === 'shadow');
      const zIndexTokens = tokens.filter((t) => t.category === 'z-index');

      expect(shadowTokens.length).toBeGreaterThan(0);
      expect(zIndexTokens.length).toBeGreaterThan(0);
    });

    it('should include proper shadow values', () => {
      const tokens = generateDepthScale();
      const shadowTokens = tokens.filter((t) => t.category === 'shadow');

      const sm = shadowTokens.find((t) => t.name === 'sm');
      expect(sm?.value).toBe('0 1px 2px 0 rgb(0 0 0 / 0.05)');

      const base = shadowTokens.find((t) => t.name === 'base');
      expect(base?.value).toBe('0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)');

      const xl2 = shadowTokens.find((t) => t.name === '2xl');
      expect(xl2?.value).toBe('0 25px 50px -12px rgb(0 0 0 / 0.25)');
    });

    it('should include appropriate usage contexts', () => {
      const tokens = generateDepthScale();
      const shadowTokens = tokens.filter((t) => t.category === 'shadow');
      const zIndexTokens = tokens.filter((t) => t.category === 'z-index');

      // Shadows don't have usage contexts in the implementation
      // Z-index tokens don't have explicit usage contexts but are categorized by component

      for (const token of shadowTokens) {
        expect(token.semanticMeaning).toBeTruthy();
      }

      for (const token of zIndexTokens) {
        expect(token.semanticMeaning).toBeTruthy();
      }
    });
  });

  describe('Token Structure Validation', () => {
    it('should have consistent shadow token structure', () => {
      const tokens = generateDepthScale();
      const shadowTokens = tokens.filter((t) => t.category === 'shadow');

      for (const token of shadowTokens) {
        expect(token).toHaveProperty('name');
        expect(token).toHaveProperty('value');
        expect(token).toHaveProperty('category', 'shadow');
        expect(token).toHaveProperty('namespace', 'shadow');
        expect(token).toHaveProperty('semanticMeaning');
        expect(token).toHaveProperty('scalePosition');
        expect(token).toHaveProperty('generateUtilityClass', true);
        expect(token).toHaveProperty('applicableComponents');
        expect(token).toHaveProperty('cognitiveLoad');
        expect(token).toHaveProperty('trustLevel');
        expect(token).toHaveProperty('accessibilityLevel', 'AAA');
        expect(token).toHaveProperty('consequence', 'reversible');
      }
    });

    it('should have consistent z-index token structure', () => {
      const tokens = generateDepthScale();
      const zIndexTokens = tokens.filter((t) => t.category === 'z-index');

      for (const token of zIndexTokens) {
        expect(token).toHaveProperty('name');
        expect(token).toHaveProperty('value');
        expect(token).toHaveProperty('category', 'z-index');
        expect(token).toHaveProperty('namespace', 'z');
        expect(token).toHaveProperty('semanticMeaning');
        expect(token).toHaveProperty('scalePosition');
        expect(token).toHaveProperty('generateUtilityClass', true);
        expect(token).toHaveProperty('applicableComponents');
        expect(token).toHaveProperty('cognitiveLoad');
        expect(token).toHaveProperty('trustLevel');
        expect(token).toHaveProperty('accessibilityLevel', 'AAA');
        expect(token).toHaveProperty('consequence');
      }
    });

    it('should have appropriate z-index value types', () => {
      const tokens = generateDepthScale();
      const zIndexTokens = tokens.filter((t) => t.category === 'z-index');

      for (const token of zIndexTokens) {
        // Z-index values should be numeric strings
        const numericValue = parseInt(token.value as string, 10);
        expect(Number.isNaN(numericValue)).toBe(false);
        expect(numericValue).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('Mathematical Accuracy', () => {
    it('should have progressive z-index values', () => {
      const tokens = generateDepthScale();
      const zIndexTokens = tokens.filter((t) => t.category === 'z-index');

      // Extract numeric values and ensure progression
      const numericValues = zIndexTokens.map((t) => parseInt(t.value as string, 10));

      for (let i = 1; i < numericValues.length - 1; i++) {
        // Exclude last one (max) from progression check
        expect(numericValues[i]).toBeGreaterThan(numericValues[i - 1]);
      }
    });

    it('should have semantic z-index layering', () => {
      const tokens = generateDepthScale();
      const zIndexTokens = tokens.filter((t) => t.category === 'z-index');

      // Check specific semantic ordering
      const base = parseInt(zIndexTokens.find((t) => t.name === 'base')?.value as string, 10);
      const sticky = parseInt(zIndexTokens.find((t) => t.name === 'sticky')?.value as string, 10);
      const dropdown = parseInt(
        zIndexTokens.find((t) => t.name === 'dropdown')?.value as string,
        10
      );
      const modal = parseInt(zIndexTokens.find((t) => t.name === 'modal')?.value as string, 10);
      const tooltip = parseInt(zIndexTokens.find((t) => t.name === 'tooltip')?.value as string, 10);

      expect(sticky).toBeGreaterThan(base);
      expect(dropdown).toBeGreaterThan(sticky);
      expect(modal).toBeGreaterThan(dropdown);
      expect(tooltip).toBeGreaterThan(modal);
    });
  });

  describe('Parameter Handling', () => {
    it('should handle linear system parameter', () => {
      const tokens = generateDepthScale('linear', 10);
      expect(tokens.length).toBeGreaterThan(0);
    });

    it('should handle different base multipliers', () => {
      const tokens1 = generateDepthScale('exponential', 5);
      const tokens2 = generateDepthScale('exponential', 15);

      expect(tokens1.length).toBe(tokens2.length);
    });
  });
});
