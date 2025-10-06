/**
 * Type definitions and Zod schemas for Rafters primitive registry
 *
 * @registryType registry:types
 * @registryVersion 0.1.0
 */

import { z } from 'zod';

/**
 * Cognitive load rating scale (0-10)
 * Branded type to enforce valid range
 */
export const CognitiveLoadSchema = z.number().int().min(0).max(10).brand('CognitiveLoad');

export type CognitiveLoad = z.infer<typeof CognitiveLoadSchema>;

/**
 * WCAG conformance levels
 */
export const WCAGLevelSchema = z.enum(['A', 'AA', 'AAA']);
export type WCAGLevel = z.infer<typeof WCAGLevelSchema>;

/**
 * Primitive status in registry
 */
export const PrimitiveStatusSchema = z.enum(['draft', 'published', 'deprecated', 'experimental']);
export type PrimitiveStatus = z.infer<typeof PrimitiveStatusSchema>;

/**
 * Trust level categories
 */
export const TrustLevelSchema = z.enum(['low', 'medium', 'high', 'critical']);
export type TrustLevel = z.infer<typeof TrustLevelSchema>;

/**
 * Attention economics hierarchy
 */
export const AttentionHierarchySchema = z.enum(['primary', 'secondary', 'tertiary']);
export type AttentionHierarchy = z.infer<typeof AttentionHierarchySchema>;

/**
 * Framework variants for component sources
 */
export const FrameworkSchema = z.enum(['lit', 'react', 'vue', 'svelte', 'solid', 'angular']);
export type Framework = z.infer<typeof FrameworkSchema>;

/**
 * Contrast ratio requirements
 */
export const ContrastRequirementSchema = z.object({
  normalText: z.number().min(1).max(21),
  largeText: z.number().min(1).max(21),
});
export type ContrastRequirement = z.infer<typeof ContrastRequirementSchema>;

/**
 * Accessibility metadata
 */
export const AccessibilityMetadataSchema = z.object({
  wcagLevel: WCAGLevelSchema,
  ariaRole: z.string().min(1),
  keyboardNavigation: z.array(z.string()),
  minimumTouchTarget: z.number().int().min(24),
  contrastRequirement: ContrastRequirementSchema,
  screenReaderSupport: z.boolean(),
  focusManagement: z.string(),
  announcements: z.string().optional(),
});
export type AccessibilityMetadata = z.infer<typeof AccessibilityMetadataSchema>;

/**
 * Component source file
 */
export const ComponentSourceSchema = z.object({
  framework: FrameworkSchema,
  path: z.string().min(1),
  exports: z.array(z.string()),
});
export type ComponentSource = z.infer<typeof ComponentSourceSchema>;

/**
 * Design decision tradeoff
 */
export const TradeoffSchema = z.object({
  decision: z.string().min(1),
  reasoning: z.string().min(1),
  alternatives: z.array(z.string()).optional(),
});
export type Tradeoff = z.infer<typeof TradeoffSchema>;

/**
 * Design rationale and reasoning
 */
export const RationaleSchema = z.object({
  purpose: z.string().min(1),
  attentionEconomics: z.string().min(1),
  trustBuilding: z.string().optional(),
  cognitiveLoadReasoning: z.string().min(1),
  designPrinciples: z.array(z.string()),
  tradeoffs: z.array(TradeoffSchema),
});
export type Rationale = z.infer<typeof RationaleSchema>;

/**
 * Usage context and guidelines
 */
export const UsageContextSchema = z.object({
  dos: z.array(z.string()),
  donts: z.array(z.string()),
  examples: z.array(z.string()),
  commonMistakes: z.array(z.string()).optional(),
});
export type UsageContext = z.infer<typeof UsageContextSchema>;

/**
 * NPM dependency specification
 */
export const NpmDependencySchema = z.object({
  name: z.string().min(1),
  version: z.string().min(1),
  optional: z.boolean().default(false),
});
export type NpmDependency = z.infer<typeof NpmDependencySchema>;

/**
 * Component category
 */
export const ComponentCategorySchema = z.enum([
  'form',
  'navigation',
  'feedback',
  'layout',
  'data-display',
  'overlay',
  'media',
  'typography',
]);
export type ComponentCategory = z.infer<typeof ComponentCategorySchema>;

/**
 * Complete primitive registry entry
 */
export const PrimitiveRegistryEntrySchema = z.object({
  name: z.string().regex(/^r-[a-z-]+$/),
  displayName: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  status: PrimitiveStatusSchema,

  sources: z.array(ComponentSourceSchema).min(1),

  cognitiveLoad: CognitiveLoadSchema,
  accessibility: AccessibilityMetadataSchema,
  usageContext: UsageContextSchema,
  rationale: RationaleSchema,

  dependencies: z.array(z.string()),
  npmDependencies: z.array(NpmDependencySchema),

  category: ComponentCategorySchema,
  tags: z.array(z.string()),
  description: z.string().min(1),
  docsUrl: z.string().url().optional(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type PrimitiveRegistryEntry = z.infer<typeof PrimitiveRegistryEntrySchema>;

/**
 * Registry metadata
 */
export const RegistryMetadataSchema = z.object({
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  totalPrimitives: z.number().int().min(0),
  lastUpdated: z.string().datetime(),
  wcagCompliance: WCAGLevelSchema,
});
export type RegistryMetadata = z.infer<typeof RegistryMetadataSchema>;

/**
 * Complete primitive registry
 */
export const PrimitiveRegistrySchema = z.object({
  metadata: RegistryMetadataSchema,
  primitives: z.array(PrimitiveRegistryEntrySchema),
});
export type PrimitiveRegistry = z.infer<typeof PrimitiveRegistrySchema>;

/**
 * Registry query filters
 */
export const RegistryQuerySchema = z.object({
  name: z.string().optional(),
  category: ComponentCategorySchema.optional(),
  status: PrimitiveStatusSchema.optional(),
  maxCognitiveLoad: CognitiveLoadSchema.optional(),
  wcagLevel: WCAGLevelSchema.optional(),
  tags: z.array(z.string()).optional(),
  framework: FrameworkSchema.optional(),
});
export type RegistryQuery = z.infer<typeof RegistryQuerySchema>;

/**
 * Dependency graph node
 */
export const DependencyNodeSchema = z.object({
  name: z.string(),
  dependencies: z.array(z.string()),
  dependents: z.array(z.string()),
  depth: z.number().int().min(0),
});
export type DependencyNode = z.infer<typeof DependencyNodeSchema>;

/**
 * Circular dependency error
 */
export const CircularDependencyErrorSchema = z.object({
  cycle: z.array(z.string()),
  message: z.string(),
});
export type CircularDependencyError = z.infer<typeof CircularDependencyErrorSchema>;

/**
 * Registry validation result
 */
export const ValidationResultSchema = z.object({
  valid: z.boolean(),
  errors: z.array(
    z.object({
      primitive: z.string(),
      field: z.string(),
      message: z.string(),
    })
  ),
  warnings: z.array(
    z.object({
      primitive: z.string(),
      field: z.string(),
      message: z.string(),
    })
  ),
});
export type ValidationResult = z.infer<typeof ValidationResultSchema>;

/**
 * Validate cognitive load value
 */
export function validateCognitiveLoad(value: number): value is CognitiveLoad {
  return CognitiveLoadSchema.safeParse(value).success;
}

/**
 * Validate WCAG AAA contrast ratios
 */
export function validateWCAGAAAContrast(contrast: ContrastRequirement): boolean {
  return contrast.normalText >= 7.0 && contrast.largeText >= 4.5;
}

/**
 * Validate WCAG AAA touch target size
 */
export function validateWCAGAAATouchTarget(size: number): boolean {
  return size >= 44;
}

/**
 * Validate registry entry structure
 */
export function validateRegistryEntry(entry: unknown): ValidationResult {
  const result = PrimitiveRegistryEntrySchema.safeParse(entry);

  if (result.success) {
    const warnings: ValidationResult['warnings'] = [];
    const errors: ValidationResult['errors'] = [];

    // Check WCAG AAA compliance
    if (result.data.accessibility.wcagLevel === 'AAA') {
      if (!validateWCAGAAAContrast(result.data.accessibility.contrastRequirement)) {
        errors.push({
          primitive: result.data.name,
          field: 'accessibility.contrastRequirement',
          message: 'WCAG AAA requires 7:1 for normal text and 4.5:1 for large text',
        });
      }

      if (!validateWCAGAAATouchTarget(result.data.accessibility.minimumTouchTarget)) {
        errors.push({
          primitive: result.data.name,
          field: 'accessibility.minimumTouchTarget',
          message: 'WCAG AAA requires minimum 44px touch targets',
        });
      }
    }

    // Check cognitive load reasoning
    if (result.data.rationale.cognitiveLoadReasoning.length < 20) {
      warnings.push({
        primitive: result.data.name,
        field: 'rationale.cognitiveLoadReasoning',
        message: 'Cognitive load reasoning should be more detailed',
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  return {
    valid: false,
    errors: result.error.issues.map((err) => ({
      primitive: 'unknown',
      field: String(err.path.join('.')),
      message: err.message,
    })),
    warnings: [],
  };
}
