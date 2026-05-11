import { z } from 'zod';
import { TokenDependencySchema } from './dependency.js';
import { NamespaceSchema } from './namespace.js';
import { TokenValueSchema } from './value.js';

export const TokenIdSchema = z
  .string()
  .regex(
    /^[a-z][a-z0-9-]*(\.[a-z0-9-]+)+$/,
    'Token ids are dot-segmented, lowercase, kebab-case within segments, and start with their namespace. Example: color.primary.500',
  )
  .describe(
    'Fully-qualified token id. First segment must be a Namespace literal; subsequent segments scope it (family, scale position, role).',
  );

export const TokenSourceSchema = z
  .enum(['default', 'generator', 'user', 'plugin', 'import'])
  .describe(
    'Provenance: who placed this token in the registry. Drives override-priority decisions.',
  );

export const TokenSchema = z
  .object({
    id: TokenIdSchema,
    namespace: NamespaceSchema.describe(
      'Must match the first segment of id. Enforced at install-time validation.',
    ),
    value: TokenValueSchema.describe(
      'The resolved value of this token. For root tokens this is authored directly; for derived tokens this is the cascade output. Always present.',
    ),
    dependsOn: z
      .array(TokenDependencySchema)
      .default([])
      .describe(
        'Direct upstream edges. The cascade engine reads these to recompute value when sources change. Empty for root tokens.',
      ),
    metadata: z
      .record(z.string(), z.unknown())
      .default({})
      .describe(
        'Free-form annotations: description, deprecated flags, version pins, designer notes. Consumers may persist their own keys without schema changes.',
      ),
    source: TokenSourceSchema,
  })
  .describe(
    'A single design token. Persisted shape on disk; runtime registry holds the same shape plus traversal indexes.',
  );

export type TokenId = z.infer<typeof TokenIdSchema>;
export type TokenSource = z.infer<typeof TokenSourceSchema>;
export type Token = z.infer<typeof TokenSchema>;
