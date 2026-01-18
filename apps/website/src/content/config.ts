import { defineCollection, z } from 'astro:content';

// Universal page collection for landing and other pages
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

// Build decisions collection for architectural decision records
const decisionsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    status: z.enum(['draft', 'in-progress', 'completed', 'deprecated', 'superseded']),
    impact: z.enum(['minor', 'major', 'critical']),
    category: z.enum([
      'architecture',
      'developer-experience',
      'ai-integration',
      'performance',
      'accessibility',
    ]),
    tags: z.array(z.string()),
    authors: z.array(z.string()),
    supersededBy: z.string().optional(),
    relatedDecisions: z.array(z.string()).optional(),
  }),
});

export const collections = {
  pages: pageCollection,
  decisions: decisionsCollection,
};
