import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  CircularDependencyError,
  type Plugin,
  TokenGraph,
  UnknownPluginError,
} from '../src/index.js';

const doublePlugin: Plugin = {
  name: 'double',
  inputSchema: z.object({ source: z.string() }),
  outputSchema: z.number(),
  dependsOn: (input) => [(input as { source: string }).source],
  transform: (input, get) => {
    const v = get((input as { source: string }).source);
    if (typeof v !== 'number') throw new Error('expected number');
    return v * 2;
  },
};

const sumPlugin: Plugin = {
  name: 'sum',
  inputSchema: z.object({ sources: z.array(z.string()) }),
  outputSchema: z.number(),
  dependsOn: (input) => (input as { sources: string[] }).sources,
  transform: (input, get) => {
    const sources = (input as { sources: string[] }).sources;
    let total = 0;
    for (const s of sources) {
      const v = get(s);
      if (typeof v !== 'number') throw new Error(`expected number for ${s}`);
      total += v;
    }
    return total;
  },
};

const identityPlugin: Plugin = {
  name: 'identity',
  inputSchema: z.object({ source: z.string() }),
  outputSchema: z.unknown(),
  dependsOn: (input) => [(input as { source: string }).source],
  transform: (input, get) => get((input as { source: string }).source),
};

describe('TokenGraph', () => {
  describe('set + get', () => {
    it('stores and retrieves leaf values', () => {
      const g = new TokenGraph();
      g.set('a', 1);
      expect(g.get('a')).toBe(1);
    });

    it('overwrites existing value', () => {
      const g = new TokenGraph();
      g.set('a', 1);
      g.set('a', 5);
      expect(g.get('a')).toBe(5);
    });

    it('returns undefined for unknown name', () => {
      const g = new TokenGraph();
      expect(g.get('nope')).toBeUndefined();
    });
  });

  describe('bind + cascade', () => {
    it('computes initial value via plugin on bind', () => {
      const g = new TokenGraph([doublePlugin]);
      g.set('a', 3);
      g.bind('b', 'double', { source: 'a' });
      expect(g.get('b')).toBe(6);
    });

    it('propagates upstream changes through dependents', () => {
      const g = new TokenGraph([doublePlugin]);
      g.set('a', 1);
      g.bind('b', 'double', { source: 'a' });
      g.set('a', 5);
      expect(g.get('b')).toBe(10);
    });

    it('propagates transitively through multi-hop chains', () => {
      const g = new TokenGraph([doublePlugin]);
      g.set('a', 2);
      g.bind('b', 'double', { source: 'a' });
      g.bind('c', 'double', { source: 'b' });
      g.bind('d', 'double', { source: 'c' });
      expect(g.get('d')).toBe(16);
      g.set('a', 3);
      expect(g.get('b')).toBe(6);
      expect(g.get('c')).toBe(12);
      expect(g.get('d')).toBe(24);
    });

    it('handles fan-out: many dependents on one source', () => {
      const g = new TokenGraph([doublePlugin]);
      g.set('a', 4);
      g.bind('x', 'double', { source: 'a' });
      g.bind('y', 'double', { source: 'a' });
      g.bind('z', 'double', { source: 'a' });
      g.set('a', 10);
      expect(g.get('x')).toBe(20);
      expect(g.get('y')).toBe(20);
      expect(g.get('z')).toBe(20);
    });

    it('handles fan-in: dependent reads multiple sources', () => {
      const g = new TokenGraph([sumPlugin]);
      g.set('a', 1);
      g.set('b', 2);
      g.set('c', 3);
      g.bind('total', 'sum', { sources: ['a', 'b', 'c'] });
      expect(g.get('total')).toBe(6);
      g.set('b', 10);
      expect(g.get('total')).toBe(14);
    });
  });

  describe('userOverride anchors', () => {
    it('records userOverride when cascade: false', () => {
      const g = new TokenGraph();
      g.set('a', 1, { cascade: false, reason: 'designer choice' });
      expect(g.node('a')?.userOverride?.reason).toBe('designer choice');
    });

    it('records optional context on userOverride', () => {
      const g = new TokenGraph();
      g.set('a', 1, { cascade: false, reason: 'designer choice', context: 'Q1 brand campaign' });
      expect(g.node('a')?.userOverride?.context).toBe('Q1 brand campaign');
    });

    it('captures previous value in userOverride', () => {
      const g = new TokenGraph();
      g.set('a', 1);
      g.set('a', 99, { cascade: false, reason: 'override' });
      expect(g.node('a')?.userOverride?.previousValue).toBe(1);
    });

    it('blocks recompute on the anchored node when upstream changes', () => {
      const g = new TokenGraph([doublePlugin]);
      g.set('a', 2);
      g.bind('b', 'double', { source: 'a' });
      expect(g.get('b')).toBe(4);
      g.set('b', 100, { cascade: false, reason: 'manual' });
      g.set('a', 7);
      expect(g.get('b')).toBe(100);
    });

    it('downstream of an anchor still receives propagation from the anchor value', () => {
      const g = new TokenGraph([doublePlugin]);
      g.set('a', 2);
      g.bind('b', 'double', { source: 'a' });
      g.bind('c', 'double', { source: 'b' });
      g.set('b', 50, { cascade: false, reason: 'manual' });
      expect(g.get('c')).toBe(100);
    });

    it('clears userOverride when set called without cascade: false', () => {
      const g = new TokenGraph();
      g.set('a', 1, { cascade: false, reason: 'manual' });
      expect(g.node('a')?.userOverride).toBeDefined();
      g.set('a', 5);
      expect(g.node('a')?.userOverride).toBeUndefined();
    });

    it('preserves binding when overriding so cascade can resume on later bind/clear', () => {
      const g = new TokenGraph([doublePlugin]);
      g.set('a', 2);
      g.bind('b', 'double', { source: 'a' });
      g.set('b', 999, { cascade: false, reason: 'manual' });
      expect(g.node('b')?.binding?.plugin).toBe('double');
    });
  });

  describe('undo', () => {
    it('reverses the last set', () => {
      const g = new TokenGraph();
      g.set('a', 1);
      g.set('a', 5);
      g.undo();
      expect(g.get('a')).toBe(1);
    });

    it('reverses the last bind including cascade effects', () => {
      const g = new TokenGraph([doublePlugin]);
      g.set('a', 3);
      g.bind('b', 'double', { source: 'a' });
      g.set('a', 10);
      g.undo();
      expect(g.get('a')).toBe(3);
      expect(g.get('b')).toBe(6);
    });

    it('is single-step (does not stack)', () => {
      const g = new TokenGraph();
      g.set('a', 1);
      g.set('a', 5);
      g.set('a', 9);
      g.undo();
      expect(g.get('a')).toBe(5);
      g.undo();
      expect(g.get('a')).toBe(5);
    });
  });

  describe('cycle detection', () => {
    it('throws CircularDependencyError on direct cycle', () => {
      const g = new TokenGraph([identityPlugin]);
      g.set('a', 1);
      g.set('b', 2);
      g.bind('a', 'identity', { source: 'b' });
      expect(() => g.bind('b', 'identity', { source: 'a' })).toThrow(CircularDependencyError);
    });

    it('throws CircularDependencyError on transitive cycle', () => {
      const g = new TokenGraph([identityPlugin]);
      g.set('a', 1);
      g.set('b', 2);
      g.set('c', 3);
      g.bind('b', 'identity', { source: 'a' });
      g.bind('c', 'identity', { source: 'b' });
      expect(() => g.bind('a', 'identity', { source: 'c' })).toThrow(CircularDependencyError);
    });

    it('cycle error includes the cycle path', () => {
      const g = new TokenGraph([identityPlugin]);
      g.set('a', 1);
      g.set('b', 2);
      g.bind('a', 'identity', { source: 'b' });
      try {
        g.bind('b', 'identity', { source: 'a' });
        expect.fail('should have thrown');
      } catch (e) {
        if (!(e instanceof CircularDependencyError)) throw e;
        expect(e.cycle).toContain('a');
        expect(e.cycle).toContain('b');
      }
    });
  });

  describe('plugin lookup', () => {
    it('throws UnknownPluginError when binding with unregistered plugin', () => {
      const g = new TokenGraph();
      expect(() => g.bind('a', 'nonexistent', {})).toThrow(UnknownPluginError);
    });

    it('accepts plugins registered after construction', () => {
      const g = new TokenGraph();
      g.registerPlugin(doublePlugin);
      g.set('a', 4);
      g.bind('b', 'double', { source: 'a' });
      expect(g.get('b')).toBe(8);
    });
  });

  describe('inventory', () => {
    it('reports size accurately', () => {
      const g = new TokenGraph();
      expect(g.size()).toBe(0);
      g.set('a', 1);
      g.set('b', 2);
      expect(g.size()).toBe(2);
    });

    it('has() reflects presence', () => {
      const g = new TokenGraph();
      g.set('a', 1);
      expect(g.has('a')).toBe(true);
      expect(g.has('b')).toBe(false);
    });

    it('list() filters by namespace prefix (dash and dot separators)', () => {
      const g = new TokenGraph();
      g.set('color-primary', 1);
      g.set('color-secondary', 2);
      g.set('color.tertiary', 3);
      g.set('spacing-base', 4);
      const colors = g.list({ namespace: 'color' });
      expect(colors.map((n) => n.name).sort()).toEqual([
        'color-primary',
        'color-secondary',
        'color.tertiary',
      ]);
    });
  });
});
