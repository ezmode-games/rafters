import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  fullRun,
  getToken,
  NumberValueSchema,
  type Plugin,
  PluginRegistry,
  propagate,
  recompute,
  setToken,
  setTokens,
  type Token,
  type TokenSetManifest,
} from '../src/index.js';

const scalePlugin: Plugin<{ factor: number }, z.infer<typeof NumberValueSchema>> = {
  id: 'scale',
  version: '1.0.0',
  description: 'Multiply.',
  argsSchema: z.object({ factor: z.number() }),
  outputSchema: NumberValueSchema,
  derive(source, args) {
    if (source.kind !== 'number') throw new Error('source must be number');
    return { kind: 'number', value: source.value * args.factor, unit: source.unit };
  },
};

const makeNumber = (
  id: string,
  value: number,
  deps: { source: string; plugin: string; args: unknown }[] = [],
): Token => ({
  id,
  namespace: id.split('.')[0] as Token['namespace'],
  value: { kind: 'number', value, unit: 'rem' },
  dependsOn: deps.map((d) => ({
    source: d.source,
    plugin: d.plugin,
    args: d.args as Record<string, unknown>,
  })),
  metadata: {},
  source: deps.length === 0 ? 'default' : 'plugin',
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

const setup = () => {
  const plugins = new PluginRegistry();
  plugins.register(scalePlugin);
  return { plugins };
};

describe('cascade (functional)', () => {
  it('returns unchanged for a root token', () => {
    const { plugins } = setup();
    const m = setToken(empty(), makeNumber('spacing.base', 1));
    const { manifest, step } = recompute(m, 'spacing.base', plugins);
    expect(step.ok).toBe(true);
    if (step.ok) expect(step.changed).toBe(false);
    expect(manifest).toBe(m);
  });

  it('recomputes a single derived token, returning a new manifest', () => {
    const { plugins } = setup();
    const m = setTokens(empty(), [
      makeNumber('spacing.base', 1),
      makeNumber('spacing.lg', 99, [
        { source: 'spacing.base', plugin: 'scale', args: { factor: 1.5 } },
      ]),
    ]);
    const { manifest, step } = recompute(m, 'spacing.lg', plugins);
    expect(step.ok).toBe(true);
    if (step.ok) expect(step.changed).toBe(true);
    expect(getToken(manifest, 'spacing.lg')?.value).toEqual({
      kind: 'number',
      value: 1.5,
      unit: 'rem',
    });
    expect(manifest).not.toBe(m);
  });

  it('fullRun processes the graph in topo order', () => {
    const { plugins } = setup();
    const m = setTokens(empty(), [
      makeNumber('spacing.base', 1),
      makeNumber('spacing.md', 0, [
        { source: 'spacing.base', plugin: 'scale', args: { factor: 2 } },
      ]),
      makeNumber('spacing.lg', 0, [
        { source: 'spacing.md', plugin: 'scale', args: { factor: 1.5 } },
      ]),
    ]);
    const result = fullRun(m, plugins);
    expect(result.recomputed).toEqual(['spacing.md', 'spacing.lg']);
    expect(result.changed).toEqual(['spacing.md', 'spacing.lg']);
    expect(getToken(result.manifest, 'spacing.lg')?.value).toEqual({
      kind: 'number',
      value: 3,
      unit: 'rem',
    });
  });

  it('propagate recomputes only the affected subgraph', () => {
    const { plugins } = setup();
    const m1 = setTokens(empty(), [
      makeNumber('spacing.base', 1),
      makeNumber('color.base', 7),
      makeNumber('spacing.md', 0, [
        { source: 'spacing.base', plugin: 'scale', args: { factor: 2 } },
      ]),
    ]);
    const settled = fullRun(m1, plugins).manifest;
    const m2 = setToken(settled, makeNumber('spacing.base', 4));
    const result = propagate(m2, ['spacing.base'], plugins);
    expect(result.recomputed).toEqual(['spacing.md']);
    expect(getToken(result.manifest, 'spacing.md')?.value).toEqual({
      kind: 'number',
      value: 8,
      unit: 'rem',
    });
  });

  it('reports unknown-plugin without aborting other recomputes', () => {
    const { plugins } = setup();
    const m = setTokens(empty(), [
      makeNumber('spacing.base', 1),
      makeNumber('spacing.lg', 0, [{ source: 'spacing.base', plugin: 'missing', args: {} }]),
    ]);
    const result = fullRun(m, plugins);
    expect(result.issues.some((i) => i.code === 'unknown-plugin')).toBe(true);
  });

  it('reports multi-source-not-supported when a token has multiple edges', () => {
    const { plugins } = setup();
    const m = setTokens(empty(), [
      makeNumber('spacing.base', 1),
      makeNumber('color.base', 7),
      makeNumber('spacing.combo', 0, [
        { source: 'spacing.base', plugin: 'scale', args: { factor: 2 } },
        { source: 'color.base', plugin: 'scale', args: { factor: 3 } },
      ]),
    ]);
    const { step } = recompute(m, 'spacing.combo', plugins);
    expect(step.ok).toBe(false);
    if (!step.ok) expect(step.issues[0]?.code).toBe('multi-source-not-supported');
  });

  it('reports missing-source when the dependency is not in the manifest', () => {
    const { plugins } = setup();
    const m = setToken(
      empty(),
      makeNumber('spacing.lg', 0, [
        { source: 'spacing.nope', plugin: 'scale', args: { factor: 1 } },
      ]),
    );
    const { step } = recompute(m, 'spacing.lg', plugins);
    expect(step.ok).toBe(false);
    if (!step.ok) expect(step.issues[0]?.code).toBe('missing-source');
  });

  it('is idempotent — running fullRun twice produces zero changes the second time', () => {
    const { plugins } = setup();
    const m = setTokens(empty(), [
      makeNumber('spacing.base', 1),
      makeNumber('spacing.lg', 0, [
        { source: 'spacing.base', plugin: 'scale', args: { factor: 1.5 } },
      ]),
    ]);
    const first = fullRun(m, plugins);
    const second = fullRun(first.manifest, plugins);
    expect(first.changed).toEqual(['spacing.lg']);
    expect(second.changed).toEqual([]);
  });
});
