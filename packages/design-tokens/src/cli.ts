/**
 * CLI integration functions for design-tokens package
 * Functions required by @rafters/cli
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import { designSystemsAPI } from './api.js';
import { defaultGrayscaleSystem } from './grayscale.js';
import { generateMotionTokens } from './index.js';

/**
 * Check Tailwind CSS version in project
 */
export async function checkTailwindVersion(cwd: string): Promise<'v3' | 'v4' | 'none'> {
  try {
    const packageJsonPath = join(cwd, 'package.json');
    if (!existsSync(packageJsonPath)) return 'none';

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    const tailwindVersion = deps.tailwindcss;
    if (!tailwindVersion) return 'none';

    // Parse version - v4 includes beta/alpha versions
    if (
      tailwindVersion.includes('4.') ||
      tailwindVersion.includes('beta') ||
      tailwindVersion.includes('alpha')
    ) {
      return 'v4';
    }

    return 'v3';
  } catch {
    return 'none';
  }
}

/**
 * Token format for CLI
 */
const TokenSetSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  css: z.string(),
  tailwind: z.string(),
  json: z.record(z.string(), z.string()),
  meta: z.object({
    version: z.string(),
    designCoherence: z.number(),
    accessibilityScore: z.number(),
  }),
});

type TokenSet = z.infer<typeof TokenSetSchema>;

/**
 * Create default registry with grayscale system
 */
export function createDefaultRegistry(): TokenSet {
  const system = designSystemsAPI.get('000000');
  if (!system) throw new Error('Default system not found');

  const css = designSystemsAPI.exportCSS('000000') || '';
  const tailwind = designSystemsAPI.exportTailwind('000000') || '';

  // Create JSON format
  const json: Record<string, string> = {};
  const tokens = [
    ...Object.values(system.system.colors),
    ...Object.values(system.system.typography),
    ...Object.values(system.system.spacing),
    ...Object.values(system.system.state),
    ...generateMotionTokens(), // Use properly formatted motion tokens
    ...Object.values(system.system.border),
    ...Object.values(system.system.shadow),
    ...Object.values(system.system.ring),
    ...Object.values(system.system.opacity),
  ];

  for (const token of tokens) {
    json[token.name] = token.value;
  }

  return {
    id: '000000',
    name: 'Rafters Grayscale',
    description: 'AI-intelligent grayscale design system',
    css,
    tailwind,
    json,
    meta: {
      version: system.system.meta.version,
      designCoherence: system.system.meta.designCoherence,
      accessibilityScore: system.system.meta.accessibilityScore,
    },
  };
}

/**
 * Fetch tokens from Studio by shortcode
 */
export async function fetchStudioTokens(shortcode: string): Promise<TokenSet> {
  // For now, return default - Studio integration would happen here
  // TODO: Implement actual Studio API integration
  // Note: console.warn is appropriate for CLI communication
  console.warn(
    `Studio integration not implemented yet. Using default tokens for shortcode: ${shortcode}`
  );
  return createDefaultRegistry();
}

/**
 * Write token files to project
 */
export async function writeTokenFiles(
  tokenSet: TokenSet,
  format: 'css' | 'tailwind' | 'json',
  cwd: string
): Promise<void> {
  const tokensDir = join(cwd, 'design-tokens');

  // Ensure directory exists
  const fs = await import('fs-extra');
  fs.ensureDirSync(tokensDir);

  switch (format) {
    case 'css': {
      const cssPath = join(tokensDir, 'tokens.css');
      writeFileSync(cssPath, tokenSet.css);
      break;
    }

    case 'tailwind': {
      const tailwindPath = join(tokensDir, 'theme.css');
      writeFileSync(tailwindPath, tokenSet.tailwind);
      break;
    }

    case 'json': {
      const jsonPath = join(tokensDir, 'tokens.json');
      writeFileSync(jsonPath, JSON.stringify(tokenSet.json, null, 2));
      break;
    }
  }

  // Always write metadata
  const metaPath = join(tokensDir, 'meta.json');
  writeFileSync(
    metaPath,
    JSON.stringify(
      {
        ...tokenSet.meta,
        id: tokenSet.id,
        name: tokenSet.name,
        description: tokenSet.description,
        format,
        generatedAt: new Date().toISOString(),
      },
      null,
      2
    )
  );
}

/**
 * Inject CSS import into main stylesheet
 */
export async function injectCSSImport(format: 'css' | 'tailwind', cwd: string): Promise<void> {
  const possibleCSSFiles = [
    'src/index.css',
    'src/main.css',
    'src/style.css',
    'src/styles.css',
    'app/globals.css',
    'styles/globals.css',
  ];

  let targetFile: string | null = null;

  // Find existing CSS file
  for (const file of possibleCSSFiles) {
    const filePath = join(cwd, file);
    if (existsSync(filePath)) {
      targetFile = filePath;
      break;
    }
  }

  // If no CSS file found, create src/index.css
  if (!targetFile) {
    const fs = await import('fs-extra');
    fs.ensureDirSync(join(cwd, 'src'));
    targetFile = join(cwd, 'src/index.css');
  }

  const importLine =
    format === 'css'
      ? '@import "./design-tokens/tokens.css";'
      : '@import "./design-tokens/theme.css";';

  try {
    const content = existsSync(targetFile) ? readFileSync(targetFile, 'utf8') : '';

    // Check if import already exists
    if (content.includes(importLine)) {
      return; // Already imported
    }

    // Add import at the top
    const newContent = `${importLine}\n${content}`;
    writeFileSync(targetFile, newContent);
  } catch (error) {
    // Note: console.warn is appropriate for CLI error communication
    console.warn(
      `Could not inject CSS import: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
