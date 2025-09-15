import { execa } from 'execa';
import type { Config } from './config.js';

export async function installDependencies(
  dependencies: string[],
  packageManager: Config['packageManager'],
  cwd = process.cwd()
): Promise<void> {
  if (dependencies.length === 0) return;

  const commands = {
    npm: ['install', ...dependencies],
    yarn: ['add', ...dependencies],
    pnpm: ['add', ...dependencies],
  };

  await execa(packageManager, commands[packageManager], { cwd });
}

export function getCoreDependencies(): string[] {
  return ['@radix-ui/react-slot', 'clsx', 'tailwind-merge'];
}
