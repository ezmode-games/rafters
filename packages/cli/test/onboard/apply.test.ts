/**
 * Tests for `applyPending` -- the merge engine behind `rafters import --apply`
 * (#1411). Verifies that accepted/modified tokens land in the registry,
 * pending/rejected tokens are skipped with accurate counts, modifications
 * overlay the allowed fields, and the pending file is archived.
 */

import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { loadRegistryFromDir, saveRegistryToDir, TokenRegistry } from '@rafters/design-tokens';
import type { ImportPending, Token } from '@rafters/shared';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { applyPending } from '../../src/onboard/apply.js';
import { getRaftersPaths } from '../../src/utils/paths.js';

function tokenFor(overrides: Partial<Token> = {}): Token {
  return {
    name: 'brand',
    value: 'oklch(0.5 0.1 250)',
    category: 'color',
    namespace: 'color',
    userOverride: null,
    semanticMeaning: 'Imported from Tailwind v4 --color-brand',
    usageContext: ['light mode', 'default'],
    containerQueryAware: true,
    ...overrides,
  };
}

function pendingFor(overrides: Partial<ImportPending> = {}): ImportPending {
  return {
    version: '1.0',
    createdAt: '2026-05-15T12:00:00.000Z',
    detectedSystem: 'tailwind-v4',
    systemConfidence: 0.95,
    source: 'src/styles/global.css',
    tokens: [],
    ...overrides,
  };
}

describe('applyPending', () => {
  const testDir = join(process.cwd(), '.test-apply');
  const paths = getRaftersPaths(testDir);

  beforeEach(async () => {
    await mkdir(testDir, { recursive: true });
    await mkdir(paths.root, { recursive: true });
    await mkdir(paths.tokens, { recursive: true });
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  async function writePending(doc: ImportPending): Promise<void> {
    await writeFile(paths.importPending, `${JSON.stringify(doc, null, 2)}\n`);
  }

  it('merges accepted tokens into the registry and counts them', async () => {
    const proposed = tokenFor({ name: 'brand', value: 'oklch(0.7 0.2 280)' });
    await writePending(
      pendingFor({
        tokens: [
          {
            original: {
              name: '--color-brand',
              value: 'oklch(0.7 0.2 280)',
              source: 'src/styles/global.css',
            },
            proposed,
            decision: 'accepted',
            confidence: 0.95,
          },
        ],
      }),
    );

    const result = await applyPending(paths);

    expect(result.stats).toEqual({ applied: 1, skippedPending: 0, skippedRejected: 0 });
    expect(result.registry.get('brand')?.value).toBe('oklch(0.7 0.2 280)');
  });

  it('overlays modifications onto the proposed token before merging', async () => {
    const proposed = tokenFor({
      name: 'brand',
      value: 'oklch(0.7 0.2 280)',
      category: 'color',
      namespace: 'color',
    });
    await writePending(
      pendingFor({
        tokens: [
          {
            original: {
              name: '--color-brand',
              value: 'oklch(0.7 0.2 280)',
              source: 'src/styles/global.css',
            },
            proposed,
            decision: 'modified',
            modifications: { name: 'primary-500', value: 'oklch(0.6 0.25 280)' },
            confidence: 0.95,
          },
        ],
      }),
    );

    const result = await applyPending(paths);

    expect(result.stats.applied).toBe(1);
    // Original `brand` should not be present; the modified `primary-500` should be.
    expect(result.registry.get('brand')).toBeUndefined();
    const primary = result.registry.get('primary-500');
    expect(primary?.value).toBe('oklch(0.6 0.25 280)');
    // Untouched fields flow through from the proposed token.
    expect(primary?.category).toBe('color');
    expect(primary?.namespace).toBe('color');
    expect(primary?.semanticMeaning).toBe('Imported from Tailwind v4 --color-brand');
  });

  it('skips pending tokens and counts them separately from rejected', async () => {
    await writePending(
      pendingFor({
        tokens: [
          {
            original: { name: '--a', value: '1', source: 'x.css' },
            proposed: tokenFor({ name: 'a', value: 'a-val' }),
            decision: 'pending',
            confidence: 0.9,
          },
          {
            original: { name: '--b', value: '2', source: 'x.css' },
            proposed: tokenFor({ name: 'b', value: 'b-val' }),
            decision: 'rejected',
            confidence: 0.9,
          },
          {
            original: { name: '--c', value: '3', source: 'x.css' },
            proposed: tokenFor({ name: 'c', value: 'c-val' }),
            decision: 'accepted',
            confidence: 0.9,
          },
        ],
      }),
    );

    const result = await applyPending(paths);

    expect(result.stats).toEqual({ applied: 1, skippedPending: 1, skippedRejected: 1 });
    expect(result.registry.get('a')).toBeUndefined();
    expect(result.registry.get('b')).toBeUndefined();
    expect(result.registry.get('c')?.value).toBe('c-val');
  });

  it('archives the pending file with a timestamped applied suffix', async () => {
    await writePending(
      pendingFor({
        tokens: [
          {
            original: { name: '--brand', value: 'v', source: 'x.css' },
            proposed: tokenFor(),
            decision: 'accepted',
            confidence: 0.9,
          },
        ],
      }),
    );

    const frozenNow = new Date('2026-05-15T19:30:00.000Z');
    const result = await applyPending(paths, { now: frozenNow });

    expect(result.archivedTo).toMatch(/import-pending\.applied-[\d-T]+Z\.json$/);
    expect(existsSync(paths.importPending)).toBe(false);
    expect(existsSync(result.archivedTo)).toBe(true);

    const archived = JSON.parse(await readFile(result.archivedTo, 'utf-8'));
    expect(archived.tokens[0]?.decision).toBe('accepted');
  });

  it('overwrites existing tokens on name collision (imported intent wins)', async () => {
    // Pre-seed the registry with a stale brand token
    const seed = new TokenRegistry([tokenFor({ name: 'brand', value: 'old-value' })]);
    saveRegistryToDir(paths.tokens, seed);

    await writePending(
      pendingFor({
        tokens: [
          {
            original: { name: '--brand', value: 'new-value', source: 'x.css' },
            proposed: tokenFor({ name: 'brand', value: 'new-value' }),
            decision: 'accepted',
            confidence: 0.9,
          },
        ],
      }),
    );

    const result = await applyPending(paths);

    expect(result.registry.get('brand')?.value).toBe('new-value');

    // Re-load from disk to confirm persistence
    const fromDisk = loadRegistryFromDir(paths.tokens);
    expect(fromDisk.get('brand')?.value).toBe('new-value');
  });

  it('throws a helpful error when import-pending.json is missing', async () => {
    await expect(applyPending(paths)).rejects.toThrow(/No import-pending\.json/);
  });

  it('writes the merged registry to disk under .rafters/tokens/', async () => {
    await writePending(
      pendingFor({
        tokens: [
          {
            original: { name: '--brand', value: 'v', source: 'x.css' },
            proposed: tokenFor({ name: 'brand', namespace: 'color' }),
            decision: 'accepted',
            confidence: 0.9,
          },
        ],
      }),
    );

    await applyPending(paths);

    const files = await readdir(paths.tokens);
    expect(files).toContain('color.rafters.json');
    const contents = await readFile(join(paths.tokens, 'color.rafters.json'), 'utf-8');
    expect(contents).toContain('"name": "brand"');
  });
});
