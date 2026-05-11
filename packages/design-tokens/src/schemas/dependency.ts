import { z } from 'zod';

export const TokenDependencySchema = z
  .object({
    source: z
      .string()
      .describe(
        'Token id this dependency reads from. Must resolve within the loaded token set after install-time validation.',
      ),
    plugin: z
      .string()
      .describe(
        'Plugin id that derives the dependent value. The plugin must be registered before the cascade engine runs.',
      ),
    args: z
      .record(z.string(), z.unknown())
      .default({})
      .describe(
        "Arguments passed to the plugin alongside the source value. Validated by the plugin's own input schema at derive time, not at storage time.",
      ),
  })
  .describe(
    'A direct edge in the dependency graph. One hop only — transitive resolution is a separate loader operation, never baked into the document.',
  );

export type TokenDependency = z.infer<typeof TokenDependencySchema>;
