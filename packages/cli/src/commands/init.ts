/**
 * rafters init
 *
 * Creates .rafters/ folder with tokens.
 * Detects existing shadcn setup and maps their colors into the registry.
 * Asks about export targets and generates selected formats.
 */

import { existsSync } from 'node:fs';
import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join, relative } from 'node:path';
import { checkbox, confirm, select } from '@inquirer/prompts';
import {
  contrastPlugin,
  generateBaseSystem,
  invertPlugin,
  loadRegistryFromDir,
  registryToCompiled,
  registryToTailwind,
  registryToTypeScript,
  saveRegistryToDir,
  scalePlugin,
  statePlugin,
  TokenRegistry,
  toDTCG,
} from '@rafters/design-tokens';

const REGISTRY_PLUGINS = [scalePlugin, contrastPlugin, statePlugin, invertPlugin];

import { type InjectionFramework, injectFontLinks } from '../onboard/font-injector.js';
import {
  buildSemanticOverlays,
  decisionsToConfigOverrides,
  type OnboardDecisions,
  paletteTokensFromResult,
  runOnboardWireUp,
} from '../onboard/wire-up.js';
import {
  type ComponentTarget,
  detectProject,
  frameworkToTarget,
  hasAstroReact,
  isSelectableFramework,
  isTailwindV3,
  SELECTABLE_FRAMEWORKS,
  type ShadcnConfig,
} from '../utils/detect.js';
import {
  DEFAULT_EXPORTS,
  EXPORT_CHOICES,
  type ExportConfig,
  FUTURE_EXPORTS,
  selectionsToConfig,
} from '../utils/exports.js';
import { getRaftersPaths, type PathField } from '../utils/paths.js';
import { isAgentMode, log, setAgentMode } from '../utils/ui.js';
import { updateDependencies } from '../utils/update-dependencies.js';

interface InitOptions {
  rebuild?: boolean;
  reset?: boolean;
  agent?: boolean;
  /**
   * Override detected framework. When set, skips the auto-detect + prompt
   * fallback. Valid values: next | vite | remix | react-router | astro |
   * wc | vanilla.
   */
  framework?: string;
  /**
   * Onboard wire-up (#1513): in agent mode, accept the highest-
   * confidence detection without prompting. Palettes are assigned to
   * the eleven canonical SemanticColorSystem slots in detection order.
   * Spacing / radius / fonts are accepted as inferred. Without this
   * flag, agent mode emits a needsDecision payload and exits when a
   * brand-system is detected (>=2 palettes).
   */
  acceptDetected?: boolean;
}

async function backupCss(cssPath: string): Promise<string> {
  const backupPath = cssPath.replace(/\.css$/, '.backup.css');
  await copyFile(cssPath, backupPath);
  return backupPath;
}

type Framework =
  | 'next'
  | 'vite'
  | 'remix'
  | 'react-router'
  | 'astro'
  | 'wc'
  | 'vanilla'
  | 'unknown';

const CSS_LOCATIONS: Record<Framework, string[]> = {
  astro: ['src/styles/global.css', 'src/styles/globals.css', 'src/global.css'],
  next: ['src/app/globals.css', 'app/globals.css', 'styles/globals.css'],
  vite: ['src/index.css', 'src/main.css', 'src/styles.css', 'src/app.css'],
  remix: ['app/styles/global.css', 'app/globals.css', 'app/root.css'],
  'react-router': ['app/app.css', 'app/root.css', 'app/styles.css', 'app/globals.css'],
  wc: ['src/index.css', 'src/main.css', 'src/styles.css', 'styles/global.css'],
  vanilla: ['src/index.css', 'src/main.css', 'src/styles.css', 'styles/global.css'],
  unknown: ['src/styles/global.css', 'src/index.css', 'styles/globals.css'],
};

// Default component paths per framework
export const COMPONENT_PATHS: Record<
  Framework,
  { components: string; primitives: string; composites: string; rules: string }
> = {
  astro: {
    components: 'src/components/ui',
    primitives: 'src/lib/primitives',
    composites: 'src/composites',
    rules: 'src/rules',
  },
  next: {
    components: 'components/ui',
    primitives: 'lib/primitives',
    composites: 'composites',
    rules: 'rules',
  },
  vite: {
    components: 'src/components/ui',
    primitives: 'src/lib/primitives',
    composites: 'src/composites',
    rules: 'src/rules',
  },
  remix: {
    components: 'app/components/ui',
    primitives: 'app/lib/primitives',
    composites: 'app/composites',
    rules: 'app/rules',
  },
  'react-router': {
    components: 'app/components/ui',
    primitives: 'app/lib/primitives',
    composites: 'app/composites',
    rules: 'app/rules',
  },
  wc: {
    components: 'src/components/ui',
    primitives: 'src/lib/primitives',
    composites: 'src/composites',
    rules: 'src/rules',
  },
  vanilla: {
    components: 'src/components/ui',
    primitives: 'src/lib/primitives',
    composites: 'src/composites',
    rules: 'src/rules',
  },
  unknown: {
    components: 'components/ui',
    primitives: 'lib/primitives',
    composites: 'composites',
    rules: 'rules',
  },
};

/**
 * Human-facing labels for the interactive framework prompt.
 */
const FRAMEWORK_PROMPT_LABELS: Record<Exclude<Framework, 'unknown'>, string> = {
  next: 'Next.js',
  vite: 'Vite',
  remix: 'Remix',
  'react-router': 'React Router v7',
  astro: 'Astro',
  wc: 'Web Components (custom elements, shadow DOM)',
  vanilla: 'Vanilla (plain HTML/TS, no framework)',
};

/**
 * Configuration persisted in `.rafters/config.rafters.json`.
 *
 * Path fields accept either a single string (status quo) or an array of
 * entries to support multi-folder layouts (e.g. project + `@shingle/shared`).
 * When multiple entries are provided, the install root is the entry tagged
 * `{ root: true }`, otherwise the first entry whose realpath resolves inside
 * cwd. Local entries always win on collision.
 */
export interface RaftersConfig {
  framework: Framework;
  componentTarget?: ComponentTarget;
  componentsPath: PathField;
  primitivesPath: PathField;
  compositesPath: PathField;
  rulesPath: PathField;
  cssPath: string | null;
  shadcn: boolean;
  exports: ExportConfig;
  darkMode?: 'class' | 'media';
  installed?: {
    components: string[];
    primitives: string[];
    composites: string[];
    rules: string[];
  };
  /**
   * Persisted import decisions when the onboard flow detected existing
   * CSS and the user (or `--accept-detected`) committed to a mapping
   * (#1513). `rafters init --reset` re-applies this block verbatim,
   * skipping every prompt.
   */
  import?: OnboardDecisions;
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
 * Check if running in an interactive terminal
 */
function isInteractive(): boolean {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY);
}

/**
 * Resolve the framework to use, in priority order:
 *   1. explicit `--framework` flag (validated against SELECTABLE_FRAMEWORKS)
 *   2. auto-detection
 *   3. interactive prompt when detection returns `unknown` and we have a TTY
 *   4. fallback to `unknown` (non-interactive + undetectable)
 */
async function resolveFramework(
  detected: Framework,
  flag: string | undefined,
  agentMode: boolean,
): Promise<Framework> {
  if (flag) {
    if (!isSelectableFramework(flag)) {
      throw new Error(
        `Unknown --framework "${flag}". Valid values: ${SELECTABLE_FRAMEWORKS.join(', ')}.`,
      );
    }
    return flag;
  }

  if (detected !== 'unknown') return detected;

  if (agentMode || !isInteractive()) return 'unknown';

  const picked = await select({
    message: "Couldn't auto-detect your framework. Which one is this?",
    choices: SELECTABLE_FRAMEWORKS.map((value) => ({
      name: FRAMEWORK_PROMPT_LABELS[value],
      value,
    })),
  });
  return picked;
}

/**
 * Prompt user for export format selections
 * Returns defaults if not in an interactive terminal
 */
async function promptExportFormats(existingConfig?: ExportConfig): Promise<ExportConfig> {
  // Non-interactive: use existing config or defaults
  if (!isInteractive()) {
    return existingConfig ?? DEFAULT_EXPORTS;
  }

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
 * Check if @tailwindcss/cli is installed (required for compiled CSS output)
 */
export function isTailwindCliInstalled(): boolean {
  const require = createRequire(import.meta.url);
  try {
    require.resolve('@tailwindcss/cli/package.json');
    return true;
  } catch (err: unknown) {
    if (err instanceof Error && 'code' in err && err.code === 'MODULE_NOT_FOUND') {
      return false;
    }
    throw err;
  }
}

/**
 * Prompt to install @tailwindcss/cli (required for compiled CSS output).
 * In non-interactive/agent mode, throws with install instructions.
 */
export async function ensureTailwindCli(cwd: string): Promise<void> {
  if (!isInteractive() || isAgentMode()) {
    throw new Error(
      'Standalone CSS export requires @tailwindcss/cli. Install it as a dev dependency in your project.',
    );
  }

  const shouldInstall = await confirm({
    message: 'Standalone CSS requires @tailwindcss/cli. Install it now?',
    default: true,
  });

  if (!shouldInstall) {
    throw new Error('Standalone CSS export requires @tailwindcss/cli.');
  }

  await updateDependencies([], ['@tailwindcss/cli'], { cwd });

  if (!isTailwindCliInstalled()) {
    throw new Error(
      '@tailwindcss/cli was installed but cannot be resolved. Try installing at the workspace root.',
    );
  }
}

/**
 * Generate output files based on export config.
 *
 * Exported so `rafters import --apply` (and any other command that materialises
 * tokens into outputs) can share the exact same emission path -- the contract
 * is: same registry + same exports config = same files on disk.
 */
export async function generateOutputs(
  cwd: string,
  paths: ReturnType<typeof getRaftersPaths>,
  registry: TokenRegistry,
  exports: ExportConfig,
  shadcn: ShadcnConfig | null,
  darkMode: 'class' | 'media' = 'class',
): Promise<string[]> {
  const outputs: string[] = [];

  // Tailwind CSS (with @import "tailwindcss")
  if (exports.tailwind) {
    const tailwindCss = registryToTailwind(registry, { includeImport: !shadcn, darkMode });
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
    const dtcgJson = toDTCG([...registry.list()]);
    await writeFile(join(paths.output, 'rafters.json'), JSON.stringify(dtcgJson, null, 2));
    outputs.push('rafters.json');
  }

  // Compiled CSS (processed by Tailwind, no @import)
  if (exports.compiled) {
    if (!isTailwindCliInstalled()) {
      log({ event: 'init:prompting_exports' }); // stop spinner before prompt
      await ensureTailwindCli(cwd);
    }
    log({ event: 'init:compiling_css' });
    const compiledCss = await registryToCompiled(registry, { includeImport: !shadcn });
    await writeFile(join(paths.output, 'rafters.standalone.css'), compiledCss);
    outputs.push('rafters.standalone.css');
  }

  return outputs;
}

async function regenerateFromExisting(
  cwd: string,
  paths: ReturnType<typeof getRaftersPaths>,
  shadcn: ShadcnConfig | null,
  isAgentMode: boolean,
  framework: Framework,
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

  // Refresh framework and paths from fresh detection
  if (framework !== 'unknown' && existingConfig) {
    const frameworkPaths = COMPONENT_PATHS[framework] || COMPONENT_PATHS.unknown;
    existingConfig.framework = framework;
    existingConfig.componentsPath = frameworkPaths.components;
    existingConfig.primitivesPath = frameworkPaths.primitives;
    existingConfig.compositesPath = frameworkPaths.composites;
    existingConfig.rulesPath = frameworkPaths.rules;
  }

  // Load all tokens from .rafters/tokens/
  const registry = loadRegistryFromDir(paths.tokens, REGISTRY_PLUGINS);

  if (registry.size() === 0) {
    throw new Error('No tokens found. Cannot regenerate without existing tokens.');
  }

  // Get unique namespaces for logging
  const namespaces = [...new Set(registry.list().map((t) => t.namespace))];

  log({
    event: 'init:loaded',
    tokenCount: registry.size(),
    namespaces,
  });

  // Prompt for exports (or use existing config in agent mode / non-interactive)
  let exports: ExportConfig;
  if (isAgentMode) {
    exports = existingConfig?.exports ?? DEFAULT_EXPORTS;
    log({ event: 'init:exports_default', exports });
  } else {
    // Stop spinner before prompting (if interactive)
    if (isInteractive()) {
      log({ event: 'init:prompting_exports' });
    }
    exports = await promptExportFormats(existingConfig?.exports);
    log({ event: 'init:exports_selected', exports });
  }

  // Ensure output directory exists
  await mkdir(paths.output, { recursive: true });

  // Generate outputs
  const outputs = await generateOutputs(cwd, paths, registry, exports, shadcn);

  // Update config with new export settings (create if missing)
  if (existingConfig) {
    existingConfig.exports = exports;
    await writeFile(paths.config, JSON.stringify(existingConfig, null, 2));
  } else {
    const frameworkPaths = COMPONENT_PATHS[framework] || COMPONENT_PATHS.unknown;
    const newConfig: RaftersConfig = {
      framework,
      componentsPath: frameworkPaths.components,
      primitivesPath: frameworkPaths.primitives,
      compositesPath: frameworkPaths.composites,
      rulesPath: frameworkPaths.rules,
      cssPath: null,
      shadcn: !!shadcn,
      exports,
      installed: { components: [], primitives: [], composites: [], rules: [] },
    };
    await writeFile(paths.config, JSON.stringify(newConfig, null, 2));
  }

  log({
    event: 'init:complete',
    outputs,
    path: paths.output,
  });
}

async function resetToDefaults(
  cwd: string,
  paths: ReturnType<typeof getRaftersPaths>,
  shadcn: ShadcnConfig | null,
  isAgentMode: boolean,
  framework: Framework,
): Promise<void> {
  log({ event: 'init:reset', cwd });

  // Load existing config for export settings + shadcn flag
  let existingConfig: RaftersConfig | null = null;
  try {
    const configContent = await readFile(paths.config, 'utf-8');
    existingConfig = JSON.parse(configContent) as RaftersConfig;
  } catch {
    // No config file, will use defaults
  }

  // Refresh framework and paths from fresh detection
  if (framework !== 'unknown' && existingConfig) {
    const frameworkPaths = COMPONENT_PATHS[framework] || COMPONENT_PATHS.unknown;
    existingConfig.framework = framework;
    existingConfig.componentsPath = frameworkPaths.components;
    existingConfig.primitivesPath = frameworkPaths.primitives;
    existingConfig.compositesPath = frameworkPaths.composites;
    existingConfig.rulesPath = frameworkPaths.rules;
  }

  // Load existing tokens to check for userOverride backups
  let existingTokens: ReturnType<TokenRegistry['list']> = [];
  try {
    existingTokens = loadRegistryFromDir(paths.tokens, REGISTRY_PLUGINS).list();
  } catch {
    // No existing tokens directory; nothing to back up.
  }

  // Back up any tokens with userOverride before replacing
  const overriddenTokens = existingTokens.filter((t) => t.userOverride);
  if (overriddenTokens.length > 0) {
    const backup = {
      resetAt: new Date().toISOString(),
      reason: 'rafters init --reset',
      overrides: overriddenTokens.map((t) => ({
        name: t.name,
        value: t.value,
        userOverride: t.userOverride,
        namespace: t.namespace,
      })),
    };
    await mkdir(paths.output, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = join(paths.output, `reset-${timestamp}.json`);
    await writeFile(backupPath, JSON.stringify(backup, null, 2));
    log({
      event: 'init:reset_backup',
      path: backupPath,
      overrideCount: overriddenTokens.length,
    });
  }

  // Prompt for exports (or use existing config in agent mode / non-interactive)
  let exports: ExportConfig;
  if (isAgentMode) {
    exports = existingConfig?.exports ?? DEFAULT_EXPORTS;
    log({ event: 'init:exports_default', exports });
  } else {
    if (isInteractive()) {
      log({ event: 'init:prompting_exports' });
    }
    exports = await promptExportFormats(existingConfig?.exports);
    log({ event: 'init:exports_selected', exports });
  }

  // Re-run generators fresh, replaying the persisted RaftersConfig.import
  // decisions (#1513) so --reset is deterministic for CI / agent loops.
  const importDecisions = existingConfig?.import ?? null;
  const configOverrides = importDecisions ? decisionsToConfigOverrides(importDecisions) : {};
  const system = generateBaseSystem(configOverrides);
  const registry = new TokenRegistry(system.allTokens, REGISTRY_PLUGINS);

  if (importDecisions) {
    // Re-run detection to recover palette step values, then re-apply.
    const wireOutcome = await runOnboardWireUp(cwd, { agent: true, acceptDetected: true });
    if (wireOutcome.kind === 'decisions') {
      for (const token of paletteTokensFromResult(wireOutcome.result)) {
        try {
          registry.define(token);
        } catch {
          // Skip invalid tokens rather than abort reset.
        }
      }
    }
    for (const overlay of buildSemanticOverlays(importDecisions)) {
      try {
        registry.set(overlay.tokenName, overlay.value, { reason: 'init:reset:onboard' });
      } catch {
        // Tokens absent from the regenerated system get skipped.
      }
    }
    log({
      event: 'init:reset_import_replayed',
      assigned: importDecisions.palettes.assigned.length,
      skipped: importDecisions.palettes.skipped.length,
      spacing: importDecisions.spacing ?? null,
      radius: importDecisions.radius ?? null,
      fonts: importDecisions.fonts.map((f) => ({ family: f.family, source: f.source })),
    });
  }

  log({
    event: 'init:reset_generated',
    tokenCount: registry.size(),
  });

  // Clear stale namespace files before saving fresh registry
  await rm(paths.tokens, { recursive: true, force: true });
  await mkdir(paths.tokens, { recursive: true });
  saveRegistryToDir(paths.tokens, registry);

  const allTokensToSave = registry.list();
  const namespaceCount = new Set(allTokensToSave.map((t) => t.namespace)).size;
  log({
    event: 'init:registry_saved',
    path: paths.tokens,
    namespaceCount,
  });

  // Ensure output directory exists
  await mkdir(paths.output, { recursive: true });

  // Generate outputs
  const outputs = await generateOutputs(cwd, paths, registry, exports, shadcn);

  // Update config with new export settings (create if missing)
  if (existingConfig) {
    existingConfig.exports = exports;
    await writeFile(paths.config, JSON.stringify(existingConfig, null, 2));
  } else {
    const frameworkPaths = COMPONENT_PATHS[framework] || COMPONENT_PATHS.unknown;
    const newConfig: RaftersConfig = {
      framework,
      componentsPath: frameworkPaths.components,
      primitivesPath: frameworkPaths.primitives,
      compositesPath: frameworkPaths.composites,
      rulesPath: frameworkPaths.rules,
      cssPath: null,
      shadcn: !!shadcn,
      exports,
      installed: { components: [], primitives: [], composites: [], rules: [] },
    };
    await writeFile(paths.config, JSON.stringify(newConfig, null, 2));
  }

  log({
    event: 'init:complete',
    outputs,
    path: paths.output,
  });
}

/**
 * Write the rafters-frontend skill to .claude/skills/ in the consumer project.
 * Every agent session in this project will read it automatically.
 */
async function writeRaftersSkill(cwd: string): Promise<void> {
  const skillDir = join(cwd, '.claude', 'skills', 'rafters-frontend');
  await mkdir(skillDir, { recursive: true });

  const skill = `---
name: rafters-frontend
description: Use when building frontend UI in a Rafters project -- enforces Container, Grid, typography components, and design token usage.
---

## Layout Is Solved

Container and Grid handle ALL layout. You do not write layout code.

\`\`\`tsx
// WRONG
<div className={classy("flex gap-4 p-6")}>

// RIGHT
<Container>
  <Grid preset="sidebar-main">
    <aside>Sidebar</aside>
    <main>Content</main>
  </Grid>
</Container>
\`\`\`

**Never use:** flex, grid, gap-*, p-*, m-*, items-*, justify-*

### Grid Presets

| Preset | Use for |
|---|---|
| sidebar-main | Navigation + content |
| form | Label/input pairs |
| cards | Responsive card grid |
| row | Horizontal group |
| stack | Vertical sequence |
| split | Equal columns |

## Typography -- Components, Not Utilities

| Instead of | Use |
|---|---|
| \`<p className="text-sm text-muted-foreground">\` | \`<P size="sm" color="muted">\` |
| \`<p>\` | \`<P>\` |
| \`<h1 className="text-4xl font-bold">\` | \`<H1>\` |
| \`<h2>\` | \`<H2>\` |
| \`<h3>\` | \`<H3>\` |
| \`<span className="text-xs">\` | \`<Small>\` |
| \`<span className="text-lg font-semibold">\` | \`<P size="lg" weight="semibold">\` |

## Color -- Tokens, Not Values

Use semantic tokens as Tailwind classes: \`bg-primary\`, \`text-destructive\`, \`border-success\`.
Never use hex, HSL, or palette internals.

## A Correct Page

\`\`\`tsx
import { Container, Grid } from "@rafters/ui"
import { H1, P } from "@rafters/ui/components/ui/typography"
import { Card } from "@rafters/ui/components/ui/card"
import { Button } from "@rafters/ui/components/ui/button"

export default function Page() {
  return (
    <Container>
      <H1>Title</H1>
      <P size="xl" color="muted">Description.</P>
      <Grid preset="cards">
        <Card>...</Card>
        <Card>...</Card>
      </Grid>
      <Grid preset="row">
        <Button variant="secondary">Cancel</Button>
        <Button>Save</Button>
      </Grid>
    </Container>
  )
}
\`\`\`

No flex. No gap. No padding. No text utilities.
`;

  await writeFile(join(skillDir, 'SKILL.md'), skill);
}

export async function init(options: InitOptions): Promise<void> {
  setAgentMode(options.agent ?? false);
  const isAgentMode = options.agent ?? false;

  const cwd = process.cwd();
  const paths = getRaftersPaths(cwd);

  log({ event: 'init:start', cwd });

  // Detect project configuration
  const { framework: detectedFramework, shadcn, tailwindVersion } = await detectProject(cwd);

  log({
    event: 'init:detected',
    framework: detectedFramework,
    tailwindVersion,
    hasShadcn: !!shadcn,
  });

  // Resolve final framework: --framework flag > detected > interactive prompt > unknown
  const framework = await resolveFramework(
    detectedFramework as Framework,
    options.framework,
    isAgentMode,
  );

  if (framework !== detectedFramework) {
    log({
      event: 'init:framework_resolved',
      detected: detectedFramework,
      resolved: framework,
      source: options.framework ? 'flag' : 'prompt',
    });
  }

  // Error if Tailwind v3 is detected
  if (isTailwindV3(tailwindVersion)) {
    throw new Error('Tailwind v3 detected. Rafters requires Tailwind v4.');
  }

  // Check if .rafters/ already exists
  const raftersExists = existsSync(paths.root);

  // --reset without .rafters/ is an error
  if (options.reset && !raftersExists) {
    throw new Error('Nothing to reset. No .rafters/ directory found.');
  }

  // --reset takes precedence over --rebuild
  if (raftersExists && options.reset) {
    await resetToDefaults(cwd, paths, shadcn, isAgentMode, framework as Framework);
    return;
  }

  if (raftersExists && !options.rebuild) {
    throw new Error(
      '.rafters/ directory already exists. Use --rebuild to regenerate output files, or --reset to start from defaults.',
    );
  }

  // If --rebuild and rafters exists, regenerate from existing config
  if (raftersExists && options.rebuild) {
    await regenerateFromExisting(cwd, paths, shadcn, isAgentMode, framework as Framework);
    return;
  }

  // Fresh initialization

  // Prompt for export formats (use defaults in agent mode or non-interactive)
  let exports: ExportConfig;
  if (isAgentMode) {
    exports = DEFAULT_EXPORTS;
    log({ event: 'init:exports_default', exports });
  } else {
    // Stop spinner before prompting (if interactive)
    if (isInteractive()) {
      log({ event: 'init:prompting_exports' });
    }
    exports = await promptExportFormats();
    log({ event: 'init:exports_selected', exports });
  }

  // Onboard wire-up (#1513): detection + decisions BEFORE generateBaseSystem.
  // Captures detected palettes, spacing/radius systems, and fonts;
  // returns either decisions, a needs-decision payload (agent mode
  // without --accept-detected on a brand-system import), or no-detection
  // (init proceeds with pure defaults).
  const onboardOutcome = await runOnboardWireUp(cwd, {
    agent: isAgentMode,
    acceptDetected: !!options.acceptDetected,
  });

  if (onboardOutcome.kind === 'needs-decision') {
    log({
      event: 'init:needs_decision',
      palettes: onboardOutcome.palettes,
      message: onboardOutcome.message,
      nextStep:
        'Re-run with --agent --accept-detected to apply detection in canonical order, or run interactively.',
    });
    return;
  }

  const decisions = onboardOutcome.kind === 'decisions' ? onboardOutcome.decisions : null;
  const onboardResult = onboardOutcome.kind === 'decisions' ? onboardOutcome.result : null;

  // Build BaseSystemConfig from the captured decisions (spacing,
  // radius, fonts) so the generator emits the system the user's CSS
  // already encoded -- not pure defaults.
  const configOverrides = decisions ? decisionsToConfigOverrides(decisions) : {};
  const system = generateBaseSystem(configOverrides);
  const registry = new TokenRegistry(system.allTokens, REGISTRY_PLUGINS);

  // Overlay detected palette steps + semantic family references.
  if (decisions && onboardResult) {
    // Write every palette step token into the registry. Skipped palettes
    // are still imported as colour families; assigned palettes additionally
    // anchor a semantic family below.
    const paletteTokens = paletteTokensFromResult(onboardResult);
    for (const token of paletteTokens) {
      try {
        registry.define(token);
      } catch {
        // Skip tokens that fail validation rather than abort init.
      }
    }
    // Materialise semantic-family ColorReference overlays.
    for (const overlay of buildSemanticOverlays(decisions)) {
      try {
        registry.set(overlay.tokenName, overlay.value, {
          reason: 'init:onboard',
        });
      } catch {
        // Tokens absent from the default semantic layer get skipped.
      }
    }
    log({
      event: 'init:onboard_applied',
      assigned: decisions.palettes.assigned.length,
      skipped: decisions.palettes.skipped.length,
      spacing: decisions.spacing ?? null,
      radius: decisions.radius ?? null,
      fonts: decisions.fonts.map((f) => ({ family: f.family, source: f.source })),
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
  saveRegistryToDir(paths.tokens, registry);
  const allTokensToSave = registry.list();

  const namespaceCount = new Set(allTokensToSave.map((t) => t.namespace)).size;
  log({
    event: 'init:registry_saved',
    path: paths.tokens,
    namespaceCount,
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

  // Determine component target (which file variant to install)
  let componentTarget: ComponentTarget = frameworkToTarget(framework as Framework);

  if (framework === 'astro' && isInteractive() && !isAgentMode) {
    const astroHasReact = await hasAstroReact(cwd);
    if (astroHasReact) {
      componentTarget = await select({
        message: 'This Astro project has React integration. Install components as:',
        choices: [
          {
            name: 'Astro components (zero client JS, server-rendered)',
            value: 'astro' as ComponentTarget,
          },
          {
            name: 'React components (client islands with client:load)',
            value: 'react' as ComponentTarget,
          },
        ],
      });
    }
  }

  // Create config file with detected settings and export selections
  const frameworkPaths = COMPONENT_PATHS[framework as Framework] || COMPONENT_PATHS.unknown;
  const config: RaftersConfig = {
    framework: framework as Framework,
    componentTarget,
    componentsPath: frameworkPaths.components,
    primitivesPath: frameworkPaths.primitives,
    compositesPath: frameworkPaths.composites,
    rulesPath: frameworkPaths.rules,
    cssPath: detectedCssPath,
    shadcn: !!shadcn,
    exports,
    installed: {
      components: [],
      primitives: [],
      composites: [],
      rules: [],
    },
    ...(decisions ? { import: decisions } : {}),
  };
  await writeFile(paths.config, JSON.stringify(config, null, 2));

  // Write Claude Code skill so agents follow rafters rules
  await writeRaftersSkill(cwd);

  // Inject Google Fonts <link> tags into the project's layout file
  // (#1512). Self-hosted / system fonts skip the HTML layer.
  // Unknown framework or no-canonical-layout returns a copy-paste
  // snippet -- print it as the FINAL stdout line so the user sees it
  // on exit.
  let fontFallbackSnippet: string | null = null;
  if (decisions && decisions.fonts.length > 0) {
    const injectionResult = await injectFontLinks({
      cwd,
      framework: toInjectionFramework(cwd, framework as Framework),
      fonts: decisions.fonts,
    });
    if (injectionResult.injected) {
      log({
        event: 'init:fonts_injected',
        layoutPath: injectionResult.layoutPath,
        addedFamilies: injectionResult.addedFamilies,
      });
    } else if (
      injectionResult.reason === 'unknown-framework' ||
      injectionResult.reason === 'no-layout-file'
    ) {
      fontFallbackSnippet = injectionResult.snippet;
    } else {
      log({
        event: 'init:fonts_skipped',
        reason: injectionResult.reason,
      });
    }
  }

  log({
    event: 'init:complete',
    outputs: [...outputs, 'config.rafters.json'],
    path: paths.output,
  });

  // Final-line copy-paste snippet for the unknown-framework / no-layout-file
  // paths -- never logged via the JSON logger, printed raw so the user can
  // copy it.
  if (fontFallbackSnippet) {
    process.stdout.write(
      `\n[rafters] Couldn't auto-inject font tags into your layout. Paste these into your <head>:\n\n${fontFallbackSnippet}\n\n`,
    );
  }
}

/**
 * Map the project's detected framework (which differentiates only
 * `next` as one identifier) to the font-injector's framework target
 * (`next-app` vs `next-pages`). Detects the Next router by
 * filesystem layout: `app/layout.tsx` -> `next-app`, otherwise
 * `next-pages`.
 */
function toInjectionFramework(cwd: string, framework: Framework): InjectionFramework {
  if (framework === 'next') {
    return existsSync(join(cwd, 'app', 'layout.tsx')) || existsSync(join(cwd, 'app', 'layout.jsx'))
      ? 'next-app'
      : 'next-pages';
  }
  if (framework === 'unknown') return 'unknown';
  // astro | vite | remix | react-router | wc | vanilla map 1:1
  return framework as InjectionFramework;
}

// The pre-#1513 fallback `maybeOnboardExisting` is removed. Its role
// (run after generators to flag existing CSS the user could import) is
// now covered by the runOnboardWireUp call that runs BEFORE generation
// and writes the decisions directly into the produced system. The
// staging-file workflow remains available via `rafters import` /
// `rafters import --apply` for after init.
