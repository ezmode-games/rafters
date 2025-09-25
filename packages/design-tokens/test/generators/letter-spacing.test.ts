/**
 * Letter Spacing Generator Tests
 *
 * Validates letter spacing tokens for optical typography,
 * readability optimization, and contextual text spacing.
 */

import { TokenSchema } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { generateLetterSpacingTokens } from '../../src/generators/letter-spacing.js';

describe('Letter Spacing Generator', () => {
  describe('generateLetterSpacingTokens', () => {
    it('should generate complete letter spacing token set', () => {
      const tokens = generateLetterSpacingTokens();

      expect(tokens).toHaveLength(6);

      const expectedSpacings = ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest'];
      const tokenNames = tokens.map((t) => t.name);

      for (const spacing of expectedSpacings) {
        expect(tokenNames).toContain(spacing);
      }
    });

    it('should generate normal spacing as baseline', () => {
      const tokens = generateLetterSpacingTokens();
      const normal = tokens.find((t) => t.name === 'normal');

      expect(normal?.value).toBe('0em');
      expect(normal?.semanticMeaning).toBe('Normal letter spacing');
      expect(normal?.cognitiveLoad).toBe(1);
    });

    it('should have symmetric spacing around normal', () => {
      const tokens = generateLetterSpacingTokens();

      const tighter = tokens.find((t) => t.name === 'tighter');
      expect(tighter?.value).toBe('-0.05em');

      const wider = tokens.find((t) => t.name === 'wider');
      expect(wider?.value).toBe('0.05em');
    });

    it('should validate against TokenSchema', () => {
      const tokens = generateLetterSpacingTokens();

      for (const token of tokens) {
        const result = TokenSchema.safeParse(token);
        expect(result.success).toBe(true);
      }
    });

    it('should include proper component mappings', () => {
      const tokens = generateLetterSpacingTokens();

      const wider = tokens.find((t) => t.name === 'wider');
      expect(wider?.applicableComponents).toContain('h1');
      expect(wider?.applicableComponents).toContain('h2');

      const tight = tokens.find((t) => t.name === 'tight');
      expect(tight?.applicableComponents).toContain('body');
    });
  });
});
