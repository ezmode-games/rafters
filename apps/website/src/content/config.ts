import { defineCollection, z } from 'astro:content';

const foundationCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().optional(),
    draft: z.boolean().optional(),
  }),
});

const componentCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    cognitiveLoad: z.number().min(0).max(10),
    trustLevel: z.enum(['low', 'medium', 'high', 'critical']).optional(),
    attentionEconomics: z.string().optional(),
    order: z.number().optional(),
    draft: z.boolean().optional(),
  }),
});

const tokensCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['color', 'spacing', 'typography', 'elevation', 'motion', 'breakpoints']),
    order: z.number().optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = {
  foundation: foundationCollection,
  components: componentCollection,
  tokens: tokensCollection,
};
