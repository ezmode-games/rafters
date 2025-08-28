import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import ora from 'ora';
import { z } from 'zod';
import { loadConfig, transformImports } from '../utils/config.js';
import { installDependencies } from '../utils/dependencies.js';
import { createComponentPath, fileExists, writeFile } from '../utils/files.js';
import { getRaftersTitle } from '../utils/logo.js';
import { fetchComponent } from '../utils/registry.js';
const ComponentManifestFileSchema = z.object({
    version: z.string(),
    initialized: z.string(),
    components: z.record(z.string(), z.object({
        path: z.string(),
        story: z.string().optional(),
        installed: z.string(),
        version: z.string(),
        intelligence: z.object({
            cognitiveLoad: z.number(),
            attentionEconomics: z.string(),
            accessibility: z.string(),
            trustBuilding: z.string(),
            semanticMeaning: z.string(),
        }),
        dependencies: z.array(z.string()),
    })),
});
function loadComponentManifest(cwd = process.cwd()) {
    const manifestPath = join(cwd, '.rafters', 'component-manifest.json');
    try {
        const content = readFileSync(manifestPath, 'utf-8');
        return JSON.parse(content);
    }
    catch {
        return {
            version: '1.0.0',
            initialized: new Date().toISOString(),
            components: {},
        };
    }
}
function saveComponentManifest(manifest, cwd = process.cwd()) {
    const manifestPath = join(cwd, '.rafters', 'component-manifest.json');
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}
/**
 * Parse component names from input string, handling spaces and commas
 */
function parseComponentNames(input) {
    return input
        .split(/[,\s]+/) // Split on commas and/or spaces
        .map((name) => name.trim())
        .filter((name) => name.length > 0);
}
/**
 * Install a single component
 */
async function installSingleComponent(componentName, config, options, cwd) {
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
        const depsSpinner = ora(`Installing dependencies for ${componentName} (${componentManifest.dependencies.join(', ')})...`).start();
        try {
            await installDependencies(componentManifest.dependencies, config.packageManager, cwd);
            depsSpinner.succeed(`Dependencies installed for ${componentName}`);
        }
        catch (_error) {
            depsSpinner.warn(`Failed to install dependencies for ${componentName} automatically`);
            console.log(`Please install manually: ${config.packageManager} ${config.packageManager === 'npm' ? 'install' : 'add'} ${componentManifest.dependencies.join(' ')}`);
        }
    }
    // Write component file
    const componentSpinner = ora(`Writing ${componentName} to ${componentPath}...`).start();
    // Get component source from registry files
    const componentFile = componentManifest.files?.find((f) => f.path.endsWith('.tsx') && f.type === 'registry:component' && !f.path.includes('.stories.'));
    if (!componentFile?.content || componentFile.content.trim() === '') {
        componentSpinner.fail(`No component source available for ${componentManifest.name}`);
        return false;
    }
    // Transform imports to use the project's alias configuration
    const transformedContent = transformImports(componentFile.content, config.componentsDir, cwd);
    writeFile(absoluteComponentPath, transformedContent);
    componentSpinner.succeed(`${componentName} written to ${componentPath}`);
    // Write story file if Storybook is enabled
    if (config.hasStorybook && config.storiesDir) {
        const storySpinner = ora(`Writing intelligence story for ${componentName}...`).start();
        const storyPath = join(config.storiesDir, `${componentManifest.name.toLowerCase()}-intelligence.stories.tsx`);
        const absoluteStoryPath = join(cwd, storyPath);
        const storyContent = createBasicStory(componentManifest);
        writeFile(absoluteStoryPath, storyContent);
        storySpinner.succeed(`Story written for ${componentName}`);
    }
    // Update component manifest
    const manifest = loadComponentManifest(cwd);
    const intelligence = componentManifest.meta?.rafters?.intelligence;
    const version = componentManifest.meta?.rafters?.version || '1.0.0';
    if (!intelligence) {
        throw new Error(`Component '${componentName}' manifest missing rafters intelligence metadata`);
    }
    manifest.components[componentManifest.name] = {
        path: componentPath,
        story: config.hasStorybook
            ? join(config.storiesDir, `${componentManifest.name.toLowerCase()}-intelligence.stories.tsx`)
            : undefined,
        installed: new Date().toISOString(),
        version,
        intelligence,
        dependencies: componentManifest.dependencies || [],
    };
    saveComponentManifest(manifest, cwd);
    return true;
}
export async function addCommand(components, options = {}) {
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
        const results = [];
        let totalSuccess = 0;
        let totalSkipped = 0;
        for (const componentName of allComponents) {
            console.log(); // Add spacing between components
            const success = await installSingleComponent(componentName, config, options, cwd);
            results.push({ name: componentName, success });
            if (success) {
                totalSuccess++;
            }
            else {
                totalSkipped++;
            }
        }
        if (totalSkipped > 0 && totalSuccess === 0) {
            process.exit(1);
        }
    }
    catch (error) {
        console.error('Error adding components:', error);
        process.exit(1);
    }
}
function createBasicStory(componentManifest) {
    const componentName = componentManifest.name;
    const intelligence = componentManifest.meta?.rafters?.intelligence;
    if (!intelligence) {
        throw new Error('Component manifest missing rafters intelligence metadata');
    }
    return `import type { Meta, StoryObj } from '@storybook/react';
import { ${componentName} } from '../components/ui/${componentName.toLowerCase()}';

/**
 * ${componentName} Intelligence Story
 * 
 * Cognitive Load: ${intelligence.cognitiveLoad}/10
 * ${intelligence.attentionEconomics}
 * ${intelligence.accessibility}
 * ${intelligence.trustBuilding}
 * ${intelligence.semanticMeaning}
 */
const meta = {
  title: 'Components/${componentName}/Intelligence',
  component: ${componentName},
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '${componentManifest.description}',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ${componentName}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IntelligenceDemo: Story = {
  args: {},
};

export const CognitiveLoadAnalysis: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Cognitive Load Analysis</h3>
      <p className="text-sm text-muted-foreground">
        This component has a cognitive load rating of ${intelligence.cognitiveLoad}/10.
      </p>
      <${componentName} />
    </div>
  ),
};

export const AttentionEconomics: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Attention Economics</h3>
      <p className="text-sm text-muted-foreground">
        ${intelligence.attentionEconomics}
      </p>
      <${componentName} />
    </div>
  ),
};

export const TrustBuilding: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Trust Building Patterns</h3>
      <p className="text-sm text-muted-foreground">
        ${intelligence.trustBuilding}
      </p>
      <${componentName} />
    </div>
  ),
};
`;
}
