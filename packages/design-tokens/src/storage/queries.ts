import type { TokenSetManifest } from '../schemas/manifest.js';
import type { Namespace } from '../schemas/namespace.js';
import type { Token, TokenId } from '../schemas/token.js';

/** Look up a token by id. */
export function getToken(manifest: TokenSetManifest, id: TokenId): Token | undefined {
  return manifest.tokens.find((t) => t.id === id);
}

/** Tokens in a single namespace. */
export function tokensInNamespace(manifest: TokenSetManifest, namespace: Namespace): Token[] {
  return manifest.tokens.filter((t) => t.namespace === namespace);
}

/** Ids `id` depends on (one hop). */
export function dependencies(manifest: TokenSetManifest, id: TokenId): TokenId[] {
  const token = getToken(manifest, id);
  return token ? token.dependsOn.map((d) => d.source) : [];
}

/** Ids that depend on `id` (one hop). Linear scan — fine for ~700 tokens. */
export function dependents(manifest: TokenSetManifest, id: TokenId): TokenId[] {
  const out: TokenId[] = [];
  for (const token of manifest.tokens) {
    for (const dep of token.dependsOn) {
      if (dep.source === id) {
        out.push(token.id);
        break;
      }
    }
  }
  return out;
}

/** Token ids with no upstream edges. */
export function roots(manifest: TokenSetManifest): TokenId[] {
  return manifest.tokens.filter((t) => t.dependsOn.length === 0).map((t) => t.id);
}

/** Topological order: dependencies before dependents. Throws on cycle. */
export function topological(manifest: TokenSetManifest): TokenId[] {
  const order: TokenId[] = [];
  const visited = new Set<TokenId>();
  const onStack = new Set<TokenId>();
  const ids = new Set(manifest.tokens.map((t) => t.id));

  const visit = (id: TokenId): void => {
    if (visited.has(id)) return;
    if (onStack.has(id)) {
      const error = new Error('topological: cycle detected');
      (error as Error & { cause?: unknown }).cause = { code: 'cycle', at: id };
      throw error;
    }
    onStack.add(id);
    for (const dep of dependencies(manifest, id)) {
      if (ids.has(dep)) visit(dep);
    }
    onStack.delete(id);
    visited.add(id);
    order.push(id);
  };

  for (const id of ids) visit(id);
  return order;
}
