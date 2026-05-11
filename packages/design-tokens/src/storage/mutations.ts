import type { TokenSetManifest } from '../schemas/manifest.js';
import type { Token, TokenId } from '../schemas/token.js';

/** Pure: returns a new manifest with `token` set (added or replaced by id). Original is not mutated. */
export function setToken(manifest: TokenSetManifest, token: Token): TokenSetManifest {
  const tokens = [...manifest.tokens];
  const existing = tokens.findIndex((t) => t.id === token.id);
  if (existing === -1) tokens.push(token);
  else tokens[existing] = token;
  return { ...manifest, tokens };
}

/** Pure: returns a new manifest with multiple tokens applied in order. */
export function setTokens(manifest: TokenSetManifest, tokens: readonly Token[]): TokenSetManifest {
  let next = manifest;
  for (const token of tokens) next = setToken(next, token);
  return next;
}

/** Pure: returns a new manifest with the token removed. If absent, returns the original reference. */
export function deleteToken(manifest: TokenSetManifest, id: TokenId): TokenSetManifest {
  const tokens = manifest.tokens.filter((t) => t.id !== id);
  if (tokens.length === manifest.tokens.length) return manifest;
  return { ...manifest, tokens };
}
