import { mkdir, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import type { Token } from '@rafters/shared';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NodePersistenceAdapter } from '../src/persistence/node-adapter.js';

describe('NodePersistenceAdapter', () => {
  const testDir = '/tmp/rafters-test-persistence';
  let adapter: NodePersistenceAdapter;

  beforeEach(async () => {
    await mkdir(testDir, { recursive: true });
    adapter = new NodePersistenceAdapter(testDir);
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  it('should save and load namespace tokens', async () => {
    const tokens: Token[] = [
      {
        name: 'test-token',
        value: '1rem',
        category: 'spacing',
        namespace: 'spacing',
      },
    ];

    await adapter.saveNamespace('spacing', tokens);
    const loaded = await adapter.loadNamespace('spacing');

    // Zod adds defaults (e.g., containerQueryAware), so check core properties
    expect(loaded).toHaveLength(1);
    expect(loaded[0]).toMatchObject({
      name: 'test-token',
      value: '1rem',
      category: 'spacing',
      namespace: 'spacing',
    });
  });

  it('should create directory structure on save', async () => {
    const tokens: Token[] = [
      {
        name: 'test',
        value: '1',
        category: 'test',
        namespace: 'test',
      },
    ];

    await adapter.saveNamespace('test', tokens);

    const content = await readFile(
      join(testDir, '.rafters', 'tokens', 'test.rafters.json'),
      'utf-8',
    );
    const data = JSON.parse(content);
    expect(data.namespace).toBe('test');
    expect(data.tokens).toEqual(tokens);
  });

  it('should include schema and version in saved files', async () => {
    await adapter.saveNamespace('color', []);

    const content = await readFile(
      join(testDir, '.rafters', 'tokens', 'color.rafters.json'),
      'utf-8',
    );
    const data = JSON.parse(content);

    expect(data.$schema).toBe('https://rafters.studio/schemas/namespace-tokens.json');
    expect(data.version).toBe('1.0.0');
    expect(data.generatedAt).toBeDefined();
  });

  it('should list available namespaces', async () => {
    await adapter.saveNamespace('color', []);
    await adapter.saveNamespace('spacing', []);

    const namespaces = await adapter.listNamespaces();

    expect(namespaces).toContain('color');
    expect(namespaces).toContain('spacing');
  });

  it('should return empty array if tokens directory does not exist', async () => {
    const namespaces = await adapter.listNamespaces();
    expect(namespaces).toEqual([]);
  });

  it('should check namespace existence', async () => {
    await adapter.saveNamespace('color', []);

    expect(await adapter.namespaceExists('color')).toBe(true);
    expect(await adapter.namespaceExists('nonexistent')).toBe(false);
  });

  it('should handle multiple tokens in a namespace', async () => {
    const tokens: Token[] = [
      { name: 'spacing-1', value: '0.25rem', category: 'spacing', namespace: 'spacing' },
      { name: 'spacing-2', value: '0.5rem', category: 'spacing', namespace: 'spacing' },
      { name: 'spacing-4', value: '1rem', category: 'spacing', namespace: 'spacing' },
    ];

    await adapter.saveNamespace('spacing', tokens);
    const loaded = await adapter.loadNamespace('spacing');

    expect(loaded).toHaveLength(3);
    expect(loaded[0]?.name).toBe('spacing-1');
    expect(loaded[2]?.name).toBe('spacing-4');
  });

  it('should overwrite existing namespace on save', async () => {
    const tokens1: Token[] = [{ name: 'old', value: '1', category: 'test', namespace: 'test' }];
    const tokens2: Token[] = [{ name: 'new', value: '2', category: 'test', namespace: 'test' }];

    await adapter.saveNamespace('test', tokens1);
    await adapter.saveNamespace('test', tokens2);

    const loaded = await adapter.loadNamespace('test');

    expect(loaded).toHaveLength(1);
    expect(loaded[0]?.name).toBe('new');
  });

  it('should throw when loading non-existent namespace', async () => {
    await expect(adapter.loadNamespace('nonexistent')).rejects.toThrow();
  });
});
