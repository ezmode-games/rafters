import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';

export const ConfigSchema = z.object({
  version: z.string(),
  componentsDir: z.string(),
  storiesDir: z.string().optional(),
  hasStorybook: z.boolean(),
  packageManager: z.enum(['npm', 'yarn', 'pnpm']),
  registry: z.string().url(),
});

export type Config = z.infer<typeof ConfigSchema>;

export const defaultConfig: Config = {
  version: '1.0.0',
  componentsDir: './src/components/ui',
  storiesDir: './src/stories',
  hasStorybook: false,
  packageManager: 'npm',
  registry: 'https://registry.rafters.dev',
};

export function getConfigPath(cwd = process.cwd()): string {
  return join(cwd, '.rafters', 'config.json');
}

export function configExists(cwd = process.cwd()): boolean {
  return existsSync(getConfigPath(cwd));
}

export function loadConfig(cwd = process.cwd()): Config {
  const configPath = getConfigPath(cwd);

  if (!existsSync(configPath)) {
    throw new Error('Rafters not initialized. Run `rafters init` first.');
  }

  try {
    const configFile = readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configFile);
    return ConfigSchema.parse(config);
  } catch (error) {
    throw new Error(`Invalid config file: ${error}`);
  }
}

export function saveConfig(config: Config, cwd = process.cwd()): void {
  const configPath = getConfigPath(cwd);
  writeFileSync(configPath, JSON.stringify(config, null, 2));
}

export function detectPackageManager(cwd = process.cwd()): Config['packageManager'] {
  if (existsSync(join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(join(cwd, 'yarn.lock'))) return 'yarn';
  return 'npm';
}

export function isNodeProject(cwd = process.cwd()): boolean {
  return existsSync(join(cwd, 'package.json'));
}

export function hasReact(cwd = process.cwd()): boolean {
  try {
    const packageJson = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf-8'));
    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };
    return 'react' in deps;
  } catch {
    return false;
  }
}
