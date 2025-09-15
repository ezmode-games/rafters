import { existsSync } from 'node:fs';
import { join } from 'node:path';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import ora from 'ora';

const { removeSync } = fs;

interface CleanOptions {
  force?: boolean;
}

export async function cleanCommand(options: CleanOptions): Promise<void> {
  const cwd = process.cwd();
  const raftersDir = join(cwd, '.rafters');

  // Check if .rafters directory exists
  if (!existsSync(raftersDir)) {
    console.log('No .rafters directory found. Nothing to clean.');
    return;
  }

  // If not forcing, ask for confirmation
  if (!options.force) {
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldClean',
        message: 'This will remove the entire .rafters directory and all configuration. Continue?',
        default: false,
      },
    ]);

    if (!answers.shouldClean) {
      console.log('Clean cancelled.');
      return;
    }
  }

  const spinner = ora('Cleaning Rafters configuration...').start();

  try {
    // Remove the entire .rafters directory
    removeSync(raftersDir);
    spinner.succeed('Rafters configuration cleaned successfully');

    console.log('Removed:');
    console.log('  • .rafters/ directory');
    console.log('  • All token files');
    console.log('  • Component manifest');
    console.log('  • Configuration files');
    console.log('');
    console.log('Run "rafters init" to reinitialize Rafters.');
  } catch (error) {
    spinner.fail('Failed to clean Rafters configuration');
    console.error(error);
    process.exit(1);
  }
}
