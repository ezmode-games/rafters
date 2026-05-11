import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { loadManifest, saveManifest, type TokenSetManifest } from '../src/index.js';

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
    const raw = await readFile(path, 'utf8');
    await writeFile(path, raw.replace('"version": "2"', '"version": "1"'), 'utf8');
    await expect(loadManifest(path)).rejects.toThrow();
  });
});
