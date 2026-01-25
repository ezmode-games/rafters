/**
 * rafters init
 *
 * Creates .rafters/ folder with tokens.
 * Detects existing shadcn setup and maps their colors into the registry.
 * Asks about export targets and generates selected formats.
 */

import { existsSync } from 'node:fs';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { checkbox } from '@inquirer/prompts';
import {
  buildColorSystem,
  NodePersistenceAdapter,
  registryToTailwind,
  registryToTypeScript,
  TokenRegistry,
  toDTCG,
} from '@rafters/design-tokens';
import type { Token } from '@rafters/shared';
import {
  detectProject,
  isTailwindV3,
  parseCssVariables,
  type ShadcnColors,
  type ShadcnConfig,
} from '../utils/detect.js';
import {
  DEFAULT_EXPORTS,
  EXPORT_CHOICES,
  type ExportConfig,
  FUTURE_EXPORTS,
  generateCompiledCss,
  selectionsToConfig,
} from '../utils/exports.js';
import { getRaftersPaths } from '../utils/paths.js';
import { log, setAgentMode } from '../utils/ui.js';

interface InitOptions {
  force?: boolean;
  agent?: boolean;
}

async function backupCss(cssPath: string): Promise<string> {
  const backupPath = cssPath.replace(/\.css$/, '.backup.css');
  await copyFile(cssPath, backupPath);
  return backupPath;
}

type Framework = 'next' | 'vite' | 'remix' | 'react-router' | 'astro' | 'unknown';

const CSS_LOCATIONS: Record<Framework, string[]> = {
  astro: ['src/styles/global.css', 'src/styles/globals.css', 'src/global.css'],
  next: ['src/app/globals.css', 'app/globals.css', 'styles/globals.css'],
  vite: ['src/index.css', 'src/main.css', 'src/styles.css', 'src/app.css'],
  remix: ['app/styles/global.css', 'app/globals.css', 'app/root.css'],
  'react-router': ['app/app.css', 'app/root.css', 'app/styles.css', 'app/globals.css'],
  unknown: ['src/styles/global.css', 'src/index.css', 'styles/globals.css'],
};

// Default component paths per framework
const COMPONENT_PATHS: Record<Framework, { components: string; primitives: string }> = {
  astro: { components: 'src/components/ui', primitives: 'src/lib/primitives' },
  next: { components: 'components/ui', primitives: 'lib/primitives' },
  vite: { components: 'src/components/ui', primitives: 'src/lib/primitives' },
  remix: { components: 'app/components/ui', primitives: 'app/lib/primitives' },
  'react-router': { components: 'app/components/ui', primitives: 'app/lib/primitives' },
  unknown: { components: 'components/ui', primitives: 'lib/primitives' },
};

/**
 * Configuration persisted in `.rafters/config.rafters.json`.
 * Used by the CLI to resolve framework-specific defaults and perform
 * path transformations when generating or updating files.
 * All paths are relative to the project root.
 */
export interface RaftersConfig {
  /** Detected or selected application framework */
  framework: Framework;
  /** Root directory for UI components, e.g. `components/ui` or `app/components/ui` */
  componentsPath: string;
  /** Root directory for primitive components, e.g. `lib/primitives` */
  primitivesPath: string;
  /** Entry CSS file for design tokens, or null if not detected */
  cssPath: string | null;
  /** Export format selections */
  exports: ExportConfig;
}

async function findMainCssFile(cwd: string, framework: Framework): Promise<string | null> {
  const locations = CSS_LOCATIONS[framework] || CSS_LOCATIONS.unknown;

  for (const location of locations) {
    const fullPath = join(cwd, location);
    if (existsSync(fullPath)) {
      return location;
    }
  }

  return null;
}

async function updateMainCss(cwd: string, cssPath: string, themePath: string): Promise<void> {
  const fullCssPath = join(cwd, cssPath);
  const cssContent = await readFile(fullCssPath, 'utf-8');

  // Calculate relative path from CSS file to theme.css
  const cssDir = join(cwd, cssPath, '..');
  const themeFullPath = join(cwd, themePath);
  const relativeThemePath = relative(cssDir, themeFullPath);

  // Check if already imported
  if (cssContent.includes('.rafters/output/rafters.css')) {
    log({ event: 'init:css_already_imported', cssPath });
    return;
  }

  // Backup the original
  await backupCss(fullCssPath);

  // The theme.css already includes @import "tailwindcss", so we just need to import it
  // Replace the tailwindcss import with our theme import
  let newContent: string;
  if (cssContent.includes('@import "tailwindcss"')) {
    newContent = cssContent.replace('@import "tailwindcss";', `@import "${relativeThemePath}";`);
  } else if (cssContent.includes("@import 'tailwindcss'")) {
    newContent = cssContent.replace("@import 'tailwindcss';", `@import "${relativeThemePath}";`);
  } else {
    // No tailwind import found, prepend the theme import
    newContent = `@import "${relativeThemePath}";\n\n${cssContent}`;
  }

  await writeFile(fullCssPath, newContent);
  log({
    event: 'init:css_updated',
    cssPath,
    themePath: relativeThemePath,
  });
}

/**
 * Prompt user for export format selections
 */
async function promptExportFormats(existingConfig?: ExportConfig): Promise<ExportConfig> {
  // Build choices with existing config as defaults if available
  const choices = EXPORT_CHOICES.map((choice) => ({
    name: choice.name,
    value: choice.value,
    checked: existingConfig ? existingConfig[choice.value] : choice.checked,
  }));

  // Add future exports as disabled options
  const allChoices = [
    ...choices,
    ...FUTURE_EXPORTS.map((choice) => ({
      name: `${choice.name} (${choice.disabled})`,
      value: choice.value,
      checked: false,
      disabled: true,
    })),
  ];

  const selections = await checkbox({
    message: 'What would you like to export?',
    choices: allChoices,
    required: true,
  });

  return selectionsToConfig(selections);
}

/**
 * Generate output files based on export config
 */
async function generateOutputs(
  cwd: string,
  paths: ReturnType<typeof getRaftersPaths>,
  registry: TokenRegistry,
  exports: ExportConfig,
  shadcn: ShadcnConfig | null,
): Promise<string[]> {
  const outputs: string[] = [];

  // Tailwind CSS (with @import "tailwindcss")
  if (exports.tailwind) {
    const tailwindCss = registryToTailwind(registry, { includeImport: !shadcn });
    await writeFile(join(paths.output, 'rafters.css'), tailwindCss);
    outputs.push('rafters.css');
  }

  // TypeScript constants
  if (exports.typescript) {
    const typescriptSrc = registryToTypeScript(registry, { includeJSDoc: true });
    await writeFile(join(paths.output, 'rafters.ts'), typescriptSrc);
    outputs.push('rafters.ts');
  }

  // DTCG JSON (W3C Design Tokens)
  if (exports.dtcg) {
    const dtcgJson = toDTCG(registry.list());
    await writeFile(join(paths.output, 'rafters.json'), JSON.stringify(dtcgJson, null, 2));
    outputs.push('rafters.json');
  }

  // Compiled CSS (processed by Tailwind, no @import)
  if (exports.compiled) {
    // Need Tailwind CSS first as input
    if (!exports.tailwind) {
      const tailwindCss = registryToTailwind(registry, { includeImport: !shadcn });
      await writeFile(join(paths.output, 'rafters.css'), tailwindCss);
    }

    const inputPath = join(paths.output, 'rafters.css');
    const outputPath = join(paths.output, 'rafters.compiled.css');

    log({ event: 'init:compiling_css' });
    await generateCompiledCss(cwd, inputPath, outputPath);
    outputs.push('rafters.compiled.css');
  }

  return outputs;
}

async function regenerateFromExisting(
  cwd: string,
  paths: ReturnType<typeof getRaftersPaths>,
  shadcn: ShadcnConfig | null,
  isAgentMode: boolean,
): Promise<void> {
  log({ event: 'init:regenerate', cwd });

  // Load existing config for export settings
  let existingConfig: RaftersConfig | null = null;
  try {
    const configContent = await readFile(paths.config, 'utf-8');
    existingConfig = JSON.parse(configContent) as RaftersConfig;
  } catch {
    // No config file, will use defaults
  }

  // Load all tokens from .rafters/tokens/
  const adapter = new NodePersistenceAdapter(cwd);
  const namespaces = await adapter.listNamespaces();

  if (namespaces.length === 0) {
    throw new Error('No tokens found. Cannot regenerate without existing tokens.');
  }

  const allTokens: Token[] = [];
  for (const namespace of namespaces) {
    const tokens = await adapter.loadNamespace(namespace);
    allTokens.push(...tokens);
  }

  log({
    event: 'init:loaded',
    tokenCount: allTokens.length,
    namespaces,
  });

  // Create registry
  const registry = new TokenRegistry(allTokens);

  // Prompt for exports (or use existing config in agent mode)
  let exports: ExportConfig;
  if (isAgentMode) {
    exports = existingConfig?.exports ?? DEFAULT_EXPORTS;
  } else {
    exports = await promptExportFormats(existingConfig?.exports);
  }

  // Ensure output directory exists
  await mkdir(paths.output, { recursive: true });

  // Generate outputs
  const outputs = await generateOutputs(cwd, paths, registry, exports, shadcn);

  // Update config with new export settings
  if (existingConfig) {
    existingConfig.exports = exports;
    await writeFile(paths.config, JSON.stringify(existingConfig, null, 2));
  }

  log({
    event: 'init:complete',
    outputs,
    path: paths.output,
  });
}

export async function init(options: InitOptions): Promise<void> {
  setAgentMode(options.agent ?? false);
  const isAgentMode = options.agent ?? false;

  const cwd = process.cwd();
  const paths = getRaftersPaths(cwd);

  log({ event: 'init:start', cwd });

  // Detect project configuration
  const { framework, shadcn, tailwindVersion } = await detectProject(cwd);

  log({
    event: 'init:detected',
    framework,
    tailwindVersion,
    hasShadcn: !!shadcn,
  });

  // Error if Tailwind v3 is detected
  if (isTailwindV3(tailwindVersion)) {
    throw new Error('Tailwind v3 detected. Rafters requires Tailwind v4.');
  }

  // Check if .rafters/ already exists
  const raftersExists = existsSync(paths.root);

  if (raftersExists && !options.force) {
    throw new Error(
      '.rafters/ directory already exists. Use --force to regenerate output files from existing config.',
    );
  }

  // If --force and rafters exists, regenerate from existing config
  if (raftersExists && options.force) {
    await regenerateFromExisting(cwd, paths, shadcn, isAgentMode);
    return;
  }

  // Fresh initialization
  let existingColors: { light: ShadcnColors; dark: ShadcnColors } | null = null;

  if (shadcn?.tailwind?.css) {
    const cssPath = join(cwd, shadcn.tailwind.css);
    try {
      const cssContent = await readFile(cssPath, 'utf-8');
      existingColors = parseCssVariables(cssContent);
      const backupPath = await backupCss(cssPath);

      log({
        event: 'init:shadcn_detected',
        cssPath: shadcn.tailwind.css,
        backupPath,
        colorsFound: {
          light: Object.keys(existingColors.light).length,
          dark: Object.keys(existingColors.dark).length,
        },
      });
    } catch (err) {
      log({ event: 'init:shadcn_css_error', error: String(err) });
    }
  }

  // Prompt for export formats (use defaults in agent mode)
  let exports: ExportConfig;
  if (isAgentMode) {
    exports = DEFAULT_EXPORTS;
    log({ event: 'init:exports_default', exports });
  } else {
    exports = await promptExportFormats();
    log({ event: 'init:exports_selected', exports });
  }

  // Generate default token system - registry is the source of truth
  const result = buildColorSystem({
    exports: {
      tailwind: { includeImport: !shadcn },
      typescript: { includeJSDoc: true },
      dtcg: true,
    },
  });

  const { registry } = result;

  // If we have existing shadcn colors, update the registry
  if (existingColors) {
    const tokenMap: Record<string, keyof ShadcnColors> = {
      background: 'background',
      foreground: 'foreground',
      card: 'card',
      'card-foreground': 'cardForeground',
      popover: 'popover',
      'popover-foreground': 'popoverForeground',
      primary: 'primary',
      'primary-foreground': 'primaryForeground',
      secondary: 'secondary',
      'secondary-foreground': 'secondaryForeground',
      muted: 'muted',
      'muted-foreground': 'mutedForeground',
      accent: 'accent',
      'accent-foreground': 'accentForeground',
      destructive: 'destructive',
      'destructive-foreground': 'destructiveForeground',
      border: 'border',
      input: 'input',
      ring: 'ring',
    };

    for (const [tokenName, colorKey] of Object.entries(tokenMap)) {
      const colorValue = existingColors.light[colorKey];
      if (colorValue && registry.has(tokenName)) {
        registry.updateToken(tokenName, colorValue);
      }
    }

    log({
      event: 'init:colors_imported',
      count: Object.keys(existingColors.light).length,
    });
  }

  log({
    event: 'init:generated',
    tokenCount: registry.size(),
  });

  // Create directories
  await mkdir(paths.tokens, { recursive: true });
  await mkdir(paths.output, { recursive: true });

  // Save registry to .rafters/tokens/
  const adapter = new NodePersistenceAdapter(cwd);
  const tokensByNamespace = new Map<string, typeof result.system.allTokens>();

  for (const token of registry.list()) {
    if (!tokensByNamespace.has(token.namespace)) {
      tokensByNamespace.set(token.namespace, []);
    }
    tokensByNamespace.get(token.namespace)?.push(token);
  }

  for (const [namespace, tokens] of tokensByNamespace) {
    await adapter.saveNamespace(namespace, tokens);
  }

  log({
    event: 'init:registry_saved',
    path: paths.tokens,
    namespaceCount: tokensByNamespace.size,
  });

  // Generate outputs based on export config
  const outputs = await generateOutputs(cwd, paths, registry, exports, shadcn);

  // Find and update the main CSS file (if not using shadcn which has its own CSS path)
  let detectedCssPath: string | null = null;
  if (!shadcn && exports.tailwind) {
    detectedCssPath = await findMainCssFile(cwd, framework as Framework);
    if (detectedCssPath) {
      await updateMainCss(cwd, detectedCssPath, '.rafters/output/rafters.css');
    } else {
      log({
        event: 'init:css_not_found',
        message: 'No main CSS file found. Add @import ".rafters/output/rafters.css" manually.',
        searchedLocations: CSS_LOCATIONS[framework as Framework] || CSS_LOCATIONS.unknown,
      });
    }
  } else if (shadcn?.tailwind?.css) {
    detectedCssPath = shadcn.tailwind.css;
  }

  // Create config file with detected settings and export selections
  const frameworkPaths = COMPONENT_PATHS[framework as Framework] || COMPONENT_PATHS.unknown;
  const config: RaftersConfig = {
    framework: framework as Framework,
    componentsPath: frameworkPaths.components,
    primitivesPath: frameworkPaths.primitives,
    cssPath: detectedCssPath,
    exports,
  };
  await writeFile(paths.config, JSON.stringify(config, null, 2));

  log({
    event: 'init:complete',
    outputs: [...outputs, 'config.rafters.json'],
    path: paths.output,
  });
}
