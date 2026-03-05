import { describe, expect, it } from 'vitest';
import type { CompositeFile } from '../src/manifest';
import { findCompatibleConsumers, findCompatibleProducers, matchRules } from '../src/rules';

function makeComposite(
  overrides: Partial<Pick<CompositeFile, 'input' | 'output'>> & {
    id?: string;
  } = {},
): CompositeFile {
  return {
    manifest: {
      id: overrides.id ?? 'test',
      name: 'Test',
      category: 'widget',
      description: 'test',
      keywords: [],
      cognitiveLoad: 1,
    },
    input: overrides.input ?? [],
    output: overrides.output ?? [],
    blocks: [{ id: '1', type: 'text' }],
  };
}

describe('matchRules', () => {
  it('returns full match when producer satisfies all consumer inputs', () => {
    const producer = makeComposite({ output: ['email', 'password'] });
    const consumer = makeComposite({ input: ['email', 'password'] });
    const result = matchRules(producer, consumer);
    expect(result.matched).toEqual(['email', 'password']);
    expect(result.missing).toEqual([]);
    expect(result.extra).toEqual([]);
    expect(result.compatible).toBe(true);
  });

  it('returns partial match with missing rules', () => {
    const producer = makeComposite({ output: ['email'] });
    const consumer = makeComposite({ input: ['email', 'password'] });
    const result = matchRules(producer, consumer);
    expect(result.matched).toEqual(['email']);
    expect(result.missing).toEqual(['password']);
    expect(result.extra).toEqual([]);
    expect(result.compatible).toBe(false);
  });

  it('returns extra rules when producer has more than consumer needs', () => {
    const producer = makeComposite({ output: ['email', 'password', 'token'] });
    const consumer = makeComposite({ input: ['email', 'password'] });
    const result = matchRules(producer, consumer);
    expect(result.matched).toEqual(['email', 'password']);
    expect(result.missing).toEqual([]);
    expect(result.extra).toEqual(['token']);
    expect(result.compatible).toBe(true);
  });

  it('is compatible when consumer has empty input', () => {
    const producer = makeComposite({ output: ['email'] });
    const consumer = makeComposite({ input: [] });
    const result = matchRules(producer, consumer);
    expect(result.compatible).toBe(true);
    expect(result.matched).toEqual([]);
    expect(result.extra).toEqual(['email']);
  });

  it('is compatible when both have empty I/O', () => {
    const producer = makeComposite({ output: [] });
    const consumer = makeComposite({ input: [] });
    expect(matchRules(producer, consumer).compatible).toBe(true);
  });

  it('is incompatible when producer has empty output but consumer has input', () => {
    const producer = makeComposite({ output: [] });
    const consumer = makeComposite({ input: ['email'] });
    const result = matchRules(producer, consumer);
    expect(result.compatible).toBe(false);
    expect(result.missing).toEqual(['email']);
  });

  it('compares rule names case-sensitively', () => {
    const producer = makeComposite({ output: ['Email'] });
    const consumer = makeComposite({ input: ['email'] });
    const result = matchRules(producer, consumer);
    expect(result.compatible).toBe(false);
    expect(result.missing).toEqual(['email']);
    expect(result.extra).toEqual(['Email']);
  });

  it('handles no overlap between producer and consumer', () => {
    const producer = makeComposite({ output: ['x', 'y'] });
    const consumer = makeComposite({ input: ['a', 'b'] });
    const result = matchRules(producer, consumer);
    expect(result.matched).toEqual([]);
    expect(result.missing).toEqual(['a', 'b']);
    expect(result.extra).toEqual(['x', 'y']);
    expect(result.compatible).toBe(false);
  });
});

describe('findCompatibleConsumers', () => {
  it('returns consumers whose inputs are satisfied by producer output', () => {
    const producer = makeComposite({ output: ['email', 'password'] });
    const loginForm = makeComposite({ id: 'login', input: ['email', 'password'] });
    const dashboard = makeComposite({ id: 'dash', input: ['credentials', 'session'] });
    const anyConsumer = makeComposite({ id: 'any', input: [] });

    const consumers = findCompatibleConsumers(producer, [loginForm, dashboard, anyConsumer]);
    const ids = consumers.map((c) => c.manifest.id);
    expect(ids).toContain('login');
    expect(ids).toContain('any');
    expect(ids).not.toContain('dash');
  });

  it('returns empty array when no candidates match', () => {
    const producer = makeComposite({ output: ['x'] });
    const consumer = makeComposite({ id: 'c', input: ['y'] });
    expect(findCompatibleConsumers(producer, [consumer])).toEqual([]);
  });

  it('returns empty array for empty candidates', () => {
    const producer = makeComposite({ output: ['x'] });
    expect(findCompatibleConsumers(producer, [])).toEqual([]);
  });
});

describe('findCompatibleProducers', () => {
  it('returns producers whose output satisfies consumer input', () => {
    const consumer = makeComposite({ input: ['credentials'] });
    const loginForm = makeComposite({ id: 'login', output: ['credentials'] });
    const emailInput = makeComposite({ id: 'email', output: ['email'] });

    const producers = findCompatibleProducers(consumer, [loginForm, emailInput]);
    const ids = producers.map((p) => p.manifest.id);
    expect(ids).toContain('login');
    expect(ids).not.toContain('email');
  });

  it('returns all candidates when consumer has empty input', () => {
    const consumer = makeComposite({ input: [] });
    const a = makeComposite({ id: 'a', output: ['x'] });
    const b = makeComposite({ id: 'b', output: [] });

    const producers = findCompatibleProducers(consumer, [a, b]);
    expect(producers).toHaveLength(2);
  });

  it('returns empty array for empty candidates', () => {
    const consumer = makeComposite({ input: ['x'] });
    expect(findCompatibleProducers(consumer, [])).toEqual([]);
  });
});
