/**
 * Component Service
 * Loads components and primitives from UI package for registry endpoints
 */

import { readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';

export interface RegistryFile {
  path: string;
  content: string;
  type: 'registry:component' | 'registry:ui' | 'registry:lib' | 'registry:primitive';
}

export interface RegistryItem {
  name: string;
  type: 'registry:ui' | 'registry:primitive';
  description?: string;
  dependencies: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files: RegistryFile[];
}

export interface RegistryIndex {
  name: string;
  homepage: string;
  components: string[];
  primitives: string[];
}

/**
 * Get path to UI package components
 */
function getComponentsPath(): string {
  return join(process.cwd(), '../../packages/ui/src/components/ui');
}

/**
 * Get path to primitives
 */
function getPrimitivesPath(): string {
  return join(process.cwd(), '../../packages/ui/src/primitives');
}

/**
 * List all available component names
 */
export function listComponentNames(): string[] {
  const componentsDir = getComponentsPath();
  return readdirSync(componentsDir)
    .filter((f) => f.endsWith('.tsx'))
    .map((f) => basename(f, '.tsx'));
}

/**
 * List all available primitive names
 */
export function listPrimitiveNames(): string[] {
  const primitivesDir = getPrimitivesPath();
  return readdirSync(primitivesDir)
    .filter((f) => f.endsWith('.ts') && f !== 'types.ts')
    .map((f) => basename(f, '.ts'));
}

/**
 * Load a single component by name
 */
export function loadComponent(name: string): RegistryItem | null {
  const componentsDir = getComponentsPath();
  const filePath = join(componentsDir, `${name}.tsx`);

  try {
    const content = readFileSync(filePath, 'utf-8');

    // Extract dependencies from imports
    const deps = extractDependencies(content);

    // Extract primitive dependencies
    const primitiveDeps = extractPrimitiveDependencies(content);

    return {
      name,
      type: 'registry:ui',
      dependencies: deps.external,
      registryDependencies: [...deps.internal, ...primitiveDeps],
      files: [
        {
          path: `components/ui/${name}.tsx`,
          content,
          type: 'registry:ui',
        },
      ],
    };
  } catch {
    return null;
  }
}

/**
 * Load a single primitive by name
 */
export function loadPrimitive(name: string): RegistryItem | null {
  const primitivesDir = getPrimitivesPath();
  const filePath = join(primitivesDir, `${name}.ts`);

  try {
    const content = readFileSync(filePath, 'utf-8');

    // Extract dependencies from imports
    const deps = extractDependencies(content);

    // Extract primitive dependencies (other primitives this one imports)
    const primitiveDeps = extractPrimitiveDependencies(content);

    return {
      name,
      type: 'registry:primitive',
      dependencies: deps.external,
      registryDependencies: primitiveDeps,
      files: [
        {
          path: `lib/primitives/${name}.ts`,
          content,
          type: 'registry:primitive',
        },
      ],
    };
  } catch {
    return null;
  }
}

/**
 * Load all components
 */
export function loadAllComponents(): RegistryItem[] {
  const names = listComponentNames();
  return names.map((name) => loadComponent(name)).filter((c): c is RegistryItem => c !== null);
}

/**
 * Load all primitives
 */
export function loadAllPrimitives(): RegistryItem[] {
  const names = listPrimitiveNames();
  return names.map((name) => loadPrimitive(name)).filter((p): p is RegistryItem => p !== null);
}

/**
 * Get registry index
 */
export function getRegistryIndex(): RegistryIndex {
  return {
    name: 'rafters',
    homepage: 'https://rafters.studio',
    components: listComponentNames(),
    primitives: listPrimitiveNames(),
  };
}

/**
 * Get registry metadata with full component data
 */
export function getRegistryMetadata() {
  return {
    components: loadAllComponents(),
    primitives: loadAllPrimitives(),
  };
}

/**
 * Extract dependencies from component source
 */
function extractDependencies(content: string): {
  external: string[];
  internal: string[];
} {
  const external: string[] = [];
  const internal: string[] = [];

  // Match import statements
  const importRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"]([^'"]+)['"]/g;
  const matches = content.matchAll(importRegex);

  for (const match of matches) {
    const pkg = match[1];

    // Skip relative imports
    if (pkg.startsWith('.') || pkg.startsWith('/')) {
      // Check if it's an internal component reference
      if (pkg.includes('/components/')) {
        const componentName = basename(pkg, '.tsx');
        internal.push(componentName);
      }
      continue;
    }

    // External package
    if (!external.includes(pkg)) {
      external.push(pkg);
    }
  }

  return { external, internal };
}

/**
 * Extract primitive dependencies from source
 */
function extractPrimitiveDependencies(content: string): string[] {
  const primitives: string[] = [];

  // Match imports from primitives directory
  const importRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"]([^'"]+)['"]/g;
  const matches = content.matchAll(importRegex);

  for (const match of matches) {
    const pkg = match[1];

    // Check if it's a primitive import
    if (
      pkg.includes('/primitives/') ||
      pkg.includes('../primitives/') ||
      pkg.includes('../../primitives/')
    ) {
      const primitiveName = basename(pkg, '.ts');
      if (!primitives.includes(primitiveName) && primitiveName !== 'types') {
        primitives.push(primitiveName);
      }
    }
  }

  return primitives;
}
