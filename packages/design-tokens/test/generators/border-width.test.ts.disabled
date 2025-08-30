/**
 * Border Width Generator Tests
 *
 * Tests for border width token generation
 */

import { describe, expect, it } from 'vitest';
import { generateBorderWidthTokens } from '../../src/generators/border-width.js';
import { TokenSchema } from '../../src/index.js';

describe('generateBorderWidthTokens', () => {
  it('generates border width tokens with mathematical progression', () => {
    const tokens = generateBorderWidthTokens();

    expect(tokens.length).toBe(5); // 0, DEFAULT, 2, 4, 8

    // Check none
    const zero = tokens.find((t) => t.name === '0');
    expect(zero?.value).toBe('0px');

    // Check default
    const defaultBorder = tokens.find((t) => t.name === 'DEFAULT');
    expect(defaultBorder?.value).toBe('1px');

    // Check medium
    const two = tokens.find((t) => t.name === '2');
    expect(two?.value).toBe('2px');

    // Check thick
    const eight = tokens.find((t) => t.name === '8');
    expect(eight?.value).toBe('8px');
  });

  it('includes proper semantic meanings', () => {
    const tokens = generateBorderWidthTokens();

    const zero = tokens.find((t) => t.name === '0');
    expect(zero?.semanticMeaning).toBe('No border');

    const defaultBorder = tokens.find((t) => t.name === 'DEFAULT');
    expect(defaultBorder?.semanticMeaning).toBe('Default border width');

    const two = tokens.find((t) => t.name === '2');
    expect(two?.semanticMeaning).toContain('Medium border for emphasis');

    const eight = tokens.find((t) => t.name === '8');
    expect(eight?.semanticMeaning).toContain('Extra thick decorative border');
  });

  it('includes usage context for different border widths', () => {
    const tokens = generateBorderWidthTokens();

    const zero = tokens.find((t) => t.name === '0');
    expect(zero?.usageContext).toContain('borderless');
    expect(zero?.usageContext).toContain('minimal');

    const defaultBorder = tokens.find((t) => t.name === 'DEFAULT');
    expect(defaultBorder?.usageContext).toContain('standard-border');
    expect(defaultBorder?.usageContext).toContain('input-fields');
    expect(defaultBorder?.usageContext).toContain('cards');

    const two = tokens.find((t) => t.name === '2');
    expect(two?.usageContext).toContain('emphasis');
    expect(two?.usageContext).toContain('focus-states');

    const eight = tokens.find((t) => t.name === '8');
    expect(eight?.usageContext).toContain('decorative');
    expect(eight?.usageContext).toContain('brand-elements');
  });

  it('includes proper cognitive load ratings', () => {
    const tokens = generateBorderWidthTokens();

    const zero = tokens.find((t) => t.name === '0');
    expect(zero?.cognitiveLoad).toBe(1); // No visual impact

    const defaultBorder = tokens.find((t) => t.name === 'DEFAULT');
    expect(defaultBorder?.cognitiveLoad).toBe(1); // Standard, expected

    const two = tokens.find((t) => t.name === '2');
    expect(two?.cognitiveLoad).toBe(2); // Noticeable emphasis

    const eight = tokens.find((t) => t.name === '8');
    expect(eight?.cognitiveLoad).toBe(5); // Strong visual impact
  });

  it('includes proper trust levels based on thickness', () => {
    const tokens = generateBorderWidthTokens();

    const zero = tokens.find((t) => t.name === '0');
    expect(zero?.trustLevel).toBe('low'); // Safe, no border

    const defaultBorder = tokens.find((t) => t.name === 'DEFAULT');
    expect(defaultBorder?.trustLevel).toBe('low'); // Standard pattern

    const two = tokens.find((t) => t.name === '2');
    expect(two?.trustLevel).toBe('low'); // Still safe emphasis

    const four = tokens.find((t) => t.name === '4');
    expect(four?.trustLevel).toBe('medium'); // Noticeable thickness

    const eight = tokens.find((t) => t.name === '8');
    expect(eight?.trustLevel).toBe('medium'); // Strong visual element
  });

  it('includes math relationships showing pixel multipliers', () => {
    const tokens = generateBorderWidthTokens();

    const zero = tokens.find((t) => t.name === '0');
    expect(zero?.mathRelationship).toBe('No border');

    const defaultBorder = tokens.find((t) => t.name === 'DEFAULT');
    expect(defaultBorder?.mathRelationship).toBe('1px (1x pixel)');

    const two = tokens.find((t) => t.name === '2');
    expect(two?.mathRelationship).toBe('2px (2x pixel)');

    const eight = tokens.find((t) => t.name === '8');
    expect(eight?.mathRelationship).toBe('8px (8x pixel)');
  });

  it('validates all border width tokens pass schema validation', () => {
    const tokens = generateBorderWidthTokens();

    for (const token of tokens) {
      expect(() => TokenSchema.parse(token)).not.toThrow();
    }
  });

  it('includes proper applicable components based on thickness', () => {
    const tokens = generateBorderWidthTokens();

    const defaultBorder = tokens.find((t) => t.name === 'DEFAULT');
    expect(defaultBorder?.applicableComponents).toContain('input');
    expect(defaultBorder?.applicableComponents).toContain('card');
    expect(defaultBorder?.applicableComponents).toContain('button');

    const two = tokens.find((t) => t.name === '2');
    expect(two?.applicableComponents).toContain('input'); // Thin borders still good for inputs
    expect(two?.applicableComponents).toContain('card');
    expect(two?.applicableComponents).toContain('button');

    const four = tokens.find((t) => t.name === '4');
    expect(four?.applicableComponents).toContain('decorative');
    expect(four?.applicableComponents).toContain('emphasis');

    const eight = tokens.find((t) => t.name === '8');
    expect(eight?.applicableComponents).toContain('decorative');
    expect(eight?.applicableComponents).toContain('emphasis');
  });

  it('has proper namespace and category', () => {
    const tokens = generateBorderWidthTokens();

    for (const token of tokens) {
      expect(token.namespace).toBe('border');
      expect(token.category).toBe('border-width');
      expect(token.generateUtilityClass).toBe(true);
    }
  });

  it('includes proper consequence levels', () => {
    const tokens = generateBorderWidthTokens();

    const defaultBorder = tokens.find((t) => t.name === 'DEFAULT');
    expect(defaultBorder?.consequence).toBe('reversible'); // Low trust level

    const eight = tokens.find((t) => t.name === '8');
    expect(eight?.consequence).toBe('significant'); // Medium trust level
  });
});
