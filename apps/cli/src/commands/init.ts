import fs from 'fs-extra';
import inquirer from 'inquirer';
import ora from 'ora';

const { ensureDirSync, writeFileSync, existsSync } = fs;

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  checkTailwindVersion,
  fetchStudioTokens,
  generateAllTokens,
  injectCSSImport,
  writeTokenFiles,
} from '@rafters/design-tokens';
import {
  type Config,
  configExists,
  defaultConfig,
  detectFramework,
  detectPackageManager,
  findCssFile,
  getDefaultCssFile,
  hasReact,
  isNodeProject,
  saveConfig,
} from '../utils/config.js';
import { getCoreDependencies, installDependencies } from '../utils/dependencies.js';
import { getRaftersLogo, getRaftersTitle } from '../utils/logo.js';

// TODO: Use __dirname for template file resolution in future
// const __dirname = dirname(fileURLToPath(import.meta.url));

export async function initCommand(options: { yes?: boolean; config?: string } = {}): Promise<void> {
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

  // Setup configuration - interactive, config file, or use defaults
  interface InitAnswers {
    componentsDir: string;
    cssFile: string;
    studioShortcode: string;
    tokenFormat: string;
    packageManager: string;
  }
  let answers: InitAnswers;

  if (options.config) {
    // Load configuration from file
    try {
      const configPath = join(cwd, options.config);
      if (!existsSync(configPath)) {
        console.error(
          `Config file not found at ${configPath}. Please check the file path and ensure the file exists.`
        );
        process.exit(1);
      }

      const configContent = readFileSync(configPath, 'utf8');
      const configAnswers = JSON.parse(configContent);

      // Validate required fields and provide defaults
      answers = {
        componentsDir: configAnswers.componentsDir || './src/components/ui',
        cssFile: configAnswers.cssFile || defaultCssFile,
        studioShortcode: configAnswers.studioShortcode || '',
        tokenFormat: configAnswers.tokenFormat || 'tailwind',
        packageManager: configAnswers.packageManager || detectPackageManager(cwd),
      };

      console.log(`Using configuration from: ${options.config}`);
    } catch (error) {
      console.error(
        `Failed to parse config file '${options.config}': ${error instanceof Error ? error.message : error}. Please ensure the file contains valid JSON.`
      );
      process.exit(1);
    }
  } else if (options.yes) {
    // Non-interactive mode - use defaults
    answers = {
      componentsDir: './src/components/ui',
      cssFile: defaultCssFile,
      studioShortcode: '', // Default to empty (use generated tokens)
      tokenFormat: 'tailwind',
      packageManager: detectPackageManager(cwd),
    };
    console.log('Using default configuration (non-interactive mode)');
  } else {
    // Interactive setup
    answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'componentsDir',
        message: 'Components directory:',
        default: './src/components/ui',
      },
      {
        type: 'input',
        name: 'cssFile',
        message: existingCssFile
          ? `CSS file to inject design tokens (found: ${existingCssFile}):`
          : 'CSS file to inject design tokens (will create if missing):',
        default: defaultCssFile,
        validate: (input: string) => {
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
        validate: (input: string) => {
          if (!input) return true; // Allow blank for default
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
  }

  const config: Config = {
    ...defaultConfig,
    componentsDir: answers.componentsDir,
    cssFile: answers.cssFile,
    tailwindVersion: tailwindVersion as 'v3' | 'v4',
    tokenFormat: answers.tokenFormat as 'css' | 'tailwind' | 'react-native',
    packageManager: answers.packageManager as 'npm' | 'yarn' | 'pnpm',
  };

  // Get design tokens from Studio or create default
  let tokenSet: Awaited<ReturnType<typeof fetchStudioTokens>>;
  if (answers.studioShortcode) {
    const tokenSpinner = ora('Fetching tokens from Studio...').start();
    try {
      tokenSet = await fetchStudioTokens(answers.studioShortcode);
      tokenSpinner.succeed('Studio tokens loaded');
    } catch (error) {
      tokenSpinner.warn(
        `Failed to fetch Studio tokens: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      // Generate default tokens using generators
      const tokens = await generateAllTokens();
      tokenSet = {
        id: 'default',
        name: 'Generated Design System',
        tokens,
      };
    }
  } else {
    // Generate default tokens using generators
    const tokens = await generateAllTokens();
    tokenSet = {
      id: 'default',
      name: 'Generated Design System',
      tokens,
    };
  }

  // Check if we're in test mode
  const isTestMode =
    process.env.NODE_ENV === 'test' || process.env.CI === 'true' || process.env.VITEST === 'true';

  // Create directories and files
  const setupSpinner = ora('Setting up Rafters...').start();

  try {
    // Create .rafters directory
    const raftersDir = join(cwd, '.rafters');
    ensureDirSync(raftersDir);

    // Save config
    saveConfig(config, cwd);

    // Fetch agent instructions from registry (skip in test mode)
    const agentInstructionsPath = join(raftersDir, 'agent-instructions.md');
    if (isTestMode) {
      // Use fallback instructions in test mode
      const fallbackInstructions = `# Rafters AI Agent Instructions

This project uses Rafters design system components with embedded intelligence.
Visit https://rafters.realhandy.tech for complete documentation.
`;
      writeFileSync(agentInstructionsPath, fallbackInstructions);
    } else {
      try {
        const response = await fetch(`${config.registry}/templates/agent-instructions`);
        if (response.ok) {
          const agentInstructions = await response.text();
          writeFileSync(agentInstructionsPath, agentInstructions);
        } else {
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
      } catch {
        // Fallback if registry is unavailable
        const fallbackInstructions = `# Rafters AI Agent Instructions

This project uses Rafters design system components with embedded intelligence.
Visit https://rafters.realhandy.tech for complete documentation.
`;
        writeFileSync(agentInstructionsPath, fallbackInstructions);
      }
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
      if (isTestMode) {
        // Use fallback utils in test mode
        const fallbackUtils = `import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
        writeFileSync(utilsPath, fallbackUtils);
      } else {
        try {
          const response = await fetch(`${config.registry}/templates/utils`);
          if (response.ok) {
            const utilsContent = await response.text();
            writeFileSync(utilsPath, utilsContent);
          } else {
            // Fallback to basic utils
            const fallbackUtils = `import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
            writeFileSync(utilsPath, fallbackUtils);
          }
        } catch {
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
    }

    // Write design tokens and registry
    await writeTokenFiles(tokenSet, answers.tokenFormat, cwd);

    // Install complete design system CSS
    if (answers.tokenFormat === 'css' || answers.tokenFormat === 'tailwind') {
      const cssResult = await injectCSSImport(config.cssFile!, cwd);

      if (cssResult.action === 'replaced' && cssResult.backupPath) {
        console.log(`Backed up existing ${config.cssFile} to ${cssResult.backupPath}`);
      }
    }

    setupSpinner.succeed('Rafters setup complete');

    // Install dependencies (skip in test/CI environments)
    if (isTestMode) {
      console.log('Skipping dependency installation in test mode');
    } else {
      const depsSpinner = ora('Installing core dependencies...').start();
      const coreDeps = getCoreDependencies();

      try {
        await installDependencies(coreDeps, config.packageManager, cwd);
        depsSpinner.succeed('Core dependencies installed');
      } catch (_error) {
        depsSpinner.warn('Failed to install dependencies automatically. Please install manually:');
        console.log(
          `${config.packageManager} ${config.packageManager === 'npm' ? 'install' : 'add'} ${coreDeps.join(' ')}`
        );
      }
    }

    console.log('Rafters initialized.');
  } catch (error) {
    setupSpinner.fail('Failed to setup Rafters');
    console.error(error);
    process.exit(1);
  }
}
