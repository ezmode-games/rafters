/**
 * rafters studio
 *
 * Opens Studio UI for visual token editing.
 * Studio is a static React app using File System Access API.
 */

import { existsSync } from 'node:fs';
import { getRaftersPaths } from '../utils/paths.js';

export async function studio(): Promise<void> {
  const cwd = process.cwd();
  const paths = getRaftersPaths(cwd);

  // Check if .rafters/ exists
  if (!existsSync(paths.root)) {
    console.error({
      event: 'studio:error',
      error: 'No .rafters/ directory found. Run "rafters init" first.',
    });
    process.exit(1);
  }

  console.log({
    event: 'studio:start',
    cwd,
  });

  // TODO: Open bundled studio HTML file
  // For now, log that it's not yet built
  console.log({
    event: 'studio:not_built',
    message: 'Studio app not yet bundled. See packages/studio.',
  });
}
