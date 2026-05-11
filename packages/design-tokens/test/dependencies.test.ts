import type { Token } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { type Plugin, TokenDependencyGraph } from '../src/index.js';
import { doublePlugin, factorPlugin } from './_helpers.js';

describe('TokenDependencyGraph', () => {
  it('records forward edges and derives dependents', () => {
    const g = new TokenDependencyGraph();
    g.addDependency('b', ['a'], 'scale:500');
    expect(g.getDependencies('b')).toEqual(['a']);
    expect(g.getDependents('a')).toEqual(['b']);
  });

  it('rejects self-cycles', () => {
    const g = new TokenDependencyGraph();
    expect(() => g.addDependency('a', ['a'], 'r')).toThrow(/cycle/);
  });

  it('rejects two-node cycles', () => {
    const g = new TokenDependencyGraph();
    g.addDependency('b', ['a'], 'r');
    expect(() => g.addDependency('a', ['b'], 'r')).toThrow(/cycle/);
  });

  it('rejects longer cycles', () => {
    const g = new TokenDependencyGraph();
    g.addDependency('b', ['a'], 'r');
    g.addDependency('c', ['b'], 'r');
    expect(() => g.addDependency('a', ['c'], 'r')).toThrow(/cycle/);
  });

  it('cycle errors carry structured cause', () => {
    const g = new TokenDependencyGraph();
    try {
      g.addDependency('a', ['a'], 'r');
      expect.fail('should have thrown');
    } catch (err) {
      expect((err as Error & { cause?: unknown }).cause).toMatchObject({ code: 'cycle' });
    }
  });

  it('topologically sorts dependencies before dependents', () => {
    const g = new TokenDependencyGraph();
    g.addDependency('b', ['a'], 'r');
    g.addDependency('c', ['b'], 'r');
    const order = g.topologicalSort();
    expect(order.indexOf('a')).toBeLessThan(order.indexOf('b'));
    expect(order.indexOf('b')).toBeLessThan(order.indexOf('c'));
  });

  it('removeToken cleans up bidirectional edges', () => {
    const g = new TokenDependencyGraph();
    g.addDependency('b', ['a'], 'r');
    g.removeToken('b');
    expect(g.getDependents('a')).toEqual([]);
    expect(g.getDependencies('b')).toEqual([]);
  });

  it('replacing a dependency updates the reverse index', () => {
    const g = new TokenDependencyGraph();
    g.addDependency('b', ['a'], 'r');
    g.addDependency('b', ['c'], 'r');
    expect(g.getDependents('a')).toEqual([]);
    expect(g.getDependents('c')).toEqual(['b']);
  });

  it('getGenerationRule returns undefined for tokens without rules', () => {
    const g = new TokenDependencyGraph();
    g.addDependency('b', ['a'], 'r');
    expect(g.getGenerationRule('b')).toBe('r');
    expect(g.getGenerationRule('a')).toBeUndefined();
  });

  describe('cascade', () => {
    it('dispatches plugins by rule tag', async () => {
      const g = new TokenDependencyGraph();
      g.addDependency('b', ['a'], 'double');
      const values = new Map<string, Token['value']>([
        ['a', '4'],
        ['b', '0'],
      ]);
      const plugins = new Map([['double', doublePlugin as Plugin]]);
      const result = await g.cascade(
        plugins,
        (n) => values.get(n),
        (n, v) => values.set(n, v),
      );
      expect(values.get('b')).toBe('8');
      expect(result.recomputed).toEqual(['b']);
      expect(result.changed).toEqual(['b']);
    });

    it('skips tokens with unknown plugin rules and records the failure', async () => {
      const g = new TokenDependencyGraph();
      g.addDependency('b', ['a'], 'mystery');
      const values = new Map<string, Token['value']>([
        ['a', '4'],
        ['b', '0'],
      ]);
      const result = await g.cascade(
        new Map(),
        (n) => values.get(n),
        () => {},
      );
      expect(result.failures[0]?.code).toBe('unknown-plugin');
      expect(values.get('b')).toBe('0');
    });

    it('parses generationRule tag with simple arg', async () => {
      const g = new TokenDependencyGraph();
      g.addDependency('b', ['a'], 'factor:3');
      const values = new Map<string, Token['value']>([
        ['a', '5'],
        ['b', '0'],
      ]);
      const plugins = new Map([['factor', factorPlugin as Plugin]]);
      const result = await g.cascade(
        plugins,
        (n) => values.get(n),
        (n, v) => values.set(n, v),
      );
      expect(values.get('b')).toBe('15');
      expect(result.changed).toEqual(['b']);
    });

    it('reports missing-source when dependency has no value', async () => {
      const g = new TokenDependencyGraph();
      g.addDependency('b', ['a'], 'double');
      const result = await g.cascade(
        new Map([['double', doublePlugin as Plugin]]),
        () => undefined,
        () => {},
      );
      expect(result.failures[0]?.code).toBe('missing-source');
    });

    it('scopes to transitive dependents when startName is given', async () => {
      const g = new TokenDependencyGraph();
      g.addDependency('b', ['a'], 'double');
      g.addDependency('d', ['c'], 'double');
      const values = new Map<string, Token['value']>([
        ['a', '4'],
        ['b', '0'],
        ['c', '7'],
        ['d', '0'],
      ]);
      const plugins = new Map([['double', doublePlugin as Plugin]]);
      const result = await g.cascade(
        plugins,
        (n) => values.get(n),
        (n, v) => values.set(n, v),
        'a',
      );
      expect(result.recomputed).toEqual(['b']);
      expect(values.get('d')).toBe('0');
    });

    it('continues past one failed token to recompute others', async () => {
      const g = new TokenDependencyGraph();
      g.addDependency('b', ['a'], 'mystery');
      g.addDependency('d', ['c'], 'double');
      const values = new Map<string, Token['value']>([
        ['a', '4'],
        ['b', '0'],
        ['c', '5'],
        ['d', '0'],
      ]);
      const plugins = new Map([['double', doublePlugin as Plugin]]);
      const result = await g.cascade(
        plugins,
        (n) => values.get(n),
        (n, v) => values.set(n, v),
      );
      expect(result.failures.length).toBe(1);
      expect(values.get('d')).toBe('10');
    });
  });
});
