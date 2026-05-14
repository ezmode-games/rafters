import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Token } from '@rafters/shared';
import type { Plugin } from './graph.js';
import { TokenRegistry } from './registry.js';

export type NamespaceFile = {
  $schema?: string;
  namespace?: string;
  version?: string;
  generatedAt?: string;
  tokens: unknown[];
};

export function loadRegistryFromDir(dir: string, plugins: readonly Plugin[] = []): TokenRegistry {
  const tokens: unknown[] = [];
  for (const entry of readdirSync(dir)) {
    if (!entry.endsWith('.rafters.json')) continue;
    const path = join(dir, entry);
    const raw = JSON.parse(readFileSync(path, 'utf8'));
    if (raw && Array.isArray(raw.tokens)) {
      tokens.push(...raw.tokens);
    }
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
    const raw = JSON.parse(readFileSync(path, 'utf8'));
    if (raw && Array.isArray(raw.tokens)) {
      for (const token of raw.tokens) {
        if (
          token &&
          typeof token === 'object' &&
          (token as { name?: unknown }).name === tokenName
        ) {
          return path;
        }
      }
    }
  }
  return undefined;
}
