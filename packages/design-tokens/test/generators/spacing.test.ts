/**
 * Unit tests for spacing token generation
 */

import { TokenSchema } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { generateSpacingScale } from '../../src/generators/spacing.js';

describe('generateSpacingScale', () => {
  it('should generate spacing tokens with linear system', () => {
    const tokens = generateSpacingScale('linear');
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });

  it('should generate tokens with proper spacing values', () => {
    const tokens = generateSpacingScale('linear');

    for (const token of tokens) {
      expect(token.category).toBe('spacing');
      expect(token.namespace).toBe('spacing');
      expect(token.value).toMatch(/\d+(\.\d+)?(rem|px)/); // Should be valid CSS unit
      expect(token.name).toBeDefined();
    }
  });

  it('should generate tokens that pass schema validation', () => {
    const tokens = generateSpacingScale('linear');

    for (const token of tokens) {
      expect(() => TokenSchema.parse(token)).not.toThrow();
    }
  });

  it('should include mathematical relationships', () => {
    const tokens = generateSpacingScale('linear');

    // Should have tokens with mathematical relationships
    const mathTokens = tokens.filter((t) => t.mathRelationship);
    expect(mathTokens.length).toBeGreaterThan(0);
  });

  it('should accept different mathematical systems', () => {
    const linearTokens = generateSpacingScale('linear');
    const goldenTokens = generateSpacingScale('golden');
    const customTokens = generateSpacingScale('custom', 4, 1.5);

    expect(Array.isArray(linearTokens)).toBe(true);
    expect(Array.isArray(goldenTokens)).toBe(true);
    expect(Array.isArray(customTokens)).toBe(true);

    // All should be valid
    for (const token of [...linearTokens, ...goldenTokens, ...customTokens]) {
      expect(() => TokenSchema.parse(token)).not.toThrow();
    }
  });
});
