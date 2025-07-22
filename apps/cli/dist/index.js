#!/usr/bin/env node
import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { addCommand } from './commands/add.js';
import { listCommand } from './commands/list.js';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));
const program = new Command();
program
    .name('rafters')
    .description('CLI for installing Rafters design system components with embedded intelligence')
    .version(packageJson.version);
program
    .command('init')
    .description('Initialize Rafters in your project')
    .action(initCommand);
program
    .command('add <component>')
    .description('Add a Rafters component with design intelligence')
    .option('-f, --force', 'Overwrite existing component')
    .action(addCommand);
program
    .command('list')
    .description('List available and installed components')
    .option('-d, --details', 'Show detailed component information')
    .action(listCommand);
program.parse();
