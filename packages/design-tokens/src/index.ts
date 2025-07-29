/**
 * @rafters/design-tokens
 *
 * Generated design systems and semantic tokens for the Rafters AI intelligence system.
 * This package manages design token generation and Tailwind CSS output.
 */

import { generateLightnessScale, generateSemanticColors, oklchToCSS } from '@rafters/color-utils';
import type { DesignSystem, OKLCH, SemanticToken } from '@rafters/shared';

/**
 * Generate complete design system from primary color
 */
export function generateDesignSystem(
  primaryColor: OKLCH,
  config: {
    name: string;
    typography?: {
      heading: string;
      body: string;
      mono: string;
    };
  }
): DesignSystem {
  const id = generateSystemId(config.name);
  const primaryScale = generateLightnessScale(primaryColor);
  const semanticColors = generateSemanticColors(primaryColor);

  // Generate tokens
  const tokens: SemanticToken[] = [
    // Primary color scale
    ...Object.entries(primaryScale).map(([scale, color]) => ({
      name: `primary-${scale}`,
      value: oklchToCSS(color),
      type: 'color' as const,
      semantic: `Primary color scale step ${scale}`,
      aiIntelligence: scale === '500' ? 'Base primary color - use for main actions' : undefined,
    })),

    // Semantic colors
    {
      name: 'success',
      value: oklchToCSS(semanticColors.success),
      type: 'color' as const,
      semantic: 'Success state color',
      aiIntelligence: 'Use for positive feedback, confirmations, and success states',
    },
    {
      name: 'warning',
      value: oklchToCSS(semanticColors.warning),
      type: 'color' as const,
      semantic: 'Warning state color',
      aiIntelligence: 'Use for cautionary feedback and attention-needed states',
    },
    {
      name: 'danger',
      value: oklchToCSS(semanticColors.danger),
      type: 'color' as const,
      semantic: 'Error/danger state color',
      aiIntelligence: 'Use for errors, destructive actions - requires confirmation UX',
    },
    {
      name: 'info',
      value: oklchToCSS(semanticColors.info),
      type: 'color' as const,
      semantic: 'Information state color',
      aiIntelligence: 'Use for neutral information and secondary content',
    },

    // Typography scale
    {
      name: 'text-display',
      value: '3.052rem',
      type: 'typography' as const,
      semantic: 'Display text for hero sections',
      aiIntelligence: 'Use sparingly for hero headings and marketing content',
    },
    {
      name: 'text-h1',
      value: '2.441rem',
      type: 'typography' as const,
      semantic: 'H1 headings',
      aiIntelligence: 'Use for page titles - one per page',
    },
    {
      name: 'text-h2',
      value: '1.953rem',
      type: 'typography' as const,
      semantic: 'H2 section headings',
      aiIntelligence: 'Use for major sections and content groupings',
    },
    {
      name: 'text-body',
      value: '1rem',
      type: 'typography' as const,
      semantic: 'Body text',
      aiIntelligence: 'Base reading size - minimum 16px for accessibility',
    },

    // Spacing scale (φ-based)
    {
      name: 'spacing-xs',
      value: '0.25rem',
      type: 'spacing' as const,
      semantic: 'Extra small spacing',
      aiIntelligence: 'Minimal spacing for tight layouts and fine details',
    },
    {
      name: 'spacing-sm',
      value: '0.5rem',
      type: 'spacing' as const,
      semantic: 'Small spacing',
      aiIntelligence: 'Compact spacing for dense interfaces',
    },
    {
      name: 'spacing-md',
      value: '1rem',
      type: 'spacing' as const,
      semantic: 'Medium spacing',
      aiIntelligence: 'Standard spacing for balanced layouts',
    },
    {
      name: 'spacing-lg',
      value: '1.618rem',
      type: 'spacing' as const,
      semantic: 'Large spacing',
      aiIntelligence: 'Generous spacing for breathing room and emphasis',
    },
  ];

  return {
    id,
    name: config.name,
    primaryColor,
    tokens,
    typography: {
      heading: config.typography?.heading || 'Inter',
      body: config.typography?.body || 'Source Serif Pro',
      mono: config.typography?.mono || 'Fira Code',
      scale: {
        display: 3.052,
        h1: 2.441,
        h2: 1.953,
        h3: 1.563,
        h4: 1.25,
        body: 1,
        small: 0.8,
      },
    },
    intelligence: {
      colorVisionTested: ['normal', 'deuteranopia', 'protanopia', 'tritanopia'],
      contrastLevel: 'AAA',
      components: {}, // Will be populated by component library
    },
    metadata: {
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      version: '0.1.0',
    },
  };
}

/**
 * Export design system as vanilla CSS custom properties
 */
export function exportToCSS(system: DesignSystem): string {
  const colorTokens = system.tokens.filter((token) => token.type === 'color');
  const spacingTokens = system.tokens.filter((token) => token.type === 'spacing');
  const typographyTokens = system.tokens.filter((token) => token.type === 'typography');

  return `:root {
  /* Generated by Rafters AI Design Intelligence System */
  /* System: ${system.name} (${system.id}) */
  
  /* Color System (OKLCH) */
${colorTokens.map((token) => `  --color-${token.name}: ${token.value};`).join('\n')}
  
  /* Typography */
  --font-heading: '${system.typography.heading}', system-ui, sans-serif;
  --font-body: '${system.typography.body}', Georgia, serif;
  --font-mono: '${system.typography.mono}', 'Courier New', monospace;
  
  /* Typographic Scale */
${Object.entries(system.typography.scale)
  .map(([name, value]) => `  --text-${name}: ${value}rem;`)
  .join('\n')}
${typographyTokens.map((token) => `  --${token.name}: ${token.value};`).join('\n')}
  
  /* Spacing (φ-based) */
${spacingTokens.map((token) => `  --${token.name}: ${token.value};`).join('\n')}
}

/* AI Intelligence Comments */
/*
${system.tokens
  .filter((token) => token.aiIntelligence)
  .map((token) => `${token.name}: ${token.aiIntelligence}`)
  .join('\n')}
*/`;
}

/**
 * Export design system as Tailwind CSS v4+ theme
 */
export function exportToTailwind(system: DesignSystem): string {
  const colorTokens = system.tokens.filter((token) => token.type === 'color');
  const spacingTokens = system.tokens.filter((token) => token.type === 'spacing');

  return `@import "tailwindcss";

@theme {
  /* Generated by Rafters AI Design Intelligence System */
  /* System: ${system.name} (${system.id}) */
  
  /* Color System (OKLCH) */
${colorTokens.map((token) => `  --color-${token.name}: ${token.value};`).join('\n')}
  
  /* Typography */
  --font-heading: '${system.typography.heading}', system-ui, sans-serif;
  --font-body: '${system.typography.body}', Georgia, serif;
  --font-mono: '${system.typography.mono}', 'Courier New', monospace;
  
  /* Typographic Scale */
${Object.entries(system.typography.scale)
  .map(([name, value]) => `  --text-${name}: ${value}rem;`)
  .join('\n')}
  
  /* Spacing (φ-based) */
${spacingTokens.map((token) => `  --${token.name}: ${token.value};`).join('\n')}
}

/* AI Intelligence Comments */
/*
${system.tokens
  .filter((token) => token.aiIntelligence)
  .map((token) => `${token.name}: ${token.aiIntelligence}`)
  .join('\n')}
*/`;
}

/**
 * Export design system as React Native StyleSheet
 */
export function exportToReactNative(system: DesignSystem): string {
  const colorTokens = system.tokens.filter((token) => token.type === 'color');
  const spacingTokens = system.tokens.filter((token) => token.type === 'spacing');
  const typographyTokens = system.tokens.filter((token) => token.type === 'typography');

  // Convert rem values to points for React Native
  const remToPoints = (remValue: string): number => {
    const numValue = Number.parseFloat(remValue.replace('rem', ''));
    return Math.round(numValue * 16); // 1rem = 16pt base
  };

  return `// Generated by Rafters AI Design Intelligence System
// System: ${system.name} (${system.id})

export const designTokens = {
  // Color System (OKLCH converted for React Native)
  colors: {
${colorTokens.map((token) => `    ${token.name.replace(/-/g, '')}Color: '${token.value}',`).join('\n')}
  },
  
  // Typography
  fonts: {
    heading: '${system.typography.heading}',
    body: '${system.typography.body}', 
    mono: '${system.typography.mono}',
  },
  
  // Font Sizes (converted from rem to points)
  fontSizes: {
${Object.entries(system.typography.scale)
  .map(([name, value]) => `    ${name}: ${value * 16},`)
  .join('\n')}
${typographyTokens.map((token) => `    ${token.name.replace(/^text-/, '').replace(/-/g, '')}: ${remToPoints(token.value)},`).join('\n')}
  },
  
  // Spacing (converted from rem to points)
  spacing: {
${spacingTokens.map((token) => `    ${token.name.replace(/^spacing-/, '')}: ${remToPoints(token.value)},`).join('\n')}
  },
};

// AI Intelligence Comments
/*
${system.tokens
  .filter((token) => token.aiIntelligence)
  .map((token) => `${token.name}: ${token.aiIntelligence}`)
  .join('\n')}
*/

export type DesignTokens = typeof designTokens;`;
}

/**
 * Export design system in specified format
 */
export function exportDesignSystem(
  system: DesignSystem,
  format: 'css' | 'tailwind' | 'react-native'
): string {
  switch (format) {
    case 'css':
      return exportToCSS(system);
    case 'tailwind':
      return exportToTailwind(system);
    case 'react-native':
      return exportToReactNative(system);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

/**
 * Fetch token set from Studio shortcode
 */
export async function fetchStudioTokens(shortcode: string): Promise<TokenSet> {
  const url = `https://rafters.realhandy.tech/studio/${shortcode}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'rafters-cli/1.0.0',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`Studio API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return validateTokenSet(data);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Studio request timed out. Please try again.');
    }
    throw new Error(
      `Failed to fetch tokens from Studio: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Create default grayscale token registry
 */
export function createDefaultRegistry(): TokenSet {
  const grayscalePrimary = { l: 0.205, c: 0, h: 0 }; // Dark gray from existing CSS
  const designSystem = generateDesignSystem(grayscalePrimary, {
    name: 'Rafters Grayscale',
  });

  return {
    id: designSystem.id,
    name: designSystem.name,
    version: '1.0.0',
    registry: createTokenRegistry(designSystem),
    manifest: createTokenManifest(designSystem),
    css: exportToCSS(designSystem),
    tailwind: exportToTailwind(designSystem),
    reactNative: exportToReactNative(designSystem),
  };
}

/**
 * Write token files to filesystem
 */
export async function writeTokenFiles(
  tokenSet: TokenSet,
  format: 'css' | 'tailwind' | 'react-native',
  outputDir: string
): Promise<void> {
  const fs = await import('fs-extra');
  const path = await import('node:path');

  // Create tokens directory
  const tokensDir = path.join(outputDir, '.rafters', 'tokens');
  await fs.ensureDir(tokensDir);

  // Write registry and manifest
  await fs.writeFile(
    path.join(tokensDir, 'registry.json'),
    JSON.stringify(tokenSet.registry, null, 2)
  );

  await fs.writeFile(
    path.join(tokensDir, 'manifest.json'),
    JSON.stringify(tokenSet.manifest, null, 2)
  );

  // Write CSS file based on format
  const extension = format === 'react-native' ? 'ts' : 'css';
  const filename = `design-tokens.${extension}`;
  const content =
    format === 'css'
      ? tokenSet.css
      : format === 'tailwind'
        ? tokenSet.tailwind
        : tokenSet.reactNative;

  await fs.ensureDir(path.join(outputDir, 'src'));
  await fs.writeFile(path.join(outputDir, 'src', filename), content);
}

/**
 * Detect and inject CSS imports for design tokens
 */
export async function injectCSSImport(
  format: 'css' | 'tailwind' | 'react-native',
  outputDir: string
): Promise<void> {
  if (format === 'react-native') return; // No CSS import needed

  const fs = await import('fs-extra');
  const path = await import('node:path');

  // Look for common CSS entry points
  const possibleCSSFiles = [
    'src/index.css',
    'src/globals.css',
    'src/app/globals.css',
    'src/styles/globals.css',
    'app/globals.css',
  ];

  let targetCSSFile: string | null = null;

  for (const cssPath of possibleCSSFiles) {
    const fullPath = path.join(outputDir, cssPath);
    if (await fs.pathExists(fullPath)) {
      targetCSSFile = fullPath;
      break;
    }
  }

  if (!targetCSSFile) {
    // Create src/index.css if no CSS file found
    targetCSSFile = path.join(outputDir, 'src/index.css');
    await fs.ensureFile(targetCSSFile);
  }

  const importLine = `@import "./design-tokens.css";\n`;
  const existingContent = await fs.readFile(targetCSSFile, 'utf-8').catch(() => '');

  // Check if import already exists
  if (
    existingContent.includes('@import "./design-tokens.css"') ||
    existingContent.includes("@import './design-tokens.css'")
  ) {
    return; // Already imported
  }

  // Prepend import to existing content
  const newContent = importLine + existingContent;
  await fs.writeFile(targetCSSFile, newContent);
}

/**
 * Detect Tailwind version and warn about v3
 */
export async function checkTailwindVersion(outputDir: string): Promise<string | null> {
  const fs = await import('fs-extra');
  const path = await import('node:path');

  try {
    const packageJsonPath = path.join(outputDir, 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);

    const tailwindVersion =
      packageJson.dependencies?.tailwindcss || packageJson.devDependencies?.tailwindcss;

    if (!tailwindVersion) return null;

    // Parse version to check if it's v3
    const majorVersion = tailwindVersion.match(/^[\^~]?(\d+)/)?.[1];

    if (majorVersion === '3') {
      return 'v3';
    }
    if (majorVersion === '4' || tailwindVersion.includes('4.0.0')) {
      return 'v4';
    }

    return tailwindVersion;
  } catch {
    return null;
  }
}

/**
 * Generate unique system ID
 */
function generateSystemId(name: string): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');

  return `${cleanName}-${timestamp}-${randomStr}`;
}

/**
 * Create token registry with AI intelligence
 */
function createTokenRegistry(system: DesignSystem): TokenRegistry {
  // Map existing CSS tokens to registry format with AI guidance
  return {
    version: '1.0.0',
    system: system.id,
    tokens: {
      colors: extractColorIntelligence(),
      typography: extractTypographyIntelligence(),
      spacing: extractSpacingIntelligence(),
      state: extractStateIntelligence(),
      semantic: extractSemanticIntelligence(),
    },
  };
}

/**
 * Create token manifest for quick discovery
 */
function createTokenManifest(system: DesignSystem): TokenManifest {
  return {
    version: '1.0.0',
    system: system.id,
    name: system.name,
    categories: ['colors', 'typography', 'spacing', 'state', 'semantic'],
    tokenCount: system.tokens.length,
    created: new Date().toISOString(),
  };
}

// Token intelligence extraction functions (to be implemented)
function extractColorIntelligence(): Record<string, TokenIntelligence> {
  return {
    '--color-primary': {
      purpose: 'Primary brand color for main user actions',
      aiGuidance: 'Use for primary buttons, links, and focus states - highest attention hierarchy',
      usageRules: ['Never use for destructive actions', 'Pair with --color-primary-foreground'],
      relatedTokens: ['--color-primary-foreground'],
      examples: ['Primary buttons', 'Active navigation', 'Progress indicators'],
    },
    // ... other color tokens
  };
}

function extractTypographyIntelligence(): Record<string, TokenIntelligence> {
  return {};
}

function extractSpacingIntelligence(): Record<string, TokenIntelligence> {
  return {};
}

function extractStateIntelligence(): Record<string, TokenIntelligence> {
  return {};
}

function extractSemanticIntelligence(): Record<string, TokenIntelligence> {
  return {};
}

// Type definitions
interface TokenSet {
  id: string;
  name: string;
  version: string;
  registry: TokenRegistry;
  manifest: TokenManifest;
  css: string;
  tailwind: string;
  reactNative: string;
}

interface TokenRegistry {
  version: string;
  system: string;
  tokens: {
    colors: Record<string, TokenIntelligence>;
    typography: Record<string, TokenIntelligence>;
    spacing: Record<string, TokenIntelligence>;
    state: Record<string, TokenIntelligence>;
    semantic: Record<string, TokenIntelligence>;
  };
}

interface TokenManifest {
  version: string;
  system: string;
  name: string;
  categories: string[];
  tokenCount: number;
  created: string;
}

interface TokenIntelligence {
  purpose: string;
  aiGuidance: string;
  usageRules: string[];
  relatedTokens: string[];
  examples: string[];
}

function validateTokenSet(data: unknown): TokenSet {
  // TODO: Add Zod validation
  return data as TokenSet;
}
