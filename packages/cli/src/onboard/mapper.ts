/**
 * Onboard Mapper
 *
 * Bridges detected import results (palettes, brand-system signal, prompt
 * decision) into the inputs that `init` and `generateBaseSystem` consume.
 *
 * The umbrella flow (#1501): detection runs first, the user accepts (or
 * is run in `--accept-detected` agent mode), and this mapper produces:
 *
 *   - `importedTokens`: the detected palette step tokens to merge into
 *     the registry on top of the default base system. Color tokens for
 *     the detected palettes overwrite the default neutral layer.
 *   - `importConfig`: a verbatim record of the user's decisions to
 *     persist on `RaftersConfig.import` so `--reset` can re-apply
 *     deterministically.
 *
 * Out of scope here (follow-ups gated on sibling PRs):
 *   - Spacing / typography / radius detection mapping (needs the detection
 *     of those namespaces, which the importers already surface but the
 *     full umbrella flow's per-namespace prompts aren't wired yet).
 *   - var() source-reference -> semantic-token bridging (needs #1504's
 *     PendingToken.sourceReference in scope; init doesn't read pending
 *     files in this MVP).
 *   - Theme presets when mode === 'themes' (today: treated as coexisting
 *     palettes; theme-preset generation is a separate follow-up).
 */

import type { PendingBrandDecision, Token } from '@rafters/shared';
import type { OnboardResult } from './orchestrator.js';

/**
 * Persisted record of the user's import decisions. Written to
 * `.rafters/config.rafters.json` under the `import` key so `--reset` can
 * re-apply without prompting.
 */
export interface ImportConfig {
  /** Importer that produced the source data. */
  source: string;
  /** Primary source file path (project-relative). */
  sourcePath: string;
  /** ISO-8601 timestamp the import was first applied. */
  detectedAt: string;
  /** Brand-decision block when one was captured; absent otherwise. */
  palettes?: {
    primary: string;
    mode: 'themes' | 'coexisting';
    /** Names of all palettes detected (in detection order). */
    detected: string[];
  };
  /**
   * Whether the default neutral semantic layer was layered on top of
   * the imported palettes. Tracks BrandImportDecision.keepDefaultSemantics.
   */
  keepDefaultSemantics: boolean;
}

export interface MapperResult {
  /**
   * Detected palette tokens flattened into the Token shape the registry
   * consumes. Empty when no brand system was detected or the user chose
   * `--assume-brand=flat`.
   */
  importedTokens: Token[];
  /**
   * Persisted record of decisions for `--reset`. Always emitted so init
   * can attach it to the config whether a brand system was detected or
   * not (the no-CSS / flat cases just produce an empty `palettes` field).
   */
  importConfig: ImportConfig;
}

export interface MapperInputs {
  result: OnboardResult;
  /**
   * The user's brand decision when the prompt ran. Absent when:
   *   - No brand system was detected.
   *   - The user passed `--assume-brand=flat`.
   *   - Agent mode without a decision (the caller should emit
   *     `needsDecision` and not reach the mapper).
   */
  decision?: PendingBrandDecision;
  /** Project-relative source path (passed through to importConfig). */
  sourcePath: string;
  /** Clock injection for deterministic detectedAt in tests. */
  now?: Date;
}

/**
 * Map detection output + decision into registry-ready tokens and a
 * persistable import config.
 */
export function mapOnboardToImport(inputs: MapperInputs): MapperResult {
  const { result, decision, sourcePath, now = new Date() } = inputs;
  const detectedAt = now.toISOString();

  // A decision is meaningful only when a brand system was detected AND
  // the user picked a primary. The classifier may have detected without
  // a decision arriving (agent flat path, or user declined).
  const honorBrand = Boolean(result.brandSystem.detected && decision);

  const importedTokens: Token[] = honorBrand
    ? result.palettes.flatMap((palette) => palette.steps.map((step) => step.token))
    : [];

  const importConfig: ImportConfig = {
    source: result.source ?? 'unknown',
    sourcePath,
    detectedAt,
    keepDefaultSemantics: decision?.keepDefaultSemantics ?? true,
    ...(honorBrand && decision
      ? {
          palettes: {
            primary: decision.primary,
            mode: decision.mode,
            detected: result.palettes.map((p) => p.name),
          },
        }
      : {}),
  };

  return { importedTokens, importConfig };
}
