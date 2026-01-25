#!/usr/bin/env node
/**
 * Rafters CLI
 *
 * Initialize projects with design tokens and run MCP server for AI agents.
 */

import { Command } from 'commander';
import { add } from './commands/add.js';
import { init } from './commands/init.js';
import { mcp } from './commands/mcp.js';
import { studio } from './commands/studio.js';

const program = new Command();

program
  .name('rafters')
  .description('Design system CLI - scaffold tokens and serve MCP')
  .version('0.0.1');

program
  .command('init')
  .description('Initialize .rafters/ with default tokens and config')
  .option('-f, --force', 'Regenerate output files from existing config')
  .option('--agent', 'Output JSON for machine consumption')
  .action(init);

program
  .command('add')
  .description('Add rafters components to the project')
  .argument('[components...]', 'Component names to add')
  .option('--list', 'List available components')
  .option('--overwrite', 'Overwrite existing component files')
  .option('--registry-url <url>', 'Custom registry URL')
  .option('--agent', 'Output JSON for machine consumption')
  .action(add);

program.command('mcp').description('Start MCP server for AI agent access (stdio)').action(mcp);

program.command('studio').description('Open Studio UI for visual token editing').action(studio);

program.parse();
