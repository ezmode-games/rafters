import type { Token } from '@rafters/shared';
import { z } from 'zod';
import type { Plugin } from '../src/index.js';

export function baseToken(partial: Partial<Token> & { name: string }): Token {
  return {
    name: partial.name,
    value: partial.value ?? '0',
    category: partial.category ?? 'spacing',
    namespace: partial.namespace ?? 'spacing',
    userOverride: partial.userOverride ?? null,
    ...partial,
  } as Token;
}

export const doublePlugin: Plugin<undefined, string> = {
  id: 'double',
  rule: 'double',
  argsSchema: z.undefined(),
  outputSchema: z.string(),
  derive(source) {
    if (typeof source !== 'string') throw new Error('source must be string');
    return String(Number.parseFloat(source) * 2);
  },
};

export const factorPlugin: Plugin<string, string> = {
  id: 'factor',
  rule: 'factor',
  argsSchema: z.string(),
  outputSchema: z.string(),
  derive(source, args) {
    if (typeof source !== 'string') throw new Error('source must be string');
    return String(Number.parseFloat(source) * Number.parseFloat(args));
  },
};
