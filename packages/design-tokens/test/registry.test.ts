import { describe, expect, it } from 'vitest';
import type { Token } from '../src/schemas/index.js';
import { TokenRegistry } from '../src/storage/index.js';

const token = (id: string, dependsOn: { source: string; plugin: string }[] = []): Token => ({
  id,
  namespace: id.split('.')[0] as Token['namespace'],
  value: { kind: 'number', value: 1, unit: 'unitless' },
  dependsOn: dependsOn.map((d) => ({ ...d, args: {} })),
  metadata: {},
  source: 'default',
});

describe('TokenRegistry', () => {
  it('stores and retrieves tokens', () => {
    const r = new TokenRegistry();
    const t = token('color.primary.500');
    r.set(t);
    expect(r.get('color.primary.500')?.id).toBe('color.primary.500');
    expect(r.has('color.primary.500')).toBe(true);
    expect(r.size()).toBe(1);
  });

  it('replaces a token in place and reindexes edges', () => {
    const r = new TokenRegistry();
    r.set(token('color.a.500'));
    r.set(token('color.b.500', [{ source: 'color.a.500', plugin: 'p' }]));
    expect(r.dependents('color.a.500')).toEqual(['color.b.500']);

    r.set(token('color.b.500')); // remove edge
    expect(r.dependents('color.a.500')).toEqual([]);
  });

  it('exposes dependencies and dependents in both directions', () => {
    const r = new TokenRegistry();
    r.set(token('color.a.500'));
    r.set(token('color.b.500', [{ source: 'color.a.500', plugin: 'p' }]));
    r.set(token('color.c.500', [{ source: 'color.b.500', plugin: 'p' }]));

    expect(r.dependencies('color.b.500')).toEqual(['color.a.500']);
    expect(r.dependents('color.a.500')).toEqual(['color.b.500']);
    expect(r.dependents('color.b.500')).toEqual(['color.c.500']);
    expect(r.dependents('color.c.500')).toEqual([]);
  });

  it('lists roots', () => {
    const r = new TokenRegistry();
    r.set(token('color.a.500'));
    r.set(token('color.b.500', [{ source: 'color.a.500', plugin: 'p' }]));
    expect(r.roots()).toEqual(['color.a.500']);
  });

  it('groups by namespace', () => {
    const r = new TokenRegistry();
    r.set(token('color.a.500'));
    r.set(token('spacing.lg'));
    expect(r.byNamespace('color')).toHaveLength(1);
    expect(r.byNamespace('spacing')).toHaveLength(1);
  });

  it('topologically sorts dependencies before dependents', () => {
    const r = new TokenRegistry();
    r.set(token('color.a.500'));
    r.set(token('color.b.500', [{ source: 'color.a.500', plugin: 'p' }]));
    r.set(token('color.c.500', [{ source: 'color.b.500', plugin: 'p' }]));
    const order = r.topological();
    expect(order.indexOf('color.a.500')).toBeLessThan(order.indexOf('color.b.500'));
    expect(order.indexOf('color.b.500')).toBeLessThan(order.indexOf('color.c.500'));
  });

  it('throws on cycle during topological sort', () => {
    const r = new TokenRegistry();
    r.set(token('color.a.500', [{ source: 'color.b.500', plugin: 'p' }]));
    r.set(token('color.b.500', [{ source: 'color.a.500', plugin: 'p' }]));
    expect(() => r.topological()).toThrow(/cycle/);
  });

  it('delete unindexes edges', () => {
    const r = new TokenRegistry();
    r.set(token('color.a.500'));
    r.set(token('color.b.500', [{ source: 'color.a.500', plugin: 'p' }]));
    r.delete('color.b.500');
    expect(r.dependents('color.a.500')).toEqual([]);
    expect(r.has('color.b.500')).toBe(false);
  });

  it('snapshot serializes the full state', () => {
    const r = new TokenRegistry();
    r.set(token('color.a.500'));
    r.set(token('color.b.500', [{ source: 'color.a.500', plugin: 'state-hover' }]));
    const snap = r.snapshot(['state-hover']);
    expect(snap.version).toBe('2');
    expect(snap.tokens).toHaveLength(2);
    expect(snap.pluginIds).toEqual(['state-hover']);
  });

  it('loadSnapshot replays into an empty registry', () => {
    const r1 = new TokenRegistry();
    r1.set(token('color.a.500'));
    r1.set(token('color.b.500', [{ source: 'color.a.500', plugin: 'p' }]));
    const snap = r1.snapshot([]);

    const r2 = new TokenRegistry();
    r2.loadSnapshot(snap);
    expect(r2.size()).toBe(2);
    expect(r2.dependents('color.a.500')).toEqual(['color.b.500']);
  });
});
