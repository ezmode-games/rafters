import { z } from 'zod';

export const PluginKindSchema = z
  .enum(['derive'])
  .describe(
    'Plugin kind. v2 ships "derive" only — pure functions producing a TokenValue from a source value plus args. Future kinds extend the protocol.',
  );

export const PluginManifestSchema = z
  .object({
    id: z
      .string()
      .regex(/^[a-z][a-z0-9-]*$/, 'Plugin ids are lowercase kebab-case, no dots.')
      .describe(
        'Plugin id. Referenced from TokenDependency.plugin. Must be unique across the registered plugin set.',
      ),
    kind: PluginKindSchema,
    version: z
      .string()
      .describe(
        'Semver string for the plugin. Surfaces in manifests so token sets can pin to a known plugin version.',
      ),
    inputSchema: z
      .unknown()
      .describe(
        'JSON Schema for plugin args. Plugin authors define a Zod schema; the manifest serializer converts it to JSON Schema for cross-process introspection. Runtime plugins keep the Zod source.',
      ),
    outputSchema: z
      .unknown()
      .describe('JSON Schema for the plugin output value (a subset of TokenValue).'),
    description: z
      .string()
      .describe(
        'Human-readable summary of what the plugin derives. Surfaces in tooling and MCP intelligence.',
      ),
  })
  .describe(
    'Serializable description of a plugin. The live Plugin object at runtime carries Zod schemas; the Manifest carries their JSON-Schema projections.',
  );

export type PluginKind = z.infer<typeof PluginKindSchema>;
export type PluginManifest = z.infer<typeof PluginManifestSchema>;
