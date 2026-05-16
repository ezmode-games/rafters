/**
 * Tests for the brand-import interactive prompt (#1401).
 *
 * The prompt module itself is tested in isolation here -- mocking
 * `@inquirer/prompts` lets us drive the flow deterministically. The
 * command-level integration (when does the prompt run, when is it
 * skipped, how does --assume-brand override it) lives in the import
 * command tests.
 */

import type { PendingBrandSystem } from '@rafters/shared';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildNeedsDecision,
  parseAssumeBrand,
  promptBrandImport,
} from '../../src/onboard/interactive-prompt.js';

const inquirerMock = vi.hoisted(() => ({
  confirm: vi.fn(),
  select: vi.fn(),
}));

vi.mock('@inquirer/prompts', () => ({
  confirm: inquirerMock.confirm,
  select: inquirerMock.select,
}));

function brandSystemFor(palettes: string[], semanticSlots: string[] = []): PendingBrandSystem {
  return { detected: true, palettes, semanticSlots };
}

describe('parseAssumeBrand', () => {
  it('returns null when the flag is absent', () => {
    expect(parseAssumeBrand(undefined)).toBeNull();
  });

  it('returns "flat" for --assume-brand=flat', () => {
    expect(parseAssumeBrand('flat')).toBe('flat');
  });

  it('parses primary:<name> into a decision with coexisting/keepDefaultSemantics defaults', () => {
    expect(parseAssumeBrand('primary:empire')).toEqual({
      primary: 'empire',
      mode: 'coexisting',
      keepDefaultSemantics: true,
    });
  });

  it('handles hyphenated palette names (e.g. bounty-hunter)', () => {
    expect(parseAssumeBrand('primary:bounty-hunter')).toEqual({
      primary: 'bounty-hunter',
      mode: 'coexisting',
      keepDefaultSemantics: true,
    });
  });

  it('throws on a malformed value', () => {
    expect(() => parseAssumeBrand('garbage')).toThrow(/Unrecognised --assume-brand/);
    expect(() => parseAssumeBrand('primary:')).toThrow(/Unrecognised --assume-brand/);
    expect(() => parseAssumeBrand('themes')).toThrow(/Unrecognised --assume-brand/);
  });
});

describe('buildNeedsDecision', () => {
  it('emits a structured payload describing what would be asked', () => {
    const brandSystem = brandSystemFor(
      ['empire', 'republic', 'jedi'],
      ['primary', 'accent', 'background'],
    );

    const payload = buildNeedsDecision(brandSystem);

    expect(payload.type).toBe('brand-needs-decision');
    expect(payload.palettes).toEqual(['empire', 'republic', 'jedi']);
    expect(payload.semanticSlots).toEqual(['primary', 'accent', 'background']);
    expect(payload.questions.map((q) => q.key)).toEqual([
      'primary',
      'mode',
      'keepDefaultSemantics',
    ]);

    const primaryQ = payload.questions.find((q) => q.key === 'primary');
    expect(primaryQ?.options).toEqual(['empire', 'republic', 'jedi']);
  });
});

describe('promptBrandImport', () => {
  beforeEach(() => {
    inquirerMock.select.mockReset();
    inquirerMock.confirm.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('walks the three questions and returns the user choices', async () => {
    const brandSystem = brandSystemFor(['empire', 'republic', 'jedi']);

    inquirerMock.select
      .mockResolvedValueOnce('empire') // primary
      .mockResolvedValueOnce('coexisting'); // mode
    inquirerMock.confirm.mockResolvedValueOnce(true); // keepDefaultSemantics

    const decision = await promptBrandImport(brandSystem);

    expect(decision).toEqual({
      primary: 'empire',
      mode: 'coexisting',
      keepDefaultSemantics: true,
    });
    expect(inquirerMock.select).toHaveBeenCalledTimes(2);
    expect(inquirerMock.confirm).toHaveBeenCalledTimes(1);
  });

  it('returns themes mode when the user picks themes', async () => {
    const brandSystem = brandSystemFor(['light', 'dark']);

    inquirerMock.select.mockResolvedValueOnce('light').mockResolvedValueOnce('themes');
    inquirerMock.confirm.mockResolvedValueOnce(false);

    const decision = await promptBrandImport(brandSystem);

    expect(decision).toEqual({
      primary: 'light',
      mode: 'themes',
      keepDefaultSemantics: false,
    });
  });

  it('throws when called with an empty palette list', async () => {
    await expect(promptBrandImport(brandSystemFor([]))).rejects.toThrow(
      /at least one detected palette/,
    );
  });

  it('propagates inquirer cancellation (ExitPromptError) so the caller maps it to declined', async () => {
    const brandSystem = brandSystemFor(['empire', 'republic']);
    const exitError = Object.assign(new Error('User force closed the prompt'), {
      name: 'ExitPromptError',
    });
    inquirerMock.select.mockRejectedValueOnce(exitError);

    await expect(promptBrandImport(brandSystem)).rejects.toThrow(/User force closed/);
  });
});
