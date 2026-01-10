/**
 * Package Manager Detection
 *
 * Detects the package manager used in a project by checking lock files.
 * Based on shadcn's approach using @antfu/ni.
 */

import { detect } from '@antfu/ni';

export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun' | 'deno';

/**
 * Detect the package manager used in the target directory
 */
export async function getPackageManager(
  targetDir: string,
  opts: { withFallback?: boolean } = {},
): Promise<PackageManager> {
  const packageManager = await detect({ programmatic: true, cwd: targetDir });

  if (packageManager === 'yarn@berry') return 'yarn';
  if (packageManager === 'pnpm@6') return 'pnpm';
  if (packageManager === 'bun') return 'bun';
  if (packageManager === 'deno') return 'deno';

  if (packageManager) {
    return packageManager as PackageManager;
  }

  // Fallback: check npm_config_user_agent
  if (opts.withFallback) {
    const userAgent = process.env.npm_config_user_agent;
    if (userAgent) {
      if (userAgent.startsWith('yarn')) return 'yarn';
      if (userAgent.startsWith('pnpm')) return 'pnpm';
      if (userAgent.startsWith('bun')) return 'bun';
      if (userAgent.startsWith('deno')) return 'deno';
    }
  }

  return 'npm';
}

/**
 * Get the command runner for a package manager (for npx-style commands)
 */
export function getPackageRunner(packageManager: PackageManager): string {
  switch (packageManager) {
    case 'pnpm':
      return 'pnpm dlx';
    case 'bun':
      return 'bunx';
    default:
      return 'npx';
  }
}
