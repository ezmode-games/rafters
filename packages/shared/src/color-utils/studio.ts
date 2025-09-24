/**
 * Studio integration utilities for CSS, framework integration, and ColorValue intelligence
 */

import type { ColorReference, ColorValue, OKLCH, Token } from '@rafters/shared';
import Color from 'colorjs.io';
import { oklchToCSS, oklchToHex } from './conversion';
/**
 * Generate CSS custom properties from color palette
 */
export function generateCSSVariables(palette: Record<string, OKLCH>, prefix = '--color'): string {
  if (Object.keys(palette).length === 0) {
    return '';
  }

  return Object.entries(palette)
    .map(([name, color]) => {
      const cssName = `${prefix}-${name}`;
      const cssValue = oklchToCSS(color);
      return `${cssName}: ${cssValue};`;
    })
    .join('\n');
}

/**
 * Generate Tailwind color configuration
 */
export function generateTailwindConfig(palette: Record<string, OKLCH>): Record<string, string> {
  const config: Record<string, string> = {};

  for (const [name, color] of Object.entries(palette)) {
    config[name] = oklchToHex(color);
  }

  return config;
}

/**
 * Validate color string format (hex, rgb, hsl, oklch, named)
 */
export function isValidColorString(colorString: string): boolean {
  if (!colorString || typeof colorString !== 'string') {
    return false;
  }

  try {
    // Use colorjs.io to validate - it will throw if invalid
    new Color(colorString);
    return true;
  } catch {
    return false;
  }
}

/**
 * Parse any color string format to OKLCH
 */
export function parseColorString(colorString: string): OKLCH {
  if (!isValidColorString(colorString)) {
    throw new Error(`Invalid color string: ${colorString}`);
  }

  try {
    const color = new Color(colorString);
    const oklch = color.to('oklch');

    return {
      l: oklch.l,
      c: oklch.c,
      h: oklch.h || 0, // Handle undefined hue for achromatic colors
    };
  } catch (_error) {
    throw new Error(`Invalid color string: ${colorString}`);
  }
}

/**
 * ColorValue Intelligence Extraction Functions
 * Functions to extract and map AI intelligence data from ColorValue objects
 */

/**
 * Extract trust level from emotional impact analysis
 */
export function extractTrustLevel(
  emotionalImpact?: string
): 'low' | 'medium' | 'high' | 'critical' | undefined {
  if (!emotionalImpact) return undefined;

  const impact = emotionalImpact.toLowerCase();
  if (impact.includes('trust') || impact.includes('confidence') || impact.includes('reliable'))
    return 'high';
  if (impact.includes('calming') || impact.includes('stable') || impact.includes('professional'))
    return 'high';
  if (impact.includes('anxiety') || impact.includes('stress') || impact.includes('overwhelming'))
    return 'low';
  if (impact.includes('excitement') || impact.includes('energy') || impact.includes('vibrant'))
    return 'medium';

  return 'medium'; // Default
}

/**
 * Extract cognitive load from perceptual weight and analysis
 */
export function extractCognitiveLoad(colorValue: ColorValue): number | undefined {
  const perceptualWeight = colorValue.perceptualWeight?.weight;
  const atmosphericWeight = colorValue.atmosphericWeight?.distanceWeight;

  if (perceptualWeight !== undefined) {
    // Convert 0-1 perceptual weight to 1-10 cognitive load scale
    return Math.round(perceptualWeight * 10) || 1;
  }

  if (atmosphericWeight !== undefined) {
    // Convert atmospheric weight to cognitive load
    return Math.round(atmosphericWeight * 10) || 1;
  }

  return undefined;
}

/**
 * Extract accessibility level from WCAG compliance data
 */
export function extractAccessibilityLevel(
  accessibility?: ColorValue['accessibility']
): 'AA' | 'AAA' | undefined {
  if (!accessibility) return undefined;

  // Check if passes AAA first (stricter)
  if (accessibility.onWhite?.wcagAAA || accessibility.onBlack?.wcagAAA) return 'AAA';

  // Then check AA
  if (accessibility.onWhite?.wcagAA || accessibility.onBlack?.wcagAA) return 'AA';

  return undefined;
}

/**
 * Extract usage context from cultural context and analysis
 */
export function extractUsageContext(
  intelligence?: ColorValue['intelligence']
): string[] | undefined {
  if (!intelligence) return undefined;

  const contexts: string[] = [];

  if (intelligence.culturalContext?.includes('Western')) contexts.push('western-markets');
  if (intelligence.culturalContext?.includes('Eastern')) contexts.push('eastern-markets');
  if (intelligence.culturalContext?.includes('corporate')) contexts.push('enterprise');
  if (intelligence.culturalContext?.includes('tech')) contexts.push('technology');
  if (intelligence.usageGuidance?.includes('dashboard')) contexts.push('data-visualization');
  if (intelligence.usageGuidance?.includes('button')) contexts.push('interactive-elements');

  return contexts.length > 0 ? contexts : undefined;
}

/**
 * Extract applicable components from usage guidance
 */
export function extractApplicableComponents(usageGuidance?: string): string[] | undefined {
  if (!usageGuidance) return undefined;

  const guidance = usageGuidance.toLowerCase();
  const components: string[] = [];

  if (guidance.includes('button')) components.push('button');
  if (guidance.includes('input')) components.push('input');
  if (guidance.includes('card')) components.push('card');
  if (guidance.includes('modal')) components.push('modal');
  if (guidance.includes('navigation')) components.push('navigation');
  if (guidance.includes('dashboard')) components.push('dashboard');
  if (guidance.includes('background')) components.push('background');
  if (guidance.includes('text')) components.push('text');

  return components.length > 0 ? components : undefined;
}

/**
 * Create a token with metadata mapped from ColorValue intelligence
 * This is the core function that generators should use to create tokens
 */
export function createTokenFromColorValue(
  name: string,
  value: ColorValue | ColorReference,
  category: string,
  namespace: string,
  overrides: Partial<Token> = {}
): Token {
  // If value is ColorReference, we can't extract metadata here
  // The calling function needs to resolve the reference first
  let sourceColorValue: ColorValue | undefined;
  if (typeof value === 'object' && 'family' in value) {
    sourceColorValue = undefined;
  } else {
    sourceColorValue = value as ColorValue;
  }

  const baseToken: Token = {
    name,
    value,
    category,
    namespace,
    // Map from ColorValue intelligence if available - dig deep into AI data
    ...(sourceColorValue && {
      semanticMeaning: sourceColorValue.intelligence?.usageGuidance,
      description: sourceColorValue.intelligence?.reasoning,
      // Extract trust level from emotional impact analysis
      trustLevel: extractTrustLevel(sourceColorValue.intelligence?.emotionalImpact),
      // Extract cognitive load from perceptual weight and complexity
      cognitiveLoad: extractCognitiveLoad(sourceColorValue),
      // Determine accessibility level from WCAG compliance
      accessibilityLevel: extractAccessibilityLevel(sourceColorValue.accessibility),
      // Extract usage context from cultural context and usage guidance
      usageContext: extractUsageContext(sourceColorValue.intelligence),
      // Map applicable components from usage guidance
      applicableComponents: extractApplicableComponents(
        sourceColorValue.intelligence?.usageGuidance
      ),
      // Calculate contrast ratio if available
      contrastRatio: sourceColorValue.accessibility?.onWhite?.contrastRatio,
    }),
  };

  return { ...baseToken, ...overrides };
}

/**
 * Color State Generation Functions
 * Functions for generating color state variations (hover, active, focus, disabled)
 */

/**
 * Get magnitude for a given state
 */
export function getStateMagnitude(state: string): number {
  const magnitudes: Record<string, number> = {
    hover: 1, // Slightly more contrast
    active: 2, // More contrast for active state
    focus: -1, // Slightly less contrast for focus outline
    disabled: -2, // Much less contrast for disabled
    muted: -1, // Muted state
  };
  return magnitudes[state] || 0;
}

/**
 * Convert scale position name to index
 */
export function getPositionIndex(position: string): number {
  const num = parseInt(position, 10);
  if (num === 50) return 0;
  if (num === 100) return 1;
  if (num === 950) return 10;
  return Math.floor(num / 100);
}

/**
 * Convert index to scale position name
 */
export function getScaleName(index: number): string {
  if (index === 0) return '50';
  if (index === 1) return '100';
  if (index === 10) return '950';
  return `${index * 100}`;
}

/**
 * Calculate state position based on interaction using WCAG accessibility pairs
 * Uses ColorValue accessibility data for intelligent state generation with proper contrast
 */
export function calculateStatePosition(
  basePosition: string,
  state: string,
  colorValue?: ColorValue,
  isDarkMode: boolean = false
): string {
  const baseIndex = getPositionIndex(basePosition);
  const magnitude = getStateMagnitude(state);

  // If we have ColorValue with WCAG accessibility pairs, use them for intelligent selection
  if (colorValue?.accessibility?.wcagAA) {
    const wcagPairs = colorValue.accessibility.wcagAA.normal;

    if (wcagPairs && wcagPairs.length > 0) {
      // Find pairs that include our base position
      const validPairs = wcagPairs.filter((pair) => pair.includes(baseIndex));

      if (validPairs.length > 0) {
        // Apply magnitude to find the best state position
        const targetIndex = Math.max(0, Math.min(10, baseIndex + magnitude));

        // Find the pair that contains our target or closest to it
        let bestPair = validPairs[0];
        let bestDistance = Infinity;

        for (const pair of validPairs) {
          const otherIndex = pair.find((index) => index !== baseIndex);
          if (otherIndex !== undefined) {
            const distance = Math.abs(otherIndex - targetIndex);
            if (distance < bestDistance) {
              bestDistance = distance;
              bestPair = pair;
            }
          }
        }

        // Return the other position in the best pair
        const stateIndex = bestPair.find((index) => index !== baseIndex);
        if (stateIndex !== undefined) {
          return getScaleName(stateIndex);
        }
      }
    }
  }

  // Fallback: Use individual accessibility arrays if no pairs available
  if (colorValue?.accessibility) {
    const accessibilityData = isDarkMode
      ? colorValue.accessibility.onBlack
      : colorValue.accessibility.onWhite;

    if (accessibilityData?.aa && accessibilityData.aa.length > 0) {
      // Find the position in accessibility array that corresponds to our magnitude
      const basePositionInArray = accessibilityData.aa.findIndex((i) => i >= baseIndex);

      if (basePositionInArray !== -1) {
        // Apply magnitude offset within the accessibility array
        const targetPosition = Math.max(
          0,
          Math.min(accessibilityData.aa.length - 1, basePositionInArray + magnitude)
        );
        return getScaleName(accessibilityData.aa[targetPosition]);
      }
    }
  }

  // Final fallback to mathematical calculation if no accessibility data
  const newIndex = Math.max(0, Math.min(10, baseIndex + magnitude));
  return getScaleName(newIndex);
}

/**
 * Generate color state variations for a base color reference
 * Returns ColorReference objects for each state
 */
export function generateColorStates(
  baseRef: ColorReference,
  colorValue?: ColorValue,
  isDarkMode: boolean = false,
  states: string[] = ['hover', 'active', 'focus', 'disabled']
): Record<string, ColorReference> {
  const stateRefs: Record<string, ColorReference> = {};

  for (const state of states) {
    const statePosition = calculateStatePosition(baseRef.position, state, colorValue, isDarkMode);

    stateRefs[state] = {
      family: baseRef.family,
      position: statePosition,
    };
  }

  return stateRefs;
}

/**
 * Calculate foreground reference using WCAG accessibility pairs from ColorValue
 * Finds the best contrast pair for optimal readability
 */
export function calculateForegroundReference(
  backgroundRef: ColorReference,
  colorValue?: ColorValue,
  neutralFamily: string = 'neutral'
): ColorReference {
  const bgIndex = getPositionIndex(backgroundRef.position);

  // First try: Use WCAG AA pairs for optimal contrast
  if (colorValue?.accessibility?.wcagAA?.normal) {
    const wcagPairs = colorValue.accessibility.wcagAA.normal;

    // Find pairs that include our background position
    const validPairs = wcagPairs.filter((pair) => pair.includes(bgIndex));

    if (validPairs.length > 0) {
      // For foreground, we want maximum contrast
      let bestForegroundIndex = -1;
      let maxContrast = 0;

      for (const pair of validPairs) {
        const foregroundIndex = pair.find((index) => index !== bgIndex);
        if (foregroundIndex !== undefined) {
          // Calculate contrast preference: prefer extreme ends (0-2 or 8-10)
          const contrast = Math.abs(foregroundIndex - bgIndex);
          if (contrast > maxContrast) {
            maxContrast = contrast;
            bestForegroundIndex = foregroundIndex;
          }
        }
      }

      if (bestForegroundIndex !== -1) {
        return {
          family: neutralFamily,
          position: getScaleName(bestForegroundIndex),
        };
      }
    }
  }

  // Fallback: Use individual accessibility arrays
  if (colorValue?.accessibility) {
    if (bgIndex <= 5) {
      // Light background - use darkest from onWhite.aa
      const onWhiteIndices = colorValue.accessibility.onWhite?.aa;
      if (onWhiteIndices && onWhiteIndices.length > 0) {
        const foregroundIndex = onWhiteIndices[onWhiteIndices.length - 1];
        return {
          family: neutralFamily,
          position: getScaleName(foregroundIndex),
        };
      }
    } else {
      // Dark background - use lightest from onBlack.aa
      const onBlackIndices = colorValue.accessibility.onBlack?.aa;
      if (onBlackIndices && onBlackIndices.length > 0) {
        const foregroundIndex = onBlackIndices[0];
        return {
          family: neutralFamily,
          position: getScaleName(foregroundIndex),
        };
      }
    }
  }

  // Final fallback: mathematical logic
  const foregroundPosition = bgIndex <= 5 ? '900' : '50';
  return { family: neutralFamily, position: foregroundPosition };
}

/**
 * Calculate dark mode reference using WCAG accessibility pairs
 * Finds accessible dark mode variants using proper contrast ratios
 */
export function calculateDarkModeReference(
  lightRef: ColorReference,
  colorValue?: ColorValue
): ColorReference {
  const lightIndex = getPositionIndex(lightRef.position);

  // First try: Use WCAG AA pairs to find dark mode equivalent
  if (colorValue?.accessibility?.wcagAA?.normal) {
    const wcagPairs = colorValue.accessibility.wcagAA.normal;

    // Find pairs that include our light position
    const validPairs = wcagPairs.filter((pair) => pair.includes(lightIndex));

    if (validPairs.length > 0) {
      // For dark mode, we want to maintain similar contrast relationships
      // but inverted (light backgrounds become dark, dark text becomes light)

      if (lightIndex <= 5) {
        // Light color in light mode -> should become darker in dark mode
        // Find the darkest paired color
        let darkestIndex = lightIndex;
        for (const pair of validPairs) {
          const otherIndex = pair.find((index) => index !== lightIndex);
          if (otherIndex !== undefined && otherIndex > darkestIndex) {
            darkestIndex = otherIndex;
          }
        }
        if (darkestIndex !== lightIndex) {
          return {
            family: lightRef.family,
            position: getScaleName(darkestIndex),
          };
        }
      } else {
        // Dark color in light mode -> should become lighter in dark mode
        // Find the lightest paired color
        let lightestIndex = lightIndex;
        for (const pair of validPairs) {
          const otherIndex = pair.find((index) => index !== lightIndex);
          if (otherIndex !== undefined && otherIndex < lightestIndex) {
            lightestIndex = otherIndex;
          }
        }
        if (lightestIndex !== lightIndex) {
          return {
            family: lightRef.family,
            position: getScaleName(lightestIndex),
          };
        }
      }
    }
  }

  // Fallback: Use individual accessibility arrays if available
  if (colorValue?.accessibility?.onBlack?.aa) {
    const onBlackIndices = colorValue.accessibility.onBlack.aa;

    // Try to find a corresponding dark position
    // If light is 0-2, use highest onBlack (most contrast)
    // If light is 3-5, use middle onBlack
    // If light is 6+, use lowest onBlack
    let darkIndex: number;

    if (lightIndex <= 2) {
      darkIndex = onBlackIndices[onBlackIndices.length - 1] || 4;
    } else if (lightIndex <= 5) {
      const middle = Math.floor(onBlackIndices.length / 2);
      darkIndex = onBlackIndices[middle] || 2;
    } else {
      darkIndex = onBlackIndices[0] || 0;
    }

    return {
      family: lightRef.family,
      position: getScaleName(darkIndex),
    };
  }

  // Final fallback: mathematical inversion
  const darkIndex = 10 - lightIndex;
  return {
    family: lightRef.family,
    position: getScaleName(darkIndex),
  };
}

/**
 * Semantic Color Selection Functions
 * Enhanced AI-driven semantic color selection using ColorValue intelligence
 */

/**
 * Calculate a semantic fitness score for a color based on role and AI intelligence
 * Higher scores indicate better fitness for the semantic role
 */
function calculateSemanticFitness(
  color: OKLCH,
  semanticType: 'destructive' | 'success' | 'warning' | 'info',
  intelligence?: ColorValue['intelligence']
): number {
  let score = 0;

  // Base perceptual scores using OKLCH values
  switch (semanticType) {
    case 'destructive':
      // Prefer higher chroma (more saturated) and darker lightness for impact
      score += (1 - color.l) * 40; // Darker is better (max 40 points)
      score += color.c * 30; // Higher chroma is better (max 30 points)
      // Prefer red hues (around 0/360 degrees)
      if (color.h >= 350 || color.h <= 30) score += 20;
      break;

    case 'success':
      // Prefer moderate lightness and chroma for positivity without overwhelming
      score += color.l > 0.3 && color.l < 0.7 ? 30 : 0; // Moderate lightness
      score += color.c > 0.1 && color.c < 0.3 ? 25 : 0; // Moderate chroma
      // Prefer green hues (120-180 degrees)
      if (color.h >= 90 && color.h <= 180) score += 25;
      break;

    case 'warning':
      // Prefer moderate-high lightness for visibility and attention
      score += color.l > 0.4 && color.l < 0.8 ? 35 : 0; // Moderate-high lightness
      score += color.c * 25; // Higher chroma for attention (max 25 points)
      // Prefer yellow/orange hues (30-90 degrees)
      if (color.h >= 30 && color.h <= 90) score += 30;
      break;

    case 'info':
      // Prefer moderate lightness and lower chroma for calm communication
      score += color.l > 0.3 && color.l < 0.6 ? 30 : 0; // Moderate lightness
      score += (1 - color.c) * 20; // Lower chroma is better (max 20 points)
      // Prefer blue hues (200-280 degrees)
      if (color.h >= 200 && color.h <= 280) score += 35;
      break;
  }

  // AI intelligence bonuses (up to 30 additional points)
  if (intelligence) {
    // Emotional impact alignment
    const emotionalImpact = intelligence.emotionalImpact?.toLowerCase() || '';
    switch (semanticType) {
      case 'destructive':
        if (
          emotionalImpact.includes('urgent') ||
          emotionalImpact.includes('alert') ||
          emotionalImpact.includes('danger') ||
          emotionalImpact.includes('critical')
        ) {
          score += 15;
        }
        break;
      case 'success':
        if (
          emotionalImpact.includes('positive') ||
          emotionalImpact.includes('success') ||
          emotionalImpact.includes('achievement') ||
          emotionalImpact.includes('growth')
        ) {
          score += 15;
        }
        break;
      case 'warning':
        if (
          emotionalImpact.includes('caution') ||
          emotionalImpact.includes('attention') ||
          emotionalImpact.includes('warning') ||
          emotionalImpact.includes('alert')
        ) {
          score += 15;
        }
        break;
      case 'info':
        if (
          emotionalImpact.includes('calm') ||
          emotionalImpact.includes('professional') ||
          emotionalImpact.includes('trust') ||
          emotionalImpact.includes('reliable')
        ) {
          score += 15;
        }
        break;
    }

    // Usage guidance alignment
    const usageGuidance = intelligence.usageGuidance?.toLowerCase() || '';
    if (semanticType === 'destructive' && usageGuidance.includes('button')) score += 10;
    if (semanticType === 'success' && usageGuidance.includes('confirmation')) score += 10;
    if (semanticType === 'warning' && usageGuidance.includes('notification')) score += 10;
    if (semanticType === 'info' && usageGuidance.includes('information')) score += 10;

    // Cultural context bonus for universally understood semantics
    const culturalContext = intelligence.culturalContext?.toLowerCase() || '';
    if (culturalContext.includes('universal') || culturalContext.includes('global')) {
      score += 5;
    }
  }

  return score;
}

/**
 * Enhanced semantic color selection using AI intelligence and perceptual analysis
 * Replaces the basic mathematical selection with intelligent, context-aware selection
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

  // If only one suggestion, return it immediately
  if (suggestions.length === 1) {
    return suggestions[0];
  }

  // Calculate fitness scores for all suggestions
  const scoredSuggestions = suggestions.map((color) => ({
    color,
    score: calculateSemanticFitness(color, semanticType, colorValue.intelligence),
  }));

  // Sort by fitness score (highest first)
  scoredSuggestions.sort((a, b) => b.score - a.score);

  // Return the best fit color
  return scoredSuggestions[0].color;
}
