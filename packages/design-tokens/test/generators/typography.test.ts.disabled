/**
 * Typography Generator Tests
 *
 * Tests for font-size and line-height token generation
 */

import { describe, expect, it } from 'vitest';
import { generateTypographyScale } from '../../src/generators/typography.js';
import { TokenSchema } from '../../src/index.js';

describe('generateTypographyScale', () => {
  it('generates golden ratio typography scale', () => {
    const tokens = generateTypographyScale('golden', 1, false);

    // Should have font-size + line-height tokens
    const fontSizeTokens = tokens.filter((t) => t.category === 'font-size');
    const lineHeightTokens = tokens.filter((t) => t.category === 'line-height');

    expect(fontSizeTokens).toHaveLength(13); // xs through 9xl
    expect(lineHeightTokens).toHaveLength(13);

    const base = fontSizeTokens.find((t) => t.name === 'text-base');
    expect(base?.value).toBe('1rem'); // base size

    const lg = fontSizeTokens.find((t) => t.name === 'text-lg');
    expect(Number.parseFloat(lg?.value || '0')).toBeCloseTo(1.618, 2); // 1 * φ^1

    // Check line height pairing
    const leadingBase = lineHeightTokens.find((t) => t.name === 'leading-base');
    expect(leadingBase?.pairedWith).toContain('text-base');
  });

  it('generates major-third typography scale', () => {
    const tokens = generateTypographyScale('major-third', 1, false);

    const lg = tokens.filter((t) => t.category === 'font-size').find((t) => t.name === 'text-lg');
    expect(Number.parseFloat(lg?.value || '0')).toBeCloseTo(1.25, 2); // 1 * 1.25^1
  });

  it('generates responsive typography variants', () => {
    const tokens = generateTypographyScale('golden', 1, true);

    // Should have base + responsive variants for both font-size and line-height
    expect(tokens.length).toBeGreaterThan(50);

    const smResponsive = tokens.find((t) => t.name === 'sm-text-lg');
    expect(smResponsive).toBeDefined();
    expect(smResponsive?.category).toBe('font-size');
    expect(smResponsive?.viewportAware).toBe(true);

    const containerResponsive = tokens.find((t) => t.name === '@md-text-lg');
    expect(containerResponsive).toBeDefined();
    expect(containerResponsive?.containerQueryAware).toBe(true);
  });

  it('calculates appropriate line heights', () => {
    const tokens = generateTypographyScale('golden', 1, false);

    const lineHeights = tokens.filter((t) => t.category === 'line-height');

    // Small text should have higher line height
    const leadingXs = lineHeights.find((t) => t.name === 'leading-xs');
    expect(Number.parseFloat(leadingXs?.value || '0')).toBe(1.6);

    // Base text should have medium line height
    const leadingBase = lineHeights.find((t) => t.name === 'leading-base');
    expect(Number.parseFloat(leadingBase?.value || '0')).toBe(1.5);

    // Large text should have tighter line height
    const leading6xl = lineHeights.find((t) => t.name === 'leading-6xl');
    expect(Number.parseFloat(leading6xl?.value || '0')).toBe(1.2);
  });

  it('validates token schema compliance', () => {
    const tokens = generateTypographyScale('golden', 1, false);

    for (const token of tokens) {
      expect(() => TokenSchema.parse(token)).not.toThrow();
    }
  });

  it('tracks scale positions correctly', () => {
    const tokens = generateTypographyScale('golden', 1, false);
    const fontTokens = tokens.filter((t) => t.category === 'font-size');

    fontTokens.forEach((token, index) => {
      expect(token.scalePosition).toBe(index);
    });
  });
});
