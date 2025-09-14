/**
 * Complete Tailwind CSS v4 Exporter - Registry-Based
 *
 * Generates complete globals.css file with:
 * - @theme block with all tokens from registry
 * - @theme inline for Tailwind class mappings
 * - :root block for semantic token assignments
 * - @media dark mode block
 * - All keyframes for animations
 * - Container queries with proper sizing
 *
 * Uses TokenRegistry as single source of truth for ALL tokens
 */

import type { ColorValue, Token } from '@rafters/shared';
import type { TokenRegistry } from '../registry.js';

/**
 * Convert token value to CSS, handling ColorValue objects and references
 */
function tokenValueToCss(value: string | ColorValue, _tokenName?: string): string {
  if (typeof value === 'string') {
    return value;
  }

  // Handle ColorValue object - use the value or default to oklch from scale
  if (value.scale && value.scale.length > 0) {
    const targetIndex = 5; // Default to 500 position
    const targetOklch = value.scale[targetIndex] || value.scale[0];

    if (targetOklch) {
      const alpha =
        targetOklch.alpha !== undefined && targetOklch.alpha !== 1 ? ` / ${targetOklch.alpha}` : '';
      return `oklch(${targetOklch.l} ${targetOklch.c} ${targetOklch.h}${alpha})`;
    }
  }

  return 'transparent';
}

/**
 * Generate @theme block with ALL tokens from registry
 * Includes: colors (with scales + states), spacing, typography, etc.
 */
function generateThemeBlock(registry: TokenRegistry): string[] {
  const lines: string[] = ['@theme {'];

  // Get all tokens in dependency order
  const sortedTokenNames = registry.dependencyGraph.topologicalSort();
  const allTokens = registry.list();
  const tokenMap = Array.from(allTokens).reduce(
    (map, token) => map.set(token.name, token),
    new Map<string, Token>()
  );
  // Group tokens by category for organized output
  const tokensByCategory = new Map<string, Token[]>();

  for (const tokenName of sortedTokenNames) {
    const token = tokenMap.get(tokenName);
    if (!token) continue;

    const category = token.category;
    if (!tokensByCategory.has(category)) {
      tokensByCategory.set(category, []);
    }
    tokensByCategory.get(category)!.push(token);
  }

  // Add remaining tokens not in dependency graph
  for (const token of allTokens) {
    const category = token.category;
    if (!tokensByCategory.has(category)) {
      tokensByCategory.set(category, []);
    }
    const categoryTokens = tokensByCategory.get(category)!;
    if (!categoryTokens.some((t) => t.name === token.name)) {
      categoryTokens.push(token);
    }
  }

  // Process categories in logical order
  const categoryOrder = [
    'color',
    'spacing',
    'font-size',
    'font-weight',
    'font-family',
    'line-height',
    'letter-spacing',
    'border-radius',
    'border-width',
    'shadow',
    'opacity',
    'z-index',
    'motion',
    'easing',
    'backdrop-blur',
    'breakpoint',
    'container',
    'aspect-ratio',
    'height',
    'width',
    'grid-template-columns',
    'grid-template-rows',
    'rotate',
    'scale',
    'translate',
    'touch-target',
  ];

  for (const category of categoryOrder) {
    const categoryTokens = tokensByCategory.get(category);
    if (!categoryTokens || categoryTokens.length === 0) continue;

    lines.push(`  /* ${category} tokens */`);

    if (category === 'color') {
      // Two-pass color generation

      // PASS 1: Generate clean color family scales
      lines.push('  /* Color family scales */');
      const colorFamilies = new Map<string, Token>();
      const processedFamilies = new Set<string>();

      // Collect actual color family tokens (those with -number suffixes like neutral-50)
      // These represent true color scale families, not semantic tokens
      for (const token of categoryTokens) {
        // Only process tokens that end with a number (like neutral-50, primary-100)
        // These are the actual color family scale tokens
        if (token.name.match(/-\d+$/)) {
          if (typeof token.value === 'object' && token.value !== null && 'scale' in token.value) {
            const colorValue = token.value as ColorValue;
            if (colorValue.scale && colorValue.scale.length > 0) {
              // Extract the color family name (remove the -50, -100 suffixes)
              const familyName = token.name.replace(/-\d+$/, '');
              if (!processedFamilies.has(familyName)) {
                colorFamilies.set(familyName, token);
                processedFamilies.add(familyName);
              }
            }
          }
        }
      }

      // Generate scales for each color family
      for (const [familyName, token] of colorFamilies.entries()) {
        const colorValue = token.value as ColorValue;
        const standardScale = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

        for (let i = 0; i < Math.min(colorValue.scale.length, standardScale.length); i++) {
          const scaleNumber = standardScale[i];
          const oklch = colorValue.scale[i];
          if (oklch) {
            const alpha = oklch.alpha !== undefined && oklch.alpha !== 1 ? ` / ${oklch.alpha}` : '';
            const scaleValue = `oklch(${oklch.l} ${oklch.c} ${oklch.h}${alpha})`;
            lines.push(`  --color-${familyName}-${scaleNumber}: ${scaleValue};`);
          }
        }

        // Generate state variants if states exist
        if ('states' in colorValue && colorValue.states) {
          for (const [state, stateValue] of Object.entries(colorValue.states)) {
            lines.push(`  --color-${familyName}-${state}: ${stateValue};`);
          }
        }
      }

      lines.push('');

      // PASS 2: Semantic rafters assignments
      lines.push('  /* Rafters semantic color assignments */');
      for (const token of categoryTokens) {
        // Only process semantic tokens (not base color families)
        const rule = registry.dependencyGraph.getGenerationRule(token.name);
        const isColorFamily = colorFamilies.has(token.name);
        const isScaleToken = rule?.startsWith('scale:');
        const isStateToken = rule?.startsWith('state:');
        const isNumberedToken = token.name.match(/-\d+$/); // Skip numbered tokens like neutral-50

        // Process semantic tokens (not color families, scale tokens, state tokens, or numbered tokens)
        if (!isColorFamily && !isScaleToken && !isStateToken && !isNumberedToken) {
          // This is a semantic token like "primary", "background", etc.
          if (typeof token.value === 'string') {
            // Check if it's a color family reference like "stone-500"
            if (token.value.includes('-') && token.value.match(/^[a-z]+-\d+$/)) {
              // Color family reference - use CSS variable reference
              lines.push(`  --rafters-${token.name}: var(--color-${token.value});`);
            } else {
              // Direct OKLCH value or other string
              lines.push(`  --rafters-${token.name}: ${token.value};`);
            }
          } else if (typeof token.value === 'object' && token.value !== null) {
            // ColorValue object - resolve to actual OKLCH value
            const colorValue = token.value as ColorValue;

            if (colorValue.value && typeof colorValue.value === 'string') {
              // Check if it's a reference like "amethyst-500" or just a scale position like "500"
              if (colorValue.value.includes('-')) {
                // Reference to another color family like "amethyst-500"
                lines.push(`  --rafters-${token.name}: var(--color-${colorValue.value});`);
              } else if (colorValue.value.match(/^\d+$/)) {
                // Scale position like "500" - need to resolve to OKLCH from the scale
                const scalePosition = Number.parseInt(colorValue.value, 10);
                const standardScale = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
                const scaleIndex = standardScale.indexOf(scalePosition);

                if (scaleIndex !== -1 && colorValue.scale && colorValue.scale[scaleIndex]) {
                  const oklch = colorValue.scale[scaleIndex];
                  const alpha =
                    oklch.alpha !== undefined && oklch.alpha !== 1 ? ` / ${oklch.alpha}` : '';
                  const scaleValue = `oklch(${oklch.l} ${oklch.c} ${oklch.h}${alpha})`;
                  lines.push(`  --rafters-${token.name}: ${scaleValue};`);
                } else if (colorValue.scale && colorValue.scale.length > 0) {
                  // Fallback to middle of scale
                  const fallbackIndex = Math.floor(colorValue.scale.length / 2);
                  const oklch = colorValue.scale[fallbackIndex];
                  const alpha =
                    oklch.alpha !== undefined && oklch.alpha !== 1 ? ` / ${oklch.alpha}` : '';
                  const scaleValue = `oklch(${oklch.l} ${oklch.c} ${oklch.h}${alpha})`;
                  lines.push(`  --rafters-${token.name}: ${scaleValue};`);
                }
              } else {
                // Direct OKLCH value or other format
                lines.push(`  --rafters-${token.name}: ${colorValue.value};`);
              }
            } else if (colorValue.scale && colorValue.scale.length > 0) {
              // No value field, use middle of scale (index 5 = 500)
              const targetIndex = 5;
              const oklch =
                colorValue.scale[targetIndex] ||
                colorValue.scale[Math.floor(colorValue.scale.length / 2)];
              if (oklch) {
                const alpha =
                  oklch.alpha !== undefined && oklch.alpha !== 1 ? ` / ${oklch.alpha}` : '';
                const scaleValue = `oklch(${oklch.l} ${oklch.c} ${oklch.h}${alpha})`;
                lines.push(`  --rafters-${token.name}: ${scaleValue};`);
              }
            }
          }
        }
      }
    } else {
      // Standard token processing for non-color categories
      for (const token of categoryTokens) {
        const value = tokenValueToCss(token.value, token.name);
        let cssVarName: string;

        switch (category) {
          case 'spacing':
            cssVarName = `--spacing-${token.name}`;
            break;
          case 'font-size':
            cssVarName = `--text-${token.name}`;
            break;
          case 'font-weight':
            cssVarName = `--font-weight-${token.name}`;
            break;
          case 'font-family':
            cssVarName = `--font-${token.name}`;
            break;
          case 'line-height':
            cssVarName = `--leading-${token.name}`;
            break;
          case 'letter-spacing':
            cssVarName = `--tracking-${token.name}`;
            break;
          case 'border-radius':
            cssVarName = `--radius-${token.name}`;
            break;
          case 'border-width':
            cssVarName = `--border-${token.name}`;
            break;
          case 'shadow':
            cssVarName = `--shadow-${token.name}`;
            break;
          case 'opacity':
            cssVarName = `--opacity-${token.name}`;
            break;
          case 'z-index':
            cssVarName = `--z-${token.name}`;
            break;
          case 'motion':
            cssVarName = `--duration-${token.name}`;
            break;
          case 'easing':
            cssVarName = `--ease-${token.name}`;
            break;
          case 'backdrop-blur':
            cssVarName = `--backdrop-blur-${token.name}`;
            break;
          case 'breakpoint':
            cssVarName = `--breakpoint-${token.name}`;
            break;
          case 'container':
            cssVarName = `--container-${token.name}`;
            break;
          case 'aspect-ratio':
            cssVarName = `--aspect-${token.name}`;
            break;
          case 'height':
            cssVarName = `--height-${token.name}`;
            break;
          case 'width':
            cssVarName = `--width-${token.name}`;
            break;
          case 'grid-template-columns':
            cssVarName = `--grid-cols-${token.name}`;
            break;
          case 'grid-template-rows':
            cssVarName = `--grid-rows-${token.name}`;
            break;
          case 'rotate':
            cssVarName = `--rotate-${token.name}`;
            break;
          case 'scale':
            cssVarName = `--scale-${token.name}`;
            break;
          case 'translate':
            cssVarName = `--translate-${token.name}`;
            break;
          case 'touch-target':
            cssVarName = `--touch-${token.name}`;
            break;
          default:
            cssVarName = `--${category}-${token.name}`;
        }

        lines.push(`  ${cssVarName}: ${value};`);
      }
    }

    lines.push('');
  }

  lines.push('}');
  return lines;
}

/**
 * Generate @theme inline block for Tailwind theme system mappings
 */
function generateThemeInlineBlock(registry: TokenRegistry): string[] {
  const lines = ['@theme inline {', '  /* Map Tailwind theme system to rafters semantics */'];

  // Get all color tokens for semantic mappings
  const allTokens = registry.list();
  const colorTokens = allTokens.filter((token) => token.category === 'color');

  // Map semantic tokens to Tailwind theme system
  const semanticMappings = [
    'background',
    'foreground',
    'card',
    'card-foreground',
    'popover',
    'popover-foreground',
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
    'border',
    'input',
    'ring',
    'chart-1',
    'chart-2',
    'chart-3',
    'chart-4',
    'chart-5',
  ];

  for (const semantic of semanticMappings) {
    // Check if we have this semantic token
    const hasToken = colorTokens.some((token) => token.name === semantic);
    if (hasToken) {
      lines.push(`  --color-${semantic}: var(--rafters-${semantic});`);
    }
  }

  lines.push('}');
  lines.push('');
  return lines;
}

/**
 * Generate :root block for semantic token assignments
 */
function generateRootBlock(registry: TokenRegistry): string[] {
  const lines: string[] = [':root {'];

  // Get all tokens and find semantic assignments
  const allTokens = registry.list();
  const semanticMappings = new Map<string, string>();

  // Build semantic mappings from token names and usage
  for (const token of allTokens) {
    if (token.category === 'color') {
      const rule = registry.dependencyGraph.getGenerationRule(token.name);

      if (!rule || (!rule.startsWith('state:') && !rule.startsWith('scale:'))) {
        // Base color token - create semantic mapping
        semanticMappings.set(`--${token.name}`, `var(--rafters-${token.name})`);

        // Check for semantic assignments in token metadata
        if (token.semanticMeaning?.includes('background')) {
          semanticMappings.set('--background', `var(--rafters-${token.name})`);
        }
        if (
          token.semanticMeaning?.includes('foreground') ||
          token.semanticMeaning?.includes('text')
        ) {
          semanticMappings.set('--foreground', `var(--rafters-${token.name})`);
        }
      }
    }
  }

  // Default semantic mappings if not found in tokens
  const defaultMappings = [
    ['--background', 'var(--rafters-background)'],
    ['--foreground', 'var(--rafters-foreground)'],
    ['--card', 'var(--rafters-card)'],
    ['--card-foreground', 'var(--rafters-card-foreground)'],
    ['--popover', 'var(--rafters-popover)'],
    ['--popover-foreground', 'var(--rafters-popover-foreground)'],
    ['--primary', 'var(--rafters-primary)'],
    ['--primary-foreground', 'var(--rafters-primary-foreground)'],
    ['--secondary', 'var(--rafters-secondary)'],
    ['--secondary-foreground', 'var(--rafters-secondary-foreground)'],
    ['--muted', 'var(--rafters-muted)'],
    ['--muted-foreground', 'var(--rafters-muted-foreground)'],
    ['--accent', 'var(--rafters-accent)'],
    ['--accent-foreground', 'var(--rafters-accent-foreground)'],
    ['--destructive', 'var(--rafters-destructive)'],
    ['--destructive-foreground', 'var(--rafters-destructive-foreground)'],
    ['--border', 'var(--rafters-border)'],
    ['--input', 'var(--rafters-input)'],
    ['--ring', 'var(--rafters-ring)'],
    ['--chart-1', 'var(--rafters-chart-1)'],
    ['--chart-2', 'var(--rafters-chart-2)'],
    ['--chart-3', 'var(--rafters-chart-3)'],
    ['--chart-4', 'var(--rafters-chart-4)'],
    ['--chart-5', 'var(--rafters-chart-5)'],
    ['--radius', 'var(--radius-md)'],
  ];

  for (const [semantic, value] of defaultMappings) {
    if (!semanticMappings.has(semantic)) {
      semanticMappings.set(semantic, value);
    }
  }

  // Output all semantic mappings
  for (const [semantic, value] of semanticMappings.entries()) {
    lines.push(`  ${semantic}: ${value};`);
  }

  lines.push('}');
  return lines;
}

/**
 * Generate @media dark mode block
 */
function generateDarkModeBlock(registry: TokenRegistry): string[] {
  const lines: string[] = ['@media (prefers-color-scheme: dark) {', '  :root {'];

  // Find all dark tokens
  const allTokens = registry.list();
  const darkTokens = allTokens.filter((token) => token.name.endsWith('-dark'));

  for (const token of darkTokens) {
    const lightName = token.name.replace('-dark', '');
    // Check if token value is a string reference to a color family
    if (typeof token.value === 'string' && token.value.match(/^[a-z]+-\d+$/)) {
      // It's a color family reference, use var()
      lines.push(`    --rafters-${lightName}: var(--color-${token.value});`);
    } else {
      // Direct value
      const value = tokenValueToCss(token.value);
      lines.push(`    --rafters-${lightName}: ${value};`);
    }
  }

  lines.push('  }');
  lines.push('}');
  return lines;
}

/**
 * Generate keyframe animations
 */
function generateKeyframes(): string[] {
  return [
    '/* Keyframe Animations */',
    '@keyframes accordion-down {',
    '  from { height: 0; }',
    '  to { height: var(--radix-accordion-content-height); }',
    '}',
    '',
    '@keyframes accordion-up {',
    '  from { height: var(--radix-accordion-content-height); }',
    '  to { height: 0; }',
    '}',
    '',
    '@keyframes collapsible-down {',
    '  from { height: 0; }',
    '  to { height: var(--radix-collapsible-content-height); }',
    '}',
    '',
    '@keyframes collapsible-up {',
    '  from { height: var(--radix-collapsible-content-height); }',
    '  to { height: 0; }',
    '}',
    '',
    '@keyframes fade-in {',
    '  from { opacity: 0; }',
    '  to { opacity: 1; }',
    '}',
    '',
    '@keyframes fade-out {',
    '  from { opacity: 1; }',
    '  to { opacity: 0; }',
    '}',
    '',
    '@keyframes slide-in-from-top {',
    '  from { transform: translateY(-100%); }',
    '  to { transform: translateY(0); }',
    '}',
    '',
    '@keyframes slide-in-from-bottom {',
    '  from { transform: translateY(100%); }',
    '  to { transform: translateY(0); }',
    '}',
    '',
    '@keyframes slide-in-from-left {',
    '  from { transform: translateX(-100%); }',
    '  to { transform: translateX(0); }',
    '}',
    '',
    '@keyframes slide-in-from-right {',
    '  from { transform: translateX(100%); }',
    '  to { transform: translateX(0); }',
    '}',
    '',
    '@keyframes slide-out-to-top {',
    '  from { transform: translateY(0); }',
    '  to { transform: translateY(-100%); }',
    '}',
    '',
    '@keyframes slide-out-to-bottom {',
    '  from { transform: translateY(0); }',
    '  to { transform: translateY(100%); }',
    '}',
    '',
    '@keyframes slide-out-to-left {',
    '  from { transform: translateX(0); }',
    '  to { transform: translateX(-100%); }',
    '}',
    '',
    '@keyframes slide-out-to-right {',
    '  from { transform: translateX(0); }',
    '  to { transform: translateX(100%); }',
    '}',
    '',
    '@keyframes zoom-in {',
    '  from { transform: scale(0.95); }',
    '  to { transform: scale(1); }',
    '}',
    '',
    '@keyframes zoom-out {',
    '  from { transform: scale(1); }',
    '  to { transform: scale(0.95); }',
    '}',
    '',
  ];
}

/**
 * Generate container query utilities
 */
function generateContainerQueries(registry: TokenRegistry): string[] {
  const lines: string[] = [
    '/* Container Queries */',
    '.container-query-inline-size { container-type: inline-size; }',
    '.container-query-block-size { container-type: block-size; }',
    '.container-query-size { container-type: size; }',
    '.container-query-normal { container-type: normal; }',
    '',
  ];

  // Get container tokens for breakpoints
  const allTokens = registry.list();
  const containerTokens = allTokens.filter((token) => token.category === 'container');

  for (const token of containerTokens) {
    const size = token.value as string;
    lines.push(`@container (min-width: ${size}) {`);
    lines.push(`  .container\\:${token.name}\\:block { display: block; }`);
    lines.push(`  .container\\:${token.name}\\:hidden { display: none; }`);
    lines.push(`  .container\\:${token.name}\\:flex { display: flex; }`);
    lines.push(`  .container\\:${token.name}\\:grid { display: grid; }`);
    lines.push('}');
    lines.push('');
  }

  return lines;
}

/**
 * Generate custom utility classes
 */
function generateCustomUtilities(): string[] {
  return [
    '/* Custom Utility Classes */',
    '.animate-accordion-down { animation: accordion-down 0.2s ease-out; }',
    '.animate-accordion-up { animation: accordion-up 0.2s ease-out; }',
    '.animate-collapsible-down { animation: collapsible-down 0.2s ease-out; }',
    '.animate-collapsible-up { animation: collapsible-up 0.2s ease-out; }',
    '.animate-fade-in { animation: fade-in 0.2s ease-out; }',
    '.animate-fade-out { animation: fade-out 0.2s ease-out; }',
    '.animate-slide-in-from-top { animation: slide-in-from-top 0.2s ease-out; }',
    '.animate-slide-in-from-bottom { animation: slide-in-from-bottom 0.2s ease-out; }',
    '.animate-slide-in-from-left { animation: slide-in-from-left 0.2s ease-out; }',
    '.animate-slide-in-from-right { animation: slide-in-from-right 0.2s ease-out; }',
    '.animate-slide-out-to-top { animation: slide-out-to-top 0.2s ease-out; }',
    '.animate-slide-out-to-bottom { animation: slide-out-to-bottom 0.2s ease-out; }',
    '.animate-slide-out-to-left { animation: slide-out-to-left 0.2s ease-out; }',
    '.animate-slide-out-to-right { animation: slide-out-to-right 0.2s ease-out; }',
    '.animate-zoom-in { animation: zoom-in 0.2s ease-out; }',
    '.animate-zoom-out { animation: zoom-out 0.2s ease-out; }',
    '',
  ];
}

/**
 * Complete Tailwind CSS v4 export from TokenRegistry
 * Generates full globals.css file structure
 */
export function exportToTailwindV4Complete(registry: TokenRegistry): string {
  const sections: string[][] = [];

  // Generate all sections
  sections.push(['@import "tailwindcss";', '']);
  sections.push(generateThemeBlock(registry));
  sections.push(['']);
  sections.push(generateThemeInlineBlock(registry));
  sections.push(generateRootBlock(registry));
  sections.push(['']);
  sections.push(generateDarkModeBlock(registry));
  sections.push(['']);
  sections.push(generateKeyframes());
  sections.push(generateContainerQueries(registry));
  sections.push(generateCustomUtilities());

  // Flatten and join all sections
  return sections.flat().join('\n');
}
