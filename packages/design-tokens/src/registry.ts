import { type Token, TokenSchema } from '@rafters/shared';
import type { z } from 'zod';
import { type Node, type Plugin, type SetOptions, TokenGraph } from './graph.js';

type TokenValue = z.infer<typeof TokenSchema>['value'];
type UserOverrideField = NonNullable<z.infer<typeof TokenSchema>['userOverride']>;

export type RegistryFilter = {
  namespace?: string;
  category?: string;
};

export class TokenRegistry {
  private graph: TokenGraph;
  private plugins = new Map<string, Plugin>();
  private metadata = new Map<string, Token>();

  constructor(initialTokens: readonly unknown[] = [], plugins: readonly Plugin[] = []) {
    this.graph = new TokenGraph(plugins);
    for (const plugin of plugins) this.plugins.set(plugin.name, plugin);
    // Two passes so bindings can reference family tokens regardless of source order.
    const parsed: Token[] = [];
    for (const raw of initialTokens) {
      const result = TokenSchema.safeParse(raw);
      if (!result.success) {
        throw new TokenParseError(raw, result.error.issues);
      }
      this.metadata.set(result.data.name, result.data);
      parsed.push(result.data);
    }
    // Pass 1: leaves and overrides.
    for (const t of parsed) {
      if (t.binding) continue;
      if (t.userOverride) {
        this.graph.set(t.name, t.value, {
          cascade: false,
          reason: t.userOverride.reason,
          ...(t.userOverride.context ? { context: t.userOverride.context } : {}),
        });
      } else {
        this.graph.set(t.name, t.value);
      }
    }
    // Pass 2: bindings (dependents now resolve against leaves).
    for (const t of parsed) {
      if (!t.binding) continue;
      this.graph.bind(t.name, t.binding.plugin, t.binding.input);
    }
  }

  registerPlugin(plugin: Plugin): void {
    this.graph.registerPlugin(plugin);
    this.plugins.set(plugin.name, plugin);
  }

  define(token: unknown): void {
    const result = TokenSchema.safeParse(token);
    if (!result.success) {
      throw new TokenParseError(token, result.error.issues);
    }
    const t = result.data;
    this.metadata.set(t.name, t);
    if (t.binding) {
      this.graph.bind(t.name, t.binding.plugin, t.binding.input);
    } else if (t.userOverride) {
      this.graph.set(t.name, t.value, {
        cascade: false,
        reason: t.userOverride.reason,
        ...(t.userOverride.context ? { context: t.userOverride.context } : {}),
      });
    } else {
      this.graph.set(t.name, t.value);
    }
  }

  set(name: string, value: TokenValue, options?: SetOptions): void {
    if (!this.metadata.has(name)) {
      throw new UnknownTokenError(name);
    }
    this.graph.set(name, value, options);
  }

  bind(name: string, pluginName: string, input: unknown): void {
    if (!this.metadata.has(name)) {
      throw new UnknownTokenError(name);
    }
    this.graph.bind(name, pluginName, input);
  }

  get(name: string): Token | undefined {
    const node = this.graph.node(name);
    const meta = this.metadata.get(name);
    if (!node || !meta) return undefined;
    return this.toToken(node, meta);
  }

  undo(): void {
    this.graph.undo();
  }

  has(name: string): boolean {
    return this.graph.has(name);
  }

  size(): number {
    return this.graph.size();
  }

  list(filter?: RegistryFilter): readonly Token[] {
    const out: Token[] = [];
    for (const node of this.graph.list()) {
      const meta = this.metadata.get(node.name);
      if (!meta) continue;
      const token = this.toToken(node, meta);
      if (filter?.namespace && token.namespace !== filter.namespace) continue;
      if (filter?.category && token.category !== filter.category) continue;
      out.push(token);
    }
    return out;
  }

  private toToken(node: Node, meta: Token): Token {
    // Preserve metadata's dependsOn (it carries the dependsOn[1] dark counterpart
    // typed convention the exporter relies on); the runtime binding edges live
    // on node.binding and are derivable via plugin.dependsOn at cascade time.
    return {
      ...meta,
      name: node.name,
      value: node.value as TokenValue,
      userOverride: node.userOverride ? toUserOverrideField(node.userOverride, meta.value) : null,
    };
  }
}

export class UnknownTokenError extends Error {
  constructor(public readonly tokenName: string) {
    super(`Token not registered: ${tokenName}`);
    this.name = 'UnknownTokenError';
  }
}

export class TokenParseError extends Error {
  constructor(
    public readonly raw: unknown,
    public readonly issues: readonly z.core.$ZodIssue[],
  ) {
    const first = issues[0];
    const detail = first ? `${first.path.join('.')}: ${first.message}` : 'unknown';
    const name =
      raw && typeof raw === 'object' && typeof (raw as { name?: unknown }).name === 'string'
        ? (raw as { name: string }).name
        : '<unnamed>';
    super(`Token "${name}" failed TokenSchema validation: ${detail}`);
    this.name = 'TokenParseError';
  }
}

function toUserOverrideField(
  override: NonNullable<Node['userOverride']>,
  baseValue: TokenValue,
): UserOverrideField {
  const previousValue = (override.previousValue as TokenValue | undefined) ?? baseValue;
  const result: UserOverrideField = {
    previousValue,
    reason: override.reason,
  };
  if (override.context) result.context = override.context;
  return result;
}
