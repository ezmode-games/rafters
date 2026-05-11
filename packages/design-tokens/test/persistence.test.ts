import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { TokenSetManifest } from '../src/schemas/index.js';
import { loadManifest, loadSnapshot, saveManifest, saveSnapshot } from '../src/storage/index.js';

const fixture: TokenSetManifest = {
  version: '2',
  id: 'fixture',
  name: 'Fixture',
  tokens: [
    {
      id: 'color.primary.500',
      namespace: 'color',
      value: { kind: 'color', l: 0.5, c: 0.2, h: 180 },
      dependsOn: [],
      metadata: {},
      source: 'default',
    },
  ],
  depends: [],
  plugins: [],
  overrides: [],
};

describe('persistence', () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'rafters-design-tokens-'));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('round-trips a manifest', async () => {
    const path = join(dir, 'set.rafters.json');
    await saveManifest(path, fixture);
    const loaded = await loadManifest(path);
    expect(loaded).toEqual(fixture);
  });

  it('saveManifest writes pretty JSON ending with a newline', async () => {
    const path = join(dir, 'set.rafters.json');
    await saveManifest(path, fixture);
    const raw = await readFile(path, 'utf8');
    expect(raw.endsWith('\n')).toBe(true);
    expect(raw).toContain('\n  ');
  });

  it('loadManifest rejects malformed JSON', async () => {
    const path = join(dir, 'broken.json');
    await saveManifest(path, fixture);
    const bad = (await readFile(path, 'utf8')).replace('"version": "2"', '"version": "1"');
    const { writeFile } = await import('node:fs/promises');
    await writeFile(path, bad, 'utf8');
    await expect(loadManifest(path)).rejects.toThrow();
  });

  it('round-trips a snapshot', async () => {
    const path = join(dir, 'snap.json');
    const snapshot = {
      version: '2' as const,
      takenAt: '2026-05-10T20:00:00.000Z',
      tokens: fixture.tokens,
      overrides: [],
      pluginIds: ['state-hover'],
    };
    await saveSnapshot(path, snapshot);
    const loaded = await loadSnapshot(path);
    expect(loaded).toEqual(snapshot);
  });
});
