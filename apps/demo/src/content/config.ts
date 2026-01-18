/**
 * Content Collections Configuration
 *
 * Defines the schema for docs - the conceptual layer above components.
 * Docs explain the what/where/why of Rafters as a Design Intelligence Protocol.
 */

import { defineCollection, z } from 'astro:content';

const docs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Order within section (lower = earlier)
    order: z.number().default(999),
    // Section grouping
    section: z.enum(['concepts', 'tokens', 'components', 'patterns', 'guides']).default('concepts'),
    // For AI extraction - what this page teaches
    teaches: z.array(z.string()).optional(),
    // Draft status
    draft: z.boolean().default(false),
  }),
});

export const collections = { docs };
