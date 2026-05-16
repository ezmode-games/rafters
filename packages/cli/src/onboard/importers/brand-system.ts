/**
 * Brand System Classifier
 *
 * When source CSS encodes multiple complete color palettes, that is not a
 * set of token overrides -- it is a deliberate brand system. Treating it
 * mechanically (lifting every var as a flat token, letting the default
 * neutral semantic layer win) discards the designer's intent.
 *
 * This classifier runs after #1402's ramp detector and signals downstream
 * consumers (init, Studio) that they should pause default semantic
 * assignment and prompt the user instead. The classifier itself stays
 * pure: it emits a structured analysis; behaviour belongs to the caller.
 */

import type { Token } from '@rafters/shared';
import type { DetectedPalette } from './ramp-detector.js';

/**
 * Minimum number of palettes that trigger the brand-system signal.
 *
 * Two complete palettes is enough to imply the source CSS encoded brand
 * intent rather than incidental variables. Aligned with the heuristic
 * Huttspawn surfaced (8 faction scales is brand; a single primary scale is
 * just a primary).
 */
export const MIN_BRAND_PALETTES = 2;

/**
 * Common semantic slot vocabulary. Token names that match either exactly
 * or as a prefix (e.g. `primary-foreground`) are flagged as semantic so
 * the prompt knows which mappings the user has the option to override.
 */
const SEMANTIC_SLOT_NAMES: ReadonlySet<string> = new Set([
  'primary',
  'secondary',
  'accent',
  'destructive',
  'success',
  'warning',
  'error',
  'info',
  'background',
  'foreground',
  'muted',
  'card',
  'popover',
  'border',
  'input',
  'ring',
]);

function isSemanticSlot(name: string): boolean {
  if (SEMANTIC_SLOT_NAMES.has(name)) return true;
  for (const slot of SEMANTIC_SLOT_NAMES) {
    if (name.startsWith(`${slot}-`)) return true;
  }
  return false;
}

export interface BrandSystemAnalysis {
  /** True when at least MIN_BRAND_PALETTES palettes were detected. */
  detected: boolean;
  /**
   * Palette family names, sorted by the order the detector emitted them
   * (alphabetical for Tailwind ramps). Empty when not detected.
   */
  palettes: string[];
  /**
   * Tokens whose names match the common semantic vocabulary
   * (primary, accent, background, etc.). The downstream prompt uses this
   * to know which mappings exist for the user to keep, edit, or replace.
   * Empty when not detected.
   */
  semanticSlots: string[];
}

/**
 * Sentinel analysis used by importer error paths and orchestrator
 * pre-import returns -- nothing was inspected, so nothing was detected.
 */
export const EMPTY_BRAND_SYSTEM: BrandSystemAnalysis = {
  detected: false,
  palettes: [],
  semanticSlots: [],
};

/**
 * Classify whether the detected import describes a brand system. Pure --
 * no I/O, no warnings. The caller decides whether to pause default
 * semantic assignment and prompt the user.
 */
export function classifyBrandSystem(
  palettes: readonly DetectedPalette[],
  tokens: readonly Token[],
): BrandSystemAnalysis {
  if (palettes.length < MIN_BRAND_PALETTES) {
    return { detected: false, palettes: [], semanticSlots: [] };
  }

  const semanticSlots = tokens
    .filter((t) => isSemanticSlot(t.name))
    .map((t) => t.name)
    .sort();

  return {
    detected: true,
    palettes: palettes.map((p) => p.name),
    semanticSlots,
  };
}
