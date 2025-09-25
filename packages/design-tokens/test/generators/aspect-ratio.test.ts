/**
 * Aspect Ratio Generator Tests
 *
 * Validates aspect ratio token structure, mathematical relationships,
 * and semantic meaning for responsive media and layout elements.
 */

import { TokenSchema } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { generateAspectRatioTokens } from '../../src/generators/aspect-ratio.js';

describe('Aspect Ratio Generator', () => {
  describe('generateAspectRatioTokens', () => {
    it('should generate complete aspect ratio token set', () => {
      const tokens = generateAspectRatioTokens();

      expect(tokens).toHaveLength(7);

      const expectedRatios = [
        'square',
        'video',
        'photo',
        'golden',
        'portrait',
        'landscape',
        'ultrawide',
      ];
      const tokenNames = tokens.map((t) => t.name);

      for (const ratio of expectedRatios) {
        expect(tokenNames).toContain(ratio);
      }
    });

    it('should generate square aspect ratio token', () => {
      const tokens = generateAspectRatioTokens();
      const square = tokens.find((t) => t.name === 'square');

      expect(square).toBeDefined();
      expect(square?.value).toBe('1 / 1');
      expect(square?.category).toBe('aspect-ratio');
      expect(square?.namespace).toBe('aspect');
      expect(square?.semanticMeaning).toBe('Square aspect ratio for avatars and icons');
      expect(square?.cognitiveLoad).toBe(1);
      expect(square?.trustLevel).toBe('low');
      expect(square?.usageContext).toContain('avatars');
      expect(square?.usageContext).toContain('icons');
    });

    it('should generate video aspect ratio token', () => {
      const tokens = generateAspectRatioTokens();
      const video = tokens.find((t) => t.name === 'video');

      expect(video).toBeDefined();
      expect(video?.value).toBe('16 / 9');
      expect(video?.semanticMeaning).toBe('Video aspect ratio for media content');
      expect(video?.cognitiveLoad).toBe(2);
      expect(video?.trustLevel).toBe('low');
      expect(video?.usageContext).toContain('video');
      expect(video?.usageContext).toContain('media');
    });

    it('should generate golden ratio aspect ratio token', () => {
      const tokens = generateAspectRatioTokens();
      const golden = tokens.find((t) => t.name === 'golden');

      expect(golden).toBeDefined();
      expect(golden?.value).toBe('1.618 / 1');
      expect(golden?.semanticMeaning).toBe('Golden ratio for aesthetic layouts');
      expect(golden?.cognitiveLoad).toBe(4);
      expect(golden?.trustLevel).toBe('medium');
      expect(golden?.usageContext).toContain('aesthetic-layouts');
      expect(golden?.usageContext).toContain('artistic');
    });

    it('should include proper component mappings', () => {
      const tokens = generateAspectRatioTokens();

      const video = tokens.find((t) => t.name === 'video');
      expect(video?.applicableComponents).toContain('video');
      expect(video?.applicableComponents).toContain('iframe');
      expect(video?.applicableComponents).toContain('embed');

      const square = tokens.find((t) => t.name === 'square');
      expect(square?.applicableComponents).toContain('avatar');
      expect(square?.applicableComponents).toContain('icon');
      expect(square?.applicableComponents).toContain('logo');

      const photo = tokens.find((t) => t.name === 'photo');
      expect(photo?.applicableComponents).toContain('img');
      expect(photo?.applicableComponents).toContain('figure');
    });

    it('should include proper cognitive load assessment', () => {
      const tokens = generateAspectRatioTokens();

      // Simple ratios should have lower cognitive load
      const square = tokens.find((t) => t.name === 'square');
      expect(square?.cognitiveLoad).toBeLessThanOrEqual(2);

      // Complex ratios should have higher cognitive load
      const ultrawide = tokens.find((t) => t.name === 'ultrawide');
      expect(ultrawide?.cognitiveLoad).toBeGreaterThanOrEqual(4);

      const golden = tokens.find((t) => t.name === 'golden');
      expect(golden?.cognitiveLoad).toBeGreaterThanOrEqual(4);
    });

    it('should include proper trust level assessment', () => {
      const tokens = generateAspectRatioTokens();

      // Common ratios should have low trust level
      const square = tokens.find((t) => t.name === 'square');
      expect(square?.trustLevel).toBe('low');

      const video = tokens.find((t) => t.name === 'video');
      expect(video?.trustLevel).toBe('low');

      // Specialized ratios might have medium trust level
      const golden = tokens.find((t) => t.name === 'golden');
      expect(golden?.trustLevel).toBe('medium');

      const ultrawide = tokens.find((t) => t.name === 'ultrawide');
      expect(ultrawide?.trustLevel).toBe('medium');
    });

    it('should include usage context metadata', () => {
      const tokens = generateAspectRatioTokens();

      const portrait = tokens.find((t) => t.name === 'portrait');
      expect(portrait?.usageContext).toContain('portraits');
      expect(portrait?.usageContext).toContain('mobile-media');

      const landscape = tokens.find((t) => t.name === 'landscape');
      expect(landscape?.usageContext).toContain('landscapes');
      expect(landscape?.usageContext).toContain('horizontal-media');

      const ultrawide = tokens.find((t) => t.name === 'ultrawide');
      expect(ultrawide?.usageContext).toContain('ultrawide');
      expect(ultrawide?.usageContext).toContain('cinematic');
      expect(ultrawide?.usageContext).toContain('banner');
    });

    it('should include accessibility metadata', () => {
      const tokens = generateAspectRatioTokens();

      for (const token of tokens) {
        expect(token.accessibilityLevel).toBe('AAA');
        expect(token.consequence).toBe('reversible');
        expect(token.generateUtilityClass).toBe(true);
      }
    });

    it('should validate against TokenSchema', () => {
      const tokens = generateAspectRatioTokens();

      for (const token of tokens) {
        const result = TokenSchema.safeParse(token);
        expect(result.success).toBe(true);
      }
    });

    it('should include proper scale positions', () => {
      const tokens = generateAspectRatioTokens();

      for (let i = 0; i < tokens.length; i++) {
        expect(tokens[i].scalePosition).toBe(i);
      }
    });

    it('should include semantic meaning for all ratios', () => {
      const tokens = generateAspectRatioTokens();

      for (const token of tokens) {
        expect(token.semanticMeaning).toBeTruthy();
        expect(typeof token.semanticMeaning).toBe('string');
        expect(token.semanticMeaning?.length).toBeGreaterThan(10);
      }
    });

    it('should generate proper mathematical ratios', () => {
      const tokens = generateAspectRatioTokens();

      // Test mathematical accuracy of ratios
      const video = tokens.find((t) => t.name === 'video');
      expect(video?.value).toBe('16 / 9');

      const photo = tokens.find((t) => t.name === 'photo');
      expect(photo?.value).toBe('4 / 3');

      const portrait = tokens.find((t) => t.name === 'portrait');
      expect(portrait?.value).toBe('3 / 4');

      const landscape = tokens.find((t) => t.name === 'landscape');
      expect(landscape?.value).toBe('4 / 3');

      const ultrawide = tokens.find((t) => t.name === 'ultrawide');
      expect(ultrawide?.value).toBe('21 / 9');
    });

    it('should have appropriate media component mappings', () => {
      const tokens = generateAspectRatioTokens();

      const golden = tokens.find((t) => t.name === 'golden');
      expect(golden?.applicableComponents).toContain('media');

      const portrait = tokens.find((t) => t.name === 'portrait');
      expect(portrait?.applicableComponents).toContain('media');

      const landscape = tokens.find((t) => t.name === 'landscape');
      expect(landscape?.applicableComponents).toContain('media');

      const ultrawide = tokens.find((t) => t.name === 'ultrawide');
      expect(ultrawide?.applicableComponents).toContain('media');
    });

    it('should differentiate between portrait and landscape orientations', () => {
      const tokens = generateAspectRatioTokens();

      const portrait = tokens.find((t) => t.name === 'portrait');
      expect(portrait?.value).toBe('3 / 4');
      expect(portrait?.usageContext).toContain('vertical-content');

      const landscape = tokens.find((t) => t.name === 'landscape');
      expect(landscape?.value).toBe('4 / 3');
      expect(landscape?.usageContext).toContain('wide-content');
    });

    it('should include proper cognitive load progression', () => {
      const tokens = generateAspectRatioTokens();

      // Square should be simplest
      const square = tokens.find((t) => t.name === 'square');
      expect(square?.cognitiveLoad).toBe(1);

      // Common media ratios should be moderate
      const video = tokens.find((t) => t.name === 'video');
      expect(video?.cognitiveLoad).toBe(2);

      const photo = tokens.find((t) => t.name === 'photo');
      expect(photo?.cognitiveLoad).toBe(2);

      // Specialized ratios should be higher
      const golden = tokens.find((t) => t.name === 'golden');
      expect(golden?.cognitiveLoad).toBe(4);

      const ultrawide = tokens.find((t) => t.name === 'ultrawide');
      expect(ultrawide?.cognitiveLoad).toBe(5);
    });
  });

  describe('Token Structure Validation', () => {
    it('should have consistent token structure', () => {
      const tokens = generateAspectRatioTokens();

      for (const token of tokens) {
        expect(token).toHaveProperty('name');
        expect(token).toHaveProperty('value');
        expect(token).toHaveProperty('category', 'aspect-ratio');
        expect(token).toHaveProperty('namespace', 'aspect');
        expect(token).toHaveProperty('semanticMeaning');
        expect(token).toHaveProperty('scalePosition');
        expect(token).toHaveProperty('generateUtilityClass', true);
        expect(token).toHaveProperty('applicableComponents');
        expect(token).toHaveProperty('accessibilityLevel', 'AAA');
        expect(token).toHaveProperty('cognitiveLoad');
        expect(token).toHaveProperty('trustLevel');
        expect(token).toHaveProperty('consequence', 'reversible');
        expect(token).toHaveProperty('usageContext');
      }
    });

    it('should have valid value formats', () => {
      const tokens = generateAspectRatioTokens();

      for (const token of tokens) {
        // Aspect ratio values should be in format "number / number" or "decimal / number"
        expect(token.value).toMatch(/^[\d.]+\s*\/\s*\d+$/);
      }
    });

    it('should have appropriate usage contexts', () => {
      const tokens = generateAspectRatioTokens();

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
