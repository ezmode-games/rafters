import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import fs from 'fs-extra';
const { ensureDirSync, writeFileSync, existsSync } = fs;
import { join } from 'path';
import { getRaftersLogo } from '../utils/logo.js';
import { defaultConfig, saveConfig, configExists, isNodeProject, hasReact, detectPackageManager, } from '../utils/config.js';
import { installDependencies, getCoreDependencies } from '../utils/dependencies.js';
import { readFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
export async function initCommand() {
    const cwd = process.cwd();
    console.log(getRaftersLogo());
    console.log(chalk.blue('🏗️  Initializing Rafters...'));
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
    ]);
    const packageManager = detectPackageManager(cwd);
    const config = {
        ...defaultConfig,
        hasStorybook: answers.hasStorybook,
        componentsDir: answers.componentsDir,
        storiesDir: answers.storiesDir || defaultConfig.storiesDir,
        packageManager,
    };
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
        setupSpinner.succeed('Rafters setup complete');
        // Install dependencies
        const depsSpinner = ora('Installing core dependencies...').start();
        const coreDeps = getCoreDependencies();
        try {
            await installDependencies(coreDeps, packageManager, cwd);
            depsSpinner.succeed('Core dependencies installed');
        }
        catch (error) {
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
        console.log(chalk.gray('  • Read intelligence: ') + chalk.blue('.rafters/agent-instructions.md'));
    }
    catch (error) {
        setupSpinner.fail('Failed to setup Rafters');
        console.error(chalk.red(error));
        process.exit(1);
    }
}
