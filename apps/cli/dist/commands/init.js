import chalk from 'chalk';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import ora from 'ora';
const { ensureDirSync, writeFileSync, existsSync } = fs;
import { readFileSync } from 'node:fs';
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
    console.log(chalk.blue('\n🏗️  Initializing Rafters...'));
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
        console.log(chalk.red.bold('🚨 TAILWIND V3 DETECTED! 🚨'));
        console.log(chalk.yellow('YAH NHO V3! UPGRADE BITCHES!'));
        console.log(chalk.gray('Rafters requires Tailwind CSS v4 for @theme support.'));
        console.log(chalk.blue('Run: npm install tailwindcss@next'));
        console.log();
        process.exit(1);
    }
    // Detect framework and CSS file for better defaults
    const framework = detectFramework(cwd);
    const existingCssFile = findCssFile(cwd);
    const defaultCssFile = getDefaultCssFile(framework, cwd);
    if (framework) {
        console.log(chalk.gray(`Detected ${framework} project`));
    }
    if (existingCssFile) {
        console.log(chalk.gray(`Found CSS file: ${existingCssFile}`));
    }
    else {
        console.log(chalk.yellow(`No existing CSS file found. Will suggest: ${defaultCssFile}`));
    }
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
    ]);
    const packageManager = detectPackageManager(cwd);
    const config = {
        ...defaultConfig,
        hasStorybook: answers.hasStorybook,
        componentsDir: answers.componentsDir,
        storiesDir: answers.storiesDir || defaultConfig.storiesDir,
        cssFile: answers.cssFile,
        tailwindVersion: tailwindVersion,
        tokenFormat: answers.tokenFormat,
        packageManager,
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
            console.log(chalk.gray('  Falling back to default grayscale theme'));
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
        // Create agent instructions
        const agentInstructionsPath = join(raftersDir, 'agent-instructions.md');
        const agentInstructions = readFileSync(join(__dirname, '../templates/agent-instructions.md'), 'utf-8');
        writeFileSync(agentInstructionsPath, agentInstructions);
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
            const utilsContent = readFileSync(join(__dirname, '../templates/utils.ts'), 'utf-8');
            writeFileSync(utilsPath, utilsContent);
        }
        // Create stories directory if using Storybook
        if (config.hasStorybook && config.storiesDir) {
            ensureDirSync(join(cwd, config.storiesDir));
        }
        // Write design tokens and registry
        await writeTokenFiles(tokenSet, answers.tokenFormat, cwd);
        // Inject CSS import if needed
        if (answers.tokenFormat === 'css' || answers.tokenFormat === 'tailwind') {
            await injectCSSImport(config.cssFile, cwd);
        }
        setupSpinner.succeed('Rafters setup complete');
        // Install dependencies
        const depsSpinner = ora('Installing core dependencies...').start();
        const coreDeps = getCoreDependencies();
        try {
            await installDependencies(coreDeps, packageManager, cwd);
            depsSpinner.succeed('Core dependencies installed');
        }
        catch (_error) {
            depsSpinner.warn('Failed to install dependencies automatically. Please install manually:');
            console.log(chalk.gray(`  ${packageManager} ${packageManager === 'npm' ? 'install' : 'add'} ${coreDeps.join(' ')}`));
        }
        // Success message
        console.log();
        console.log(chalk.green('✅ Rafters initialized successfully!'));
        console.log();
        console.log('Next steps:');
        console.log(chalk.gray('  • Add components: ') + chalk.blue('rafters add button'));
        console.log(chalk.gray('  • List available: ') + chalk.blue('rafters list'));
        console.log(chalk.gray('  • Design tokens: ') +
            chalk.blue(`src/design-tokens.${answers.tokenFormat === 'react-native' ? 'ts' : 'css'}`));
        console.log(chalk.gray('  • Token intelligence: ') + chalk.blue('.rafters/tokens/registry.json'));
        console.log(chalk.gray('  • AI instructions: ') + chalk.blue('.rafters/agent-instructions.md'));
    }
    catch (error) {
        setupSpinner.fail('Failed to setup Rafters');
        console.error(chalk.red(error));
        process.exit(1);
    }
}
