import type { Token } from '@rafters/shared';
import { TokenDependencyGraph } from './dependencies.js';
import type { PersistenceAdapter } from './persistence.js';
import type { CascadeResult, Plugin } from './plugins.js';

export interface MutationEvent {
  kind: 'add' | 'set' | 'remove' | 'clear-override' | 'cascade';
  tokenName?: string | undefined;
  before?: Token['value'] | undefined;
  after?: Token['value'] | undefined;
  timestamp: string;
}

export type MutationHook = (event: MutationEvent) => void;

/**
 * TokenRegistry — flat map of tokens plus a forward-edge dependency graph.
 *
 * `set` is a Map write only: it updates the value, preserves metadata, never
 * cascades, never persists, never fires events beyond `onMutation`. Cascade
 * lives on the graph; `registry.cascade()` is sugar that wires the graph's
 * cascade walker to this registry's value getter/setter.
 *
 * Plugins register here (`use(plugin)`) and are dispatched by their `rule` tag
 * during cascade. Plugins never reach back into the registry — they receive
 * pre-resolved source values via the cascade's callbacks.
 *
 * Persistence is a swappable adapter seam. OSS uses `NodePersistenceAdapter`;
 * the commercial Rafters+ host swaps in its own to record deep history.
 * Granular event history comes through `onMutation`, not through the adapter.
 */
export class TokenRegistry {
  private readonly tokens = new Map<string, Token>();
  readonly graph = new TokenDependencyGraph();
  private readonly plugins = new Map<string, Plugin>();
  private adapter: PersistenceAdapter | undefined;
  onMutation: MutationHook | undefined;

  constructor(initialTokens?: readonly Token[]) {
    if (!initialTokens) return;
    for (const token of initialTokens) this.tokens.set(token.name, token);
    this.populateDependencyGraph();
  }

  // -- Read --

  get(name: string): Token | undefined {
    return this.tokens.get(name);
  }

  has(name: string): boolean {
    return this.tokens.has(name);
  }

  size(): number {
    return this.tokens.size;
  }

  list(filter?: { category?: string; namespace?: string }): Token[] {
    const all = [...this.tokens.values()];
    if (!filter) return all;
    return all.filter((token) => {
      if (filter.category && token.category !== filter.category) return false;
      if (filter.namespace && token.namespace !== filter.namespace) return false;
      return true;
    });
  }

  // -- Write --

  add(token: Token): void {
    this.tokens.set(token.name, token);
    if (token.dependsOn && token.dependsOn.length > 0 && token.generationRule) {
      this.graph.addDependency(token.name, token.dependsOn, token.generationRule);
    }
    this.fire({
      kind: 'add',
      tokenName: token.name,
      after: token.value,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Compatibility shim for v1's `setToken`. Replaces the full token (add semantics)
   * and auto-persists if an adapter is set. Prefer `add` + explicit `persist` for new code.
   */
  async setToken(token: Token): Promise<void> {
    this.add(token);
    if (this.adapter) await this.persist();
  }

  /**
   * Compatibility shim for v1's `setTokens`. Batch full-token replacement, single persist.
   * Prefer iterating `add` + explicit `persist` for new code.
   */
  async setTokens(tokens: readonly Token[]): Promise<void> {
    for (const token of tokens) this.add(token);
    if (this.adapter) await this.persist();
  }

  /**
   * Compatibility shim for v1's `updateToken`. Sync value update — no auto-persist,
   * matching v1's `updateToken` behavior. Prefer `set` for new code.
   */
  updateToken(name: string, value: Token['value']): void {
    this.set(name, value);
  }

  /**
   * Compatibility shim for v1's `setChangeCallback`. Wires the callback through
   * `onMutation`. Note: event shapes differ — v1 emitted `TokenChangeEvent` with a
   * `type` field; this calls the callback with a `MutationEvent` carrying `kind`.
   * Studio's callback consumer is being rearchitected; this shim unblocks the
   * migration until that lands.
   */
  setChangeCallback(callback: MutationHook): void {
    this.onMutation = callback;
  }

  /** Map write. Updates value, preserves metadata. No cascade, no persist. */
  set(name: string, value: Token['value']): void {
    const existing = this.tokens.get(name);
    if (!existing) {
      throw new Error(`Token "${name}" does not exist`);
    }
    const before = existing.value;
    this.tokens.set(name, { ...existing, value });
    this.fire({
      kind: 'set',
      tokenName: name,
      before,
      after: value,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Clear a token's userOverride.
   *  - Derived token (has generationRule): remove userOverride, cascade to recompute baseline.
   *  - Root token: remove userOverride, restore previousValue (throws if absent).
   */
  async clearOverride(name: string): Promise<void> {
    const existing = this.tokens.get(name);
    if (!existing) {
      throw new Error(`Token "${name}" does not exist`);
    }
    if (!existing.userOverride) {
      return;
    }

    const before = existing.value;
    const rule = this.graph.getGenerationRule(name);

    if (rule) {
      const { userOverride: _, ...rest } = existing;
      this.tokens.set(name, rest as Token);
      await this.cascade(name);
    } else {
      const { previousValue } = existing.userOverride;
      if (previousValue === undefined) {
        throw new Error(
          `Cannot clear override for root token "${name}": no previousValue to restore`,
        );
      }
      const { userOverride: _, ...rest } = existing;
      this.tokens.set(name, { ...rest, value: previousValue } as Token);
    }

    const after = this.tokens.get(name)?.value;
    this.fire({
      kind: 'clear-override',
      tokenName: name,
      before,
      after,
      timestamp: new Date().toISOString(),
    });
  }

  remove(name: string): boolean {
    if (!this.tokens.has(name)) return false;
    const before = this.tokens.get(name)?.value;
    this.graph.removeToken(name);
    this.tokens.delete(name);
    this.fire({
      kind: 'remove',
      tokenName: name,
      before,
      timestamp: new Date().toISOString(),
    });
    return true;
  }

  clear(): void {
    this.tokens.clear();
    this.graph.clear();
  }

  // -- Graph aliases --

  dependencies(name: string): string[] {
    return this.graph.getDependencies(name);
  }

  dependents(name: string): string[] {
    return this.graph.getDependents(name);
  }

  /** Compatibility shim for v1 consumers. Alias for `dependents`. */
  getDependents(name: string): string[] {
    return this.dependents(name);
  }

  /** Compatibility shim for v1 consumers. Alias for `dependencies`. */
  getDependencies(name: string): string[] {
    return this.dependencies(name);
  }

  /** Compatibility shim for v1 consumers. Reads the generationRule edge from the graph. */
  getGenerationRule(name: string): string | undefined {
    return this.graph.getGenerationRule(name);
  }

  addDependency(name: string, dependsOn: readonly string[], rule: string): void {
    if (!this.tokens.has(name)) {
      throw new Error(`Token "${name}" does not exist`);
    }
    for (const dep of dependsOn) {
      if (!this.tokens.has(dep)) {
        throw new Error(`Token "${dep}" does not exist`);
      }
    }
    this.graph.addDependency(name, dependsOn, rule);
  }

  // -- Plugin layer --

  use(plugin: Plugin): void {
    this.plugins.set(plugin.rule, plugin);
  }

  /** Aliases graph.cascade with the registry's value getter/setter. */
  async cascade(startName?: string): Promise<CascadeResult> {
    const result = await this.graph.cascade(
      this.plugins,
      (n) => this.tokens.get(n)?.value,
      (n, value) => {
        const token = this.tokens.get(n);
        if (token) this.tokens.set(n, { ...token, value });
      },
      startName,
    );
    this.fire({
      kind: 'cascade',
      tokenName: startName,
      timestamp: new Date().toISOString(),
    });
    return result;
  }

  // -- Persistence --

  setAdapter(adapter: PersistenceAdapter): void {
    this.adapter = adapter;
  }

  async persist(): Promise<void> {
    if (!this.adapter) {
      throw new Error('TokenRegistry: no persistence adapter set (call setAdapter first)');
    }
    await this.adapter.save(this.list());
  }

  async load(): Promise<void> {
    if (!this.adapter) {
      throw new Error('TokenRegistry: no persistence adapter set (call setAdapter first)');
    }
    const tokens = await this.adapter.load();
    this.tokens.clear();
    this.graph.clear();
    for (const token of tokens) this.tokens.set(token.name, token);
    this.populateDependencyGraph();
  }

  // -- Internal --

  private populateDependencyGraph(): void {
    for (const token of this.tokens.values()) {
      if (token.dependsOn && token.dependsOn.length > 0 && token.generationRule) {
        const missing = token.dependsOn.filter((dep) => !this.tokens.has(dep));
        if (missing.length > 0) {
          console.warn(
            `[TokenRegistry] "${token.name}" skipped in graph: missing [${missing.join(', ')}]`,
          );
          continue;
        }
        this.graph.addDependency(token.name, token.dependsOn, token.generationRule);
      }
    }
  }

  private fire(event: MutationEvent): void {
    this.onMutation?.(event);
  }
}
