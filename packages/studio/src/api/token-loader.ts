/**
 * Token Loader for Studio
 *
 * Loads tokens from the target project's .rafters/tokens directory.
 * This is a standalone implementation that reads JSON files directly
 * to avoid build-time dependencies on workspace TypeScript packages.
 */

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

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

  return updatedToken;
}
