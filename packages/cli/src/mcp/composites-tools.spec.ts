/**
 * MCP Composites Tools - Specification
 *
 * Two tools:
 * 1. rafters_composite - query composites
 * 2. rafters_rule - query or create rules
 */

import { z } from 'zod';

// ============================================================================
// rafters_composite
// ============================================================================

export const CompositeQuerySchema = z.object({
  id: z.string().optional(),
  query: z.string().optional(),
  category: z.string().optional(),
});

export const CompositeResponseSchema = z.object({
  composites: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      category: z.string(),
      description: z.string(),
      cognitiveLoad: z.number(),
      solves: z.string().optional(),
      appliesWhen: z.array(z.string()).optional(),
      usagePatterns: z
        .object({
          do: z.array(z.string()),
          never: z.array(z.string()),
        })
        .optional(),
      input: z.array(z.string()),
      output: z.array(z.string()),
      blockCount: z.number(),
    }),
  ),
});

// ============================================================================
// rafters_rule
// ============================================================================

export const RuleQuerySchema = z.object({
  name: z.string().optional(),
  query: z.string().optional(),
  // Create mode: provide these to create a new rule
  create: z
    .object({
      name: z.string().regex(/^[a-z0-9-]+$/),
      description: z.string(),
      zodSchema: z.string(),
    })
    .optional(),
});

export const RuleResponseSchema = z.object({
  rules: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      source: z.enum(['registry', 'local']),
    }),
  ),
  created: z
    .object({
      name: z.string(),
      path: z.string(),
    })
    .optional(),
});
