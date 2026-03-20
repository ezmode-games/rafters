/**
 * Project root discovery
 *
 * Walks up from a starting directory to find the nearest ancestor
 * containing .rafters/config.rafters.json.
 */

import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

/**
 * Discover the rafters project root by walking up from startDir.
 * Returns the directory containing .rafters/config.rafters.json,
 * or null if none found.
 */
export function discoverProjectRoot(startDir: string): string | null {
  let current = resolve(startDir);

  for (;;) {
    const configPath = join(current, '.rafters', 'config.rafters.json');
    if (existsSync(configPath)) {
      return current;
    }

    const parent = dirname(current);
    if (parent === current) {
      // Reached filesystem root
      return null;
    }
    current = parent;
  }
}
