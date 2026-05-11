import { z } from 'zod';
import { UserOverrideSchema } from './override.js';
import { TokenSchema } from './token.js';

export const RegistrySnapshotSchema = z
  .object({
    version: z.literal('2'),
    takenAt: z
      .string()
      .datetime()
      .describe('ISO-8601 timestamp of when this snapshot was serialized.'),
    tokens: z
      .array(TokenSchema)
      .describe(
        "Full token list, post-cascade. Every token's value reflects the resolved state at takenAt.",
      ),
    overrides: z
      .array(UserOverrideSchema)
      .describe(
        'Active overrides at snapshot time. Required so replay produces the same end state.',
      ),
    pluginIds: z
      .array(z.string())
      .describe(
        'Plugin ids registered when the snapshot was taken. A replay requires the same plugins to be available, or it fails fast.',
      ),
  })
  .describe(
    'A frozen serialization of the entire registry. Used for diffing, time-travel debugging, and the parity harness against v1.',
  );

export type RegistrySnapshot = z.infer<typeof RegistrySnapshotSchema>;
