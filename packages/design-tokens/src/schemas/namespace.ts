import { z } from 'zod';

export const NAMESPACES = [
  'color',
  'semantic',
  'spacing',
  'typography',
  'typography-composite',
  'radius',
  'shadow',
  'depth',
  'motion',
  'focus',
  'breakpoint',
  'elevation',
  'fill',
] as const;

export const NamespaceSchema = z
  .enum(NAMESPACES)
  .describe('Token namespace. Fixed set of 13 categories — every token belongs to exactly one.');

export type Namespace = z.infer<typeof NamespaceSchema>;
