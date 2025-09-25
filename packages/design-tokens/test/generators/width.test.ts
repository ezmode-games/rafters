/**
 * Width Generator Tests
 *
 * Validates width tokens for semantic sizing,
 * layout containers, and responsive design patterns.
 */

import { TokenSchema } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { generateWidthTokens } from '../../src/generators/width.js';

describe('Width Generator', () => {
  describe('generateWidthTokens', () => {
    it('should generate complete width token set', () => {
      const tokens = generateWidthTokens();

      expect(tokens).toHaveLength(13);

      const expectedWidths = [
        'min',
        'max',
        'fit',
        'full',
        'screen',
        'prose',
        'dialog-sm',
        'dialog-md',
        'dialog-lg',
        'dialog-xl',
        'sidebar',
        'sidebar-sm',
        'sidebar-lg',
      ];
      const tokenNames = tokens.map((t) => t.name);

      for (const width of expectedWidths) {
        expect(tokenNames).toContain(width);
      }
    });

    it('should generate intrinsic sizing tokens', () => {
      const tokens = generateWidthTokens();

      const min = tokens.find((t) => t.name === 'min');
      expect(min?.value).toBe('min-content');

      const max = tokens.find((t) => t.name === 'max');
      expect(max?.value).toBe('max-content');

      const fit = tokens.find((t) => t.name === 'fit');
      expect(fit?.value).toBe('fit-content');
    });

    it('should generate full and screen width tokens', () => {
      const tokens = generateWidthTokens();

      const full = tokens.find((t) => t.name === 'full');
      expect(full?.value).toBe('100%');
      expect(full?.cognitiveLoad).toBe(1);

      const screen = tokens.find((t) => t.name === 'screen');
      expect(screen?.value).toBe('100vw');
      expect(screen?.cognitiveLoad).toBe(5);
      expect(screen?.trustLevel).toBe('medium');
    });

    it('should generate prose width for optimal reading', () => {
      const tokens = generateWidthTokens();
      const prose = tokens.find((t) => t.name === 'prose');

      expect(prose?.value).toBe('65ch');
      expect(prose?.semanticMeaning).toBe('Optimal reading width');
      expect(prose?.usageContext).toContain('readability');
    });

    it('should generate dialog width tokens', () => {
      const tokens = generateWidthTokens();

      const dialogSm = tokens.find((t) => t.name === 'dialog-sm');
      expect(dialogSm?.value).toBe('320px');
      expect(dialogSm?.applicableComponents).toContain('modal');

      const dialogXl = tokens.find((t) => t.name === 'dialog-xl');
      expect(dialogXl?.value).toBe('800px');
      expect(dialogXl?.trustLevel).toBe('high');
    });

    it('should generate sidebar width tokens', () => {
      const tokens = generateWidthTokens();

      const sidebar = tokens.find((t) => t.name === 'sidebar');
      expect(sidebar?.value).toBe('280px');

      const sidebarSm = tokens.find((t) => t.name === 'sidebar-sm');
      expect(sidebarSm?.value).toBe('240px');

      const sidebarLg = tokens.find((t) => t.name === 'sidebar-lg');
      expect(sidebarLg?.value).toBe('320px');
    });

    it('should include proper component mappings', () => {
      const tokens = generateWidthTokens();

      const dialogMd = tokens.find((t) => t.name === 'dialog-md');
      expect(dialogMd?.applicableComponents).toContain('dialog');
      expect(dialogMd?.applicableComponents).toContain('modal');

      const sidebar = tokens.find((t) => t.name === 'sidebar');
      expect(sidebar?.applicableComponents).toContain('sidebar');
      expect(sidebar?.applicableComponents).toContain('navigation');

      const prose = tokens.find((t) => t.name === 'prose');
      expect(prose?.applicableComponents).toContain('content');
      expect(prose?.applicableComponents).toContain('article');
    });

    it('should validate against TokenSchema', () => {
      const tokens = generateWidthTokens();

      for (const token of tokens) {
        const result = TokenSchema.safeParse(token);
        expect(result.success).toBe(true);
      }
    });

    it('should have consistent token structure', () => {
      const tokens = generateWidthTokens();

      for (const token of tokens) {
        expect(token).toHaveProperty('name');
        expect(token).toHaveProperty('value');
        expect(token).toHaveProperty('category', 'width');
        expect(token).toHaveProperty('namespace', 'w');
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

    it('should include proper cognitive load progression', () => {
      const tokens = generateWidthTokens();

      const full = tokens.find((t) => t.name === 'full');
      expect(full?.cognitiveLoad).toBe(1); // Simple concept

      const prose = tokens.find((t) => t.name === 'prose');
      expect(prose?.cognitiveLoad).toBe(2); // Typography concept

      const screen = tokens.find((t) => t.name === 'screen');
      expect(screen?.cognitiveLoad).toBe(5); // Viewport concept

      const dialogXl = tokens.find((t) => t.name === 'dialog-xl');
      expect(dialogXl?.cognitiveLoad).toBe(6); // Complex UI
    });

    it('should include appropriate usage contexts', () => {
      const tokens = generateWidthTokens();

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
