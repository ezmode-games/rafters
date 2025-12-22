/**
 * Node.js Persistence Adapter
 *
 * Reads/writes token files to the filesystem in .rafters/tokens/ directory.
 */

import { access, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
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

  private getFilePath(namespace: string): string {
    return join(this.tokensDir, `${namespace}.rafters.json`);
  }

  async loadNamespace(namespace: string): Promise<Token[]> {
    const filePath = this.getFilePath(namespace);
    const content = await readFile(filePath, 'utf-8');
    const json = JSON.parse(content);

    // Validate with Zod schema
    const data = NamespaceFileSchema.parse(json);
    return data.tokens;
  }

  async saveNamespace(namespace: string, tokens: Token[]): Promise<void> {
    await mkdir(this.tokensDir, { recursive: true });

    const filePath = this.getFilePath(namespace);
    const data: NamespaceFile = {
      $schema: SCHEMA_URL,
      namespace,
      version: VERSION,
      generatedAt: new Date().toISOString(),
      tokens,
    };

    // Validate before writing
    NamespaceFileSchema.parse(data);

    await writeFile(filePath, JSON.stringify(data, null, 2));
  }

  async listNamespaces(): Promise<string[]> {
    try {
      const files = await readdir(this.tokensDir);
      const namespaces: string[] = [];

      for (const file of files) {
        if (file.endsWith('.rafters.json')) {
          namespaces.push(file.replace('.rafters.json', ''));
        }
      }

      return namespaces;
    } catch {
      // Directory does not exist
      return [];
    }
  }

  async namespaceExists(namespace: string): Promise<boolean> {
    try {
      await access(this.getFilePath(namespace));
      return true;
    } catch {
      return false;
    }
  }
}
