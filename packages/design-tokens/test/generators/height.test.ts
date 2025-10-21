/**
 * Height Generator Tests
 *
 * Validates height scale tokens with mathematical progressions,
 * accessibility considerations, and touch target compliance.
 */

import { TokenSchema } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { generateHeightScale } from '../../src/generators/height.js';

describe('Height Generator', () => {
  describe('generateHeightScale', () => {
    it('should generate linear height progression', () => {
      const tokens = generateHeightScale('linear', 2.5, 1.25);

      expect(tokens).toHaveLength(8);
      expect(tokens[0].name).toBe('h-xs');
      expect(tokens[0].value).toBe('2.5rem');
      expect(tokens[1].name).toBe('h-sm');
      expect(tokens[1].value).toBe('3rem');
    });

    it('should include accessibility metadata', () => {
      const tokens = generateHeightScale('linear', 2.5, 1.25);

      for (const token of tokens) {
        expect(token).toHaveProperty('touchTargetSize');
        expect(token.accessibilityLevel).toMatch(/^(AA|AAA)$/);
      }
    });

    it('should validate against TokenSchema', () => {
      const tokens = generateHeightScale('golden', 2.5, 1.25);

      for (const token of tokens) {
        const result = TokenSchema.safeParse(token);
        expect(result.success).toBe(true);

        if (!result.success) {
          console.log('Token validation failed:', token.name, result.error.errors);
        }
      }
    });

    it('should include mathematical relationships', () => {
      const tokens = generateHeightScale('golden', 2.5, 1.25);

      expect(tokens[0].generationRule).toBeUndefined();
      expect(tokens[1].generationRule).toContain('golden');
      expect(tokens[2].generationRule).toContain('golden');
    });
  });
});
