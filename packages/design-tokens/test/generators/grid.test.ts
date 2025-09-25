/**
 * Grid Generator Tests
 *
 * Validates CSS Grid token structure, layout patterns,
 * and responsive grid systems for complex layouts.
 */

import { TokenSchema } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { generateGridTokens } from '../../src/generators/grid.js';

describe('Grid Generator', () => {
  describe('generateGridTokens', () => {
    it('should generate complete grid token set', () => {
      const tokens = generateGridTokens();

      const columnTokens = tokens.filter((t) => t.category === 'grid-template-columns');
      const rowTokens = tokens.filter((t) => t.category === 'grid-template-rows');

      expect(columnTokens).toHaveLength(12);
      expect(rowTokens).toHaveLength(5);
      expect(tokens).toHaveLength(17);
    });

    it('should generate auto-fit column tokens', () => {
      const tokens = generateGridTokens();
      const columnTokens = tokens.filter((t) => t.category === 'grid-template-columns');

      const autoFitSm = columnTokens.find((t) => t.name === 'auto-fit-sm');
      expect(autoFitSm?.value).toBe('repeat(auto-fit, minmax(200px, 1fr))');
      expect(autoFitSm?.semanticMeaning).toBe('Auto-fit grid for small cards');
    });

    it('should generate fixed column tokens', () => {
      const tokens = generateGridTokens();
      const columnTokens = tokens.filter((t) => t.category === 'grid-template-columns');

      const twoCols = columnTokens.find((t) => t.name === '2-cols');
      expect(twoCols?.value).toBe('repeat(2, 1fr)');

      const twelveCols = columnTokens.find((t) => t.name === '12-cols');
      expect(twelveCols?.value).toBe('repeat(12, 1fr)');
    });

    it('should generate row tokens', () => {
      const tokens = generateGridTokens();
      const rowTokens = tokens.filter((t) => t.category === 'grid-template-rows');

      const headerMainFooter = rowTokens.find((t) => t.name === 'header-main-footer');
      expect(headerMainFooter?.value).toBe('auto 1fr auto');
      expect(headerMainFooter?.semanticMeaning).toBe('Header, main content, footer layout');
    });

    it('should validate against TokenSchema', () => {
      const tokens = generateGridTokens();

      for (const token of tokens) {
        const result = TokenSchema.safeParse(token);
        expect(result.success).toBe(true);

        // Token validation checked above
      }
    });

    it('should have consistent token structure', () => {
      const tokens = generateGridTokens();

      for (const token of tokens) {
        expect(token).toHaveProperty('name');
        expect(token).toHaveProperty('value');
        expect(token).toHaveProperty('semanticMeaning');
        expect(token).toHaveProperty('scalePosition');
        expect(token).toHaveProperty('generateUtilityClass', true);
        expect(token).toHaveProperty('applicableComponents');
        expect(token).toHaveProperty('accessibilityLevel', 'AAA');
        expect(token).toHaveProperty('cognitiveLoad');
        expect(token).toHaveProperty('trustLevel');
        expect(token).toHaveProperty('consequence', 'significant');
        expect(token).toHaveProperty('usageContext');
      }
    });
  });
});
