import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import { loadConfig } from '../utils/config.js';
import { getRaftersTitle } from '../utils/logo.js';
import { fetchComponentRegistry } from '../utils/registry.js';
const ConfigSchema = z
    .object({
    componentsDir: z.string(),
    packageManager: z.string(),
    hasStorybook: z.boolean(),
    storiesDir: z.string().optional(),
})
    .nullable();
function loadInstalledComponents(cwd = process.cwd()) {
    try {
        const manifestPath = join(cwd, '.rafters', 'component-manifest.json');
        if (!existsSync(manifestPath))
            return {};
        const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
        return manifest.components || {};
    }
    catch {
        return {};
    }
}
export async function listCommand(options = {}) {
    try {
        let config;
        try {
            config = ConfigSchema.parse(loadConfig());
        }
        catch {
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
                console.log('Installed Components:');
                console.log();
                for (const component of installedComponents) {
                    console.log(`${component.name} (v${component.version})`);
                    console.log(`  Path: ${component.path}`);
                    if (component.story) {
                        console.log(`  Story: ${component.story}`);
                    }
                    console.log(`  Intelligence: Cognitive load=${component.intelligence.cognitiveLoad}, ${component.intelligence.attentionEconomics.split(':')[0]}`);
                    console.log();
                }
            }
            const availableComponents = (registry.components || []).filter((c) => !installed[c.name]);
            if (availableComponents.length > 0) {
                console.log(`Available Components: ${availableComponents.length} remaining`);
                console.log();
                for (const component of availableComponents.slice(0, 5)) {
                    console.log(`  ${component.name} - ${component.description}`);
                }
                if (availableComponents.length > 5) {
                    console.log(`  ... and ${availableComponents.length - 5} more`);
                }
            }
        }
        else {
            // Show compact view
            console.log('Available Components:');
            console.log();
            for (const component of registry.components || []) {
                const isInstalled = installed[component.name];
                const icon = isInstalled ? '[x]' : '[ ]';
                const name = component.name;
                const description = `- ${component.description}`;
                console.log(`${icon} ${name.padEnd(12)} ${description}`);
            }
            const installedCount = Object.keys(installed).length;
            const totalCount = registry.components?.length || 0;
            console.log();
            console.log(`Installed: ${installedCount}/${totalCount} components`);
        }
    }
    catch (error) {
        console.error('Error listing components:', error);
        process.exit(1);
    }
}
