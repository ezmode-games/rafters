import { z } from 'zod';

// Color Scale Schema - Tailwind-style 50-900 scale
export const ColorScaleSchema = z.object({
  50: z.string(),
  100: z.string(),
  200: z.string(),
  300: z.string(),
  400: z.string(),
  500: z.string(),
  600: z.string(),
  700: z.string(),
  800: z.string(),
  900: z.string(),
});

export type ColorScale = z.infer<typeof ColorScaleSchema>;

// Typography Scale Schema - φ-based progression
export const TypographyScaleSchema = z.object({
  heading: z.string().min(1, 'Heading font family required'),
  body: z.string().min(1, 'Body font family required'),
  mono: z.string().min(1, 'Mono font family required'),
  scale: z.object({
    display: z.number().positive(),
    h1: z.number().positive(),
    h2: z.number().positive(),
    h3: z.number().positive(),
    h4: z.number().positive(),
    body: z.number().positive(),
    small: z.number().positive(),
  }),
});

export type TypographyScale = z.infer<typeof TypographyScaleSchema>;

// Spacing Scale Schema - φ-based spacing system
export const SpacingScaleSchema = z.object({
  xs: z.string().regex(/^\d+(\.\d+)?(rem|px|em)$/, 'Must be valid CSS length'),
  sm: z.string().regex(/^\d+(\.\d+)?(rem|px|em)$/, 'Must be valid CSS length'),
  md: z.string().regex(/^\d+(\.\d+)?(rem|px|em)$/, 'Must be valid CSS length'),
  lg: z.string().regex(/^\d+(\.\d+)?(rem|px|em)$/, 'Must be valid CSS length'),
  xl: z.string().regex(/^\d+(\.\d+)?(rem|px|em)$/, 'Must be valid CSS length'),
  xxl: z.string().regex(/^\d+(\.\d+)?(rem|px|em)$/, 'Must be valid CSS length'),
});

export type SpacingScale = z.infer<typeof SpacingScaleSchema>;

// Depth Scale Schema - CSS shadow system
export const DepthScaleSchema = z.object({
  none: z.string(),
  sm: z.string(),
  md: z.string(),
  lg: z.string(),
  xl: z.string(),
  inner: z.string(),
});

export type DepthScale = z.infer<typeof DepthScaleSchema>;

// Palette Scale Schema - Color with name
export const PaletteScaleSchema = z.object({
  name: z.string().min(1, 'Color name required'),
  scale: ColorScaleSchema,
});

export type PaletteScale = z.infer<typeof PaletteScaleSchema>;

// Validation helpers
export const validateColorScale = (data: unknown): ColorScale => {
  return ColorScaleSchema.parse(data);
};

export const validateTypographyScale = (data: unknown): TypographyScale => {
  return TypographyScaleSchema.parse(data);
};

export const validateSpacingScale = (data: unknown): SpacingScale => {
  return SpacingScaleSchema.parse(data);
};

export const validateDepthScale = (data: unknown): DepthScale => {
  return DepthScaleSchema.parse(data);
};

export const validatePaletteScale = (data: unknown): PaletteScale => {
  return PaletteScaleSchema.parse(data);
};

// Safe parsing helpers (return undefined instead of throwing)
export const safeParseColorScale = (data: unknown) => {
  return ColorScaleSchema.safeParse(data);
};

export const safeParseTypographyScale = (data: unknown) => {
  return TypographyScaleSchema.safeParse(data);
};

export const safeParseSpacingScale = (data: unknown) => {
  return SpacingScaleSchema.safeParse(data);
};

export const safeParseDepthScale = (data: unknown) => {
  return DepthScaleSchema.safeParse(data);
};

export const safeParsePaletteScale = (data: unknown) => {
  return PaletteScaleSchema.safeParse(data);
};
