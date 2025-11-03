/**
 * Scale Rule Plugin
 *
 * Extracts a color from a specific position in a ColorValue's scale array.
 * Example: scale:600 -> extracts position 6 from the scale (600/100 = index 6)
 */

import type { TokenRegistry } from '../registry';

export default function scale(
  registry: TokenRegistry,
  tokenName: string,
  dependencies: string[],
): { family: string; position: string | number } {
  // Extract scale position from token name
  // Assumes token name like "primary-600" or similar pattern
  const match = tokenName.match(/(\d+)$/);
  if (!match) {
    throw new Error(`Cannot extract scale position from token name: ${tokenName}`);
  }

  const position = match[1];

  // Get the base family from dependencies
  if (dependencies.length === 0) {
    throw new Error(`No dependencies found for scale rule on token: ${tokenName}`);
  }

  const familyTokenName = dependencies[0];
  if (!familyTokenName) {
    throw new Error(`No dependency token name for scale rule on token: ${tokenName}`);
  }
  const familyToken = registry.get(familyTokenName);

  if (!familyToken || typeof familyToken.value !== 'object') {
    throw new Error(`ColorValue family token ${familyTokenName} not found for scale rule`);
  }

  // Return reference to family and position
  return {
    family: familyTokenName,
    position: position ?? '500',
  };
}
