import { type TokenSetManifest, TokenSetManifestSchema } from '../schemas/manifest.js';
import type { ValidationIssue } from './issues.js';

export interface ValidationContext {
  /** Token ids resolvable from sets this manifest depends on. Combined with the manifest's own token ids when checking dependsOn.source. */
  externalTokenIds?: readonly string[];
  /** Plugin ids registered globally (built-ins, framework plugins). Combined with the manifest's own plugins[] when checking dependsOn.plugin. */
  knownPluginIds?: readonly string[];
}

export type ValidationResult =
  | { ok: true; manifest: TokenSetManifest }
  | { ok: false; issues: ValidationIssue[] };

export function validateTokenSet(input: unknown, ctx: ValidationContext = {}): ValidationResult {
  const parsed = TokenSetManifestSchema.safeParse(input);
  if (!parsed.success) {
    const issues: ValidationIssue[] = parsed.error.issues.map((i) => ({
      code: 'schema-violation',
      path: [...i.path],
      message: i.message,
    }));
    return { ok: false, issues };
  }

  const manifest = parsed.data;
  const issues: ValidationIssue[] = [];

  issues.push(...findIdCollisions(manifest));
  issues.push(...findNamespaceMismatches(manifest));
  issues.push(...findUnknownReferences(manifest, ctx));
  issues.push(...findCycles(manifest));

  return issues.length === 0 ? { ok: true, manifest } : { ok: false, issues };
}

function findIdCollisions(manifest: TokenSetManifest): ValidationIssue[] {
  const counts = new Map<string, number>();
  for (const token of manifest.tokens) {
    counts.set(token.id, (counts.get(token.id) ?? 0) + 1);
  }
  const issues: ValidationIssue[] = [];
  for (const [tokenId, count] of counts) {
    if (count > 1) issues.push({ code: 'id-collision', tokenId, count });
  }
  return issues;
}

function findNamespaceMismatches(manifest: TokenSetManifest): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const token of manifest.tokens) {
    const prefix = token.id.split('.')[0] ?? '';
    if (prefix !== token.namespace) {
      issues.push({
        code: 'namespace-mismatch',
        tokenId: token.id,
        declared: token.namespace,
        idPrefix: prefix,
      });
    }
  }
  return issues;
}

function findUnknownReferences(
  manifest: TokenSetManifest,
  ctx: ValidationContext,
): ValidationIssue[] {
  const internalIds = new Set(manifest.tokens.map((t) => t.id));
  const externalIds = new Set(ctx.externalTokenIds ?? []);
  const declaredPlugins = new Set([...manifest.plugins, ...(ctx.knownPluginIds ?? [])]);

  const issues: ValidationIssue[] = [];
  for (const token of manifest.tokens) {
    for (const dep of token.dependsOn) {
      if (!internalIds.has(dep.source) && !externalIds.has(dep.source)) {
        issues.push({
          code: 'unknown-dependency-source',
          tokenId: token.id,
          source: dep.source,
        });
      }
      if (!declaredPlugins.has(dep.plugin)) {
        issues.push({
          code: 'unknown-dependency-plugin',
          tokenId: token.id,
          plugin: dep.plugin,
        });
      }
    }
  }
  return issues;
}

function findCycles(manifest: TokenSetManifest): ValidationIssue[] {
  const internalIds = new Set(manifest.tokens.map((t) => t.id));
  const adjacency = new Map<string, string[]>();
  for (const token of manifest.tokens) {
    adjacency.set(
      token.id,
      token.dependsOn.map((d) => d.source).filter((s) => internalIds.has(s)),
    );
  }

  const visited = new Set<string>();
  const onStack = new Set<string>();
  const stack: string[] = [];
  const issues: ValidationIssue[] = [];

  function dfs(node: string): void {
    if (onStack.has(node)) {
      const start = stack.indexOf(node);
      const cycle = stack.slice(start).concat(node);
      issues.push({ code: 'cycle', cycle });
      return;
    }
    if (visited.has(node)) return;
    visited.add(node);
    onStack.add(node);
    stack.push(node);
    for (const next of adjacency.get(node) ?? []) dfs(next);
    stack.pop();
    onStack.delete(node);
  }

  for (const id of internalIds) {
    if (!visited.has(id)) dfs(id);
  }
  return dedupeCycles(issues);
}

function dedupeCycles(issues: ValidationIssue[]): ValidationIssue[] {
  const seen = new Set<string>();
  const out: ValidationIssue[] = [];
  for (const issue of issues) {
    if (issue.code !== 'cycle') {
      out.push(issue);
      continue;
    }
    const key = canonicalCycleKey(issue.cycle);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(issue);
  }
  return out;
}

function canonicalCycleKey(cycle: string[]): string {
  const nodes = cycle.slice(0, -1);
  if (nodes.length === 0) return '';
  let minIdx = 0;
  for (let i = 1; i < nodes.length; i++) {
    if ((nodes[i] ?? '') < (nodes[minIdx] ?? '')) minIdx = i;
  }
  return [...nodes.slice(minIdx), ...nodes.slice(0, minIdx)].join('>');
}
