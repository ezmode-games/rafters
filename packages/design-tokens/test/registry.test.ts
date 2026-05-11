import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type MutationEvent, NodePersistenceAdapter, TokenRegistry } from '../src/index.js';
import { baseToken, doublePlugin } from './_helpers.js';

describe('TokenRegistry', () => {
  describe('add / set / preserve metadata', () => {
    it('set updates value only and preserves metadata', () => {
      const r = new TokenRegistry([baseToken({ name: 'x', value: '1rem', semanticMeaning: 'hi' })]);
      r.set('x', '2rem');
      expect(r.get('x')?.value).toBe('2rem');
      expect(r.get('x')?.semanticMeaning).toBe('hi');
    });

    it('set throws for non-existent tokens', () => {
      const r = new TokenRegistry();
      expect(() => r.set('nope', '1rem')).toThrow(/does not exist/);
    });

    it('set does NOT trigger cascade', () => {
      const r = new TokenRegistry([
        baseToken({ name: 'a', value: '1' }),
        baseToken({ name: 'b', value: '2', dependsOn: ['a'], generationRule: 'double' }),
      ]);
      r.use(doublePlugin);
      r.set('a', '3');
      expect(r.get('b')?.value).toBe('2');
    });

    it('add inserts and populates the graph', () => {
      const r = new TokenRegistry();
      r.add(baseToken({ name: 'a', value: '1' }));
      r.add(baseToken({ name: 'b', value: '0', dependsOn: ['a'], generationRule: 'double' }));
      expect(r.dependents('a')).toEqual(['b']);
    });

    it('list filters by category and namespace', () => {
      const r = new TokenRegistry([
        baseToken({ name: 'x', namespace: 'color', category: 'color' }),
        baseToken({ name: 'y', namespace: 'spacing', category: 'spacing' }),
        baseToken({ name: 'font-sans', namespace: 'font', category: 'typography' }),
        baseToken({ name: 'text-base', namespace: 'text', category: 'typography' }),
      ]);
      expect(r.list({ category: 'typography' })).toHaveLength(2);
      expect(r.list({ namespace: 'color' })).toHaveLength(1);
    });
  });

  describe('cascade', () => {
    it('explicit cascade recomputes dependents', async () => {
      const r = new TokenRegistry([
        baseToken({ name: 'a', value: '1' }),
        baseToken({ name: 'b', value: '0', dependsOn: ['a'], generationRule: 'double' }),
      ]);
      r.use(doublePlugin);
      r.set('a', '5');
      const result = await r.cascade('a');
      expect(r.get('b')?.value).toBe('10');
      expect(result.changed).toEqual(['b']);
    });

    it('records unknown-plugin failures without throwing', async () => {
      const r = new TokenRegistry([
        baseToken({ name: 'a', value: '1' }),
        baseToken({ name: 'b', value: '0', dependsOn: ['a'], generationRule: 'mystery' }),
      ]);
      const result = await r.cascade();
      expect(result.failures[0]?.code).toBe('unknown-plugin');
    });
  });

  describe('clearOverride', () => {
    it('on derived token restores math via cascade', async () => {
      const r = new TokenRegistry([
        baseToken({ name: 'a', value: '1' }),
        baseToken({
          name: 'b',
          value: '99',
          dependsOn: ['a'],
          generationRule: 'double',
          userOverride: {
            previousValue: '2',
            reason: 'campaign',
          },
        }),
      ]);
      r.use(doublePlugin);
      await r.clearOverride('b');
      expect(r.get('b')?.value).toBe('2');
      expect(r.get('b')?.userOverride).toBeUndefined();
    });

    it('on root token restores previousValue', async () => {
      const r = new TokenRegistry([
        baseToken({
          name: 'a',
          value: '5',
          userOverride: { previousValue: '1', reason: 'campaign' },
        }),
      ]);
      await r.clearOverride('a');
      expect(r.get('a')?.value).toBe('1');
      expect(r.get('a')?.userOverride).toBeUndefined();
    });

    it('throws when root token has no previousValue and no rule', async () => {
      const r = new TokenRegistry([
        baseToken({
          name: 'a',
          value: '5',
          userOverride: {
            previousValue: undefined as unknown as string,
            reason: 'broken',
          },
        }),
      ]);
      await expect(r.clearOverride('a')).rejects.toThrow(/no previousValue/);
    });

    it('is a no-op when token has no userOverride', async () => {
      const r = new TokenRegistry([baseToken({ name: 'a', value: '5' })]);
      await r.clearOverride('a');
      expect(r.get('a')?.value).toBe('5');
    });
  });

  describe('remove / clear', () => {
    it('remove cleans up graph edges', () => {
      const r = new TokenRegistry([
        baseToken({ name: 'a', value: '1' }),
        baseToken({ name: 'b', value: '0', dependsOn: ['a'], generationRule: 'double' }),
      ]);
      r.remove('b');
      expect(r.has('b')).toBe(false);
      expect(r.dependents('a')).toEqual([]);
    });

    it('clear empties tokens and graph', () => {
      const r = new TokenRegistry([baseToken({ name: 'a', value: '1' })]);
      r.clear();
      expect(r.size()).toBe(0);
    });
  });

  describe('addDependency validation', () => {
    it('throws when token does not exist', () => {
      const r = new TokenRegistry();
      expect(() => r.addDependency('a', ['b'], 'r')).toThrow(/does not exist/);
    });

    it('throws when dependency does not exist', () => {
      const r = new TokenRegistry([baseToken({ name: 'a', value: '1' })]);
      expect(() => r.addDependency('a', ['b'], 'r')).toThrow(/does not exist/);
    });
  });

  describe('onMutation hook', () => {
    it('fires on every mutation', () => {
      const r = new TokenRegistry();
      const events: MutationEvent[] = [];
      r.onMutation = (e) => events.push(e);
      r.add(baseToken({ name: 'a', value: '1' }));
      r.set('a', '2');
      r.remove('a');
      expect(events.map((e) => e.kind)).toEqual(['add', 'set', 'remove']);
    });

    it('event carries before/after for set', () => {
      const r = new TokenRegistry([baseToken({ name: 'a', value: '1' })]);
      const events: MutationEvent[] = [];
      r.onMutation = (e) => events.push(e);
      r.set('a', '2');
      expect(events[0]?.before).toBe('1');
      expect(events[0]?.after).toBe('2');
    });
  });

  describe('two-pass constructor', () => {
    it('handles forward references during bulk load', () => {
      const r = new TokenRegistry([
        baseToken({ name: 'b', value: '0', dependsOn: ['a'], generationRule: 'double' }),
        baseToken({ name: 'a', value: '1' }),
      ]);
      expect(r.dependencies('b')).toEqual(['a']);
      expect(r.dependents('a')).toEqual(['b']);
    });
  });

  describe('persistence', () => {
    let dir: string;

    beforeEach(async () => {
      dir = await mkdtemp(join(tmpdir(), 'rafters-design-tokens-'));
    });

    afterEach(async () => {
      await rm(dir, { recursive: true, force: true });
    });

    it('persist + load round-trip through NodePersistenceAdapter', async () => {
      const r1 = new TokenRegistry([baseToken({ name: 'x', namespace: 'spacing', value: '1rem' })]);
      r1.setAdapter(new NodePersistenceAdapter(dir));
      await r1.persist();

      const r2 = new TokenRegistry();
      r2.setAdapter(new NodePersistenceAdapter(dir));
      await r2.load();
      expect(r2.get('x')?.value).toBe('1rem');
    });

    it('persist throws when no adapter is set', async () => {
      const r = new TokenRegistry();
      await expect(r.persist()).rejects.toThrow(/no persistence adapter/);
    });

    it('load throws when no adapter is set', async () => {
      const r = new TokenRegistry();
      await expect(r.load()).rejects.toThrow(/no persistence adapter/);
    });

    it('swappable adapter — in-memory test double', async () => {
      const stored: Array<{ tokens: unknown[] }> = [];
      const memoryAdapter = {
        load: async () => [],
        save: vi.fn(async (tokens: Parameters<NodePersistenceAdapter['save']>[0]) => {
          stored.push({ tokens: [...tokens] });
        }),
      };
      const r = new TokenRegistry([baseToken({ name: 'a', value: '1' })]);
      r.setAdapter(memoryAdapter);
      await r.persist();
      expect(memoryAdapter.save).toHaveBeenCalledOnce();
      expect(stored[0]?.tokens).toHaveLength(1);
    });
  });
});
