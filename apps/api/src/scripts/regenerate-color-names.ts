/**
 * Regenerate Color Names in Vectorize
 *
 * Updates all cached color names to use brightness-based luminosity words
 * introduced in PR #558.
 *
 * Usage: pnpm tsx apps/api/src/scripts/regenerate-color-names.ts [--dry-run]
 *
 * Flags:
 *   --dry-run  Preview changes without writing to Vectorize
 */

import { execFileSync } from 'node:child_process';
import { unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { generateColorName } from '@rafters/color-utils';
import type { ColorValue, OKLCH } from '@rafters/shared';

const INDEX_NAME = 'rafters-colors';
const GET_BATCH_SIZE = 20; // Vectorize API limit for get-vectors
const UPSERT_BATCH_SIZE = 100; // Accumulate before upserting

interface VectorListResponse {
  count: number;
  totalCount: number;
  isTruncated: boolean;
  nextCursor?: string;
  vectors: Array<{ id: string }>;
}

interface VectorGetResponse {
  vectors: Array<{
    id: string;
    values: number[];
    metadata?: Record<string, unknown>;
  }>;
}

interface RegenerationResult {
  total: number;
  updated: number;
  skipped: number;
  errors: Array<{ id: string; error: string }>;
}

function runWrangler(args: string[]): string {
  const result = execFileSync('pnpm', ['wrangler', ...args], {
    encoding: 'utf-8',
    maxBuffer: 50 * 1024 * 1024, // 50MB buffer for large responses
  });
  return result;
}

async function getAllVectorIds(): Promise<string[]> {
  const ids: string[] = [];
  let cursor: string | undefined;

  console.log('Fetching all vector IDs...');

  do {
    const args = ['vectorize', 'list-vectors', INDEX_NAME, '--json'];
    if (cursor) {
      // Use = syntax to prevent cursor starting with - from being parsed as flag
      args.push(`--cursor=${cursor}`);
    }

    const output = runWrangler(args);
    const response: VectorListResponse = JSON.parse(output);

    for (const v of response.vectors) {
      ids.push(v.id);
    }

    console.log(`  Fetched ${ids.length}/${response.totalCount} IDs`);
    cursor = response.isTruncated ? response.nextCursor : undefined;
  } while (cursor);

  return ids;
}

function getVectorsBatch(ids: string[]): VectorGetResponse {
  // get-vectors outputs a banner before the JSON array
  const args = ['vectorize', 'get-vectors', INDEX_NAME, '--ids', ...ids];
  const output = runWrangler(args);

  // Strip everything before the JSON array starts
  const jsonStart = output.indexOf('[');
  if (jsonStart === -1) {
    throw new Error('No JSON array found in get-vectors output');
  }
  const jsonOutput = output.slice(jsonStart);

  // Parse the array and wrap in expected structure
  const vectors = JSON.parse(jsonOutput);
  return { vectors };
}

function regenerateName(color: ColorValue): string {
  // Get base color from scale[5] (the 500 step) or first available
  const baseColor: OKLCH = color.scale[5] ?? color.scale[0] ?? { l: 0.5, c: 0, h: 0, alpha: 1 };
  return generateColorName(baseColor);
}

function processVectors(
  vectors: VectorGetResponse['vectors'],
  dryRun: boolean,
): {
  updated: Array<{ id: string; values: number[]; metadata: Record<string, unknown> }>;
  errors: Array<{ id: string; error: string }>;
} {
  const updated: Array<{ id: string; values: number[]; metadata: Record<string, unknown> }> = [];
  const errors: Array<{ id: string; error: string }> = [];

  for (const vector of vectors) {
    try {
      if (!vector.metadata?.color_json) {
        errors.push({ id: vector.id, error: 'No color_json in metadata' });
        continue;
      }

      const colorJson = vector.metadata.color_json as string;
      const color: ColorValue = JSON.parse(colorJson);
      const oldName = color.name;
      const newName = regenerateName(color);

      if (oldName === newName) {
        // Name unchanged, skip
        continue;
      }

      // Update color with new name
      color.name = newName;

      // Rebuild metadata with updated color_json
      const newMetadata = {
        ...vector.metadata,
        color_json: JSON.stringify(color),
      };

      // In dry-run, only log first few changes as examples
      if (dryRun && updated.length < 5) {
        console.log(`\n  [DRY RUN] ${vector.id}: "${oldName}" -> "${newName}"`);
      }

      updated.push({
        id: vector.id,
        values: vector.values,
        metadata: newMetadata,
      });
    } catch (err) {
      errors.push({
        id: vector.id,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return { updated, errors };
}

function upsertVectors(
  vectors: Array<{ id: string; values: number[]; metadata: Record<string, unknown> }>,
): void {
  if (vectors.length === 0) return;

  // Write NDJSON file
  const tempFile = join(process.cwd(), '.vectorize-upsert-temp.ndjson');
  const ndjson = vectors.map((v) => JSON.stringify(v)).join('\n');
  writeFileSync(tempFile, ndjson);

  try {
    runWrangler(['vectorize', 'upsert', INDEX_NAME, '--file', tempFile, '--json']);
  } finally {
    unlinkSync(tempFile);
  }
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run');

  console.log('='.repeat(60));
  console.log('Regenerate Color Names in Vectorize');
  console.log('='.repeat(60));
  if (dryRun) {
    console.log('DRY RUN MODE - No changes will be written');
  }
  console.log('');

  const result: RegenerationResult = {
    total: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  };

  // Get all vector IDs
  const allIds = await getAllVectorIds();
  result.total = allIds.length;
  console.log(`\nTotal vectors: ${allIds.length}`);
  console.log('');

  // Accumulator for upserts
  let pendingUpserts: Array<{ id: string; values: number[]; metadata: Record<string, unknown> }> =
    [];

  // Process in small batches (API limit is 20 for get-vectors)
  const totalBatches = Math.ceil(allIds.length / GET_BATCH_SIZE);
  for (let i = 0; i < allIds.length; i += GET_BATCH_SIZE) {
    const batchIds = allIds.slice(i, i + GET_BATCH_SIZE);
    const batchNum = Math.floor(i / GET_BATCH_SIZE) + 1;

    process.stdout.write(`\rProcessing batch ${batchNum}/${totalBatches}...`);

    // Get vectors with metadata
    const vectorData = getVectorsBatch(batchIds);

    // Process and regenerate names
    const { updated, errors } = processVectors(vectorData.vectors, dryRun);

    result.updated += updated.length;
    result.skipped += vectorData.vectors.length - updated.length - errors.length;
    result.errors.push(...errors);

    // Accumulate updates
    pendingUpserts.push(...updated);

    // Upsert when we have enough accumulated
    if (!dryRun && pendingUpserts.length >= UPSERT_BATCH_SIZE) {
      upsertVectors(pendingUpserts);
      pendingUpserts = [];
    }
  }

  // Final upsert for remaining vectors
  if (!dryRun && pendingUpserts.length > 0) {
    upsertVectors(pendingUpserts);
  }

  console.log(''); // New line after progress

  // Summary
  console.log('');
  console.log('='.repeat(60));
  console.log('Summary');
  console.log('='.repeat(60));
  console.log(`Total vectors:   ${result.total}`);
  console.log(`Updated:         ${result.updated}`);
  console.log(`Skipped (same):  ${result.skipped}`);
  console.log(`Errors:          ${result.errors.length}`);

  if (result.errors.length > 0) {
    console.log('\nErrors:');
    for (const err of result.errors) {
      console.log(`  ${err.id}: ${err.error}`);
    }
  }

  if (dryRun) {
    console.log('\nDRY RUN - No changes were written. Run without --dry-run to apply.');
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
