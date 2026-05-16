/**
 * Tests for spacing + radius system inference (#1510).
 *
 * The inferrer must recover the underlying math system -- a base unit
 * (px) plus a named progression (linear / musical ratio / mathematical
 * constant) -- from the user's existing CSS values. It must NOT copy
 * raw values; spacing in Rafters is generated, not stored.
 */

import { describe, expect, it } from 'vitest';
import type { CSSVariable } from '../../src/onboard/css-parser.js';
import {
  inferRadiusSystem,
  inferSpacingSystem,
  LOW_CONFIDENCE_THRESHOLD,
  toPx,
  UNUSABLE_CONFIDENCE_THRESHOLD,
} from '../../src/onboard/scale-inference.js';

function variable(name: string, value: string): CSSVariable {
  return {
    name,
    value,
    context: 'root',
    selector: ':root',
    mediaQuery: undefined,
    line: 1,
    column: 1,
  };
}

describe('toPx', () => {
  it('passes through px values', () => {
    expect(toPx('4px')).toBe(4);
    expect(toPx('  16px  ')).toBe(16);
  });

  it('converts rem to px at 16px root', () => {
    expect(toPx('1rem')).toBe(16);
    expect(toPx('0.25rem')).toBe(4);
    expect(toPx('0.5rem')).toBe(8);
  });

  it('converts em to px (treated as root 16)', () => {
    expect(toPx('1em')).toBe(16);
  });

  it('treats unitless numbers as px', () => {
    expect(toPx('8')).toBe(8);
    expect(toPx('0')).toBe(0);
  });

  it('returns null for percentages', () => {
    expect(toPx('50%')).toBeNull();
  });

  it('returns null for calc/var/clamp expressions', () => {
    expect(toPx('calc(1rem + 4px)')).toBeNull();
    expect(toPx('var(--space)')).toBeNull();
    expect(toPx('clamp(1rem, 5vw, 3rem)')).toBeNull();
  });

  it('returns null for garbage', () => {
    expect(toPx('garbage')).toBeNull();
    expect(toPx('')).toBeNull();
  });
});

describe('inferSpacingSystem', () => {
  it('infers Tailwind-style linear progression (base 4px) from --spacing-* values', () => {
    // Tailwind spacing: 0, 0.25rem, 0.5rem, 0.75rem, 1rem, 1.25rem, 1.5rem
    const variables = [
      variable('--spacing-0', '0'),
      variable('--spacing-1', '0.25rem'),
      variable('--spacing-2', '0.5rem'),
      variable('--spacing-3', '0.75rem'),
      variable('--spacing-4', '1rem'),
      variable('--spacing-5', '1.25rem'),
      variable('--spacing-6', '1.5rem'),
    ];

    const result = inferSpacingSystem(variables);
    expect(result).not.toBeNull();
    if (!result) return;
    expect(result.base).toBe(4);
    expect(result.progressionRatio).toBe('linear');
    expect(result.confidence).toBeGreaterThan(0.9);
  });

  it('infers a minor-third progression from base 4px', () => {
    // base 4, ratio 6/5 = 1.2 -> [4, 4.8, 5.76, 6.912, 8.2944, ...]
    const variables = [
      variable('--spacing-xs', '4px'),
      variable('--spacing-sm', '4.8px'),
      variable('--spacing-md', '5.76px'),
      variable('--spacing-lg', '6.912px'),
      variable('--spacing-xl', '8.2944px'),
    ];

    const result = inferSpacingSystem(variables);
    expect(result).not.toBeNull();
    if (!result) return;
    expect(result.base).toBe(4);
    expect(result.progressionRatio).toBe('minor-third');
    expect(result.confidence).toBeGreaterThan(0.9);
  });

  it('infers a golden-ratio progression', () => {
    // base 4, ratio phi ~ 1.618 -> [4, 6.472, 10.47, 16.94, 27.41]
    const variables = [
      variable('--spacing-1', '4px'),
      variable('--spacing-2', '6.472px'),
      variable('--spacing-3', '10.47px'),
      variable('--spacing-4', '16.94px'),
      variable('--spacing-5', '27.41px'),
    ];

    const result = inferSpacingSystem(variables);
    expect(result).not.toBeNull();
    if (!result) return;
    expect(result.base).toBe(4);
    expect(['golden', 'golden-ratio']).toContain(result.progressionRatio);
    expect(result.confidence).toBeGreaterThan(0.85);
  });

  it('returns null when no spacing-related variables are present', () => {
    const result = inferSpacingSystem([
      variable('--color-primary', '#000'),
      variable('--font-size', '16px'),
    ]);
    expect(result).toBeNull();
  });

  it('returns null when all values are unparseable', () => {
    const result = inferSpacingSystem([
      variable('--spacing-fluid', 'clamp(1rem, 5vw, 3rem)'),
      variable('--spacing-percent', '50%'),
    ]);
    expect(result).toBeNull();
  });

  it('returns inference with low confidence on truly random values', () => {
    // Values picked to avoid accidentally fitting any DEFAULT_RATIO well.
    // Spread that doesn't match linear, musical ratios, or constants.
    const variables = [
      variable('--spacing-foo', '3px'),
      variable('--spacing-bar', '7px'),
      variable('--spacing-baz', '11px'),
      variable('--spacing-qux', '19px'),
    ];
    const result = inferSpacingSystem(variables);
    expect(result).not.toBeNull();
    if (!result) return;
    // Noise lands below the LOW_CONFIDENCE threshold; the caller falls back
    expect(result.confidence).toBeLessThan(LOW_CONFIDENCE_THRESHOLD);
  });

  it('the unusable threshold is below the low-confidence threshold', () => {
    // Sanity guard for callers comparing against both
    expect(UNUSABLE_CONFIDENCE_THRESHOLD).toBeLessThan(LOW_CONFIDENCE_THRESHOLD);
  });
});

describe('inferRadiusSystem', () => {
  it('infers a single-value radius (e.g. shadcn --radius: 0.5rem)', () => {
    const variables = [variable('--radius', '0.5rem')];
    const result = inferRadiusSystem(variables);
    expect(result).not.toBeNull();
    if (!result) return;
    expect(result.base).toBe(8);
    expect(result.samples).toBe(1);
  });

  it('infers a Tailwind radius linear scale', () => {
    // Tailwind: --radius-sm 0.125rem, --radius-md 0.375rem, --radius-lg 0.5rem
    // 2, 6, 8 px -- not exact linear from 2, but close enough that linear
    // beats most musical ratios
    const variables = [
      variable('--radius-sm', '0.125rem'),
      variable('--radius-md', '0.375rem'),
      variable('--radius-lg', '0.5rem'),
    ];
    const result = inferRadiusSystem(variables);
    expect(result).not.toBeNull();
    if (!result) return;
    expect(result.base).toBe(2);
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('returns null when no radius-related variables', () => {
    expect(
      inferRadiusSystem([variable('--spacing-1', '4px'), variable('--color', '#000')]),
    ).toBeNull();
  });

  it('matches `--rounded-*` names too', () => {
    const variables = [variable('--rounded-sm', '2px'), variable('--rounded-md', '4px')];
    const result = inferRadiusSystem(variables);
    expect(result).not.toBeNull();
    if (!result) return;
    expect(result.samples).toBeGreaterThan(0);
  });
});
