import type { TokenId } from '../schemas/token.js';
import type { TokenValue } from '../schemas/value.js';
import type { Plugin, PluginContext } from './plugin.js';

export interface DeriveSuccess {
  ok: true;
  value: TokenValue;
}

export interface DeriveFailure {
  ok: false;
  code: 'invalid-args' | 'invalid-output' | 'derive-threw';
  message: string;
  cause?: unknown;
}

export type DeriveResult = DeriveSuccess | DeriveFailure;

/**
 * Invoke a plugin with strict boundary validation.
 *
 * 1. Parse args with the plugin's argsSchema (catches bad dependency.args).
 * 2. Call plugin.derive — wrapped so a throw becomes a structured failure.
 * 3. Parse the output with the plugin's outputSchema (catches contract violations).
 *
 * Returns a discriminated result. Never throws; the cascade engine decides
 * what to do with failures (skip vs. abort the run).
 */
export function derive(
  plugin: Plugin,
  source: TokenValue,
  rawArgs: unknown,
  dependentId: TokenId,
): DeriveResult {
  const parsedArgs = plugin.argsSchema.safeParse(rawArgs);
  if (!parsedArgs.success) {
    return {
      ok: false,
      code: 'invalid-args',
      message: `Plugin "${plugin.id}" rejected args for ${dependentId}`,
      cause: parsedArgs.error.issues,
    };
  }

  const ctx: PluginContext = { dependentId };

  let raw: unknown;
  try {
    raw = plugin.derive(source, parsedArgs.data, ctx);
  } catch (cause) {
    return {
      ok: false,
      code: 'derive-threw',
      message: `Plugin "${plugin.id}" threw while deriving ${dependentId}`,
      cause,
    };
  }

  const parsedOutput = plugin.outputSchema.safeParse(raw);
  if (!parsedOutput.success) {
    return {
      ok: false,
      code: 'invalid-output',
      message: `Plugin "${plugin.id}" returned a value that violates its outputSchema while deriving ${dependentId}`,
      cause: parsedOutput.error.issues,
    };
  }

  return { ok: true, value: parsedOutput.data };
}
