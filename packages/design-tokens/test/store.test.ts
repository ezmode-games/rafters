import { describe, expect, it, vi } from 'vitest';
import type { Token, TokenSetManifest } from '../src/index.js';
import { TokenStore } from '../src/index.js';

const token = (id: string): Token => ({
  id,
  namespace: id.split('.')[0] as Token['namespace'],
  value: { kind: 'number', value: 1, unit: 'unitless' },
  dependsOn: [],
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

describe('TokenStore', () => {
  it('holds current and tracks one previous on mutation', () => {
    const store = new TokenStore(empty());
    expect(store.current.tokens).toHaveLength(0);
    expect(store.previous).toBeNull();
    store.setToken(token('color.a.500'));
    expect(store.current.tokens).toHaveLength(1);
    expect(store.previous?.tokens).toHaveLength(0);
  });

  it('overwrites the previous buffer on each mutation — no history stack', () => {
    const store = new TokenStore(empty());
    store.setToken(token('color.a.500'));
    store.setToken(token('color.b.500'));
    expect(store.previous?.tokens.map((t) => t.id)).toEqual(['color.a.500']);
    store.setToken(token('color.c.500'));
    expect(store.previous?.tokens.map((t) => t.id).sort()).toEqual(['color.a.500', 'color.b.500']);
  });

  it('undo restores the previous and clears the buffer', () => {
    const store = new TokenStore(empty());
    store.setToken(token('color.a.500'));
    expect(store.current.tokens).toHaveLength(1);
    const event = store.undo();
    expect(event?.kind).toBe('undo');
    expect(store.current.tokens).toHaveLength(0);
    expect(store.previous).toBeNull();
  });

  it('undo returns null when there is no previous', () => {
    const store = new TokenStore(empty());
    expect(store.undo()).toBeNull();
  });

  it('fires the mutation hook with { kind, before, after } on every change', () => {
    const hook = vi.fn();
    const store = new TokenStore(empty(), { onMutation: hook });
    store.setToken(token('color.a.500'));
    store.deleteToken('color.a.500');
    store.undo();
    expect(hook).toHaveBeenCalledTimes(3);
    expect(hook.mock.calls[0]?.[0]?.kind).toBe('set-token');
    expect(hook.mock.calls[1]?.[0]?.kind).toBe('delete-token');
    expect(hook.mock.calls[2]?.[0]?.kind).toBe('undo');
  });

  it('replace swaps the whole manifest atomically', () => {
    const store = new TokenStore(empty());
    const next: TokenSetManifest = { ...empty(), id: 'swapped' };
    store.replace(next);
    expect(store.current.id).toBe('swapped');
  });
});
