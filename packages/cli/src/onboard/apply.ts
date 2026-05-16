/**
 * Apply Pending Imports
 *
 * Merges accepted (and modified) tokens from `.rafters/import-pending.json`
 * into `.rafters/tokens/`, archives the pending file, and reports counts.
 *
 * This is the "land the tokens" step in the import flow. `rafters import`
 * writes pending tokens for the user to review; the user (or Studio, when
 * it ships) marks each `accepted` / `rejected` / `modified`; then this
 * apply pass realises the accepted set into the registry. Studio will call
 * the same code path once it can drive the same review gesture.
 *
 * Out of scope here: palette acceptance (added by #1402 to ImportPending
 * but not yet routed through the registry layer -- a separate follow-up
 * handles palette materialisation).
 */

import { existsSync } from 'node:fs';
import { readFile, rename } from 'node:fs/promises';
import {
  contrastPlugin,
  invertPlugin,
  loadRegistryFromDir,
  saveRegistryToDir,
  scalePlugin,
  statePlugin,
  TokenRegistry,
} from '@rafters/design-tokens';
import { type ImportPending, ImportPendingSchema, type Token } from '@rafters/shared';
import type { RaftersPaths } from '../utils/paths.js';

const REGISTRY_PLUGINS = [scalePlugin, contrastPlugin, statePlugin, invertPlugin];

export interface ApplyStats {
  /** Tokens whose decision was `accepted` or `modified` and were merged. */
  applied: number;
  /** Tokens whose decision was `pending` and therefore left alone. */
  skippedPending: number;
  /** Tokens whose decision was `rejected`. */
  skippedRejected: number;
}

export interface ApplyResult {
  registry: TokenRegistry;
  stats: ApplyStats;
  /** Absolute path of the archived pending file. */
  archivedTo: string;
}

/**
 * Read .rafters/import-pending.json and validate it.
 * Throws if the file is missing or the schema does not match.
 */
async function readPending(pendingPath: string): Promise<ImportPending> {
  if (!existsSync(pendingPath)) {
    throw new Error(`No import-pending.json at ${pendingPath}. Run \`rafters import\` first.`);
  }

  const raw = await readFile(pendingPath, 'utf-8');
  const parsed: unknown = JSON.parse(raw);
  return ImportPendingSchema.parse(parsed);
}

/**
 * Build the final Token for a pending entry by overlaying any modifications
 * onto the proposed token. Only the four fields allowed by
 * ImportModificationsSchema (name, value, category, namespace) are touched;
 * everything else (userOverride, semanticMeaning, usageContext, ...) flows
 * through from the proposed token unchanged.
 */
function applyModifications(pending: ImportPending['tokens'][number]): Token {
  if (pending.decision !== 'modified' || !pending.modifications) {
    return pending.proposed;
  }

  const m = pending.modifications;
  return {
    ...pending.proposed,
    ...(m.name !== undefined ? { name: m.name } : {}),
    ...(m.value !== undefined ? { value: m.value } : {}),
    ...(m.category !== undefined ? { category: m.category } : {}),
    ...(m.namespace !== undefined ? { namespace: m.namespace } : {}),
  };
}

/**
 * Archive the pending file to `.rafters/import-pending.applied-<ISO>.json`
 * so the audit trail survives and a fresh `rafters import` can run without
 * the existing-file guard tripping.
 *
 * Returns the archive path.
 */
async function archivePending(pendingPath: string, now: Date): Promise<string> {
  const timestamp = now.toISOString().replace(/[:.]/g, '-');
  const archivePath = pendingPath.replace(/\.json$/, `.applied-${timestamp}.json`);
  await rename(pendingPath, archivePath);
  return archivePath;
}

export interface ApplyPendingOptions {
  /**
   * Override the clock used to stamp the archive filename. Tests rely on
   * this; production calls let it default to `new Date()`.
   */
  now?: Date;
}

/**
 * Merge accepted (and modified) tokens from `.rafters/import-pending.json`
 * into the registry under `.rafters/tokens/` and archive the pending file.
 *
 * Pending and rejected tokens are left in the archive untouched.
 *
 * Output regeneration is intentionally NOT done here. The caller composes
 * `applyPending` with `generateOutputs` (or chooses to skip outputs when
 * Studio handles its own emission path).
 */
export async function applyPending(
  paths: RaftersPaths,
  options: ApplyPendingOptions = {},
): Promise<ApplyResult> {
  const pending = await readPending(paths.importPending);

  let applied = 0;
  let skippedPending = 0;
  let skippedRejected = 0;
  const toMerge: Token[] = [];

  for (const entry of pending.tokens) {
    switch (entry.decision) {
      case 'accepted':
      case 'modified':
        toMerge.push(applyModifications(entry));
        applied += 1;
        break;
      case 'pending':
        skippedPending += 1;
        break;
      case 'rejected':
        skippedRejected += 1;
        break;
    }
  }

  // Load the registry the same way init.ts does so semantic bindings resolve
  // through the plugin set (otherwise re-saved tokens carrying a binding
  // throw `Unknown plugin: scale` on next load).
  const registry = existsSync(paths.tokens)
    ? loadRegistryFromDir(paths.tokens, REGISTRY_PLUGINS)
    : new TokenRegistry([], REGISTRY_PLUGINS);

  for (const token of toMerge) {
    // Overwrite-on-collision: imported intent wins over the existing token.
    // `define` is idempotent on name -- it re-seeds metadata + graph value.
    registry.define(token);
  }

  saveRegistryToDir(paths.tokens, registry);

  const archivedTo = await archivePending(paths.importPending, options.now ?? new Date());

  return {
    registry,
    stats: { applied, skippedPending, skippedRejected },
    archivedTo,
  };
}
