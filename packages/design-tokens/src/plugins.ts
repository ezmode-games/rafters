import type { Token } from '@rafters/shared';
import type { z } from 'zod';

/**
 * Context handed to a plugin's derive(). Deterministic only — no registry handle.
 * Plugins must never reach back into the registry; the cascade walker passes them
 * pre-resolved source values via the value-getter callback.
 */
export interface PluginContext {
  readonly dependentName: string;
}

/**
 * A derivation plugin. Pure: same (source, args, ctx) → same output.
 *
 * `rule` is the opaque tag the graph stores on edges (e.g. 'scale', 'state:hover',
 * 'calc'). The cascade dispatches each edge to the plugin whose `rule` matches the
 * edge's `generationRule`.
 *
 * argsSchema validates the dependency's `generationRule` parameters at derive time.
 * outputSchema validates the plugin honored its contract before the cascade writes
 * the result back.
 */
export interface Plugin<Args = unknown, Output extends Token['value'] = Token['value']> {
  readonly id: string;
  readonly rule: string;
  readonly argsSchema: z.ZodType<Args>;
  readonly outputSchema: z.ZodType<Output>;
  derive(source: Token['value'], args: Args, ctx: PluginContext): Output;
}

export type CascadeFailureCode =
  | 'unknown-plugin'
  | 'invalid-args'
  | 'derive-threw'
  | 'invalid-output'
  | 'missing-source';

export interface CascadeFailure {
  name: string;
  code: CascadeFailureCode;
  message: string;
  cause?: unknown;
}

export interface CascadeResult {
  recomputed: string[];
  changed: string[];
  failures: CascadeFailure[];
}

/**
 * Run one derivation through a plugin with boundary validation. Used by the graph's
 * cascade walker. Returns either a value to write or a structured failure; never
 * throws (failures are caught and reported so the cascade can continue past one
 * broken edge).
 */
export type RunPluginResult =
  | { ok: true; value: Token['value'] }
  | { ok: false; failure: CascadeFailure };

export function runPlugin(
  plugin: Plugin,
  source: Token['value'],
  rawArgs: unknown,
  dependentName: string,
): RunPluginResult {
  const parsedArgs = plugin.argsSchema.safeParse(rawArgs);
  if (!parsedArgs.success) {
    return {
      ok: false,
      failure: {
        name: dependentName,
        code: 'invalid-args',
        message: `Plugin "${plugin.id}" rejected args for ${dependentName}`,
        cause: parsedArgs.error.issues,
      },
    };
  }

  let raw: unknown;
  try {
    raw = plugin.derive(source, parsedArgs.data, { dependentName });
  } catch (cause) {
    return {
      ok: false,
      failure: {
        name: dependentName,
        code: 'derive-threw',
        message: `Plugin "${plugin.id}" threw while deriving ${dependentName}`,
        cause,
      },
    };
  }

  const parsedOutput = plugin.outputSchema.safeParse(raw);
  if (!parsedOutput.success) {
    return {
      ok: false,
      failure: {
        name: dependentName,
        code: 'invalid-output',
        message: `Plugin "${plugin.id}" returned a value that violates its outputSchema while deriving ${dependentName}`,
        cause: parsedOutput.error.issues,
      },
    };
  }

  return { ok: true, value: parsedOutput.data };
}

/**
 * Parse a generationRule tag into { rule, rawArgs }. Rules can be:
 *  - bare tag: `scale` → { rule: 'scale', rawArgs: undefined }
 *  - tag with simple arg: `scale:500` → { rule: 'scale', rawArgs: '500' }
 *  - tag with parens: `calc({base}*2)` → { rule: 'calc', rawArgs: '{base}*2' }
 *
 * The graph stores the full tag string opaquely; only the cascade walker peels off
 * the leading rule prefix so it can dispatch to the right plugin. Plugins receive
 * the raw arg string and parse it through their argsSchema.
 */
export function parseGenerationRule(tag: string): { rule: string; rawArgs: string | undefined } {
  const colonIdx = tag.indexOf(':');
  const parenIdx = tag.indexOf('(');
  if (colonIdx !== -1 && (parenIdx === -1 || colonIdx < parenIdx)) {
    return { rule: tag.slice(0, colonIdx), rawArgs: tag.slice(colonIdx + 1) };
  }
  if (parenIdx !== -1 && tag.endsWith(')')) {
    return { rule: tag.slice(0, parenIdx), rawArgs: tag.slice(parenIdx + 1, -1) };
  }
  return { rule: tag, rawArgs: undefined };
}
