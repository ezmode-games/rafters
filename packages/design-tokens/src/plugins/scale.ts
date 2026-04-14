/**
 * Scale Rule Plugin
 *
 * Extracts a color from a specific position in a ColorValue's scale array.
 * The executor resolves the scale position from the parsed rule BEFORE calling
 * this function -- no token-name regex occurs inside the plugin.
 *
 * New contract (issue #1232):
 *   Input: { familyColorValue, familyName, scalePosition }
 *   Output: ColorReference { family, position }
 */

import type { ColorValue } from '@rafters/shared';
import { INDEX_TO_POSITION } from '../scale-positions';

export interface ScalePluginInput {
  /** The ColorValue object for the color family (resolved by the executor). */
  familyColorValue: ColorValue;
  /** The family token name, used to build the ColorReference. */
  familyName: string;
  /**
   * The array index into familyColorValue.scale (0-10).
   * Resolved from ParsedRule.scalePosition by the executor -- never from the token name.
   */
  scalePosition: number;
}

export default function scale(input: ScalePluginInput): { family: string; position: string } {
  const { familyColorValue, familyName, scalePosition } = input;

  if (!Array.isArray(familyColorValue.scale) || familyColorValue.scale.length === 0) {
    throw new Error(`ColorValue for family "${familyName}" has no scale array`);
  }

  if (scalePosition < 0 || scalePosition >= familyColorValue.scale.length) {
    throw new Error(
      `Scale position index ${scalePosition} is out of bounds for family "${familyName}" ` +
        `(scale length: ${familyColorValue.scale.length})`,
    );
  }

  const position = INDEX_TO_POSITION[scalePosition];
  if (!position) {
    throw new Error(`No position string for scale index ${scalePosition}`);
  }

  return { family: familyName, position };
}
