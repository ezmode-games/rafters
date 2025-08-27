/**
 * Spacing Generator Tests
 *
 * Tests for mathematical spacing token generation
 */

import { describe, expect, it } from 'vitest';
import { generateSpacingScale } from '../../src/generators/spacing.js';
import { TokenSchema } from '../../src/index.js';

describe('generateSpacingScale', () => {
  it('generates linear spacing scale without responsive variants', () => {
    const tokens = generateSpacingScale('linear', 4, 1.25, 3, false);

    expect(tokens).toHaveLength(4); // 0, 1, 2, 3
    expect(tokens[0].name).toBe('0');
    expect(tokens[0].value).toBe('0rem');
    expect(tokens[1].name).toBe('1');
    expect(tokens[1].value).toBe('4rem'); // 4 * 1 = 4rem
    expect(tokens[2].name).toBe('2');
    expect(tokens[2].value).toBe('8rem'); // 4 * 2 = 8rem

    // Check token structure
    expect(tokens[1].category).toBe('spacing');
    expect(tokens[1].namespace).toBe('spacing');
    expect(tokens[1].mathRelationship).toBe('4 * 1');
    expect(tokens[1].scalePosition).toBe(1);
  });

  it('generates golden ratio spacing scale', () => {
    const tokens = generateSpacingScale('golden', 4, 1.25, 2, false);

    expect(tokens).toHaveLength(3); // 0, 1, 2
    expect(tokens[0].name).toBe('0');
    expect(tokens[1].name).toBe('golden-1');
    expect(tokens[2].name).toBe('golden-2');

    // Golden ratio: φ ≈ 1.618
    expect(Number.parseFloat(tokens[1].value)).toBeCloseTo(4, 2); // 4 * φ^0 = 4rem
    expect(Number.parseFloat(tokens[2].value)).toBeCloseTo(6.472, 2); // 4 * φ^1 ≈ 6.472rem
  });

  it('generates custom spacing scale with multiplier', () => {
    const tokens = generateSpacingScale('custom', 4, 1.5, 2, false);

    expect(tokens[1].name).toBe('scale-1');
    expect(tokens[2].name).toBe('scale-2');
    expect(Number.parseFloat(tokens[1].value)).toBeCloseTo(4, 2); // 4 * 1.5^0 = 4rem
    expect(Number.parseFloat(tokens[2].value)).toBeCloseTo(6, 2); // 4 * 1.5^1 = 6rem
  });

  it('generates responsive variants when enabled', () => {
    const tokens = generateSpacingScale('linear', 4, 1.25, 1, true);

    // Should have: base(2) + viewport(8) + container(10) = 20 tokens
    // Base: 0, 1
    // Viewport: sm-0, sm-1, md-0, md-1, lg-0, lg-1, xl-0, xl-1
    // Container: @xs-0, @xs-1, @sm-0, @sm-1, @md-0, @md-1, @lg-0, @lg-1, @xl-0, @xl-1
    expect(tokens.length).toBeGreaterThan(10);

    // Check viewport variants exist
    const smVariant = tokens.find((t) => t.name === 'sm-1');
    expect(smVariant).toBeDefined();
    expect(smVariant?.viewportAware).toBe(true);
    expect(smVariant?.generatedFrom).toBe('1');

    // Check container variants exist
    const containerVariant = tokens.find((t) => t.name === '@md-1');
    expect(containerVariant).toBeDefined();
    expect(containerVariant?.containerQueryAware).toBe(true);
    expect(containerVariant?.generatedFrom).toBe('1');
  });

  it('validates token schema compliance', () => {
    const tokens = generateSpacingScale('linear', 4, 1.25, 1, false);

    for (const token of tokens) {
      expect(() => TokenSchema.parse(token)).not.toThrow();
    }
  });

  it('preserves mathematical relationships in generated tokens', () => {
    const tokens = generateSpacingScale('golden', 4, 1.25, 3, false);

    for (const token of tokens) {
      if (token.name !== '0') {
        expect(token.mathRelationship).toBeDefined();
        expect(token.mathRelationship).toContain('1.25^'); // Should show the multiplier formula
      }
    }
  });

  it('responsive tokens have proper metadata', () => {
    const tokens = generateSpacingScale('linear', 4, 1.25, 2, true);

    const baseToken = tokens.find((t) => t.name === '1');
    expect(baseToken?.containerQueryAware).toBe(true);
    expect(baseToken?.viewportAware).toBe(true);
    expect(baseToken?.generatedFrom).toBeUndefined();

    const responsiveToken = tokens.find((t) => t.name === 'md-1');
    expect(responsiveToken?.viewportAware).toBe(true);
    expect(responsiveToken?.generatedFrom).toBe('1');

    const containerToken = tokens.find((t) => t.name === '@lg-1');
    expect(containerToken?.containerQueryAware).toBe(true);
    expect(containerToken?.generatedFrom).toBe('1');
  });
});
