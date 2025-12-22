/**
 * Tailwind v4 CSS Exporter
 *
 * Converts TokenRegistry contents to Tailwind v4 CSS format with:
 * - @theme block for design system values
 * - :root semantic variables (shadcn compatible)
 * - @theme inline bridge pattern
 * - Dark mode support
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
  /** Include comments with token metadata */
  includeComments?: boolean;
  /** Dark mode selector (default: '.dark') */
  darkModeSelector?: string;
  /** Include @import "tailwindcss" at top */
  includeImport?: boolean;
}

/**
 * Token with optional theme variant for dark mode support
 */
interface TokenWithVariant extends Token {
  themeVariant?: 'light' | 'dark';
}

/**
 * Group tokens by their namespace and theme variant
 */
interface GroupedTokens {
  semantic: { light: TokenWithVariant[]; dark: TokenWithVariant[] };
  color: TokenWithVariant[];
  spacing: TokenWithVariant[];
  typography: TokenWithVariant[];
  radius: TokenWithVariant[];
  shadow: TokenWithVariant[];
  depth: TokenWithVariant[];
  motion: TokenWithVariant[];
  breakpoint: TokenWithVariant[];
  elevation: TokenWithVariant[];
  focus: TokenWithVariant[];
  other: TokenWithVariant[];
}

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
 * Convert token name to CSS custom property name
 */
function tokenToCSSVar(token: Token, prefix = ''): string {
  const name = token.name;
  if (prefix) {
    return `--${prefix}-${name}`;
  }
  return `--${name}`;
}

/**
 * Group tokens by namespace and theme variant
 */
function groupTokens(tokens: Token[]): GroupedTokens {
  const groups: GroupedTokens = {
    semantic: { light: [], dark: [] },
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
    const tokenWithVariant = token as TokenWithVariant;

    switch (token.namespace) {
      case 'semantic':
        if (tokenWithVariant.themeVariant === 'dark') {
          groups.semantic.dark.push(tokenWithVariant);
        } else {
          groups.semantic.light.push(tokenWithVariant);
        }
        break;
      case 'color':
        groups.color.push(tokenWithVariant);
        break;
      case 'spacing':
        groups.spacing.push(tokenWithVariant);
        break;
      case 'typography':
        groups.typography.push(tokenWithVariant);
        break;
      case 'radius':
        groups.radius.push(tokenWithVariant);
        break;
      case 'shadow':
        groups.shadow.push(tokenWithVariant);
        break;
      case 'depth':
        groups.depth.push(tokenWithVariant);
        break;
      case 'motion':
        groups.motion.push(tokenWithVariant);
        break;
      case 'breakpoint':
        groups.breakpoint.push(tokenWithVariant);
        break;
      case 'elevation':
        groups.elevation.push(tokenWithVariant);
        break;
      case 'focus':
        groups.focus.push(tokenWithVariant);
        break;
      default:
        groups.other.push(tokenWithVariant);
    }
  }

  return groups;
}

/**
 * Generate :root block with semantic tokens
 */
function generateRootBlock(tokens: Token[], includeComments: boolean): string {
  if (tokens.length === 0) return '';

  const lines: string[] = [];
  lines.push(':root {');

  for (const token of tokens) {
    const value = tokenValueToCSS(token);
    const varName = tokenToCSSVar(token);

    if (includeComments && token.description) {
      lines.push(`  /* ${token.description} */`);
    }
    lines.push(`  ${varName}: ${value};`);
  }

  lines.push('}');
  return lines.join('\n');
}

/**
 * Generate dark mode block with semantic overrides
 */
function generateDarkBlock(tokens: Token[], selector: string, includeComments: boolean): string {
  if (tokens.length === 0) return '';

  const lines: string[] = [];
  lines.push(`${selector} {`);

  for (const token of tokens) {
    const value = tokenValueToCSS(token);
    const varName = tokenToCSSVar(token);

    if (includeComments && token.description) {
      lines.push(`  /* ${token.description} */`);
    }
    lines.push(`  ${varName}: ${value};`);
  }

  lines.push('}');
  return lines.join('\n');
}

/**
 * Generate @theme inline block with utility bridges
 */
function generateThemeBlock(groups: GroupedTokens, includeComments: boolean): string {
  const lines: string[] = [];
  lines.push('@theme inline {');

  // Color scales with --color- prefix
  if (groups.color.length > 0) {
    if (includeComments) lines.push('  /* Color scales */');
    for (const token of groups.color) {
      const value = tokenValueToCSS(token);
      lines.push(`  --color-${token.name}: ${value};`);
    }
    lines.push('');
  }

  // Semantic color bridges (reference :root variables)
  if (groups.semantic.light.length > 0) {
    if (includeComments) lines.push('  /* Semantic color bridges */');
    for (const token of groups.semantic.light) {
      if (token.category === 'color') {
        lines.push(`  --color-${token.name}: var(--${token.name});`);
      }
    }
    lines.push('');
  }

  // Spacing tokens
  if (groups.spacing.length > 0) {
    if (includeComments) lines.push('  /* Spacing */');
    for (const token of groups.spacing) {
      const value = tokenValueToCSS(token);
      lines.push(`  --${token.name}: ${value};`);
    }
    lines.push('');
  }

  // Typography tokens
  if (groups.typography.length > 0) {
    if (includeComments) lines.push('  /* Typography */');
    for (const token of groups.typography) {
      const value = tokenValueToCSS(token);
      lines.push(`  --${token.name}: ${value};`);

      // Add companion line-height if present
      if (token.lineHeight) {
        lines.push(`  --${token.name}--line-height: ${token.lineHeight};`);
      }
    }
    lines.push('');
  }

  // Radius tokens
  if (groups.radius.length > 0) {
    if (includeComments) lines.push('  /* Border radius */');
    for (const token of groups.radius) {
      const value = tokenValueToCSS(token);
      lines.push(`  --${token.name}: ${value};`);
    }
    lines.push('');
  }

  // Shadow tokens
  if (groups.shadow.length > 0) {
    if (includeComments) lines.push('  /* Shadows */');
    for (const token of groups.shadow) {
      const value = tokenValueToCSS(token);
      lines.push(`  --${token.name}: ${value};`);
    }
    lines.push('');
  }

  // Depth (z-index) tokens
  if (groups.depth.length > 0) {
    if (includeComments) lines.push('  /* Z-index / Depth */');
    for (const token of groups.depth) {
      const value = tokenValueToCSS(token);
      lines.push(`  --${token.name}: ${value};`);
    }
    lines.push('');
  }

  // Motion tokens (duration, easing, delay)
  if (groups.motion.length > 0) {
    if (includeComments) lines.push('  /* Motion */');
    for (const token of groups.motion) {
      const value = tokenValueToCSS(token);
      lines.push(`  --${token.name}: ${value};`);
    }
    lines.push('');
  }

  // Breakpoint tokens
  if (groups.breakpoint.length > 0) {
    if (includeComments) lines.push('  /* Breakpoints */');
    for (const token of groups.breakpoint) {
      const value = tokenValueToCSS(token);
      lines.push(`  --${token.name}: ${value};`);
    }
    lines.push('');
  }

  // Elevation tokens
  if (groups.elevation.length > 0) {
    if (includeComments) lines.push('  /* Elevation */');
    for (const token of groups.elevation) {
      const value = tokenValueToCSS(token);
      lines.push(`  --${token.name}: ${value};`);
    }
    lines.push('');
  }

  // Focus tokens
  if (groups.focus.length > 0) {
    if (includeComments) lines.push('  /* Focus rings */');
    for (const token of groups.focus) {
      const value = tokenValueToCSS(token);
      lines.push(`  --${token.name}: ${value};`);
    }
    lines.push('');
  }

  // Other tokens
  if (groups.other.length > 0) {
    if (includeComments) lines.push('  /* Other */');
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
  const { includeComments = false, darkModeSelector = '.dark', includeImport = true } = options;

  if (tokens.length === 0) {
    throw new Error('Registry is empty');
  }

  const groups = groupTokens(tokens);
  const sections: string[] = [];

  // Header comment
  sections.push('/* Generated by Rafters - DO NOT EDIT */');

  // Tailwind import
  if (includeImport) {
    sections.push('@import "tailwindcss";');
  }

  sections.push('');

  // :root block with semantic tokens (light mode)
  const rootBlock = generateRootBlock(groups.semantic.light, includeComments);
  if (rootBlock) {
    sections.push(rootBlock);
    sections.push('');
  }

  // .dark block with semantic overrides
  const darkBlock = generateDarkBlock(groups.semantic.dark, darkModeSelector, includeComments);
  if (darkBlock) {
    sections.push(darkBlock);
    sections.push('');
  }

  // @theme inline block with utility bridges
  const themeBlock = generateThemeBlock(groups, includeComments);
  sections.push(themeBlock);

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
