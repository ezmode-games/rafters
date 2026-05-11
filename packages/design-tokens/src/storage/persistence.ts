import { readFile, writeFile } from 'node:fs/promises';
import { type TokenSetManifest, TokenSetManifestSchema } from '../schemas/manifest.js';

/** Load a TokenSetManifest from a path. Validates with Zod on read. */
export async function loadManifest(path: string): Promise<TokenSetManifest> {
  const raw = await readFile(path, 'utf8');
  const json: unknown = JSON.parse(raw);
  return TokenSetManifestSchema.parse(json);
}

/** Validate and write a manifest. No atomic-write ceremony — a Rafters system is ~700 tokens with no concurrent writers. */
export async function saveManifest(path: string, manifest: TokenSetManifest): Promise<void> {
  const validated = TokenSetManifestSchema.parse(manifest);
  await writeFile(path, `${JSON.stringify(validated, null, 2)}\n`, 'utf8');
}
