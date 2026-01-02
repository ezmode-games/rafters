/**
 * rafters add
 *
 * Adds rafters components to the project (drop-in shadcn replacements).
 * Fetches component definitions from the registry and writes to project.
 */

import { access } from 'node:fs/promises';
import { getRaftersPaths } from '../utils/paths.js';

export interface AddOptions {
  overwrite?: boolean;
}

/**
 * Check if .rafters/ directory exists
 */
async function isInitialized(cwd: string): Promise<boolean> {
  const paths = getRaftersPaths(cwd);
  try {
    await access(paths.root);
    return true;
  } catch {
    return false;
  }
}

/**
 * Add one or more components to the project
 */
export async function add(components: string[], options: AddOptions): Promise<void> {
  const cwd = process.cwd();

  // Validate that .rafters/ exists
  const initialized = await isInitialized(cwd);
  if (!initialized) {
    console.error('Error: Project not initialized. Run `rafters init` first.');
    process.exitCode = 1;
    return;
  }

  // Validate that at least one component is specified
  if (components.length === 0) {
    console.error('Error: No components specified. Usage: rafters add <component...>');
    process.exitCode = 1;
    return;
  }

  console.log({
    event: 'add:start',
    cwd,
    components,
    overwrite: options.overwrite ?? false,
  });

  // TODO: Fetch component definitions from registry
  // TODO: Check for existing components and handle overwrite option
  // TODO: Write component files to project

  for (const component of components) {
    console.log({
      event: 'add:component',
      component,
      status: 'pending',
      message: `Would add component: ${component}`,
    });
  }

  console.log({
    event: 'add:complete',
    componentCount: components.length,
    message: 'Component fetching not yet implemented',
  });
}
