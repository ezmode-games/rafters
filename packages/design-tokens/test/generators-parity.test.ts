import { generateBaseSystem as generateV1 } from '@rafters/design-tokens-v1';
import { describe, expect, it } from 'vitest';
import { generateBaseSystem as generateNew } from '../src/generators/index.js';

type AnyToken = Record<string, unknown> & { name: string };

function stripVolatile(t: AnyToken): AnyToken {
  const {
    generatedAt: _generatedAt,
    binding: _binding,
    value,
    ...rest
  } = t as AnyToken & { generatedAt?: string; binding?: unknown; value?: unknown };
  // Color family values now carry `accessibility` (new package only, see #1496).
  // Strip it from the parity comparison so the rest of the token contract
  // stays comparable to v1's output.
  if (value && typeof value === 'object' && 'accessibility' in value) {
    const { accessibility: _accessibility, ...valueRest } = value as Record<string, unknown>;
    return { ...rest, value: valueRest };
  }
  return { ...rest, value };
}

describe('generators parity vs v1', () => {
  it('produces the same token set as v1 generateBaseSystem (positional)', () => {
    const v1 = generateV1();
    const next = generateNew();

    expect(next.allTokens.length).toBe(v1.allTokens.length);

    for (let i = 0; i < next.allTokens.length; i++) {
      const nextToken = next.allTokens[i] as AnyToken;
      const v1Token = v1.allTokens[i] as AnyToken;
      expect(stripVolatile(nextToken), `token #${i} (${nextToken.name})`).toEqual(
        stripVolatile(v1Token),
      );
    }
  });

  it('every namespace has identical token count', () => {
    const v1 = generateV1();
    const next = generateNew();

    expect(Array.from(next.byNamespace.keys()).sort()).toEqual(
      Array.from(v1.byNamespace.keys()).sort(),
    );

    for (const [namespace, tokens] of next.byNamespace) {
      const v1Tokens = v1.byNamespace.get(namespace);
      expect(v1Tokens, `missing v1 namespace ${namespace}`).toBeDefined();
      expect(tokens.length).toBe(v1Tokens?.length);
    }
  });
});
