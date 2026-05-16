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
import { applyPending } from '../onboard/apply.js';
import { onboard, previewOnboard } from '../onboard/orchestrator.js';
import { toImportPending, writeImportPending } from '../onboard/writer.js';
import { DEFAULT_EXPORTS, type ExportConfig } from '../utils/exports.js';
import { getRaftersPaths } from '../utils/paths.js';
import { log, setAgentMode } from '../utils/ui.js';
import { generateOutputs, type RaftersConfig } from './init.js';

interface ImportOptions {
  force?: boolean;
  agent?: boolean;
  importer?: string;
  apply?: boolean;
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
  await writeImportPending(paths.importPending, doc);

  log({
    event: 'import:complete',
    path: relative(cwd, paths.importPending),
    source: result.source,
    confidence: result.confidence,
    tokensCreated: result.stats.tokensCreated,
    skipped: result.stats.skipped,
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
