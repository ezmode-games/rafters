/**
 * Rule Engine to manage and execute token transformation rules.
 *
 * Supports dynamic loading of rule plugins from specified directories.
 */

import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import type { TokenRegistry } from './registry';

// Zod schemas for validation
export const RuleResultSchema = z.union([
  z.string(),
  z.object({
    family: z.string(),
    position: z.union([z.string(), z.number()]),
  }),
]);

// In Zod 4, we validate that the plugin is a function using typeof check
const validateRulePlugin = (plugin: unknown): plugin is RulePlugin => {
  return typeof plugin === 'function';
};

export const RuleContextSchema = z.object({
  registry: z.unknown(), // TokenRegistry (validated at runtime)
  plugins: z.map(z.string(), z.unknown()), // Functions validated at runtime
});

// Plugin function signature - simple and flexible
export type RulePlugin = (
  registry: TokenRegistry,
  tokenName: string,
  dependencies: string[]
) => z.infer<typeof RuleResultSchema>;

// Rule execution context
export type RuleContext = {
  registry: TokenRegistry;
  plugins: Map<string, RulePlugin>;
};

/**
 * Load plugins from directories
 */
export async function loadPlugins(raftersDir?: string): Promise<Map<string, RulePlugin>> {
  const plugins = new Map<string, RulePlugin>();

  // Load from .rafters/plugins if directory provided
  if (raftersDir) {
    await loadPluginsFromDir(join(raftersDir, 'plugins'), plugins);
  }

  // Load built-in plugins from this package
  await loadPluginsFromDir(join(__dirname, 'plugins'), plugins);

  return plugins;
}

/**
 * Load plugins from a specific directory
 */
async function loadPluginsFromDir(dir: string, plugins: Map<string, RulePlugin>): Promise<void> {
  try {
    const files = await fs.readdir(dir);

    for (const file of files) {
      if (file.endsWith('.js') || file.endsWith('.ts')) {
        const pluginPath = join(dir, file);
        const ruleName = file.replace(/\.(js|ts)$/, '');

        try {
          // Dynamic import of plugin
          const module = await import(pluginPath);

          // Support both default export and named export
          const plugin = module.default || module[ruleName] || module.execute;

          // Validate plugin is a function
          if (validateRulePlugin(plugin)) {
            plugins.set(ruleName, plugin);
          } else {
            console.warn(`Invalid plugin ${file}: not a function`);
          }
        } catch (error) {
          console.warn(`Failed to load plugin ${file}:`, error);
        }
      }
    }
  } catch (_error) {
    // Directory doesn't exist or can't be read - that's fine
  }
}

/**
 * Execute a rule using plugins or built-in rules
 */
export function executeRule(
  ruleType: string,
  tokenName: string,
  context: RuleContext
): z.infer<typeof RuleResultSchema> {
  // Try plugin first
  const plugin = context.plugins.get(ruleType);
  if (plugin) {
    const dependencies = context.registry.getDependencies(tokenName);
    const result = plugin(context.registry, tokenName, dependencies);
    return RuleResultSchema.parse(result);
  }

  // Fallback to built-in rules
  return executeBuiltinRule(ruleType, tokenName);
}

/**
 * Built-in rule execution (temporary - will be replaced with plugins)
 */
function executeBuiltinRule(ruleType: string, tokenName: string): z.infer<typeof RuleResultSchema> {
  switch (ruleType) {
    case 'scale':
      // TODO: Implement scale rule
      return `scale(${tokenName})`;
    case 'state':
      // TODO: Implement state rule
      return `state(${tokenName})`;
    case 'contrast':
      // TODO: Implement contrast rule
      return `contrast(${tokenName})`;
    default:
      throw new Error(`Unknown rule type: ${ruleType}`);
  }
}

/**
 * Create rule execution context
 */
export async function createRuleContext(
  registry: TokenRegistry,
  raftersDir?: string
): Promise<RuleContext> {
  const plugins = await loadPlugins(raftersDir);

  return {
    registry,
    plugins,
  };
}
