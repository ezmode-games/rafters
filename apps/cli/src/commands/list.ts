import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import { loadConfig } from '../utils/config.js';
import { getRaftersTitle } from '../utils/logo.js';
import { type ComponentManifest, fetchComponentRegistry } from '../utils/registry.js';

const ConfigSchema = z
  .object({
    componentsDir: z.string(),
    packageManager: z.string(),
  })
  .nullable();

interface ListOptions {
  details?: boolean;
}

interface InstalledComponent {
  path: string;
  installed: string;
  version: string;
  intelligence: {
    cognitiveLoad: number;
    attentionEconomics: string;
    accessibility: string;
    trustBuilding: string;
    semanticMeaning: string;
  };
  dependencies: string[];
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

function compareVersions(installed: string, registry: string): 'up-to-date' | 'outdated' | 'newer' {
  const parseVersion = (v: string) => v.split('.').map(Number);
  const [iMajor = 0, iMinor = 0, iPatch = 0] = parseVersion(installed);
  const [rMajor = 0, rMinor = 0, rPatch = 0] = parseVersion(registry);

  if (iMajor > rMajor) return 'newer';
  if (iMajor < rMajor) return 'outdated';
  if (iMinor > rMinor) return 'newer';
  if (iMinor < rMinor) return 'outdated';
  if (iPatch > rPatch) return 'newer';
  if (iPatch < rPatch) return 'outdated';
  return 'up-to-date';
}

export async function listCommand(options: ListOptions = {}): Promise<void> {
  try {
    let config: z.infer<typeof ConfigSchema>;
    try {
      config = ConfigSchema.parse(loadConfig());
    } catch {
      // If not initialized, just show available components
      config = null;
    }

    const registry = await fetchComponentRegistry();
    const installed = config ? loadInstalledComponents() : {};

    console.log(getRaftersTitle());
    console.log();

    if (options.details) {
      // Show detailed view with update information
      const installedNames = Object.keys(installed);
      const updatesAvailable: string[] = [];

      if (installedNames.length > 0) {
        console.log('Installed Components:');
        console.log();

        for (const name of installedNames) {
          const component = installed[name];
          const registryComponent = (registry.components || []).find((c) => c.name === name);

          console.log(`${name} (v${component.version})`);
          console.log(`  Path: ${component.path}`);
          console.log(`  Installed: ${new Date(component.installed).toLocaleDateString()}`);
          console.log(
            `  Intelligence: Cognitive load=${component.intelligence.cognitiveLoad}/10, ${component.intelligence.attentionEconomics.split(':')[0]}`
          );

          if (registryComponent) {
            const registryComponentWithVersion = registryComponent as ComponentManifest & {
              version?: string;
            };
            const registryVersion =
              registryComponentWithVersion.version ||
              registryComponent.meta?.rafters?.version ||
              '0.0.0';
            const versionStatus = compareVersions(component.version, registryVersion);
            if (versionStatus === 'outdated') {
              console.log(`  \u2191 Update available: v${registryVersion}`);
              updatesAvailable.push(name);
            } else if (versionStatus === 'newer') {
              console.log('  \u2197 Development version (newer than registry)');
            } else {
              console.log('  \u2713 Up to date');
            }
          } else {
            console.log('  ? Component not found in registry');
          }

          if (component.dependencies.length > 0) {
            console.log(`  Dependencies: ${component.dependencies.join(', ')}`);
          }
          console.log();
        }
      }

      const availableComponents = (registry.components || []).filter((c) => !installed[c.name]);

      if (availableComponents.length > 0) {
        console.log(`Available Components (${availableComponents.length} remaining):`);
        console.log();

        for (const component of availableComponents.slice(0, 8)) {
          const componentWithIntelligence = component as ComponentManifest & {
            intelligence?: { cognitiveLoad: number };
            version?: string;
          };
          const cognitiveLoad =
            componentWithIntelligence.intelligence?.cognitiveLoad ||
            component.meta?.rafters?.intelligence?.cognitiveLoad ||
            0;
          const version =
            componentWithIntelligence.version || component.meta?.rafters?.version || '0.0.0';
          const description = component.description || 'No description available';
          console.log(`  ${component.name} (v${version})`);
          console.log(`    ${description}`);
          console.log(`    Intelligence: Cognitive load=${cognitiveLoad}/10`);
          console.log();
        }

        if (availableComponents.length > 8) {
          console.log(
            `  ... and ${availableComponents.length - 8} more (use 'rafters list' for compact view)`
          );
          console.log();
        }
      }

      if (updatesAvailable.length > 0) {
        console.log(
          `\u2191 ${updatesAvailable.length} update(s) available: ${updatesAvailable.join(', ')}`
        );
        console.log(`Run 'rafters add ${updatesAvailable.join(' ')}' to update`);
      }
    } else {
      // Show enhanced compact view with update status
      const installedNames = Object.keys(installed);
      const updatesAvailable: string[] = [];

      // Check for installed components and updates
      if (installedNames.length > 0) {
        console.log('Installed Components:');
        console.log();

        for (const name of installedNames) {
          const installedComponent = installed[name];
          const registryComponent = (registry.components || []).find((c) => c.name === name);

          if (registryComponent) {
            const registryComponentWithVersion = registryComponent as ComponentManifest & {
              version?: string;
            };
            const registryVersion =
              registryComponentWithVersion.version ||
              registryComponent.meta?.rafters?.version ||
              '0.0.0';
            const versionStatus = compareVersions(installedComponent.version, registryVersion);
            let statusIcon = '✓';
            let statusText = '';

            if (versionStatus === 'outdated') {
              statusIcon = '↑';
              statusText = ` (update available: v${registryVersion})`;
              updatesAvailable.push(name);
            } else if (versionStatus === 'newer') {
              statusIcon = '↗';
              statusText = ' (dev version)';
            }

            console.log(
              `${statusIcon} ${name.padEnd(12)} v${installedComponent.version}${statusText}`
            );
          } else {
            console.log(`? ${name.padEnd(12)} v${installedComponent.version} (not in registry)`);
          }
        }
        console.log();
      }

      // Show available components not yet installed
      const availableComponents = (registry.components || []).filter((c) => !installed[c.name]);

      if (availableComponents.length > 0) {
        console.log('Available Components:');
        console.log();

        for (const component of availableComponents) {
          const componentWithIntelligence = component as ComponentManifest & {
            intelligence?: { cognitiveLoad: number };
          };
          const cognitiveLoad =
            componentWithIntelligence.intelligence?.cognitiveLoad ||
            component.meta?.rafters?.intelligence?.cognitiveLoad ||
            0;
          const description = component.description || 'No description available';
          console.log(
            `  ${component.name.padEnd(12)} - ${description} (load: ${cognitiveLoad}/10)`
          );
        }
        console.log();
      }

      // Summary
      const installedCount = installedNames.length;
      const totalCount = registry.components?.length || 0;
      const availableCount = totalCount - installedCount;

      console.log(`Summary: ${installedCount} installed, ${availableCount} available`);

      if (updatesAvailable.length > 0) {
        console.log(`Updates: ${updatesAvailable.length} component(s) have updates available`);
        console.log(`Run 'rafters add ${updatesAvailable.join(' ')}' to update`);
      }
    }
  } catch (error) {
    console.error('Error listing components:', error);
    process.exit(1);
  }
}
