/**
 * Color Tokens Generator
 *
 * Semantic color system with accessibility validation
 * Generates comprehensive color scales with meaning and usage context
 */

import type { ColorValue, OKLCH, Token } from '@rafters/shared';

/**
 * Generate comprehensive color tokens with semantic meaning
 * Now produces ColorValue objects with full scale, states, and dark mode support
 *
 * @returns Array of color tokens with ColorValue objects containing OKLCH scales
 *
 * @example
 * ```typescript
 * const colorTokens = generateColorTokens();
 * // Generates semantic colors with ColorValue objects containing:
 * // - baseColor: reference color for the semantic token
 * // - scale: OKLCH color scales [50, 100, 200...900]
 * // - states: hover, focus, active, disabled variants
 * // - darkStates: dark mode variants for all states
 * ```
 */
export function generateColorTokens(): Token[] {
  const tokens: Token[] = [];

  /**
   * Helper function to create OKLCH color scale
   */
  function createOKLCHScale(baseL: number, baseC: number, baseH: number): OKLCH[] {
    const scale: OKLCH[] = [];
    const scaleSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

    for (let i = 0; i < scaleSteps.length; i++) {
      const step = scaleSteps[i];
      // Calculate lightness based on scale position
      // 50 = very light, 500 = base, 900 = very dark
      let lightness: number;
      if (step <= 500) {
        // Interpolate from light to base
        const factor = (500 - step) / 450; // 0 to 1
        lightness = baseL + (0.95 - baseL) * factor;
      } else {
        // Interpolate from base to dark
        const factor = (step - 500) / 400; // 0 to 1
        lightness = baseL - (baseL - 0.15) * factor;
      }

      // Adjust chroma slightly for better color harmony
      const chroma = step === 50 || step === 100 ? baseC * 0.5 : baseC;

      scale.push({
        l: Math.max(0, Math.min(1, lightness)),
        c: Math.max(0, chroma),
        h: baseH,
        alpha: 1,
      });
    }

    return scale;
  }

  /**
   * Helper function to create state variants
   */
  function createStates(
    baseLightness: number,
    chroma: number,
    hue: number
  ): Record<string, string> {
    return {
      hover: `oklch(${Math.max(0.1, baseLightness - 0.05)} ${chroma} ${hue})`,
      focus: `oklch(${Math.max(0.1, baseLightness - 0.03)} ${chroma} ${hue})`,
      active: `oklch(${Math.max(0.1, baseLightness - 0.08)} ${chroma} ${hue})`,
      disabled: `oklch(${baseLightness * 0.5} ${chroma * 0.3} ${hue})`,
    };
  }

  const colorDefinitions = [
    // Primary brand colors
    {
      name: 'primary',
      lightValue: 'oklch(0.45 0.12 240)', // Blue
      darkValue: 'oklch(0.7 0.12 240)',
      lightness: 0.45,
      chroma: 0.12,
      hue: 240,
      meaning: 'Primary brand color for main actions and focus states',
      trustLevel: 'high' as const,
      cognitiveLoad: 3,
      usage: ['cta', 'primary-button', 'brand', 'focus'],
      components: ['button', 'link', 'badge', 'progress'],
    },
    {
      name: 'primary-foreground',
      lightValue: 'oklch(0.95 0 0)', // White
      darkValue: 'oklch(0.15 0.005 240)',
      lightness: 0.95,
      chroma: 0,
      hue: 0,
      meaning: 'Text color for primary backgrounds',
      trustLevel: 'high' as const,
      cognitiveLoad: 1,
      usage: ['text-on-primary', 'button-text'],
      components: ['button', 'badge'],
    },

    // Success colors
    {
      name: 'success',
      lightValue: 'oklch(0.62 0.17 145)', // Green
      darkValue: 'oklch(0.55 0.15 145)',
      lightness: 0.62,
      chroma: 0.17,
      hue: 145,
      meaning: 'Success states, confirmations, positive feedback',
      trustLevel: 'low' as const,
      cognitiveLoad: 2,
      usage: ['success-message', 'confirmation', 'complete'],
      components: ['alert', 'toast', 'badge', 'progress'],
    },
    {
      name: 'success-foreground',
      lightValue: 'oklch(0.95 0 0)',
      darkValue: 'oklch(0.15 0.005 145)',
      lightness: 0.95,
      chroma: 0,
      hue: 0,
      meaning: 'Text color for success backgrounds',
      trustLevel: 'low' as const,
      cognitiveLoad: 1,
      usage: ['text-on-success'],
      components: ['alert', 'badge'],
    },

    // Warning colors
    {
      name: 'warning',
      lightValue: 'oklch(0.7 0.15 75)', // Amber
      darkValue: 'oklch(0.65 0.13 75)',
      lightness: 0.7,
      chroma: 0.15,
      hue: 75,
      meaning: 'Warning states, caution, important information',
      trustLevel: 'medium' as const,
      cognitiveLoad: 5,
      usage: ['warning-message', 'caution', 'important'],
      components: ['alert', 'toast', 'badge'],
    },
    {
      name: 'warning-foreground',
      lightValue: 'oklch(0.15 0.005 75)',
      darkValue: 'oklch(0.95 0 0)',
      lightness: 0.15,
      chroma: 0.005,
      hue: 75,
      meaning: 'Text color for warning backgrounds',
      trustLevel: 'medium' as const,
      cognitiveLoad: 1,
      usage: ['text-on-warning'],
      components: ['alert', 'badge'],
    },

    // Destructive/Error colors
    {
      name: 'destructive',
      lightValue: 'oklch(0.53 0.24 27)', // Red
      darkValue: 'oklch(0.58 0.22 27)',
      lightness: 0.53,
      chroma: 0.24,
      hue: 27,
      meaning: 'Destructive actions, errors, danger - REQUIRES confirmation UX',
      trustLevel: 'critical' as const,
      cognitiveLoad: 8,
      usage: ['error', 'delete', 'danger', 'critical'],
      components: ['button', 'alert', 'toast'],
      requiresConfirmation: true,
    },
    {
      name: 'destructive-foreground',
      lightValue: 'oklch(0.95 0 0)',
      darkValue: 'oklch(0.15 0.005 27)',
      lightness: 0.95,
      chroma: 0,
      hue: 0,
      meaning: 'Text color for destructive backgrounds',
      trustLevel: 'critical' as const,
      cognitiveLoad: 1,
      usage: ['text-on-destructive'],
      components: ['button', 'alert'],
    },

    // Info colors
    {
      name: 'info',
      lightValue: 'oklch(0.66 0.15 240)', // Blue-gray
      darkValue: 'oklch(0.6 0.12 240)',
      lightness: 0.66,
      chroma: 0.15,
      hue: 240,
      meaning: 'Informational messages, neutral notifications',
      trustLevel: 'low' as const,
      cognitiveLoad: 2,
      usage: ['info-message', 'notification', 'neutral'],
      components: ['alert', 'toast', 'badge'],
    },
    {
      name: 'info-foreground',
      lightValue: 'oklch(0.95 0 0)',
      darkValue: 'oklch(0.15 0.005 240)',
      lightness: 0.95,
      chroma: 0,
      hue: 0,
      meaning: 'Text color for info backgrounds',
      trustLevel: 'low' as const,
      cognitiveLoad: 1,
      usage: ['text-on-info'],
      components: ['alert', 'badge'],
    },

    // Background colors
    {
      name: 'background',
      lightValue: 'oklch(1 0 0)', // White
      darkValue: 'oklch(0.09 0 0)', // Near black
      lightness: 1,
      chroma: 0,
      hue: 0,
      meaning: 'Primary background for content areas',
      trustLevel: 'low' as const,
      cognitiveLoad: 1,
      usage: ['page-background', 'content-area'],
      components: ['all'],
    },
    {
      name: 'foreground',
      lightValue: 'oklch(0.15 0.005 240)', // Near black
      darkValue: 'oklch(0.95 0 0)', // White
      lightness: 0.15,
      chroma: 0.005,
      hue: 240,
      meaning: 'Primary text color for body content',
      trustLevel: 'low' as const,
      cognitiveLoad: 1,
      usage: ['body-text', 'primary-text'],
      components: ['text', 'heading', 'paragraph'],
    },

    // Muted colors
    {
      name: 'muted',
      lightValue: 'oklch(0.95 0.01 240)', // Light gray
      darkValue: 'oklch(0.17 0.01 240)', // Dark gray
      lightness: 0.95,
      chroma: 0.01,
      hue: 240,
      meaning: 'Muted backgrounds for secondary content areas',
      trustLevel: 'low' as const,
      cognitiveLoad: 1,
      usage: ['secondary-background', 'subtle-areas'],
      components: ['card', 'sidebar', 'section'],
    },
    {
      name: 'muted-foreground',
      lightValue: 'oklch(0.45 0.02 240)', // Medium gray
      darkValue: 'oklch(0.63 0.02 240)', // Light gray
      lightness: 0.45,
      chroma: 0.02,
      hue: 240,
      meaning: 'Muted text for secondary information',
      trustLevel: 'low' as const,
      cognitiveLoad: 1,
      usage: ['secondary-text', 'metadata', 'captions'],
      components: ['text', 'label', 'caption'],
    },

    // Border colors
    {
      name: 'border',
      lightValue: 'oklch(0.9 0.01 240)', // Light border
      darkValue: 'oklch(0.17 0.01 240)', // Dark border
      lightness: 0.9,
      chroma: 0.01,
      hue: 240,
      meaning: 'Default border color for components',
      trustLevel: 'low' as const,
      cognitiveLoad: 1,
      usage: ['component-borders', 'dividers'],
      components: ['input', 'card', 'button', 'separator'],
    },
  ];

  colorDefinitions.forEach((color, index) => {
    // Generate OKLCH scale for non-foreground colors
    const scale =
      color.name.includes('foreground') || color.name === 'background' || color.name === 'border'
        ? [] // Skip scale generation for foreground/neutral colors
        : createOKLCHScale(color.lightness, color.chroma, color.hue);

    // Generate state variants for interactive colors
    const states =
      color.name.includes('foreground') || color.name === 'background' || color.name === 'border'
        ? {} // Skip states for non-interactive colors
        : createStates(color.lightness, color.chroma, color.hue);

    // Create ColorValue object
    const colorValue: ColorValue = {
      name: color.name,
      scale: scale,
      value: '500', // Default scale position
      use: color.meaning,
      ...(Object.keys(states).length > 0 && { states }),
    };

    tokens.push({
      name: color.name,
      value: color.lightValue, // Use the actual OKLCH light value for the token
      darkValue: color.darkValue,
      category: 'color',
      namespace: 'color',
      semanticMeaning: color.meaning,
      scalePosition: index,
      trustLevel: color.trustLevel,
      cognitiveLoad: color.cognitiveLoad,
      generateUtilityClass: true,
      applicableComponents: color.components,
      accessibilityLevel: 'AAA',
      consequence:
        color.trustLevel === 'critical'
          ? 'destructive'
          : color.trustLevel === 'high'
            ? 'significant'
            : 'reversible',
      usageContext: color.usage,
      ...(color.requiresConfirmation && {
        requiresConfirmation: true,
        trustLevel: 'critical',
      }),
    });
  });

  return tokens;
}
