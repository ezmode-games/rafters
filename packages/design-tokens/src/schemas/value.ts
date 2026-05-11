import { z } from 'zod';

export const ColorValueSchema = z
  .object({
    kind: z.literal('color'),
    l: z.number().min(0).max(1).describe('OKLCH lightness, 0-1.'),
    c: z
      .number()
      .min(0)
      .describe('OKLCH chroma. 0 = grayscale; typical color range ends near 0.4.'),
    h: z.number().min(0).max(360).describe('OKLCH hue in degrees, 0-360.'),
    alpha: z
      .number()
      .min(0)
      .max(1)
      .optional()
      .describe('Optional alpha, 0-1. Omit for fully opaque.'),
  })
  .describe('A color value in OKLCH space. Conversion to CSS happens via @rafters/color-utils.');

export const NumberValueSchema = z
  .object({
    kind: z.literal('number'),
    value: z.number().describe('Numeric magnitude.'),
    unit: z
      .enum(['px', 'rem', 'em', 'ms', 's', '%', 'fr', 'unitless'])
      .describe('Unit of measure. "unitless" for raw scalars (line-height multipliers, etc).'),
  })
  .describe(
    'A numeric value paired with a unit. Used for spacing, radius, motion durations, breakpoints, etc.',
  );

export const StringValueSchema = z
  .object({
    kind: z.literal('string'),
    value: z.string().describe('Opaque string value.'),
  })
  .describe(
    'An opaque string (font-family stack, easing keyword, custom-property reference, etc).',
  );

export const ReferenceValueSchema = z
  .object({
    kind: z.literal('reference'),
    ref: z
      .string()
      .describe(
        'Fully-qualified token id this value aliases. The cascade resolves the target at read time.',
      ),
  })
  .describe(
    'An alias: this token IS another token. Use dependsOn (not a reference value) for derived tokens that transform their source.',
  );

const ScalarValueSchema = z.discriminatedUnion('kind', [
  ColorValueSchema,
  NumberValueSchema,
  StringValueSchema,
  ReferenceValueSchema,
]);

export const CompositeValueSchema = z
  .object({
    kind: z.literal('composite'),
    fields: z
      .record(z.string(), ScalarValueSchema)
      .describe(
        'Named sub-values keyed by field name. Composites do not nest — every field must be a scalar value.',
      ),
  })
  .describe(
    'A structured value composed of named scalar sub-values (typography composite, shadow composite, etc).',
  );

export const TokenValueSchema = z
  .discriminatedUnion('kind', [
    ColorValueSchema,
    NumberValueSchema,
    StringValueSchema,
    ReferenceValueSchema,
    CompositeValueSchema,
  ])
  .describe('The canonical resolved value of a token. Always reflects post-cascade end state.');

export type ColorValue = z.infer<typeof ColorValueSchema>;
export type NumberValue = z.infer<typeof NumberValueSchema>;
export type StringValue = z.infer<typeof StringValueSchema>;
export type ReferenceValue = z.infer<typeof ReferenceValueSchema>;
export type CompositeValue = z.infer<typeof CompositeValueSchema>;
export type TokenValue = z.infer<typeof TokenValueSchema>;
