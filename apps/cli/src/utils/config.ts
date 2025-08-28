import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';

export const ConfigSchema = z.object({
  version: z.string(),
  componentsDir: z.string(),
  storiesDir: z.string().optional(),
  hasStorybook: z.boolean(),
  packageManager: z.enum(['npm', 'yarn', 'pnpm']),
  registry: z.string().url(),
  cssFile: z.string().optional(), // CSS file to inject imports into
  tailwindVersion: z.enum(['v3', 'v4']).optional(),
  tokenFormat: z.enum(['css', 'tailwind', 'react-native']).optional(),
});

export type Config = z.infer<typeof ConfigSchema>;

export const defaultConfig: Config = {
  version: '1.0.0',
  componentsDir: './src/components/ui',
  storiesDir: './src/stories',
  hasStorybook: false,
  packageManager: 'npm',
  registry: 'https://rafters.realhandy.tech/api/registry',
  cssFile: 'globals.css', // Default CSS file for Tailwind v4
  tailwindVersion: 'v4',
  tokenFormat: 'tailwind',
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

export function detectFramework(cwd = process.cwd()): string | null {
  try {
    const packageJson = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf-8'));
    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    // Check for Next.js
    if ('next' in deps) return 'next';

    // Check for React Router (v7+ has react-router, older versions have react-router-dom)
    if ('react-router' in deps || '@react-router/dev' in deps) return 'react-router';

    // Check for Remix
    if ('remix' in deps || '@remix-run/dev' in deps) return 'remix';

    // Check for Vite
    if ('vite' in deps) return 'vite';

    // Check for Create React App (has react-scripts)
    if ('react-scripts' in deps) return 'cra';

    return null;
  } catch {
    return null;
  }
}

export function findCssFile(cwd = process.cwd()): string | null {
  // Common CSS file locations to check
  const possibleFiles = [
    'app/globals.css', // Next.js App Router
    'src/globals.css', // Next.js Pages Router / Generic
    'app/app.css', // React Router v7
    'app/root.css', // Remix
    'src/index.css', // Vite / CRA
    'src/App.css', // CRA alternative
    'styles/globals.css', // Custom styles dir
    'globals.css', // Root level
    'app.css', // Root level
  ];

  for (const file of possibleFiles) {
    const fullPath = join(cwd, file);
    if (existsSync(fullPath)) {
      return file;
    }
  }

  return null;
}

export function getDefaultCssFile(framework: string | null, cwd = process.cwd()): string {
  // First, try to find an existing CSS file
  const existingFile = findCssFile(cwd);
  if (existingFile) {
    return existingFile;
  }

  // If no existing file, suggest framework-appropriate default
  switch (framework) {
    case 'next':
      return 'app/globals.css'; // Next.js App Router
    case 'react-router':
      return 'app/app.css'; // React Router v7
    case 'remix':
      return 'app/root.css'; // Remix
    case 'vite':
      return 'src/index.css'; // Vite
    case 'cra':
      return 'src/index.css'; // Create React App
    default:
      return 'src/globals.css'; // Generic fallback
  }
}
