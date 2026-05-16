/**
 * Onboard wire-up (#1513).
 *
 * Composes the four leaf modules into a single per-init detection +
 * decision pass:
 *
 *   - orchestrator -- detect palettes / tokens from source CSS (#1402)
 *   - palette-prompt -- per-palette semantic-family assignment (#1509)
 *   - scale-inference -- spacing + radius math system (#1510)
 *   - font-detector -- @import / @font-face / system fonts (#1511)
 *
 * `rafters init` calls `runOnboardWireUp` BEFORE `generateBaseSystem`
 * so the recovered system informs generation -- the detected
 * spacing base + ratio feed the math generator, the palette
 * assignments materialise as `ColorReference` overlays on the
 * neutral semantic layer, and the detected fonts drive
 * `BaseSystemConfig.fontFamily` / `monoFontFamily`.
 *
 * Output is `OnboardDecisions` -- a structured record persisted to
 * `RaftersConfig.import` for deterministic `--reset` replay.
 */

import { readFile } from 'node:fs/promises';
import type { ColorReference, Token } from '@rafters/shared';
import { parseCSSFile } from './css-parser.js';
import { type DetectedFont, detectFonts, isMonoFamily } from './font-detector.js';
import { type OnboardResult, onboard } from './orchestrator.js';
import {
  buildPaletteNeedsDecision,
  type SemanticFamilySlot,
  walkPaletteAssignments,
} from './palette-prompt.js';
import {
  inferRadiusSystem,
  inferSpacingSystem,
  UNUSABLE_CONFIDENCE_THRESHOLD,
} from './scale-inference.js';

/**
 * Structured record of every decision the init flow captured.
 * Persisted verbatim to `RaftersConfig.import` so `--reset` can
 * replay without re-prompting.
 */
export interface OnboardDecisions {
  source: string;
  sourcePath: string;
  detectedAt: string;
  palettes: {
    assigned: Array<{ family: string; slot: SemanticFamilySlot }>;
    skipped: string[];
  };
  spacing?: { baseSpacingUnit: number; progressionRatio: string };
  radius?: { baseRadius: number; progressionRatio: string };
  fonts: DetectedFont[];
}

export interface WireUpOptions {
  agent: boolean;
  acceptDetected: boolean;
  /** Clock override for deterministic detectedAt in tests. */
  now?: Date;
}

export type WireUpOutcome =
  | {
      kind: 'no-detection';
      reason: 'no-orchestrator-match' | 'orchestrator-failed';
    }
  | {
      kind: 'needs-decision';
      palettes: string[];
      message: string;
    }
  | {
      kind: 'decisions';
      decisions: OnboardDecisions;
      result: OnboardResult;
    };

/**
 * Run the full detection + decision pass. Returns either the
 * structured decisions (interactive completed, or agent +
 * --accept-detected resolved), or a non-decision outcome the caller
 * surfaces (no CSS, agent without --accept-detected emitting
 * needsDecision).
 */
export async function runOnboardWireUp(
  cwd: string,
  options: WireUpOptions,
): Promise<WireUpOutcome> {
  const result = await onboard(cwd);
  if (!result.success || !result.source) {
    return {
      kind: 'no-detection',
      reason: !result.source ? 'no-orchestrator-match' : 'orchestrator-failed',
    };
  }

  // Agent without --accept-detected and a brand-system signal (>=2
  // palettes): emit needs-decision and exit before prompts.
  if (options.agent && !options.acceptDetected && result.palettes.length >= 2) {
    const payload = buildPaletteNeedsDecision(result.palettes);
    return { kind: 'needs-decision', palettes: payload.palettes, message: payload.message };
  }

  // Walk per-palette assignments (handles interactive + agent-accept-detected).
  const palettesResult = await walkPaletteAssignments(result.palettes, {
    agent: options.agent,
    acceptDetected: options.acceptDetected,
  });

  // Re-read the raw CSS for font detection. Falls back to empty when
  // the source path is missing (shouldn't happen on success, but keep
  // total).
  const sourcePath = result.sourcePaths[0];
  let rawCss = '';
  if (sourcePath) {
    try {
      rawCss = await readFile(sourcePath, 'utf-8');
    } catch {
      rawCss = '';
    }
  }
  const parsed = rawCss ? parseCSSFile(rawCss) : null;
  const fonts = parsed ? detectFonts(parsed, rawCss) : [];

  // Spacing + radius inference -- only commit when above the unusable
  // threshold. The umbrella prompt would gate at LOW for interactive,
  // but for the MVP wire-up we apply when usable and fall back when
  // below (callers can tune later).
  const spacingInf = parsed ? inferSpacingSystem(parsed.variables) : null;
  const radiusInf = parsed ? inferRadiusSystem(parsed.variables) : null;

  const sourceRel = sourcePath ?? '';
  const now = options.now ?? new Date();

  const decisions: OnboardDecisions = {
    source: result.source,
    sourcePath: sourceRel,
    detectedAt: now.toISOString(),
    palettes: {
      assigned: palettesResult.assignments
        .filter((a): a is { family: string; slot: SemanticFamilySlot } => 'slot' in a)
        .map(({ family, slot }) => ({ family, slot })),
      skipped: palettesResult.skippedFamilies,
    },
    ...(spacingInf && spacingInf.confidence >= UNUSABLE_CONFIDENCE_THRESHOLD
      ? {
          spacing: {
            baseSpacingUnit: spacingInf.base,
            progressionRatio: spacingInf.progressionRatio,
          },
        }
      : {}),
    ...(radiusInf && radiusInf.confidence >= UNUSABLE_CONFIDENCE_THRESHOLD
      ? {
          radius: {
            baseRadius: radiusInf.base,
            progressionRatio: radiusInf.progressionRatio,
          },
        }
      : {}),
    fonts,
  };

  return { kind: 'decisions', decisions, result };
}

/**
 * Build the partial `BaseSystemConfig` overrides the design-tokens
 * generator consumes. Spacing / radius come from inference; the
 * sans-serif font family comes from the first non-mono detected font;
 * mono comes from the first detected mono font.
 */
export function decisionsToConfigOverrides(decisions: OnboardDecisions): {
  baseSpacingUnit?: number;
  progressionRatio?: string;
  baseRadiusOverride?: number;
  fontFamily?: string;
  monoFontFamily?: string;
} {
  const overrides: ReturnType<typeof decisionsToConfigOverrides> = {};

  if (decisions.spacing) {
    overrides.baseSpacingUnit = decisions.spacing.baseSpacingUnit;
    overrides.progressionRatio = decisions.spacing.progressionRatio;
  }
  if (decisions.radius) {
    overrides.baseRadiusOverride = decisions.radius.baseRadius;
  }

  const sansFont = decisions.fonts.find((f) => !isMonoFamily(f.family));
  const monoFont = decisions.fonts.find((f) => isMonoFamily(f.family));
  if (sansFont) {
    overrides.fontFamily = sansFont.family.includes(' ')
      ? `"${sansFont.family}", sans-serif`
      : `${sansFont.family}, sans-serif`;
  }
  if (monoFont) {
    overrides.monoFontFamily = monoFont.family.includes(' ')
      ? `"${monoFont.family}", monospace`
      : `${monoFont.family}, monospace`;
  }

  return overrides;
}

/**
 * Materialise the per-palette semantic-family assignments as
 * `ColorReference` overlays. The umbrella init applies these on top
 * of `generateBaseSystem`'s output so the user's assigned palette
 * step (e.g. `empire-500`) anchors the `primary` semantic family,
 * and the derived surface tokens (`background`, `foreground`, ...)
 * re-derive through their existing `ColorReference` mappings.
 *
 * Returns a list of `{ tokenName, value }` pairs suitable for
 * `registry.set(name, value, { reason: 'init:onboard' })` after
 * `generateBaseSystem` runs.
 */
export function buildSemanticOverlays(decisions: OnboardDecisions): Array<{
  tokenName: string;
  value: ColorReference;
}> {
  return decisions.palettes.assigned.map((assignment) => ({
    tokenName: assignment.slot,
    value: { family: assignment.family, position: '500' },
  }));
}

/**
 * Sanity helper: returns the palette tokens (all steps from
 * detected palettes that the user assigned to a slot OR explicitly
 * skipped) so the umbrella init can write them into the registry.
 * Skipped palettes still get imported as colour tokens; they just
 * don't anchor a semantic family.
 */
export function paletteTokensFromResult(result: OnboardResult): Token[] {
  return result.palettes.flatMap((p) => p.steps.map((s) => s.token));
}
