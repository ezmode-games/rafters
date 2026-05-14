import type { Token, TokenSchema } from '@rafters/shared';
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
    for (const raw of initialTokens) {
      const normalized = normalizeIncomingToken(raw);
      if (!normalized) continue;
      this.metadata.set(normalized.name, normalized);
      if (normalized.userOverride) {
        this.graph.set(normalized.name, normalized.value, {
          cascade: false,
          reason: normalized.userOverride.reason,
          ...(normalized.userOverride.context ? { context: normalized.userOverride.context } : {}),
        });
      } else {
        this.graph.set(normalized.name, normalized.value);
      }
    }
  }

  registerPlugin(plugin: Plugin): void {
    this.graph.registerPlugin(plugin);
    this.plugins.set(plugin.name, plugin);
  }

  define(token: unknown): void {
    const normalized = normalizeIncomingToken(token);
    if (!normalized) {
      throw new Error(
        'define(token) requires an object with string name, namespace, category, and a defined value',
      );
    }
    this.metadata.set(normalized.name, normalized);
    if (normalized.userOverride) {
      this.graph.set(normalized.name, normalized.value, {
        cascade: false,
        reason: normalized.userOverride.reason,
        ...(normalized.userOverride.context ? { context: normalized.userOverride.context } : {}),
      });
    } else {
      this.graph.set(normalized.name, normalized.value);
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
    const projected: Token = {
      ...meta,
      name: node.name,
      value: node.value as TokenValue,
      userOverride: node.userOverride ? toUserOverrideField(node.userOverride, meta.value) : null,
    };
    if (node.binding) {
      const plugin = this.plugins.get(node.binding.plugin);
      const deps = plugin ? plugin.dependsOn(node.binding.input) : [];
      if (deps.length > 0) projected.dependsOn = [...deps];
      projected.generationRule = node.binding.plugin;
    } else {
      delete (projected as { dependsOn?: string[] }).dependsOn;
      delete (projected as { generationRule?: string }).generationRule;
    }
    return projected;
  }
}

export class UnknownTokenError extends Error {
  constructor(public readonly tokenName: string) {
    super(`Token not registered: ${tokenName}`);
    this.name = 'UnknownTokenError';
  }
}

function normalizeIncomingToken(raw: unknown): Token | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const obj = raw as Record<string, unknown>;
  if (typeof obj.name !== 'string') return undefined;
  if (typeof obj.namespace !== 'string') return undefined;
  if (typeof obj.category !== 'string') return undefined;
  if (obj.value === undefined) return undefined;
  const userOverride =
    obj.userOverride && typeof obj.userOverride === 'object'
      ? (obj.userOverride as Token['userOverride'])
      : null;
  return { ...obj, userOverride } as Token;
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
