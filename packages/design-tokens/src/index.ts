/**
 * @rafters/design-tokens
 *
 * Comprehensive design token system with AI intelligence metadata
 * Built from Sami (UX) and Sally (Accessibility) requirements
 */

import { join } from 'node:path';
import * as fs from 'fs-extra';
import sqids from 'sqids';
import { z } from 'zod';

// Export core TokenRegistry class
export { TokenRegistry } from './registry.js';

export const generateShortCode = () => {
  const s = new sqids();
  return s.encode([Date.now()]);
};

/**
 * Core token schema with comprehensive AI intelligence metadata
 * This is the flat data structure we designed with Sami and Sally
 */
export const TokenSchema = z.object({
  // Core token data
  name: z.string(),
  value: z.string(),
  darkValue: z.string().optional(),
  category: z.string(),
  namespace: z.string(),

  // AI Intelligence (comprehensive)
  semanticMeaning: z.string().optional(),
  usageContext: z.array(z.string()).optional(),
  trustLevel: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  cognitiveLoad: z.number().min(1).max(10).optional(),
  accessibilityLevel: z.enum(['AA', 'AAA']).optional(),
  consequence: z.enum(['reversible', 'significant', 'permanent', 'destructive']).optional(),

  // Mathematical relationships
  generatedFrom: z.string().optional(),
  mathRelationship: z.string().optional(),
  scalePosition: z.number().optional(), // Position in color/spacing scale

  // Responsive behavior
  containerQueryAware: z.boolean().optional(),
  pointerTypeAware: z.boolean().optional(),
  reducedMotionAware: z.boolean().optional(),
  viewportAware: z.boolean().optional(), // Should generate responsive variants

  // Component associations
  applicableComponents: z.array(z.string()).optional(), // ["button", "input", "card"]
  requiredForComponents: z.array(z.string()).optional(), // Critical dependencies

  // Interaction patterns
  interactionType: z.enum(['hover', 'focus', 'active', 'disabled', 'loading']).optional(),
  animationSafe: z.boolean().optional(), // Safe for vestibular disorders
  highContrastMode: z.string().optional(), // Value for high contrast mode

  // Export behavior
  generateUtilityClass: z.boolean().optional(), // Should create @utility class
  tailwindOverride: z.boolean().optional(), // Overrides default TW value
  customPropertyOnly: z.boolean().optional(), // CSS var only, no utility

  // Validation hints (for human Studio validation)
  contrastRatio: z.number().optional(), // Pre-calculated contrast
  touchTargetSize: z.number().optional(), // Pre-calculated size in px
  motionDuration: z.number().optional(), // Duration in ms

  // Design system relationships
  pairedWith: z.array(z.string()).optional(), // Other tokens used together
  conflictsWith: z.array(z.string()).optional(), // Tokens that shouldn't be used together

  // Meta information
  description: z.string().optional(),
  deprecated: z.boolean().optional(),
  version: z.string().optional(),
  lastModified: z.string().optional(),
});

export type Token = z.infer<typeof TokenSchema>;

/**
 * Design system schema - simple collection of tokens with accessibility settings
 */
export const DesignSystemSchema = z.object({
  id: z.string(),
  name: z.string(),
  tokens: z.array(TokenSchema),

  // Accessibility and compliance settings
  accessibilityTarget: z.enum(['AA', 'AAA']).default('AA'),
  section508Compliant: z.boolean().default(true),
  cognitiveLoadBudget: z.number().min(5).max(20).default(15),

  // Technical settings
  primaryColorSpace: z.enum(['sRGB', 'P3', 'oklch']).default('oklch'),
  generateDarkTheme: z.boolean().default(true),
  enforceContrast: z.boolean().default(true),
  enforceMotionSafety: z.boolean().default(true),

  // Mathematical spacing generation
  spacingSystem: z.enum(['linear', 'golden', 'custom']).default('linear'),
  spacingMultiplier: z.number().min(1.1).max(2.0).default(1.25), // For custom, defaults to Tailwind's ~1.25
  spacingBaseUnit: z.number().min(2).max(32).default(4), // Base unit in px
});

export type DesignSystem = z.infer<typeof DesignSystemSchema>;

/**
 * Mathematical constants and generators for design tokens
 */
const GOLDEN_RATIO = 1.618033988749;
const MAJOR_SECOND = 1.125;
const MINOR_THIRD = 1.2;
const MAJOR_THIRD = 1.25;
const PERFECT_FOURTH = 1.333;
const PERFECT_FIFTH = 1.5;

/**
 * Generate spacing scale based on mathematical system with responsive variants
 */
export function generateSpacingScale(
  system: 'linear' | 'golden' | 'custom',
  baseUnit = 4,
  multiplier = 1.25,
  steps = 12,
  generateResponsive = true
): Token[] {
  const tokens: Token[] = [];
  const breakpoints = generateResponsive ? ['sm', 'md', 'lg', 'xl'] : [];
  const containerSizes = generateResponsive ? ['xs', 'sm', 'md', 'lg', 'xl'] : [];

  for (let i = 0; i <= steps; i++) {
    let value: number;
    let name: string;

    switch (system) {
      case 'linear':
        value = baseUnit * (i === 0 ? 0 : i);
        name = i === 0 ? '0' : `${i}`;
        break;
      case 'golden':
        value = i === 0 ? 0 : baseUnit * GOLDEN_RATIO ** (i - 1);
        name = i === 0 ? '0' : `golden-${i}`;
        break;
      case 'custom':
        value = i === 0 ? 0 : baseUnit * multiplier ** (i - 1);
        name = i === 0 ? '0' : `scale-${i}`;
        break;
    }

    // Base token
    tokens.push({
      name,
      value: `${Math.round(value * 100) / 100}rem`,
      category: 'spacing',
      namespace: 'spacing',
      semanticMeaning: `Spacing step ${i} in ${system} scale`,
      mathRelationship:
        system === 'linear' ? `${baseUnit} * ${i}` : `${baseUnit} * ${multiplier}^${i - 1}`,
      scalePosition: i,
      generateUtilityClass: true,
      applicableComponents: ['all'],
      containerQueryAware: generateResponsive,
      viewportAware: generateResponsive,
    });

    // Responsive variants (viewport-based)
    if (generateResponsive) {
      let bpIndex = 0;
      for (const bp of breakpoints) {
        const responsiveMultiplier = 1 + bpIndex * 0.125; // 1, 1.125, 1.25, 1.375, 1.5
        const responsiveValue = value * responsiveMultiplier;

        tokens.push({
          name: `${bp}-${name}`,
          value: `${Math.round(responsiveValue * 100) / 100}rem`,
          category: 'spacing',
          namespace: 'spacing',
          semanticMeaning: `Responsive spacing ${name} for ${bp} breakpoint`,
          mathRelationship: `(${system === 'linear' ? `${baseUnit} * ${i}` : `${baseUnit} * ${multiplier}^${i - 1}`}) * ${responsiveMultiplier}`,
          scalePosition: i,
          generateUtilityClass: true,
          applicableComponents: ['all'],
          viewportAware: true,
          generatedFrom: name,
        });
        bpIndex++;
      }

      // Container query variants
      let containerIndex = 0;
      for (const container of containerSizes) {
        const containerMultiplier = 0.75 + containerIndex * 0.1875; // 0.75, 0.9375, 1.125, 1.3125, 1.5
        const containerValue = value * containerMultiplier;

        tokens.push({
          name: `@${container}-${name}`,
          value: `${Math.round(containerValue * 100) / 100}rem`,
          category: 'spacing',
          namespace: 'spacing',
          semanticMeaning: `Container-aware spacing ${name} for ${container} container`,
          mathRelationship: `(${system === 'linear' ? `${baseUnit} * ${i}` : `${baseUnit} * ${multiplier}^${i - 1}`}) * ${containerMultiplier}`,
          scalePosition: i,
          generateUtilityClass: true,
          applicableComponents: ['all'],
          containerQueryAware: true,
          generatedFrom: name,
        });
        containerIndex++;
      }
    }
  }

  return tokens;
}

/**
 * Generate depth/shadow scale (z-index and box-shadow)
 */
export function generateDepthScale(
  system: 'linear' | 'exponential' = 'exponential',
  baseMultiplier = 10
): Token[] {
  const tokens: Token[] = [];

  // Shadow tokens with semantic names
  const shadowScale = [
    { name: 'shadow-none', value: 'none', meaning: 'No shadow, flat appearance' },
    {
      name: 'shadow-sm',
      value: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      meaning: 'Subtle depth for cards',
    },
    {
      name: 'shadow-base',
      value: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      meaning: 'Standard card shadow',
    },
    {
      name: 'shadow-md',
      value: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      meaning: 'Elevated components',
    },
    {
      name: 'shadow-lg',
      value: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      meaning: 'Floating elements',
    },
    {
      name: 'shadow-xl',
      value: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      meaning: 'Modal/dialog shadow',
    },
    {
      name: 'shadow-2xl',
      value: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      meaning: 'Maximum elevation',
    },
  ];

  // Semantic z-index layers
  const zLayers = [
    { name: 'z-base', value: 0, meaning: 'Base content layer' },
    { name: 'z-sticky', value: 10, meaning: 'Sticky elements (headers, sidebars)' },
    { name: 'z-dropdown', value: 100, meaning: 'Dropdowns and select menus' },
    { name: 'z-modal', value: 1000, meaning: 'Modal dialogs and overlays' },
    { name: 'z-popover', value: 5000, meaning: 'Popovers and tooltips' },
    { name: 'z-notification', value: 10000, meaning: 'Toast notifications and alerts' },
    { name: 'z-tooltip', value: 50000, meaning: 'Tooltips (highest priority)' },
    { name: 'z-max', value: 2147483647, meaning: 'Maximum z-index value' },
  ];

  // Generate shadow tokens
  let shadowIndex = 0;
  for (const shadow of shadowScale) {
    tokens.push({
      name: shadow.name.replace('shadow-', ''),
      value: shadow.value,
      category: 'shadow',
      namespace: 'shadow',
      semanticMeaning: shadow.meaning,
      scalePosition: shadowIndex,
      generateUtilityClass: true,
      applicableComponents: ['card', 'modal', 'dropdown', 'tooltip', 'popover'],
    });
    shadowIndex++;
  }

  // Generate semantic z-index tokens
  let zLayerIndex = 0;
  for (const layer of zLayers) {
    tokens.push({
      name: layer.name.replace('z-', ''),
      value: layer.value.toString(),
      category: 'z-index',
      namespace: 'z',
      semanticMeaning: layer.meaning,
      scalePosition: zLayerIndex,
      generateUtilityClass: true,
      applicableComponents: layer.name.includes('modal')
        ? ['modal', 'dialog', 'sheet']
        : layer.name.includes('dropdown')
          ? ['dropdown', 'select', 'menu']
          : layer.name.includes('tooltip')
            ? ['tooltip', 'hint']
            : layer.name.includes('notification')
              ? ['toast', 'alert', 'snackbar']
              : ['overlay'],
    });
    zLayerIndex++;
  }

  return tokens;
}

/**
 * Generate height scale for component sizing with responsive variants
 */
export function generateHeightScale(
  system: 'linear' | 'golden' | 'custom' = 'linear',
  baseUnit = 2.5, // rem
  multiplier = 1.25,
  generateResponsive = true
): Token[] {
  const tokens: Token[] = [];
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
  const breakpoints = generateResponsive ? ['sm', 'md', 'lg', 'xl'] : [];
  const containerSizes = generateResponsive ? ['xs', 'sm', 'md', 'lg', 'xl'] : [];

  for (let i = 0; i < sizes.length; i++) {
    let value: number;

    switch (system) {
      case 'linear':
        value = baseUnit + i * 0.5; // 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6
        break;
      case 'golden':
        value = baseUnit * GOLDEN_RATIO ** (i * 0.5);
        break;
      case 'custom':
        value = baseUnit * multiplier ** (i * 0.5);
        break;
    }

    // Base token
    tokens.push({
      name: `h-${sizes[i]}`,
      value: `${Math.round(value * 100) / 100}rem`,
      category: 'height',
      namespace: 'height',
      semanticMeaning: `Component height ${sizes[i]} for ${system} scale`,
      mathRelationship:
        system === 'linear' ? `${baseUnit} + ${i * 0.5}` : `${baseUnit} * ${multiplier}^${i * 0.5}`,
      scalePosition: i,
      touchTargetSize: value * 16, // Convert rem to px for validation
      generateUtilityClass: true,
      applicableComponents: ['button', 'input', 'select', 'card'],
      containerQueryAware: generateResponsive,
      viewportAware: generateResponsive,
    });

    // Responsive variants - heights grow on larger screens
    if (generateResponsive) {
      breakpoints.forEach((bp, bpIndex) => {
        const responsiveMultiplier = 1 + bpIndex * 0.1; // 1, 1.1, 1.2, 1.3, 1.4
        const responsiveValue = value * responsiveMultiplier;

        tokens.push({
          name: `${bp}-h-${sizes[i]}`,
          value: `${Math.round(responsiveValue * 100) / 100}rem`,
          category: 'height',
          namespace: 'height',
          semanticMeaning: `Responsive height ${sizes[i]} for ${bp} breakpoint`,
          mathRelationship: `(${system === 'linear' ? `${baseUnit} + ${i * 0.5}` : `${baseUnit} * ${multiplier}^${i * 0.5}`}) * ${responsiveMultiplier}`,
          scalePosition: i,
          touchTargetSize: responsiveValue * 16,
          generateUtilityClass: true,
          applicableComponents: ['button', 'input', 'select', 'card'],
          viewportAware: true,
          generatedFrom: `h-${sizes[i]}`,
        });
      });

      // Container query variants - adapt to container size
      containerSizes.forEach((container, containerIndex) => {
        const containerMultiplier = 0.8 + containerIndex * 0.1; // 0.8, 0.9, 1.0, 1.1, 1.2
        const containerValue = value * containerMultiplier;

        tokens.push({
          name: `@${container}-h-${sizes[i]}`,
          value: `${Math.round(containerValue * 100) / 100}rem`,
          category: 'height',
          namespace: 'height',
          semanticMeaning: `Container-aware height ${sizes[i]} for ${container} container`,
          mathRelationship: `(${system === 'linear' ? `${baseUnit} + ${i * 0.5}` : `${baseUnit} * ${multiplier}^${i * 0.5}`}) * ${containerMultiplier}`,
          scalePosition: i,
          touchTargetSize: containerValue * 16,
          generateUtilityClass: true,
          applicableComponents: ['button', 'input', 'select', 'card'],
          containerQueryAware: true,
          generatedFrom: `h-${sizes[i]}`,
        });
      });
    }
  }

  return tokens;
}

/**
 * Generate typography scale using golden ratio or musical intervals with responsive variants
 */
export function generateTypographyScale(
  system:
    | 'golden'
    | 'major-second'
    | 'minor-third'
    | 'major-third'
    | 'perfect-fourth'
    | 'perfect-fifth' = 'golden',
  baseSize = 1, // rem
  generateResponsive = true
): Token[] {
  const tokens: Token[] = [];
  const sizes = [
    'xs',
    'sm',
    'base',
    'lg',
    'xl',
    '2xl',
    '3xl',
    '4xl',
    '5xl',
    '6xl',
    '7xl',
    '8xl',
    '9xl',
  ];
  const breakpoints = generateResponsive ? ['sm', 'md', 'lg', 'xl'] : [];
  const containerSizes = generateResponsive ? ['xs', 'sm', 'md', 'lg', 'xl'] : [];

  let ratio: number;
  switch (system) {
    case 'golden':
      ratio = GOLDEN_RATIO;
      break;
    case 'major-second':
      ratio = MAJOR_SECOND;
      break;
    case 'minor-third':
      ratio = MINOR_THIRD;
      break;
    case 'major-third':
      ratio = MAJOR_THIRD;
      break;
    case 'perfect-fourth':
      ratio = PERFECT_FOURTH;
      break;
    case 'perfect-fifth':
      ratio = PERFECT_FIFTH;
      break;
  }

  // Start from base (index 2), go down for xs/sm, up for lg+
  for (let i = 0; i < sizes.length; i++) {
    const steps = i - 2; // -2, -1, 0, 1, 2, 3, 4, 5, 6, 7
    const value = baseSize * ratio ** steps;

    // Base font size token
    tokens.push({
      name: `text-${sizes[i]}`,
      value: `${Math.round(value * 1000) / 1000}rem`,
      category: 'font-size',
      namespace: 'font-size',
      semanticMeaning: `Typography size ${sizes[i]} using ${system} ratio`,
      mathRelationship: `${baseSize} * ${ratio}^${steps}`,
      scalePosition: i,
      generateUtilityClass: true,
      applicableComponents: ['text', 'heading', 'label', 'button'],
      containerQueryAware: generateResponsive,
      viewportAware: generateResponsive,
    });

    // Responsive font size variants - typography scales up on larger screens
    if (generateResponsive) {
      breakpoints.forEach((bp, bpIndex) => {
        const responsiveMultiplier = 1 + bpIndex * 0.1; // 1, 1.1, 1.2, 1.3, 1.4
        const responsiveValue = value * responsiveMultiplier;

        tokens.push({
          name: `${bp}-text-${sizes[i]}`,
          value: `${Math.round(responsiveValue * 1000) / 1000}rem`,
          category: 'font-size',
          namespace: 'font-size',
          semanticMeaning: `Responsive typography ${sizes[i]} for ${bp} breakpoint`,
          mathRelationship: `(${baseSize} * ${ratio}^${steps}) * ${responsiveMultiplier}`,
          scalePosition: i,
          generateUtilityClass: true,
          applicableComponents: ['text', 'heading', 'label', 'button'],
          viewportAware: true,
          generatedFrom: `text-${sizes[i]}`,
        });
      });

      // Container query variants - typography adapts to container width
      containerSizes.forEach((container, containerIndex) => {
        const containerMultiplier = 0.85 + containerIndex * 0.075; // 0.85, 0.925, 1.0, 1.075, 1.15
        const containerValue = value * containerMultiplier;

        tokens.push({
          name: `@${container}-text-${sizes[i]}`,
          value: `${Math.round(containerValue * 1000) / 1000}rem`,
          category: 'font-size',
          namespace: 'font-size',
          semanticMeaning: `Container-aware typography ${sizes[i]} for ${container} container`,
          mathRelationship: `(${baseSize} * ${ratio}^${steps}) * ${containerMultiplier}`,
          scalePosition: i,
          generateUtilityClass: true,
          applicableComponents: ['text', 'heading', 'label', 'button'],
          containerQueryAware: true,
          generatedFrom: `text-${sizes[i]}`,
        });
      });
    }

    // Base line height token
    const fontSize = value;
    const lineHeight = fontSize < 1 ? 1.6 : fontSize > 2 ? 1.2 : 1.5;

    tokens.push({
      name: `leading-${sizes[i]}`,
      value: lineHeight.toString(),
      category: 'line-height',
      namespace: 'line-height',
      semanticMeaning: `Line height optimized for ${sizes[i]} text`,
      pairedWith: [`text-${sizes[i]}`],
      generateUtilityClass: true,
      applicableComponents: ['text', 'heading', 'paragraph'],
    });
  }

  return tokens;
}

/**
 * Generate comprehensive color tokens with semantic meaning
 */
export function generateColorTokens(): Token[] {
  const tokens: Token[] = [];

  const colorScale = [
    {
      name: 'primary',
      light: 'oklch(0.45 0.12 240)',
      dark: 'oklch(0.8 0.05 240)',
      meaning: 'Primary brand color for main actions',
    },
    {
      name: 'primary-foreground',
      light: 'oklch(0.98 0.002 240)',
      dark: 'oklch(0.1 0 0)',
      meaning: 'Text on primary background',
    },
    {
      name: 'secondary',
      light: 'oklch(0.35 0.08 240)',
      dark: 'oklch(0.15 0 0)',
      meaning: 'Secondary actions and elements',
    },
    {
      name: 'secondary-foreground',
      light: 'oklch(0.95 0.005 240)',
      dark: 'oklch(0.9 0 0)',
      meaning: 'Text on secondary background',
    },
    {
      name: 'accent',
      light: 'oklch(0.45 0.1 270)',
      dark: 'oklch(0.7 0.08 270)',
      meaning: 'Accent color for highlights',
    },
    {
      name: 'accent-foreground',
      light: 'oklch(0.98 0.002 270)',
      dark: 'oklch(0.1 0 0)',
      meaning: 'Text on accent background',
    },
    {
      name: 'info',
      light: 'oklch(0.45 0.1 210)',
      dark: 'oklch(0.7 0.08 210)',
      meaning: 'Informational states and messages',
    },
    {
      name: 'info-foreground',
      light: 'oklch(0.98 0.002 210)',
      dark: 'oklch(0.1 0 0)',
      meaning: 'Text on info background',
    },
    {
      name: 'success',
      light: 'oklch(0.45 0.1 150)',
      dark: 'oklch(0.7 0.08 150)',
      meaning: 'Success states and confirmations',
    },
    {
      name: 'success-foreground',
      light: 'oklch(0.98 0.002 150)',
      dark: 'oklch(0.1 0 0)',
      meaning: 'Text on success background',
    },
    {
      name: 'warning',
      light: 'oklch(0.55 0.12 60)',
      dark: 'oklch(0.65 0.1 60)',
      meaning: 'Warning states and cautions',
    },
    {
      name: 'warning-foreground',
      light: 'oklch(0.15 0.02 60)',
      dark: 'oklch(0.1 0 0)',
      meaning: 'Text on warning background',
    },
    {
      name: 'destructive',
      light: 'oklch(0.4 0.15 20)',
      dark: 'oklch(0.5 0.2 20)',
      meaning: 'Destructive actions and errors',
    },
    {
      name: 'destructive-foreground',
      light: 'oklch(0.98 0.002 20)',
      dark: 'oklch(0.98 0.002 20)',
      meaning: 'Text on destructive background',
    },
    {
      name: 'highlight',
      light: 'oklch(0.55 0.15 90)',
      dark: 'oklch(0.6 0.12 90)',
      meaning: 'Text highlighting and selection',
    },
    {
      name: 'highlight-foreground',
      light: 'oklch(0.15 0.02 90)',
      dark: 'oklch(0.1 0 0)',
      meaning: 'Text on highlight background',
    },
    {
      name: 'background',
      light: 'oklch(1 0 0)',
      dark: 'oklch(0.09 0 0)',
      meaning: 'Main background color',
    },
    {
      name: 'foreground',
      light: 'oklch(0.15 0.005 240)',
      dark: 'oklch(0.95 0 0)',
      meaning: 'Main text color',
    },
    {
      name: 'muted',
      light: 'oklch(0.96 0.005 240)',
      dark: 'oklch(0.15 0 0)',
      meaning: 'Muted background for secondary content',
    },
    {
      name: 'muted-foreground',
      light: 'oklch(0.45 0.02 240)',
      dark: 'oklch(0.65 0 0)',
      meaning: 'Muted text color',
    },
    {
      name: 'border',
      light: 'oklch(0.88 0.02 240)',
      dark: 'oklch(0.27 0 0)',
      meaning: 'Border color for components',
    },
    {
      name: 'input',
      light: 'oklch(0.88 0.02 240)',
      dark: 'oklch(0.27 0 0)',
      meaning: 'Input field borders',
    },
    {
      name: 'ring',
      light: 'oklch(0.45 0.12 240)',
      dark: 'oklch(0.8 0.05 240)',
      meaning: 'Focus ring color',
    },
    {
      name: 'card',
      light: 'oklch(1 0 0)',
      dark: 'oklch(0.09 0 0)',
      meaning: 'Card background color',
    },
    {
      name: 'card-foreground',
      light: 'oklch(0.15 0.005 240)',
      dark: 'oklch(0.95 0 0)',
      meaning: 'Text on card background',
    },
    {
      name: 'popover',
      light: 'oklch(1 0 0)',
      dark: 'oklch(0.09 0 0)',
      meaning: 'Popover background color',
    },
    {
      name: 'popover-foreground',
      light: 'oklch(0.15 0.005 240)',
      dark: 'oklch(0.95 0 0)',
      meaning: 'Text on popover background',
    },
  ];

  let index = 0;
  for (const color of colorScale) {
    tokens.push({
      name: color.name,
      value: color.light,
      darkValue: color.dark,
      category: 'color',
      namespace: 'color',
      semanticMeaning: color.meaning,
      scalePosition: index,
      generateUtilityClass: true,
      applicableComponents: color.name.includes('primary')
        ? ['button', 'link', 'badge']
        : color.name.includes('destructive')
          ? ['button', 'alert', 'badge']
          : color.name.includes('success')
            ? ['button', 'alert', 'badge', 'icon']
            : color.name.includes('background')
              ? ['body', 'card', 'modal']
              : color.name.includes('card')
                ? ['card']
                : color.name.includes('popover')
                  ? ['popover', 'tooltip', 'dropdown']
                  : ['all'],
      trustLevel: color.name.includes('destructive')
        ? 'critical'
        : color.name.includes('primary')
          ? 'high'
          : color.name.includes('warning')
            ? 'medium'
            : 'low',
      cognitiveLoad: color.name.includes('destructive')
        ? 8
        : color.name.includes('warning')
          ? 6
          : color.name.includes('primary')
            ? 4
            : 2,
    });
    index++;
  }

  return tokens;
}

/**
 * Generate border radius tokens for component styling
 */
export function generateBorderRadiusTokens(): Token[] {
  const tokens: Token[] = [];

  const radiusScale = [
    { name: 'none', value: '0', meaning: 'No border radius, sharp corners' },
    { name: 'sm', value: '0.125rem', meaning: 'Small radius for subtle rounding' },
    { name: 'base', value: '0.25rem', meaning: 'Default radius for most components' },
    { name: 'md', value: '0.375rem', meaning: 'Medium radius for cards and panels' },
    { name: 'lg', value: '0.5rem', meaning: 'Large radius for prominent elements' },
    { name: 'xl', value: '0.75rem', meaning: 'Extra large radius for hero elements' },
    { name: '2xl', value: '1rem', meaning: 'Maximum standard radius' },
    { name: '3xl', value: '1.5rem', meaning: 'Very large radius for special cases' },
    { name: 'full', value: '9999px', meaning: 'Fully rounded (pills, avatars)' },
  ];

  radiusScale.forEach((radius, index) => {
    tokens.push({
      name: radius.name,
      value: radius.value,
      category: 'border-radius',
      namespace: 'radius',
      semanticMeaning: radius.meaning,
      scalePosition: index,
      generateUtilityClass: true,
      applicableComponents: ['button', 'input', 'card', 'modal', 'badge', 'avatar'],
    });
  });

  return tokens;
}

/**
 * Generate motion and timing tokens for animations
 */
export function generateMotionTokens(): Token[] {
  const tokens: Token[] = [];

  // Duration tokens
  const durations = [
    {
      name: 'instant',
      value: '75ms',
      meaning: 'Instant feedback for immediate response',
      cognitive: 1,
    },
    {
      name: 'fast',
      value: '150ms',
      meaning: 'Fast animations for interactive elements',
      cognitive: 2,
    },
    {
      name: 'standard',
      value: '300ms',
      meaning: 'Standard duration for most transitions',
      cognitive: 3,
    },
    {
      name: 'deliberate',
      value: '500ms',
      meaning: 'Deliberate timing for important changes',
      cognitive: 5,
    },
    { name: 'slow', value: '700ms', meaning: 'Slow transitions for large changes', cognitive: 7 },
    { name: 'dramatic', value: '1000ms', meaning: 'Dramatic timing for emphasis', cognitive: 9 },
  ];

  durations.forEach((duration, index) => {
    tokens.push({
      name: duration.name,
      value: duration.value,
      category: 'motion',
      namespace: 'duration',
      semanticMeaning: duration.meaning,
      scalePosition: index,
      cognitiveLoad: duration.cognitive,
      reducedMotionAware: true,
      motionDuration: Number.parseInt(duration.value),
      generateUtilityClass: true,
      applicableComponents: ['all'],
    });
  });

  // Easing tokens
  const easings = [
    { name: 'linear', value: 'linear', meaning: 'Linear timing for mechanical movement' },
    { name: 'smooth', value: 'ease-in-out', meaning: 'Smooth natural movement' },
    { name: 'accelerating', value: 'ease-out', meaning: 'Welcoming entrance animation' },
    { name: 'decelerating', value: 'ease-in', meaning: 'Graceful exit animation' },
    {
      name: 'bouncy',
      value: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      meaning: 'Playful bounce for celebrations',
    },
    {
      name: 'snappy',
      value: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      meaning: 'Sharp responsive feedback',
    },
  ];

  easings.forEach((easing, index) => {
    tokens.push({
      name: easing.name,
      value: easing.value,
      category: 'easing',
      namespace: 'ease',
      semanticMeaning: easing.meaning,
      scalePosition: index,
      generateUtilityClass: true,
      applicableComponents: ['all'],
    });
  });

  return tokens;
}

/**
 * Generate opacity tokens for layering and states
 */
export function generateOpacityTokens(): Token[] {
  const tokens: Token[] = [];

  const opacityScale = [
    { name: 'disabled', value: '0.5', meaning: 'Disabled state opacity' },
    { name: 'loading', value: '0.7', meaning: 'Loading state opacity' },
    { name: 'overlay', value: '0.8', meaning: 'Modal overlay background' },
    { name: 'backdrop', value: '0.25', meaning: 'Subtle backdrop opacity' },
    { name: 'hover', value: '0.9', meaning: 'Hover state opacity' },
    { name: 'focus', value: '1', meaning: 'Focus state (full opacity)' },
  ];

  opacityScale.forEach((opacity, index) => {
    tokens.push({
      name: opacity.name,
      value: opacity.value,
      category: 'opacity',
      namespace: 'opacity',
      semanticMeaning: opacity.meaning,
      scalePosition: index,
      generateUtilityClass: true,
      applicableComponents: opacity.name.includes('disabled')
        ? ['button', 'input', 'text']
        : opacity.name.includes('overlay')
          ? ['modal', 'dialog']
          : ['all'],
      interactionType: opacity.name.includes('hover')
        ? 'hover'
        : opacity.name.includes('focus')
          ? 'focus'
          : opacity.name.includes('disabled')
            ? 'disabled'
            : opacity.name.includes('loading')
              ? 'loading'
              : undefined,
    });
  });

  return tokens;
}

/**
 * Generate font family tokens
 */
export function generateFontFamilyTokens(): Token[] {
  const tokens: Token[] = [];

  const fontFamilies = [
    {
      name: 'sans',
      value: '"Inter", system-ui, sans-serif',
      meaning: 'Primary sans-serif for UI and body text',
    },
    {
      name: 'serif',
      value: '"Crimson Text", Georgia, serif',
      meaning: 'Serif font for editorial content',
    },
    {
      name: 'mono',
      value: '"JetBrains Mono", "Fira Code", monospace',
      meaning: 'Monospace font for code and data',
    },
    {
      name: 'display',
      value: '"Inter Display", system-ui, sans-serif',
      meaning: 'Display font for headings and marketing',
    },
  ];

  fontFamilies.forEach((font, index) => {
    tokens.push({
      name: font.name,
      value: font.value,
      category: 'font-family',
      namespace: 'font',
      semanticMeaning: font.meaning,
      scalePosition: index,
      generateUtilityClass: true,
      applicableComponents:
        font.name === 'mono'
          ? ['code', 'pre', 'kbd']
          : font.name === 'display'
            ? ['h1', 'h2', 'hero']
            : font.name === 'serif'
              ? ['article', 'blog']
              : ['all'],
    });
  });

  return tokens;
}

/**
 * Generate font weight tokens
 */
export function generateFontWeightTokens(): Token[] {
  const tokens: Token[] = [];

  const weights = [
    { name: 'thin', value: '100', meaning: 'Thin weight for delicate text' },
    { name: 'extralight', value: '200', meaning: 'Extra light weight' },
    { name: 'light', value: '300', meaning: 'Light weight for subtle text' },
    { name: 'normal', value: '400', meaning: 'Normal weight for body text' },
    { name: 'medium', value: '500', meaning: 'Medium weight for emphasis' },
    { name: 'semibold', value: '600', meaning: 'Semi-bold for subheadings' },
    { name: 'bold', value: '700', meaning: 'Bold for headings and emphasis' },
    { name: 'extrabold', value: '800', meaning: 'Extra bold for strong emphasis' },
    { name: 'black', value: '900', meaning: 'Black weight for maximum impact' },
  ];

  weights.forEach((weight, index) => {
    tokens.push({
      name: weight.name,
      value: weight.value,
      category: 'font-weight',
      namespace: 'font-weight',
      semanticMeaning: weight.meaning,
      scalePosition: index,
      generateUtilityClass: true,
      applicableComponents:
        weight.name === 'bold'
          ? ['h1', 'h2', 'h3', 'strong']
          : weight.name === 'normal'
            ? ['p', 'span', 'body']
            : ['text'],
    });
  });

  return tokens;
}

/**
 * Generate letter spacing tokens
 */
export function generateLetterSpacingTokens(): Token[] {
  const tokens: Token[] = [];

  const spacings = [
    { name: 'tighter', value: '-0.05em', meaning: 'Tighter letter spacing for large text' },
    { name: 'tight', value: '-0.025em', meaning: 'Slightly tighter spacing' },
    { name: 'normal', value: '0em', meaning: 'Normal letter spacing' },
    { name: 'wide', value: '0.025em', meaning: 'Wider spacing for readability' },
    { name: 'wider', value: '0.05em', meaning: 'Wide spacing for emphasis' },
    { name: 'widest', value: '0.1em', meaning: 'Maximum spacing for display text' },
  ];

  spacings.forEach((spacing, index) => {
    tokens.push({
      name: spacing.name,
      value: spacing.value,
      category: 'letter-spacing',
      namespace: 'tracking',
      semanticMeaning: spacing.meaning,
      scalePosition: index,
      generateUtilityClass: true,
      applicableComponents: spacing.name.includes('wide')
        ? ['h1', 'h2', 'display']
        : spacing.name.includes('tight')
          ? ['body', 'caption']
          : ['text'],
    });
  });

  return tokens;
}

/**
 * Generate breakpoint and container tokens
 */
export function generateBreakpointTokens(): Token[] {
  const tokens: Token[] = [];

  const breakpoints = [
    { name: 'xs', value: '320px', meaning: 'Extra small mobile devices' },
    { name: 'sm', value: '640px', meaning: 'Small tablets and large phones' },
    { name: 'md', value: '768px', meaning: 'Medium tablets' },
    { name: 'lg', value: '1024px', meaning: 'Large tablets and small laptops' },
    { name: 'xl', value: '1280px', meaning: 'Large laptops and desktops' },
    { name: '2xl', value: '1536px', meaning: 'Large desktops and ultrawide' },
  ];

  breakpoints.forEach((bp, index) => {
    tokens.push({
      name: bp.name,
      value: bp.value,
      category: 'breakpoint',
      namespace: 'screen',
      semanticMeaning: bp.meaning,
      scalePosition: index,
      generateUtilityClass: false, // Breakpoints are used differently
      applicableComponents: ['layout', 'grid', 'responsive'],
      viewportAware: true,
    });
  });

  // Container tokens
  const containers = [
    { name: 'xs', value: '20rem', meaning: 'Extra small container (320px)' },
    { name: 'sm', value: '24rem', meaning: 'Small container (384px)' },
    { name: 'md', value: '28rem', meaning: 'Medium container (448px)' },
    { name: 'lg', value: '32rem', meaning: 'Large container (512px)' },
    { name: 'xl', value: '36rem', meaning: 'Extra large container (576px)' },
    { name: '2xl', value: '42rem', meaning: 'Max width container (672px)' },
    { name: '3xl', value: '48rem', meaning: 'Ultra wide container (768px)' },
    { name: '4xl', value: '56rem', meaning: 'Maximum container (896px)' },
  ];

  containers.forEach((container, index) => {
    tokens.push({
      name: container.name,
      value: container.value,
      category: 'container',
      namespace: 'container',
      semanticMeaning: container.meaning,
      scalePosition: index,
      generateUtilityClass: true,
      applicableComponents: ['layout', 'wrapper', 'max-width'],
      containerQueryAware: true,
    });
  });

  return tokens;
}

/**
 * Generate aspect ratio tokens
 */
export function generateAspectRatioTokens(): Token[] {
  const tokens: Token[] = [];

  const ratios = [
    { name: 'square', value: '1 / 1', meaning: 'Square aspect ratio for avatars and icons' },
    { name: 'video', value: '16 / 9', meaning: 'Video aspect ratio for media content' },
    { name: 'photo', value: '4 / 3', meaning: 'Photo aspect ratio for images' },
    { name: 'golden', value: '1.618 / 1', meaning: 'Golden ratio for aesthetic layouts' },
    { name: 'portrait', value: '3 / 4', meaning: 'Portrait orientation' },
    { name: 'landscape', value: '4 / 3', meaning: 'Landscape orientation' },
    { name: 'ultrawide', value: '21 / 9', meaning: 'Ultrawide aspect ratio' },
  ];

  ratios.forEach((ratio, index) => {
    tokens.push({
      name: ratio.name,
      value: ratio.value,
      category: 'aspect-ratio',
      namespace: 'aspect',
      semanticMeaning: ratio.meaning,
      scalePosition: index,
      generateUtilityClass: true,
      applicableComponents: ratio.name.includes('video')
        ? ['video', 'iframe', 'embed']
        : ratio.name.includes('square')
          ? ['avatar', 'icon', 'logo']
          : ratio.name.includes('photo')
            ? ['img', 'figure']
            : ['media'],
    });
  });

  return tokens;
}

/**
 * Generate grid layout tokens for CSS Grid systems
 */
export function generateGridTokens(): Token[] {
  const tokens: Token[] = [];

  // Grid template columns
  const gridColumns = [
    {
      name: 'auto-fit-sm',
      value: 'repeat(auto-fit, minmax(200px, 1fr))',
      meaning: 'Auto-fit grid for small cards',
    },
    {
      name: 'auto-fit-md',
      value: 'repeat(auto-fit, minmax(280px, 1fr))',
      meaning: 'Auto-fit grid for medium cards',
    },
    {
      name: 'auto-fit-lg',
      value: 'repeat(auto-fit, minmax(360px, 1fr))',
      meaning: 'Auto-fit grid for large cards',
    },
    {
      name: 'auto-fill-sm',
      value: 'repeat(auto-fill, minmax(200px, 1fr))',
      meaning: 'Auto-fill grid for small items',
    },
    {
      name: 'auto-fill-md',
      value: 'repeat(auto-fill, minmax(280px, 1fr))',
      meaning: 'Auto-fill grid for medium items',
    },
    {
      name: 'auto-fill-lg',
      value: 'repeat(auto-fill, minmax(360px, 1fr))',
      meaning: 'Auto-fill grid for large items',
    },
    { name: '2-cols', value: 'repeat(2, 1fr)', meaning: 'Two equal columns' },
    { name: '3-cols', value: 'repeat(3, 1fr)', meaning: 'Three equal columns' },
    { name: '4-cols', value: 'repeat(4, 1fr)', meaning: 'Four equal columns' },
    { name: '12-cols', value: 'repeat(12, 1fr)', meaning: 'Twelve column layout system' },
    { name: 'sidebar', value: '250px 1fr', meaning: 'Sidebar with main content' },
    { name: 'main-sidebar', value: '1fr 250px', meaning: 'Main content with sidebar' },
  ];

  gridColumns.forEach((grid, index) => {
    tokens.push({
      name: grid.name,
      value: grid.value,
      category: 'grid-template-columns',
      namespace: 'grid-cols',
      semanticMeaning: grid.meaning,
      scalePosition: index,
      generateUtilityClass: true,
      applicableComponents: ['grid', 'layout', 'card-grid', 'dashboard'],
    });
  });

  // Grid template rows
  const gridRows = [
    { name: 'auto', value: 'auto', meaning: 'Auto-sizing rows' },
    {
      name: 'header-main-footer',
      value: 'auto 1fr auto',
      meaning: 'Header, main content, footer layout',
    },
    { name: 'equal-2', value: 'repeat(2, 1fr)', meaning: 'Two equal rows' },
    { name: 'equal-3', value: 'repeat(3, 1fr)', meaning: 'Three equal rows' },
    { name: 'masonry', value: 'masonry', meaning: 'Masonry layout rows' },
  ];

  gridRows.forEach((grid, index) => {
    tokens.push({
      name: grid.name,
      value: grid.value,
      category: 'grid-template-rows',
      namespace: 'grid-rows',
      semanticMeaning: grid.meaning,
      scalePosition: index,
      generateUtilityClass: true,
      applicableComponents: ['grid', 'layout', 'card-grid'],
    });
  });

  return tokens;
}

/**
 * Generate transform tokens for animations and interactions
 */
export function generateTransformTokens(): Token[] {
  const tokens: Token[] = [];

  // Scale transforms
  const scaleTokens = [
    {
      name: 'hover',
      value: '1.02',
      meaning: 'Subtle hover scale for interactive elements',
      cognitive: 2,
    },
    { name: 'active', value: '0.98', meaning: 'Active/pressed scale for buttons', cognitive: 1 },
    { name: 'focus', value: '1.05', meaning: 'Focus scale for accessibility', cognitive: 3 },
    { name: 'disabled', value: '0.95', meaning: 'Disabled state scale', cognitive: 1 },
    {
      name: 'emphasis',
      value: '1.1',
      meaning: 'Emphasis scale for important elements',
      cognitive: 4,
    },
    { name: 'dramatic', value: '1.25', meaning: 'Dramatic scale for animations', cognitive: 7 },
  ];

  scaleTokens.forEach((scale, index) => {
    tokens.push({
      name: scale.name,
      value: scale.value,
      category: 'scale',
      namespace: 'scale',
      semanticMeaning: scale.meaning,
      scalePosition: index,
      cognitiveLoad: scale.cognitive,
      generateUtilityClass: true,
      applicableComponents: ['button', 'card', 'interactive'],
      interactionType:
        scale.name === 'hover'
          ? 'hover'
          : scale.name === 'active'
            ? 'active'
            : scale.name === 'focus'
              ? 'focus'
              : scale.name === 'disabled'
                ? 'disabled'
                : undefined,
    });
  });

  // Translate transforms
  const translateTokens = [
    { name: 'center', value: '-50%', meaning: 'Center positioning transform' },
    { name: 'center-x', value: '-50%, 0', meaning: 'Center horizontally' },
    { name: 'center-y', value: '0, -50%', meaning: 'Center vertically' },
    { name: 'slide-up', value: '0, -100%', meaning: 'Slide up animation' },
    { name: 'slide-down', value: '0, 100%', meaning: 'Slide down animation' },
    { name: 'slide-left', value: '-100%, 0', meaning: 'Slide left animation' },
    { name: 'slide-right', value: '100%, 0', meaning: 'Slide right animation' },
  ];

  translateTokens.forEach((translate, index) => {
    tokens.push({
      name: translate.name,
      value: translate.value,
      category: 'translate',
      namespace: 'translate',
      semanticMeaning: translate.meaning,
      scalePosition: index,
      generateUtilityClass: true,
      applicableComponents: ['modal', 'dialog', 'tooltip', 'animations'],
    });
  });

  // Rotate transforms
  const rotateTokens = [
    { name: 'flip', value: '180deg', meaning: 'Flip rotation for icons and arrows' },
    { name: 'quarter', value: '90deg', meaning: 'Quarter turn rotation' },
    { name: 'half', value: '180deg', meaning: 'Half turn rotation' },
    { name: 'three-quarter', value: '270deg', meaning: 'Three quarter turn rotation' },
  ];

  rotateTokens.forEach((rotate, index) => {
    tokens.push({
      name: rotate.name,
      value: rotate.value,
      category: 'rotate',
      namespace: 'rotate',
      semanticMeaning: rotate.meaning,
      scalePosition: index,
      generateUtilityClass: true,
      applicableComponents: ['icon', 'arrow', 'dropdown'],
    });
  });

  return tokens;
}

/**
 * Generate width tokens for component sizing
 */
export function generateWidthTokens(): Token[] {
  const tokens: Token[] = [];

  const widthScale = [
    { name: 'min', value: 'min-content', meaning: 'Minimum content width' },
    { name: 'max', value: 'max-content', meaning: 'Maximum content width' },
    { name: 'fit', value: 'fit-content', meaning: 'Fit content width' },
    { name: 'full', value: '100%', meaning: 'Full width' },
    { name: 'screen', value: '100vw', meaning: 'Full viewport width' },
    { name: 'prose', value: '65ch', meaning: 'Optimal reading width' },
    { name: 'dialog-sm', value: '320px', meaning: 'Small dialog width' },
    { name: 'dialog-md', value: '480px', meaning: 'Medium dialog width' },
    { name: 'dialog-lg', value: '640px', meaning: 'Large dialog width' },
    { name: 'dialog-xl', value: '800px', meaning: 'Extra large dialog width' },
    { name: 'sidebar', value: '280px', meaning: 'Standard sidebar width' },
    { name: 'sidebar-sm', value: '240px', meaning: 'Compact sidebar width' },
    { name: 'sidebar-lg', value: '320px', meaning: 'Wide sidebar width' },
  ];

  widthScale.forEach((width, index) => {
    tokens.push({
      name: width.name,
      value: width.value,
      category: 'width',
      namespace: 'w',
      semanticMeaning: width.meaning,
      scalePosition: index,
      generateUtilityClass: true,
      applicableComponents: width.name.includes('dialog')
        ? ['dialog', 'modal']
        : width.name.includes('sidebar')
          ? ['sidebar', 'navigation']
          : width.name === 'prose'
            ? ['content', 'article']
            : ['layout'],
    });
  });

  return tokens;
}

/**
 * Generate backdrop filter tokens (maps to TW backdrop-blur utilities)
 */
export function generateBackdropTokens(): Token[] {
  const tokens: Token[] = [];

  // Tailwind's actual backdrop-blur scale (mathematical progression)
  const backdropBlurScale = [
    { name: 'none', value: '0', meaning: 'No backdrop blur' },
    { name: 'sm', value: '4px', meaning: 'Small backdrop blur for overlays' },
    { name: 'DEFAULT', value: '8px', meaning: 'Default backdrop blur for modals' },
    { name: 'md', value: '12px', meaning: 'Medium backdrop blur for focus' },
    { name: 'lg', value: '16px', meaning: 'Large backdrop blur for separation' },
    { name: 'xl', value: '24px', meaning: 'Extra large blur for drama' },
    { name: '2xl', value: '40px', meaning: 'Maximum blur for strong effects' },
    { name: '3xl', value: '64px', meaning: 'Ultra blur for artistic effects' },
  ];

  backdropBlurScale.forEach((blur, index) => {
    tokens.push({
      name: blur.name,
      value: blur.value,
      category: 'backdrop-blur',
      namespace: 'backdrop-blur',
      semanticMeaning: blur.meaning,
      scalePosition: index,
      mathRelationship: blur.value === '0' ? 'No blur' : `blur(${blur.value})`,
      generateUtilityClass: true,
      applicableComponents: ['modal', 'dialog', 'overlay', 'backdrop'],
    });
  });

  return tokens;
}

/**
 * Generate border width tokens (maps to TW border-{width} utilities)
 */
export function generateBorderWidthTokens(): Token[] {
  const tokens: Token[] = [];

  // Tailwind's actual border width scale (mathematical progression)
  const borderScale = [
    { name: '0', value: '0px', meaning: 'No border' },
    { name: 'DEFAULT', value: '1px', meaning: 'Default border width' },
    { name: '2', value: '2px', meaning: 'Medium border for emphasis' },
    { name: '4', value: '4px', meaning: 'Thick border for strong emphasis' },
    { name: '8', value: '8px', meaning: 'Extra thick decorative border' },
  ];

  borderScale.forEach((border, index) => {
    tokens.push({
      name: border.name,
      value: border.value,
      category: 'border-width',
      namespace: 'border',
      semanticMeaning: border.meaning,
      scalePosition: index,
      mathRelationship:
        border.value === '0px'
          ? 'No border'
          : `${border.value} (${Number.parseInt(border.value)}x pixel)`,
      generateUtilityClass: true,
      applicableComponents:
        Number.parseInt(border.value) <= 2
          ? ['input', 'card', 'button']
          : ['decorative', 'emphasis'],
      trustLevel:
        border.value === '0px' ? 'low' : Number.parseInt(border.value) >= 4 ? 'medium' : 'low',
    });
  });

  return tokens;
}

/**
 * Generate touch target and interaction tokens
 */
export function generateTouchTargetTokens(): Token[] {
  const tokens: Token[] = [];

  const touchTargets = [
    { name: 'min', value: '44px', meaning: 'WCAG AAA minimum touch target', size: 44 },
    { name: 'comfortable', value: '48px', meaning: 'Comfortable touch target', size: 48 },
    {
      name: 'generous',
      value: '56px',
      meaning: 'Generous touch target for accessibility',
      size: 56,
    },
    { name: 'large', value: '64px', meaning: 'Large touch target for primary actions', size: 64 },
  ];

  touchTargets.forEach((target, index) => {
    tokens.push({
      name: target.name,
      value: target.value,
      category: 'touch-target',
      namespace: 'touch',
      semanticMeaning: target.meaning,
      scalePosition: index,
      touchTargetSize: target.size,
      accessibilityLevel: target.name === 'min' ? 'AAA' : 'AA',
      generateUtilityClass: true,
      applicableComponents: ['button', 'link', 'interactive', 'icon-button'],
    });
  });

  return tokens;
}

export const exportTokens = (designSystem: DesignSystem, format: 'tw' | 'css' | 'json'): string => {
  // Validate tokens before export
  try {
    for (const token of designSystem.tokens) {
      TokenSchema.parse(token);
    }
  } catch (error) {
    throw new Error(
      `Token validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  switch (format) {
    case 'json':
      return JSON.stringify(designSystem, null, 2);

    case 'css':
      return generateCssCustomProperties(designSystem);

    case 'tw':
      return generateTailwindStylesheet(designSystem);

    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};

/**
 * Generate CSS custom properties format
 */
function generateCssCustomProperties(designSystem: DesignSystem): string {
  const lightTokens: string[] = [];
  const darkTokens: string[] = [];

  for (const token of designSystem.tokens) {
    const cssVar = `--${token.namespace}-${token.name}: ${token.value};`;
    lightTokens.push(cssVar);

    if (token.darkValue) {
      const darkVar = `--${token.namespace}-${token.name}: ${token.darkValue};`;
      darkTokens.push(darkVar);
    }
  }

  let css = ':root {\n';
  css += lightTokens.map((token) => `  ${token}`).join('\n');
  css += '\n}\n';

  if (darkTokens.length > 0) {
    css += '\n[data-theme="dark"] {\n';
    css += darkTokens.map((token) => `  ${token}`).join('\n');
    css += '\n}\n';
  }

  return css;
}

/**
 * Generate Tailwind CSS v4 stylesheet (complex implementation)
 */
function generateTailwindStylesheet(designSystem: DesignSystem): string {
  const header = `/**
 * Generated Tailwind CSS v4 Stylesheet
 * 
 * Design System: ${designSystem.name}
 * Generated: ${new Date().toISOString()}
 * DO NOT EDIT MANUALLY - Changes will be overwritten
 */

@import "tailwindcss";

@theme {`;

  const lightTokens: string[] = [];
  const darkTokens: string[] = [];
  const motionTokens: string[] = [];
  const containerQueries: string[] = [];

  for (const token of designSystem.tokens) {
    const cssVar = `  --${token.namespace}-${token.name}: ${token.value};`;
    lightTokens.push(cssVar);

    if (token.darkValue) {
      const darkVar = `  --${token.namespace}-${token.name}: ${token.darkValue};`;
      darkTokens.push(darkVar);
    }

    // Handle reduced motion for motion tokens
    if (token.category === 'motion' && token.reducedMotionAware) {
      motionTokens.push(
        `  --${token.namespace}-${token.name}: ${token.motionDuration === 0 ? '0ms' : token.value};`
      );
    }

    // In Tailwind v4, spacing utilities are automatically generated from --spacing
    // No need to manually create @utility classes for spacing

    // Handle container queries for container-aware tokens
    if (token.containerQueryAware) {
      containerQueries.push(
        `@container (min-width: 768px) { .container-${token.name} { --value: var(--${token.namespace}-${token.name}); } }`
      );
    }
  }

  let stylesheet = `${header}\n`;
  stylesheet += lightTokens.join('\n');
  stylesheet += '\n}\n';

  // Dark theme
  if (darkTokens.length > 0) {
    stylesheet += '\n@media (prefers-color-scheme: dark) {\n  @theme {\n';
    stylesheet += darkTokens.join('\n');
    stylesheet += '\n  }\n}\n';
  }

  // Reduced motion
  if (motionTokens.length > 0) {
    stylesheet += '\n@media (prefers-reduced-motion: reduce) {\n  @theme {\n';
    stylesheet += motionTokens
      .map((token) => token.replace(token.split(': ')[1], '0ms;'))
      .join('\n');
    stylesheet += '\n  }\n}\n';
  }

  // In Tailwind v4, most utilities are automatically generated from theme variables
  // Only add custom utilities if there are any (which there shouldn't be for standard tokens)

  // Container queries
  if (containerQueries.length > 0) {
    stylesheet += '\n/* Container Queries */\n';
    stylesheet += `${containerQueries.join('\n')}\n`;
  }

  return stylesheet;
}

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
export const checkTailwindVersion = async (cwd: string): Promise<string> => {
  try {
    const packageJsonPath = join(cwd, 'package.json');
    if (!fs.existsSync(packageJsonPath)) return 'v4';

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    if (deps.tailwindcss) {
      const version = deps.tailwindcss;
      if (version.includes('4.') || version.includes('next')) {
        return 'v4';
      }
      return 'v3';
    }

    return 'v4'; // Default to v4
  } catch {
    return 'v4';
  }
};

/**
 * Create default grayscale tokens for CLI compatibility
 */
export const createDefaultRegistry = (): TokenSet => {
  return {
    id: 'default-grayscale',
    name: 'Default Grayscale System',
    tokens: [
      { name: 'primary', value: 'oklch(0.45 0.12 240)', category: 'color', namespace: 'color' },
      {
        name: 'background',
        value: 'oklch(1 0 0)',
        category: 'color',
        namespace: 'color',
        darkValue: 'oklch(0.09 0 0)',
      },
      {
        name: 'foreground',
        value: 'oklch(0.15 0.005 240)',
        category: 'color',
        namespace: 'color',
        darkValue: 'oklch(0.95 0 0)',
      },
    ],
  };
};

/**
 * Fetch tokens from Rafters Studio (stub implementation)
 */
export const fetchStudioTokens = async (shortcode: string): Promise<TokenSet> => {
  console.log(`Fetching tokens for shortcode: ${shortcode}`);

  // In real implementation, would fetch and parse DesignSystem from API
  // then convert to legacy TokenSet format for CLI compatibility
  const defaultTokens = createDefaultRegistry();
  return {
    ...defaultTokens,
    id: `studio-${shortcode}`,
    name: `Studio Theme ${shortcode}`,
  };
};

/**
 * Write token files to project (stub implementation)
 */
export const writeTokenFiles = async (
  tokenSet: TokenSet,
  format: string,
  cwd: string
): Promise<void> => {
  console.log(`Writing ${format} tokens for ${tokenSet.name} to ${cwd}`);

  // In real implementation:
  // 1. Convert TokenSet to full DesignSystem
  // 2. Generate CSS custom properties with intelligence metadata
  // 3. Create utility classes where specified
  // 4. Handle dark theme variants
  // 5. Generate accessibility documentation

  const tokenCount = tokenSet.tokens.length;
  console.log(`  - ${tokenCount} tokens would be written`);
  console.log(`  - Format: ${format}`);
  console.log(`  - Target directory: ${cwd}`);
};

/**
 * Inject CSS import into project files (stub implementation)
 */
export const injectCSSImport = async (format: string, cwd: string): Promise<void> => {
  console.log(`Injecting ${format} import in ${cwd}`);

  const importStatements = {
    css: '@import "./design-tokens.css";',
    tailwind: '@import "./design-tokens.css";',
    'react-native': '// Import design-tokens.ts in your root component',
  };

  const statement =
    importStatements[format as keyof typeof importStatements] || importStatements.css;
  console.log(`  - Would add: ${statement}`);
};

// Export for CLI compatibility
export default {
  checkTailwindVersion,
  createDefaultRegistry,
  fetchStudioTokens,
  writeTokenFiles,
  injectCSSImport,
};
