/**
 * Complete Color Generator - Schema-First Approach
 *
 * Uses Zod schemas and Color Intelligence API to generate complete color system:
 * 1. Initial API call for primary color intelligence
 * 2. Mathematical semantic color selection (darkest danger, brightest success, etc.)
 * 3. Additional API calls for complete ColorValue objects
 * 4. Mathematical state mapping with magnitude modifiers
 * 5. Dark mode using accessibility data
 */

import type { ColorReference, ColorValue, OKLCH, Token } from '@rafters/shared';
import { ColorValueSchema, OKLCHSchema, TokenSchema } from '@rafters/shared';
import { z } from 'zod';

// Input Configuration Schema
export const ColorGeneratorConfigSchema = z.object({
  baseColor: OKLCHSchema,
  apiUrl: z.string(),
  generateDarkMode: z.boolean().optional().default(false),
});

export type ColorGeneratorConfig = z.infer<typeof ColorGeneratorConfigSchema>;

// Family Mapping Schema
export const FamilyMappingSchema = z.record(z.string(), OKLCHSchema);

// Output Result Schema
export const ColorGeneratorResultSchema = z.object({
  tokens: z.array(TokenSchema),
  familyMapping: FamilyMappingSchema,
  colorValues: z.record(z.string(), ColorValueSchema),
});

export type ColorGeneratorResult = z.infer<typeof ColorGeneratorResultSchema>;

export async function generateColorTokens(
  config: ColorGeneratorConfig
): Promise<ColorGeneratorResult> {
  // Validate input
  const validatedConfig = ColorGeneratorConfigSchema.parse(config);

  try {
    // Step 1: Make initial API call to get primary color intelligence
    const initialResponse = await fetch(validatedConfig.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oklch: validatedConfig.baseColor }),
    });

    if (!initialResponse.ok) {
      throw new Error(`API call failed: ${initialResponse.status}`);
    }

    const primaryColorValue = ColorValueSchema.parse(await initialResponse.json());

    // Step 2: CORRECTED MAPPING - Base color is PRIMARY, create mathematical grayscale system
    const familyMapping: Record<string, OKLCH> = {
      // Base color is PRIMARY (not neutral)
      primary: validatedConfig.baseColor,

      // Create neutral grayscale from primary but more desaturated
      neutral: {
        ...validatedConfig.baseColor,
        c: Math.max(0.005, validatedConfig.baseColor.c * 0.1), // Much more desaturated for neutral
      },

      // Mathematical harmony selection
      secondary: primaryColorValue.harmonies.complementary,
      accent: primaryColorValue.harmonies.triadic[0],
      highlight: primaryColorValue.harmonies.tetradic[0],

      // Mathematical semantic selection with proper criteria
      destructive: selectSemanticColor(primaryColorValue.semanticSuggestions.danger, 'darkest'),
      success: selectSemanticColor(primaryColorValue.semanticSuggestions.success, 'brightest'),
      warning: selectSemanticColor(primaryColorValue.semanticSuggestions.warning, 'middle'),
      info: selectSemanticColor(primaryColorValue.semanticSuggestions.info, 'quietest'),
    };

    // Step 3: Make API calls for each family to get complete ColorValue objects
    const colorValues: Record<string, ColorValue> = { primary: primaryColorValue };

    const familyPromises = Object.entries(familyMapping)
      .filter(([name]) => name !== 'primary')
      .map(async ([familyName, oklch]) => {
        const response = await fetch(validatedConfig.apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ oklch }),
        });

        if (!response.ok) {
          throw new Error(`API call failed for ${familyName}: ${response.status}`);
        }

        const colorValue = ColorValueSchema.parse(await response.json());
        return [familyName, colorValue] as const;
      });

    const familyResults = await Promise.all(familyPromises);
    familyResults.forEach(([familyName, colorValue]) => {
      colorValues[familyName] = colorValue;
    });

    // Step 4: Generate tokens from ColorValue objects
    const tokens = generateTokensFromColorValues(colorValues, validatedConfig.generateDarkMode);

    const result = {
      tokens,
      familyMapping,
      colorValues,
    };

    // Validate output
    return ColorGeneratorResultSchema.parse(result);
  } catch (_error) {
    throw new Error('Failed to generate color system');
  }
}

/**
 * Mathematical semantic color selection
 */
function selectSemanticColor(
  colors: OKLCH[],
  criteria: 'darkest' | 'brightest' | 'middle' | 'quietest'
): OKLCH {
  if (colors.length === 0) throw new Error('No colors provided for semantic selection');

  switch (criteria) {
    case 'darkest':
      // Find color with lowest lightness for maximum impact (destructive)
      return colors.reduce((darkest, color) => (color.l < darkest.l ? color : darkest));

    case 'brightest':
      // Find color with highest lightness for positive feeling (success)
      return colors.reduce((brightest, color) => (color.l > brightest.l ? color : brightest));

    case 'middle': {
      // Find color closest to middle lightness for balance (warning)
      const target = 0.5;
      return colors.reduce((closest, color) =>
        Math.abs(color.l - target) < Math.abs(closest.l - target) ? color : closest
      );
    }

    case 'quietest':
      // Find color with lowest chroma for subtlety (info)
      return colors.reduce((quietest, color) => (color.c < quietest.c ? color : quietest));

    default:
      return colors[0];
  }
}

export function generateTokensFromColorValues(
  colorValues: Record<string, ColorValue>,
  generateDarkMode = false
): Token[] {
  const tokens: Token[] = [];

  // Layer 1: Color Family Scale Tokens with proper naming
  // Use AI-generated names from intelligence for each family
  Object.entries(colorValues).forEach(([familyName, colorValue]) => {
    // Get the AI-generated name for proper token naming
    const colorName =
      colorValue.intelligence?.suggestedName?.toLowerCase().replace(/\s+/g, '-') || familyName;

    colorValue.scale.forEach((oklch: OKLCH, index: number) => {
      const scalePosition = getScaleName(index);

      tokens.push({
        name: `color-${colorName}-${scalePosition}`,
        value: `oklch(${oklch.l.toFixed(3)} ${oklch.c.toFixed(3)} ${oklch.h.toFixed(1)})`,
        category: 'color',
        namespace: 'color',
        semanticMeaning: `${colorName} family scale position ${scalePosition}`,
        scalePosition: index,
        generateUtilityClass: true,
        accessibilityLevel: 'AA',
      });
    });
  });

  // Layer 2: Rafters Semantic Tokens - Map to Layer 1 scale positions
  Object.entries(colorValues).forEach(([familyName, colorValue]) => {
    const colorName =
      colorValue.intelligence?.suggestedName?.toLowerCase().replace(/\s+/g, '-') || familyName;
    const basePosition = colorValue.value || '600';

    // Core semantic token with correct rafters-color-* naming
    tokens.push({
      name: `rafters-color-${familyName}`,
      value: `var(--color-${colorName}-${basePosition})`,
      category: 'color',
      namespace: 'rafters',
      semanticMeaning: `Rafters ${familyName} semantic token`,
      generateUtilityClass: true,
      accessibilityLevel: 'AA',
    });

    // Foreground calculation from accessibility data
    const neutralColorName =
      colorValues.neutral?.intelligence?.suggestedName?.toLowerCase().replace(/\s+/g, '-') ||
      'neutral';
    tokens.push({
      name: `rafters-color-${familyName}-foreground`,
      value: `var(--color-${neutralColorName}-${familyName === 'primary' ? '50' : '900'})`,
      category: 'color',
      namespace: 'rafters',
      semanticMeaning: `Rafters ${familyName} foreground`,
      generateUtilityClass: true,
      accessibilityLevel: 'AA',
    });

    // State variations using mathematical scale progression
    const stateMapping = generateStateMapping(false, getBaseIndex(basePosition));

    ['hover', 'active', 'focus', 'disabled'].forEach((state) => {
      const magnitude = getStateMagnitude(state);
      const scalePosition = stateMapping[magnitude];

      if (scalePosition) {
        tokens.push({
          name: `rafters-${familyName}-${state}`,
          value: `var(--color-${colorName}-${scalePosition})`,
          category: 'color',
          namespace: 'rafters',
          semanticMeaning: `Rafters ${familyName} ${state} state`,
          generateUtilityClass: true,
          accessibilityLevel: 'AA',
        });

        // Foreground for state
        tokens.push({
          name: `rafters-${familyName}-${state}-foreground`,
          value: `var(--color-${colorName === 'neutral' ? colorName : 'neutral'}-${familyName === 'primary' ? '50' : '900'})`,
          category: 'color',
          namespace: 'rafters',
          semanticMeaning: `Rafters ${familyName} ${state} foreground`,
          generateUtilityClass: true,
          accessibilityLevel: 'AA',
        });
      }
    });

    // Dark mode variants use inverted scale mapping
    if (generateDarkMode) {
      const darkStateMapping = generateStateMapping(true, getBaseIndex(basePosition));

      tokens.push({
        name: `rafters-${familyName}-dark`,
        value: `var(--color-${colorName}-${basePosition})`,
        category: 'color',
        namespace: 'rafters',
        semanticMeaning: `Rafters ${familyName} dark mode`,
        generateUtilityClass: true,
        accessibilityLevel: 'AA',
      });

      ['hover', 'active', 'focus', 'disabled'].forEach((state) => {
        const magnitude = getStateMagnitude(state);
        const darkScalePosition = darkStateMapping[magnitude];

        if (darkScalePosition) {
          tokens.push({
            name: `rafters-${familyName}-${state}-dark`,
            value: `var(--color-${colorName}-${darkScalePosition})`,
            category: 'color',
            namespace: 'rafters',
            semanticMeaning: `Rafters ${familyName} ${state} dark mode`,
            generateUtilityClass: true,
            accessibilityLevel: 'AA',
          });
        }
      });
    }
  });

  // Layer 2: Surface Components (using neutral family)
  const neutralColorName =
    colorValues.neutral?.intelligence?.suggestedName?.toLowerCase().replace(/\s+/g, '-') ||
    'neutral';

  const surfaceTokens = [
    {
      name: 'rafters-background',
      value: `var(--color-${neutralColorName}-50)`,
      meaning: 'Primary background surface',
    },
    {
      name: 'rafters-foreground',
      value: `var(--color-${neutralColorName}-900)`,
      meaning: 'Primary text color',
    },
    {
      name: 'rafters-muted',
      value: `var(--color-${neutralColorName}-100)`,
      meaning: 'Muted background',
    },
    {
      name: 'rafters-muted-foreground',
      value: `var(--color-${neutralColorName}-600)`,
      meaning: 'Muted text',
    },
    {
      name: 'rafters-border',
      value: `var(--color-${neutralColorName}-200)`,
      meaning: 'Border color',
    },
    {
      name: 'rafters-input',
      value: `var(--color-${neutralColorName}-200)`,
      meaning: 'Input border',
    },
    { name: 'rafters-ring', value: `var(--color-${neutralColorName}-400)`, meaning: 'Focus ring' },
    {
      name: 'rafters-card',
      value: `var(--color-${neutralColorName}-50)`,
      meaning: 'Card background',
    },
    {
      name: 'rafters-card-foreground',
      value: `var(--color-${neutralColorName}-900)`,
      meaning: 'Card text',
    },
    {
      name: 'rafters-popover',
      value: `var(--color-${neutralColorName}-50)`,
      meaning: 'Popover background',
    },
    {
      name: 'rafters-popover-foreground',
      value: `var(--color-${neutralColorName}-900)`,
      meaning: 'Popover text',
    },
  ];

  surfaceTokens.forEach(({ name, value, meaning }) => {
    tokens.push({
      name,
      value,
      category: 'color',
      namespace: 'rafters',
      semanticMeaning: meaning,
      generateUtilityClass: true,
      accessibilityLevel: 'AA',
    });

    // Dark mode variants
    if (generateDarkMode) {
      const darkValue = value.includes('-50')
        ? value.replace('-50', '-950')
        : value.includes('-100')
          ? value.replace('-100', '-800')
          : value.includes('-200')
            ? value.replace('-200', '-700')
            : value.includes('-400')
              ? value.replace('-400', '-600')
              : value.includes('-600')
                ? value.replace('-600', '-400')
                : value.includes('-900')
                  ? value.replace('-900', '-50')
                  : value;

      tokens.push({
        name: `${name}-dark`,
        value: darkValue,
        category: 'color',
        namespace: 'rafters',
        semanticMeaning: `${meaning} (dark mode)`,
        generateUtilityClass: true,
        accessibilityLevel: 'AA',
      });
    }
  });

  // Layer 3: shadcn-compatible theme tokens (map to Rafters tokens)
  const themeTokens = [
    { name: 'background', raftersToken: 'rafters-background' },
    { name: 'foreground', raftersToken: 'rafters-foreground' },
    { name: 'primary', raftersToken: 'rafters-primary' },
    { name: 'primary-foreground', raftersToken: 'rafters-primary-foreground' },
    { name: 'secondary', raftersToken: 'rafters-secondary' },
    { name: 'secondary-foreground', raftersToken: 'rafters-secondary-foreground' },
    { name: 'accent', raftersToken: 'rafters-accent' },
    { name: 'accent-foreground', raftersToken: 'rafters-accent-foreground' },
    { name: 'destructive', raftersToken: 'rafters-destructive' },
    { name: 'destructive-foreground', raftersToken: 'rafters-destructive-foreground' },
    { name: 'muted', raftersToken: 'rafters-muted' },
    { name: 'muted-foreground', raftersToken: 'rafters-muted-foreground' },
    { name: 'border', raftersToken: 'rafters-border' },
    { name: 'input', raftersToken: 'rafters-input' },
    { name: 'ring', raftersToken: 'rafters-ring' },
    { name: 'card', raftersToken: 'rafters-card' },
    { name: 'card-foreground', raftersToken: 'rafters-card-foreground' },
    { name: 'popover', raftersToken: 'rafters-popover' },
    { name: 'popover-foreground', raftersToken: 'rafters-popover-foreground' },
  ];

  themeTokens.forEach(({ name, raftersToken }) => {
    tokens.push({
      name,
      value: `var(--${raftersToken})`,
      category: 'color',
      namespace: 'theme',
      semanticMeaning: `shadcn-compatible ${name}`,
      generateUtilityClass: true,
      accessibilityLevel: 'AA',
    });

    // Dark mode variants
    if (generateDarkMode) {
      tokens.push({
        name: `${name}-dark`,
        value: `var(--${raftersToken}-dark)`,
        category: 'color',
        namespace: 'theme',
        semanticMeaning: `shadcn-compatible ${name} (dark mode)`,
        generateUtilityClass: true,
        accessibilityLevel: 'AA',
      });
    }
  });

  return tokens;
}

export function getScaleName(index: number): string {
  if (index === 0) return '50';
  if (index === 1) return '100';
  if (index === 10) return '950';
  return `${index * 100}`;
}

export function getBaseIndex(value: string = '600'): number {
  const num = parseInt(value, 10);
  if (num === 50) return 0;
  if (num === 100) return 1;
  if (num === 950) return 10;
  return Math.floor(num / 100);
}

export function getStateMagnitude(state: string): string {
  const magnitudes: Record<string, string> = {
    hover: '+1',
    active: '+2',
    focus: '-1',
    disabled: '-2',
    muted: '-1',
  };
  return magnitudes[state] || '0';
}

export function generateStateMapping(
  isDark: boolean,
  baseIndex: number = 5
): Record<string, string> {
  const direction = isDark ? -1 : 1;

  // Mathematical magnitude modifiers
  const magnitudes = [-3, -2, -1, 0, 1, 2, 3];

  const states: Record<string, string> = {};

  magnitudes.forEach((magnitude) => {
    if (magnitude !== 0) {
      const index = Math.max(0, Math.min(10, baseIndex + magnitude * direction));
      const stateName = magnitude > 0 ? `+${magnitude}` : `${magnitude}`;
      states[stateName] = getScaleName(index);
    }
  });

  // Base state
  states['0'] = getScaleName(baseIndex);

  return states;
}

/**
 * NEW TDD ARCHITECTURE FUNCTIONS
 * These implement the efficient family + reference approach
 */

/**
 * Generate color family tokens with complete ColorValue objects
 * Creates 9 tokens that store all intelligence data
 */
export function generateColorFamilyTokens(colorValues: Record<string, ColorValue>): Token[] {
  const familyTokens: Token[] = [];

  Object.entries(colorValues).forEach(([familyKey, colorValue]) => {
    // Use the AI-suggested name if available, otherwise use the key
    const familyName =
      colorValue.intelligence?.suggestedName?.toLowerCase().replace(/\s+/g, '-') || familyKey;

    const familyToken: Token = {
      name: familyName,
      value: colorValue, // Store the complete ColorValue object
      category: 'color-family',
      namespace: 'color',
      semanticMeaning: `Complete ${colorValue.name || familyName} color family with AI intelligence`,
      cognitiveLoad: 2, // Color families are moderate cognitive load
      trustLevel: 'high', // Color families are trusted foundation
      accessibilityLevel: 'AA',
      generateUtilityClass: false, // Families don't generate utilities directly
      generatedFrom: 'color-intelligence-api',
      mathRelationship: '11-step perceptual scale with mathematical relationships',
      usageContext: ['design-system-foundation', 'semantic-color-references'],
    };

    // Validate the token
    TokenSchema.parse(familyToken);

    familyTokens.push(familyToken);
  });

  return familyTokens;
}

/**
 * Generate semantic color tokens that reference families with ColorReference objects
 */
export function generateSemanticColorTokens(
  familyTokens: Token[],
  semanticMapping: Record<string, ColorReference>
): Token[] {
  const semanticTokens: Token[] = [];

  // Get the neutral family for surface tokens
  const neutralFamily = familyTokens.find(
    (t) => t.name.includes('neutral') || t.name.includes('gray')
  );
  const neutralFamilyName = neutralFamily?.name || familyTokens[0]?.name || 'neutral';

  // Generate core semantic tokens
  Object.entries(semanticMapping).forEach(([semanticRole, colorRef]) => {
    // Main semantic token
    const semanticToken: Token = {
      name: semanticRole,
      value: colorRef,
      category: 'color',
      namespace: 'rafters',
      semanticMeaning: `${semanticRole.charAt(0).toUpperCase() + semanticRole.slice(1)} brand color for main actions`,
      cognitiveLoad: semanticRole === 'primary' ? 4 : 3,
      trustLevel: semanticRole === 'primary' ? 'critical' : 'high',
      accessibilityLevel: 'AA',
      generateUtilityClass: true,
      applicableComponents: getApplicableComponents(semanticRole),
      pairedWith: [`${semanticRole}-foreground`],
      generatedFrom: colorRef.family,
      mathRelationship: `Reference to ${colorRef.family} at position ${colorRef.position}`,
    };

    semanticTokens.push(semanticToken);

    // Generate foreground token for contrast
    const foregroundRef: ColorReference = {
      family: neutralFamilyName,
      position: calculateForegroundPosition(colorRef.position),
    };

    const foregroundToken: Token = {
      name: `${semanticRole}-foreground`,
      value: foregroundRef,
      category: 'color',
      namespace: 'rafters',
      semanticMeaning: `Foreground color for ${semanticRole} backgrounds`,
      cognitiveLoad: 2,
      trustLevel: 'high',
      accessibilityLevel: 'AA',
      generateUtilityClass: true,
      applicableComponents: ['text', 'icon'],
      pairedWith: [semanticRole],
      generatedFrom: neutralFamilyName,
      mathRelationship: `Calculated contrast for ${colorRef.position} background`,
    };

    semanticTokens.push(foregroundToken);

    // Generate state tokens
    const states = ['hover', 'active', 'focus', 'disabled'];
    states.forEach((state) => {
      const statePosition = calculateStatePosition(colorRef.position, state);
      const stateRef: ColorReference = {
        family: colorRef.family,
        position: statePosition,
      };

      const stateToken: Token = {
        name: `${semanticRole}-${state}`,
        value: stateRef,
        category: 'color',
        namespace: 'rafters',
        semanticMeaning: `${semanticRole.charAt(0).toUpperCase() + semanticRole.slice(1)} ${state} state`,
        cognitiveLoad: 3,
        trustLevel: 'high',
        accessibilityLevel: 'AA',
        generateUtilityClass: true,
        interactionType: state as 'hover' | 'active' | 'focus' | 'disabled',
        applicableComponents: getApplicableComponents(semanticRole),
        generatedFrom: colorRef.family,
        mathRelationship: `${state} state progression from ${colorRef.position}`,
      };

      semanticTokens.push(stateToken);
    });
  });

  // Generate surface/UI tokens using neutral family
  const surfaceTokens = generateSurfaceTokens(neutralFamilyName);
  semanticTokens.push(...surfaceTokens);

  return semanticTokens;
}

/**
 * Generate surface/UI tokens for backgrounds, borders, etc.
 */
function generateSurfaceTokens(neutralFamilyName: string): Token[] {
  const surfaceDefinitions = [
    { name: 'background', position: '50', meaning: 'Primary background surface' },
    { name: 'foreground', position: '900', meaning: 'Primary text color' },
    { name: 'muted', position: '100', meaning: 'Muted background' },
    { name: 'muted-foreground', position: '600', meaning: 'Muted text' },
    { name: 'border', position: '200', meaning: 'Border color' },
    { name: 'input', position: '200', meaning: 'Input border' },
    { name: 'ring', position: '400', meaning: 'Focus ring' },
  ];

  return surfaceDefinitions.map(({ name, position, meaning }) => ({
    name,
    value: { family: neutralFamilyName, position } as ColorReference,
    category: 'color',
    namespace: 'rafters',
    semanticMeaning: meaning,
    cognitiveLoad: 1,
    trustLevel: 'medium',
    accessibilityLevel: 'AA',
    generateUtilityClass: true,
    applicableComponents: ['surface', 'background', 'border'],
    generatedFrom: neutralFamilyName,
    mathRelationship: `Surface token at position ${position}`,
  }));
}

/**
 * Mathematical semantic color selection from ColorValue suggestions
 */
export function selectSemanticColorFromSuggestions(
  colorValue: ColorValue,
  semanticType: 'destructive' | 'success' | 'warning' | 'info'
): OKLCH {
  // Validate semantic type first
  const validTypes = ['destructive', 'success', 'warning', 'info'];
  if (!validTypes.includes(semanticType)) {
    throw new Error(`Invalid semantic type: ${semanticType}`);
  }

  if (!colorValue.semanticSuggestions) {
    throw new Error('No semantic suggestions available in ColorValue');
  }

  const suggestions =
    colorValue.semanticSuggestions[semanticType === 'destructive' ? 'danger' : semanticType];

  if (!suggestions || suggestions.length === 0) {
    throw new Error(`No colors available for semantic type: ${semanticType}`);
  }

  switch (semanticType) {
    case 'destructive':
      // Find darkest (lowest lightness) for maximum impact
      return suggestions.reduce((darkest, color) => (color.l < darkest.l ? color : darkest));

    case 'success':
      // Find brightest (highest lightness) for positive feeling
      return suggestions.reduce((brightest, color) => (color.l > brightest.l ? color : brightest));

    case 'warning': {
      // Find middle lightness for balance
      const targetLightness = 0.5;
      return suggestions.reduce((closest, color) =>
        Math.abs(color.l - targetLightness) < Math.abs(closest.l - targetLightness)
          ? color
          : closest
      );
    }

    case 'info':
      // Find quietest (lowest chroma) for subtlety
      return suggestions.reduce((quietest, color) => (color.c < quietest.c ? color : quietest));

    default:
      throw new Error(`Invalid semantic type: ${semanticType}`);
  }
}

/**
 * Helper: Get applicable components for semantic roles
 */
function getApplicableComponents(semanticRole: string): string[] {
  const componentMap: Record<string, string[]> = {
    primary: ['button', 'link', 'nav', 'cta'],
    secondary: ['button', 'badge', 'tag'],
    accent: ['highlight', 'emphasis', 'selection'],
    neutral: ['background', 'surface', 'border'],
    destructive: ['button', 'alert', 'error'],
    success: ['button', 'alert', 'badge', 'status'],
    warning: ['button', 'alert', 'badge', 'status'],
    info: ['button', 'alert', 'badge', 'tooltip'],
  };

  return componentMap[semanticRole] || ['generic'];
}

/**
 * Helper: Calculate foreground position for contrast
 */
function calculateForegroundPosition(backgroundPosition: string): string {
  const bgIndex = getBaseIndex(backgroundPosition);

  // If background is light (0-5), use dark foreground (8-10)
  // If background is dark (6-10), use light foreground (0-2)
  if (bgIndex <= 5) {
    return getScaleName(Math.min(10, bgIndex + 5)); // Go darker
  } else {
    return getScaleName(Math.max(0, bgIndex - 7)); // Go lighter
  }
}

/**
 * Helper: Calculate state position based on interaction
 */
function calculateStatePosition(basePosition: string, state: string): string {
  const baseIndex = getBaseIndex(basePosition);
  const magnitude = getStateMagnitude(state);

  // Parse magnitude and apply to index
  const magnitudeNum = magnitude === '0' ? 0 : parseInt(magnitude, 10);
  const newIndex = Math.max(0, Math.min(10, baseIndex + magnitudeNum));

  return getScaleName(newIndex);
}
