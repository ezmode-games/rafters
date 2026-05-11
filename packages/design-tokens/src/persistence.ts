import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { NamespaceFileSchema, type Token } from '@rafters/shared';

/**
 * Persistence seam. The OSS default is NodePersistenceAdapter (one file per
 * namespace under `.rafters/tokens/`). The commercial Rafters+ host swaps in its
 * own adapter to record changes to its cloud for deep history. Adapters never
 * implement granular event tracking — that comes through TokenRegistry.onMutation.
 */
export interface PersistenceAdapter {
  load(): Promise<Token[]>;
  save(tokens: Token[]): Promise<void>;
}

/** Writes one file per namespace under `${projectRoot}/.rafters/tokens/`. */
export class NodePersistenceAdapter implements PersistenceAdapter {
  private readonly tokensDir: string;

  constructor(projectRoot: string) {
    this.tokensDir = join(projectRoot, '.rafters', 'tokens');
  }

  async load(): Promise<Token[]> {
    let entries: string[];
    try {
      entries = await readdir(this.tokensDir);
    } catch {
      return [];
    }
    const files = entries.filter((f) => f.endsWith('.rafters.json'));
    const out: Token[] = [];
    for (const file of files) {
      const raw = await readFile(join(this.tokensDir, file), 'utf8');
      const json: unknown = JSON.parse(raw);
      const parsed = NamespaceFileSchema.parse(json);
      out.push(...parsed.tokens);
    }
    return out;
  }

  async save(tokens: readonly Token[]): Promise<void> {
    await mkdir(this.tokensDir, { recursive: true });
    const byNamespace = new Map<string, Token[]>();
    for (const token of tokens) {
      const bucket = byNamespace.get(token.namespace) ?? [];
      bucket.push(token);
      byNamespace.set(token.namespace, bucket);
    }
    const timestamp = new Date().toISOString();
    for (const [namespace, nsTokens] of byNamespace) {
      const file = {
        $schema: 'https://rafters.studio/schemas/namespace-tokens.json',
        namespace,
        version: '1.0.0',
        generatedAt: timestamp,
        tokens: nsTokens,
      };
      const validated = NamespaceFileSchema.parse(file);
      await writeFile(
        join(this.tokensDir, `${namespace}.rafters.json`),
        `${JSON.stringify(validated, null, 2)}\n`,
        'utf8',
      );
    }
  }
}
