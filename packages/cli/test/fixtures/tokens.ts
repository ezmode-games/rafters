/**
 * Token fixtures generated from Zod schemas using zocker
 */

import {
  ColorReferenceSchema,
  ColorValueSchema,
  NamespaceFileSchema,
  TokenSchema,
} from '@rafters/shared';
import { zocker } from 'zocker';

// Create base token generator with seed for reproducibility
const tokenGenerator = zocker(TokenSchema).setSeed(42);

// Generate a proper ColorReference from schema
const colorReferenceGenerator = zocker(ColorReferenceSchema).setSeed(42);

// Generate a proper ColorValue from schema (full color family)
const colorValueGenerator = zocker(ColorValueSchema).setSeed(42);

// Supply realistic values for color tokens using ColorReference
const colorTokenGenerator = tokenGenerator
  .supply(TokenSchema.shape.category, 'color')
  .supply(TokenSchema.shape.namespace, 'color');

const spacingTokenGenerator = tokenGenerator
  .supply(TokenSchema.shape.category, 'spacing')
  .supply(TokenSchema.shape.namespace, 'spacing')
  .supply(TokenSchema.shape.value, '0.25rem');

// Helper to create a ColorReference value
function createColorReference(family: string, position: string) {
  return colorReferenceGenerator
    .supply(ColorReferenceSchema.shape.family, family)
    .supply(ColorReferenceSchema.shape.position, position)
    .generate();
}

// Pre-generated fixtures for common test cases
export const fixtures = {
  colorToken: (overrides: Partial<ReturnType<typeof colorTokenGenerator.generate>> = {}) => ({
    ...colorTokenGenerator.generate(),
    ...overrides,
  }),

  spacingToken: (overrides: Partial<ReturnType<typeof spacingTokenGenerator.generate>> = {}) => ({
    ...spacingTokenGenerator.generate(),
    ...overrides,
  }),

  // Common named tokens using ColorReference schema
  primaryToken: () =>
    fixtures.colorToken({
      name: 'primary',
      value: createColorReference('ocean-blue', '500'),
      semanticMeaning: 'Primary brand color for main actions',
      usageContext: ['buttons', 'links'],
    }),

  secondaryToken: () =>
    fixtures.colorToken({
      name: 'secondary',
      value: createColorReference('slate-gray', '400'),
      semanticMeaning: 'Secondary color for supporting elements',
    }),

  destructiveToken: () =>
    fixtures.colorToken({
      name: 'destructive',
      value: createColorReference('crimson-red', '500'),
      semanticMeaning: 'Error and destructive actions',
    }),

  primaryHoverToken: () =>
    fixtures.colorToken({
      name: 'primary-hover',
      value: createColorReference('ocean-blue', '600'),
      semanticMeaning: 'Hover state for primary actions',
    }),

  spacing1Token: () =>
    fixtures.spacingToken({
      name: 'spacing-1',
      value: '0.25rem',
    }),

  // Spacing token with derivation rule
  spacingWithRuleToken: () =>
    fixtures.spacingToken({
      name: 'spacing-6',
      value: '1.5rem',
      generationRule: 'calc({spacing-base} * 6)',
      mathRelationship: '4 * 6',
      progressionSystem: 'minor-third' as const,
      scalePosition: 6,
      dependsOn: ['spacing-base'],
      semanticMeaning: 'Medium spacing for section separation',
      usageContext: ['section-padding', 'card-padding'],
    }),

  // Token with human override
  overriddenToken: () =>
    fixtures.spacingToken({
      name: 'spacing-custom',
      value: '2rem',
      computedValue: '1.75rem',
      generationRule: 'calc({spacing-base} * 7)',
      dependsOn: ['spacing-base'],
      semanticMeaning: 'Custom spacing for hero sections',
      userOverride: {
        previousValue: '1.75rem',
        reason: 'Design review requested larger spacing for hero',
      },
    }),

  // Generate a full ColorValue (for color family tokens)
  colorFamilyToken: (name: string, colorName: string) => {
    const colorValue = colorValueGenerator
      .supply(ColorValueSchema.shape.name, colorName)
      .generate();
    return fixtures.colorToken({
      name,
      value: colorValue,
    });
  },
};

// Namespace file generator
export function createNamespaceFile(
  namespace: string,
  tokens: ReturnType<typeof tokenGenerator.generate>[],
) {
  return zocker(NamespaceFileSchema)
    .setSeed(42)
    .supply(NamespaceFileSchema.shape.namespace, namespace)
    .supply(NamespaceFileSchema.shape.tokens, tokens)
    .supply(
      NamespaceFileSchema.shape.$schema,
      'https://rafters.studio/schemas/namespace-tokens.json',
    )
    .supply(NamespaceFileSchema.shape.version, '1.0.0')
    .generate();
}

// Serialize to JSON for file writing
export function serializeNamespaceFile(
  namespace: string,
  tokens: ReturnType<typeof tokenGenerator.generate>[],
): string {
  return JSON.stringify(createNamespaceFile(namespace, tokens), null, 2);
}
