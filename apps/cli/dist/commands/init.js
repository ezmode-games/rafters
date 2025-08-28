import fs from 'fs-extra';
import inquirer from 'inquirer';
import ora from 'ora';
const { ensureDirSync, writeFileSync, existsSync } = fs;
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkTailwindVersion, createDefaultRegistry, fetchStudioTokens, injectCSSImport, writeTokenFiles, } from '@rafters/design-tokens';
import { configExists, defaultConfig, detectFramework, detectPackageManager, findCssFile, getDefaultCssFile, hasReact, isNodeProject, saveConfig, } from '../utils/config.js';
import { getCoreDependencies, installDependencies } from '../utils/dependencies.js';
import { getRaftersLogo, getRaftersTitle } from '../utils/logo.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
export async function initCommand() {
    const cwd = process.cwd();
    // Display ASCII logo
    console.log(getRaftersLogo());
    console.log(`\n${getRaftersTitle()}`);
    // Check prerequisites
    const spinner = ora('Checking prerequisites...').start();
    if (!isNodeProject(cwd)) {
        spinner.fail('No package.json found. Run this in a Node.js project.');
        process.exit(1);
    }
    if (!hasReact(cwd)) {
        spinner.fail('React not found in dependencies. Rafters requires React 18+.');
        process.exit(1);
    }
    if (configExists(cwd)) {
        spinner.fail('Rafters already initialized. Remove .rafters directory to reinitialize.');
        process.exit(1);
    }
    spinner.succeed('Prerequisites checked');
    // Check Tailwind version and warn about v3
    const tailwindVersion = await checkTailwindVersion(cwd);
    if (tailwindVersion === 'v3') {
        console.log();
        console.log('Tailwind v3 detected. Rafters requires Tailwind CSS v4.');
        console.log('Run: npm install tailwindcss@next');
        process.exit(1);
    }
    // Detect framework and CSS file for better defaults
    const framework = detectFramework(cwd);
    const existingCssFile = findCssFile(cwd);
    const defaultCssFile = getDefaultCssFile(framework, cwd);
    // Interactive setup
    const answers = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'hasStorybook',
            message: 'Do you use Storybook?',
            default: false,
        },
        {
            type: 'input',
            name: 'componentsDir',
            message: 'Components directory:',
            default: './src/components/ui',
        },
        {
            type: 'input',
            name: 'storiesDir',
            message: 'Stories directory:',
            default: './src/stories',
            when: (answers) => answers.hasStorybook,
        },
        {
            type: 'input',
            name: 'cssFile',
            message: existingCssFile
                ? `CSS file to inject design tokens (found: ${existingCssFile}):`
                : 'CSS file to inject design tokens (will create if missing):',
            default: defaultCssFile,
            validate: (input) => {
                if (!input.endsWith('.css')) {
                    return 'CSS file must end with .css';
                }
                return true;
            },
        },
        {
            type: 'input',
            name: 'studioShortcode',
            message: 'Studio shortcode (leave blank for default grayscale):',
            validate: (input) => {
                if (!input)
                    return true; // Allow blank for default
                if (!/^[A-Z0-9]{6,8}$/i.test(input)) {
                    return 'Shortcode must be 6-8 characters (letters and numbers only)';
                }
                return true;
            },
        },
        {
            type: 'list',
            name: 'tokenFormat',
            message: 'Design token format:',
            choices: [
                { name: 'Tailwind CSS v4', value: 'tailwind' },
                { name: 'Vanilla CSS', value: 'css' },
                { name: 'React Native', value: 'react-native' },
            ],
            default: 'tailwind',
        },
        {
            type: 'list',
            name: 'packageManager',
            message: 'Package manager:',
            choices: [
                { name: 'pnpm', value: 'pnpm' },
                { name: 'npm', value: 'npm' },
                { name: 'yarn', value: 'yarn' },
            ],
            default: detectPackageManager(cwd),
        },
    ]);
    const config = {
        ...defaultConfig,
        hasStorybook: answers.hasStorybook,
        componentsDir: answers.componentsDir,
        storiesDir: answers.storiesDir || defaultConfig.storiesDir,
        cssFile: answers.cssFile,
        tailwindVersion: tailwindVersion,
        tokenFormat: answers.tokenFormat,
        packageManager: answers.packageManager,
    };
    // Get design tokens from Studio or create default
    let tokenSet;
    if (answers.studioShortcode) {
        const tokenSpinner = ora('Fetching tokens from Studio...').start();
        try {
            tokenSet = await fetchStudioTokens(answers.studioShortcode);
            tokenSpinner.succeed('Studio tokens loaded');
        }
        catch (error) {
            tokenSpinner.warn(`Failed to fetch Studio tokens: ${error instanceof Error ? error.message : 'Unknown error'}`);
            tokenSet = createDefaultRegistry();
        }
    }
    else {
        tokenSet = createDefaultRegistry();
    }
    // Create directories and files
    const setupSpinner = ora('Setting up Rafters...').start();
    try {
        // Create .rafters directory
        const raftersDir = join(cwd, '.rafters');
        ensureDirSync(raftersDir);
        // Save config
        saveConfig(config, cwd);
        // Fetch agent instructions from registry
        const agentInstructionsPath = join(raftersDir, 'agent-instructions.md');
        try {
            const response = await fetch(`${config.registry}/templates/agent-instructions`);
            if (response.ok) {
                const agentInstructions = await response.text();
                writeFileSync(agentInstructionsPath, agentInstructions);
            }
            else {
                // Fallback to basic instructions
                const fallbackInstructions = `# Rafters AI Agent Instructions

This project uses Rafters design system components with embedded intelligence.

## Component Usage Guidelines
- Always read component intelligence before using components
- Use semantic tokens instead of arbitrary values
- Follow trust-building patterns for user actions
- Apply accessibility standards systematically

## Key Principles
- Cognitive Load: Choose components appropriate for user mental capacity
- Trust Building: Follow patterns that build user confidence
- Attention Economics: Understand visual hierarchy and component priority
- Progressive Enhancement: Build from core experience outward

## Resources
- Component Registry: ${config.registry}/components
- Design Intelligence: https://rafters.realhandy.tech
`;
                writeFileSync(agentInstructionsPath, fallbackInstructions);
            }
        }
        catch {
            // Fallback if registry is unavailable
            const fallbackInstructions = `# Rafters AI Agent Instructions

This project uses Rafters design system components with embedded intelligence.
Visit https://rafters.realhandy.tech for complete documentation.
`;
            writeFileSync(agentInstructionsPath, fallbackInstructions);
        }
        // Create component manifest
        const manifestPath = join(raftersDir, 'component-manifest.json');
        const manifest = {
            version: '1.0.0',
            initialized: new Date().toISOString(),
            components: {},
        };
        writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        // Create components directory
        ensureDirSync(join(cwd, config.componentsDir));
        // Create lib directory and utils
        const libDir = join(cwd, 'src/lib');
        ensureDirSync(libDir);
        const utilsPath = join(libDir, 'utils.ts');
        if (!existsSync(utilsPath)) {
            try {
                const response = await fetch(`${config.registry}/templates/utils`);
                if (response.ok) {
                    const utilsContent = await response.text();
                    writeFileSync(utilsPath, utilsContent);
                }
                else {
                    // Fallback to basic utils
                    const fallbackUtils = `import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
                    writeFileSync(utilsPath, fallbackUtils);
                }
            }
            catch {
                // Fallback if registry is unavailable
                const fallbackUtils = `import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
                writeFileSync(utilsPath, fallbackUtils);
            }
        }
        // Create stories directory if using Storybook
        if (config.hasStorybook && config.storiesDir) {
            ensureDirSync(join(cwd, config.storiesDir));
        }
        // Write design tokens and registry
        await writeTokenFiles(tokenSet, answers.tokenFormat, cwd);
        // Install complete design system CSS
        if (answers.tokenFormat === 'css' || answers.tokenFormat === 'tailwind') {
            const cssResult = await injectCSSImport(config.cssFile, cwd);
            if (cssResult.action === 'replaced' && cssResult.backupPath) {
                console.log(`Backed up existing ${config.cssFile} to ${cssResult.backupPath}`);
            }
        }
        setupSpinner.succeed('Rafters setup complete');
        // Install dependencies
        const depsSpinner = ora('Installing core dependencies...').start();
        const coreDeps = getCoreDependencies();
        try {
            await installDependencies(coreDeps, config.packageManager, cwd);
            depsSpinner.succeed('Core dependencies installed');
        }
        catch (_error) {
            depsSpinner.warn('Failed to install dependencies automatically. Please install manually:');
            console.log(`${config.packageManager} ${config.packageManager === 'npm' ? 'install' : 'add'} ${coreDeps.join(' ')}`);
        }
        console.log('Rafters initialized.');
    }
    catch (error) {
        setupSpinner.fail('Failed to setup Rafters');
        console.error(error);
        process.exit(1);
    }
}
