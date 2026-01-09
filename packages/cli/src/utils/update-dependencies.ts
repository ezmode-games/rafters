/**
 * Dependency Installation
 *
 * Installs npm dependencies using the detected package manager.
 * Based on shadcn's approach using execa.
 */

import { execa } from 'execa';
import ora from 'ora';
import { getPackageManager, type PackageManager } from './get-package-manager.js';

export interface UpdateDependenciesOptions {
  cwd: string;
  silent?: boolean;
}

/**
 * Install dependencies using the appropriate package manager
 */
export async function updateDependencies(
  dependencies: string[],
  devDependencies: string[],
  options: UpdateDependenciesOptions,
): Promise<void> {
  const { cwd, silent } = options;

  // Deduplicate
  const deps = [...new Set(dependencies)];
  const devDeps = [...new Set(devDependencies)];

  if (deps.length === 0 && devDeps.length === 0) {
    return;
  }

  const packageManager = await getPackageManager(cwd, { withFallback: true });

  const spinner = silent ? null : ora('Installing dependencies...').start();

  try {
    // Install regular dependencies
    if (deps.length > 0) {
      await installWithPackageManager(packageManager, deps, { cwd, dev: false });
    }

    // Install dev dependencies
    if (devDeps.length > 0) {
      await installWithPackageManager(packageManager, devDeps, { cwd, dev: true });
    }

    spinner?.succeed('Dependencies installed.');
  } catch (error) {
    spinner?.fail('Failed to install dependencies.');
    throw error;
  }
}

/**
 * Run the appropriate install command for the package manager
 */
async function installWithPackageManager(
  packageManager: PackageManager,
  dependencies: string[],
  options: { cwd: string; dev: boolean },
): Promise<void> {
  const { cwd, dev } = options;

  switch (packageManager) {
    case 'npm':
      await execa('npm', ['install', ...(dev ? ['-D'] : []), ...dependencies], { cwd });
      break;

    case 'deno': {
      // Deno requires npm: prefix
      const denoDeps = dependencies.map((dep) => `npm:${dep}`);
      await execa('deno', ['add', ...(dev ? ['-D'] : []), ...denoDeps], { cwd });
      break;
    }

    default:
      // pnpm, yarn, bun all use 'add' command
      await execa(packageManager, ['add', ...(dev ? ['-D'] : []), ...dependencies], { cwd });
      break;
  }
}
