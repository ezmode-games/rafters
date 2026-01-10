/**
 * rafters add
 *
 * Adds rafters components to the project (drop-in shadcn replacements).
 * Fetches component definitions from the registry and writes to project.
 */

import { existsSync } from 'node:fs';
import { access, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { RegistryClient } from '../registry/client.js';
import type { RegistryItem } from '../registry/types.js';
import { getRaftersPaths } from '../utils/paths.js';
import { updateDependencies } from '../utils/update-dependencies.js';

export interface AddOptions {
  overwrite?: boolean;
  registryUrl?: string;
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
 * Check if a file already exists at the target path
 */
function fileExists(cwd: string, relativePath: string): boolean {
  return existsSync(join(cwd, relativePath));
}

/**
 * Transform component file content to update imports for the target project
 */
export function transformFileContent(content: string): string {
  let transformed = content;

  // Transform imports from ../../primitives/ to lib/primitives/
  transformed = transformed.replace(
    /from\s+['"]\.\.\/\.\.\/primitives\/([^'"]+)['"]/g,
    "from '@/lib/primitives/$1'",
  );

  // Transform imports from ../primitives/ to lib/primitives/
  transformed = transformed.replace(
    /from\s+['"]\.\.\/primitives\/([^'"]+)['"]/g,
    "from '@/lib/primitives/$1'",
  );

  // Transform relative component imports to absolute
  transformed = transformed.replace(/from\s+['"]\.\/([^'"]+)['"]/g, "from '@/components/ui/$1'");

  // Transform parent lib imports to absolute lib path
  transformed = transformed.replace(/from\s+['"]\.\.\/lib\/([^'"]+)['"]/g, "from '@/lib/$1'");

  // Transform parent hooks imports to absolute hooks path
  transformed = transformed.replace(/from\s+['"]\.\.\/hooks\/([^'"]+)['"]/g, "from '@/hooks/$1'");

  // Transform other parent imports as UI components (excluding lib/ and hooks/ already handled)
  transformed = transformed.replace(
    /from\s+['"]\.\.\/(?!lib\/|hooks\/)([^'"]+)['"]/g,
    "from '@/components/ui/$1'",
  );

  return transformed;
}

/**
 * Install a single registry item to the project
 */
async function installItem(
  cwd: string,
  item: RegistryItem,
  options: AddOptions,
): Promise<{ installed: boolean; skipped: boolean; files: string[] }> {
  const installedFiles: string[] = [];
  let skipped = false;

  for (const file of item.files) {
    const targetPath = join(cwd, file.path);

    // Check if file exists and handle overwrite
    if (fileExists(cwd, file.path)) {
      if (!options.overwrite) {
        console.log({
          event: 'add:skip',
          component: item.name,
          file: file.path,
          reason: 'exists',
        });
        skipped = true;
        continue;
      }
    }

    // Ensure directory exists
    await mkdir(dirname(targetPath), { recursive: true });

    // Transform and write the file
    const transformedContent = transformFileContent(file.content);
    await writeFile(targetPath, transformedContent, 'utf-8');

    installedFiles.push(file.path);
  }

  return {
    installed: installedFiles.length > 0,
    skipped,
    files: installedFiles,
  };
}

/**
 * Collect npm dependencies from registry items
 * Dependencies are now per-file in the new schema with versions (e.g., react@19.2.0)
 */
export function collectDependencies(items: RegistryItem[]): {
  dependencies: string[];
  devDependencies: string[];
} {
  const deps = new Set<string>();
  const devDeps = new Set<string>();

  for (const item of items) {
    // Dependencies are now on each file with versions
    for (const file of item.files) {
      for (const dep of file.dependencies) {
        deps.add(dep);
      }
    }
  }

  return {
    dependencies: [...deps].sort(),
    devDependencies: [...devDeps].sort(),
  };
}

/**
 * Fetch a component from the registry
 */
export async function fetchComponent(name: string, registryUrl?: string): Promise<RegistryItem> {
  const client = new RegistryClient(registryUrl);
  return client.fetchComponent(name);
}

/**
 * Install a component to a target directory
 */
export async function installComponent(
  component: RegistryItem,
  targetDir: string,
  options: AddOptions = {},
): Promise<void> {
  const result = await installItem(targetDir, component, options);

  if (result.installed) {
    console.log({
      event: 'add:installed',
      component: component.name,
      files: result.files,
    });
  }

  if (result.skipped && !options.overwrite) {
    throw new Error(`Component "${component.name}" already exists. Use --overwrite to replace.`);
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

  const client = new RegistryClient(options.registryUrl);

  // Resolve all components and their dependencies
  const allItems: RegistryItem[] = [];
  const seen = new Set<string>();

  for (const componentName of components) {
    try {
      const items = await client.resolveDependencies(componentName, seen);
      allItems.push(...items);
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Error: ${err.message}`);
      } else {
        console.error(`Error: Failed to fetch component "${componentName}"`);
      }
      process.exitCode = 1;
      return;
    }
  }

  // Install all resolved items
  const installed: string[] = [];
  const skipped: string[] = [];

  for (const item of allItems) {
    try {
      const result = await installItem(cwd, item, options);

      if (result.installed) {
        installed.push(item.name);
        console.log({
          event: 'add:installed',
          component: item.name,
          type: item.type,
          files: result.files,
        });
      }

      if (result.skipped && !result.installed) {
        skipped.push(item.name);
      }
    } catch (err) {
      // Warn but continue on peer component failures
      if (err instanceof Error) {
        console.warn({
          event: 'add:warning',
          component: item.name,
          message: err.message,
        });
      }
    }
  }

  // Collect and install dependencies
  const { dependencies, devDependencies } = collectDependencies(allItems);

  if (dependencies.length > 0 || devDependencies.length > 0) {
    console.log({
      event: 'add:dependencies',
      dependencies,
      devDependencies,
    });

    try {
      await updateDependencies(dependencies, devDependencies, { cwd });
    } catch (err) {
      console.error({
        event: 'add:error',
        message: 'Failed to install dependencies',
        error: err instanceof Error ? err.message : String(err),
      });
      // Don't fail the whole command - files are already written
    }
  }

  // Summary
  console.log({
    event: 'add:complete',
    installed: installed.length,
    skipped: skipped.length,
    components: installed,
  });

  if (skipped.length > 0 && installed.length === 0) {
    console.log({
      event: 'add:hint',
      message: 'Some components were skipped. Use --overwrite to replace existing files.',
      skipped,
    });
  }
}
