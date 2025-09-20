/**
 * Touch Target Generator Tests
 *
 * Validates touch target tokens for WCAG compliance,
 * accessibility guidelines, and interactive element sizing.
 */

import { TokenSchema } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { generateTouchTargetTokens } from '../../src/generators/touch-target.js';

describe('Touch Target Generator', () => {
  describe('generateTouchTargetTokens', () => {
    it('should generate complete touch target token set', () => {
      const tokens = generateTouchTargetTokens();

      expect(tokens).toHaveLength(4);

      const expectedTargets = ['compact', 'standard', 'comfortable', 'large'];
      const tokenNames = tokens.map((t) => t.name);

      for (const target of expectedTargets) {
        expect(tokenNames).toContain(target);
      }
    });

    it('should generate standard WCAG-compliant token', () => {
      const tokens = generateTouchTargetTokens();
      const standard = tokens.find((t) => t.name === 'standard');

      expect(standard?.value).toBe('44px');
      expect(standard?.semanticMeaning).toBe('Standard touch target - meets WCAG AAA guidelines');
      expect(standard?.accessibilityLevel).toBe('AAA');
      expect(standard?.touchTargetSize).toBe(44);
    });

    it('should mark compact as below accessibility guidelines', () => {
      const tokens = generateTouchTargetTokens();
      const compact = tokens.find((t) => t.name === 'compact');

      expect(compact?.value).toBe('32px');
      expect(compact?.accessibilityLevel).toBe('AA');
      expect(compact?.touchTargetSize).toBe(32);
    });

    it('should validate against TokenSchema', () => {
      const tokens = generateTouchTargetTokens();

      for (const token of tokens) {
        const result = TokenSchema.safeParse(token);
        expect(result.success).toBe(true);

        if (!result.success) {
          console.log('Token validation failed:', token.name, result.error.errors);
        }
      }
    });

    it('should include proper component mappings', () => {
      const tokens = generateTouchTargetTokens();

      for (const token of tokens) {
        expect(token.applicableComponents).toContain('button');
        expect(token.applicableComponents).toContain('input');
        expect(token.applicableComponents).toContain('link');
      }
    });

    it('should have consistent token structure', () => {
      const tokens = generateTouchTargetTokens();

      for (const token of tokens) {
        expect(token).toHaveProperty('name');
        expect(token).toHaveProperty('value');
        expect(token).toHaveProperty('category', 'touch-target');
        expect(token).toHaveProperty('namespace', 'touch');
        expect(token).toHaveProperty('semanticMeaning');
        expect(token).toHaveProperty('scalePosition');
        expect(token).toHaveProperty('touchTargetSize');
        expect(token).toHaveProperty('generateUtilityClass', true);
        expect(token).toHaveProperty('applicableComponents');
        expect(token).toHaveProperty('accessibilityLevel');
        expect(token).toHaveProperty('cognitiveLoad', 2);
        expect(token).toHaveProperty('trustLevel', 'medium');
        expect(token).toHaveProperty('consequence', 'significant');
        expect(token).toHaveProperty('usageContext');
      }
    });
  });
});
