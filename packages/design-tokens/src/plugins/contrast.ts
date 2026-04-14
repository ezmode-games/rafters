/**
 * Contrast Rule Plugin
 *
 * Finds the best contrast color using sophisticated WCAG accessibility data
 * and pre-computed intelligence from ColorValue objects. This leverages the
 * AI-powered accessibility analysis to find optimal contrast pairs.
 *
 * New contract (issue #1232):
 *   Input: { familyColorValue, familyName, basePosition }
 *   Output: ColorReference { family, position }
 *
 * The executor resolves familyColorValue and basePosition BEFORE calling
 * this function -- no token-name regex and no registry access inside the plugin.
 */

import type { ColorValue } from '@rafters/shared';
import { INDEX_TO_POSITION } from '../scale-positions';

// Extended ColorValue with optional plugin-specific properties
type ExtendedColorValue = ColorValue & {
  foregroundReferences?: {
    auto?: { family: string; position: string };
  };
};

export interface ContrastPluginInput {
  /** The ColorValue object for the color family (resolved by the executor). */
  familyColorValue: ColorValue;
  /** The family token name, used to build the ColorReference. */
  familyName: string;
  /**
   * The base scale array index (0-10) from which contrast is computed.
   * Resolved by the executor from the base token's ColorReference -- never from the token name.
   */
  basePosition: number;
}

export default function contrast(input: ContrastPluginInput): { family: string; position: string } {
  const { familyColorValue, familyName, basePosition } = input;
  const colorValue = familyColorValue as ExtendedColorValue;

  // First priority: Use pre-computed foreground references if available
  if (colorValue.foregroundReferences?.auto) {
    const reference = colorValue.foregroundReferences.auto;
    return {
      family: reference.family,
      position: reference.position,
    };
  }

  // Second priority: Use WCAG accessibility data to find optimal contrast
  if (colorValue.accessibility) {
    const accessibility = colorValue.accessibility;

    const wcagAAA = accessibility.wcagAAA?.normal || [];
    const wcagAA = accessibility.wcagAA?.normal || [];

    let contrastPosition: number | undefined;

    // Try AAA first for highest quality
    for (const [pos1, pos2] of wcagAAA) {
      if (pos1 === basePosition) {
        contrastPosition = pos2;
        break;
      }
      if (pos2 === basePosition) {
        contrastPosition = pos1;
        break;
      }
    }

    // Fall back to AA if no AAA pair found
    if (contrastPosition === undefined) {
      for (const [pos1, pos2] of wcagAA) {
        if (pos1 === basePosition) {
          contrastPosition = pos2;
          break;
        }
        if (pos2 === basePosition) {
          contrastPosition = pos1;
          break;
        }
      }
    }

    if (contrastPosition !== undefined) {
      return {
        family: familyName,
        position: INDEX_TO_POSITION[contrastPosition] ?? '500',
      };
    }
  }

  // Third priority: neutral fallback using onWhite accessibility data.
  // NOTE: intentionally preserved -- see issue #1231 for context.
  // The neutral family name is a fixed convention, not read from the registry.
  const neutralFamilyName = 'neutral';
  if (colorValue.accessibility?.onWhite?.aaa && colorValue.accessibility.onWhite.aaa.length > 0) {
    const bestPosition = colorValue.accessibility.onWhite.aaa[0];
    if (bestPosition !== undefined) {
      return {
        family: neutralFamilyName,
        position: INDEX_TO_POSITION[bestPosition] ?? '500',
      };
    }
  }

  if (colorValue.accessibility?.onWhite?.aa && colorValue.accessibility.onWhite.aa.length > 0) {
    const bestPosition = colorValue.accessibility.onWhite.aa[0];
    if (bestPosition !== undefined) {
      return {
        family: neutralFamilyName,
        position: INDEX_TO_POSITION[bestPosition] ?? '500',
      };
    }
  }

  // Last resort: Use same family with high contrast position
  return {
    family: familyName,
    position: basePosition <= 5 ? '900' : '100',
  };
}
