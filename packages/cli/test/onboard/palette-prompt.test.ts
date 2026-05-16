/**
 * Tests for the per-palette semantic-family assignment walk (#1509).
 *
 * The walk pairs each detected palette with one of the eleven canonical
 * `SemanticColorSystem` slots, dropping each slot from the offered list
 * once it's used. Surface tokens that re-derive (background, foreground,
 * card, popover, border, input, ring, etc.) are intentionally NOT in the
 * offered list -- they follow the family they reference.
 */

import type { Token } from '@rafters/shared';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DetectedPalette } from '../../src/onboard/importers/ramp-detector.js';
import {
  buildPaletteNeedsDecision,
  SEMANTIC_FAMILY_SLOTS,
  walkPaletteAssignments,
} from '../../src/onboard/palette-prompt.js';

const inquirerMock = vi.hoisted(() => ({
  select: vi.fn(),
}));

vi.mock('@inquirer/prompts', () => ({
  select: inquirerMock.select,
}));

function tokenFor(name: string): Token {
  return {
    name,
    value: 'oklch(0.5 0.1 0)',
    category: 'color',
    namespace: 'color',
    userOverride: null,
    semanticMeaning: `Imported from CSS variable --${name}`,
    usageContext: ['light mode', 'default'],
    containerQueryAware: true,
  };
}

function paletteFor(name: string): DetectedPalette {
  return {
    name,
    scale: 'tailwind',
    steps: [
      { position: '50', token: tokenFor(`${name}-50`) },
      { position: '500', token: tokenFor(`${name}-500`) },
      { position: '950', token: tokenFor(`${name}-950`) },
    ],
  };
}

beforeEach(() => {
  inquirerMock.select.mockReset();
});
afterEach(() => {
  vi.clearAllMocks();
});

describe('SEMANTIC_FAMILY_SLOTS', () => {
  it('exposes the eleven canonical SemanticColorSystem slots in canonical order', () => {
    expect(SEMANTIC_FAMILY_SLOTS).toEqual([
      'primary',
      'secondary',
      'tertiary',
      'accent',
      'highlight',
      'neutral',
      'muted',
      'success',
      'warning',
      'destructive',
      'info',
    ]);
  });

  it('does NOT include derived surface tokens (background/foreground/card/popover/border/input/ring)', () => {
    const derivedSurfaceNames = [
      'background',
      'foreground',
      'card',
      'card-foreground',
      'popover',
      'popover-foreground',
      'border',
      'input',
      'ring',
    ];
    for (const name of derivedSurfaceNames) {
      expect(SEMANTIC_FAMILY_SLOTS).not.toContain(name as never);
    }
  });
});

describe('walkPaletteAssignments -- agent + --accept-detected', () => {
  it('assigns palettes to canonical slots in detection order', async () => {
    const result = await walkPaletteAssignments(
      [paletteFor('empire'), paletteFor('republic'), paletteFor('jedi')],
      { agent: true, acceptDetected: true },
    );

    expect(result.assignments).toEqual([
      { family: 'empire', slot: 'primary' },
      { family: 'republic', slot: 'secondary' },
      { family: 'jedi', slot: 'tertiary' },
    ]);
    expect(result.usedSlots).toEqual(['primary', 'secondary', 'tertiary']);
    expect(result.skippedFamilies).toEqual([]);
    expect(inquirerMock.select).not.toHaveBeenCalled();
  });

  it('marks surplus palettes skipped when palettes exceed eleven', async () => {
    const palettes = Array.from({ length: 13 }, (_, i) => paletteFor(`p${i}`));
    const result = await walkPaletteAssignments(palettes, {
      agent: true,
      acceptDetected: true,
    });

    expect(result.usedSlots).toHaveLength(11);
    expect(result.skippedFamilies).toEqual(['p11', 'p12']);
    const lastAssigned = result.assignments[10];
    expect(lastAssigned).toEqual({ family: 'p10', slot: 'info' });
  });

  it('returns empty result when no palettes detected', async () => {
    const result = await walkPaletteAssignments([], { agent: true, acceptDetected: true });
    expect(result).toEqual({ assignments: [], usedSlots: [], skippedFamilies: [] });
  });

  it('throws when reached in agent mode without --accept-detected', async () => {
    await expect(
      walkPaletteAssignments([paletteFor('empire')], { agent: true, acceptDetected: false }),
    ).rejects.toThrow(/agent mode without --accept-detected/);
  });
});

describe('walkPaletteAssignments -- interactive', () => {
  it('walks select per palette and shrinks the offered list as slots are used', async () => {
    inquirerMock.select
      .mockResolvedValueOnce('primary')
      .mockResolvedValueOnce('accent')
      .mockResolvedValueOnce('--skip--');

    const result = await walkPaletteAssignments(
      [paletteFor('empire'), paletteFor('republic'), paletteFor('jedi')],
      { agent: false, acceptDetected: false },
    );

    expect(inquirerMock.select).toHaveBeenCalledTimes(3);

    // First call offers all 11 + skip
    const firstChoices = (
      inquirerMock.select.mock.calls[0]?.[0] as { choices: { value: string }[] }
    ).choices;
    const firstValues = firstChoices.map((c) => c.value);
    expect(firstValues).toContain('primary');
    expect(firstValues).toContain('info');
    expect(firstValues).toContain('--skip--');
    expect(firstValues.filter((v) => v !== '--skip--')).toHaveLength(11);

    // Second call should drop `primary`
    const secondChoices = (
      inquirerMock.select.mock.calls[1]?.[0] as { choices: { value: string }[] }
    ).choices;
    expect(secondChoices.map((c) => c.value)).not.toContain('primary');
    expect(secondChoices.filter((c) => c.value !== '--skip--')).toHaveLength(10);

    // Third call should drop both `primary` and `accent`
    const thirdChoices = (
      inquirerMock.select.mock.calls[2]?.[0] as { choices: { value: string }[] }
    ).choices;
    expect(thirdChoices.map((c) => c.value)).not.toContain('primary');
    expect(thirdChoices.map((c) => c.value)).not.toContain('accent');

    expect(result.assignments).toEqual([
      { family: 'empire', slot: 'primary' },
      { family: 'republic', slot: 'accent' },
      { family: 'jedi', skipped: true },
    ]);
    expect(result.usedSlots).toEqual(['primary', 'accent']);
    expect(result.skippedFamilies).toEqual(['jedi']);
  });

  it('skipping a palette does not consume a slot', async () => {
    inquirerMock.select.mockResolvedValueOnce('--skip--').mockResolvedValueOnce('primary');

    const result = await walkPaletteAssignments([paletteFor('skipme'), paletteFor('takeme')], {
      agent: false,
      acceptDetected: false,
    });

    expect(result.assignments).toEqual([
      { family: 'skipme', skipped: true },
      { family: 'takeme', slot: 'primary' },
    ]);
    // Second prompt should still have all 11 available since skipme didn't consume a slot
    const secondChoices = (
      inquirerMock.select.mock.calls[1]?.[0] as { choices: { value: string }[] }
    ).choices;
    expect(secondChoices.filter((c) => c.value !== '--skip--')).toHaveLength(11);
  });

  it('handles the eight-faction Huttspawn case (walks 8 prompts, fills first 8 canonical slots)', async () => {
    const factions = [
      'empire',
      'republic',
      'jedi',
      'sith',
      'hutt',
      'mandalorian',
      'bounty-hunter',
      'gsf',
    ];
    // Each faction picks the canonical-order next-available slot
    for (const slot of SEMANTIC_FAMILY_SLOTS.slice(0, 8)) {
      inquirerMock.select.mockResolvedValueOnce(slot);
    }

    const result = await walkPaletteAssignments(factions.map(paletteFor), {
      agent: false,
      acceptDetected: false,
    });

    expect(inquirerMock.select).toHaveBeenCalledTimes(8);
    expect(result.usedSlots).toEqual([
      'primary',
      'secondary',
      'tertiary',
      'accent',
      'highlight',
      'neutral',
      'muted',
      'success',
    ]);
    expect(result.skippedFamilies).toEqual([]);
  });

  it('propagates ExitPromptError so the caller can map it to declined', async () => {
    const exitError = Object.assign(new Error('User force closed the prompt'), {
      name: 'ExitPromptError',
    });
    inquirerMock.select.mockRejectedValueOnce(exitError);

    await expect(
      walkPaletteAssignments([paletteFor('empire')], { agent: false, acceptDetected: false }),
    ).rejects.toThrow(/User force closed/);
  });
});

describe('buildPaletteNeedsDecision', () => {
  it('emits a structured payload listing palettes and canonical slots', () => {
    const payload = buildPaletteNeedsDecision([paletteFor('empire'), paletteFor('republic')]);

    expect(payload.type).toBe('palette-needs-decision');
    expect(payload.palettes).toEqual(['empire', 'republic']);
    expect(payload.semanticFamilySlots).toEqual(SEMANTIC_FAMILY_SLOTS);
    expect(payload.message).toMatch(/2 palettes/);
  });

  it('uses the singular form for one palette', () => {
    const payload = buildPaletteNeedsDecision([paletteFor('only')]);
    expect(payload.message).toMatch(/1 palette\b/);
  });
});
