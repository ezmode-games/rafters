/**
 * Unit tests for generateAllTokens function
 */

import { TokenSchema } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { generateAllTokens } from '../../src/generators/index.js';

describe('generateAllTokens', () => {
  it('should generate comprehensive token set', async () => {
    const tokens = await generateAllTokens();

    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(50); // Should be comprehensive
  });

  it('should generate tokens from multiple categories', async () => {
    const tokens = await generateAllTokens();

    const categories = new Set(tokens.map((t) => t.category));
    expect(categories.size).toBeGreaterThan(3); // Multiple categories
    expect(categories).toContain('color');
    expect(categories).toContain('spacing');
  });

  it('should generate valid tokens that pass schema validation', async () => {
    const tokens = await generateAllTokens();

    for (const token of tokens) {
      expect(() => TokenSchema.parse(token)).not.toThrow();
    }
  });

  it('should include semantic metadata for AI consumption', async () => {
    const tokens = await generateAllTokens();

    const semanticTokens = tokens.filter((t) => t.semanticMeaning);
    expect(semanticTokens.length).toBeGreaterThan(10);
  });

  it('should include design intelligence metadata', async () => {
    const tokens = await generateAllTokens();

    const intelligentTokens = tokens.filter(
      (t) => t.trustLevel || t.cognitiveLoad || t.accessibilityLevel
    );
    expect(intelligentTokens.length).toBeGreaterThan(0);
  });
});
