import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
export const ConfigSchema = z.object({
    version: z.string(),
    componentsDir: z.string(),
    storiesDir: z.string().optional(),
    hasStorybook: z.boolean(),
    packageManager: z.enum(['npm', 'yarn', 'pnpm']),
    registry: z.string().url(),
});
export const defaultConfig = {
    version: '1.0.0',
    componentsDir: './src/components/ui',
    storiesDir: './src/stories',
    hasStorybook: false,
    packageManager: 'npm',
    registry: 'https://rafters.realhandy.tech/api/registry',
};
export function getConfigPath(cwd = process.cwd()) {
    return join(cwd, '.rafters', 'config.json');
}
export function configExists(cwd = process.cwd()) {
    return existsSync(getConfigPath(cwd));
}
export function loadConfig(cwd = process.cwd()) {
    const configPath = getConfigPath(cwd);
    if (!existsSync(configPath)) {
        throw new Error('Rafters not initialized. Run `rafters init` first.');
    }
    try {
        const configFile = readFileSync(configPath, 'utf-8');
        const config = JSON.parse(configFile);
        return ConfigSchema.parse(config);
    }
    catch (error) {
        throw new Error(`Invalid config file: ${error}`);
    }
}
export function saveConfig(config, cwd = process.cwd()) {
    const configPath = getConfigPath(cwd);
    writeFileSync(configPath, JSON.stringify(config, null, 2));
}
export function detectPackageManager(cwd = process.cwd()) {
    if (existsSync(join(cwd, 'pnpm-lock.yaml')))
        return 'pnpm';
    if (existsSync(join(cwd, 'yarn.lock')))
        return 'yarn';
    return 'npm';
}
export function isNodeProject(cwd = process.cwd()) {
    return existsSync(join(cwd, 'package.json'));
}
export function hasReact(cwd = process.cwd()) {
    try {
        const packageJson = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf-8'));
        const deps = {
            ...packageJson.dependencies,
            ...packageJson.devDependencies,
        };
        return 'react' in deps;
    }
    catch {
        return false;
    }
}
