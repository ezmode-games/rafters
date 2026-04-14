/**
 * State Rule Plugin
 *
 * Generates state variants (hover, active, focus, disabled) using pre-computed
 * state references from ColorValue intelligence data, or positional offsets
 * from the base token's actual position.
 *
 * New contract (issue #1232):
 *   Input: { familyColorValue, familyName, basePosition, stateType }
 *   Output: ColorReference { family, position }
 *
 * The executor resolves familyColorValue, basePosition, and stateType from the
 * ParsedRule BEFORE calling this function -- no token-name regex inside the plugin.
 */

import type { ColorValue } from '@rafters/shared';
import { INDEX_TO_POSITION } from '../scale-positions';

type ExtendedColorValue = ColorValue & {
  stateReferences?: Record<string, { family: string; position: string }>;
};

const STATE_OFFSETS: Record<string, number> = {
  hover: 1,
  active: 2,
  focus: 1,
  disabled: -2,
};

export interface StatePluginInput {
  /** The ColorValue object for the color family (resolved by the executor). */
  familyColorValue: ColorValue;
  /** The family token name, used to build the ColorReference. */
  familyName: string;
  /**
   * The base scale array index (0-10) from which state offsets are computed.
   * Resolved by the executor from the base token's ColorReference.
   */
  basePosition: number;
  /**
   * The state variant to generate (hover | active | focus | disabled).
   * Resolved from ParsedRule.stateType by the executor -- never from the token name.
   */
  stateType: 'hover' | 'active' | 'focus' | 'disabled';
}

export default function state(input: StatePluginInput): { family: string; position: string } {
  const { familyColorValue, familyName, basePosition, stateType } = input;
  const colorValue = familyColorValue as ExtendedColorValue;

  // First priority: Use pre-computed state references if available
  if (colorValue.stateReferences?.[stateType]) {
    const reference = colorValue.stateReferences[stateType];
    return { family: reference.family, position: String(reference.position) };
  }

  // Second priority: Apply positional offset from the resolved base position
  const offset = STATE_OFFSETS[stateType] ?? 0;
  const adjustedIndex = Math.max(0, Math.min(10, basePosition + offset));
  const position = INDEX_TO_POSITION[adjustedIndex] ?? '500';

  return { family: familyName, position };
}
