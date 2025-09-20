/**
 * Color Generator v2 - Schema-Driven Architecture
 *
 * Elegant, data-driven color token generation using Zod schemas
 * and the rich intelligence from ColorValue objects.
 */

import {
  calculateDarkModeReference,
  calculateForegroundReference,
  extractAccessibilityLevel,
  extractCognitiveLoad,
  extractTrustLevel,
  generateColorStates,
  selectSemanticColorFromSuggestions,
} from '@rafters/color-utils';
import type { ColorReference, ColorValue, OKLCH, Token } from '@rafters/shared';
import { ColorValueSchema, TokenSchema } from '@rafters/shared';
import { z } from 'zod';

// Configuration schema
const ConfigSchema = z.object({
  baseColor: z.object({
    l: z.number().min(0).max(1),
    c: z.number().min(0),
    h: z.number().min(0).max(360),
  }),
  apiUrl: z.string().url(),
  generateDarkMode: z.boolean().default(false),
});

type Config = z.infer<typeof ConfigSchema>;

// Semantic role schema - defines what semantic tokens we need
const SemanticRoleSchema = z.enum([
  'primary',
  'secondary',
  'accent',
  'highlight',
  'neutral',
  'destructive',
  'success',
  'warning',
  'info',
]);

type SemanticRole = z.infer<typeof SemanticRoleSchema>;

// Token factory functions with validation
function createFamilyToken(name: string, colorValue: ColorValue): Token {
  return TokenSchema.parse({
    name,
    value: colorValue,
    category: 'color-family',
    namespace: 'color',
    semanticMeaning:
      colorValue.intelligence?.usageGuidance ||
      colorValue.intelligence?.reasoning ||
      colorValue.name,
    cognitiveLoad: extractCognitiveLoad(colorValue),
    trustLevel: extractTrustLevel(colorValue.intelligence?.emotionalImpact),
    accessibilityLevel: extractAccessibilityLevel(colorValue.accessibility),
    generateUtilityClass: false,
  });
}

function createSemanticToken(name: string, ref: ColorReference, meaning?: string): Token {
  return TokenSchema.parse({
    name,
    value: ref,
    category: 'color',
    namespace: 'rafters',
    semanticMeaning: meaning || `${name} semantic color`,
    cognitiveLoad: name === 'primary' ? 3 : 2,
    trustLevel: name === 'primary' ? 'critical' : 'high',
    accessibilityLevel: 'AA',
    generateUtilityClass: true,
  });
}

/**
 * Main generator - clean and schema-driven
 */
export async function generateColorTokens(config: Config): Promise<{
  familyTokens: Token[];
  semanticTokens: Token[];
  colorValues: Record<string, ColorValue>;
}> {
  // Validate config
  const { baseColor, apiUrl, generateDarkMode } = ConfigSchema.parse(config);

  // Step 1: Get primary ColorValue from API
  const primaryColorValue = await fetchColorValue(apiUrl, baseColor);

  // Step 2: Build semantic mapping using AI suggestions and harmonies
  const semanticOklchs = buildSemanticMapping(primaryColorValue, baseColor);

  // Step 3: Fetch all ColorValues in parallel
  const colorValues = await fetchAllColorValues(apiUrl, semanticOklchs, primaryColorValue);

  // Step 4: Generate family tokens from ColorValues
  const familyTokens = Object.entries(colorValues).map(([role, colorValue]) => {
    // Use the AI-generated beautiful name, not the semantic role
    const familyName =
      colorValue.intelligence?.suggestedName?.toLowerCase().replace(/\s+/g, '-') ||
      colorValue.name?.toLowerCase().replace(/\s+/g, '-') ||
      role;

    return createFamilyToken(familyName, colorValue);
  });

  // Step 5: Generate semantic tokens using ColorReferences
  // Create mapping from semantic roles to actual family names
  const roleToFamilyMap = new Map<SemanticRole, string>();

  Object.entries(colorValues).forEach(([role, colorValue]) => {
    const familyName =
      colorValue.intelligence?.suggestedName?.toLowerCase().replace(/\s+/g, '-') ||
      colorValue.name?.toLowerCase().replace(/\s+/g, '-') ||
      role;
    roleToFamilyMap.set(role as SemanticRole, familyName);
  });

  const semanticTokens = generateSemanticTokens(roleToFamilyMap, colorValues, generateDarkMode);

  return { familyTokens, semanticTokens, colorValues };
}

/**
 * Fetch ColorValue from API with Zod validation
 */
async function fetchColorValue(apiUrl: string, oklch: OKLCH): Promise<ColorValue> {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oklch }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return ColorValueSchema.parse(await response.json());
}

/**
 * Build semantic OKLCH mapping using AI intelligence
 */
function buildSemanticMapping(
  primaryColorValue: ColorValue,
  baseColor: OKLCH
): Record<SemanticRole, OKLCH> {
  return {
    primary: baseColor,
    secondary: primaryColorValue.harmonies.complementary,
    accent: primaryColorValue.harmonies.triadic[0],
    highlight: primaryColorValue.harmonies.tetradic[0],
    neutral: { ...baseColor, c: baseColor.c * 0.1 }, // Desaturated for neutral

    // Use color-utils for intelligent semantic selection
    destructive: selectSemanticColorFromSuggestions(primaryColorValue, 'destructive'),
    success: selectSemanticColorFromSuggestions(primaryColorValue, 'success'),
    warning: selectSemanticColorFromSuggestions(primaryColorValue, 'warning'),
    info: selectSemanticColorFromSuggestions(primaryColorValue, 'info'),
  };
}

/**
 * Fetch all ColorValues in parallel
 */
async function fetchAllColorValues(
  apiUrl: string,
  semanticOklchs: Record<SemanticRole, OKLCH>,
  primaryColorValue: ColorValue
): Promise<Record<string, ColorValue>> {
  const entries = Object.entries(semanticOklchs);

  const results = await Promise.all(
    entries
      .filter(([role]) => role !== 'primary')
      .map(async ([role, oklch]) => [role, await fetchColorValue(apiUrl, oklch)] as const)
  );

  return Object.fromEntries([['primary', primaryColorValue], ...results]);
}

/**
 * Generate semantic tokens with proper ColorReferences
 */
function generateSemanticTokens(
  roleToFamilyMap: Map<SemanticRole, string>,
  colorValues: Record<string, ColorValue>,
  generateDarkMode: boolean
): Token[] {
  const tokens: Token[] = [];
  const neutralFamilyName = roleToFamilyMap.get('neutral') || 'neutral';

  // Generate base semantic tokens
  roleToFamilyMap.forEach((familyName, role) => {
    const colorValue = colorValues[role];
    if (!colorValue) return;

    const basePosition = colorValue.value || '600';

    // Base semantic token
    const baseRef: ColorReference = {
      family: familyName,
      position: basePosition,
    };
    tokens.push(createSemanticToken(role, baseRef));

    // Foreground token using color-utils
    const foregroundRef = calculateForegroundReference(baseRef, colorValue, neutralFamilyName);
    tokens.push(createSemanticToken(`${role}-foreground`, foregroundRef));

    // State tokens using color-utils
    const stateRefs = generateColorStates(baseRef, colorValue, false);
    Object.entries(stateRefs).forEach(([state, stateRef]) => {
      tokens.push(createSemanticToken(`${role}-${state}`, stateRef));
    });

    // Dark mode tokens if enabled
    if (generateDarkMode) {
      const darkRef = calculateDarkModeReference(baseRef, colorValue);
      tokens.push(createSemanticToken(`${role}-dark`, darkRef));

      const darkForegroundRef = calculateForegroundReference(
        darkRef,
        colorValue,
        neutralFamilyName
      );
      tokens.push(createSemanticToken(`${role}-foreground-dark`, darkForegroundRef));

      const darkStateRefs = generateColorStates(darkRef, colorValue, true);
      Object.entries(darkStateRefs).forEach(([state, stateRef]) => {
        tokens.push(createSemanticToken(`${role}-${state}-dark`, stateRef));
      });
    }
  });

  // Add UI/interface tokens
  tokens.push(...generateUITokens(neutralFamilyName, colorValues, generateDarkMode));

  return tokens;
}

/**
 * Generate UI/interface tokens (background, foreground, border, etc.)
 */
function generateUITokens(
  neutralFamilyName: string,
  colorValues: Record<string, ColorValue>,
  generateDarkMode: boolean
): Token[] {
  const surfaceDefinitions = [
    { name: 'background', position: '50', meaning: 'Primary background' },
    { name: 'foreground', position: '900', meaning: 'Primary text' },
    { name: 'muted', position: '100', meaning: 'Muted background' },
    { name: 'muted-foreground', position: '600', meaning: 'Muted text' },
    { name: 'border', position: '200', meaning: 'Border color' },
    { name: 'input', position: '200', meaning: 'Input border' },
    { name: 'ring', position: '400', meaning: 'Focus ring' },
    { name: 'card', position: '50', meaning: 'Card background' },
    { name: 'card-foreground', position: '900', meaning: 'Card text' },
    { name: 'popover', position: '50', meaning: 'Popover background' },
    { name: 'popover-foreground', position: '900', meaning: 'Popover text' },
  ];

  const tokens: Token[] = [];

  surfaceDefinitions.forEach(({ name, position, meaning }) => {
    const ref: ColorReference = { family: neutralFamilyName, position };
    tokens.push(createSemanticToken(name, ref, meaning));

    if (generateDarkMode) {
      // Use color-utils for proper dark mode calculation
      const neutralColorValue = colorValues[neutralFamilyName]; // Need to pass colorValues
      const darkRef = calculateDarkModeReference(ref, neutralColorValue);
      tokens.push(createSemanticToken(`${name}-dark`, darkRef, `${meaning} (dark)`));
    }
  });

  return tokens;
}
