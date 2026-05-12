import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NodePersistenceAdapter } from '../src/index.js';
import { baseToken } from './_helpers.js';

describe('NodePersistenceAdapter', () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'rafters-design-tokens-persist-'));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('writes one file per namespace with NamespaceFileSchema envelope', async () => {
    const adapter = new NodePersistenceAdapter(dir);
    await adapter.save([
      baseToken({ name: 'a', namespace: 'spacing', value: '1rem' }),
      baseToken({ name: 'b', namespace: 'color', value: 'oklch(0.5 0.1 240)', category: 'color' }),
    ]);
    const spacing = JSON.parse(
      await readFile(join(dir, '.rafters/tokens/spacing.rafters.json'), 'utf8'),
    );
    expect(spacing.namespace).toBe('spacing');
    expect(spacing.$schema).toMatch(/namespace-tokens/);
    expect(spacing.tokens).toHaveLength(1);
  });

  it('round-trips a multi-namespace set', async () => {
    const adapter = new NodePersistenceAdapter(dir);
    const input = [
      baseToken({ name: 'a', namespace: 'spacing', value: '1rem' }),
      baseToken({ name: 'b', namespace: 'spacing', value: '2rem' }),
      baseToken({ name: 'c', namespace: 'radius', value: '0.25rem' }),
    ];
    await adapter.save(input);
    const loaded = await adapter.load();
    expect(loaded).toHaveLength(3);
    expect(loaded.map((t) => t.name).sort()).toEqual(['a', 'b', 'c']);
  });

  it('load returns empty array when tokens dir does not exist', async () => {
    const adapter = new NodePersistenceAdapter(dir);
    expect(await adapter.load()).toEqual([]);
  });

  it('load rejects malformed namespace files', async () => {
    await mkdir(join(dir, '.rafters/tokens'), { recursive: true });
    await writeFile(
      join(dir, '.rafters/tokens/broken.rafters.json'),
      JSON.stringify({ not: 'a valid namespace file' }),
      'utf8',
    );
    await expect(new NodePersistenceAdapter(dir).load()).rejects.toThrow();
  });
});
