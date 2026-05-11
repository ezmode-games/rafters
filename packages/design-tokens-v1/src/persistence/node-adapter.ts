/**
 * Node.js Persistence Adapter
 *
 * Stores tokens as .rafters.json files in .rafters/tokens/
 * One file per namespace, grouped automatically.
 */

import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { NamespaceFileSchema, type Token } from '@rafters/shared';
import type { NamespaceFile, PersistenceAdapter } from './types.js';

const SCHEMA_URL = 'https://rafters.studio/schemas/namespace-tokens.json';
const VERSION = '1.0.0';

export class NodePersistenceAdapter implements PersistenceAdapter {
  private readonly tokensDir: string;

  constructor(projectRoot: string) {
    this.tokensDir = join(projectRoot, '.rafters', 'tokens');
  }

  async load(): Promise<Token[]> {
    let files: string[];
    try {
      files = await readdir(this.tokensDir);
    } catch {
      return []; // Directory doesn't exist yet
    }

    const allTokens: Token[] = [];

    for (const file of files) {
      if (!file.endsWith('.rafters.json')) continue;

      const content = await readFile(join(this.tokensDir, file), 'utf-8');
      const data = NamespaceFileSchema.parse(JSON.parse(content));
      allTokens.push(...data.tokens);
    }

    return allTokens;
  }

  async save(tokens: Token[]): Promise<void> {
    await mkdir(this.tokensDir, { recursive: true });

    // Group by namespace
    const byNamespace = new Map<string, Token[]>();
    for (const token of tokens) {
      const ns = token.namespace;
      const existing = byNamespace.get(ns);
      if (existing) {
        existing.push(token);
      } else {
        byNamespace.set(ns, [token]);
      }
    }

    // Write each namespace file
    for (const [namespace, nsTokens] of byNamespace) {
      const data: NamespaceFile = {
        $schema: SCHEMA_URL,
        namespace,
        version: VERSION,
        generatedAt: new Date().toISOString(),
        tokens: nsTokens,
      };

      NamespaceFileSchema.parse(data);

      await writeFile(
        join(this.tokensDir, `${namespace}.rafters.json`),
        JSON.stringify(data, null, 2),
      );
    }
  }
}
