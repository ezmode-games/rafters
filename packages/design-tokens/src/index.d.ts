/**
 * @rafters/design-tokens
 *
 * Comprehensive design token system with AI intelligence metadata
 * Built from Sami (UX) and Sally (Accessibility) requirements
 */
import { type ColorValue, type TokenSet } from '@rafters/shared';
import { z } from 'zod';
export { exportColorScales, exportToCSSVariables, exportTokensFromRegistry, exportToTailwindCSS, } from './export';
export { exportToTailwindV4Complete } from './exporters/tailwind-v4';
export { TokenRegistry } from './registry';
import { TokenRegistry } from './registry';
export declare const generateShortCode: () => string;
export { Token, TokenSchema } from '@rafters/shared';
/**
 * Convert a token value (string or ColorValue object) to a CSS string
 * For ColorValue objects, extracts the appropriate CSS value from scale
 */
export declare function tokenValueToCss(value: string | ColorValue): string;
/**
 * Design system schema - simple collection of tokens with accessibility settings
 */
export declare const DesignSystemSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    tokens: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        value: z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
            name: z.ZodString;
            scale: z.ZodArray<z.ZodObject<{
                l: z.ZodNumber;
                c: z.ZodNumber;
                h: z.ZodNumber;
                alpha: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            token: z.ZodOptional<z.ZodString>;
            value: z.ZodOptional<z.ZodString>;
            use: z.ZodOptional<z.ZodString>;
            states: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            intelligence: z.ZodOptional<z.ZodObject<{
                suggestedName: z.ZodString;
                reasoning: z.ZodString;
                emotionalImpact: z.ZodString;
                culturalContext: z.ZodString;
                accessibilityNotes: z.ZodString;
                usageGuidance: z.ZodString;
            }, z.core.$strip>>;
            harmonies: z.ZodOptional<z.ZodObject<{
                complementary: z.ZodObject<{
                    l: z.ZodNumber;
                    c: z.ZodNumber;
                    h: z.ZodNumber;
                    alpha: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strip>;
                triadic: z.ZodArray<z.ZodObject<{
                    l: z.ZodNumber;
                    c: z.ZodNumber;
                    h: z.ZodNumber;
                    alpha: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strip>>;
                analogous: z.ZodArray<z.ZodObject<{
                    l: z.ZodNumber;
                    c: z.ZodNumber;
                    h: z.ZodNumber;
                    alpha: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strip>>;
                tetradic: z.ZodArray<z.ZodObject<{
                    l: z.ZodNumber;
                    c: z.ZodNumber;
                    h: z.ZodNumber;
                    alpha: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strip>>;
                monochromatic: z.ZodArray<z.ZodObject<{
                    l: z.ZodNumber;
                    c: z.ZodNumber;
                    h: z.ZodNumber;
                    alpha: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strip>>;
            }, z.core.$strip>>;
            accessibility: z.ZodOptional<z.ZodObject<{
                wcagAA: z.ZodOptional<z.ZodObject<{
                    normal: z.ZodArray<z.ZodArray<z.ZodNumber>>;
                    large: z.ZodArray<z.ZodArray<z.ZodNumber>>;
                }, z.core.$strip>>;
                wcagAAA: z.ZodOptional<z.ZodObject<{
                    normal: z.ZodArray<z.ZodArray<z.ZodNumber>>;
                    large: z.ZodArray<z.ZodArray<z.ZodNumber>>;
                }, z.core.$strip>>;
                onWhite: z.ZodObject<{
                    wcagAA: z.ZodBoolean;
                    wcagAAA: z.ZodBoolean;
                    contrastRatio: z.ZodNumber;
                    aa: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
                    aaa: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
                }, z.core.$strip>;
                onBlack: z.ZodObject<{
                    wcagAA: z.ZodBoolean;
                    wcagAAA: z.ZodBoolean;
                    contrastRatio: z.ZodNumber;
                    aa: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
                    aaa: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
                }, z.core.$strip>;
            }, z.core.$strip>>;
            analysis: z.ZodOptional<z.ZodObject<{
                temperature: z.ZodEnum<{
                    warm: "warm";
                    cool: "cool";
                    neutral: "neutral";
                }>;
                isLight: z.ZodBoolean;
                name: z.ZodString;
            }, z.core.$strip>>;
            atmosphericWeight: z.ZodOptional<z.ZodObject<{
                distanceWeight: z.ZodNumber;
                temperature: z.ZodEnum<{
                    warm: "warm";
                    cool: "cool";
                    neutral: "neutral";
                }>;
                atmosphericRole: z.ZodEnum<{
                    background: "background";
                    foreground: "foreground";
                    midground: "midground";
                }>;
            }, z.core.$strip>>;
            perceptualWeight: z.ZodOptional<z.ZodObject<{
                weight: z.ZodNumber;
                density: z.ZodEnum<{
                    light: "light";
                    medium: "medium";
                    heavy: "heavy";
                }>;
                balancingRecommendation: z.ZodString;
            }, z.core.$strip>>;
            semanticSuggestions: z.ZodOptional<z.ZodObject<{
                danger: z.ZodArray<z.ZodObject<{
                    l: z.ZodNumber;
                    c: z.ZodNumber;
                    h: z.ZodNumber;
                    alpha: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strip>>;
                success: z.ZodArray<z.ZodObject<{
                    l: z.ZodNumber;
                    c: z.ZodNumber;
                    h: z.ZodNumber;
                    alpha: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strip>>;
                warning: z.ZodArray<z.ZodObject<{
                    l: z.ZodNumber;
                    c: z.ZodNumber;
                    h: z.ZodNumber;
                    alpha: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strip>>;
                info: z.ZodArray<z.ZodObject<{
                    l: z.ZodNumber;
                    c: z.ZodNumber;
                    h: z.ZodNumber;
                    alpha: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strip>>;
            }, z.core.$strip>>;
            tokenId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>]>;
        category: z.ZodString;
        namespace: z.ZodString;
        lineHeight: z.ZodOptional<z.ZodString>;
        semanticMeaning: z.ZodOptional<z.ZodString>;
        usageContext: z.ZodOptional<z.ZodArray<z.ZodString>>;
        trustLevel: z.ZodOptional<z.ZodEnum<{
            medium: "medium";
            low: "low";
            high: "high";
            critical: "critical";
        }>>;
        cognitiveLoad: z.ZodOptional<z.ZodNumber>;
        accessibilityLevel: z.ZodOptional<z.ZodEnum<{
            AA: "AA";
            AAA: "AAA";
        }>>;
        consequence: z.ZodOptional<z.ZodEnum<{
            reversible: "reversible";
            significant: "significant";
            permanent: "permanent";
            destructive: "destructive";
        }>>;
        generatedFrom: z.ZodOptional<z.ZodString>;
        mathRelationship: z.ZodOptional<z.ZodString>;
        scalePosition: z.ZodOptional<z.ZodNumber>;
        containerQueryAware: z.ZodOptional<z.ZodBoolean>;
        pointerTypeAware: z.ZodOptional<z.ZodBoolean>;
        reducedMotionAware: z.ZodOptional<z.ZodBoolean>;
        viewportAware: z.ZodOptional<z.ZodBoolean>;
        applicableComponents: z.ZodOptional<z.ZodArray<z.ZodString>>;
        requiredForComponents: z.ZodOptional<z.ZodArray<z.ZodString>>;
        interactionType: z.ZodOptional<z.ZodEnum<{
            hover: "hover";
            focus: "focus";
            active: "active";
            disabled: "disabled";
            loading: "loading";
        }>>;
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
        generatedAt: z.ZodOptional<z.ZodString>;
        requiresConfirmation: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    accessibilityTarget: z.ZodDefault<z.ZodEnum<{
        AA: "AA";
        AAA: "AAA";
    }>>;
    section508Compliant: z.ZodDefault<z.ZodBoolean>;
    cognitiveLoadBudget: z.ZodDefault<z.ZodNumber>;
    primaryColorSpace: z.ZodDefault<z.ZodEnum<{
        sRGB: "sRGB";
        oklch: "oklch";
        P3: "P3";
    }>>;
    generateDarkTheme: z.ZodDefault<z.ZodBoolean>;
    enforceContrast: z.ZodDefault<z.ZodBoolean>;
    enforceMotionSafety: z.ZodDefault<z.ZodBoolean>;
    spacingSystem: z.ZodDefault<z.ZodEnum<{
        custom: "custom";
        golden: "golden";
        linear: "linear";
    }>>;
    spacingMultiplier: z.ZodDefault<z.ZodNumber>;
    spacingBaseUnit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type DesignSystem = z.infer<typeof DesignSystemSchema>;
export { generateAllTokens, generateAspectRatioTokens, generateBackdropTokens, generateBorderRadiusTokens, generateBorderWidthTokens, generateBreakpointTokens, generateColorTokens, generateDepthScale, generateFontFamilyTokens, generateFontWeightTokens, generateGridTokens, generateHeightScale, generateLetterSpacingTokens, generateMotionTokens, generateOpacityTokens, generateSpacingScale, generateTouchTargetTokens, generateTransformTokens, generateTypographyScale, generateWidthTokens, } from './generators/index';
export { TokenSet, TokenSetSchema } from '@rafters/shared';
/**
 * Check Tailwind CSS version in project
 */
export declare const checkTailwindVersion: (cwd: string) => Promise<string>;
/**
 * Create default grayscale tokens for CLI compatibility
 */
/**
 * Create registry by reading all token JSON files from .rafters/tokens directory
 */
export declare const createRegistry: (tokensDir: string) => TokenSet;
/**
 * Create TokenRegistry instance from JSON files for MCP queries
 * Provides full intelligence metadata for AI agent decision-making
 */
export declare const createTokenRegistry: (tokensDir: string) => TokenRegistry;
/**
 * Fetch tokens from Rafters Studio (stub implementation)
 */
export declare const fetchStudioTokens: (shortcode: string, tokensDir?: string) => Promise<TokenSet>;
export declare const writeTokenFiles: (tokenSet: TokenSet, format: string, cwd: string) => Promise<void>;
/**
 * Install Rafters design system CSS (complete replacement with backup)
 * Returns information about what was done for CLI to format
 */
export declare const injectCSSImport: (cssFilePath: string, cwd: string) => Promise<{
    action: "created" | "replaced" | "skipped";
    backupPath?: string;
    message: string;
}>;
export declare const exportTokens: (designSystem: DesignSystem, format: "tw" | "css" | "json") => string;
/**
 * Regenerate CSS file with current tokens from .rafters/tokens/ JSON files
 */
export declare const regenerateCSS: (cwd?: string) => Promise<void>;
declare const _default: {
    checkTailwindVersion: (cwd: string) => Promise<string>;
    createRegistry: (tokensDir: string) => TokenSet;
    createTokenRegistry: (tokensDir: string) => TokenRegistry;
    fetchStudioTokens: (shortcode: string, tokensDir?: string) => Promise<TokenSet>;
    writeTokenFiles: (tokenSet: TokenSet, format: string, cwd: string) => Promise<void>;
    injectCSSImport: (cssFilePath: string, cwd: string) => Promise<{
        action: "created" | "replaced" | "skipped";
        backupPath?: string;
        message: string;
    }>;
    regenerateCSS: (cwd?: string) => Promise<void>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map