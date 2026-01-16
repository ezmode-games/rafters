/**
 * rafters studio
 *
 * Opens Studio UI for visual token editing.
 * Spawns Vite dev server from @rafters/studio package.
 */

import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execa } from 'execa';
import { getRaftersPaths } from '../utils/paths.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function studio(): Promise<void> {
  const cwd = process.cwd();
  const paths = getRaftersPaths(cwd);

  // Check if .rafters/ exists
  if (!existsSync(paths.root)) {
    console.error('No .rafters/ directory found. Run "rafters init" first.');
    process.exit(1);
  }

  // Find studio package - in dev it's at ../../../studio, in prod it's in node_modules
  const devStudioPath = join(__dirname, '..', '..', '..', 'studio');
  const prodStudioPath = join(__dirname, '..', 'node_modules', '@rafters', 'studio');

  const studioPath = existsSync(devStudioPath) ? devStudioPath : prodStudioPath;

  if (!existsSync(studioPath)) {
    console.error('Studio package not found. Please reinstall @rafters/cli.');
    process.exit(1);
  }

  console.log('Starting Rafters Studio...');
  console.log(`Project: ${cwd}`);
  console.log(`Tokens: ${paths.tokens}`);
  console.log('');

  // Spawn Vite dev server with project context
  const subprocess = execa('pnpm', ['dev'], {
    cwd: studioPath,
    stdio: 'inherit',
    env: {
      ...process.env,
      RAFTERS_PROJECT_PATH: cwd,
      RAFTERS_TOKENS_PATH: paths.tokens,
    },
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    subprocess.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    subprocess.kill('SIGTERM');
  });

  await subprocess;
}
