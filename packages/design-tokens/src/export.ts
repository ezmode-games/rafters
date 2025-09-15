/**
 * Token Export System
 *
 * Exports tokens from TokenRegistry to various CSS formats
 * Works with the registry as the source of truth, not JSON files directly
 *
 * Supports:
 * - Tailwind CSS v4 with proper @theme syntax
 * - Standard CSS custom properties
 * - React Native style objects (future)
 */

import type { ColorValue, Token } from '@rafters/shared';
import type { TokenRegistry } from './registry';

/**
 * Check if a value is a reference to another token
 */
function isTokenReference(value: string): boolean {
  return (
    typeof value === 'string' &&
    (value.startsWith('var(--') ||
      value.includes('-base') ||
      value.includes('-hover') ||
      value.includes('-focus'))
  );
}

/**
 * Convert a token value to CSS string
 * Handles both string values and ColorValue objects
 * Preserves CSS variable references for dependent tokens
 */
function tokenValueToCss(
  value: string | ColorValue,
  tokenName?: string,
  registry?: TokenRegistry
): string {
  if (typeof value === 'string') {
    // Check if this is a dependent token that references another token
    if (registry && tokenName && isTokenReference(value)) {
      // If value looks like a token name, convert to CSS variable reference
      const dependencies = registry.dependencyGraph.getDependencies(tokenName);
      if (dependencies.length > 0) {
        // This is a dependent token, reference its base
        const baseToken = dependencies[0];
        const rule = registry.dependencyGraph.getGenerationRule(tokenName);

        // For state tokens, reference the base color
        if (rule?.startsWith('state:')) {
          return `var(--color-${baseToken})`;
        }
        // For scale tokens, use the actual value
        // Scale tokens should have their own OKLCH values
      }
    }

    return value;
  }

  // Handle ColorValue object - extract the appropriate CSS value
  if (value.scale && value.scale.length > 0) {
    // Default to 500 position (index 5) for base color
    const targetIndex = 5;
    const targetOklch = value.scale[targetIndex] || value.scale[0];

    if (targetOklch) {
      const alpha =
        targetOklch.alpha !== undefined && targetOklch.alpha !== 1 ? ` / ${targetOklch.alpha}` : '';
      return `oklch(${targetOklch.l} ${targetOklch.c} ${targetOklch.h}${alpha})`;
    }
  }

  // Fallback
  return 'transparent';
}

/**
 * Export tokens to Tailwind CSS v4 format
 * Generates @theme block with proper CSS custom properties
 * Respects dependency relationships when ordering output
 */
export function exportToTailwindCSS(registry: TokenRegistry): string {
  // Get tokens in dependency order using topological sort
  const sortedTokenNames = registry.dependencyGraph.topologicalSort();
  const allTokens = registry.list();

  // Create a map for quick lookup
  const tokenMap = new Map<string, Token>();
  for (const token of allTokens) {
    tokenMap.set(token.name, token);
  }

  // Build ordered token list respecting dependencies
  const tokens: Token[] = [];
  const addedNames = new Set<string>();

  // First add tokens in dependency order
  for (const name of sortedTokenNames) {
    const token = tokenMap.get(name);
    if (token && !addedNames.has(name)) {
      tokens.push(token);
      addedNames.add(name);
    }
  }

  // Then add any remaining tokens not in dependency graph
  for (const token of allTokens) {
    if (!addedNames.has(token.name)) {
      tokens.push(token);
      addedNames.add(token.name);
    }
  }

  const lines: string[] = [];

  lines.push('@import "tailwindcss";');
  lines.push('');
  lines.push('@theme {');

  // Group tokens by category for organized output
  const tokensByCategory = new Map<string, Token[]>();
  for (const token of tokens) {
    const category = token.category;
    if (!tokensByCategory.has(category)) {
      tokensByCategory.set(category, []);
    }
    tokensByCategory.get(category)?.push(token);
  }

  // Process each category with proper Tailwind v4 naming
  for (const [category, categoryTokens] of tokensByCategory.entries()) {
    // For color category, we need to handle scales specially to avoid duplicates
    if (category === 'color') {
      const processedColors = new Set<string>();
      const scaleTokens = new Map<string, Token[]>(); // base name -> scale tokens
      const baseTokens: Token[] = [];

      // Group tokens by base name
      for (const token of categoryTokens) {
        const rule = registry.dependencyGraph.getGenerationRule(token.name);

        if (rule?.startsWith('scale:')) {
          // This is a scale token like "primary-500"
          const dependencies = registry.dependencyGraph.getDependencies(token.name);
          const baseTokenName = dependencies[0]; // Should be "primary"

          if (baseTokenName && !scaleTokens.has(baseTokenName)) {
            scaleTokens.set(baseTokenName, []);
          }
          if (baseTokenName) {
            scaleTokens.get(baseTokenName)?.push(token);
          }
        } else if (!rule || !rule.startsWith('state:')) {
          // This is a base token or standalone token
          baseTokens.push(token);
        }
        // Skip state tokens for now - handle them separately if needed
      }

      // Output base color tokens first
      for (const token of baseTokens) {
        if (processedColors.has(token.name)) continue;
        processedColors.add(token.name);

        const value = tokenValueToCss(token.value, token.name, registry);
        const cssVarName = `--color-${token.name}`;
        lines.push(`  ${cssVarName}: ${value};`);
      }

      // Output scale tokens as individual variables
      for (const [baseTokenName, scaleTokenArray] of scaleTokens.entries()) {
        if (processedColors.has(baseTokenName)) continue;
        processedColors.add(baseTokenName);

        // Sort scale tokens by scale number
        scaleTokenArray.sort((a, b) => {
          const aScale =
            registry.dependencyGraph.getGenerationRule(a.name)?.replace('scale:', '') || '0';
          const bScale =
            registry.dependencyGraph.getGenerationRule(b.name)?.replace('scale:', '') || '0';
          return Number.parseInt(aScale, 10) - Number.parseInt(bScale, 10);
        });

        for (const scaleToken of scaleTokenArray) {
          const rule = registry.dependencyGraph.getGenerationRule(scaleToken.name);
          const scaleNumber = rule?.replace('scale:', '') || '500';
          const value = tokenValueToCss(scaleToken.value, scaleToken.name, registry);
          const cssVarName = `--color-${baseTokenName}-${scaleNumber}`;
          lines.push(`  ${cssVarName}: ${value};`);
        }
      }

      lines.push('');
      continue; // Skip normal processing for color category
    }

    // Normal processing for non-color categories
    for (const token of categoryTokens) {
      const value = tokenValueToCss(token.value, token.name, registry);

      // Generate proper CSS variable name based on category
      let cssVarName: string;

      switch (category) {
        case 'color':
          cssVarName = `--color-${token.name}`;
          break;
        case 'spacing':
          cssVarName = `--spacing-${token.name}`;
          break;
        case 'font-size': {
          const textName = token.name.startsWith('text-')
            ? token.name.replace('text-', '')
            : token.name;
          cssVarName = `--text-${textName}`;
          break;
        }
        case 'font-weight':
          cssVarName = `--font-weight-${token.name}`;
          break;
        case 'font-family':
          cssVarName = `--font-${token.name}`;
          break;
        case 'border-radius':
          cssVarName = `--radius-${token.name}`;
          break;
        case 'shadow':
          cssVarName = `--shadow-${token.name}`;
          break;
        case 'z-index':
          cssVarName = `--z-${token.name}`;
          break;
        case 'opacity':
          cssVarName = `--opacity-${token.name}`;
          break;
        case 'motion':
        case 'easing':
          cssVarName = category === 'motion' ? `--duration-${token.name}` : `--ease-${token.name}`;
          break;
        case 'backdrop-blur':
          cssVarName = `--backdrop-blur-${token.name}`;
          break;
        case 'letter-spacing':
          cssVarName = `--tracking-${token.name}`;
          break;
        case 'line-height':
          cssVarName = `--leading-${token.name}`;
          break;
        case 'breakpoint':
          cssVarName = `--breakpoint-${token.name}`;
          break;
        case 'aspect-ratio':
          cssVarName = `--aspect-${token.name}`;
          break;
        case 'border-width':
          cssVarName = `--border-${token.name}`;
          break;
        default: {
          let cleanName = token.name;
          if (category === 'height' && token.name.startsWith('h-')) {
            cleanName = token.name.replace('h-', '');
          } else if (category === 'line-height' && token.name.startsWith('leading-')) {
            cleanName = token.name.replace('leading-', '');
          }
          cssVarName = `--${category}-${cleanName}`;
        }
      }

      lines.push(`  ${cssVarName}: ${value};`);
    }

    lines.push('');
  }

  // Close @theme block
  lines.push('}');
  lines.push('');

  const darkTokens = tokens.filter((t) => t.name.endsWith('-dark'));
  if (darkTokens.length > 0) {
    lines.push('.dark {');

    for (const token of darkTokens) {
      const lightName = token.name.replace('-dark', '');
      const value = tokenValueToCss(token.value);

      let cssVarName: string;
      switch (token.category) {
        case 'color':
          cssVarName = `--color-${lightName}`;
          break;
        default:
          cssVarName = `--${token.category}-${lightName}`;
      }

      lines.push(`  ${cssVarName}: ${value};`);
    }

    lines.push('}');
  }

  return lines.join('\n');
}

/**
 * Export tokens to standard CSS custom properties
 * For projects not using Tailwind
 */
export function exportToCSSVariables(registry: TokenRegistry): string {
  const tokens = registry.list();
  const lines: string[] = [];

  lines.push(':root {');

  const tokensByCategory = new Map<string, Token[]>();
  for (const token of tokens) {
    if (!tokensByCategory.has(token.category)) {
      tokensByCategory.set(token.category, []);
    }
    tokensByCategory.get(token.category)?.push(token);
  }

  for (const [category, categoryTokens] of tokensByCategory.entries()) {
    for (const token of categoryTokens) {
      const value = tokenValueToCss(token.value);
      const prefix = token.namespace || category;
      const cssVarName = `--${prefix}-${token.name}`;
      lines.push(`  ${cssVarName}: ${value};`);
    }

    lines.push('');
  }

  lines.push('}');

  return lines.join('\n');
}

/**
 * Export color scales from ColorValue objects
 * Generates all shades (50-950) as individual CSS variables
 */
export function exportColorScales(registry: TokenRegistry): string {
  const tokens = registry.list();
  const colorTokens = tokens.filter((t) => t.category === 'color');
  const lines: string[] = [];

  lines.push(':root {');

  for (const token of colorTokens) {
    if (typeof token.value === 'object' && 'scale' in token.value) {
      const colorValue = token.value as ColorValue;

      if (colorValue.scale && colorValue.scale.length > 0) {
        const scalePositions = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

        for (let i = 0; i < colorValue.scale.length && i < scalePositions.length; i++) {
          const position = scalePositions[i];
          const oklch = colorValue.scale[i];

          if (oklch) {
            const alpha = oklch.alpha !== undefined && oklch.alpha !== 1 ? ` / ${oklch.alpha}` : '';
            const cssValue = `oklch(${oklch.l} ${oklch.c} ${oklch.h}${alpha})`;

            lines.push(`  --color-${token.name}-${position}: ${cssValue};`);
          }
        }

        lines.push('');
      }
    }
  }

  lines.push('}');

  return lines.join('\n');
}

/**
 * Main export function that combines all exports based on format
 */
export function exportTokensFromRegistry(
  registry: TokenRegistry,
  format: 'tailwind' | 'css' | 'all' = 'tailwind'
): string {
  switch (format) {
    case 'tailwind':
      return exportToTailwindCSS(registry);

    case 'css':
      return exportToCSSVariables(registry);

    case 'all':
      // Export everything including color scales
      return [exportToTailwindCSS(registry), '', exportColorScales(registry)].join('\n');

    default:
      return exportToTailwindCSS(registry);
  }
}
