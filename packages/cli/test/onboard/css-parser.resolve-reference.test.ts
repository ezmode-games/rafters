/**
 * Tests for `resolveReference` -- the var() chain walker added in #1404.
 *
 * The importer uses this to preserve designer intent encoded as
 * `--primary: var(--empire-500)` rather than flat-lifting the var() string
 * as a literal token value.
 */

import { describe, expect, it } from 'vitest';
import { type CSSVariable, MAX_VAR_DEPTH, resolveReference } from '../../src/onboard/css-parser.js';

function variable(
  name: string,
  value: string,
  context: CSSVariable['context'] = 'root',
): CSSVariable {
  return {
    name,
    value,
    context,
    selector: ':root',
    mediaQuery: undefined,
    line: 1,
    column: 1,
  };
}

describe('resolveReference', () => {
  it('resolves a direct var() reference and reports the source var name', () => {
    const variables = [
      variable('--empire-500', 'oklch(0.55 0.18 350)'),
      variable('--primary', 'var(--empire-500)'),
    ];

    const result = resolveReference('--primary', variables);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toBe('oklch(0.55 0.18 350)');
    expect(result.sourceReference).toBe('--empire-500');
    expect(result.chain).toEqual(['--primary', '--empire-500']);
  });

  it('returns sourceReference null when the var is itself a literal', () => {
    const variables = [variable('--empire-500', 'oklch(0.55 0.18 350)')];

    const result = resolveReference('--empire-500', variables);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toBe('oklch(0.55 0.18 350)');
    expect(result.sourceReference).toBeNull();
  });

  it('walks a multi-hop chain to the leaf value', () => {
    const variables = [
      variable('--empire-500', 'oklch(0.55 0.18 350)'),
      variable('--brand-primary', 'var(--empire-500)'),
      variable('--primary', 'var(--brand-primary)'),
    ];

    const result = resolveReference('--primary', variables);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toBe('oklch(0.55 0.18 350)');
    expect(result.chain).toEqual(['--primary', '--brand-primary', '--empire-500']);
  });

  it('detects a cycle and reports the chain', () => {
    const variables = [
      variable('--a', 'var(--b)'),
      variable('--b', 'var(--c)'),
      variable('--c', 'var(--a)'),
    ];

    const result = resolveReference('--a', variables);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toBe('cycle');
    expect(result.chain).toEqual(['--a', '--b', '--c', '--a']);
  });

  it('reports max-depth when the chain is longer than MAX_VAR_DEPTH', () => {
    // Build a longer-than-MAX_VAR_DEPTH chain
    const variables: CSSVariable[] = [];
    for (let i = 0; i < MAX_VAR_DEPTH + 2; i += 1) {
      variables.push(variable(`--v${i}`, `var(--v${i + 1})`));
    }
    variables.push(variable(`--v${MAX_VAR_DEPTH + 2}`, 'leaf'));

    const result = resolveReference('--v0', variables);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toBe('max-depth');
    expect(result.chain).toHaveLength(MAX_VAR_DEPTH + 1);
  });

  it('reports unresolved when the target var is missing', () => {
    const variables = [variable('--primary', 'var(--does-not-exist)')];

    const result = resolveReference('--primary', variables);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toBe('unresolved');
    expect(result.chain).toEqual(['--primary', '--does-not-exist']);
  });

  it('handles a var() with a fallback expression and still extracts the target', () => {
    const variables = [
      variable('--empire-500', 'oklch(0.55 0.18 350)'),
      variable('--primary', 'var(--empire-500, #ff0000)'),
    ];

    const result = resolveReference('--primary', variables);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toBe('oklch(0.55 0.18 350)');
    expect(result.sourceReference).toBe('--empire-500');
  });

  it('prefers the light-mode definition when both light and dark variants exist', () => {
    const variables = [
      variable('--primary', 'var(--empire-500)', 'root'),
      variable('--primary', 'var(--empire-300)', 'dark'),
      variable('--empire-500', 'oklch(0.55 0.18 350)'),
      variable('--empire-300', 'oklch(0.75 0.12 350)'),
    ];

    const result = resolveReference('--primary', variables);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toBe('oklch(0.55 0.18 350)');
    expect(result.sourceReference).toBe('--empire-500');
  });
});
