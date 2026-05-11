/**
 * Persistence Adapter
 *
 * Simple interface: load all, save what you're given.
 * The adapter handles storage details (files, cloud, whatever).
 * The registry doesn't know or care how storage works.
 */

import type { Token } from '@rafters/shared';

export { type NamespaceFile, NamespaceFileSchema } from '@rafters/shared';

export interface PersistenceAdapter {
  /**
   * Load all tokens from storage
   */
  load(): Promise<Token[]>;

  /**
   * Save tokens to storage
   * Adapter groups by namespace and handles file/record splitting internally
   */
  save(tokens: Token[]): Promise<void>;
}
