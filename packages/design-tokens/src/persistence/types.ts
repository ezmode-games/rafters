/**
 * Persistence Adapter Types
 *
 * Defines the interface for reading/writing token files to storage.
 * Only Node.js implementation is provided (browser uses API).
 */

import type { Token } from '@rafters/shared';

// Re-export NamespaceFile from shared for convenience
export { type NamespaceFile, NamespaceFileSchema } from '@rafters/shared';

/**
 * Adapter interface for reading/writing token files
 * Implementations handle storage-specific logic (filesystem, API, etc.)
 */
export interface PersistenceAdapter {
  /**
   * Load tokens for a namespace
   * @throws If file does not exist
   */
  loadNamespace(namespace: string): Promise<Token[]>;

  /**
   * Save tokens for a namespace
   * Creates parent directory if it does not exist
   */
  saveNamespace(namespace: string, tokens: Token[]): Promise<void>;

  /**
   * List available namespaces
   * @returns Array of namespace names (without .rafters.json extension)
   */
  listNamespaces(): Promise<string[]>;

  /**
   * Check if a namespace exists
   * @returns true if file exists, false otherwise
   */
  namespaceExists(namespace: string): Promise<boolean>;
}
