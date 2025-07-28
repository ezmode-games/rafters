import { z } from 'zod';

/**
 * AI Intelligence Types
 * These types define the structure for AI-readable design intelligence
 */

// OKLCH Color representation
export const OKLCHSchema = z.object({
  l: z.number().min(0).max(1), // Lightness (0-1)
  c: z.number().min(0), // Chroma (0+)
  h: z.number().min(0).max(360), // Hue (0-360)
  alpha: z.number().min(0).max(1).optional(), // Alpha (0-1)
});

export type OKLCH = z.infer<typeof OKLCHSchema>;

// Color Vision Types for accessibility
export const ColorVisionTypeSchema = z.enum([
  'normal',
  'deuteranopia', // Red-green (most common)
  'protanopia', // Red-green
  'tritanopia', // Blue-yellow (rare)
]);

export type ColorVisionType = z.infer<typeof ColorVisionTypeSchema>;

// Accessibility Contrast Levels
export const ContrastLevelSchema = z.enum(['AA', 'AAA']);

export type ContrastLevel = z.infer<typeof ContrastLevelSchema>;

// Component Intelligence for AI consumption
export const ComponentIntelligenceSchema = z.object({
  cognitiveLoad: z.number().min(1).max(5), // 1=simple, 5=complex
  attentionHierarchy: z.string(), // How this component fits in attention economy
  safetyConstraints: z.string().optional(), // Safety patterns required (e.g., confirmation)
  accessibilityRules: z.string(), // WCAG compliance requirements
  usageContext: z.string(), // When/where to use this component
  decisionConstraints: z.string().optional(), // AI decision-making constraints
});

export type ComponentIntelligence = z.infer<typeof ComponentIntelligenceSchema>;

// Design Token for AI systems
export const SemanticTokenSchema = z.object({
  name: z.string(),
  value: z.string(), // CSS value (OKLCH, px, rem, etc.)
  type: z.enum(['color', 'spacing', 'typography', 'shadow', 'border']),
  semantic: z.string(), // Semantic meaning for AI understanding
  aiIntelligence: z.string().optional(), // AI-specific usage guidance
});

export type SemanticToken = z.infer<typeof SemanticTokenSchema>;

// Design System Configuration
export const DesignSystemSchema = z.object({
  id: z.string(),
  name: z.string(),
  primaryColor: OKLCHSchema,
  tokens: z.array(SemanticTokenSchema),
  typography: z.object({
    heading: z.string(), // Font family
    body: z.string(), // Font family
    mono: z.string(), // Font family
    scale: z.record(z.number()), // Typography scale
  }),
  intelligence: z.object({
    colorVisionTested: z.array(ColorVisionTypeSchema),
    contrastLevel: ContrastLevelSchema,
    components: z.record(ComponentIntelligenceSchema),
  }),
  metadata: z.object({
    created: z.string(),
    updated: z.string(),
    version: z.string(),
  }),
});

export type DesignSystem = z.infer<typeof DesignSystemSchema>;

// Component Registry Entry (matches shadcn spec with rafters intelligence)
export const ComponentRegistrySchema = z.object({
  name: z.string(),
  type: z.enum([
    'registry:component',
    'registry:lib',
    'registry:style',
    'registry:block',
    'registry:page',
    'registry:hook',
  ]),
  files: z.array(z.string()),
  meta: z.object({
    rafters: z.object({
      intelligence: z.object({
        cognitiveLoad: z.number().min(1).max(10),
        attentionEconomics: z.string(),
        accessibility: z.string(),
        trustBuilding: z.string(),
        semanticMeaning: z.string(),
      }),
    }),
  }),
});

export type ComponentRegistry = z.infer<typeof ComponentRegistrySchema>;

// Public Design System for free tier
export const PublicDesignSystemSchema = z.object({
  id: z.string(),
  name: z.string(),
  author: z.string().optional(),
  primaryColor: z.string(), // Hex representation for public display
  popularity: z.number().default(0),
  downloads: z.number().default(0),
  tags: z.array(z.string()).default([]),
  preview: z.string().optional(), // Preview image URL
  created: z.string(),
});

export type PublicDesignSystem = z.infer<typeof PublicDesignSystemSchema>;

// Shadcn-compatible Component Manifest for Registry API
export const ComponentManifestSchema = z.object({
  $schema: z.string().optional(),
  name: z.string(),
  type: z.enum([
    'registry:component',
    'registry:lib',
    'registry:style',
    'registry:block',
    'registry:page',
    'registry:hook',
  ]),
  description: z.string().optional(),
  title: z.string().optional(),
  author: z.string().optional(),
  dependencies: z.array(z.string()).optional().default([]),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(
    z.object({
      path: z.string(),
      content: z.string(),
      type: z.string(),
      target: z.string().optional(),
    })
  ),
  tailwind: z.record(z.unknown()).optional(),
  cssVars: z.record(z.unknown()).optional(),
  css: z.array(z.string()).optional(),
  envVars: z.record(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  docs: z.string().optional(),
  // Our AI intelligence metadata in the meta field
  meta: z
    .object({
      rafters: z
        .object({
          intelligence: z.object({
            cognitiveLoad: z.number().min(1).max(10),
            attentionEconomics: z.string(),
            accessibility: z.string(),
            trustBuilding: z.string(),
            semanticMeaning: z.string(),
          }),
          version: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export type ComponentManifest = z.infer<typeof ComponentManifestSchema>;

// Registry response schema - matches shadcn format
export const RegistryResponseSchema = z.object({
  $schema: z.string().optional(),
  name: z.string().optional(),
  homepage: z.string().optional(),
  components: z.array(ComponentManifestSchema).optional(),
  items: z.array(ComponentManifestSchema).optional(),
});

export type RegistryResponse = z.infer<typeof RegistryResponseSchema>;
