/**
 * Invert Rule Plugin
 *
 * Finds the WCAG-safe dark mode counterpart for a light mode scale position.
 * Uses the ColorValue accessibility matrix -- AAA first, falls back to AA
 * if the AAA match is too close (< 3 positions apart).
 *
 * New contract (issue #1232):
 *   Input: { familyColorValue, familyName, basePosition }
 *   Output: ColorReference { family, position }
 *
 * The executor resolves familyColorValue and basePosition BEFORE calling
 * this function -- no token-name regex and no registry access inside the plugin.
 */

import type { ColorValue } from '@rafters/shared';
import { findDarkCounterpartIndex, INDEX_TO_POSITION } from '../scale-positions';

export interface InvertPluginInput {
  /** The ColorValue object for the color family (resolved by the executor). */
  familyColorValue: ColorValue;
  /** The family token name, used to build the ColorReference. */
  familyName: string;
  /**
   * The light mode scale array index (0-10) to find the dark counterpart for.
   * Resolved by the executor from the base token's ColorReference -- never from the token name.
   */
  basePosition: number;
}

export default function invert(input: InvertPluginInput): { family: string; position: string } {
  const { familyColorValue, familyName, basePosition } = input;

  const darkIndex = findDarkCounterpartIndex(basePosition, familyColorValue);

  const darkPosition = INDEX_TO_POSITION[darkIndex];
  if (!darkPosition) {
    throw new Error(
      `Invalid dark index ${darkIndex} for family "${familyName}" at light position ${basePosition}`,
    );
  }

  return { family: familyName, position: darkPosition };
}
