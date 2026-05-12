import { toDTCG } from './exporters/dtcg.js';
import { exportTailwind } from './exporters/tailwind.js';
import { registryToTypeScript } from './exporters/typescript.js';
import { type BuildSystemResult, buildSystem } from './generators/index.js';
import type { BaseSystemConfig } from './generators/types.js';
import { TokenRegistry } from './registry.js';

export interface BuildColorSystemOptions {
  /** Base system configuration overrides. */
  config?: Partial<BaseSystemConfig>;
  /** Which exporters to run alongside the registry build. */
  exports?: {
    tailwind?: boolean | { includeImport?: boolean };
    typescript?: boolean | { includeJSDoc?: boolean };
    dtcg?: boolean;
  };
}

export interface BuildColorSystemResult {
  /** The generated token system (matches v1's GenerateAllResult shape). */
  system: BuildSystemResult;
  /** TokenRegistry populated with all tokens. */
  registry: TokenRegistry;
  /** Exported formats if requested. */
  exports: {
    tailwind?: string;
    typescript?: string;
    dtcg?: object;
  };
}

/**
 * Compatibility wrapper preserving v1's `buildColorSystem` surface for the cli init
 * + apps/api + apps/website consumers. Internally: run `buildSystem`, wrap tokens
 * in a `TokenRegistry`, optionally run the requested exporters, return the
 * `{ registry, exports }` shape v1 callers expect.
 */
export function buildColorSystem(options: BuildColorSystemOptions = {}): BuildColorSystemResult {
  const system = buildSystem(options.config);
  const registry = new TokenRegistry(system.allTokens);
  const exportsOut: BuildColorSystemResult['exports'] = {};
  if (options.exports?.tailwind) {
    const tw = options.exports.tailwind;
    const includeImport = typeof tw === 'object' ? (tw.includeImport ?? true) : true;
    exportsOut.tailwind = exportTailwind(registry, { includeImport });
  }
  if (options.exports?.typescript) exportsOut.typescript = registryToTypeScript(registry);
  if (options.exports?.dtcg) exportsOut.dtcg = toDTCG(system.allTokens);
  return { system, registry, exports: exportsOut };
}
