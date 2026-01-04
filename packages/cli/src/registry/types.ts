/**
 * Registry Types
 *
 * Types for component and primitive registry items.
 * Compatible with shadcn-style registry format.
 */

import { z } from 'zod';

/**
 * File types in the registry
 */
export const RegistryFileTypeSchema = z.enum([
  'registry:component',
  'registry:ui',
  'registry:lib',
  'registry:primitive',
]);

export type RegistryFileType = z.infer<typeof RegistryFileTypeSchema>;

/**
 * A single file in a registry item
 */
export const RegistryFileSchema = z.object({
  path: z.string(),
  content: z.string(),
  type: RegistryFileTypeSchema,
});

export type RegistryFile = z.infer<typeof RegistryFileSchema>;

/**
 * Item type in registry
 */
export const RegistryItemTypeSchema = z.enum(['registry:ui', 'registry:primitive']);

export type RegistryItemType = z.infer<typeof RegistryItemTypeSchema>;

/**
 * A component or primitive in the registry
 */
export const RegistryItemSchema = z.object({
  name: z.string(),
  type: RegistryItemTypeSchema,
  description: z.string().optional(),
  dependencies: z.array(z.string()),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(RegistryFileSchema),
});

export type RegistryItem = z.infer<typeof RegistryItemSchema>;

/**
 * Registry index listing available components and primitives
 */
export const RegistryIndexSchema = z.object({
  name: z.string(),
  homepage: z.string(),
  components: z.array(z.string()),
  primitives: z.array(z.string()),
});

export type RegistryIndex = z.infer<typeof RegistryIndexSchema>;
