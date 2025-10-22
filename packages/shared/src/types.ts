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

// Component Intelligence for AI consumption (original schema)
export const ComponentIntelligenceSchema = z.object({
  cognitiveLoad: z.number().min(1).max(5), // 1=simple, 5=complex
  attentionHierarchy: z.string(), // How this component fits in attention economy
  safetyConstraints: z.string().optional(), // Safety patterns required (e.g., confirmation)
  accessibilityRules: z.string(), // WCAG compliance requirements
  usageContext: z.string(), // When/where to use this component
  decisionConstraints: z.string().optional(), // AI decision-making constraints
});

export type ComponentIntelligence = z.infer<typeof ComponentIntelligenceSchema>;

// CVA (class-variance-authority) intelligence schemas
export const ClassMappingSchema = z.object({
  propName: z.string(),
  values: z.record(z.string(), z.array(z.string())),
});

export const CVAIntelligenceSchema = z
  .object({
    baseClasses: z.array(z.string()),
    propMappings: z.array(ClassMappingSchema),
    allClasses: z.array(z.string()),
    css: z.string().optional(), // Generated critical CSS for preview component
  })
  .optional();

export type ClassMapping = z.infer<typeof ClassMappingSchema>;
export type CVAIntelligence = z.infer<typeof CVAIntelligenceSchema>;

// CVA structure for preview rendering (without optional css field)
export const PreviewCVASchema = z.object({
  baseClasses: z.array(z.string()),
  propMappings: z.array(ClassMappingSchema),
  allClasses: z.array(z.string()),
});

export type PreviewCVA = z.infer<typeof PreviewCVASchema>;

// Rafters intelligence schemas for CLI compatibility
export const IntelligenceSchema = z.object({
  cognitiveLoad: z.number().min(0).max(10),
  attentionEconomics: z.string(),
  accessibility: z.string(),
  trustBuilding: z.string(),
  semanticMeaning: z.string(),
  cva: CVAIntelligenceSchema,
});

export const UsagePatternsSchema = z.object({
  dos: z.array(z.string()),
  nevers: z.array(z.string()),
});

export const DesignGuideSchema = z.object({
  name: z.string(),
  url: z.string(),
});

export const ExampleSchema = z.object({
  title: z.string().optional(),
  code: z.string(),
  description: z.string().optional(),
});

export type UsagePatterns = z.infer<typeof UsagePatternsSchema>;
export type DesignGuide = z.infer<typeof DesignGuideSchema>;
export type Example = z.infer<typeof ExampleSchema>;
export type Intelligence = z.infer<typeof IntelligenceSchema>;

// Color Intelligence Schema (from API)
export const ColorIntelligenceSchema = z.object({
  suggestedName: z.string(),
  reasoning: z.string(),
  emotionalImpact: z.string(),
  culturalContext: z.string(),
  accessibilityNotes: z.string(),
  usageGuidance: z.string(),
  metadata: z
    .object({
      predictionId: z.string(),
      confidence: z.number().min(0).max(1),
      uncertaintyBounds: z.object({
        lower: z.number().min(0).max(1),
        upper: z.number().min(0).max(1),
        confidenceInterval: z.number().min(0).max(1),
      }),
      qualityScore: z.number().min(0).max(1),
      method: z.enum(['bootstrap', 'quantile', 'ensemble', 'bayesian', 'conformal']),
    })
    .optional(),
});

export type ColorIntelligence = z.infer<typeof ColorIntelligenceSchema>;

// Color Harmonies Schema (calculated by color-utils)
export const ColorHarmoniesSchema = z.object({
  complementary: OKLCHSchema,
  triadic: z.array(OKLCHSchema),
  analogous: z.array(OKLCHSchema),
  tetradic: z.array(OKLCHSchema),
  monochromatic: z.array(OKLCHSchema),
});

export type ColorHarmonies = z.infer<typeof ColorHarmoniesSchema>;

// Color Accessibility Schema (calculated by color-utils)
export const ColorAccessibilitySchema = z.object({
  // Pre-computed contrast matrices (indices into scale array)
  wcagAA: z
    .object({
      normal: z.array(z.array(z.number())), // [[0, 5], [0, 6], ...] - pairs that meet AA
      large: z.array(z.array(z.number())), // [[0, 4], [0, 5], ...] - more pairs for large text
    })
    .optional(),
  wcagAAA: z
    .object({
      normal: z.array(z.array(z.number())), // [[0, 7], [0, 8], ...] - fewer pairs meet AAA
      large: z.array(z.array(z.number())), // [[0, 6], [0, 7], ...]
    })
    .optional(),

  // Basic compatibility data for the base color
  onWhite: z.object({
    wcagAA: z.boolean(),
    wcagAAA: z.boolean(),
    contrastRatio: z.number(),
    // Pre-computed indices for scale lookups
    aa: z.array(z.number()).optional(), // [5, 6, 7, 8, 9] - shades that pass AA on white
    aaa: z.array(z.number()).optional(), // [7, 8, 9] - shades that pass AAA on white
  }),
  onBlack: z.object({
    wcagAA: z.boolean(),
    wcagAAA: z.boolean(),
    contrastRatio: z.number(),
    // Pre-computed indices for scale lookups
    aa: z.array(z.number()).optional(), // [0, 1, 2, 3, 4] - shades that pass AA on black
    aaa: z.array(z.number()).optional(), // [0, 1, 2] - shades that pass AAA on black
  }),
});

export type ColorAccessibility = z.infer<typeof ColorAccessibilitySchema>;

// Color Analysis Schema (calculated by color-utils)
export const ColorAnalysisSchema = z.object({
  temperature: z.enum(['warm', 'cool', 'neutral']),
  isLight: z.boolean(),
  name: z.string(),
});

export type ColorAnalysis = z.infer<typeof ColorAnalysisSchema>;

// Atmospheric Weight Schema (atmospheric perspective color theory)
export const AtmosphericWeightSchema = z.object({
  distanceWeight: z.number().min(0).max(1), // 0 = background, 1 = foreground
  temperature: z.enum(['warm', 'neutral', 'cool']),
  atmosphericRole: z.enum(['background', 'midground', 'foreground']),
});

export type AtmosphericWeight = z.infer<typeof AtmosphericWeightSchema>;

// Perceptual Weight Schema (visual balance in UI layouts)
export const PerceptualWeightSchema = z.object({
  weight: z.number().min(0).max(1), // 0-1, higher = more visual weight
  density: z.enum(['light', 'medium', 'heavy']),
  balancingRecommendation: z.string(),
});

export type PerceptualWeight = z.infer<typeof PerceptualWeightSchema>;

// Semantic Color Suggestions Schema
export const SemanticColorSuggestionsSchema = z.object({
  danger: z.array(OKLCHSchema),
  success: z.array(OKLCHSchema),
  warning: z.array(OKLCHSchema),
  info: z.array(OKLCHSchema),
});

export type SemanticColorSuggestions = z.infer<typeof SemanticColorSuggestionsSchema>;

// Complete API Response Schema
export const ColorIntelligenceResponseSchema = z.object({
  intelligence: ColorIntelligenceSchema,
  harmonies: ColorHarmoniesSchema,
  accessibility: ColorAccessibilitySchema,
  analysis: ColorAnalysisSchema,
});

export type ColorIntelligenceResponse = z.infer<typeof ColorIntelligenceResponseSchema>;

// Seed Queue API Response Schemas
export const SeedQueueStatsSchema = z.object({
  strategicColors: z.number(),
  standardColors: z.number(),
  totalColors: z.number(),
  totalSent: z.number(),
});

export const SeedQueueSuccessResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  stats: SeedQueueStatsSchema,
  timestamp: z.string(),
});

export const SeedQueueErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  timestamp: z.string(),
});

export const SeedQueueInfoResponseSchema = z.object({
  endpoint: z.string(),
  method: z.string(),
  description: z.string(),
  expectedColors: z.object({
    strategic: z.string(),
    standard: z.string(),
    total: z.number(),
  }),
});

export type SeedQueueStats = z.infer<typeof SeedQueueStatsSchema>;
export type SeedQueueSuccessResponse = z.infer<typeof SeedQueueSuccessResponseSchema>;
export type SeedQueueErrorResponse = z.infer<typeof SeedQueueErrorResponseSchema>;
export type SeedQueueInfoResponse = z.infer<typeof SeedQueueInfoResponseSchema>;
export type SeedQueueResponse = SeedQueueSuccessResponse | SeedQueueErrorResponse;

// Color Value Schema for complex color structures
export const ColorValueSchema = z.object({
  name: z.string(), // the fancy name from color-utils, IE ocean-blue
  scale: z.array(OKLCHSchema), // OKLCH values array [50, 100, 200...900] positions - index maps to standard scale
  token: z.string().optional(), // the semantic assignment IE, primary
  value: z.string().optional(), // the string of the position in the scale IE 400
  use: z.string().optional(), // any reasons the human notes for the color choice and assignment
  states: z.record(z.string(), z.string()).optional(), // { hover: "blue-900", focus: "blue-700", ... }

  // Complete intelligence data (from /api/color-intel)
  intelligence: ColorIntelligenceSchema.optional(),
  harmonies: ColorHarmoniesSchema.optional(),
  accessibility: ColorAccessibilitySchema.optional(),
  analysis: ColorAnalysisSchema.optional(),

  // Advanced color theory intelligence (calculated by color-utils)
  atmosphericWeight: AtmosphericWeightSchema.optional(),
  perceptualWeight: PerceptualWeightSchema.optional(),
  semanticSuggestions: SemanticColorSuggestionsSchema.optional(),

  // Unique token ID for quick color lookups (e.g., "color-0.500-0.120-240.0")
  tokenId: z.string().optional(),
});

export type ColorValue = z.infer<typeof ColorValueSchema>;

// Color Reference Schema for semantic tokens that reference color families
export const ColorReferenceSchema = z.object({
  family: z.string(), // "flipped-out-gray", "ocean-blue", etc.
  position: z.string(), // "50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"
});

export type ColorReference = z.infer<typeof ColorReferenceSchema>;

// Progression System Types - exported for consistency across the codebase
export const PROGRESSION_SYSTEMS = [
  'linear',
  'golden',
  'major-third',
  'minor-third',
  'perfect-fourth',
  'perfect-fifth',
  'augmented-fourth',
  'major-second',
  'minor-second',
  'custom',
] as const;

export type ProgressionSystem = (typeof PROGRESSION_SYSTEMS)[number];

// Comprehensive Design Token Schema - Single Source of Truth
export const TokenSchema = z.object({
  // Core token data
  name: z.string(),
  value: z.union([z.string(), ColorValueSchema, ColorReferenceSchema]), // String, ColorValue for families, or ColorReference for semantic
  category: z.string(),
  namespace: z.string(),

  // Typography-specific properties
  lineHeight: z.string().optional(),

  // AI Intelligence (comprehensive)
  semanticMeaning: z.string().optional(),
  usageContext: z.array(z.string()).optional(),
  trustLevel: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  cognitiveLoad: z.number().min(1).max(10).optional(),
  accessibilityLevel: z.enum(['AA', 'AAA']).optional(),
  consequence: z.enum(['reversible', 'significant', 'permanent', 'destructive']).optional(),

  // Dependency tracking for automatic regeneration
  dependsOn: z.array(z.string()).optional(), // Parent token(s) - empty = root token
  generationRule: z.string().optional(), // How generated: "calc({base}*2)", "state:hover", etc
  progressionSystem: z.enum(PROGRESSION_SYSTEMS).optional(), // Mathematical system used
  scalePosition: z.number().optional(), // Position in color/spacing scale

  // Responsive behavior
  containerQueryAware: z.boolean().optional(),
  pointerTypeAware: z.boolean().optional(),
  reducedMotionAware: z.boolean().optional(),
  viewportAware: z.boolean().optional(), // Should generate responsive variants

  // Component associations
  applicableComponents: z.array(z.string()).optional(), // ["button", "input", "card"]
  requiredForComponents: z.array(z.string()).optional(), // Critical dependencies

  // Interaction patterns
  interactionType: z.enum(['hover', 'focus', 'active', 'disabled', 'loading']).optional(),
  animationSafe: z.boolean().optional(), // Safe for vestibular disorders
  highContrastMode: z.string().optional(), // Value for high contrast mode

  // Export behavior
  generateUtilityClass: z.boolean().optional(), // Should create @utility class
  tailwindOverride: z.boolean().optional(), // Overrides default TW value
  customPropertyOnly: z.boolean().optional(), // CSS var only, no utility

  // Validation hints (for human Studio validation)
  contrastRatio: z.number().optional(), // Pre-calculated contrast
  touchTargetSize: z.number().optional(), // Pre-calculated size in px
  motionDuration: z.number().optional(), // Duration in ms

  // Design system relationships
  pairedWith: z.array(z.string()).optional(), // Other tokens used together
  conflictsWith: z.array(z.string()).optional(), // Tokens that shouldn't be used together

  // Meta information
  description: z.string().optional(),
  deprecated: z.boolean().optional(),
  version: z.string().optional(),
  lastModified: z.string().optional(),
  generatedAt: z.string().optional(), // ISO timestamp when token was generated
  requiresConfirmation: z.boolean().optional(), // UI pattern requirement for destructive actions
});

export type Token = z.infer<typeof TokenSchema>;

// Legacy alias for backward compatibility
export const SemanticTokenSchema = TokenSchema;
export type SemanticToken = Token;

// Token Set Schema - Collection of tokens with metadata
export const TokenSetSchema = z.object({
  id: z.string(),
  name: z.string(),
  tokens: z.array(TokenSchema),
});

export type TokenSet = z.infer<typeof TokenSetSchema>;

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
    scale: z.record(z.string(), z.number()), // Typography scale
  }),
  intelligence: z.object({
    colorVisionTested: z.array(ColorVisionTypeSchema),
    contrastLevel: ContrastLevelSchema,
    components: z.record(z.string(), ComponentIntelligenceSchema),
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
    'registry:primitive',
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

// Component Preview Schema (pre-compiled framework variants)
export const PreviewSchema = z.object({
  framework: z.enum(['react', 'vue', 'svelte']),
  variant: z.string(),
  props: z.record(z.string(), z.unknown()),
  compiledJs: z.string(),
  sizeBytes: z.number(),
  cva: PreviewCVASchema,
  css: z.string(),
  dependencies: z.array(z.string()),
  error: z.string().optional(),
});

export type Preview = z.infer<typeof PreviewSchema>;

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
    'registry:primitive',
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
  tailwind: z.record(z.string(), z.unknown()).optional(),
  cssVars: z.record(z.string(), z.unknown()).optional(),
  css: z.array(z.string()).optional(),
  envVars: z.record(z.string(), z.string()).optional(),
  categories: z.array(z.string()).optional(),
  docs: z.string().optional(),
  // Our AI intelligence metadata in the meta field
  meta: z
    .object({
      rafters: z
        .object({
          version: z.string(),
          intelligence: IntelligenceSchema,
          usagePatterns: UsagePatternsSchema.optional(),
          designGuides: z.array(DesignGuideSchema).optional(),
          examples: z.array(ExampleSchema).optional(),
          previews: z.array(PreviewSchema).optional(),
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
