/**
 * rafters init
 *
 * Creates .rafters/ folder with tokens.
 * Detects existing shadcn setup and maps their colors into the registry.
 */

import { existsSync } from 'node:fs';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  buildDefaults,
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
import { getRaftersPaths } from '../utils/paths.js';

interface InitOptions {
  force?: boolean;
}

async function backupCss(cssPath: string): Promise<string> {
  const backupPath = cssPath.replace(/\.css$/, '.backup.css');
  await copyFile(cssPath, backupPath);
  return backupPath;
}

async function regenerateFromExisting(
  cwd: string,
  paths: ReturnType<typeof getRaftersPaths>,
  shadcn: ShadcnConfig | null,
): Promise<void> {
  console.log({ event: 'init:regenerate', cwd });

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

  console.log({
    event: 'init:loaded',
    tokenCount: allTokens.length,
    namespaces,
  });

  // Create registry and generate exports
  const registry = new TokenRegistry(allTokens);

  const tailwindCss = registryToTailwind(registry, { includeImport: !shadcn });
  const typescriptSrc = registryToTypeScript(registry, { includeJSDoc: true });
  const dtcgJson = toDTCG(allTokens);

  // Ensure output directory exists
  await mkdir(paths.output, { recursive: true });

  // Write output files
  await writeFile(join(paths.output, 'theme.css'), tailwindCss);
  await writeFile(join(paths.output, 'tokens.ts'), typescriptSrc);
  await writeFile(join(paths.output, 'tokens.json'), JSON.stringify(dtcgJson, null, 2));

  console.log({
    event: 'init:complete',
    outputs: ['theme.css', 'tokens.ts', 'tokens.json'],
    path: paths.output,
  });
}

export async function init(options: InitOptions): Promise<void> {
  const cwd = process.cwd();
  const paths = getRaftersPaths(cwd);

  console.log({ event: 'init:start', cwd });

  // Detect project configuration
  const { framework, shadcn, tailwindVersion } = await detectProject(cwd);

  console.log({
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
    await regenerateFromExisting(cwd, paths, shadcn);
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

      console.log({
        event: 'init:shadcn_detected',
        cssPath: shadcn.tailwind.css,
        backupPath,
        colorsFound: {
          light: Object.keys(existingColors.light).length,
          dark: Object.keys(existingColors.dark).length,
        },
      });
    } catch (err) {
      console.log({ event: 'init:shadcn_css_error', error: String(err) });
    }
  }

  // Generate default token system - registry is the source of truth
  const result = buildDefaults({
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

    console.log({
      event: 'init:colors_imported',
      count: Object.keys(existingColors.light).length,
    });
  }

  console.log({
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

  console.log({
    event: 'init:registry_saved',
    path: paths.tokens,
    namespaceCount: tokensByNamespace.size,
  });

  // Generate outputs from registry
  const tailwindCss = registryToTailwind(registry, { includeImport: !shadcn });
  const typescriptSrc = registryToTypeScript(registry, { includeJSDoc: true });
  const dtcgJson = toDTCG(registry.list());

  await writeFile(join(paths.output, 'theme.css'), tailwindCss);
  await writeFile(join(paths.output, 'tokens.ts'), typescriptSrc);
  await writeFile(join(paths.output, 'tokens.json'), JSON.stringify(dtcgJson, null, 2));

  console.log({
    event: 'init:complete',
    outputs: ['theme.css', 'tokens.ts', 'tokens.json'],
    path: paths.output,
  });
}
