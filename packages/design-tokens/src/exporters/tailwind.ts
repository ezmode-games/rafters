/**
 * Tailwind v4 CSS Exporter
 *
 * Converts TokenRegistry contents to Tailwind v4 CSS format with:
 * - @theme block for raw color scales
 * - :root --rafters-* namespace tokens (light/dark mode)
 * - Semantic variables that switch via prefers-color-scheme
 * - @theme inline bridge pattern
 *
 * @see https://tailwindcss.com/docs/theme
 * @see https://ui.shadcn.com/docs/theming
 */

import type { ColorReference, ColorValue, Token } from '@rafters/shared';
import type { TokenRegistry } from '../registry.js';

/**
 * Options for Tailwind CSS export
 */
export interface TailwindExportOptions {
  /** Include comments with token metadata (default: false) */
  includeComments?: boolean;
  /** Include @import "tailwindcss" at top */
  includeImport?: boolean;
}

/**
 * Group tokens by their namespace
 */
interface GroupedTokens {
  semantic: Token[];
  color: Token[];
  spacing: Token[];
  typography: Token[];
  radius: Token[];
  shadow: Token[];
  depth: Token[];
  motion: Token[];
  breakpoint: Token[];
  elevation: Token[];
  focus: Token[];
  other: Token[];
}

/**
 * Semantic color mappings for the Rafters namespace
 * Maps semantic names to their light and dark mode color references
 *
 * Color family names from API cache (api.rafters.studio):
 * - silver-true-glacier: cyan/teal (h:180)
 * - silver-bold-fire-truck: red (h:0)
 * - silver-true-honey: amber/gold (h:60)
 * - silver-true-citrine: lime/green (h:90)
 * - silver-true-sky: blue (h:210)
 * - silver-true-violet: violet/purple (h:270)
 */
const RAFTERS_SEMANTIC_MAPPINGS: Record<string, { light: string; dark: string }> = {
  background: { light: 'neutral-50', dark: 'neutral-950' },
  foreground: { light: 'neutral-950', dark: 'neutral-50' },
  card: { light: 'neutral-50', dark: 'neutral-950' },
  'card-foreground': { light: 'neutral-950', dark: 'neutral-50' },
  popover: { light: 'neutral-50', dark: 'neutral-950' },
  'popover-foreground': { light: 'neutral-950', dark: 'neutral-50' },
  primary: { light: 'neutral-900', dark: 'neutral-50' },
  'primary-foreground': { light: 'neutral-50', dark: 'neutral-900' },
  secondary: { light: 'neutral-100', dark: 'neutral-800' },
  'secondary-foreground': { light: 'neutral-900', dark: 'neutral-50' },
  muted: { light: 'neutral-100', dark: 'neutral-800' },
  'muted-foreground': { light: 'neutral-500', dark: 'neutral-400' },
  accent: { light: 'silver-true-glacier-100', dark: 'silver-true-glacier-800' },
  'accent-foreground': { light: 'silver-true-glacier-900', dark: 'silver-true-glacier-50' },
  destructive: { light: 'silver-bold-fire-truck-500', dark: 'silver-bold-fire-truck-600' },
  'destructive-foreground': { light: 'neutral-50', dark: 'neutral-50' },
  success: { light: 'silver-true-citrine-500', dark: 'silver-true-citrine-600' },
  'success-foreground': { light: 'neutral-50', dark: 'neutral-50' },
  warning: { light: 'silver-true-honey-500', dark: 'silver-true-honey-600' },
  'warning-foreground': { light: 'neutral-950', dark: 'neutral-50' },
  info: { light: 'silver-true-sky-500', dark: 'silver-true-sky-600' },
  'info-foreground': { light: 'neutral-50', dark: 'neutral-50' },
  highlight: { light: 'silver-true-violet-200', dark: 'silver-true-violet-700' },
  'highlight-foreground': { light: 'silver-true-violet-900', dark: 'silver-true-violet-50' },
  border: { light: 'neutral-200', dark: 'neutral-800' },
  input: { light: 'neutral-200', dark: 'neutral-800' },
  ring: { light: 'neutral-950', dark: 'neutral-300' },
  'sidebar-background': { light: 'neutral-50', dark: 'neutral-950' },
  'sidebar-foreground': { light: 'neutral-950', dark: 'neutral-50' },
  'sidebar-primary': { light: 'neutral-900', dark: 'neutral-50' },
  'sidebar-primary-foreground': { light: 'neutral-50', dark: 'neutral-900' },
  'sidebar-accent': { light: 'neutral-100', dark: 'neutral-800' },
  'sidebar-accent-foreground': { light: 'neutral-900', dark: 'neutral-50' },
  'sidebar-border': { light: 'neutral-200', dark: 'neutral-800' },
  'sidebar-ring': { light: 'neutral-950', dark: 'neutral-300' },
  'chart-1': { light: 'silver-true-glacier-500', dark: 'silver-true-glacier-400' },
  'chart-2': { light: 'silver-true-sky-500', dark: 'silver-true-sky-400' },
  'chart-3': { light: 'silver-true-citrine-500', dark: 'silver-true-citrine-400' },
  'chart-4': { light: 'silver-true-honey-500', dark: 'silver-true-honey-400' },
  'chart-5': { light: 'silver-true-violet-500', dark: 'silver-true-violet-400' },
};

/**
 * Convert a token value to CSS string
 */
function tokenValueToCSS(token: Token): string {
  const { value } = token;

  // String values pass through
  if (typeof value === 'string') {
    return value;
  }

  // ColorValue - convert OKLCH to CSS
  if (typeof value === 'object' && value !== null) {
    if ('scale' in value) {
      const colorValue = value as ColorValue;
      // Return OKLCH string for the base color (position 500 = index 5)
      const baseColor = colorValue.scale[5];
      if (baseColor) {
        return `oklch(${formatNumber(baseColor.l)} ${formatNumber(baseColor.c)} ${formatNumber(baseColor.h)})`;
      }
    }
    // ColorReference - return as var() reference
    if ('family' in value && 'position' in value) {
      const ref = value as ColorReference;
      return `var(--color-${ref.family}-${ref.position})`;
    }
  }

  return String(value);
}

/**
 * Format a number for CSS output
 */
function formatNumber(value: number, decimals = 3): string {
  return Number(value.toFixed(decimals)).toString();
}

/**
 * Group tokens by namespace
 */
function groupTokens(tokens: Token[]): GroupedTokens {
  const groups: GroupedTokens = {
    semantic: [],
    color: [],
    spacing: [],
    typography: [],
    radius: [],
    shadow: [],
    depth: [],
    motion: [],
    breakpoint: [],
    elevation: [],
    focus: [],
    other: [],
  };

  for (const token of tokens) {
    switch (token.namespace) {
      case 'semantic':
        groups.semantic.push(token);
        break;
      case 'color':
        groups.color.push(token);
        break;
      case 'spacing':
        groups.spacing.push(token);
        break;
      case 'typography':
        groups.typography.push(token);
        break;
      case 'radius':
        groups.radius.push(token);
        break;
      case 'shadow':
        groups.shadow.push(token);
        break;
      case 'depth':
        groups.depth.push(token);
        break;
      case 'motion':
        groups.motion.push(token);
        break;
      case 'breakpoint':
        groups.breakpoint.push(token);
        break;
      case 'elevation':
        groups.elevation.push(token);
        break;
      case 'focus':
        groups.focus.push(token);
        break;
      default:
        groups.other.push(token);
    }
  }

  return groups;
}

/**
 * Generate :root block with --rafters-* namespace and dark mode via media query
 */
function generateRootBlock(): string {
  const lines: string[] = [];
  lines.push(':root {');

  // Light mode --rafters-* tokens
  for (const [name, mapping] of Object.entries(RAFTERS_SEMANTIC_MAPPINGS)) {
    lines.push(`  --rafters-${name}: var(--color-${mapping.light});`);
  }

  lines.push('');

  // Dark mode --rafters-dark-* tokens
  for (const [name, mapping] of Object.entries(RAFTERS_SEMANTIC_MAPPINGS)) {
    lines.push(`  --rafters-dark-${name}: var(--color-${mapping.dark});`);
  }

  lines.push('');

  // Semantic tokens default to light mode
  for (const name of Object.keys(RAFTERS_SEMANTIC_MAPPINGS)) {
    lines.push(`  --${name}: var(--rafters-${name});`);
  }

  lines.push('');

  // Dark mode override via prefers-color-scheme
  lines.push('  @media (prefers-color-scheme: dark) {');
  for (const name of Object.keys(RAFTERS_SEMANTIC_MAPPINGS)) {
    lines.push(`    --${name}: var(--rafters-dark-${name});`);
  }
  lines.push('  }');

  lines.push('}');
  return lines.join('\n');
}

/**
 * Generate @theme block with raw color scales and utility tokens
 */
function generateThemeBlock(groups: GroupedTokens): string {
  const lines: string[] = [];
  lines.push('@theme {');

  // Color scales with --color- prefix
  if (groups.color.length > 0) {
    for (const token of groups.color) {
      const value = tokenValueToCSS(token);
      lines.push(`  --color-${token.name}: ${value};`);
    }
    lines.push('');
  }

  // Semantic color bridges (reference :root variables)
  for (const name of Object.keys(RAFTERS_SEMANTIC_MAPPINGS)) {
    lines.push(`  --color-${name}: var(--${name});`);
  }
  lines.push('');

  // Spacing tokens
  if (groups.spacing.length > 0) {
    for (const token of groups.spacing) {
      const value = tokenValueToCSS(token);
      lines.push(`  --spacing-${token.name}: ${value};`);
    }
    lines.push('');
  }

  // Typography tokens
  if (groups.typography.length > 0) {
    for (const token of groups.typography) {
      const value = tokenValueToCSS(token);
      lines.push(`  --${token.name}: ${value};`);
      if (token.lineHeight) {
        lines.push(`  --${token.name}--line-height: ${token.lineHeight};`);
      }
    }
    lines.push('');
  }

  // Radius tokens
  if (groups.radius.length > 0) {
    for (const token of groups.radius) {
      const value = tokenValueToCSS(token);
      lines.push(`  --radius-${token.name}: ${value};`);
    }
    lines.push('');
  }

  // Shadow tokens
  if (groups.shadow.length > 0) {
    for (const token of groups.shadow) {
      const value = tokenValueToCSS(token);
      lines.push(`  --shadow-${token.name}: ${value};`);
    }
    lines.push('');
  }

  // Depth (z-index) tokens
  if (groups.depth.length > 0) {
    for (const token of groups.depth) {
      const value = tokenValueToCSS(token);
      lines.push(`  --${token.name}: ${value};`);
    }
    lines.push('');
  }

  // Motion tokens
  if (groups.motion.length > 0) {
    for (const token of groups.motion) {
      const value = tokenValueToCSS(token);
      lines.push(`  --${token.name}: ${value};`);
    }
    lines.push('');
  }

  // Breakpoint tokens
  if (groups.breakpoint.length > 0) {
    for (const token of groups.breakpoint) {
      const value = tokenValueToCSS(token);
      lines.push(`  --${token.name}: ${value};`);
    }
    lines.push('');
  }

  // Elevation tokens
  if (groups.elevation.length > 0) {
    for (const token of groups.elevation) {
      const value = tokenValueToCSS(token);
      lines.push(`  --${token.name}: ${value};`);
    }
    lines.push('');
  }

  // Focus tokens
  if (groups.focus.length > 0) {
    for (const token of groups.focus) {
      const value = tokenValueToCSS(token);
      lines.push(`  --${token.name}: ${value};`);
    }
    lines.push('');
  }

  // Other tokens
  if (groups.other.length > 0) {
    for (const token of groups.other) {
      const value = tokenValueToCSS(token);
      lines.push(`  --${token.name}: ${value};`);
    }
  }

  lines.push('}');
  return lines.join('\n');
}

/**
 * Export tokens to Tailwind v4 CSS format
 *
 * @param tokens - Array of tokens to export
 * @param options - Export options
 * @returns Tailwind v4 compatible CSS string
 *
 * @example
 * ```typescript
 * import { generateBaseSystem } from '@rafters/design-tokens';
 * import { tokensToTailwind } from '@rafters/design-tokens/exporters';
 *
 * const result = generateBaseSystem();
 * const css = tokensToTailwind(result.allTokens);
 *
 * // Write to file
 * fs.writeFileSync('theme.css', css);
 * ```
 */
export function tokensToTailwind(tokens: Token[], options: TailwindExportOptions = {}): string {
  const { includeImport = true } = options;

  if (tokens.length === 0) {
    throw new Error('Registry is empty');
  }

  const groups = groupTokens(tokens);
  const sections: string[] = [];

  // Tailwind import
  if (includeImport) {
    sections.push('@import "tailwindcss";');
    sections.push('');
  }

  // @theme block with raw color scales and utility tokens
  const themeBlock = generateThemeBlock(groups);
  sections.push(themeBlock);
  sections.push('');

  // :root block with --rafters-* namespace and dark mode
  const rootBlock = generateRootBlock();
  sections.push(rootBlock);

  return sections.join('\n');
}

/**
 * Export registry tokens to Tailwind v4 CSS format
 *
 * This is the interface required by issue #392.
 *
 * @param registry - TokenRegistry containing tokens
 * @param options - Export options
 * @returns Tailwind v4 compatible CSS string
 *
 * @example
 * ```typescript
 * import { TokenRegistry } from '@rafters/design-tokens';
 * import { registryToTailwind } from '@rafters/design-tokens/exporters';
 *
 * const registry = new TokenRegistry(tokens);
 * const css = registryToTailwind(registry);
 *
 * await writeFile('.rafters/output/theme.css', css);
 * ```
 */
export function registryToTailwind(
  registry: TokenRegistry,
  options?: TailwindExportOptions,
): string {
  const tokens = registry.list();
  return tokensToTailwind(tokens, options);
}
