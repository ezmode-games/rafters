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

  constructor(initialTokens: readonly Token[] = [], plugins: readonly Plugin[] = []) {
    this.graph = new TokenGraph(plugins);
    for (const plugin of plugins) this.plugins.set(plugin.name, plugin);
    for (const token of initialTokens) {
      this.metadata.set(token.name, token);
      if (token.userOverride) {
        this.graph.set(token.name, token.value, {
          cascade: false,
          reason: token.userOverride.reason,
          ...(token.userOverride.context ? { context: token.userOverride.context } : {}),
        });
      } else {
        this.graph.set(token.name, token.value);
      }
    }
  }

  registerPlugin(plugin: Plugin): void {
    this.graph.registerPlugin(plugin);
    this.plugins.set(plugin.name, plugin);
  }

  set(name: string, value: TokenValue, options?: SetOptions): void {
    this.ensureMetadata(name);
    this.graph.set(name, value, options);
  }

  bind(name: string, pluginName: string, input: unknown): void {
    this.ensureMetadata(name);
    this.graph.bind(name, pluginName, input);
  }

  get(name: string): Token | undefined {
    const node = this.graph.node(name);
    if (!node) return undefined;
    return this.toToken(node);
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
      const token = this.toToken(node);
      if (filter?.namespace && token.namespace !== filter.namespace) continue;
      if (filter?.category && token.category !== filter.category) continue;
      out.push(token);
    }
    return out;
  }

  private ensureMetadata(name: string): void {
    if (this.metadata.has(name)) return;
    this.metadata.set(name, defaultTokenFor(name));
  }

  private toToken(node: Node): Token {
    const meta = this.metadata.get(node.name) ?? defaultTokenFor(node.name);
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

function defaultTokenFor(name: string): Token {
  const namespace = inferNamespace(name);
  return {
    name,
    namespace,
    category: namespace,
    value: '',
    userOverride: null,
    containerQueryAware: true,
  };
}

function inferNamespace(name: string): string {
  const dashIdx = name.indexOf('-');
  const dotIdx = name.indexOf('.');
  const candidates = [dashIdx, dotIdx].filter((i) => i >= 0);
  if (candidates.length === 0) return name;
  return name.slice(0, Math.min(...candidates));
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
