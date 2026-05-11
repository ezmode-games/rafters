import { derive } from '../plugins/derive.js';
import type { PluginRegistry } from '../plugins/registry.js';
import type { TokenSetManifest } from '../schemas/manifest.js';
import type { TokenId } from '../schemas/token.js';
import type { TokenValue } from '../schemas/value.js';
import { dependents, getToken, setToken, topological } from '../storage/index.js';

export type CascadeIssueCode =
  | 'unknown-token'
  | 'missing-source'
  | 'unknown-plugin'
  | 'multi-source-not-supported'
  | 'invalid-args'
  | 'derive-threw'
  | 'invalid-output';

export interface CascadeIssue {
  id: TokenId;
  code: CascadeIssueCode;
  message: string;
  cause?: unknown;
}

export interface CascadeStepOk {
  ok: true;
  id: TokenId;
  before: TokenValue;
  after: TokenValue;
  changed: boolean;
}

export interface CascadeStepFail {
  ok: false;
  id: TokenId;
  issues: CascadeIssue[];
}

export type CascadeStepResult = CascadeStepOk | CascadeStepFail;

export interface CascadeRunResult {
  manifest: TokenSetManifest;
  recomputed: TokenId[];
  changed: TokenId[];
  issues: CascadeIssue[];
}

/** Recompute exactly one token. Returns the next manifest (possibly === input if unchanged) and the step result. */
export function recompute(
  manifest: TokenSetManifest,
  id: TokenId,
  plugins: PluginRegistry,
): { manifest: TokenSetManifest; step: CascadeStepResult } {
  const token = getToken(manifest, id);
  if (!token) {
    return {
      manifest,
      step: {
        ok: false,
        id,
        issues: [{ id, code: 'unknown-token', message: `Token "${id}" is not in the manifest.` }],
      },
    };
  }

  if (token.dependsOn.length === 0) {
    return {
      manifest,
      step: { ok: true, id, before: token.value, after: token.value, changed: false },
    };
  }

  if (token.dependsOn.length > 1) {
    return {
      manifest,
      step: {
        ok: false,
        id,
        issues: [
          {
            id,
            code: 'multi-source-not-supported',
            message: `Token "${id}" has ${token.dependsOn.length} dependsOn edges. v2 cascade supports single-edge derivations only.`,
          },
        ],
      },
    };
  }

  const dep = token.dependsOn[0];
  if (!dep) {
    return {
      manifest,
      step: { ok: true, id, before: token.value, after: token.value, changed: false },
    };
  }
  const source = getToken(manifest, dep.source);
  if (!source) {
    return {
      manifest,
      step: {
        ok: false,
        id,
        issues: [
          {
            id,
            code: 'missing-source',
            message: `Token "${id}" depends on "${dep.source}" which is not in the manifest.`,
          },
        ],
      },
    };
  }

  const plugin = plugins.get(dep.plugin);
  if (!plugin) {
    return {
      manifest,
      step: {
        ok: false,
        id,
        issues: [
          {
            id,
            code: 'unknown-plugin',
            message: `Token "${id}" requires plugin "${dep.plugin}" which is not registered.`,
          },
        ],
      },
    };
  }

  const result = derive(plugin, source.value, dep.args, id);
  if (!result.ok) {
    return {
      manifest,
      step: {
        ok: false,
        id,
        issues: [{ id, code: result.code, message: result.message, cause: result.cause }],
      },
    };
  }

  const before = token.value;
  const after = result.value;
  const changed = !valuesEqual(before, after);
  const nextManifest = changed ? setToken(manifest, { ...token, value: after }) : manifest;
  return { manifest: nextManifest, step: { ok: true, id, before, after, changed } };
}

/** Recompute every non-root token in topological order. */
export function fullRun(manifest: TokenSetManifest, plugins: PluginRegistry): CascadeRunResult {
  return runOrder(manifest, topological(manifest), plugins);
}

/** Recompute the transitive dependents of `changedIds` in topological order. */
export function propagate(
  manifest: TokenSetManifest,
  changedIds: readonly TokenId[],
  plugins: PluginRegistry,
): CascadeRunResult {
  const affected = new Set<TokenId>();
  const queue = [...changedIds];
  while (queue.length > 0) {
    const next = queue.shift();
    if (next === undefined) break;
    for (const dep of dependents(manifest, next)) {
      if (affected.has(dep)) continue;
      affected.add(dep);
      queue.push(dep);
    }
  }
  const order = topological(manifest).filter((id) => affected.has(id));
  return runOrder(manifest, order, plugins);
}

function runOrder(
  manifest: TokenSetManifest,
  order: readonly TokenId[],
  plugins: PluginRegistry,
): CascadeRunResult {
  let current = manifest;
  const recomputed: TokenId[] = [];
  const changed: TokenId[] = [];
  const issues: CascadeIssue[] = [];

  for (const id of order) {
    const token = getToken(current, id);
    if (!token || token.dependsOn.length === 0) continue;
    const { manifest: next, step } = recompute(current, id, plugins);
    current = next;
    recomputed.push(id);
    if (step.ok) {
      if (step.changed) changed.push(id);
    } else {
      issues.push(...step.issues);
    }
  }

  return { manifest: current, recomputed, changed, issues };
}

function valuesEqual(a: TokenValue, b: TokenValue): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
