import type { PluginManifest } from '../schemas/plugin.js';
import type { Plugin } from './plugin.js';

/** Registry of derivation plugins. Populated at app bootstrap; cascade looks plugins up by id. */
export class PluginRegistry {
  private readonly plugins = new Map<string, Plugin>();

  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.id)) {
      const error = new Error(`PluginRegistry: duplicate plugin id "${plugin.id}"`);
      (error as Error & { cause?: unknown }).cause = { code: 'duplicate-plugin', id: plugin.id };
      throw error;
    }
    this.plugins.set(plugin.id, plugin);
  }

  has(id: string): boolean {
    return this.plugins.has(id);
  }

  get(id: string): Plugin | undefined {
    return this.plugins.get(id);
  }

  ids(): readonly string[] {
    return [...this.plugins.keys()];
  }

  /** Serializable projection of every registered plugin. inputSchema/outputSchema are placeholders; full JSON-Schema generation lands when a consumer needs it. */
  manifests(): readonly PluginManifest[] {
    return this.ids().map((id) => {
      const p = this.plugins.get(id);
      if (!p) throw new Error('unreachable');
      return {
        id: p.id,
        kind: 'derive',
        version: p.version,
        description: p.description,
        inputSchema: {},
        outputSchema: {},
      };
    });
  }
}
