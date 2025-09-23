/**
 * State Rule Plugin
 *
 * Generates state variants (hover, active, focus, disabled) using pre-computed
 * state references from ColorValue intelligence data.
 */

import type { ColorValue } from '@rafters/shared';
import type { TokenRegistry } from '../registry';

// Extended ColorValue with optional plugin-specific properties
type ExtendedColorValue = ColorValue & {
  stateReferences?: Record<string, { family: string; position: string | number }>;
};

export default function state(
  registry: TokenRegistry,
  tokenName: string,
  dependencies: string[]
): { family: string; position: string | number } {
  // Extract state from token name (e.g., "primary-hover" -> "hover")
  const stateMatch = tokenName.match(/(hover|active|focus|disabled)$/);
  if (!stateMatch) {
    throw new Error(`Cannot extract state from token name: ${tokenName}`);
  }

  const stateName = stateMatch[1] as 'hover' | 'active' | 'focus' | 'disabled';

  // Get the base family from dependencies
  if (dependencies.length === 0) {
    throw new Error(`No dependencies found for state rule on token: ${tokenName}`);
  }

  const familyTokenName = dependencies[0];
  const familyToken = registry.get(familyTokenName);

  if (!familyToken || typeof familyToken.value !== 'object') {
    throw new Error(`ColorValue family token ${familyTokenName} not found for state rule`);
  }

  const colorValue = familyToken.value as ExtendedColorValue;

  // Check if pre-computed state references exist
  if (colorValue.stateReferences?.[stateName]) {
    const reference = colorValue.stateReferences[stateName];
    return {
      family: reference.family,
      position: reference.position,
    };
  }

  // Fallback: use same family with adjusted position
  // This is a simple fallback - the real logic should be in the ColorValue
  const basePosition = 500; // Default middle position
  let adjustedPosition: number;

  switch (stateName) {
    case 'hover':
      adjustedPosition = basePosition + 100; // Slightly darker
      break;
    case 'active':
      adjustedPosition = basePosition + 200; // Darker
      break;
    case 'focus':
      adjustedPosition = basePosition + 50; // Slightly darker
      break;
    case 'disabled':
      adjustedPosition = basePosition - 200; // Much lighter
      break;
    default:
      adjustedPosition = basePosition;
  }

  return {
    family: familyTokenName,
    position: Math.min(900, Math.max(100, adjustedPosition)).toString(),
  };
}
