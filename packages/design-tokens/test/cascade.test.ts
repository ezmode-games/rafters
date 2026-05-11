import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { CascadeEngine } from '../src/cascade/index.js';
import { type Plugin, PluginRegistry } from '../src/plugins/index.js';
import { NumberValueSchema, type Token } from '../src/schemas/index.js';
import { TokenRegistry } from '../src/storage/index.js';

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

const setup = () => {
  const registry = new TokenRegistry();
  const plugins = new PluginRegistry();
  plugins.register(scalePlugin);
  const engine = new CascadeEngine(registry, plugins);
  return { registry, plugins, engine };
};

describe('CascadeEngine', () => {
  it('returns unchanged for a root token', () => {
    const { registry, engine } = setup();
    registry.set(makeNumber('spacing.base', 1));
    const step = engine.recompute('spacing.base');
    expect(step.ok).toBe(true);
    if (step.ok) expect(step.changed).toBe(false);
  });

  it('recomputes a single derived token', () => {
    const { registry, engine } = setup();
    registry.set(makeNumber('spacing.base', 1));
    registry.set(
      makeNumber('spacing.lg', 99, [
        { source: 'spacing.base', plugin: 'scale', args: { factor: 1.5 } },
      ]),
    );
    const step = engine.recompute('spacing.lg');
    expect(step.ok).toBe(true);
    if (step.ok) {
      expect(step.changed).toBe(true);
      expect(step.after).toEqual({ kind: 'number', value: 1.5, unit: 'rem' });
    }
    expect(registry.get('spacing.lg')?.value).toEqual({ kind: 'number', value: 1.5, unit: 'rem' });
  });

  it('fullRun processes the graph in topo order', () => {
    const { registry, engine } = setup();
    registry.set(makeNumber('spacing.base', 1));
    registry.set(
      makeNumber('spacing.md', 0, [
        { source: 'spacing.base', plugin: 'scale', args: { factor: 2 } },
      ]),
    );
    registry.set(
      makeNumber('spacing.lg', 0, [
        { source: 'spacing.md', plugin: 'scale', args: { factor: 1.5 } },
      ]),
    );
    const result = engine.fullRun();
    expect(result.recomputed).toEqual(['spacing.md', 'spacing.lg']);
    expect(result.changed).toEqual(['spacing.md', 'spacing.lg']);
    expect(registry.get('spacing.lg')?.value).toEqual({ kind: 'number', value: 3, unit: 'rem' });
  });

  it('propagate recomputes only the affected subgraph', () => {
    const { registry, engine } = setup();
    registry.set(makeNumber('spacing.base', 1));
    registry.set(makeNumber('color.base', 7));
    registry.set(
      makeNumber('spacing.md', 0, [
        { source: 'spacing.base', plugin: 'scale', args: { factor: 2 } },
      ]),
    );
    engine.fullRun(); // settle
    registry.set(makeNumber('spacing.base', 4)); // root change
    const result = engine.propagate(['spacing.base']);
    expect(result.recomputed).toEqual(['spacing.md']);
    expect(registry.get('spacing.md')?.value).toEqual({ kind: 'number', value: 8, unit: 'rem' });
  });

  it('reports unknown-plugin without aborting other recomputes', () => {
    const { registry, engine } = setup();
    registry.set(makeNumber('spacing.base', 1));
    registry.set(
      makeNumber('spacing.lg', 0, [{ source: 'spacing.base', plugin: 'missing', args: {} }]),
    );
    const result = engine.fullRun();
    expect(result.issues.some((i) => i.code === 'unknown-plugin')).toBe(true);
  });

  it('reports multi-source-not-supported when a token has multiple edges', () => {
    const { registry, engine } = setup();
    registry.set(makeNumber('spacing.base', 1));
    registry.set(makeNumber('color.base', 7));
    registry.set(
      makeNumber('spacing.combo', 0, [
        { source: 'spacing.base', plugin: 'scale', args: { factor: 2 } },
        { source: 'color.base', plugin: 'scale', args: { factor: 3 } },
      ]),
    );
    const step = engine.recompute('spacing.combo');
    expect(step.ok).toBe(false);
    if (!step.ok) expect(step.issues[0]?.code).toBe('multi-source-not-supported');
  });

  it('reports missing-source when the dependency is not in the registry', () => {
    const { registry, engine } = setup();
    registry.set(
      makeNumber('spacing.lg', 0, [
        { source: 'spacing.nope', plugin: 'scale', args: { factor: 1 } },
      ]),
    );
    const step = engine.recompute('spacing.lg');
    expect(step.ok).toBe(false);
    if (!step.ok) expect(step.issues[0]?.code).toBe('missing-source');
  });

  it('is idempotent — running fullRun twice produces the same state', () => {
    const { registry, engine } = setup();
    registry.set(makeNumber('spacing.base', 1));
    registry.set(
      makeNumber('spacing.lg', 0, [
        { source: 'spacing.base', plugin: 'scale', args: { factor: 1.5 } },
      ]),
    );
    const first = engine.fullRun();
    const second = engine.fullRun();
    expect(first.changed).toEqual(['spacing.lg']);
    expect(second.changed).toEqual([]);
  });
});
