import { z } from 'zod';
import { TokenIdSchema } from './token.js';
import { TokenValueSchema } from './value.js';

export const UserOverrideSchema = z
  .object({
    tokenId: TokenIdSchema,
    value: TokenValueSchema.describe(
      'The overriding value. Applied on top of cascade output; downstream dependents recompute against this.',
    ),
    author: z
      .string()
      .describe(
        'Identifier of who applied the override (user email, agent name, system id). Required so override provenance survives serialization.',
      ),
    timestamp: z
      .string()
      .datetime()
      .describe(
        'ISO-8601 timestamp of when the override was applied. Drives last-write-wins when overrides conflict.',
      ),
    reason: z
      .string()
      .optional()
      .describe(
        'Optional human-readable reason. Surfaces in MCP intelligence so AI agents see "why this token is human-pinned".',
      ),
  })
  .describe(
    'A user (or agent) override applied on top of cascade output. Persisted separately from tokens so removal restores cascade-derived values.',
  );

export type UserOverride = z.infer<typeof UserOverrideSchema>;
