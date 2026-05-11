import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { type Plugin, parseGenerationRule, runPlugin } from '../src/index.js';

describe('parseGenerationRule', () => {
  it('parses bare tag', () => {
    expect(parseGenerationRule('scale')).toEqual({ rule: 'scale', rawArgs: undefined });
  });

  it('parses colon-arg form', () => {
    expect(parseGenerationRule('scale:500')).toEqual({ rule: 'scale', rawArgs: '500' });
  });

  it('parses parens form', () => {
    expect(parseGenerationRule('calc({base}*2)')).toEqual({ rule: 'calc', rawArgs: '{base}*2' });
  });

  it('parses state tag', () => {
    expect(parseGenerationRule('state:hover')).toEqual({ rule: 'state', rawArgs: 'hover' });
  });
});

describe('runPlugin', () => {
  const plugin: Plugin<{ factor: number }, string> = {
    id: 'scale',
    rule: 'scale',
    argsSchema: z.object({ factor: z.number() }),
    outputSchema: z.string(),
    derive(source, args) {
      if (typeof source !== 'string') throw new Error('source must be string');
      return String(Number.parseFloat(source) * args.factor);
    },
  };

  it('returns ok and the validated value on success', () => {
    const result = runPlugin(plugin, '4', { factor: 1.5 }, 'spacing.lg');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe('6');
  });

  it('returns invalid-args when args fail schema', () => {
    const result = runPlugin(plugin, '4', { factor: 'nope' }, 'spacing.lg');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.failure.code).toBe('invalid-args');
  });

  it('returns derive-threw when plugin throws', () => {
    const result = runPlugin(plugin, { name: 'x', scale: [] }, { factor: 2 }, 'spacing.lg');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.failure.code).toBe('derive-threw');
  });

  it('returns invalid-output when plugin violates its output contract', () => {
    const broken: Plugin<Record<string, never>, string> = {
      id: 'broken',
      rule: 'broken',
      argsSchema: z.object({}),
      outputSchema: z.string(),
      derive: () => 42 as unknown as string,
    };
    const result = runPlugin(broken, '0', {}, 'x');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.failure.code).toBe('invalid-output');
  });
});
