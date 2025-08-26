/**
 * Design Token Generator Tests
 *
 * Tests for mathematical token generation functions
 */

import { describe, expect, it } from 'vitest';
import {
  TokenSchema,
  generateDepthScale,
  generateHeightScale,
  generateSpacingScale,
  generateTypographyScale,
} from '../src/index.js';

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
});

describe('generateDepthScale', () => {
  it('generates shadow and semantic z-index tokens', () => {
    const tokens = generateDepthScale('linear', 10);

    // Should have shadow tokens + z-index tokens
    expect(tokens.length).toBeGreaterThan(10);

    // Check shadow tokens (now use simple names, filter by category)
    const shadowSm = tokens.find((t) => t.name === 'sm' && t.category === 'shadow');
    expect(shadowSm).toBeDefined();
    expect(shadowSm?.category).toBe('shadow');
    expect(shadowSm?.value).toContain('rgb(0 0 0');

    // Check semantic z-index tokens
    const zSticky = tokens.find((t) => t.name === 'sticky' && t.category === 'z-index');
    expect(zSticky).toBeDefined();
    expect(zSticky?.category).toBe('z-index');
    expect(zSticky?.value).toBe('10');
    expect(zSticky?.semanticMeaning).toContain('Sticky elements');

    const zModal = tokens.find((t) => t.name === 'modal' && t.category === 'z-index');
    expect(zModal?.value).toBe('1000');
    expect(zModal?.semanticMeaning).toContain('Modal dialogs');
  });

  it('generates semantic z-index layers', () => {
    const tokens = generateDepthScale('exponential', 10);

    // Test semantic layer hierarchy (filter by z-index category)
    const zBase = tokens.find((t) => t.name === 'base' && t.category === 'z-index');
    expect(zBase?.value).toBe('0'); // Base layer

    const zDropdown = tokens.find((t) => t.name === 'dropdown' && t.category === 'z-index');
    expect(zDropdown?.value).toBe('100'); // Dropdown layer

    const zTooltip = tokens.find((t) => t.name === 'tooltip' && t.category === 'z-index');
    expect(zTooltip?.value).toBe('50000'); // Highest priority

    // Verify semantic meanings
    expect(zDropdown?.semanticMeaning).toContain('Dropdowns and select menus');
    expect(zTooltip?.semanticMeaning).toContain('Tooltips (highest priority)');
  });
});

describe('generateHeightScale', () => {
  it('generates linear height scale', () => {
    const tokens = generateHeightScale('linear', 2.5, 1.25, false);

    expect(tokens).toHaveLength(8); // xs, sm, md, lg, xl, 2xl, 3xl, 4xl

    const xs = tokens.find((t) => t.name === 'h-xs');
    expect(xs?.value).toBe('2.5rem'); // baseUnit + (0 * 0.5)

    const sm = tokens.find((t) => t.name === 'h-sm');
    expect(sm?.value).toBe('3rem'); // baseUnit + (1 * 0.5)

    const md = tokens.find((t) => t.name === 'h-md');
    expect(md?.value).toBe('3.5rem'); // baseUnit + (2 * 0.5)

    // Check touch target validation
    expect(xs?.touchTargetSize).toBe(40); // 2.5rem * 16px
    expect(md?.touchTargetSize).toBe(56); // 3.5rem * 16px
  });

  it('generates golden ratio height scale', () => {
    const tokens = generateHeightScale('golden', 2.5, 1.25, false);

    const xs = tokens.find((t) => t.name === 'h-xs');
    expect(Number.parseFloat(xs?.value || '0')).toBeCloseTo(2.5, 1);

    const sm = tokens.find((t) => t.name === 'h-sm');
    expect(Number.parseFloat(sm?.value || '0')).toBeCloseTo(3.18, 1); // 2.5 * φ^0.5
  });

  it('generates responsive height variants', () => {
    const tokens = generateHeightScale('linear', 2.5, 1.25, true);

    // Should have base + responsive variants
    expect(tokens.length).toBeGreaterThan(24); // 8 base + viewport variants + container variants

    const smResponsive = tokens.find((t) => t.name === 'sm-h-md');
    expect(smResponsive).toBeDefined();
    expect(smResponsive?.viewportAware).toBe(true);

    const containerResponsive = tokens.find((t) => t.name === '@lg-h-md');
    expect(containerResponsive).toBeDefined();
    expect(containerResponsive?.containerQueryAware).toBe(true);
  });
});

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
});

describe('Token validation', () => {
  it('all generated tokens pass schema validation', () => {
    const spacingTokens = generateSpacingScale('linear', 4, 1.25, 2, false);
    const depthTokens = generateDepthScale('linear', 10);
    const heightTokens = generateHeightScale('linear', 2.5, 1.25, false);
    const typographyTokens = generateTypographyScale('golden', 1, false);

    const allTokens = [...spacingTokens, ...depthTokens, ...heightTokens, ...typographyTokens];

    allTokens.forEach((token, index) => {
      expect(
        () => TokenSchema.parse(token),
        `Token at index ${index} failed validation: ${JSON.stringify(token)}`
      ).not.toThrow();
    });
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

describe('Mathematical relationships', () => {
  it('preserves mathematical relationships in generated tokens', () => {
    const tokens = generateSpacingScale('golden', 4, 1.25, 3, false);

    for (const token of tokens) {
      if (token.name !== '0') {
        expect(token.mathRelationship).toBeDefined();
        expect(token.mathRelationship).toContain('1.25^'); // Should show the multiplier formula
      }
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
