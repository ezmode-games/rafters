import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { derive, type Plugin, PluginRegistry } from '../src/plugins/index.js';
import { NumberValueSchema, TokenValueSchema } from '../src/schemas/index.js';

const scalePlugin: Plugin<{ factor: number }, z.infer<typeof NumberValueSchema>> = {
  id: 'scale',
  version: '1.0.0',
  description: 'Multiply a number value by a factor.',
  argsSchema: z.object({ factor: z.number() }),
  outputSchema: NumberValueSchema,
  derive(source, args) {
    if (source.kind !== 'number') {
      throw new Error(`scale: source must be number, got ${source.kind}`);
    }
    return { kind: 'number', value: source.value * args.factor, unit: source.unit };
  },
};

const brokenPlugin: Plugin<Record<string, never>, z.infer<typeof TokenValueSchema>> = {
  id: 'broken',
  version: '0.0.1',
  description: 'Returns garbage.',
  argsSchema: z.object({}),
  outputSchema: TokenValueSchema,
  derive() {
    return { kind: 'not-a-real-kind' } as unknown as z.infer<typeof TokenValueSchema>;
  },
};

describe('PluginRegistry', () => {
  it('registers and looks up plugins by id', () => {
    const r = new PluginRegistry();
    r.register(scalePlugin);
    expect(r.has('scale')).toBe(true);
    expect(r.get('scale')?.id).toBe('scale');
    expect(r.ids()).toEqual(['scale']);
  });

  it('refuses duplicate ids', () => {
    const r = new PluginRegistry();
    r.register(scalePlugin);
    expect(() => r.register(scalePlugin)).toThrow(/duplicate plugin/);
  });

  it('emits manifests with the expected shape', () => {
    const r = new PluginRegistry();
    r.register(scalePlugin);
    const [manifest] = r.manifests();
    expect(manifest).toMatchObject({
      id: 'scale',
      kind: 'derive',
      version: '1.0.0',
      description: 'Multiply a number value by a factor.',
    });
  });
});

describe('derive()', () => {
  it('returns ok and the validated value on success', () => {
    const result = derive(
      scalePlugin,
      { kind: 'number', value: 4, unit: 'rem' },
      { factor: 1.5 },
      'spacing.lg',
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({ kind: 'number', value: 6, unit: 'rem' });
    }
  });

  it('returns invalid-args when dependency args fail the plugin schema', () => {
    const result = derive(
      scalePlugin,
      { kind: 'number', value: 4, unit: 'rem' },
      { factor: 'nope' },
      'spacing.lg',
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('invalid-args');
  });

  it('returns derive-threw when the plugin function throws', () => {
    const result = derive(
      scalePlugin,
      { kind: 'string', value: 'oops' },
      { factor: 2 },
      'spacing.lg',
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('derive-threw');
  });

  it('returns invalid-output when the plugin violates its output contract', () => {
    const result = derive(brokenPlugin, { kind: 'number', value: 1, unit: 'px' }, {}, 'spacing.lg');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('invalid-output');
  });
});
