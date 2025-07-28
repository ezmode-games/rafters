import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import chalk from 'chalk';
import ora from 'ora';
import { z } from 'zod';
import { getComponentTemplate } from '../utils/component-templates.js';
import { loadConfig } from '../utils/config.js';
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
export async function addCommand(componentName, options = {}) {
    const cwd = process.cwd();
    try {
        console.log(getRaftersTitle());
        console.log(chalk.blue(`📦 Adding ${componentName} component...`));
        // Load configuration
        const spinner = ora('Reading configuration...').start();
        const config = loadConfig(cwd);
        spinner.succeed('Configuration loaded');
        // Fetch component from registry
        const fetchSpinner = ora(`Fetching ${componentName} component...`).start();
        const componentManifest = await fetchComponent(componentName);
        if (!componentManifest) {
            fetchSpinner.fail(`Component '${componentName}' not found in registry`);
            console.log(chalk.gray('Available components: button, input, card, select, dialog, label, tabs'));
            process.exit(1);
        }
        fetchSpinner.succeed(`${componentManifest.name} component fetched`);
        // Check if component already exists
        const componentPath = createComponentPath(config.componentsDir, componentManifest.name);
        const absoluteComponentPath = join(cwd, componentPath);
        if (fileExists(absoluteComponentPath) && !options.force) {
            console.log(chalk.red(`✗ Component already exists at ${componentPath}`));
            console.log(chalk.gray('  Run with --force to overwrite existing component'));
            process.exit(1);
        }
        if (options.force && fileExists(absoluteComponentPath)) {
            const removeSpinner = ora('Removing existing component...').start();
            // Component will be overwritten, no need to explicitly remove
            removeSpinner.succeed('Existing component will be overwritten');
        }
        // Install dependencies
        if (componentManifest.dependencies.length > 0) {
            const depsSpinner = ora(`Installing dependencies (${componentManifest.dependencies.join(', ')})...`).start();
            try {
                await installDependencies(componentManifest.dependencies, config.packageManager, cwd);
                depsSpinner.succeed('Dependencies installed');
            }
            catch (error) {
                depsSpinner.warn('Failed to install dependencies automatically');
                console.log(chalk.gray(`  Please install manually: ${config.packageManager} ${config.packageManager === 'npm' ? 'install' : 'add'} ${componentManifest.dependencies.join(' ')}`));
            }
        }
        // Write component file
        const componentSpinner = ora(`Writing component to ${componentPath}...`).start();
        const componentContent = getComponentTemplate(componentManifest);
        writeFile(absoluteComponentPath, componentContent);
        componentSpinner.succeed(`Component written to ${componentPath}`);
        // Add intelligence patterns comment
        const intelligenceSpinner = ora('Adding intelligence patterns...').start();
        // Intelligence is already included in the component template
        intelligenceSpinner.succeed('Intelligence patterns added');
        // Write story file if Storybook is enabled
        if (config.hasStorybook && config.storiesDir) {
            const storySpinner = ora('Writing intelligence story...').start();
            const storyPath = join(config.storiesDir, `${componentManifest.name.toLowerCase()}-intelligence.stories.tsx`);
            const absoluteStoryPath = join(cwd, storyPath);
            // For now, create a basic story - in a real implementation this would come from the registry
            const storyContent = createBasicStory(componentManifest);
            writeFile(absoluteStoryPath, storyContent);
            storySpinner.succeed(`Story written to ${storyPath}`);
        }
        // Update component manifest
        const manifestSpinner = ora('Updating component manifest...').start();
        const manifest = loadComponentManifest(cwd);
        const intelligence = componentManifest.meta?.rafters?.intelligence;
        const version = componentManifest.meta?.rafters?.version || '1.0.0';
        if (!intelligence) {
            throw new Error('Component manifest missing rafters intelligence metadata');
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
        manifestSpinner.succeed('Component manifest updated');
        // Success message
        console.log();
        console.log(chalk.green(`✅ ${componentManifest.name} installed successfully with design intelligence patterns.`));
        console.log();
        console.log('Intelligence features:');
        console.log(chalk.gray(`  • Cognitive Load: ${intelligence.cognitiveLoad}/10`));
        console.log(chalk.gray(`  • Attention Economics: ${intelligence.attentionEconomics.split(':')[0]}`));
        console.log(chalk.gray(`  • Trust Building: ${intelligence.trustBuilding.split('.')[0]}`));
        console.log();
        console.log('Next steps:');
        console.log(chalk.gray('  • Import component: ') +
            chalk.blue(`import { ${componentManifest.name} } from '${componentPath.replace('.tsx', '')}';`));
        if (config.hasStorybook) {
            console.log(chalk.gray('  • View intelligence story: ') + chalk.blue('npm run storybook'));
        }
        console.log(chalk.gray('  • Read full patterns: ') + chalk.blue('.rafters/agent-instructions.md'));
    }
    catch (error) {
        console.error(chalk.red('Error adding component:'), error);
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
