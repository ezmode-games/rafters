import { describe, expect, it } from 'vitest';
import {
  deleteToken,
  dependencies,
  dependents,
  getToken,
  roots,
  setToken,
  setTokens,
  type Token,
  type TokenSetManifest,
  tokensInNamespace,
  topological,
} from '../src/index.js';

const token = (id: string, dependsOn: { source: string; plugin: string }[] = []): Token => ({
  id,
  namespace: id.split('.')[0] as Token['namespace'],
  value: { kind: 'number', value: 1, unit: 'unitless' },
  dependsOn: dependsOn.map((d) => ({ ...d, args: {} })),
  metadata: {},
  source: 'default',
});

const empty = (): TokenSetManifest => ({
  version: '2',
  id: 'test',
  name: 'Test',
  tokens: [],
  depends: [],
  plugins: [],
  overrides: [],
});

describe('manifest queries', () => {
  it('finds tokens by id', () => {
    const m = setToken(empty(), token('color.primary.500'));
    expect(getToken(m, 'color.primary.500')?.id).toBe('color.primary.500');
    expect(getToken(m, 'color.nope')).toBeUndefined();
  });

  it('filters by namespace', () => {
    const m = setTokens(empty(), [token('color.a.500'), token('spacing.lg')]);
    expect(tokensInNamespace(m, 'color')).toHaveLength(1);
    expect(tokensInNamespace(m, 'spacing')).toHaveLength(1);
  });

  it('lists dependencies and dependents', () => {
    const m = setTokens(empty(), [
      token('color.a.500'),
      token('color.b.500', [{ source: 'color.a.500', plugin: 'p' }]),
      token('color.c.500', [{ source: 'color.b.500', plugin: 'p' }]),
    ]);
    expect(dependencies(m, 'color.b.500')).toEqual(['color.a.500']);
    expect(dependents(m, 'color.a.500')).toEqual(['color.b.500']);
    expect(dependents(m, 'color.b.500')).toEqual(['color.c.500']);
  });

  it('lists roots', () => {
    const m = setTokens(empty(), [
      token('color.a.500'),
      token('color.b.500', [{ source: 'color.a.500', plugin: 'p' }]),
    ]);
    expect(roots(m)).toEqual(['color.a.500']);
  });

  it('topologically orders dependencies before dependents', () => {
    const m = setTokens(empty(), [
      token('color.a.500'),
      token('color.b.500', [{ source: 'color.a.500', plugin: 'p' }]),
      token('color.c.500', [{ source: 'color.b.500', plugin: 'p' }]),
    ]);
    const order = topological(m);
    expect(order.indexOf('color.a.500')).toBeLessThan(order.indexOf('color.b.500'));
    expect(order.indexOf('color.b.500')).toBeLessThan(order.indexOf('color.c.500'));
  });

  it('throws on cycle during topological sort', () => {
    const m = setTokens(empty(), [
      token('color.a.500', [{ source: 'color.b.500', plugin: 'p' }]),
      token('color.b.500', [{ source: 'color.a.500', plugin: 'p' }]),
    ]);
    expect(() => topological(m)).toThrow(/cycle/);
  });

  it('setToken is pure — original manifest is not mutated', () => {
    const m1 = empty();
    const m2 = setToken(m1, token('color.a.500'));
    expect(m1.tokens).toHaveLength(0);
    expect(m2.tokens).toHaveLength(1);
  });

  it('deleteToken removes by id and returns same reference when absent', () => {
    const m = setToken(empty(), token('color.a.500'));
    const next = deleteToken(m, 'color.a.500');
    expect(next.tokens).toHaveLength(0);
    const same = deleteToken(m, 'color.nope');
    expect(same).toBe(m);
  });
});
