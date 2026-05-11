import { derive } from '../plugins/derive.js';
import type { PluginRegistry } from '../plugins/registry.js';
import type { TokenId } from '../schemas/token.js';
import type { TokenValue } from '../schemas/value.js';
import type { TokenRegistry } from '../storage/registry.js';

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
  recomputed: TokenId[];
  changed: TokenId[];
  issues: CascadeIssue[];
}

/**
 * Read the registry's dependency graph, recompute derived tokens via plugins,
 * persist results back. Pure with respect to the registry — every effect
 * routes through TokenRegistry.set(). No registry handle leaves this engine.
 */
export class CascadeEngine {
  constructor(
    private readonly registry: TokenRegistry,
    private readonly plugins: PluginRegistry,
  ) {}

  /** Recompute exactly one token from its dependsOn edges. Root tokens (no deps) are no-ops. */
  recompute(id: TokenId): CascadeStepResult {
    const token = this.registry.get(id);
    if (!token) {
      return {
        ok: false,
        id,
        issues: [{ id, code: 'unknown-token', message: `Token "${id}" is not in the registry.` }],
      };
    }

    if (token.dependsOn.length === 0) {
      return { ok: true, id, before: token.value, after: token.value, changed: false };
    }

    if (token.dependsOn.length > 1) {
      return {
        ok: false,
        id,
        issues: [
          {
            id,
            code: 'multi-source-not-supported',
            message: `Token "${id}" has ${token.dependsOn.length} dependsOn edges. v2 cascade supports single-edge derivations only.`,
          },
        ],
      };
    }

    const dep = token.dependsOn[0];
    if (!dep) {
      return { ok: true, id, before: token.value, after: token.value, changed: false };
    }
    const source = this.registry.get(dep.source);
    if (!source) {
      return {
        ok: false,
        id,
        issues: [
          {
            id,
            code: 'missing-source',
            message: `Token "${id}" depends on "${dep.source}" which is not in the registry.`,
          },
        ],
      };
    }

    const plugin = this.plugins.get(dep.plugin);
    if (!plugin) {
      return {
        ok: false,
        id,
        issues: [
          {
            id,
            code: 'unknown-plugin',
            message: `Token "${id}" requires plugin "${dep.plugin}" which is not registered.`,
          },
        ],
      };
    }

    const result = derive(plugin, source.value, dep.args, id);
    if (!result.ok) {
      return {
        ok: false,
        id,
        issues: [{ id, code: result.code, message: result.message, cause: result.cause }],
      };
    }

    const before = token.value;
    const after = result.value;
    const changed = !valuesEqual(before, after);
    if (changed) {
      this.registry.set({ ...token, value: after });
    }
    return { ok: true, id, before, after, changed };
  }

  /** Walk every non-root token in topological order, recompute each. */
  fullRun(): CascadeRunResult {
    const order = this.registry.topological();
    return this.run(order);
  }

  /** Recompute the transitive dependents of `changedIds` in topo order. */
  propagate(changedIds: readonly TokenId[]): CascadeRunResult {
    const visited = new Set<TokenId>();
    const frontier: TokenId[] = [];
    const queue = [...changedIds];
    while (queue.length > 0) {
      const next = queue.shift();
      if (next === undefined) break;
      for (const dependent of this.registry.dependents(next)) {
        if (visited.has(dependent)) continue;
        visited.add(dependent);
        frontier.push(dependent);
        queue.push(dependent);
      }
    }

    const topoOrder = this.registry.topological();
    const order = topoOrder.filter((id) => visited.has(id));
    return this.run(order);
  }

  private run(order: readonly TokenId[]): CascadeRunResult {
    const recomputed: TokenId[] = [];
    const changed: TokenId[] = [];
    const issues: CascadeIssue[] = [];

    for (const id of order) {
      const token = this.registry.get(id);
      if (!token || token.dependsOn.length === 0) continue;
      const step = this.recompute(id);
      recomputed.push(id);
      if (step.ok) {
        if (step.changed) changed.push(id);
      } else {
        issues.push(...step.issues);
      }
    }

    return { recomputed, changed, issues };
  }
}

function valuesEqual(a: TokenValue, b: TokenValue): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
