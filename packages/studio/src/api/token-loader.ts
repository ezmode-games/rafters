/**
 * Token Loader for Studio
 *
 * Loads tokens from the target project's .rafters/tokens directory.
 * Uses @rafters/design-tokens directly (workspace import) for:
 * - Token loading via NodePersistenceAdapter
 * - CSS regeneration via registryToVars (instant HMR)
 */

import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  NodePersistenceAdapter,
  registryToTailwindStatic,
  registryToTypeScript,
  registryToVars,
  TokenRegistry,
} from '@rafters/design-tokens';
import type { Token as SharedToken } from '@rafters/shared';

export interface UserOverride {
  reason: string;
  timestamp: string;
}

export interface Token {
  name: string;
  value: unknown;
  category: string;
  namespace: string;
  description?: string;
  semanticMeaning?: string;
  usageContext?: string[];
  userOverride?: UserOverride;
  [key: string]: unknown;
}

export interface NamespaceFile {
  $schema: string;
  namespace: string;
  version: string;
  generatedAt: string;
  tokens: Token[];
}

export interface LoaderResult {
  namespaces: string[];
  tokensByNamespace: Map<string, Token[]>;
}

/**
 * Load all tokens from the project directory
 */
export async function loadProjectTokens(projectPath: string): Promise<LoaderResult> {
  const tokensDir = join(projectPath, '.rafters', 'tokens');

  // List namespace files
  let files: string[];
  try {
    files = await readdir(tokensDir);
  } catch {
    return { namespaces: [], tokensByNamespace: new Map() };
  }

  const namespaces: string[] = [];
  const tokensByNamespace = new Map<string, Token[]>();

  for (const file of files) {
    if (!file.endsWith('.rafters.json')) continue;

    const namespace = file.replace('.rafters.json', '');
    namespaces.push(namespace);

    try {
      const content = await readFile(join(tokensDir, file), 'utf-8');
      const data = JSON.parse(content) as NamespaceFile;
      tokensByNamespace.set(namespace, data.tokens);
    } catch (error) {
      console.error(`[studio] Failed to load ${file}:`, error);
    }
  }

  return { namespaces, tokensByNamespace };
}

/**
 * Save tokens to a namespace file
 */
export async function saveTokenUpdate(
  projectPath: string,
  namespace: string,
  tokens: Token[],
): Promise<void> {
  const { writeFile, mkdir } = await import('node:fs/promises');
  const tokensDir = join(projectPath, '.rafters', 'tokens');
  const filePath = join(tokensDir, `${namespace}.rafters.json`);

  await mkdir(tokensDir, { recursive: true });

  const data: NamespaceFile = {
    $schema: 'https://rafters.studio/schemas/namespace-tokens.json',
    namespace,
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    tokens,
  };

  await writeFile(filePath, JSON.stringify(data, null, 2));
}

export interface TokenUpdateRequest {
  name: string;
  value: unknown;
  reason: string;
}

/**
 * Regenerate CSS files for instant HMR
 *
 * Writes rafters.vars.css which contains pure CSS variables.
 * Vite detects the change and hot-reloads immediately.
 */
async function regenerateCss(projectPath: string): Promise<void> {
  const outputDir = join(projectPath, '.rafters', 'output');
  const adapter = new NodePersistenceAdapter(projectPath);

  // Load all tokens from persisted files
  const namespaces = await adapter.listNamespaces();
  const allTokens: SharedToken[] = [];

  for (const ns of namespaces) {
    const tokens = await adapter.loadNamespace(ns);
    allTokens.push(...tokens);
  }

  if (allTokens.length === 0) {
    return;
  }

  // Create registry and generate CSS
  const registry = new TokenRegistry(allTokens);
  const varsCSS = registryToVars(registry);

  await mkdir(outputDir, { recursive: true });
  await writeFile(join(outputDir, 'rafters.vars.css'), varsCSS);

  console.log('[studio] Regenerated rafters.vars.css');
}

/**
 * Initialize Studio CSS files
 *
 * Creates both:
 * - rafters.tailwind.css (static, processed once by Tailwind)
 * - rafters.vars.css (dynamic, instant HMR)
 */
export async function initializeStudioCss(projectPath: string): Promise<void> {
  const outputDir = join(projectPath, '.rafters', 'output');
  const adapter = new NodePersistenceAdapter(projectPath);

  const namespaces = await adapter.listNamespaces();
  const allTokens: SharedToken[] = [];

  for (const ns of namespaces) {
    const tokens = await adapter.loadNamespace(ns);
    allTokens.push(...tokens);
  }

  if (allTokens.length === 0) {
    console.warn('[studio] No tokens found, skipping CSS initialization');
    return;
  }

  const registry = new TokenRegistry(allTokens);

  const staticCSS = registryToTailwindStatic(registry);
  const varsCSS = registryToVars(registry);

  await mkdir(outputDir, { recursive: true });
  await writeFile(join(outputDir, 'rafters.tailwind.css'), staticCSS);
  await writeFile(join(outputDir, 'rafters.vars.css'), varsCSS);

  console.log('[studio] Initialized CSS files:');
  console.log('  - rafters.tailwind.css (static)');
  console.log('  - rafters.vars.css (dynamic)');
}

/**
 * Update a single token with a reason
 *
 * This function:
 * 1. Loads the current namespace file
 * 2. Updates the specific token with new value and userOverride
 * 3. Saves the file back
 */
export async function updateSingleToken(
  projectPath: string,
  namespace: string,
  update: TokenUpdateRequest,
): Promise<Token> {
  const { writeFile, mkdir } = await import('node:fs/promises');
  const tokensDir = join(projectPath, '.rafters', 'tokens');
  const filePath = join(tokensDir, `${namespace}.rafters.json`);

  // Load current data
  let data: NamespaceFile;
  try {
    const content = await readFile(filePath, 'utf-8');
    data = JSON.parse(content) as NamespaceFile;
  } catch {
    throw new Error(`Namespace ${namespace} not found`);
  }

  // Find and update the token
  const tokenIndex = data.tokens.findIndex((t) => t.name === update.name);
  if (tokenIndex === -1) {
    throw new Error(`Token ${update.name} not found in ${namespace}`);
  }

  const updatedToken: Token = {
    ...data.tokens[tokenIndex],
    value: update.value,
    userOverride: {
      reason: update.reason,
      timestamp: new Date().toISOString(),
    },
  };

  data.tokens[tokenIndex] = updatedToken;
  data.generatedAt = new Date().toISOString();

  // Save
  await mkdir(tokensDir, { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2));

  // Regenerate CSS for instant HMR
  await regenerateCss(projectPath);

  return updatedToken;
}

export interface DependentInfo {
  name: string;
  namespace: string;
  currentValue: unknown;
  hasUserOverride: boolean;
  overrideReason?: string;
}

/**
 * Get tokens that depend on a given token (reverse dependency lookup).
 * Builds a fresh TokenRegistry to compute the dependency graph.
 */
export async function getTokenDependents(
  projectPath: string,
  tokenName: string,
): Promise<DependentInfo[]> {
  const adapter = new NodePersistenceAdapter(projectPath);
  const namespaces = await adapter.listNamespaces();
  const allTokens: SharedToken[] = [];

  for (const ns of namespaces) {
    const tokens = await adapter.loadNamespace(ns);
    allTokens.push(...tokens);
  }

  if (allTokens.length === 0) return [];

  const registry = new TokenRegistry(allTokens);
  const dependentNames = registry.getDependents(tokenName);

  const result: DependentInfo[] = [];
  for (const depName of dependentNames) {
    const token = registry.get(depName);
    if (!token) continue;
    result.push({
      name: depName,
      namespace: token.namespace ?? 'unknown',
      currentValue: token.value,
      hasUserOverride: token.userOverride !== undefined,
      overrideReason: token.userOverride?.reason,
    });
  }

  return result;
}

/**
 * Regenerate all output files (CSS, TypeScript, Tailwind)
 *
 * Called by the "Save" button to produce complete output files.
 * Unlike regenerateCss() which only writes vars for HMR, this writes
 * the full set of export files.
 */
export async function regenerateAllOutputs(projectPath: string): Promise<void> {
  const outputDir = join(projectPath, '.rafters', 'output');
  const adapter = new NodePersistenceAdapter(projectPath);

  const namespaces = await adapter.listNamespaces();
  const allTokens: SharedToken[] = [];

  for (const ns of namespaces) {
    const tokens = await adapter.loadNamespace(ns);
    allTokens.push(...tokens);
  }

  if (allTokens.length === 0) {
    return;
  }

  const registry = new TokenRegistry(allTokens);

  await mkdir(outputDir, { recursive: true });

  // Write all output formats
  const staticCSS = registryToTailwindStatic(registry);
  const varsCSS = registryToVars(registry);
  const tsOutput = registryToTypeScript(registry);

  await writeFile(join(outputDir, 'rafters.tailwind.css'), staticCSS);
  await writeFile(join(outputDir, 'rafters.vars.css'), varsCSS);
  await writeFile(join(outputDir, 'rafters.ts'), tsOutput);

  console.log('[studio] Regenerated all output files');
}
