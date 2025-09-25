/**
 * Transform Generator Tests
 *
 * Validates transform tokens for animations and interactions,
 * semantic scaling, translation, and rotation effects.
 */

import { TokenSchema } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { generateTransformTokens } from '../../src/generators/transform.js';

describe('Transform Generator', () => {
  describe('generateTransformTokens', () => {
    it('should generate complete transform token set', () => {
      const tokens = generateTransformTokens();

      const scaleTokens = tokens.filter((t) => t.category === 'scale');
      const translateTokens = tokens.filter((t) => t.category === 'translate');
      const rotateTokens = tokens.filter((t) => t.category === 'rotate');

      expect(scaleTokens).toHaveLength(6);
      expect(translateTokens).toHaveLength(7);
      expect(rotateTokens).toHaveLength(4);
      expect(tokens).toHaveLength(17);
    });

    it('should generate hover scale token', () => {
      const tokens = generateTransformTokens();
      const scaleTokens = tokens.filter((t) => t.category === 'scale');
      const hover = scaleTokens.find((t) => t.name === 'hover');

      expect(hover?.value).toBe('1.02');
      expect(hover?.semanticMeaning).toBe('Subtle hover scale for interactive elements');
      expect(hover?.interactionType).toBe('hover');
    });

    it('should generate translate tokens', () => {
      const tokens = generateTransformTokens();
      const translateTokens = tokens.filter((t) => t.category === 'translate');

      const center = translateTokens.find((t) => t.name === 'center');
      expect(center?.value).toBe('-50%');

      const slideUp = translateTokens.find((t) => t.name === 'slide-up');
      expect(slideUp?.value).toBe('0, -100%');
    });

    it('should generate rotate tokens', () => {
      const tokens = generateTransformTokens();
      const rotateTokens = tokens.filter((t) => t.category === 'rotate');

      const flip = rotateTokens.find((t) => t.name === 'flip');
      expect(flip?.value).toBe('180deg');

      const quarter = rotateTokens.find((t) => t.name === 'quarter');
      expect(quarter?.value).toBe('90deg');
    });

    it('should validate against TokenSchema', () => {
      const tokens = generateTransformTokens();

      for (const token of tokens) {
        const result = TokenSchema.safeParse(token);
        expect(result.success).toBe(true);
      }
    });

    it('should include interaction types for scale tokens', () => {
      const tokens = generateTransformTokens();
      const scaleTokens = tokens.filter((t) => t.category === 'scale');

      const hover = scaleTokens.find((t) => t.name === 'hover');
      expect(hover?.interactionType).toBe('hover');

      const active = scaleTokens.find((t) => t.name === 'active');
      expect(active?.interactionType).toBe('active');

      const focus = scaleTokens.find((t) => t.name === 'focus');
      expect(focus?.interactionType).toBe('focus');
    });

    it('should have consistent token structure', () => {
      const tokens = generateTransformTokens();

      for (const token of tokens) {
        expect(token).toHaveProperty('name');
        expect(token).toHaveProperty('value');
        expect(token).toHaveProperty('category');
        expect(token).toHaveProperty('namespace');
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
  });
});
