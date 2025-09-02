/**
 * Unit tests for color token generation
 */

import { TokenSchema } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { generateColorTokens } from '../../src/generators/color.js';

describe('generateColorTokens', () => {
  it('should generate an array of tokens', () => {
    const tokens = generateColorTokens();
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });

  it('should generate neutral color tokens', () => {
    const tokens = generateColorTokens();

    // Should have neutral/background tokens (background, foreground, muted, etc.)
    const neutralTokens = tokens.filter(
      (t) =>
        t.name === 'background' ||
        t.name === 'foreground' ||
        t.name === 'muted' ||
        t.name === 'muted-foreground' ||
        t.name === 'border'
    );
    expect(neutralTokens.length).toBeGreaterThan(4);

    // Check that all tokens have required properties
    for (const token of neutralTokens) {
      expect(token.name).toBeDefined();
      expect(token.value).toBeDefined();
      expect(token.category).toBe('color');
      expect(token.namespace).toBe('color');
    }
  });

  it('should generate tokens that pass schema validation', () => {
    const tokens = generateColorTokens();

    for (const token of tokens) {
      expect(() => TokenSchema.parse(token)).not.toThrow();
    }
  });

  it('should generate semantic tokens with usage context', () => {
    const tokens = generateColorTokens();

    // Find tokens with semantic meaning
    const semanticTokens = tokens.filter((t) => t.semanticMeaning);
    expect(semanticTokens.length).toBeGreaterThan(0);

    // Check semantic properties
    for (const token of semanticTokens) {
      expect(token.semanticMeaning).toBeTruthy();
      expect(token.category).toBe('color');
    }
  });

  it('should accept custom primary tone', () => {
    const customTone = { l: 0.5, c: 0.1, h: 120, alpha: 1 }; // Green
    const tokens = generateColorTokens(customTone);

    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);

    // All tokens should still be valid
    for (const token of tokens) {
      expect(() => TokenSchema.parse(token)).not.toThrow();
    }
  });
});
