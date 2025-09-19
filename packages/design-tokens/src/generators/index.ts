/**
 * Design Token Generators
 *
 * Mathematical token generation system with AI intelligence metadata.
 * Each generator creates tokens with semantic meaning, accessibility info,
 * and usage context for AI agent decision-making.
 *
 * All generators follow consistent patterns:
 * - Semantic naming with usage context
 * - AI intelligence metadata (cognitive load, trust level, etc.)
 * - Accessibility validation where applicable
 * - Mathematical relationships for scaling
 * - Responsive and container query variants where relevant
 */

// Import all generators from individual files
export { generateAnimations } from './animations';
export { generateAspectRatioTokens } from './aspect-ratio';
export { generateBackdropTokens } from './backdrop';
export { generateBorderRadiusTokens } from './border-radius';
export { generateBorderWidthTokens } from './border-width';
export { generateBreakpointTokens } from './breakpoint';
export { generateColorTokens } from './color';
export { generateDepthScale } from './depth';
export { generateFontFamilyTokens } from './font-family';
export { generateFontWeightTokens } from './font-weight';
export { generateGridTokens } from './grid';
export { generateHeightScale } from './height';
export { generateLetterSpacingTokens } from './letter-spacing';
export { generateMotionTokens } from './motion';
export { generateOpacityTokens } from './opacity';
export { generateSpacingScale } from './spacing';
export { generateTouchTargetTokens } from './touch-target';
export { generateTransformTokens } from './transform';
export { generateTypographyScale } from './typography';
export { generateWidthTokens } from './width';

// Import for generateAllTokens function
import type { ColorReference, Token } from '@rafters/shared';
import { generateAnimations } from './animations';
import { generateAspectRatioTokens } from './aspect-ratio';
import { generateBackdropTokens } from './backdrop';
import { generateBorderRadiusTokens } from './border-radius';
import { generateBorderWidthTokens } from './border-width';
import { generateBreakpointTokens } from './breakpoint';
import { generateColorTokens } from './color';
import { generateDepthScale } from './depth';
import { generateFontFamilyTokens } from './font-family';
import { generateFontWeightTokens } from './font-weight';
import { generateGridTokens } from './grid';
import { generateHeightScale } from './height';
import { generateLetterSpacingTokens } from './letter-spacing';
import { generateMotionTokens } from './motion';
import { generateOpacityTokens } from './opacity';
import { generateSpacingScale } from './spacing';
import { generateTouchTargetTokens } from './touch-target';
import { generateTransformTokens } from './transform';
import { generateTypographyScale } from './typography';
import { generateWidthTokens } from './width';

/**
 * Generate all design tokens using all generators
 * AI intelligence enrichment happens separately via TokenRegistry
 *
 * @returns Complete set of design tokens for a design system
 */
export async function generateAllTokens(): Promise<Token[]> {
  // Get ColorValue objects with AI intelligence from API
  const colorResult = await generateColorTokens({
    baseColor: { l: 0.44, c: 0.01, h: 286 }, // Rafters Gray primary
    apiUrl: 'https://rafters.realhandy.tech/api/color-intel',
    generateDarkMode: true,
  });

  // Import TDD color functions
  const { generateColorFamilyTokens, generateSemanticColorTokens } = await import('./color.js');

  // Use the new TDD architecture - ignore old tokens, use colorValues
  const familyTokens = generateColorFamilyTokens(colorResult.colorValues);

  // Build semantic mapping using actual generated family names
  const familyNames = familyTokens.map((token) => token.name);
  console.log('Generated family names:', familyNames);

  // Map semantic roles to actual family names based on their semantic suggestions or role
  const semanticMapping: Record<string, ColorReference> = {};

  // Helper to find family by role using simple name matching
  const findFamilyForRole = (role: string): string => {
    // Try to find families by name patterns first
    for (const familyName of familyNames) {
      if (role === 'destructive' && familyName.includes('destructive')) {
        return familyName;
      }
      if (role === 'success' && familyName.includes('success')) {
        return familyName;
      }
      if (role === 'warning' && familyName.includes('warning')) {
        return familyName;
      }
      if (role === 'info' && familyName.includes('info')) {
        return familyName;
      }
    }

    // Get creative AI-generated families (exclude system/generic names)
    const creativeFamilies = familyNames.filter(
      (name) =>
        !name.includes('default') &&
        !name.includes('destructive') &&
        !name.includes('success') &&
        !name.includes('warning') &&
        !name.includes('info') &&
        !name.includes('color') // Exclude generic "-color" families
    );

    if (role === 'primary') return creativeFamilies[0] || familyNames[0];
    if (role === 'secondary') return creativeFamilies[1] || creativeFamilies[0] || familyNames[0];
    if (role === 'accent') return creativeFamilies[2] || creativeFamilies[0] || familyNames[0];

    // Final fallback to first family
    return familyNames[0] || 'default-primary';
  };

  // Helper to get the selected position from ColorValue
  const getSelectedPosition = (familyName: string): string => {
    // Find the colorValue for this family
    for (const [familyKey, colorValue] of Object.entries(colorResult.colorValues)) {
      const generatedName =
        colorValue.intelligence?.suggestedName?.toLowerCase().replace(/\s+/g, '-') || familyKey;
      if (generatedName === familyName) {
        return colorValue.value || '600'; // Use the actual selected value or fallback to 600
      }
    }
    return '600'; // Fallback
  };

  // Build the mapping using actual selected positions
  semanticMapping.primary = {
    family: findFamilyForRole('primary'),
    position: getSelectedPosition(findFamilyForRole('primary')),
  };
  semanticMapping.secondary = {
    family: findFamilyForRole('secondary'),
    position: getSelectedPosition(findFamilyForRole('secondary')),
  };
  semanticMapping.accent = {
    family: findFamilyForRole('accent'),
    position: getSelectedPosition(findFamilyForRole('accent')),
  };
  semanticMapping.destructive = {
    family: findFamilyForRole('destructive'),
    position: getSelectedPosition(findFamilyForRole('destructive')),
  };
  semanticMapping.success = {
    family: findFamilyForRole('success'),
    position: getSelectedPosition(findFamilyForRole('success')),
  };
  semanticMapping.warning = {
    family: findFamilyForRole('warning'),
    position: getSelectedPosition(findFamilyForRole('warning')),
  };
  semanticMapping.info = {
    family: findFamilyForRole('info'),
    position: getSelectedPosition(findFamilyForRole('info')),
  };
  semanticMapping.neutral = {
    family: findFamilyForRole('neutral'),
    position: '500', // Neutral typically uses middle position
  };


  const semanticTokens = generateSemanticColorTokens(familyTokens, semanticMapping);

  return [
    ...generateSpacingScale('linear', 4, 1.25, 12),
    ...generateDepthScale('exponential', 10),
    ...generateHeightScale('linear', 2.5, 1.25), // Re-added height tokens
    ...generateTypographyScale('golden', 1),
    ...familyTokens, // Color family tokens with complete intelligence
    ...semanticTokens, // Semantic tokens with ColorReference values
    ...generateMotionTokens(),
    ...generateAnimations(true), // Complete keyframe animations replacing Tailwind v4 removed animations
    ...generateBorderRadiusTokens(),
    ...generateTouchTargetTokens(),
    ...generateOpacityTokens(),
    ...generateFontFamilyTokens(),
    ...generateFontWeightTokens(),
    ...generateLetterSpacingTokens(),
    ...generateBreakpointTokens(),
    ...generateAspectRatioTokens(),
    ...generateGridTokens(),
    ...generateTransformTokens(),
    ...generateWidthTokens(),
    ...generateBackdropTokens(),
    ...generateBorderWidthTokens(),
  ];
}
