/**
 * CLI UI utilities
 *
 * Pretty output for humans, JSON for agents.
 */

import ora, { type Ora } from 'ora';

export interface UIContext {
  agent: boolean;
  spinner: Ora | null;
}

const context: UIContext = {
  agent: false,
  spinner: null,
};

export function setAgentMode(agent: boolean): void {
  context.agent = agent;
}

export function isAgentMode(): boolean {
  return context.agent;
}

/**
 * Log an event - JSON for agents, pretty for humans
 */
export function log(event: Record<string, unknown>): void {
  if (context.agent) {
    console.log(JSON.stringify(event));
    return;
  }

  // Human-friendly output based on event type
  const eventType = event.event as string;

  switch (eventType) {
    // Init events
    case 'init:start':
      context.spinner = ora('Initializing rafters...').start();
      break;

    case 'init:detected':
      context.spinner?.succeed('Project detected');
      console.log(`  Framework: ${event.framework}`);
      console.log(`  Tailwind: v${event.tailwindVersion}`);
      if (event.hasShadcn) {
        console.log('  shadcn/ui: detected');
      }
      context.spinner = ora('Generating tokens...').start();
      break;

    case 'init:shadcn_detected': {
      context.spinner?.info('Found existing shadcn colors');
      console.log(`  Backed up: ${event.backupPath}`);
      const colors = event.colorsFound as { light: number; dark: number };
      console.log(`  Colors: ${colors.light} light, ${colors.dark} dark`);
      context.spinner = ora('Generating tokens...').start();
      break;
    }

    case 'init:generated':
      context.spinner?.succeed(`Generated ${event.tokenCount} tokens`);
      context.spinner = ora('Saving registry...').start();
      break;

    case 'init:registry_saved':
      context.spinner?.succeed(`Saved ${event.namespaceCount} namespaces`);
      break;

    case 'init:css_updated':
      console.log(`  Updated: ${event.cssPath}`);
      break;

    case 'init:css_not_found':
      console.log(`\n  Note: ${event.message}`);
      break;

    case 'init:css_already_imported':
      console.log(`  CSS already configured: ${event.cssPath}`);
      break;

    case 'init:regenerate':
      context.spinner = ora('Regenerating from existing config...').start();
      break;

    case 'init:loaded':
      context.spinner?.succeed(`Loaded ${event.tokenCount} tokens`);
      context.spinner = ora('Generating outputs...').start();
      break;

    case 'init:colors_imported':
      console.log(`  Imported ${event.count} existing colors`);
      break;

    case 'init:complete': {
      context.spinner?.succeed('Done!');
      console.log(`\n  Output: ${event.path}`);
      const outputs = event.outputs as string[];
      for (const file of outputs) {
        console.log(`    - ${file}`);
      }
      console.log('');
      break;
    }

    // Add events
    case 'add:start': {
      const components = event.components as string[];
      context.spinner = ora(`Adding ${components.join(', ')}...`).start();
      break;
    }

    case 'add:installed': {
      context.spinner?.succeed(`Installed ${event.component}`);
      const files = event.files as string[];
      for (const file of files) {
        console.log(`    ${file}`);
      }
      context.spinner = ora('Installing...').start();
      break;
    }

    case 'add:skip':
      context.spinner?.warn(`Skipped ${event.component} (already exists)`);
      context.spinner = ora('Installing...').start();
      break;

    case 'add:dependencies':
      if (context.spinner) {
        context.spinner.text = 'Installing dependencies...';
      }
      break;

    case 'add:complete':
      context.spinner?.succeed(
        `Added ${event.installed} component${(event.installed as number) !== 1 ? 's' : ''}`,
      );
      if ((event.skipped as number) > 0) {
        console.log(`  Skipped: ${event.skipped} (use --overwrite to replace)`);
      }
      console.log('');
      break;

    case 'add:hint':
      console.log(`\n  ${event.message}`);
      break;

    case 'add:warning':
      console.warn(`  Warning: ${event.message}`);
      break;

    case 'add:error':
      context.spinner?.fail(event.message as string);
      break;

    default:
      // Fallback for unknown events
      if (context.spinner) {
        context.spinner.text = eventType;
      } else {
        console.log(event);
      }
  }
}

/**
 * Log an error
 */
export function error(message: string): void {
  if (context.agent) {
    console.error(JSON.stringify({ event: 'error', message }));
    return;
  }

  context.spinner?.fail(message);
  context.spinner = null;
}

/**
 * Stop spinner on unexpected exit
 */
export function cleanup(): void {
  context.spinner?.stop();
  context.spinner = null;
}
