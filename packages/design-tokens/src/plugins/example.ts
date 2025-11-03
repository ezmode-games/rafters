/**
 * Example Rule Plugin
 *
 * Shows the plugin pattern - simple function with full registry access
 */

import type { TokenRegistry } from '../registry';

export default function example(
  registry: TokenRegistry,
  tokenName: string,
  dependencies: string[],
): string {
  // Full registry access - can read any token, check dependencies, etc.
  for (const dep of dependencies) {
    registry.get(dep);
  }

  return `example-result-for-${tokenName}`;
}
