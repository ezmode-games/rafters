/**
 * Tests for the shared ramp detector used by importers to recover palette
 * structure from CSS custom properties (#1402).
 */

import type { Token } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import {
  detectRamps,
  MIN_RAMP_STEPS,
  TAILWIND_RAMP_POSITIONS,
} from '../../../src/onboard/importers/ramp-detector.js';

function tokenFor(name: string, value = 'oklch(0.5 0.1 0)'): Token {
  return {
    name,
    value,
    category: 'color',
    namespace: 'color',
    userOverride: null,
    semanticMeaning: `Imported from CSS variable --${name}`,
    usageContext: ['light mode', 'default'],
    containerQueryAware: true,
  };
}

function fullRamp(family: string): Token[] {
  return TAILWIND_RAMP_POSITIONS.map((position, i) =>
    tokenFor(`${family}-${position}`, `oklch(${(0.97 - i * 0.07).toFixed(2)} 0.1 250)`),
  );
}

describe('detectRamps', () => {
  it('groups huttspawn 8 faction scales into palettes with zero flat color tokens', () => {
    const families = [
      'empire',
      'republic',
      'jedi',
      'sith',
      'hutt',
      'mandalorian',
      'bounty-hunter',
      'gsf',
    ];
    const tokens = families.flatMap(fullRamp);

    const result = detectRamps(tokens);

    expect(result.palettes).toHaveLength(8);
    expect(result.remaining).toHaveLength(0);

    for (const family of families) {
      const palette = result.palettes.find((p) => p.name === family);
      expect(palette, `palette ${family} missing`).toBeDefined();
      expect(palette?.steps).toHaveLength(11);
      expect(palette?.scale).toBe('tailwind');
    }
  });

  it('keeps a partial 3-step ramp flat instead of promoting it to a palette', () => {
    const tokens = [tokenFor('cherry-100'), tokenFor('cherry-500'), tokenFor('cherry-900')];

    const result = detectRamps(tokens);

    expect(result.palettes).toHaveLength(0);
    expect(result.remaining).toHaveLength(3);
    expect(result.remaining.map((t) => t.name)).toEqual(['cherry-100', 'cherry-500', 'cherry-900']);
  });

  it('mixes one full ramp with unrelated flat tokens correctly', () => {
    const tokens = [
      ...fullRamp('empire'),
      tokenFor('background'),
      tokenFor('foreground'),
      tokenFor('border'),
      tokenFor('radius-md', '0.5rem'),
      tokenFor('spacing-4', '1rem'),
    ];

    const result = detectRamps(tokens);

    expect(result.palettes).toHaveLength(1);
    expect(result.palettes[0]?.name).toBe('empire');
    expect(result.palettes[0]?.steps).toHaveLength(11);

    expect(result.remaining.map((t) => t.name)).toEqual([
      'background',
      'foreground',
      'border',
      'radius-md',
      'spacing-4',
    ]);
  });

  it('emits palette steps ordered ascending by Tailwind position', () => {
    // Insert in reversed and shuffled order to verify sort
    const order = ['950', '50', '500', '100', '900', '200', '800', '300', '700', '400', '600'];
    const tokens = order.map((p) => tokenFor(`hutt-${p}`));

    const { palettes } = detectRamps(tokens);
    const palette = palettes.find((p) => p.name === 'hutt');
    expect(palette?.steps.map((s) => s.position)).toEqual([
      '50',
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      '900',
      '950',
    ]);
  });

  it(`detects a ramp at the exact MIN_RAMP_STEPS threshold (${MIN_RAMP_STEPS} steps)`, () => {
    const positions = TAILWIND_RAMP_POSITIONS.slice(0, MIN_RAMP_STEPS);
    const tokens = positions.map((p) => tokenFor(`brand-${p}`));

    const { palettes, remaining } = detectRamps(tokens);
    expect(palettes).toHaveLength(1);
    expect(palettes[0]?.steps).toHaveLength(MIN_RAMP_STEPS);
    expect(remaining).toHaveLength(0);
  });

  it(`leaves a ramp at MIN_RAMP_STEPS - 1 flat`, () => {
    const positions = TAILWIND_RAMP_POSITIONS.slice(0, MIN_RAMP_STEPS - 1);
    const tokens = positions.map((p) => tokenFor(`brand-${p}`));

    const { palettes, remaining } = detectRamps(tokens);
    expect(palettes).toHaveLength(0);
    expect(remaining).toHaveLength(MIN_RAMP_STEPS - 1);
  });

  it('ignores spacing-style numeric suffixes (4, 8, 16) that are not Tailwind color positions', () => {
    // spacing-1..spacing-12 is 12 vars but none of those positions are Tailwind color stops
    const tokens = Array.from({ length: 12 }, (_, i) => tokenFor(`spacing-${i + 1}`));

    const { palettes, remaining } = detectRamps(tokens);
    expect(palettes).toHaveLength(0);
    expect(remaining).toHaveLength(12);
  });

  it('preserves the original Token reference in each palette step', () => {
    const empireTokens = fullRamp('empire');
    const { palettes } = detectRamps(empireTokens);
    const palette = palettes[0];
    expect(palette).toBeDefined();

    const step500 = palette?.steps.find((s) => s.position === '500');
    const original500 = empireTokens.find((t) => t.name === 'empire-500');
    expect(step500?.token).toBe(original500);
  });

  it('handles hyphenated family names like bounty-hunter', () => {
    const tokens = fullRamp('bounty-hunter');
    const { palettes } = detectRamps(tokens);
    expect(palettes).toHaveLength(1);
    expect(palettes[0]?.name).toBe('bounty-hunter');
  });

  it('returns deterministic palette ordering (alphabetical by name)', () => {
    const tokens = [...fullRamp('zulu'), ...fullRamp('alpha'), ...fullRamp('mike')];
    const { palettes } = detectRamps(tokens);
    expect(palettes.map((p) => p.name)).toEqual(['alpha', 'mike', 'zulu']);
  });
});
