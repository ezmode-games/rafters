/**
 * Tests for the brand-system classifier (#1403).
 *
 * The classifier runs after ramp detection and signals downstream consumers
 * that multiple complete palettes imply intentional brand design, so the
 * default neutral semantic layer should pause and prompt the user.
 */

import type { Token } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import {
  classifyBrandSystem,
  MIN_BRAND_PALETTES,
} from '../../../src/onboard/importers/brand-system.js';
import type { DetectedPalette } from '../../../src/onboard/importers/ramp-detector.js';

function paletteFor(name: string): DetectedPalette {
  return {
    name,
    scale: 'tailwind',
    steps: [
      { position: '500', token: tokenFor(`${name}-500`) },
      { position: '700', token: tokenFor(`${name}-700`) },
    ],
  };
}

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

describe('classifyBrandSystem', () => {
  it('detects a brand system when at least MIN_BRAND_PALETTES palettes are present', () => {
    const palettes = [
      paletteFor('empire'),
      paletteFor('republic'),
      paletteFor('jedi'),
      paletteFor('sith'),
      paletteFor('hutt'),
      paletteFor('mandalorian'),
      paletteFor('bounty-hunter'),
      paletteFor('gsf'),
    ];
    const tokens = [tokenFor('primary'), tokenFor('accent'), tokenFor('background')];

    const result = classifyBrandSystem(palettes, tokens);

    expect(result.detected).toBe(true);
    expect(result.palettes).toEqual([
      'empire',
      'republic',
      'jedi',
      'sith',
      'hutt',
      'mandalorian',
      'bounty-hunter',
      'gsf',
    ]);
    // Semantic slots are surfaced sorted so the prompt is deterministic
    expect(result.semanticSlots).toEqual(['accent', 'background', 'primary']);
  });

  it('does not detect a brand system with a single palette', () => {
    const palettes = [paletteFor('primary')];
    const tokens = [tokenFor('background'), tokenFor('foreground')];

    const result = classifyBrandSystem(palettes, tokens);

    expect(result.detected).toBe(false);
    expect(result.palettes).toEqual([]);
    expect(result.semanticSlots).toEqual([]);
  });

  it('does not detect a brand system with zero palettes (shadcn-style flat tokens)', () => {
    const palettes: DetectedPalette[] = [];
    const tokens = [tokenFor('primary'), tokenFor('accent'), tokenFor('background')];

    const result = classifyBrandSystem(palettes, tokens);

    expect(result.detected).toBe(false);
  });

  it(`triggers at exactly MIN_BRAND_PALETTES (${MIN_BRAND_PALETTES})`, () => {
    const palettes: DetectedPalette[] = [];
    for (let i = 0; i < MIN_BRAND_PALETTES; i += 1) {
      palettes.push(paletteFor(`brand-${i}`));
    }
    const result = classifyBrandSystem(palettes, []);
    expect(result.detected).toBe(true);
  });

  it(`stays below threshold at MIN_BRAND_PALETTES - 1`, () => {
    const palettes: DetectedPalette[] = [];
    for (let i = 0; i < MIN_BRAND_PALETTES - 1; i += 1) {
      palettes.push(paletteFor(`brand-${i}`));
    }
    const result = classifyBrandSystem(palettes, []);
    expect(result.detected).toBe(false);
  });

  it('flags token names matching the semantic vocabulary exactly', () => {
    const palettes = [paletteFor('empire'), paletteFor('republic')];
    const tokens = [
      tokenFor('primary'),
      tokenFor('accent'),
      tokenFor('destructive'),
      tokenFor('background'),
      tokenFor('border'),
    ];

    const result = classifyBrandSystem(palettes, tokens);

    expect(result.semanticSlots).toEqual([
      'accent',
      'background',
      'border',
      'destructive',
      'primary',
    ]);
  });

  it('flags semantic slot prefixes like primary-foreground', () => {
    const palettes = [paletteFor('empire'), paletteFor('republic')];
    const tokens = [
      tokenFor('primary-foreground'),
      tokenFor('accent-foreground'),
      tokenFor('card-foreground'),
    ];

    const result = classifyBrandSystem(palettes, tokens);

    expect(result.semanticSlots).toEqual([
      'accent-foreground',
      'card-foreground',
      'primary-foreground',
    ]);
  });

  it('does not flag arbitrary token names as semantic slots', () => {
    const palettes = [paletteFor('empire'), paletteFor('republic')];
    const tokens = [tokenFor('spacing-4'), tokenFor('radius-md'), tokenFor('custom-thing')];

    const result = classifyBrandSystem(palettes, tokens);

    expect(result.semanticSlots).toEqual([]);
  });
});
