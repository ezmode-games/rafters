/**
 * Tests for the onboard mapper (#1501).
 *
 * The mapper bridges detection output + the user's brand-import decision
 * into registry-ready tokens and a persisted import config. Init calls
 * it after the prompt; --reset calls it to replay decisions verbatim.
 */

import type { PendingBrandDecision, Token } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { mapOnboardToImport } from '../../src/onboard/mapper.js';
import type { OnboardResult } from '../../src/onboard/orchestrator.js';

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

function paletteFor(name: string): {
  name: string;
  scale: 'tailwind';
  steps: { position: string; token: Token }[];
} {
  return {
    name,
    scale: 'tailwind',
    steps: ['50', '500', '950'].map((position) => ({
      position,
      token: tokenFor(`${name}-${position}`, `oklch(0.5 0.1 ${name.length * 30})`),
    })),
  };
}

function baseResult(overrides: Partial<OnboardResult> = {}): OnboardResult {
  return {
    success: true,
    tokens: [],
    palettes: [],
    brandSystem: { detected: false, palettes: [], semanticSlots: [] },
    references: {},
    source: 'tailwind-v4',
    confidence: 0.95,
    detectedBy: ['@theme block'],
    sourcePaths: ['/project/src/styles/global.css'],
    warnings: [],
    stats: { variablesProcessed: 0, tokensCreated: 0, skipped: 0 },
    ...overrides,
  };
}

const FROZEN_NOW = new Date('2026-05-15T19:30:00.000Z');

describe('mapOnboardToImport', () => {
  it('emits empty importedTokens and an empty-palettes importConfig when no brand system was detected', () => {
    const result = baseResult();

    const mapped = mapOnboardToImport({
      result,
      sourcePath: 'src/styles/global.css',
      now: FROZEN_NOW,
    });

    expect(mapped.importedTokens).toEqual([]);
    expect(mapped.importConfig).toEqual({
      source: 'tailwind-v4',
      sourcePath: 'src/styles/global.css',
      detectedAt: '2026-05-15T19:30:00.000Z',
      keepDefaultSemantics: true,
    });
    expect(mapped.importConfig.palettes).toBeUndefined();
  });

  it('flattens palette steps into importedTokens when the user accepted a brand decision', () => {
    const empire = paletteFor('empire');
    const republic = paletteFor('republic');
    const result = baseResult({
      palettes: [empire, republic],
      brandSystem: {
        detected: true,
        palettes: ['empire', 'republic'],
        semanticSlots: ['primary', 'accent'],
      },
    });
    const decision: PendingBrandDecision = {
      primary: 'empire',
      mode: 'coexisting',
      keepDefaultSemantics: true,
    };

    const mapped = mapOnboardToImport({
      result,
      decision,
      sourcePath: 'src/styles/global.css',
      now: FROZEN_NOW,
    });

    // Two palettes x three steps each
    expect(mapped.importedTokens).toHaveLength(6);
    expect(mapped.importedTokens.map((t) => t.name)).toEqual([
      'empire-50',
      'empire-500',
      'empire-950',
      'republic-50',
      'republic-500',
      'republic-950',
    ]);
    expect(mapped.importConfig.palettes).toEqual({
      primary: 'empire',
      mode: 'coexisting',
      detected: ['empire', 'republic'],
    });
  });

  it('records keepDefaultSemantics: false when the user chose not to apply the default layer', () => {
    const result = baseResult({
      palettes: [paletteFor('empire'), paletteFor('republic')],
      brandSystem: {
        detected: true,
        palettes: ['empire', 'republic'],
        semanticSlots: [],
      },
    });
    const decision: PendingBrandDecision = {
      primary: 'empire',
      mode: 'themes',
      keepDefaultSemantics: false,
    };

    const mapped = mapOnboardToImport({
      result,
      decision,
      sourcePath: 'src/styles/global.css',
      now: FROZEN_NOW,
    });

    expect(mapped.importConfig.keepDefaultSemantics).toBe(false);
    expect(mapped.importConfig.palettes?.mode).toBe('themes');
  });

  it('does NOT emit importedTokens when brand system was detected but no decision arrived', () => {
    // Agent mode hits the brand path without --accept-detected -> caller
    // emits needsDecision and never reaches the mapper. If it does, we
    // refuse to silently flat-lift the palette tokens.
    const result = baseResult({
      palettes: [paletteFor('empire'), paletteFor('republic')],
      brandSystem: {
        detected: true,
        palettes: ['empire', 'republic'],
        semanticSlots: [],
      },
    });

    const mapped = mapOnboardToImport({
      result,
      sourcePath: 'src/styles/global.css',
      now: FROZEN_NOW,
    });

    expect(mapped.importedTokens).toEqual([]);
    // Without a decision the importConfig still records detection
    // happened, but palettes are absent -- nothing was honored.
    expect(mapped.importConfig.palettes).toBeUndefined();
  });

  it('stamps detectedAt from the injected clock', () => {
    const result = baseResult();
    const mapped = mapOnboardToImport({
      result,
      sourcePath: 'x.css',
      now: new Date('2030-01-01T00:00:00.000Z'),
    });
    expect(mapped.importConfig.detectedAt).toBe('2030-01-01T00:00:00.000Z');
  });

  it('falls back to "unknown" source when the result has none', () => {
    const result = baseResult({ source: null });
    const mapped = mapOnboardToImport({
      result,
      sourcePath: 'x.css',
      now: FROZEN_NOW,
    });
    expect(mapped.importConfig.source).toBe('unknown');
  });
});
