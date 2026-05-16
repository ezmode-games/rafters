#!/usr/bin/env node
/**
 * Rafters CLI
 *
 * Initialize projects with design tokens and run MCP server for AI agents.
 */

import { Command } from 'commander';
import { add } from './commands/add.js';
import { importCommand } from './commands/import.js';
import { init } from './commands/init.js';
import { mcp } from './commands/mcp.js';
import { set } from './commands/set.js';
import { studio } from './commands/studio.js';
import { withErrorHandler } from './utils/ui.js';

const program = new Command();

program
  .name('rafters')
  .description('Design system CLI - scaffold tokens and serve MCP')
  .version('0.0.1');

program
  .command('init')
  .description('Initialize .rafters/ with default tokens and config')
  .option('-r, --rebuild', 'Regenerate output files from existing tokens')
  .option('--reset', 'Re-run generators fresh, replacing persisted tokens')
  .option(
    '--framework <name>',
    'Override framework detection (next|vite|remix|react-router|astro|wc|vanilla)',
  )
  .option(
    '--accept-detected',
    'In agent mode, auto-accept the highest-confidence onboard detection without prompting (#1513)',
  )
  .option('--agent', 'Output JSON for machine consumption')
  .action(withErrorHandler(init));

program
  .command('import')
  .description('Import existing design tokens (Tailwind v4, shadcn, generic CSS)')
  .option('--force', 'Overwrite existing .rafters/import-pending.json')
  .option('--importer <id>', 'Force a specific importer (tailwind-v4, shadcn, generic-css)')
  .option(
    '--apply',
    'Merge accepted tokens from .rafters/import-pending.json into the registry and regenerate outputs',
  )
  .option('--agent', 'Output JSON for machine consumption')
  .action(withErrorHandler(importCommand));

program
  .command('add')
  .description('Add rafters components to the project')
  .argument('[components...]', 'Component names to add')
  .option('--list', 'List available components')
  .option('--overwrite', 'Overwrite existing component files')
  .option('--update', 'Re-fetch named components from registry')
  .option('--update-all', 'Re-fetch all installed components from registry')
  .option('--registry-url <url>', 'Custom registry URL')
  .option('--agent', 'Output JSON for machine consumption')
  .action(withErrorHandler(add));

program
  .command('mcp')
  .description('Start MCP server for AI agent access (stdio)')
  .option('--project-root <path>', 'Explicit project root (skips .rafters/ discovery)')
  .action(mcp);

program
  .command('set')
  .description('Set a token value. Records userOverride and cascades to dependents.')
  .argument('<name>', 'Token name')
  .argument('<value>', 'New value (string, or JSON for ColorValue/ColorReference)')
  .option(
    '--reason <text>',
    'Reason for the change (recorded with userOverride; prompted if missing in non-agent mode)',
  )
  .option('--rafters-dir <path>', 'Directory of .rafters.json files', '.rafters/tokens')
  .option('--agent', 'Output JSON for machine consumption')
  .action(withErrorHandler(set));

program.command('studio').description('Open Studio UI for visual token editing').action(studio);

program.parse();
