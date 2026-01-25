/**
 * Export utilities for generating different output formats
 */

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export interface ExportConfig {
  tailwind: boolean;
  typescript: boolean;
  dtcg: boolean;
  compiled: boolean;
}

export const DEFAULT_EXPORTS: ExportConfig = {
  tailwind: true,
  typescript: true,
  dtcg: false,
  compiled: false,
};

export interface ExportChoice {
  name: string;
  value: keyof ExportConfig;
  checked: boolean;
  disabled?: string;
}

export const EXPORT_CHOICES: ExportChoice[] = [
  {
    name: 'Tailwind CSS (web projects)',
    value: 'tailwind',
    checked: true,
  },
  {
    name: 'TypeScript (type-safe constants)',
    value: 'typescript',
    checked: true,
  },
  {
    name: 'DTCG JSON (Figma Tokens, Style Dictionary)',
    value: 'dtcg',
    checked: false,
  },
  {
    name: 'Compiled CSS (documentation, no build step)',
    value: 'compiled',
    checked: false,
  },
];

// Future exports - shown as disabled
export const FUTURE_EXPORTS: ExportChoice[] = [
  {
    name: 'iOS (Swift/SwiftUI)',
    value: 'tailwind' as keyof ExportConfig, // placeholder
    checked: false,
    disabled: 'coming soon',
  },
  {
    name: 'Android (Compose)',
    value: 'tailwind' as keyof ExportConfig, // placeholder
    checked: false,
    disabled: 'coming soon',
  },
];

/**
 * Generate compiled CSS by running Tailwind CLI
 * Tailwind v4 uses @tailwindcss/cli package
 * Uses execFileSync for safety (no shell injection)
 */
export async function generateCompiledCss(
  cwd: string,
  inputPath: string,
  outputPath: string,
): Promise<void> {
  // Tailwind v4 CLI is in @tailwindcss/cli package
  const nodeModulesBin = join(cwd, 'node_modules', '.bin', 'tailwindcss');
  const hasTailwindCli = existsSync(nodeModulesBin);

  const args = ['-i', inputPath, '-o', outputPath, '--minify'];

  if (hasTailwindCli) {
    // Use local @tailwindcss/cli
    execFileSync(nodeModulesBin, args, { cwd, stdio: 'pipe' });
  } else {
    // Try pnpm exec as fallback (workspace hoisting)
    try {
      execFileSync('pnpm', ['exec', 'tailwindcss', ...args], { cwd, stdio: 'pipe' });
    } catch {
      throw new Error(
        'Tailwind CLI not found. Install it with: pnpm add -D @tailwindcss/cli',
      );
    }
  }
}

/**
 * Convert checkbox selections to ExportConfig
 */
export function selectionsToConfig(selections: string[]): ExportConfig {
  return {
    tailwind: selections.includes('tailwind'),
    typescript: selections.includes('typescript'),
    dtcg: selections.includes('dtcg'),
    compiled: selections.includes('compiled'),
  };
}

/**
 * Convert ExportConfig to checkbox selections
 */
export function configToSelections(config: ExportConfig): string[] {
  const selections: string[] = [];
  if (config.tailwind) selections.push('tailwind');
  if (config.typescript) selections.push('typescript');
  if (config.dtcg) selections.push('dtcg');
  if (config.compiled) selections.push('compiled');
  return selections;
}
