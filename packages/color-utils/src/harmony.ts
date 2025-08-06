/**
 * Advanced harmony generation for design systems
 * Inspired by Leonardo's color theory approach
 */

import type { OKLCH } from '@rafters/shared';
import Color from 'colorjs.io';
import { calculateWCAGContrast } from './accessibility.js';

/**
 * Generate optimal gray color for a given palette
 * Uses perceptual averaging of the palette's chromatic content
 */
export function generateOptimalGray(paletteColors: OKLCH[]): OKLCH {
  // Calculate average chroma and hue, weighted by lightness
  let totalChroma = 0;
  let totalHueX = 0;
  let totalHueY = 0;
  let totalWeight = 0;

  for (const color of paletteColors) {
    // Weight by lightness to favor mid-tone colors
    const weight = 1 - Math.abs(color.l - 0.5) * 2;

    totalChroma += color.c * weight;
    totalHueX += Math.cos((color.h * Math.PI) / 180) * color.c * weight;
    totalHueY += Math.sin((color.h * Math.PI) / 180) * color.c * weight;
    totalWeight += weight;
  }

  const avgChroma = totalWeight > 0 ? totalChroma / totalWeight : 0;
  const avgHue = Math.atan2(totalHueY, totalHueX) * (180 / Math.PI);
  const normalizedHue = ((avgHue % 360) + 360) % 360;

  // Generate a low-chroma gray with subtle color bias
  return {
    l: 0.5, // Neutral mid-gray lightness
    c: Math.min(0.02, avgChroma * 0.1), // Very low chroma with palette influence
    h: normalizedHue,
    alpha: 1,
  };
}

/**
 * Generate a five-color harmony plus optimal gray
 * Based on advanced color theory and perceptual optimization
 */
export function generateFiveColorHarmony(baseColor: OKLCH): {
  primary: OKLCH;
  secondary: OKLCH;
  tertiary: OKLCH;
  accent: OKLCH;
  surface: OKLCH;
  neutral: OKLCH; // The optimal gray
} {
  const primary = baseColor;

  // Generate secondary color using split-complementary approach
  const secondary: OKLCH = {
    ...baseColor,
    h: (baseColor.h + 150) % 360,
    l: Math.max(0.2, Math.min(0.8, baseColor.l + 0.1)),
    c: baseColor.c * 0.8,
  };

  // Generate tertiary using triadic harmony with lightness variation
  const tertiary: OKLCH = {
    ...baseColor,
    h: (baseColor.h + 120) % 360,
    l: Math.max(0.3, Math.min(0.7, baseColor.l - 0.1)),
    c: baseColor.c * 0.9,
  };

  // Generate accent using complementary with high chroma
  const accent: OKLCH = {
    ...baseColor,
    h: (baseColor.h + 180) % 360,
    l: baseColor.l > 0.5 ? 0.3 : 0.7, // Ensure contrast
    c: Math.min(0.3, baseColor.c * 1.4), // Boost chroma for accent
  };

  // Generate surface color (desaturated, comfortable lightness)
  const surface: OKLCH = {
    ...baseColor,
    h: (baseColor.h + 15) % 360, // Slight hue shift
    l: 0.85, // More usable lightness than 0.95
    c: Math.max(0.02, baseColor.c * 0.15), // Very low chroma for surfaces
  };

  // Generate optimal neutral gray
  const neutral = generateOptimalGray([primary, secondary, tertiary, accent, surface]);

  return {
    primary,
    secondary,
    tertiary,
    accent,
    surface,
    neutral,
  };
}

/**
 * Generate semantic color suggestions based on color theory and conventional expectations
 * Each semantic color gets multiple suggestions for user choice
 */
export function generateSemanticColorSuggestions(baseColor: OKLCH): {
  danger: OKLCH[];
  success: OKLCH[];
  warning: OKLCH[];
  info: OKLCH[];
} {
  // Danger colors - Red region (0-30° and 330-360°) - Keep them vibrant, not dark
  const danger: OKLCH[] = [
    // Bright red
    {
      l: Math.max(0.55, Math.min(0.7, baseColor.l + 0.1)),
      c: Math.min(0.25, baseColor.c * 1.2),
      h: 15,
      alpha: 1,
    },
    // Warmer red
    {
      l: Math.max(0.6, Math.min(0.75, baseColor.l + 0.15)),
      c: Math.min(0.22, baseColor.c * 1.1),
      h: 25,
      alpha: 1,
    },
    // Cooler red
    {
      l: Math.max(0.5, Math.min(0.65, baseColor.l + 0.05)),
      c: Math.min(0.23, baseColor.c * 1.15),
      h: 5,
      alpha: 1,
    },
  ];

  // Success colors - Green region (120-150°) - Make them brighter and more optimistic
  const success: OKLCH[] = [
    // Fresh green
    {
      l: Math.max(0.6, Math.min(0.75, baseColor.l + 0.15)),
      c: Math.min(0.2, baseColor.c * 0.9),
      h: 135,
      alpha: 1,
    },
    // Vibrant green
    {
      l: Math.max(0.55, Math.min(0.7, baseColor.l + 0.1)),
      c: Math.min(0.22, baseColor.c * 1.0),
      h: 145,
      alpha: 1,
    },
    // Bright green
    {
      l: Math.max(0.65, Math.min(0.8, baseColor.l + 0.2)),
      c: Math.min(0.24, baseColor.c * 1.1),
      h: 125,
      alpha: 1,
    },
  ];

  // Warning colors - Orange/Yellow region (30-70°) - Keep these bright
  const warning: OKLCH[] = [
    // Orange
    {
      l: Math.max(0.7, Math.min(0.8, baseColor.l + 0.15)),
      c: Math.min(0.2, baseColor.c * 0.95),
      h: 45,
      alpha: 1,
    },
    // Amber
    {
      l: Math.max(0.75, Math.min(0.85, baseColor.l + 0.2)),
      c: Math.min(0.18, baseColor.c * 0.9),
      h: 55,
      alpha: 1,
    },
    // Yellow-orange
    {
      l: Math.max(0.72, Math.min(0.82, baseColor.l + 0.17)),
      c: Math.min(0.19, baseColor.c * 0.92),
      h: 35,
      alpha: 1,
    },
  ];

  // Info colors - Blue region (200-240°) - Make them more vibrant, less muddy
  const info: OKLCH[] = [
    // Sky blue
    {
      l: Math.max(0.6, Math.min(0.75, baseColor.l + 0.1)),
      c: Math.min(0.2, baseColor.c * 0.9),
      h: 220,
      alpha: 1,
    },
    // Ocean blue
    {
      l: Math.max(0.55, Math.min(0.7, baseColor.l + 0.05)),
      c: Math.min(0.22, baseColor.c * 1.0),
      h: 230,
      alpha: 1,
    },
    // Electric blue
    {
      l: Math.max(0.5, Math.min(0.65, baseColor.l)),
      c: Math.min(0.25, baseColor.c * 1.1),
      h: 240,
      alpha: 1,
    },
  ];

  return {
    danger,
    success,
    warning,
    info,
  };
}

/**
 * Generate intelligent background/foreground combinations for a color scale
 * Analyzes contrast ratios and suggests optimal pairings - Pure OKLCH
 */
export function generateColorCombinations(colorScale: Record<string, OKLCH>) {
  const scaleEntries = Object.entries(colorScale);
  const combinations: {
    background: OKLCH;
    foreground: OKLCH;
    backgroundTint: string;
    foregroundTint: string;
    contrastRatio: number;
    usage: 'primary' | 'secondary' | 'subtle';
  }[] = [];

  // Define usage patterns based on lightness contrast
  const lightBackgrounds = ['50', '100', '200']; // Light tints for backgrounds
  const darkForegrounds = ['700', '800', '900']; // Dark tints for text

  // Primary combinations: Light backgrounds with dark foregrounds
  for (const bgTint of lightBackgrounds) {
    for (const fgTint of darkForegrounds) {
      if (colorScale[bgTint] && colorScale[fgTint]) {
        const bgOklch = colorScale[bgTint];
        const fgOklch = colorScale[fgTint];

        const contrast = calculateWCAGContrast(bgOklch, fgOklch);

        combinations.push({
          background: bgOklch,
          foreground: fgOklch,
          backgroundTint: bgTint,
          foregroundTint: fgTint,
          contrastRatio: contrast,
          usage: contrast >= 7 ? 'primary' : contrast >= 4.5 ? 'secondary' : 'subtle',
        });
      }
    }
  }

  // Sort by contrast ratio (highest first) and return top combinations
  return combinations.sort((a, b) => b.contrastRatio - a.contrastRatio).slice(0, 6);
}

/**
 * Generate OKLCH color scale from base color with perceptual uniformity
 * Creates 50-900 scale with proper lightness distribution
 */
export function generateOKLCHScale(baseColor: OKLCH): Record<string, OKLCH> {
  // Define lightness values for each scale step (perceptually uniform)
  const lightnessSteps = {
    50: 0.96,
    100: 0.92,
    200: 0.84,
    300: 0.76,
    400: 0.64,
    500: baseColor.l, // Use the actual base color lightness
    600: Math.max(0.1, baseColor.l - 0.15),
    700: Math.max(0.08, baseColor.l - 0.25),
    800: Math.max(0.06, baseColor.l - 0.35),
    900: Math.max(0.04, baseColor.l - 0.45),
  };

  const scale: Record<string, OKLCH> = {};

  Object.entries(lightnessSteps).forEach(([step, lightness]) => {
    // Adjust chroma based on lightness to maintain perceptual uniformity
    let adjustedChroma = baseColor.c;
    
    // Reduce chroma at very light and very dark ends
    if (lightness > 0.9) {
      adjustedChroma *= 0.3; // Very light colors need less chroma
    } else if (lightness < 0.15) {
      adjustedChroma *= 0.6; // Very dark colors need less chroma  
    }

    scale[step] = {
      l: lightness,
      c: adjustedChroma,
      h: baseColor.h,
      alpha: baseColor.alpha,
    };
  });

  return scale;
}

/**
 * Generate semantic color system with intelligent background/foreground suggestions - Pure OKLCH
 */
export function generateSemanticColorSystem(baseColor: OKLCH) {
  const suggestions = generateSemanticColorSuggestions(baseColor);
  const semanticSystem: {
    [K in keyof typeof suggestions]: {
      colors: OKLCH[];
      scale: Record<string, OKLCH>;
      combinations?: ReturnType<typeof generateColorCombinations>;
    };
  } = {
    danger: { colors: suggestions.danger, scale: {} },
    success: { colors: suggestions.success, scale: {} },
    warning: { colors: suggestions.warning, scale: {} },
    info: { colors: suggestions.info, scale: {} },
  };

  // For each semantic type, generate a scale from the first suggestion and analyze combinations
  Object.entries(suggestions).forEach(([semanticType, colors]) => {
    if (colors.length > 0) {
      const baseSemanticColor = colors[0]; // Use first suggestion

      // Generate OKLCH scale
      const colorScale = generateOKLCHScale(baseSemanticColor);

      // Analyze combinations
      const combinations = generateColorCombinations(colorScale);

      semanticSystem[semanticType as keyof typeof semanticSystem].scale = colorScale;
      semanticSystem[semanticType as keyof typeof semanticSystem].combinations = combinations;
    }
  });

  return semanticSystem;
}

/**
 * Leonardo's atmospheric perspective - colors get cooler and lighter with distance
 * Applied to UI: background colors should be cooler/lighter, foreground warmer/darker
 */
export function calculateAtmosphericWeight(color: OKLCH): {
  distanceWeight: number; // 0 = background, 1 = foreground
  temperature: 'warm' | 'neutral' | 'cool';
  atmosphericRole: 'background' | 'midground' | 'foreground';
} {
  // Leonardo observed warm colors advance, cool colors recede
  const hue = color.h;
  const warmHues = (hue >= 0 && hue <= 60) || (hue >= 300 && hue <= 360); // Red-Yellow range
  const coolHues = hue >= 180 && hue <= 270; // Blue-Cyan range

  // Higher lightness and lower chroma = more atmospheric (distant)
  const lightnessWeight = color.l; // 0-1, higher = more distant
  const chromaWeight = 1 - Math.min(1, color.c / 0.3); // Normalize chroma, invert

  // Calculate distance weight (0 = far/background, 1 = near/foreground)
  let distanceWeight = 0;

  if (warmHues) {
    distanceWeight += 0.3; // Warm colors advance
  } else if (coolHues) {
    distanceWeight -= 0.2; // Cool colors recede
  }

  distanceWeight += (1 - lightnessWeight) * 0.4; // Darker = closer
  distanceWeight += color.c * 1.5; // Higher chroma = closer

  // Clamp between 0-1
  distanceWeight = Math.max(0, Math.min(1, distanceWeight));

  const temperature = warmHues ? 'warm' : coolHues ? 'cool' : 'neutral';

  let atmosphericRole: 'background' | 'midground' | 'foreground';
  if (distanceWeight < 0.3) atmosphericRole = 'background';
  else if (distanceWeight < 0.7) atmosphericRole = 'midground';
  else atmosphericRole = 'foreground';

  return { distanceWeight, temperature, atmosphericRole };
}

/**
 * Leonardo's simultaneous contrast - how adjacent colors affect each other
 * Calculates optimal contrast relationships for UI hierarchies
 */
export function calculateSimultaneousContrast(
  baseColor: OKLCH,
  adjacentColors: OKLCH[]
): {
  enhancedColor: OKLCH;
  contrastRatio: number;
  harmonicTension: number; // 0-1, aesthetic tension level
} {
  // Average the adjacent colors to understand the context
  let avgLightness = 0;
  let avgChroma = 0;
  let avgHueX = 0;
  let avgHueY = 0;

  adjacentColors.forEach((color) => {
    avgLightness += color.l;
    avgChroma += color.c;
    avgHueX += Math.cos((color.h * Math.PI) / 180) * color.c;
    avgHueY += Math.sin((color.h * Math.PI) / 180) * color.c;
  });

  const count = adjacentColors.length;
  avgLightness /= count;
  avgChroma /= count;
  const avgHue = Math.atan2(avgHueY, avgHueX) * (180 / Math.PI);
  const normalizedAvgHue = ((avgHue % 360) + 360) % 360;

  // Leonardo's principle: colors shift away from their context
  // If surrounded by light colors, make this darker and more chromatic
  // If surrounded by dark colors, make this lighter

  let enhancedLightness = baseColor.l;
  let enhancedChroma = baseColor.c;
  let enhancedHue = baseColor.h;

  // Lightness contrast enhancement
  if (avgLightness > 0.6) {
    // Surrounded by light colors - make this darker
    enhancedLightness = Math.max(0.1, baseColor.l - 0.2);
  } else if (avgLightness < 0.4) {
    // Surrounded by dark colors - make this lighter
    enhancedLightness = Math.min(0.9, baseColor.l + 0.2);
  }

  // Chroma contrast enhancement
  if (avgChroma < 0.1) {
    // Surrounded by gray colors - increase chroma
    enhancedChroma = Math.min(0.3, baseColor.c * 1.5);
  }

  // Hue contrast - slight shift away from average context hue
  const hueDifference = Math.abs(baseColor.h - normalizedAvgHue);
  if (hueDifference < 30) {
    // Too close to context - shift slightly
    enhancedHue = (baseColor.h + 15) % 360;
  }

  const enhancedColor: OKLCH = {
    l: enhancedLightness,
    c: enhancedChroma,
    h: enhancedHue,
    alpha: baseColor.alpha,
  };

  // Calculate harmonic tension (aesthetic interest)
  const harmonicTension = Math.min(
    1,
    (Math.abs(enhancedLightness - avgLightness) +
      Math.abs(enhancedChroma - avgChroma) * 2 +
      Math.min(hueDifference, 360 - hueDifference) / 180) /
      3
  );

  const contrastRatio = calculateWCAGContrast(
    { l: avgLightness, c: avgChroma, h: normalizedAvgHue, alpha: 1 },
    enhancedColor
  );

  return {
    enhancedColor,
    contrastRatio,
    harmonicTension,
  };
}

/**
 * Leonardo's perceptual weight - some colors feel "heavier" than others
 * Used for visual balance in UI layouts
 */
export function calculatePerceptualWeight(color: OKLCH): {
  weight: number; // 0-1, higher = more visual weight
  density: 'light' | 'medium' | 'heavy';
  balancingRecommendation: string;
} {
  // Factors that increase perceptual weight:
  // 1. Lower lightness (darker colors feel heavier)
  // 2. Higher chroma (saturated colors demand attention)
  // 3. Warm hues (red/orange feel heavier than blue/green)
  // 4. Certain hues have inherent weight (red > orange > yellow > green > blue > purple)

  const hue = color.h;
  let hueWeight = 0.5; // Default neutral weight

  // Hue weight based on Leonardo's observations
  if (hue >= 345 || hue <= 15)
    hueWeight = 0.9; // Red - heaviest
  else if (hue <= 45)
    hueWeight = 0.8; // Red-Orange
  else if (hue <= 75)
    hueWeight = 0.6; // Orange-Yellow
  else if (hue <= 105)
    hueWeight = 0.4; // Yellow-Green
  else if (hue <= 165)
    hueWeight = 0.3; // Green - lightest feeling
  else if (hue <= 225)
    hueWeight = 0.2; // Blue - very light feeling
  else if (hue <= 285)
    hueWeight = 0.35; // Blue-Purple
  else hueWeight = 0.5; // Purple-Red

  // Combine factors
  const lightnessWeight = 1 - color.l; // Invert: darker = heavier
  const chromaWeight = Math.min(1, color.c / 0.3); // Normalize chroma

  const weight = lightnessWeight * 0.4 + chromaWeight * 0.35 + hueWeight * 0.25;

  let density: 'light' | 'medium' | 'heavy';
  let balancingRecommendation: string;

  if (weight < 0.3) {
    density = 'light';
    balancingRecommendation = 'Can be used in larger areas, needs darker accents for balance';
  } else if (weight < 0.7) {
    density = 'medium';
    balancingRecommendation = 'Good for medium-sized UI elements, balanced weight';
  } else {
    density = 'heavy';
    balancingRecommendation = 'Use sparingly, best for small accents or important CTAs';
  }

  return {
    weight,
    density,
    balancingRecommendation,
  };
}

/**
 * Leonardo-inspired semantic color enhancement
 * Applies atmospheric perspective, simultaneous contrast, and perceptual weight
 */
export function enhanceSemanticColorsWithLeonardo(
  baseColor: OKLCH,
  semanticSuggestions: ReturnType<typeof generateSemanticColorSuggestions>
) {
  const enhancedSystem: {
    [K in keyof typeof semanticSuggestions]: {
      colors: (OKLCH & {
        atmosphericWeight: ReturnType<typeof calculateAtmosphericWeight>;
        perceptualWeight: ReturnType<typeof calculatePerceptualWeight>;
        enhancedVersion?: OKLCH;
        harmonicTension?: number;
      })[];
      contextualRecommendations: string[];
    };
  } = {
    danger: { colors: [], contextualRecommendations: [] },
    success: { colors: [], contextualRecommendations: [] },
    warning: { colors: [], contextualRecommendations: [] },
    info: { colors: [], contextualRecommendations: [] },
  };

  // Create context from base color and other semantics for simultaneous contrast
  const allSemanticColors = Object.values(semanticSuggestions).flat();
  const contextColors = [baseColor, ...allSemanticColors.slice(0, 3)];

  Object.entries(semanticSuggestions).forEach(([semanticType, colors]) => {
    const enhancedColors = colors.map((color) => {
      const atmosphericWeight = calculateAtmosphericWeight(color);
      const perceptualWeight = calculatePerceptualWeight(color);

      // Apply simultaneous contrast enhancement
      const contrastAnalysis = calculateSimultaneousContrast(color, contextColors);

      return {
        ...color,
        atmosphericWeight,
        perceptualWeight,
        enhancedVersion: contrastAnalysis.enhancedColor,
        harmonicTension: contrastAnalysis.harmonicTension,
      };
    });

    // Generate contextual recommendations based on Leonardo's principles
    const recommendations: string[] = [];

    // Atmospheric perspective recommendations
    const backgroundColors = enhancedColors.filter(
      (c) => c.atmosphericWeight.atmosphericRole === 'background'
    );
    const foregroundColors = enhancedColors.filter(
      (c) => c.atmosphericWeight.atmosphericRole === 'foreground'
    );

    if (backgroundColors.length > 0) {
      recommendations.push(`Use ${semanticType} backgrounds for subtle, receding elements`);
    }
    if (foregroundColors.length > 0) {
      recommendations.push(`Use ${semanticType} foregrounds for prominent, advancing elements`);
    }

    // Perceptual weight recommendations
    const heavyColors = enhancedColors.filter((c) => c.perceptualWeight.density === 'heavy');
    const lightColors = enhancedColors.filter((c) => c.perceptualWeight.density === 'light');

    if (heavyColors.length > 0) {
      recommendations.push(
        `Heavy ${semanticType} colors work best for critical actions and alerts`
      );
    }
    if (lightColors.length > 0) {
      recommendations.push(
        `Light ${semanticType} colors ideal for backgrounds and subtle indicators`
      );
    }

    // Temperature-based recommendations
    const warmColors = enhancedColors.filter((c) => c.atmosphericWeight.temperature === 'warm');
    const coolColors = enhancedColors.filter((c) => c.atmosphericWeight.temperature === 'cool');

    if (warmColors.length > 0 && semanticType === 'danger') {
      recommendations.push('Warm danger colors create urgency and immediate attention');
    }
    if (coolColors.length > 0 && semanticType === 'info') {
      recommendations.push('Cool info colors convey calm, trustworthy information');
    }

    enhancedSystem[semanticType as keyof typeof enhancedSystem] = {
      colors: enhancedColors,
      contextualRecommendations: recommendations,
    };
  });

  return enhancedSystem;
}
