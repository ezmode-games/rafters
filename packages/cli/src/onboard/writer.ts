/**
 * Import Pending Writer
 *
 * Converts orchestrator OnboardResult into the ImportPending schema
 * and writes it to .rafters/import-pending.json for user review.
 */

import { mkdir, rename, writeFile } from 'node:fs/promises';
import { dirname, relative } from 'node:path';
import {
  type ImportPending,
  ImportPendingSchema,
  type PendingPalette,
  type PendingToken,
  type Token,
} from '@rafters/shared';
import type { OnboardResult } from './orchestrator.js';

/**
 * Convert an OnboardResult into an ImportPending document.
 *
 * Each token from the orchestrator becomes a PendingToken with:
 *   - original: best-effort reconstruction from the source variable name
 *   - proposed: the token the importer produced
 *   - decision: 'pending' (user hasn't reviewed yet)
 *   - confidence: inherited from system confidence (per-token confidence
 *     would require importer changes, so for now we use system confidence)
 *   - rationale: the token's own semanticMeaning field
 */
export function toImportPending(
  result: OnboardResult,
  projectRoot: string,
  now: Date = new Date(),
): ImportPending {
  if (!result.source) {
    throw new Error('Cannot build ImportPending from a failed onboard result');
  }

  const [primarySource, ...additionalSources] = result.sourcePaths.map((p) =>
    relative(projectRoot, p),
  );

  const tokens: PendingToken[] = result.tokens.map((token) => {
    return {
      original: {
        // Reverse the `Imported from X --var-name` convention to recover the source var
        name: extractSourceVarName(token.semanticMeaning) ?? token.name,
        value: renderSourceValue(token.value),
        source: primarySource ?? '',
      },
      proposed: token,
      decision: 'pending' as const,
      confidence: result.confidence,
      rationale: token.semanticMeaning,
    };
  });

  const palettes: PendingPalette[] = result.palettes.map((palette) => ({
    name: palette.name,
    scale: palette.scale,
    source: primarySource ?? '',
    steps: palette.steps.map((step) => {
      return {
        position: step.position,
        original: {
          name: extractSourceVarName(step.token.semanticMeaning) ?? step.token.name,
          value: renderSourceValue(step.token.value),
          source: primarySource ?? '',
        },
        proposed: step.token,
      };
    }),
    decision: 'pending' as const,
    confidence: result.confidence,
  }));

  const warnings = result.warnings
    .filter((w) => w.level !== 'error' || result.tokens.length > 0 || palettes.length > 0)
    .map((w) => ({ level: w.level, message: w.message }));

  const doc: ImportPending = {
    version: '1.0',
    createdAt: now.toISOString(),
    detectedSystem: result.source,
    systemConfidence: result.confidence,
    source: primarySource ?? '',
    ...(additionalSources.length > 0 ? { additionalSources } : {}),
    ...(warnings.length > 0 ? { warnings } : {}),
    tokens,
    ...(palettes.length > 0 ? { palettes } : {}),
  };

  // Validate before returning so any schema drift fails loudly
  return ImportPendingSchema.parse(doc);
}

/**
 * Render a `Token['value']` back to a source-CSS-equivalent string for the
 * `original.value` field. The shapes we handle:
 *
 *   - string: passes through verbatim (the typical CSS literal case).
 *   - ColorReference ({family, position}): a semantic-points-at-palette
 *     token (#1404). Source-equivalent is `var(--<family>-<position>)`,
 *     which is what the user wrote (give or take prefix conventions like
 *     `--color-`). Studio resolves the reference at display time.
 *   - ColorValue (full OKLCH object): not produced by importers today
 *     (would mean an already-resolved structured object); collapsed to
 *     the JSON form rather than thrown so the writer remains total.
 */
function renderSourceValue(value: Token['value']): string {
  if (typeof value === 'string') return value;
  if ('family' in value && 'position' in value) {
    return `var(--${value.family}-${value.position})`;
  }
  return JSON.stringify(value);
}

/**
 * Extract the source variable name from a semanticMeaning string.
 * Importers write "Imported from <system> --var-name" or "Imported from CSS variable --var-name".
 * Returns the --var-name portion or null if the pattern doesn't match.
 */
function extractSourceVarName(semanticMeaning: string | undefined): string | null {
  if (!semanticMeaning) return null;
  const match = semanticMeaning.match(/(--[\w-]+)/);
  return match?.[1] ?? null;
}

/**
 * Write an ImportPending document to disk atomically.
 * Creates parent directories as needed. Writes to a temp file and renames
 * so that a concurrent reader never sees a partially-written file.
 */
export async function writeImportPending(path: string, doc: ImportPending): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  const tmp = `${path}.tmp-${process.pid}`;
  await writeFile(tmp, `${JSON.stringify(doc, null, 2)}\n`, 'utf-8');
  await rename(tmp, path);
}
