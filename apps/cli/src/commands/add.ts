import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { IntelligenceSchema } from '@rafters/shared';
import ora from 'ora';
import { z } from 'zod';
import { type Config, loadConfig, transformImports } from '../utils/config.js';
import { installDependencies } from '../utils/dependencies.js';
import { createComponentPath, fileExists, writeFile } from '../utils/files.js';
import { getRaftersTitle } from '../utils/logo.js';
import { fetchComponent } from '../utils/registry.js';

interface AddOptions {
  force?: boolean;
}

const ComponentManifestFileSchema = z.object({
  version: z.string(),
  initialized: z.string(),
  components: z.record(
    z.string(),
    z.object({
      path: z.string(),
      installed: z.string(),
      version: z.string(),
      intelligence: IntelligenceSchema,
      dependencies: z.array(z.string()),
    })
  ),
});

type ComponentManifestFile = z.infer<typeof ComponentManifestFileSchema>;

function loadComponentManifest(cwd = process.cwd()): ComponentManifestFile {
  const manifestPath = join(cwd, '.rafters', 'component-manifest.json');
  try {
    const content = readFileSync(manifestPath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return {
      version: '1.0.0',
      initialized: new Date().toISOString(),
      components: {},
    };
  }
}

function saveComponentManifest(manifest: ComponentManifestFile, cwd = process.cwd()): void {
  const manifestPath = join(cwd, '.rafters', 'component-manifest.json');
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

/**
 * Parse component names from input string, handling spaces and commas
 */
function parseComponentNames(input: string): string[] {
  return input
    .split(/[,\s]+/) // Split on commas and/or spaces
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
}

/**
 * Install a single component
 */
async function installSingleComponent(
  componentName: string,
  config: Config,
  options: AddOptions,
  cwd: string
): Promise<boolean> {
  // Fetch component from registry
  const fetchSpinner = ora(`Fetching ${componentName} component...`).start();
  const componentManifest = await fetchComponent(componentName);

  if (!componentManifest) {
    fetchSpinner.fail(`Component '${componentName}' not found in registry`);
    return false;
  }
  fetchSpinner.succeed(`${componentManifest.name} component fetched`);

  // Check if component already exists
  const componentPath = createComponentPath(config.componentsDir, componentManifest.name);
  const absoluteComponentPath = join(cwd, componentPath);

  if (fileExists(absoluteComponentPath) && !options.force) {
    console.log(`Component '${componentName}' already exists at ${componentPath}`);
    console.log('Use --force to overwrite existing components');
    return false;
  }

  if (options.force && fileExists(absoluteComponentPath)) {
    const removeSpinner = ora(`Removing existing ${componentName}...`).start();
    removeSpinner.succeed(`Existing ${componentName} will be overwritten`);
  }

  // Install dependencies
  if (componentManifest.dependencies.length > 0) {
    const depsSpinner = ora(
      `Installing dependencies for ${componentName} (${componentManifest.dependencies.join(', ')})...`
    ).start();
    try {
      await installDependencies(componentManifest.dependencies, config.packageManager, cwd);
      depsSpinner.succeed(`Dependencies installed for ${componentName}`);
    } catch (_error) {
      depsSpinner.warn(`Failed to install dependencies for ${componentName} automatically`);
      console.log(
        `Please install manually: ${config.packageManager} ${config.packageManager === 'npm' ? 'install' : 'add'} ${componentManifest.dependencies.join(' ')}`
      );
    }
  }

  // Write files (primitives + component)
  const componentSpinner = ora(`Writing ${componentName} files...`).start();

  // Separate primitive and component files
  const primitiveFiles =
    componentManifest.files?.filter(
      (f) => f.type === 'registry:primitive' || f.path.includes('primitives/')
    ) || [];

  const componentFile = componentManifest.files?.find(
    (f) =>
      f.path.endsWith('.tsx') && f.type === 'registry:component' && !f.path.includes('.stories.')
  );

  if (!componentFile?.content || componentFile.content.trim() === '') {
    componentSpinner.fail(`No component source available for ${componentManifest.name}`);
    return false;
  }

  // Write primitive files first (to src/components/primitives/)
  for (const primitiveFile of primitiveFiles) {
    if (!primitiveFile.content || primitiveFile.content.trim() === '') {
      continue;
    }

    // Extract primitive path: primitives/button/r-button.ts
    const primitivePath = primitiveFile.path.replace(/^.*primitives\//, 'primitives/');
    const absolutePrimitivePath = join(cwd, 'src/components', primitivePath);

    // Transform imports for primitives
    const transformedPrimitiveContent = transformImports(
      primitiveFile.content,
      config.componentsDir,
      cwd
    );

    writeFile(absolutePrimitivePath, transformedPrimitiveContent);
  }

  // Write React component file
  const transformedContent = transformImports(componentFile.content, config.componentsDir, cwd);
  writeFile(absoluteComponentPath, transformedContent);

  const filesWritten = primitiveFiles.length + 1;
  componentSpinner.succeed(
    `${componentName} written (${filesWritten} file${filesWritten > 1 ? 's' : ''})`
  );

  // Update component manifest
  const manifest = loadComponentManifest(cwd);
  const intelligence = componentManifest.meta?.rafters?.intelligence;
  const version = componentManifest.meta?.rafters?.version || '1.0.0';

  if (!intelligence) {
    throw new Error(`Component '${componentName}' manifest missing rafters intelligence metadata`);
  }

  manifest.components[componentManifest.name] = {
    path: componentPath,
    installed: new Date().toISOString(),
    version,
    intelligence,
    dependencies: componentManifest.dependencies || [],
  };
  saveComponentManifest(manifest, cwd);

  return true;
}

export async function addCommand(components: string[], options: AddOptions = {}): Promise<void> {
  const cwd = process.cwd();

  try {
    // Commander.js passes components as an array, but also handle comma-separated within each argument
    const allComponents = components.flatMap((comp) => parseComponentNames(comp));

    if (allComponents.length === 0) {
      console.log('No component names provided');
      process.exit(1);
    }

    console.log(getRaftersTitle());

    // Load configuration
    const spinner = ora('Reading configuration...').start();
    const config = loadConfig(cwd);
    spinner.succeed('Configuration loaded');

    // Process each component
    const results: Array<{ name: string; success: boolean }> = [];
    let totalSuccess = 0;
    let totalSkipped = 0;

    for (const componentName of allComponents) {
      console.log(); // Add spacing between components
      const success = await installSingleComponent(componentName, config, options, cwd);
      results.push({ name: componentName, success });

      if (success) {
        totalSuccess++;
      } else {
        totalSkipped++;
      }
    }

    if (totalSkipped > 0 && totalSuccess === 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Error adding components:', error);
    process.exit(1);
  }
}
