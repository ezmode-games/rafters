import { readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { type TokenSetManifest, TokenSetManifestSchema } from '../schemas/manifest.js';
import { type RegistrySnapshot, RegistrySnapshotSchema } from '../schemas/snapshot.js';

/** Load a TokenSetManifest from a path. Validates with Zod on read; rejects malformed manifests. */
export async function loadManifest(path: string): Promise<TokenSetManifest> {
  const raw = await readFile(path, 'utf8');
  const json: unknown = JSON.parse(raw);
  return TokenSetManifestSchema.parse(json);
}

/** Atomically write a manifest. Writes to <path>.tmp then renames to avoid torn reads. */
export async function saveManifest(path: string, manifest: TokenSetManifest): Promise<void> {
  const validated = TokenSetManifestSchema.parse(manifest);
  await atomicWrite(path, `${JSON.stringify(validated, null, 2)}\n`);
}

export async function loadSnapshot(path: string): Promise<RegistrySnapshot> {
  const raw = await readFile(path, 'utf8');
  const json: unknown = JSON.parse(raw);
  return RegistrySnapshotSchema.parse(json);
}

export async function saveSnapshot(path: string, snapshot: RegistrySnapshot): Promise<void> {
  const validated = RegistrySnapshotSchema.parse(snapshot);
  await atomicWrite(path, `${JSON.stringify(validated, null, 2)}\n`);
}

async function atomicWrite(path: string, contents: string): Promise<void> {
  const tmp = join(dirname(path), `.${randomSuffix()}.tmp`);
  await writeFile(tmp, contents, 'utf8');
  await rename(tmp, path);
}

function randomSuffix(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 1e9).toString(36)}`;
}
