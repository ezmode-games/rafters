/**
 * State Rule Plugin
 *
 * Generates state variants (hover, active, focus, disabled) using pre-computed
 * state references from ColorValue intelligence data, or positional offsets
 * from the base token's actual position.
 */

import type { ColorValue } from '@rafters/shared';
import type { TokenRegistry } from '../registry';
import { INDEX_TO_POSITION, POSITION_TO_INDEX } from '../scale-positions';

type ExtendedColorValue = ColorValue & {
  stateReferences?: Record<string, { family: string; position: string }>;
};

const STATE_OFFSETS: Record<string, number> = {
  hover: 1,
  active: 2,
  focus: 1,
  disabled: -2,
};

export default function state(
  registry: TokenRegistry,
  tokenName: string,
  dependencies: string[],
): { family: string; position: string } {
  const stateMatch = tokenName.match(/(hover|active|focus|disabled)$/);
  if (!stateMatch) {
    throw new Error(`Cannot extract state from token name: ${tokenName}`);
  }

  const stateName = stateMatch[1] as 'hover' | 'active' | 'focus' | 'disabled';

  if (dependencies.length === 0) {
    throw new Error(`No dependencies found for state rule on token: ${tokenName}`);
  }

  const familyTokenName = dependencies[0];
  if (!familyTokenName) {
    throw new Error(`No dependency token name for state rule on token: ${tokenName}`);
  }
  const familyToken = registry.get(familyTokenName);

  if (!familyToken || typeof familyToken.value !== 'object') {
    throw new Error(`ColorValue family token ${familyTokenName} not found for state rule`);
  }

  const colorValue = familyToken.value as ExtendedColorValue;

  // Use pre-computed state references if available
  if (colorValue.stateReferences?.[stateName]) {
    const reference = colorValue.stateReferences[stateName];
    return { family: reference.family, position: String(reference.position) };
  }

  // Derive from the base token's actual position
  const baseTokenName = tokenName.replace(/-(hover|active|focus|disabled)$/, '');
  const baseToken = registry.get(baseTokenName);
  let baseIndex = 5; // Default to 500 if base token not found

  if (baseToken && typeof baseToken.value === 'object' && 'position' in baseToken.value) {
    const baseRef = baseToken.value as { position?: string };
    if (baseRef.position) {
      const idx = POSITION_TO_INDEX[baseRef.position];
      if (idx !== undefined) baseIndex = idx;
    }
  }

  const offset = STATE_OFFSETS[stateName] ?? 0;
  const adjustedIndex = Math.max(0, Math.min(10, baseIndex + offset));
  const position = INDEX_TO_POSITION[adjustedIndex] ?? '500';

  return { family: familyTokenName, position };
}
