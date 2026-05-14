import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { type Token, TokenSchema } from '@rafters/shared';
import { z } from 'zod';
import type { Plugin } from './graph.js';
import { TokenRegistry } from './registry.js';

const RawTokenObject = z.looseObject({});
const RawNamespaceFileSchema = z.object({
  $schema: z.string().optional(),
  namespace: z.string(),
  version: z.string().optional(),
  generatedAt: z.string().optional(),
  tokens: z.array(RawTokenObject),
});

const NamespaceFileSchema = z.object({
  $schema: z.string().optional(),
  namespace: z.string(),
  version: z.string().optional(),
  generatedAt: z.string().optional(),
  tokens: z.array(TokenSchema),
});

export type NamespaceFile = z.infer<typeof NamespaceFileSchema>;

export class NamespaceFileParseError extends Error {
  constructor(
    public readonly path: string,
    public readonly issues: readonly z.core.$ZodIssue[],
  ) {
    const first = issues[0];
    const detail = first ? `${first.path.join('.')}: ${first.message}` : 'unknown';
    super(
      `Failed to parse ${path} as a NamespaceFile (${issues.length} issue(s); first: ${detail})`,
    );
    this.name = 'NamespaceFileParseError';
  }
}

export function loadRegistryFromDir(dir: string, plugins: readonly Plugin[] = []): TokenRegistry {
  const tokens: Token[] = [];
  for (const entry of readdirSync(dir)) {
    if (!entry.endsWith('.rafters.json')) continue;
    const path = join(dir, entry);
    tokens.push(...readNamespaceFile(path).tokens);
  }
  return new TokenRegistry(tokens, plugins);
}

export function saveRegistryToDir(dir: string, registry: TokenRegistry): void {
  const byNamespace = new Map<string, Token[]>();
  for (const token of registry.list()) {
    const list = byNamespace.get(token.namespace) ?? [];
    list.push(token);
    byNamespace.set(token.namespace, list);
  }
  for (const [namespace, tokens] of byNamespace) {
    const file: NamespaceFile = {
      $schema: 'https://rafters.studio/schemas/namespace-tokens.json',
      namespace,
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      tokens,
    };
    const path = join(dir, `${namespace}.rafters.json`);
    writeFileSync(path, `${JSON.stringify(file, null, 2)}\n`, 'utf8');
  }
}

export function findTokenFile(dir: string, tokenName: string): string | undefined {
  for (const entry of readdirSync(dir)) {
    if (!entry.endsWith('.rafters.json')) continue;
    const path = join(dir, entry);
    if (!statSync(path).isFile()) continue;
    if (readNamespaceFile(path).tokens.some((t) => t.name === tokenName)) return path;
  }
  return undefined;
}

function readNamespaceFile(path: string): NamespaceFile {
  const raw = readFileSync(path, 'utf8');
  const rawParsed = RawNamespaceFileSchema.safeParse(JSON.parse(raw));
  if (!rawParsed.success) {
    throw new NamespaceFileParseError(path, rawParsed.error.issues);
  }
  const tokens = rawParsed.data.tokens.map(coerceLegacyToken);
  const result = NamespaceFileSchema.safeParse({ ...rawParsed.data, tokens });
  if (!result.success) {
    throw new NamespaceFileParseError(path, result.error.issues);
  }
  return result.data;
}

function coerceLegacyToken(raw: Record<string, unknown>): Record<string, unknown> {
  if (!('userOverride' in raw)) {
    return { ...raw, userOverride: null };
  }
  return raw;
}
