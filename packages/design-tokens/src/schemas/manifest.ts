import { z } from 'zod';
import { UserOverrideSchema } from './override.js';
import { TokenSchema } from './token.js';

export const TokenSetManifestSchema = z
  .object({
    version: z
      .literal('2')
      .describe('Schema version. Bumps signal breaking changes to the on-disk shape.'),
    id: z
      .string()
      .describe('Identifier of this token set. Typically a SQID for archive-based distribution.'),
    name: z.string().describe('Human-readable name.'),
    tokens: z
      .array(TokenSchema)
      .describe(
        'Every token in this set. dependsOn references must resolve within this array or within sets listed in depends[].',
      ),
    depends: z
      .array(z.string())
      .default([])
      .describe(
        'Other token set ids this set depends on. Loaded together at install; cycles between sets fail at install-time validation.',
      ),
    plugins: z
      .array(z.string())
      .default([])
      .describe(
        "Plugin ids this set requires. Every plugin id referenced from any token's dependsOn must appear here. Validated at install time.",
      ),
    overrides: z
      .array(UserOverrideSchema)
      .default([])
      .describe(
        'User overrides applied on top of cascade output. Persisted alongside tokens so a set restores its full state on reload.',
      ),
  })
  .describe(
    'The on-disk shape of a token set. Persisted as .rafters.json. Validated end-to-end at install time before runtime ever touches it.',
  );

export type TokenSetManifest = z.infer<typeof TokenSetManifestSchema>;
