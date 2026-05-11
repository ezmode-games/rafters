/**
 * Registry Factory - Simplified
 *
 * Creates a basic TokenRegistry. Archive unpacking and callbacks are being refactored.
 * TODO: Restore full functionality after archive/callback refactor
 */

import type { Token } from '@rafters/shared';
import { TokenRegistry } from './registry.js';

/**
 * Create a basic TokenRegistry with optional initial tokens
 */
export function createTokenRegistry(initialTokens?: Token[]): TokenRegistry {
  return new TokenRegistry(initialTokens);
}

/**
 * Legacy alias - will be restored with full archive/callback support
 * @deprecated Use createTokenRegistry for now
 */
export async function createEventDrivenTokenRegistry(
  _tokensPath: string,
  _shortcode: string = '000000',
): Promise<TokenRegistry> {
  console.warn(
    'createEventDrivenTokenRegistry temporarily simplified - archive/callback support coming soon',
  );
  return new TokenRegistry();
}
