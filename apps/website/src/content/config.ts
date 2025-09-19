import { defineCollection, z } from 'astro:content';

// Unified docs collection for all documentation
const docsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Component-specific fields (optional for foundation docs)
    cognitiveLoad: z.number().min(0).max(10).optional(),
    trustLevel: z.enum(['low', 'medium', 'high', 'critical']).optional(),
    attentionEconomics: z.string().optional(),
    // Common fields
    order: z.number().optional(),
    draft: z.boolean().optional(),
  }),
});

// Universal page collection for landing, huh, and any other pages
const pageCollection = defineCollection({
  type: 'content',
  schema: z.object({
    pageLayout: z.enum(['marketing', 'docs', 'base']),
    title: z.string(),
    description: z.string(),
    headerTitle: z.string().optional(),
    headerTitleClasses: z.string().optional(),
    order: z.number().optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = {
  docs: docsCollection,
  pages: pageCollection,
};
