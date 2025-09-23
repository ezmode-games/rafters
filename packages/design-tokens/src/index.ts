/**
 * @rafters/design-tokens
 *
 * Comprehensive design token system with AI intelligence metadata
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  type ColorReference,
  type ColorValue,
  type Token,
  TokenSchema,
  type TokenSet,
} from '@rafters/shared';
import { ensureDirSync } from 'fs-extra';
import sqids from 'sqids';
import { z } from 'zod';

// Export archive management
export { DesignSystemArchive, fetchArchive } from './archive.js';
// Export dependency tracking system - temporarily disabled for ES module issues
// export type { TokenDependency } from './dependencies';
// export { TokenDependencyGraph } from './dependencies';
// Export new clean export system
export {
  exportColorScales,
  exportToCSSVariables,
  exportTokensFromRegistry,
  exportToTailwindCSS,
} from './export.js';
// Export complete tailwind v4 exporter
export { exportToTailwindV4Complete } from './exporters/tailwind-v4.js';
// Export core TokenRegistry class
export { TokenRegistry } from './registry.js';
// Export registry factory with self-initialization
export { createEventDrivenTokenRegistry } from './registry-factory.js';
// Export event types
export type { RegistryEvent, RegistryChangeCallback, TokenChangeEvent, TokensBatchChangeEvent, RegistryInitializedEvent } from './types/events.js';
// Export callback implementations
export { createLocalCSSCallback } from './callbacks/local-css-callback.js';

// Import for internal use
import { TokenRegistry } from './registry.js';

export const generateShortCode = () => {
  const s = new sqids();
  return s.encode([Date.now()]);
};

/**
 * Type guard to check if a value is a ColorValue object
 * @internal Currently unused but kept for future API consistency
 */
export function isColorValue(value: unknown): value is ColorValue {
  return typeof value === 'object' && value !== null && 'name' in value && 'scale' in value;
}

// Re-export from shared for backward compatibility
export type { Token } from '@rafters/shared';
export { TokenSchema } from '@rafters/shared';

/**
 * Convert a token value (string or ColorValue object) to a CSS string
 * For ColorValue objects, extracts the appropriate CSS value from scale
 */
export function tokenValueToCss(value: string | ColorValue | ColorReference): string {
  if (typeof value === 'string') {
    return value;
  }

  // Handle ColorReference object - convert to CSS variable reference
  if (typeof value === 'object' && 'family' in value && 'position' in value) {
    const colorRef = value as ColorReference;
    return `var(--color-${colorRef.family}-${colorRef.position})`;
  }

  // Handle ColorValue object - extract from scale using value position or use direct value
  if (value.scale && value.scale.length > 0) {
    let targetIndex = 5; // Default to 500 position (index 5)

    // If value field specifies a scale position, use that
    if (value.value && !Number.isNaN(Number.parseInt(value.value, 10))) {
      const scalePosition = Number.parseInt(value.value, 10);
      const scalePositions = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
      targetIndex = scalePositions.indexOf(scalePosition);
      if (targetIndex === -1) targetIndex = 5; // Fallback to 500
    }

    const targetOklch = value.scale[targetIndex] || value.scale[5] || value.scale[0];
    if (targetOklch) {
      return `oklch(${targetOklch.l} ${targetOklch.c} ${targetOklch.h}${targetOklch.alpha !== undefined && targetOklch.alpha !== 1 ? ` / ${targetOklch.alpha}` : ''})`;
    }
  }

  // Handle ColorValue with empty scale - use direct OKLCH value
  if (value.value && typeof value.value === 'string' && value.value.includes('oklch(')) {
    return value.value;
  }

  // Final fallback
  console.warn('Unable to extract CSS value from ColorValue:', value);
  return 'transparent';
}

/**
 * Convert a token value to CSS string for dark mode
 * For ColorValue objects, uses states when available, otherwise falls back to light value
 */
export function tokenValueToCssDark(
  value: string | ColorValue | ColorReference,
  stateName = 'default'
): string {
  if (typeof value === 'string') {
    return value;
  }

  // Handle ColorReference object - convert to CSS variable reference
  if (typeof value === 'object' && 'family' in value && 'position' in value) {
    const colorRef = value as ColorReference;
    return `var(--color-${colorRef.family}-${colorRef.position})`;
  }

  // Handle ColorValue object for dark mode
  // If we have states, try to use the specified state or any available state
  if (value.states && Object.keys(value.states).length > 0) {
    // First try the specific state requested
    if (stateName !== 'default' && value.states[stateName]) {
      return value.states[stateName];
    }

    // Fall back to any available state (prefer hover as it's most common)
    const state = value.states.hover || Object.values(value.states)[0];
    if (state) {
      return state;
    }
  }

  // If no states available, fall back to extracting from light value scale
  return tokenValueToCss(value);
}

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

export type DesignSystem = z.infer<typeof DesignSystemSchema> & {
  tokens: Token[];
};

// Import and re-export all generators from generators folder
export {
  generateAllTokens,
  generateAnimations,
  generateAspectRatioTokens,
  generateBackdropTokens,
  generateBorderRadiusTokens,
  generateBorderWidthTokens,
  generateBreakpointTokens,
  generateColorTokens,
  generateDepthScale,
  generateFontFamilyTokens,
  generateFontWeightTokens,
  generateGridTokens,
  generateHeightScale,
  generateLetterSpacingTokens,
  generateMotionTokens,
  generateOpacityTokens,
  generateSpacingScale,
  generateTouchTargetTokens,
  generateTransformTokens,
  generateTypographyScale,
  generateWidthTokens,
} from './generators/index.js';

/**
 * Generate CSS custom properties format
 */
function generateCssCustomProperties(designSystem: DesignSystem): string {
  const lightTokens: string[] = [];
  const darkTokens: string[] = [];

  for (const token of designSystem.tokens as Token[]) {
    // Use tokenValueToCss to handle both string and ColorValue tokens
    const tokenValue = tokenValueToCss(token.value);

    if (token.name.endsWith('-dark')) {
      // This is a dark mode token - add to dark tokens with light name
      const lightName = token.name.replace('-dark', '');
      const darkVar = `--${token.namespace}-${lightName}: ${tokenValue};`;
      darkTokens.push(darkVar);
    } else {
      // This is a light mode token - add to light tokens
      const cssVar = `--${token.namespace}-${token.name}: ${tokenValue};`;
      lightTokens.push(cssVar);
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
  // Group tokens by category for organized generation
  const tokensByCategory: Record<string, Token[]> = {};
  for (const token of designSystem.tokens as Token[]) {
    if (!tokensByCategory[token.category]) {
      tokensByCategory[token.category] = [];
    }
    tokensByCategory[token.category].push(token);
  }

  let stylesheet = '/* biome-ignore-all: Tailwind v4 syntax not supported yet */\n';
  stylesheet += '/* Generated by Rafters Design System */\n';
  stylesheet += `/* ${designSystem.name} - ${designSystem.tokens.length} tokens with AI intelligence */\n\n`;

  // Essential imports - no external dependencies
  stylesheet += `@import "tailwindcss";\n`;

  // Custom variants for dark mode
  stylesheet += '@custom-variant dark (@media (prefers-color-scheme: dark));\n\n';

  // Main @theme block
  stylesheet += '@theme {\n';

  // Font families
  if (tokensByCategory['font-family']) {
    stylesheet += '    /* Font Families */\n';
    for (const token of tokensByCategory['font-family']) {
      stylesheet += `    --font-${token.name}: ${token.value};\n`;
    }
    stylesheet += '\n';
  }

  // Colors with semantic naming and OKLCH values
  if (tokensByCategory.color) {
    stylesheet += `    /* ${(designSystem.primaryColorSpace || 'oklch').toUpperCase()} Color Palette */\n`;

    // Separate normal and dark tokens
    const normalColorTokens = tokensByCategory.color.filter(
      (token) => !token.name.includes('-dark')
    );
    const darkColorTokens = tokensByCategory.color.filter((token) => token.name.includes('-dark'));

    // Generate normal color tokens
    for (const token of normalColorTokens) {
      const cssValue = tokenValueToCss(token.value);
      stylesheet += `    --color-${token.name}: ${cssValue};\n`;
    }

    // Generate dark color tokens (they'll be referenced in dark mode)
    for (const token of darkColorTokens) {
      const cssValue = tokenValueToCss(token.value);
      stylesheet += `    --color-${token.name}: ${cssValue};\n`;
    }

    stylesheet += '\n';
  }

  // Typography scale (font sizes with line heights)
  if (tokensByCategory['font-size']) {
    stylesheet += '    /* Typography Scale */\n';
    for (const token of tokensByCategory['font-size']) {
      stylesheet += `    --text-${token.name}: ${token.value};\n`;
      // Add line height if available
      if (token.lineHeight) {
        stylesheet += `    --text-${token.name}--line-height: ${token.lineHeight};\n`;
      }
    }
    stylesheet += '\n';
  }

  // Spacing scale - only base tokens (Tailwind generates responsive variants)
  if (tokensByCategory.spacing) {
    stylesheet += `    /* Mathematical Spacing Scale (${designSystem.spacingSystem}) */\n`;
    // Only generate base spacing tokens - filter out responsive variants
    const baseSpacingTokens = tokensByCategory.spacing.filter(
      (token) => !token.name.includes('-') && !token.name.includes('@')
    );

    for (const token of baseSpacingTokens) {
      stylesheet += `    --spacing-${token.name}: ${token.value};\n`;
    }
    stylesheet += '\n';
  }

  // Border radius scale
  if (tokensByCategory['border-radius']) {
    stylesheet += '    /* Border Radius Scale */\n';
    for (const token of tokensByCategory['border-radius']) {
      stylesheet += `    --radius-${token.name}: ${token.value};\n`;
    }
    stylesheet += '\n';
  }

  // Motion tokens (durations and easings)
  if (tokensByCategory.motion || tokensByCategory.easing) {
    stylesheet += '    /* Motion & Animation */\n';
    if (tokensByCategory.motion) {
      for (const token of tokensByCategory.motion) {
        stylesheet += `    --duration-${token.name}: ${token.value};\n`;
      }
    }
    if (tokensByCategory.easing) {
      for (const token of tokensByCategory.easing) {
        stylesheet += `    --ease-${token.name}: ${token.value};\n`;
      }
    }
    stylesheet += '\n';
  }

  // Other token categories
  const otherCategories = [
    'font-weight',
    'opacity',
    'shadow',
    'backdrop-blur',
    'z-index',
    'letter-spacing',
    'line-height',
    'height',
    'width',
    'container',
    'aspect-ratio',
    'grid-template-columns',
    'grid-template-rows',
    'scale',
    'translate',
    'rotate',
    'border-width',
    'touch-target',
  ];
  for (const category of otherCategories) {
    if (tokensByCategory[category]) {
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
      stylesheet += `    /* ${categoryName} */\n`;
      for (const token of tokensByCategory[category]) {
        let prefix = category;
        // Custom prefix mapping for better CSS variable names
        switch (category) {
          case 'font-weight':
            prefix = 'font-weight';
            break;
          case 'letter-spacing':
            prefix = 'tracking';
            break;
          case 'line-height':
            prefix = 'leading';
            break;
          case 'aspect-ratio':
            prefix = 'aspect';
            break;
          case 'grid-template-columns':
            prefix = 'grid-cols';
            break;
          case 'grid-template-rows':
            prefix = 'grid-rows';
            break;
          case 'touch-target':
            prefix = 'touch';
            break;
          case 'z-index':
            prefix = 'z';
            break;
        }
        stylesheet += `    --${prefix}-${token.name}: ${token.value};\n`;
      }
      stylesheet += '\n';
    }
  }

  stylesheet += '}\n\n';

  // Semantic token mapping in :root for shadcn compatibility
  stylesheet += ':root {\n';
  stylesheet += '    /* Base radius for consistent rounded corners */\n';
  stylesheet += '    --radius: 0.5rem;\n\n';
  // Colors are handled in @theme inline and :root sections below

  stylesheet += '}\n\n';

  // Base HTML styling
  stylesheet += 'html, body {\n';
  stylesheet += '    background-color: var(--background);\n';
  stylesheet += '    color: var(--foreground);\n';
  stylesheet += '\n';
  stylesheet += '    @media (prefers-color-scheme: dark) {\n';
  stylesheet += '        color-scheme: dark;\n';
  stylesheet += '    }\n';
  stylesheet += '}\n\n';

  // Accessibility and reduced motion
  if (designSystem.enforceMotionSafety) {
    stylesheet += '@media (prefers-reduced-motion: reduce) {\n';
    stylesheet += '    *,\n';
    stylesheet += '    ::before,\n';
    stylesheet += '    ::after {\n';
    stylesheet += '        animation-duration: 0.01ms !important;\n';
    stylesheet += '        animation-iteration-count: 1 !important;\n';
    stylesheet += '        transition-duration: 0.01ms !important;\n';
    stylesheet += '        scroll-behavior: auto !important;\n';
    stylesheet += '    }\n';
    stylesheet += '}\n\n';
  }

  // Base layer for consistent defaults
  stylesheet += '@layer base {\n';
  stylesheet += '    * {\n';
  stylesheet += '        @apply border-border outline-ring/50;\n';
  stylesheet += '    }\n';
  stylesheet += '    body {\n';
  stylesheet += '        @apply bg-background text-foreground;\n';
  if (designSystem.accessibilityTarget === 'AAA') {
    stylesheet += '        line-height: 1.5; /* WCAG AAA line height requirement */\n';
  }
  stylesheet += '    }\n';
  stylesheet += '}\n\n';

  // Semantic color mappings for shadcn compatibility
  const semanticMappings = [
    'background',
    'foreground',
    'primary',
    'primary-foreground',
    'secondary',
    'secondary-foreground',
    'muted',
    'muted-foreground',
    'accent',
    'accent-foreground',
    'destructive',
    'destructive-foreground',
    'info',
    'info-foreground',
    'success',
    'success-foreground',
    'warning',
    'warning-foreground',
    'highlight',
    'highlight-foreground',
    'border',
    'input',
    'ring',
    'card',
    'card-foreground',
    'popover',
    'popover-foreground',
  ];

  // Tailwind v4 inline theme for semantic token mapping
  stylesheet += '@theme inline {\n';
  for (const semantic of semanticMappings) {
    stylesheet += `    --color-${semantic}: var(--${semantic});\n`;
  }
  stylesheet += '}\n\n';

  // Root semantic tokens with dark mode support using tokens, not hardcoded values
  stylesheet += ':root {\n';
  stylesheet += '    --radius: 0.5rem;\n\n';

  // Light mode semantic mappings
  for (const semantic of semanticMappings) {
    const token = tokensByCategory.color?.find((t) => t.name === semantic);
    if (token) {
      stylesheet += `    --${semantic}: var(--color-${token.name});\n`;
    }
  }

  // Dark mode using proper dark tokens - NO hardcoded values, only token references
  stylesheet += '\n    @media (prefers-color-scheme: dark) {\n';
  for (const semantic of semanticMappings) {
    // Look for dark variant tokens (semantic-dark naming)
    const darkToken = tokensByCategory.color?.find((t) => t.name === `${semantic}-dark`);

    if (darkToken) {
      // Reference the dark variant token
      stylesheet += `        --${semantic}: var(--color-${semantic}-dark);\n`;
    }
    // If no dark token exists, light value remains (like for pure white/black)
  }
  stylesheet += '    }\n';
  stylesheet += '}\n\n';

  // Custom utility classes that don't exist in standard Tailwind
  stylesheet += '@layer utilities {\n';

  // Semantic z-index utilities
  stylesheet += '    /* Semantic Z-index utilities */\n';
  if (tokensByCategory['z-index']) {
    for (const token of tokensByCategory['z-index']) {
      stylesheet += `    .z-${token.name} { z-index: var(--z-${token.name}); }\n`;
    }
  }

  // Motion utilities - no external dependencies
  stylesheet += '\n    /* Motion utilities */\n';
  if (tokensByCategory.motion || tokensByCategory.easing) {
    stylesheet +=
      '    .transition-standard { transition: all var(--duration-standard) var(--ease-smooth); }\n';
    stylesheet +=
      '    .transition-fast { transition: all var(--duration-fast) var(--ease-smooth); }\n';
    stylesheet +=
      '    .transition-deliberate { transition: all var(--duration-deliberate) var(--ease-smooth); }\n';
    stylesheet += '    .motion-reduce { transition: none !important; }\n';
  }

  // Container utilities up to 9xl
  stylesheet += '\n    /* Container utilities */\n';
  const containerSizes = [
    'xs',
    'sm',
    'md',
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
  for (const size of containerSizes) {
    if (tokensByCategory.width?.find((t) => t.name === `container-${size}`)) {
      stylesheet += `    .container-${size} { max-width: var(--container-${size}); }\n`;
    }
  }

  // Grid utilities with variables instead of hardcoded values
  stylesheet += '\n    /* Grid utilities with variables */\n';
  stylesheet += '    .grid-auto-fit-sm { grid-template-columns: var(--grid-cols-auto-fit-sm); }\n';
  stylesheet += '    .grid-auto-fit-md { grid-template-columns: var(--grid-cols-auto-fit-md); }\n';
  stylesheet += '    .grid-auto-fit-lg { grid-template-columns: var(--grid-cols-auto-fit-lg); }\n';

  // Keyframes for motion - self-contained
  stylesheet += '\n    /* Self-contained keyframes */\n';
  stylesheet += '    @keyframes rafters-spin {\n';
  stylesheet += '        from { transform: rotate(0deg); }\n';
  stylesheet += '        to { transform: rotate(360deg); }\n';
  stylesheet += '    }\n';
  stylesheet += '    @keyframes rafters-pulse {\n';
  stylesheet += '        0%, 100% { opacity: 1; }\n';
  stylesheet += '        50% { opacity: 0.5; }\n';
  stylesheet += '    }\n';
  stylesheet += '    @keyframes rafters-bounce {\n';
  stylesheet += '        0%, 100% { transform: translateY(-25%); }\n';
  stylesheet += '        50% { transform: translateY(0); }\n';
  stylesheet += '    }\n';

  stylesheet += '    .animate-rafters-spin { animation: rafters-spin 1s linear infinite; }\n';
  stylesheet +=
    '    .animate-rafters-pulse { animation: rafters-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }\n';
  stylesheet += '    .animate-rafters-bounce { animation: rafters-bounce 1s infinite; }\n';

  stylesheet += '}\n\n';

  // AI intelligence footer comment
  stylesheet += '/*\n';
  stylesheet += ' * Generated with Rafters Design Intelligence\n';
  stylesheet += ` * - ${designSystem.tokens.length} tokens with embedded AI metadata\n`;
  stylesheet += ` * - ${designSystem.accessibilityTarget} accessibility compliance built-in\n`;
  stylesheet += ` * - Mathematical relationships: ${designSystem.spacingSystem} scale\n`;
  stylesheet += ` * - Color science: ${(designSystem.primaryColorSpace || 'oklch').toUpperCase()} color space\n`;
  stylesheet += ' * - Complete design reasoning in .rafters/tokens/ JSON files\n';
  stylesheet += ' */\n';

  return stylesheet;
}

// Re-export from shared for backward compatibility
export type { TokenSet } from '@rafters/shared';
export { TokenSetSchema } from '@rafters/shared';

/**
 * Check Tailwind CSS version in project
 */
export const checkTailwindVersion = async (cwd: string): Promise<string> => {
  try {
    const packageJsonPath = join(cwd, 'package.json');
    if (!existsSync(packageJsonPath)) return 'v4';

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    if (deps.tailwindcss) {
      const version = deps.tailwindcss;
      if (version.startsWith('catalog:') || version.includes('@next')) {
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
/**
 * Create registry by reading all token JSON files from .rafters/tokens directory
 */
export const createRegistry = (tokensDir: string): TokenSet => {
  const tokens: Token[] = [];

  try {
    // Read all JSON files in the tokens directory
    const tokenFiles = [
      'color.json',
      'spacing.json',
      'z-index.json',
      'shadow.json',
      'font-size.json',
      'font-weight.json',
      'font-family.json',
      'opacity.json',
      'border-radius.json',
      'height.json',
      'width.json',
      'easing.json',
      'line-height.json',
      'letter-spacing.json',
      'breakpoint.json',
      'container.json',
      'aspect-ratio.json',
      'border-width.json',
      'backdrop-blur.json',
      'motion.json',
      'rotate.json',
      'scale.json',
      'translate.json',
      'touch-target.json',
      'grid-template-columns.json',
      'grid-template-rows.json',
    ];

    for (const file of tokenFiles) {
      const filePath = join(tokensDir, file);
      if (existsSync(filePath)) {
        const fileContent = readFileSync(filePath, 'utf-8');
        const fileTokens = JSON.parse(fileContent);

        // Handle both array format and object format
        if (Array.isArray(fileTokens)) {
          tokens.push(...fileTokens);
        } else if (fileTokens.tokens) {
          tokens.push(...fileTokens.tokens);
        }
      }
    }

    return {
      id: 'generated',
      name: 'Generated Token Registry',
      tokens,
    };
  } catch (error) {
    console.warn('Failed to read token files, using minimal fallback:', error);
    // Minimal fallback if token files can't be read
    return {
      id: 'fallback',
      name: 'Fallback Registry',
      tokens: [
        {
          name: 'primary',
          value: 'oklch(0.45 0.12 240)',
          category: 'color',
          namespace: 'color',
        },
        {
          name: 'background',
          value: 'oklch(1 0 0)',
          category: 'color',
          namespace: 'color',
          // darkValue: 'oklch(0.09 0 0)', // deprecated, use separate dark token
        },
        {
          name: 'foreground',
          value: 'oklch(0.15 0.005 240)',
          category: 'color',
          namespace: 'color',
          // darkValue: 'oklch(0.95 0 0)', // deprecated, use separate dark token
        },
      ],
    };
  }
};

/**
 * Create TokenRegistry instance from JSON files for MCP queries
 * Provides full intelligence metadata for AI agent decision-making
 */
export const createTokenRegistry = (tokensDir: string): TokenRegistry => {
  const tokenSet = createRegistry(tokensDir);
  return new TokenRegistry(tokenSet.tokens);
};

/**
 * Fetch tokens from Rafters Studio (stub implementation)
 */
export const fetchStudioTokens = async (
  shortcode: string,
  tokensDir?: string
): Promise<TokenSet> => {
  console.log(`Fetching tokens for shortcode: ${shortcode}`);

  // In real implementation, would fetch and parse DesignSystem from API
  // For now, if we have a tokens directory, read from it; otherwise throw error
  if (tokensDir && existsSync(tokensDir)) {
    const registry = createRegistry(tokensDir);
    return {
      ...registry,
      id: `studio-${shortcode}`,
      name: `Studio Theme ${shortcode}`,
    };
  }

  throw new Error(`Studio tokens not available for shortcode: ${shortcode}`);
};

/**
 * Write token files to project (real implementation)
 */
/**
 * Generate CSS following shadcn/ui pattern with CSS variables and @theme inline
 */
function generateCSSFromTokens(tokens: Token[]): string {
  const lines = [
    '/**',
    ' * Rafters Design Tokens',
    ' * Generated following shadcn/ui pattern with embedded design intelligence',
    ' */',
    '',
  ];

  // Group tokens by category
  const tokensByCategory: Record<string, Token[]> = {};
  for (const token of tokens) {
    if (!tokensByCategory[token.category]) {
      tokensByCategory[token.category] = [];
    }
    tokensByCategory[token.category].push(token);
  }

  // Generate CSS variables in :root with proper namespacing
  lines.push(':root {');
  for (const [category, categoryTokens] of Object.entries(tokensByCategory)) {
    lines.push(`  /* ${category.toUpperCase()} */`);

    for (const token of categoryTokens) {
      // Clean token names without prefixes
      const varName = `--${token.name.replace(/_/g, '-')}`;
      if (token.semanticMeaning) {
        lines.push(`  /* ${token.semanticMeaning} */`);
      }
      // Use tokenValueToCss to handle ColorValue objects
      const cssValue = tokenValueToCss(token.value);
      lines.push(`  ${varName}: ${cssValue};`);
    }
    lines.push('');
  }
  lines.push('}');
  lines.push('');

  // Generate dark mode overrides (new pattern: look for -dark suffix tokens)
  const darkTokens = tokens.filter((t) => t.name.endsWith('-dark'));
  if (darkTokens.length > 0) {
    lines.push('.dark {');
    lines.push('  /* Dark mode overrides */');
    for (const token of darkTokens) {
      const lightName = token.name.replace('-dark', '');
      const varName = `--${lightName.replace(/_/g, '-')}`;
      if (token.semanticMeaning) {
        lines.push(`  /* Dark: ${token.semanticMeaning} */`);
      }

      const darkValue = tokenValueToCss(token.value);
      lines.push(`  ${varName}: ${darkValue};`);
    }
    lines.push('}');
    lines.push('');
  }

  // Generate @theme inline mapping (shadcn v4 pattern)
  lines.push('@theme inline {');

  // Handle breakpoints specially - use actual values, not CSS variables
  const breakpointTokens = tokensByCategory.breakpoint;
  if (breakpointTokens && breakpointTokens.length > 0) {
    lines.push('  /* BREAKPOINT MAPPINGS */');
    for (const token of breakpointTokens) {
      const name = token.name.replace(/_/g, '-');
      lines.push(`  --breakpoint-${name}: ${token.value};`);
    }
    lines.push('');
  }

  // Handle all other categories with CSS variable references
  for (const [category, categoryTokens] of Object.entries(tokensByCategory)) {
    if (category === 'breakpoint') continue; // Already handled above

    lines.push(`  /* ${category.toUpperCase()} MAPPINGS */`);

    for (const token of categoryTokens) {
      // Use clean token names directly
      const sourceVarName = `--${token.name.replace(/_/g, '-')}`;

      // Map to appropriate Tailwind theme keys
      const mappedKey = mapCategoryToTheme(category, token.name);
      if (mappedKey) {
        lines.push(`  ${mappedKey}: var(${sourceVarName});`);
      }
    }
    lines.push('');
  }
  lines.push('}');
  lines.push('');

  return lines.join('\n');
}

/**
 * Map token categories to Tailwind theme keys
 */
function mapCategoryToTheme(category: string, tokenName: string): string | null {
  const name = tokenName.replace(/_/g, '-');

  // Special cases that need different handling
  const specialMappings: Record<string, string | null> = {
    shadow: 'box-shadow',
    breakpoint: null, // Breakpoints handled separately
  };

  // Handle special cases
  if (category in specialMappings) {
    const mapped = specialMappings[category];
    return mapped ? `--${mapped}-${name}` : null;
  }

  // Default mapping: --{category}-{name}
  return `--${category}-${name}`;
}

export const writeTokenFiles = async (
  tokenSet: TokenSet,
  format: string,
  cwd: string
): Promise<void> => {
  console.log(`Writing ${format} tokens for ${tokenSet.name} to ${cwd}`);

  // Import all generators and create complete token set
  const { generateAllTokens } = await import('./generators/index');
  const allTokens = await generateAllTokens();

  // Convert to DesignSystem format
  const designSystem: DesignSystem = {
    id: tokenSet.id,
    name: tokenSet.name,
    tokens: allTokens,
    accessibilityTarget: 'AAA',
    section508Compliant: true,
    cognitiveLoadBudget: 15,
    primaryColorSpace: 'oklch',
    generateDarkTheme: true,
    enforceContrast: true,
    enforceMotionSafety: true,
    spacingSystem: 'linear',
    spacingMultiplier: 1.25,
    spacingBaseUnit: 4,
  };

  // Write tokens directory for Studio consumption - THIS IS THE MAIN PURPOSE
  const raftersDir = join(cwd, '.rafters');
  const tokensDir = join(raftersDir, 'tokens');
  ensureDirSync(tokensDir);

  // Group tokens by category for easier AI consumption
  const tokensByCategory: Record<string, Token[]> = {};
  for (const token of allTokens) {
    if (!tokensByCategory[token.category]) {
      tokensByCategory[token.category] = [];
    }
    tokensByCategory[token.category].push(token);
  }

  // Write individual category files
  for (const [category, tokens] of Object.entries(tokensByCategory)) {
    const categoryFile = join(tokensDir, `${category}.json`);
    const categoryData = {
      category,
      generatedAt: new Date().toISOString(),
      tokens: tokens.map((token) => ({
        ...token,
        // Clean up undefined values for JSON
        ...Object.fromEntries(Object.entries(token).filter(([_, v]) => v !== undefined)),
      })),
    };
    writeFileSync(categoryFile, JSON.stringify(categoryData, null, 2));
  }

  // Write complete registry
  const registryFile = join(tokensDir, 'registry.json');
  const registryData = {
    ...designSystem,
    generatedAt: new Date().toISOString(),
    tokenCount: allTokens.length,
    categoryCount: Object.keys(tokensByCategory).length,
  };
  writeFileSync(registryFile, JSON.stringify(registryData, null, 2));

  // Note: Color token AI intelligence processing removed due to missing enrichColorToken method
  // Color tokens are processed with their base intelligence metadata from generators

  // Generate CSS file for the requested format
  if (format === 'tailwind' || format === 'css') {
    const cssContent = generateCSSFromTokens(allTokens);
    const cssFile = join(raftersDir, 'design-tokens.css');
    writeFileSync(cssFile, cssContent);
    console.log(`  ✓ Generated design-tokens.css with ${format} format`);
  }

  console.log(`  ✓ Generated ${allTokens.length} design tokens for Studio`);
  console.log(
    `  ✓ Created ${Object.keys(tokensByCategory).length} category files in .rafters/tokens/`
  );
  console.log('  ✓ Generated registry.json with AI intelligence metadata');
};

/**
 * Install Rafters design system CSS (complete replacement with backup)
 * Returns information about what was done for CLI to format
 */
export const injectCSSImport = async (
  cssFilePath: string,
  cwd: string
): Promise<{
  action: 'created' | 'replaced' | 'skipped';
  backupPath?: string;
  message: string;
}> => {
  const fullCssPath = join(cwd, cssFilePath);

  // Generate CSS content directly from token registry
  const tokensDir = join(cwd, '.rafters', 'tokens');
  if (!existsSync(tokensDir)) {
    throw new Error('Token files not found. Run `rafters init` first.');
  }

  const tokenSet = createRegistry(tokensDir);
  const tokensContent = generateCSSFromTokens(tokenSet.tokens);

  // Check if CSS file exists
  if (existsSync(fullCssPath)) {
    const existingContent = readFileSync(fullCssPath, 'utf-8');

    // Check if already installed
    if (existingContent.includes('Rafters Design System')) {
      return {
        action: 'skipped',
        message: `Rafters design system already installed in ${cssFilePath}`,
      };
    }

    // Create backup of existing file
    const backupPath = `${fullCssPath}.bak`;
    writeFileSync(backupPath, existingContent);

    // Create complete Rafters design system CSS
    const raftersCSS = generateCompleteDesignSystemCSS(tokensContent);

    // Write the complete design system
    writeFileSync(fullCssPath, raftersCSS);

    return {
      action: 'replaced',
      backupPath: `${cssFilePath}.bak`,
      message: `Installed complete Rafters design system into ${cssFilePath}`,
    };
  }
  // Create new file
  const raftersCSS = generateCompleteDesignSystemCSS(tokensContent);

  // Ensure directory exists
  const dir = join(cwd, ...cssFilePath.split('/').slice(0, -1));
  if (dir !== cwd) {
    ensureDirSync(dir);
  }

  // Write the complete design system
  writeFileSync(fullCssPath, raftersCSS);

  return {
    action: 'created',
    message: `Created ${cssFilePath} with Rafters design system`,
  };
};

/**
 * Generate complete design system CSS file
 */
function generateCompleteDesignSystemCSS(tokensContent: string): string {
  return `/**
 * Rafters Design System
 * Complete design system installation with AI-embedded design intelligence
 * 
 * This file contains the complete Rafters design system including:
 * - Design tokens with semantic meaning
 * - Accessibility-first patterns  
 * - Cognitive load optimizations
 * - Trust-building color hierarchies
 * - Progressive enhancement support
 */

@import "tailwindcss";

${tokensContent}

/**
 * Base layer styles with design intelligence
 */
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
  
  /* Accessibility: Respect user motion preferences */
  @media (prefers-reduced-motion: reduce) {
    *,
    ::before,
    ::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  
  /* Typography intelligence: Optimized reading experience */
  h1, h2, h3, h4, h5, h6 {
    font-weight: var(--font-weight-semibold, 600);
    line-height: 1.2;
  }
  
  p {
    line-height: 1.6;
  }
  
  /* Focus management for accessibility */
  [data-focus-visible-added]:focus {
    outline: 2px solid var(--color-ring);
    outline-offset: 2px;
  }
  
  /* Trust building: Clear interactive states */
  button, [role="button"] {
    cursor: pointer;
    transition: all 150ms ease;
  }
  
  button:disabled, [role="button"][aria-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

/**
 * Component layer: Systematic design patterns
 */
@layer components {
  /* Attention economics: Visual hierarchy utilities */
  .attention-primary {
    @apply bg-primary text-primary-foreground font-semibold;
  }
  
  .attention-secondary {
    @apply bg-secondary text-secondary-foreground;
  }
  
  .attention-subtle {
    @apply bg-muted text-muted-foreground;
  }
  
  /* Cognitive load: Progressive disclosure patterns */
  .cognitive-simple {
    @apply space-y-2;
  }
  
  .cognitive-moderate {
    @apply space-y-4;
  }
  
  .cognitive-complex {
    @apply space-y-6;
  }
}

/**
 * Your custom styles go here
 * Add project-specific overrides below this comment
 */
`;
}

export const exportTokens = (designSystem: DesignSystem, format: 'tw' | 'css' | 'json'): string => {
  // Validate tokens before export
  try {
    for (const token of designSystem.tokens as Token[]) {
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
 * Regenerate CSS file with current tokens from .rafters/tokens/ JSON files
 */
export const regenerateCSS = async (cwd: string = process.cwd()): Promise<void> => {
  const raftersDir = join(cwd, '.rafters');
  const tokensDir = join(raftersDir, 'tokens');
  const configPath = join(raftersDir, 'config.json');

  // Check if .rafters directory exists
  if (!existsSync(raftersDir)) {
    throw new Error('No .rafters directory found. Run "rafters init" first.');
  }

  // Read config to get token format
  interface RaftersConfig {
    tokenFormat?: string;
  }
  let config: RaftersConfig = { tokenFormat: 'tailwind' };
  if (existsSync(configPath)) {
    config = JSON.parse(readFileSync(configPath, 'utf-8')) as RaftersConfig;
  }

  // Read all token JSON files
  if (!existsSync(tokensDir)) {
    throw new Error('No tokens directory found. Run "rafters init" first.');
  }

  const allTokens: Token[] = [];
  const tokenFiles = ['color.json', 'spacing.json', 'typography.json', 'motion.json']; // Add more as needed

  for (const file of tokenFiles) {
    const filePath = join(tokensDir, file);
    if (existsSync(filePath)) {
      const tokenData = JSON.parse(readFileSync(filePath, 'utf-8'));
      if (tokenData.tokens && Array.isArray(tokenData.tokens)) {
        allTokens.push(...tokenData.tokens);
      }
    }
  }

  // Create token set from collected tokens
  const tokenSet: TokenSet = {
    id: 'current',
    name: 'Current Token Set',
    tokens: allTokens,
  };

  // Write tokens to CSS file using configured format
  await writeTokenFiles(tokenSet, config.tokenFormat || 'tailwind', cwd);

  console.log('CSS regenerated from .rafters/tokens/ JSON files including dark mode values');
};

// Export for CLI compatibility
export default {
  checkTailwindVersion,
  createRegistry,
  createTokenRegistry,
  fetchStudioTokens,
  writeTokenFiles,
  injectCSSImport,
  regenerateCSS,
};
