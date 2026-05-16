/**
 * rafters import
 *
 * Scans the project for existing design tokens (CSS custom properties,
 * Tailwind v4 @theme blocks, shadcn variables), maps them to rafters
 * tokens via the onboard orchestrator, and writes the result to
 * `.rafters/import-pending.json` for user review.
 *
 * Designers / developers review the pending file (via Studio once the
 * review UI ships, or by editing the JSON) and accept/reject/modify
 * each token before it lands in the registry.
 */

import { existsSync } from 'node:fs';
import { mkdir, readFile, rename } from 'node:fs/promises';
import { relative } from 'node:path';
import type { PendingBrandDecision, PendingBrandSystem } from '@rafters/shared';
import { applyPending } from '../onboard/apply.js';
import {
  buildNeedsDecision,
  parseAssumeBrand,
  promptBrandImport,
} from '../onboard/interactive-prompt.js';
import { onboard, previewOnboard } from '../onboard/orchestrator.js';
import { toImportPending, writeImportPending } from '../onboard/writer.js';
import { DEFAULT_EXPORTS, type ExportConfig } from '../utils/exports.js';
import { getRaftersPaths } from '../utils/paths.js';
import { isAgentMode, log, setAgentMode } from '../utils/ui.js';
import { generateOutputs, type RaftersConfig } from './init.js';

interface ImportOptions {
  force?: boolean;
  agent?: boolean;
  importer?: string;
  apply?: boolean;
  /**
   * Non-interactive brand-import resolution (#1401).
   *   - `flat`: skip the prompt; treat detected palettes as flat colour families.
   *   - `primary:<name>`: pre-select the primary palette.
   * Other forms throw.
   */
  assumeBrand?: string;
}

function isInteractive(): boolean {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY);
}

export async function importCommand(options: ImportOptions): Promise<void> {
  if (options.agent) {
    setAgentMode(true);
  }

  const cwd = process.cwd();
  const paths = getRaftersPaths(cwd);

  if (!existsSync(paths.root)) {
    log({
      event: 'import:no_rafters_dir',
      message: 'No .rafters/ directory found. Run `rafters init` first.',
    });
    process.exitCode = 1;
    return;
  }

  if (options.apply) {
    await runApply(cwd, paths);
    return;
  }

  if (existsSync(paths.importPending)) {
    if (!options.force) {
      log({
        event: 'import:pending_exists',
        path: relative(cwd, paths.importPending),
        message:
          'An import-pending.json already exists. Use --force to overwrite (previous file will be backed up).',
      });
      process.exitCode = 1;
      return;
    }

    // --force: back up the existing file so in-progress review work isn't lost
    const backupPath = `${paths.importPending}.backup-${Date.now()}.json`;
    await rename(paths.importPending, backupPath);
    log({
      event: 'import:pending_backed_up',
      backup: relative(cwd, backupPath),
    });
  }

  log({ event: 'import:scanning' });

  // Preview first -- surfaces what was detected even if no tokens come out
  const preview = await previewOnboard(cwd);
  if (preview.length === 0) {
    log({
      event: 'import:no_source_detected',
      message: 'No compatible design token source found',
      suggestion: 'Ensure your project has CSS files with custom properties or @theme blocks',
    });
    process.exitCode = 1;
    return;
  }

  const result = await onboard(cwd, options.importer ? { forceImporter: options.importer } : {});

  if (!result.success) {
    log({
      event: 'import:failed',
      source: result.source,
      warnings: result.warnings,
    });
    process.exitCode = 1;
    return;
  }

  const doc = toImportPending(result, cwd);

  // Brand-import decision flow (#1401): when the classifier flagged a
  // brand system, walk the user through primary/mode/keepDefaultSemantics
  // before writing the pending file. Honours --assume-brand=... for
  // non-interactive resolution.
  if (doc.brandSystem?.detected) {
    const decision = await resolveBrandDecision(doc.brandSystem, options.assumeBrand);
    if (decision === 'declined') {
      log({ event: 'import:declined' });
      return;
    }
    if (decision === 'needs-decision') {
      log({
        event: 'import:needs_brand_decision',
        ...buildNeedsDecision(doc.brandSystem),
        nextStep:
          'Re-run with --assume-brand=flat to keep the palettes flat, or --assume-brand=primary:<name> to pick a primary.',
      });
      return;
    }
    if (decision !== 'flat') {
      doc.brandDecision = decision;
    }
  }

  await writeImportPending(paths.importPending, doc);

  log({
    event: 'import:complete',
    path: relative(cwd, paths.importPending),
    source: result.source,
    confidence: result.confidence,
    tokensCreated: result.stats.tokensCreated,
    skipped: result.stats.skipped,
    brandDetected: doc.brandSystem?.detected ?? false,
    brandDecision: doc.brandDecision,
    nextStep:
      'Review and accept tokens in .rafters/import-pending.json, then run `rafters import --apply`',
  });
}

/**
 * Read the project's RaftersConfig if present, falling back to default exports.
 * `import --apply` needs the exports config so it can regenerate the same
 * files `init` originally produced (Tailwind CSS, TS, DTCG, compiled).
 */
async function loadExportConfig(configPath: string): Promise<ExportConfig> {
  if (!existsSync(configPath)) {
    return DEFAULT_EXPORTS;
  }
  try {
    const raw = await readFile(configPath, 'utf-8');
    const parsed = JSON.parse(raw) as RaftersConfig;
    return parsed.exports ?? DEFAULT_EXPORTS;
  } catch {
    // Malformed config -- fall back to defaults rather than blocking the apply.
    return DEFAULT_EXPORTS;
  }
}

/**
 * Run `rafters import --apply`: merge accepted pending tokens into the
 * registry, regenerate outputs, archive the pending file, and report counts.
 */
async function runApply(cwd: string, paths: ReturnType<typeof getRaftersPaths>): Promise<void> {
  log({ event: 'import:applying' });

  const result = await applyPending(paths);

  await mkdir(paths.output, { recursive: true });
  const exports = await loadExportConfig(paths.config);
  // `import --apply` does not have shadcn detection plumbed in; use null. If a
  // shadcn project applies, the resulting Tailwind CSS includes the @import
  // line -- safe to override at the consumer's css entry.
  const outputs = await generateOutputs(cwd, paths, result.registry, exports, null);

  log({
    event: 'import:applied',
    applied: result.stats.applied,
    skippedPending: result.stats.skippedPending,
    skippedRejected: result.stats.skippedRejected,
    archive: relative(cwd, result.archivedTo),
    outputs,
  });
}

/**
 * Resolve the brand-import decision from flags, environment, or prompt.
 *
 * Precedence:
 *   1. `--assume-brand=...` (parsed; throws if malformed)
 *   2. Agent / non-interactive mode -> `needs-decision`
 *   3. Interactive prompt; Ctrl-C / Esc -> `declined`
 */
async function resolveBrandDecision(
  brandSystem: PendingBrandSystem,
  assumeBrand: string | undefined,
): Promise<PendingBrandDecision | 'flat' | 'needs-decision' | 'declined'> {
  const preset = parseAssumeBrand(assumeBrand);
  if (preset === 'flat') return 'flat';
  if (preset) return preset;

  if (isAgentMode() || !isInteractive()) {
    return 'needs-decision';
  }

  try {
    return await promptBrandImport(brandSystem);
  } catch {
    return 'declined';
  }
}
