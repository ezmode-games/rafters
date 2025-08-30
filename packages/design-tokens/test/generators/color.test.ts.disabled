/**
 * Color Generator Tests
 *
 * Tests for semantic color token generation
 */

import { describe, expect, it } from 'vitest';
import { generateColorTokens } from '../../src/generators/color.js';
import { TokenSchema } from '../../src/index.js';

describe('generateColorTokens', () => {
  it('generates semantic color tokens with light and dark variants', () => {
    const tokens = generateColorTokens();

    expect(tokens.length).toBeGreaterThan(10);

    // Check primary color exists
    const primary = tokens.find((t) => t.name === 'primary');
    expect(primary).toBeDefined();
    expect(primary?.category).toBe('color');
    expect(primary?.value).toBeDefined();
    expect(primary?.darkValue).toBeDefined();
    expect(primary?.semanticMeaning).toContain('Primary brand color');

    // Check destructive color exists
    const destructive = tokens.find((t) => t.name === 'destructive');
    expect(destructive).toBeDefined();
    expect(destructive?.semanticMeaning).toContain('Destructive actions');
    expect(destructive?.trustLevel).toBe('critical');

    // Check foreground pairs exist
    const primaryForeground = tokens.find((t) => t.name === 'primary-foreground');
    expect(primaryForeground).toBeDefined();
    expect(primaryForeground?.semanticMeaning).toContain('Text color for primary backgrounds');
  });

  it('includes proper trust levels for different color purposes', () => {
    const tokens = generateColorTokens();

    const success = tokens.find((t) => t.name === 'success');
    expect(success?.trustLevel).toBe('low');

    const destructive = tokens.find((t) => t.name === 'destructive');
    expect(destructive?.trustLevel).toBe('critical');

    const muted = tokens.find((t) => t.name === 'muted');
    expect(muted?.trustLevel).toBe('low');
  });

  it('validates all color tokens pass schema validation', () => {
    const tokens = generateColorTokens();

    for (const token of tokens) {
      expect(() => TokenSchema.parse(token)).not.toThrow();
    }
  });

  it('includes proper OKLCH color values', () => {
    const tokens = generateColorTokens();

    const primary = tokens.find((t) => t.name === 'primary');
    expect(primary?.value).toMatch(/oklch\(/);
    expect(primary?.darkValue).toMatch(/oklch\(/);

    // Check that light and dark values are different
    expect(primary?.value).not.toBe(primary?.darkValue);
  });

  it('includes usage context for AI decision-making', () => {
    const tokens = generateColorTokens();

    const destructive = tokens.find((t) => t.name === 'destructive');
    expect(destructive?.usageContext).toContain('error');
    expect(destructive?.usageContext).toContain('delete');

    const success = tokens.find((t) => t.name === 'success');
    expect(success?.usageContext).toContain('success-message');
    expect(success?.usageContext).toContain('confirmation');
  });
});
