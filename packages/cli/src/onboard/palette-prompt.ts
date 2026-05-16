/**
 * Per-palette semantic-family assignment walk (#1509).
 *
 * After the importer's ramp detector identifies palettes, this module
 * walks the user through one prompt per palette: "Assign <family> to
 * which semantic slot?" The slots are the eleven canonical semantic
 * families from `@rafters/color-utils` `SemanticColorSystem` -- the
 * exhaustive list of slots Rafters considers user-assignable.
 *
 * Surface tokens that re-derive from the eleven families through
 * `DEFAULT_SEMANTIC_COLOR_MAPPINGS` (`background`, `foreground`, `card`,
 * `popover`, `border`, `input`, `ring`, the "muted" surface variant,
 * etc.) are NOT offered here. Those are not user-assignable; they
 * follow the family they reference.
 *
 * Slots are consumed at most once. Once `primary` is assigned, it drops
 * from the offered list for subsequent palettes. Skipping a palette
 * does not consume a slot -- the palette is still imported as flat
 * colour tokens (`<name>-50` ... `<name>-950`) but no semantic family
 * points at it.
 */

import { select } from '@inquirer/prompts';
import type { SemanticColorSystem } from '@rafters/color-utils';
import type { DetectedPalette } from './importers/ramp-detector.js';

/**
 * The canonical eleven semantic family slots. Must match
 * `keyof SemanticColorSystem` exactly. The order here is the canonical
 * agent-mode assignment order when `--accept-detected` runs without a
 * user picking: detected palettes are assigned to these slots in this
 * sequence (primary first, then secondary, ...).
 */
export const SEMANTIC_FAMILY_SLOTS = [
  'primary',
  'secondary',
  'tertiary',
  'accent',
  'highlight',
  'neutral',
  'muted',
  'success',
  'warning',
  'destructive',
  'info',
] as const;

export type SemanticFamilySlot = (typeof SEMANTIC_FAMILY_SLOTS)[number];

// Compile-time assertion that SEMANTIC_FAMILY_SLOTS lists exactly the
// keys of SemanticColorSystem. If color-utils adds, removes, or renames
// a slot, this fails to compile and forces the CLI to catch up.
type _SlotsMatchInterface = [SemanticFamilySlot] extends [keyof SemanticColorSystem]
  ? [keyof SemanticColorSystem] extends [SemanticFamilySlot]
    ? true
    : 'SEMANTIC_FAMILY_SLOTS is missing slots present in SemanticColorSystem'
  : 'SEMANTIC_FAMILY_SLOTS contains slots not present in SemanticColorSystem';
const _slotsMatchInterface: _SlotsMatchInterface = true;
void _slotsMatchInterface;

export type PaletteAssignment =
  | { family: string; slot: SemanticFamilySlot }
  | { family: string; skipped: true };

export interface PaletteWalkResult {
  assignments: PaletteAssignment[];
  /** Which slots ended up assigned (subset of SEMANTIC_FAMILY_SLOTS). */
  usedSlots: SemanticFamilySlot[];
  /** Palette family names the user skipped (still imported as colour tokens). */
  skippedFamilies: string[];
}

export interface PaletteWalkOptions {
  /**
   * Agent mode without `--accept-detected` -- the caller is expected to
   * emit a `needsDecision` payload (see `buildPaletteNeedsDecision`) and
   * exit before invoking `walkPaletteAssignments`. Passed here only so
   * the walk can throw a clear error if it's reached with `acceptDetected: false`.
   */
  agent: boolean;
  /** Non-interactive accept: assigns in canonical slot order. */
  acceptDetected: boolean;
}

/**
 * Walk the palettes and capture per-palette semantic-family assignments.
 *
 *   - Interactive (no agent / TTY): walks `select` per palette. Each
 *     prompt offers the remaining slots plus a `--skip--` entry. Skip
 *     does not consume a slot; the palette is recorded as skipped.
 *   - Agent + `--accept-detected`: assigns palettes to remaining slots
 *     in `SEMANTIC_FAMILY_SLOTS` order. Surplus palettes (more palettes
 *     than slots) get marked skipped.
 *   - Agent without `--accept-detected`: throws. The caller should
 *     instead emit `buildPaletteNeedsDecision(palettes)` and exit.
 */
export async function walkPaletteAssignments(
  palettes: readonly DetectedPalette[],
  options: PaletteWalkOptions,
): Promise<PaletteWalkResult> {
  if (palettes.length === 0) {
    return { assignments: [], usedSlots: [], skippedFamilies: [] };
  }

  if (options.agent) {
    if (!options.acceptDetected) {
      throw new Error(
        'walkPaletteAssignments was reached in agent mode without --accept-detected. ' +
          'Callers must emit buildPaletteNeedsDecision(palettes) and exit before calling the walk.',
      );
    }
    return assignInCanonicalOrder(palettes);
  }

  return walkInteractive(palettes);
}

function assignInCanonicalOrder(palettes: readonly DetectedPalette[]): PaletteWalkResult {
  const assignments: PaletteAssignment[] = [];
  const usedSlots: SemanticFamilySlot[] = [];
  const skippedFamilies: string[] = [];

  for (const [index, palette] of palettes.entries()) {
    const slot = SEMANTIC_FAMILY_SLOTS[index];
    if (!slot) {
      assignments.push({ family: palette.name, skipped: true });
      skippedFamilies.push(palette.name);
      continue;
    }
    assignments.push({ family: palette.name, slot });
    usedSlots.push(slot);
  }

  return { assignments, usedSlots, skippedFamilies };
}

const SKIP_VALUE = '--skip--';

async function walkInteractive(palettes: readonly DetectedPalette[]): Promise<PaletteWalkResult> {
  const assignments: PaletteAssignment[] = [];
  const usedSlots: SemanticFamilySlot[] = [];
  const skippedFamilies: string[] = [];

  // Mutable remaining-slots list shrinks as the walk progresses.
  const remaining: SemanticFamilySlot[] = [...SEMANTIC_FAMILY_SLOTS];

  type Choice = SemanticFamilySlot | typeof SKIP_VALUE;
  for (const palette of palettes) {
    const choices: Array<{ name: string; value: Choice }> = [
      ...remaining.map((slot) => ({ name: slot, value: slot as Choice })),
      {
        name: 'skip (import as a colour family without semantic assignment)',
        value: SKIP_VALUE,
      },
    ];

    const choice = await select<Choice>({
      message: `Assign palette "${palette.name}" to which semantic family?`,
      choices,
    });

    if (choice === SKIP_VALUE) {
      assignments.push({ family: palette.name, skipped: true });
      skippedFamilies.push(palette.name);
      continue;
    }

    assignments.push({ family: palette.name, slot: choice });
    usedSlots.push(choice);
    const idx = remaining.indexOf(choice);
    if (idx >= 0) remaining.splice(idx, 1);
  }

  return { assignments, usedSlots, skippedFamilies };
}

export interface PaletteNeedsDecision {
  type: 'palette-needs-decision';
  message: string;
  palettes: string[];
  semanticFamilySlots: readonly SemanticFamilySlot[];
}

/**
 * Build the agent-mode payload describing what would be asked. The
 * caller emits this as JSON and exits without writing `.rafters/`; the
 * agent re-runs with `--accept-detected` or supplies a decision file.
 */
export function buildPaletteNeedsDecision(
  palettes: readonly DetectedPalette[],
): PaletteNeedsDecision {
  return {
    type: 'palette-needs-decision',
    message:
      `Detected ${palettes.length} palette${palettes.length === 1 ? '' : 's'}. ` +
      'Re-run with --accept-detected to assign in canonical slot order, or run interactively to choose per palette.',
    palettes: palettes.map((p) => p.name),
    semanticFamilySlots: SEMANTIC_FAMILY_SLOTS,
  };
}
