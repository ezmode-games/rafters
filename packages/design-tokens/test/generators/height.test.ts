/**
 * Height Generator Tests
 *
 * Tests for height token generation with accessibility validation
 */

import { describe, expect, it } from 'vitest';
import { generateHeightScale } from '../../src/generators/height.js';
import { TokenSchema } from '../../src/index.js';

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

  it('validates token schema compliance', () => {
    const tokens = generateHeightScale('linear', 2.5, 1.25, false);

    for (const token of tokens) {
      expect(() => TokenSchema.parse(token)).not.toThrow();
    }
  });
});
