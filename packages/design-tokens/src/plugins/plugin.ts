import type { z } from 'zod';
import type { TokenId } from '../schemas/token.js';
import type { TokenValue } from '../schemas/value.js';

/**
 * Context handed to a plugin's derive(). Deterministic only — no registry handle.
 * Per #1242 invariant: plugins must never read the TokenRegistry.
 */
export interface PluginContext {
  /** Id of the token being computed. Plugins may use this to produce id-aware errors. */
  readonly dependentId: TokenId;
}

/**
 * A derivation plugin. Pure: same (source, args, ctx) → same output. No I/O, no globals.
 *
 * argsSchema validates TokenDependency.args at derive time. outputSchema validates the
 * plugin honored its contract before the cascade engine accepts the result.
 */
export interface Plugin<TArgs = unknown, TOutput extends TokenValue = TokenValue> {
  readonly id: string;
  readonly version: string;
  readonly description: string;
  readonly argsSchema: z.ZodType<TArgs>;
  readonly outputSchema: z.ZodType<TOutput>;
  derive(source: TokenValue, args: TArgs, ctx: PluginContext): TOutput;
}
