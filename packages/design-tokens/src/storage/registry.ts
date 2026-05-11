import type { Namespace } from '../schemas/namespace.js';
import type { RegistrySnapshot } from '../schemas/snapshot.js';
import type { Token, TokenId } from '../schemas/token.js';

/**
 * In-memory bidirectional DAG over Tokens.
 *
 * Per #1242 invariant: set() persists value only. There are no
 * cascade-behavior options here. Recomputation of dependents is the
 * cascade engine's job, invoked separately.
 */
export class TokenRegistry {
  private readonly tokens = new Map<TokenId, Token>();
  /** Reverse index: source id → set of ids whose dependsOn references that source. */
  private readonly reverse = new Map<TokenId, Set<TokenId>>();

  get(id: TokenId): Token | undefined {
    return this.tokens.get(id);
  }

  has(id: TokenId): boolean {
    return this.tokens.has(id);
  }

  size(): number {
    return this.tokens.size;
  }

  all(): readonly Token[] {
    return [...this.tokens.values()];
  }

  byNamespace(namespace: Namespace): readonly Token[] {
    const out: Token[] = [];
    for (const token of this.tokens.values()) {
      if (token.namespace === namespace) out.push(token);
    }
    return out;
  }

  set(token: Token): void {
    const previous = this.tokens.get(token.id);
    if (previous) this.unindexEdges(previous);
    this.tokens.set(token.id, token);
    this.indexEdges(token);
  }

  setMany(tokens: readonly Token[]): void {
    for (const token of tokens) this.set(token);
  }

  delete(id: TokenId): boolean {
    const existing = this.tokens.get(id);
    if (!existing) return false;
    this.unindexEdges(existing);
    this.tokens.delete(id);
    this.reverse.delete(id);
    return true;
  }

  /** Direct upstream ids — what `id` depends on. */
  dependencies(id: TokenId): readonly TokenId[] {
    const token = this.tokens.get(id);
    if (!token) return [];
    return token.dependsOn.map((d) => d.source);
  }

  /** Direct downstream ids — what depends on `id`. */
  dependents(id: TokenId): readonly TokenId[] {
    const set = this.reverse.get(id);
    return set ? [...set] : [];
  }

  /** Tokens with no dependsOn edges. */
  roots(): readonly TokenId[] {
    const out: TokenId[] = [];
    for (const token of this.tokens.values()) {
      if (token.dependsOn.length === 0) out.push(token.id);
    }
    return out;
  }

  /**
   * Topological order: dependencies before dependents.
   * Throws if a cycle is encountered. Validate at install time to avoid this path.
   */
  topological(): readonly TokenId[] {
    const order: TokenId[] = [];
    const visited = new Set<TokenId>();
    const onStack = new Set<TokenId>();

    const visit = (id: TokenId): void => {
      if (visited.has(id)) return;
      if (onStack.has(id)) {
        const error = new Error('TokenRegistry: cycle detected during topological sort');
        (error as Error & { cause?: unknown }).cause = { code: 'cycle', at: id };
        throw error;
      }
      onStack.add(id);
      for (const dep of this.dependencies(id)) {
        if (this.tokens.has(dep)) visit(dep);
      }
      onStack.delete(id);
      visited.add(id);
      order.push(id);
    };

    for (const id of this.tokens.keys()) visit(id);
    return order;
  }

  snapshot(pluginIds: readonly string[]): RegistrySnapshot {
    return {
      version: '2',
      takenAt: new Date().toISOString(),
      tokens: this.all().map((t) => structuredClone(t)),
      overrides: [],
      pluginIds: [...pluginIds],
    };
  }

  loadSnapshot(snapshot: RegistrySnapshot): void {
    this.clear();
    this.setMany(snapshot.tokens);
  }

  clear(): void {
    this.tokens.clear();
    this.reverse.clear();
  }

  private indexEdges(token: Token): void {
    for (const dep of token.dependsOn) {
      let set = this.reverse.get(dep.source);
      if (!set) {
        set = new Set();
        this.reverse.set(dep.source, set);
      }
      set.add(token.id);
    }
  }

  private unindexEdges(token: Token): void {
    for (const dep of token.dependsOn) {
      const set = this.reverse.get(dep.source);
      if (!set) continue;
      set.delete(token.id);
      if (set.size === 0) this.reverse.delete(dep.source);
    }
  }
}
