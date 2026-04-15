/**
 * Ensures @rafters/design-tokens core has no imports from color-domain packages.
 * This maintains the architectural boundary: the plugin protocol is domain-agnostic,
 * color knowledge lives in @rafters/color-utils.
 *
 * Excluded from check:
 * - generators/ -- these are consumers that produce base tokens, need color/math utils
 * - plugins/ -- calc.ts needs math-utils for expression evaluation
 */

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const SRC_DIR = join(__dirname, '../src');

const FORBIDDEN_IMPORTS = ['@rafters/color-utils'];

// Directories that are allowed to import domain packages (they are consumers)
const EXCLUDED_DIRS = ['generators', 'plugins'];

async function collectTsFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip excluded directories
      if (EXCLUDED_DIRS.includes(entry.name)) continue;
      files.push(...(await collectTsFiles(fullPath)));
    } else if (entry.name.endsWith('.ts')) {
      files.push(fullPath);
    }
  }

  return files;
}

describe('forbidden imports', () => {
  it('design-tokens core has no imports from color-utils', async () => {
    const files = await collectTsFiles(SRC_DIR);
    const violations: string[] = [];

    for (const file of files) {
      const content = await readFile(file, 'utf-8');
      for (const forbidden of FORBIDDEN_IMPORTS) {
        if (content.includes(`from '${forbidden}'`) || content.includes(`from "${forbidden}"`)) {
          const relativePath = file.replace(SRC_DIR, 'src');
          violations.push(`${relativePath} imports ${forbidden}`);
        }
      }
    }

    expect(violations, `Forbidden imports found:\n${violations.join('\n')}`).toEqual([]);
  });
});
