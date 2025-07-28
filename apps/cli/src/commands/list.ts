import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import chalk from 'chalk';
import { type Config, loadConfig } from '../utils/config.js';
import { getRaftersTitle } from '../utils/logo.js';
import { fetchComponentRegistry } from '../utils/registry.js';

interface ListOptions {
  details?: boolean;
}

interface InstalledComponent {
  name: string;
  path: string;
  story?: string;
  installed: string;
  version: string;
  intelligence: {
    cognitiveLoad: number;
    attentionEconomics: string;
    accessibility: string;
    trustBuilding: string;
    semanticMeaning: string;
  };
}

function loadInstalledComponents(cwd = process.cwd()): Record<string, InstalledComponent> {
  try {
    const manifestPath = join(cwd, '.rafters', 'component-manifest.json');
    if (!existsSync(manifestPath)) return {};

    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    return manifest.components || {};
  } catch {
    return {};
  }
}

export async function listCommand(options: ListOptions = {}): Promise<void> {
  try {
    let config: Config | null;
    try {
      config = loadConfig();
    } catch {
      // If not initialized, just show available components
      config = null;
    }

    const registry = await fetchComponentRegistry();
    const installed = config ? loadInstalledComponents() : {};

    console.log(getRaftersTitle());
    console.log();

    if (options.details) {
      // Show detailed view
      const installedComponents = Object.values(installed);

      if (installedComponents.length > 0) {
        console.log(chalk.green('Installed Components:'));
        console.log();

        for (const component of installedComponents) {
          console.log(chalk.bold(component.name) + chalk.gray(` (v${component.version})`));
          console.log(chalk.gray(`  Path: ${component.path}`));
          if (component.story) {
            console.log(chalk.gray(`  Story: ${component.story}`));
          }
          console.log(
            chalk.gray(
              `  Intelligence: Cognitive load=${component.intelligence.cognitiveLoad}, ${component.intelligence.attentionEconomics.split(':')[0]}`
            )
          );
          console.log();
        }
      }

      const availableComponents = registry.components.filter((c) => !installed[c.name]);

      if (availableComponents.length > 0) {
        console.log(chalk.yellow(`Available Components: ${availableComponents.length} remaining`));
        console.log();

        for (const component of availableComponents.slice(0, 5)) {
          console.log(
            chalk.gray('  ') + component.name + chalk.gray(` - ${component.description}`)
          );
        }

        if (availableComponents.length > 5) {
          console.log(chalk.gray(`  ... and ${availableComponents.length - 5} more`));
        }
      }
    } else {
      // Show compact view
      console.log('Available Components:');
      console.log();

      for (const component of registry.components) {
        const isInstalled = installed[component.name];
        const icon = isInstalled ? chalk.green('✓') : chalk.gray(' ');
        const name = isInstalled ? chalk.green(component.name) : component.name;
        const description = chalk.gray(`- ${component.description}`);

        console.log(`${icon} ${name.padEnd(12)} ${description}`);
      }

      const installedCount = Object.keys(installed).length;
      const totalCount = registry.components.length;

      console.log();
      console.log(chalk.gray(`Installed: ${installedCount}/${totalCount} components`));
      console.log();
      if (config) {
        console.log(chalk.gray("Use 'rafters add <component>' to install components."));
        if (installedCount > 0) {
          console.log(chalk.gray("Use 'rafters list --details' for more information."));
        }
      } else {
        console.log(chalk.gray("Run 'rafters init' to initialize Rafters in your project."));
      }
    }
  } catch (error) {
    console.error(chalk.red('Error listing components:'), error);
    process.exit(1);
  }
}
