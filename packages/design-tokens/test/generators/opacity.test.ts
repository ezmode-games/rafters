/**
 * Opacity Generator Tests
 *
 * Validates opacity tokens for UI states, layering effects,
 * and behavioral intelligence for interactive elements.
 */

import { TokenSchema } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { generateOpacityTokens } from '../../src/generators/opacity.js';

describe('Opacity Generator', () => {
  describe('generateOpacityTokens', () => {
    it('should generate complete opacity token set', () => {
      const tokens = generateOpacityTokens();

      expect(tokens).toHaveLength(6);

      const expectedOpacities = ['disabled', 'loading', 'overlay', 'backdrop', 'hover', 'focus'];
      const tokenNames = tokens.map((t) => t.name);

      for (const opacity of expectedOpacities) {
        expect(tokenNames).toContain(opacity);
      }
    });

    it('should generate disabled opacity token', () => {
      const tokens = generateOpacityTokens();
      const disabled = tokens.find((t) => t.name === 'disabled');

      expect(disabled).toBeDefined();
      expect(disabled?.value).toBe('0.5');
      expect(disabled?.semanticMeaning).toBe(
        'Disabled state opacity - clearly indicates non-interactive state'
      );
      expect(disabled?.cognitiveLoad).toBe(3);
      expect(disabled?.trustLevel).toBe('medium');
      expect(disabled?.interactionType).toBe('disabled');
    });

    it('should generate overlay opacity token', () => {
      const tokens = generateOpacityTokens();
      const overlay = tokens.find((t) => t.name === 'overlay');

      expect(overlay).toBeDefined();
      expect(overlay?.value).toBe('0.8');
      expect(overlay?.semanticMeaning).toBe(
        'Modal overlay background - creates focus without complete blocking'
      );
      expect(overlay?.cognitiveLoad).toBe(6);
      expect(overlay?.trustLevel).toBe('high');
      expect(overlay?.consequence).toBe('significant');
    });

    it('should include proper interaction types', () => {
      const tokens = generateOpacityTokens();

      const hover = tokens.find((t) => t.name === 'hover');
      expect(hover?.interactionType).toBe('hover');

      const focus = tokens.find((t) => t.name === 'focus');
      expect(focus?.interactionType).toBe('focus');

      const loading = tokens.find((t) => t.name === 'loading');
      expect(loading?.interactionType).toBe('loading');
    });

    it('should include proper component mappings', () => {
      const tokens = generateOpacityTokens();

      const disabled = tokens.find((t) => t.name === 'disabled');
      expect(disabled?.applicableComponents).toContain('button');
      expect(disabled?.applicableComponents).toContain('input');
      expect(disabled?.applicableComponents).toContain('text');

      const overlay = tokens.find((t) => t.name === 'overlay');
      expect(overlay?.applicableComponents).toContain('modal');
      expect(overlay?.applicableComponents).toContain('dialog');
    });

    it('should validate against TokenSchema', () => {
      const tokens = generateOpacityTokens();

      for (const token of tokens) {
        const result = TokenSchema.safeParse(token);
        expect(result.success).toBe(true);

        if (!result.success) {
          console.log('Token validation failed:', token.name, result.error.errors);
        }
      }
    });

    it('should have consistent token structure', () => {
      const tokens = generateOpacityTokens();

      for (const token of tokens) {
        expect(token).toHaveProperty('name');
        expect(token).toHaveProperty('value');
        expect(token).toHaveProperty('category', 'opacity');
        expect(token).toHaveProperty('namespace', 'opacity');
        expect(token).toHaveProperty('semanticMeaning');
        expect(token).toHaveProperty('scalePosition');
        expect(token).toHaveProperty('generateUtilityClass', true);
        expect(token).toHaveProperty('applicableComponents');
        expect(token).toHaveProperty('accessibilityLevel', 'AAA');
        expect(token).toHaveProperty('cognitiveLoad');
        expect(token).toHaveProperty('trustLevel');
        expect(token).toHaveProperty('consequence');
        expect(token).toHaveProperty('usageContext');
      }
    });

    it('should have valid opacity values', () => {
      const tokens = generateOpacityTokens();

      for (const token of tokens) {
        const value = parseFloat(token.value as string);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      }
    });
  });
});
