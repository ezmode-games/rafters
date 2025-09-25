/**
 * Font Family Generator Tests
 *
 * Validates font family token structure, semantic font stacks,
 * and typography personality intelligence for different content types.
 */

import { TokenSchema } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { generateFontFamilyTokens } from '../../src/generators/font-family.js';

describe('Font Family Generator', () => {
  describe('generateFontFamilyTokens', () => {
    it('should generate complete font family token set', () => {
      const tokens = generateFontFamilyTokens();

      expect(tokens).toHaveLength(4);

      const expectedFonts = ['sans', 'serif', 'mono', 'display'];
      const tokenNames = tokens.map((t) => t.name);

      for (const font of expectedFonts) {
        expect(tokenNames).toContain(font);
      }
    });

    it('should generate sans serif font token', () => {
      const tokens = generateFontFamilyTokens();
      const sans = tokens.find((t) => t.name === 'sans');

      expect(sans).toBeDefined();
      expect(sans?.value).toBe('"Inter", system-ui, sans-serif');
      expect(sans?.category).toBe('font-family');
      expect(sans?.namespace).toBe('font');
      expect(sans?.semanticMeaning).toBe(
        'Primary sans-serif for UI and body text - optimized for readability'
      );
      expect(sans?.cognitiveLoad).toBe(1);
      expect(sans?.trustLevel).toBe('low');
      expect(sans?.usageContext).toContain('body-text');
      expect(sans?.usageContext).toContain('ui-text');
    });

    it('should generate serif font token', () => {
      const tokens = generateFontFamilyTokens();
      const serif = tokens.find((t) => t.name === 'serif');

      expect(serif).toBeDefined();
      expect(serif?.value).toBe('"Crimson Text", Georgia, serif');
      expect(serif?.semanticMeaning).toBe(
        'Serif font for editorial content - traditional, trustworthy feel'
      );
      expect(serif?.cognitiveLoad).toBe(2);
      expect(serif?.trustLevel).toBe('low');
      expect(serif?.usageContext).toContain('articles');
      expect(serif?.usageContext).toContain('editorial');
    });

    it('should generate monospace font token', () => {
      const tokens = generateFontFamilyTokens();
      const mono = tokens.find((t) => t.name === 'mono');

      expect(mono).toBeDefined();
      expect(mono?.value).toBe('"JetBrains Mono", "Fira Code", monospace');
      expect(mono?.semanticMeaning).toBe('Monospace font for code and data - technical precision');
      expect(mono?.cognitiveLoad).toBe(3);
      expect(mono?.trustLevel).toBe('low');
      expect(mono?.usageContext).toContain('code');
      expect(mono?.usageContext).toContain('technical');
    });

    it('should generate display font token', () => {
      const tokens = generateFontFamilyTokens();
      const display = tokens.find((t) => t.name === 'display');

      expect(display).toBeDefined();
      expect(display?.value).toBe('"Inter Display", system-ui, sans-serif');
      expect(display?.semanticMeaning).toBe(
        'Display font for headings and marketing - optimized for large sizes'
      );
      expect(display?.cognitiveLoad).toBe(4);
      expect(display?.trustLevel).toBe('medium');
      expect(display?.usageContext).toContain('headings');
      expect(display?.usageContext).toContain('marketing');
    });

    it('should include proper component mappings', () => {
      const tokens = generateFontFamilyTokens();

      const mono = tokens.find((t) => t.name === 'mono');
      expect(mono?.applicableComponents).toContain('code');
      expect(mono?.applicableComponents).toContain('pre');
      expect(mono?.applicableComponents).toContain('kbd');

      const display = tokens.find((t) => t.name === 'display');
      expect(display?.applicableComponents).toContain('h1');
      expect(display?.applicableComponents).toContain('h2');
      expect(display?.applicableComponents).toContain('hero');

      const serif = tokens.find((t) => t.name === 'serif');
      expect(serif?.applicableComponents).toContain('article');
      expect(serif?.applicableComponents).toContain('blog');

      const sans = tokens.find((t) => t.name === 'sans');
      expect(sans?.applicableComponents).toContain('all');
    });

    it('should include proper cognitive load progression', () => {
      const tokens = generateFontFamilyTokens();

      const sans = tokens.find((t) => t.name === 'sans');
      expect(sans?.cognitiveLoad).toBe(1);

      const serif = tokens.find((t) => t.name === 'serif');
      expect(serif?.cognitiveLoad).toBe(2);

      const mono = tokens.find((t) => t.name === 'mono');
      expect(mono?.cognitiveLoad).toBe(3);

      const display = tokens.find((t) => t.name === 'display');
      expect(display?.cognitiveLoad).toBe(4);
    });

    it('should include accessibility metadata', () => {
      const tokens = generateFontFamilyTokens();

      for (const token of tokens) {
        expect(token.accessibilityLevel).toBe('AAA');
        expect(token.consequence).toBe('reversible');
        expect(token.generateUtilityClass).toBe(true);
      }
    });

    it('should validate against TokenSchema', () => {
      const tokens = generateFontFamilyTokens();

      for (const token of tokens) {
        const result = TokenSchema.safeParse(token);
        expect(result.success).toBe(true);
      }
    });

    it('should include semantic meaning for all fonts', () => {
      const tokens = generateFontFamilyTokens();

      for (const token of tokens) {
        expect(token.semanticMeaning).toBeTruthy();
        expect(typeof token.semanticMeaning).toBe('string');
        expect(token.semanticMeaning?.length).toBeGreaterThan(20);
      }
    });

    it('should have proper font stacks with fallbacks', () => {
      const tokens = generateFontFamilyTokens();

      for (const token of tokens) {
        const value = token.value as string;
        expect(value).toContain(','); // Should have fallbacks

        if (token.name === 'sans' || token.name === 'display') {
          expect(value).toContain('sans-serif');
        } else if (token.name === 'serif') {
          expect(value).toContain('serif');
        } else if (token.name === 'mono') {
          expect(value).toContain('monospace');
        }
      }
    });

    it('should include usage context for all fonts', () => {
      const tokens = generateFontFamilyTokens();

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

    it('should have consistent token structure', () => {
      const tokens = generateFontFamilyTokens();

      for (const token of tokens) {
        expect(token).toHaveProperty('name');
        expect(token).toHaveProperty('value');
        expect(token).toHaveProperty('category', 'font-family');
        expect(token).toHaveProperty('namespace', 'font');
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

    it('should have proper scale positions', () => {
      const tokens = generateFontFamilyTokens();

      for (let i = 0; i < tokens.length; i++) {
        expect(tokens[i].scalePosition).toBe(i);
      }
    });
  });
});
