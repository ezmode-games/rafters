#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';
import { addCommand } from './commands/add.js';
import { cleanCommand } from './commands/clean.js';
import { initCommand } from './commands/init.js';
import { listCommand } from './commands/list.js';
import { tokensCommand } from './commands/tokens.js';
import { startMCPServer } from './mcp/index.js';

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
  .option('-y, --yes', 'Use default values for all prompts (non-interactive)')
  .option('-c, --config <file>', 'Use configuration from answers file (JSON)')
  .action(initCommand);

program
  .command('add <components...>')
  .description('Add Rafters components with design intelligence')
  .option('-f, --force', 'Overwrite existing components')
  .action(addCommand);

program
  .command('list')
  .description('List available and installed components')
  .option('-d, --details', 'Show detailed component information')
  .action(listCommand);

program
  .command('clean')
  .description('Remove all Rafters configuration and files')
  .option('-f, --force', 'Skip confirmation prompt')
  .action(cleanCommand);

program
  .command('tokens <action> [args...]')
  .description('Access design token intelligence')
  .option('-j, --json', 'Output as JSON')
  .action(tokensCommand)
  .addHelpText(
    'after',
    `
Available actions:
  get <name>          Get a specific token
  list [category]     List all tokens or by category
  color <name>        Get color intelligence with scale and states
  validate <colors>   Validate color combination cognitive load
  
Examples:
  rafters tokens get primary
  rafters tokens list color
  rafters tokens color primary --json
  rafters tokens validate primary warning destructive`
  );

program
  .command('mcp')
  .description('Start the Rafters MCP server for AI agent integration')
  .action(async () => {
    try {
      await startMCPServer();
    } catch (error) {
      console.error('Failed to start MCP server:', error);
      process.exit(1);
    }
  });

program.parse();
