/**
 * @rafters/design-tokens
 *
 * Comprehensive design token system with AI intelligence metadata
 * Built from Sami (UX) and Sally (Accessibility) requirements
 */
import type { z } from 'zod';
export declare const generateShortCode: () => string;
/**
 * Core token schema with comprehensive AI intelligence metadata
 * This is the flat data structure we designed with Sami and Sally
 */
export declare const TokenSchema: z.ZodObject<
  {
    name: z.ZodString;
    value: z.ZodString;
    darkValue: z.ZodOptional<z.ZodString>;
    category: z.ZodString;
    namespace: z.ZodString;
    semanticMeaning: z.ZodOptional<z.ZodString>;
    usageContext: z.ZodOptional<z.ZodArray<z.ZodString>>;
    trustLevel: z.ZodOptional<
      z.ZodEnum<{
        low: 'low';
        medium: 'medium';
        high: 'high';
        critical: 'critical';
      }>
    >;
    cognitiveLoad: z.ZodOptional<z.ZodNumber>;
    accessibilityLevel: z.ZodOptional<
      z.ZodEnum<{
        AA: 'AA';
        AAA: 'AAA';
      }>
    >;
    consequence: z.ZodOptional<
      z.ZodEnum<{
        reversible: 'reversible';
        significant: 'significant';
        permanent: 'permanent';
        destructive: 'destructive';
      }>
    >;
    generatedFrom: z.ZodOptional<z.ZodString>;
    mathRelationship: z.ZodOptional<z.ZodString>;
    scalePosition: z.ZodOptional<z.ZodNumber>;
    containerQueryAware: z.ZodOptional<z.ZodBoolean>;
    pointerTypeAware: z.ZodOptional<z.ZodBoolean>;
    reducedMotionAware: z.ZodOptional<z.ZodBoolean>;
    viewportAware: z.ZodOptional<z.ZodBoolean>;
    applicableComponents: z.ZodOptional<z.ZodArray<z.ZodString>>;
    requiredForComponents: z.ZodOptional<z.ZodArray<z.ZodString>>;
    interactionType: z.ZodOptional<
      z.ZodEnum<{
        hover: 'hover';
        focus: 'focus';
        active: 'active';
        disabled: 'disabled';
        loading: 'loading';
      }>
    >;
    animationSafe: z.ZodOptional<z.ZodBoolean>;
    highContrastMode: z.ZodOptional<z.ZodString>;
    generateUtilityClass: z.ZodOptional<z.ZodBoolean>;
    tailwindOverride: z.ZodOptional<z.ZodBoolean>;
    customPropertyOnly: z.ZodOptional<z.ZodBoolean>;
    contrastRatio: z.ZodOptional<z.ZodNumber>;
    touchTargetSize: z.ZodOptional<z.ZodNumber>;
    motionDuration: z.ZodOptional<z.ZodNumber>;
    pairedWith: z.ZodOptional<z.ZodArray<z.ZodString>>;
    conflictsWith: z.ZodOptional<z.ZodArray<z.ZodString>>;
    description: z.ZodOptional<z.ZodString>;
    deprecated: z.ZodOptional<z.ZodBoolean>;
    version: z.ZodOptional<z.ZodString>;
    lastModified: z.ZodOptional<z.ZodString>;
  },
  z.core.$strip
>;
export type Token = z.infer<typeof TokenSchema>;
/**
 * Design system schema - simple collection of tokens with accessibility settings
 */
export declare const DesignSystemSchema: z.ZodObject<
  {
    id: z.ZodString;
    name: z.ZodString;
    tokens: z.ZodArray<
      z.ZodObject<
        {
          name: z.ZodString;
          value: z.ZodString;
          darkValue: z.ZodOptional<z.ZodString>;
          category: z.ZodString;
          namespace: z.ZodString;
          semanticMeaning: z.ZodOptional<z.ZodString>;
          usageContext: z.ZodOptional<z.ZodArray<z.ZodString>>;
          trustLevel: z.ZodOptional<
            z.ZodEnum<{
              low: 'low';
              medium: 'medium';
              high: 'high';
              critical: 'critical';
            }>
          >;
          cognitiveLoad: z.ZodOptional<z.ZodNumber>;
          accessibilityLevel: z.ZodOptional<
            z.ZodEnum<{
              AA: 'AA';
              AAA: 'AAA';
            }>
          >;
          consequence: z.ZodOptional<
            z.ZodEnum<{
              reversible: 'reversible';
              significant: 'significant';
              permanent: 'permanent';
              destructive: 'destructive';
            }>
          >;
          generatedFrom: z.ZodOptional<z.ZodString>;
          mathRelationship: z.ZodOptional<z.ZodString>;
          scalePosition: z.ZodOptional<z.ZodNumber>;
          containerQueryAware: z.ZodOptional<z.ZodBoolean>;
          pointerTypeAware: z.ZodOptional<z.ZodBoolean>;
          reducedMotionAware: z.ZodOptional<z.ZodBoolean>;
          viewportAware: z.ZodOptional<z.ZodBoolean>;
          applicableComponents: z.ZodOptional<z.ZodArray<z.ZodString>>;
          requiredForComponents: z.ZodOptional<z.ZodArray<z.ZodString>>;
          interactionType: z.ZodOptional<
            z.ZodEnum<{
              hover: 'hover';
              focus: 'focus';
              active: 'active';
              disabled: 'disabled';
              loading: 'loading';
            }>
          >;
          animationSafe: z.ZodOptional<z.ZodBoolean>;
          highContrastMode: z.ZodOptional<z.ZodString>;
          generateUtilityClass: z.ZodOptional<z.ZodBoolean>;
          tailwindOverride: z.ZodOptional<z.ZodBoolean>;
          customPropertyOnly: z.ZodOptional<z.ZodBoolean>;
          contrastRatio: z.ZodOptional<z.ZodNumber>;
          touchTargetSize: z.ZodOptional<z.ZodNumber>;
          motionDuration: z.ZodOptional<z.ZodNumber>;
          pairedWith: z.ZodOptional<z.ZodArray<z.ZodString>>;
          conflictsWith: z.ZodOptional<z.ZodArray<z.ZodString>>;
          description: z.ZodOptional<z.ZodString>;
          deprecated: z.ZodOptional<z.ZodBoolean>;
          version: z.ZodOptional<z.ZodString>;
          lastModified: z.ZodOptional<z.ZodString>;
        },
        z.core.$strip
      >
    >;
    accessibilityTarget: z.ZodDefault<
      z.ZodEnum<{
        AA: 'AA';
        AAA: 'AAA';
      }>
    >;
    section508Compliant: z.ZodDefault<z.ZodBoolean>;
    cognitiveLoadBudget: z.ZodDefault<z.ZodNumber>;
    primaryColorSpace: z.ZodDefault<
      z.ZodEnum<{
        sRGB: 'sRGB';
        P3: 'P3';
        oklch: 'oklch';
      }>
    >;
    generateDarkTheme: z.ZodDefault<z.ZodBoolean>;
    enforceContrast: z.ZodDefault<z.ZodBoolean>;
    enforceMotionSafety: z.ZodDefault<z.ZodBoolean>;
    spacingSystem: z.ZodDefault<
      z.ZodEnum<{
        custom: 'custom';
        linear: 'linear';
        golden: 'golden';
      }>
    >;
    spacingMultiplier: z.ZodDefault<z.ZodNumber>;
    spacingBaseUnit: z.ZodDefault<z.ZodNumber>;
  },
  z.core.$strip
>;
export type DesignSystem = z.infer<typeof DesignSystemSchema>;
/**
 * Generate spacing scale based on mathematical system with responsive variants
 */
export declare function generateSpacingScale(
  system: 'linear' | 'golden' | 'custom',
  baseUnit?: number,
  multiplier?: number,
  steps?: number,
  generateResponsive?: boolean
): Token[];
/**
 * Generate depth/shadow scale (z-index and box-shadow)
 */
export declare function generateDepthScale(
  system?: 'linear' | 'exponential',
  baseMultiplier?: number
): Token[];
/**
 * Generate height scale for component sizing with responsive variants
 */
export declare function generateHeightScale(
  system?: 'linear' | 'golden' | 'custom',
  baseUnit?: number, // rem
  multiplier?: number,
  generateResponsive?: boolean
): Token[];
/**
 * Generate typography scale using golden ratio or musical intervals with responsive variants
 */
export declare function generateTypographyScale(
  system?:
    | 'golden'
    | 'major-second'
    | 'minor-third'
    | 'major-third'
    | 'perfect-fourth'
    | 'perfect-fifth',
  baseSize?: number, // rem
  generateResponsive?: boolean
): Token[];
/**
 * Generate comprehensive color tokens with semantic meaning
 */
export declare function generateColorTokens(): Token[];
/**
 * Generate border radius tokens for component styling
 */
export declare function generateBorderRadiusTokens(): Token[];
/**
 * Generate motion and timing tokens for animations
 */
export declare function generateMotionTokens(): Token[];
/**
 * Generate opacity tokens for layering and states
 */
export declare function generateOpacityTokens(): Token[];
/**
 * Generate font family tokens
 */
export declare function generateFontFamilyTokens(): Token[];
/**
 * Generate font weight tokens
 */
export declare function generateFontWeightTokens(): Token[];
/**
 * Generate letter spacing tokens
 */
export declare function generateLetterSpacingTokens(): Token[];
/**
 * Generate breakpoint and container tokens
 */
export declare function generateBreakpointTokens(): Token[];
/**
 * Generate aspect ratio tokens
 */
export declare function generateAspectRatioTokens(): Token[];
/**
 * Generate grid layout tokens for CSS Grid systems
 */
export declare function generateGridTokens(): Token[];
/**
 * Generate transform tokens for animations and interactions
 */
export declare function generateTransformTokens(): Token[];
/**
 * Generate width tokens for component sizing
 */
export declare function generateWidthTokens(): Token[];
/**
 * Generate backdrop filter tokens (maps to TW backdrop-blur utilities)
 */
export declare function generateBackdropTokens(): Token[];
/**
 * Generate border width tokens (maps to TW border-{width} utilities)
 */
export declare function generateBorderWidthTokens(): Token[];
/**
 * Generate touch target and interaction tokens
 */
export declare function generateTouchTargetTokens(): Token[];
export declare const exportTokens: (
  designSystem: DesignSystem,
  format: 'tw' | 'css' | 'json'
) => string;
export type TokenSet = {
  id: string;
  name: string;
  tokens: Array<{
    name: string;
    value: string;
    category: string;
    namespace?: string;
    darkValue?: string;
  }>;
};
/**
 * Check Tailwind CSS version in project
 */
export declare const checkTailwindVersion: (cwd: string) => Promise<string>;
/**
 * Create default grayscale tokens for CLI compatibility
 */
export declare const createDefaultRegistry: () => TokenSet;
/**
 * Fetch tokens from Rafters Studio (stub implementation)
 */
export declare const fetchStudioTokens: (shortcode: string) => Promise<TokenSet>;
/**
 * Write token files to project (stub implementation)
 */
export declare const writeTokenFiles: (
  tokenSet: TokenSet,
  format: string,
  cwd: string
) => Promise<void>;
/**
 * Inject CSS import into project files (stub implementation)
 */
export declare const injectCSSImport: (format: string, cwd: string) => Promise<void>;
declare const _default: {
  checkTailwindVersion: (cwd: string) => Promise<string>;
  createDefaultRegistry: () => TokenSet;
  fetchStudioTokens: (shortcode: string) => Promise<TokenSet>;
  writeTokenFiles: (tokenSet: TokenSet, format: string, cwd: string) => Promise<void>;
  injectCSSImport: (format: string, cwd: string) => Promise<void>;
};
export default _default;
