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
// Color Vision Types for accessibility
export const ColorVisionTypeSchema = z.enum([
    'normal',
    'deuteranopia', // Red-green (most common)
    'protanopia', // Red-green
    'tritanopia', // Blue-yellow (rare)
]);
// Accessibility Contrast Levels
export const ContrastLevelSchema = z.enum(['AA', 'AAA']);
// Component Intelligence for AI consumption
export const ComponentIntelligenceSchema = z.object({
    cognitiveLoad: z.number().min(1).max(5), // 1=simple, 5=complex
    attentionHierarchy: z.string(), // How this component fits in attention economy
    safetyConstraints: z.string().optional(), // Safety patterns required (e.g., confirmation)
    accessibilityRules: z.string(), // WCAG compliance requirements
    usageContext: z.string(), // When/where to use this component
    decisionConstraints: z.string().optional(), // AI decision-making constraints
});
// Design Token for AI systems
export const SemanticTokenSchema = z.object({
    name: z.string(),
    value: z.string(), // CSS value (OKLCH, px, rem, etc.)
    type: z.enum(['color', 'spacing', 'typography', 'shadow', 'border']),
    semantic: z.string(), // Semantic meaning for AI understanding
    aiIntelligence: z.string().optional(), // AI-specific usage guidance
});
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
// Component Registry Entry (extends shadcn spec)
export const ComponentRegistrySchema = z.object({
    name: z.string(),
    type: z.literal('registry:component'),
    files: z.array(z.string()),
    meta: z.object({
        rafters: z.object({
            aiIntelligence: ComponentIntelligenceSchema,
        }),
    }),
});
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
// Component Manifest for Registry API
export const ComponentManifestSchema = z.object({
    $schema: z.string().optional(),
    name: z.string(),
    version: z.string(),
    description: z.string(),
    type: z.literal('registry:component'),
    category: z.string(),
    dependencies: z.array(z.string()),
    intelligence: z.object({
        cognitiveLoad: z.number().min(1).max(10),
        attentionEconomics: z.string(),
        accessibility: z.string(),
        trustBuilding: z.string(),
        semanticMeaning: z.string(),
    }),
    files: z.array(z.object({
        name: z.string(),
        type: z.string(),
        content: z.string(),
    })),
    lastUpdated: z.string(),
});
