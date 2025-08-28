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
    cssFile: z.string().optional(), // CSS file to inject imports into
    tailwindVersion: z.enum(['v3', 'v4']).optional(),
    tokenFormat: z.enum(['css', 'tailwind', 'react-native']).optional(),
});
export const defaultConfig = {
    version: '1.0.0',
    componentsDir: './src/components/ui',
    storiesDir: './src/stories',
    hasStorybook: false,
    packageManager: 'npm',
    registry: 'https://rafters.realhandy.tech/api/registry',
    cssFile: 'globals.css', // Default CSS file for Tailwind v4
    tailwindVersion: 'v4',
    tokenFormat: 'tailwind',
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
export function detectFramework(cwd = process.cwd()) {
    try {
        const packageJson = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf-8'));
        const deps = {
            ...packageJson.dependencies,
            ...packageJson.devDependencies,
        };
        // Check for Next.js
        if ('next' in deps)
            return 'next';
        // Check for React Router (v7+ has react-router, older versions have react-router-dom)
        if ('react-router' in deps || '@react-router/dev' in deps)
            return 'react-router';
        // Check for Remix
        if ('remix' in deps || '@remix-run/dev' in deps)
            return 'remix';
        // Check for Vite
        if ('vite' in deps)
            return 'vite';
        // Check for Create React App (has react-scripts)
        if ('react-scripts' in deps)
            return 'cra';
        return null;
    }
    catch {
        return null;
    }
}
export function findCssFile(cwd = process.cwd()) {
    // Common CSS file locations to check
    const possibleFiles = [
        'app/globals.css', // Next.js App Router
        'src/globals.css', // Next.js Pages Router / Generic
        'app/app.css', // React Router v7
        'app/root.css', // Remix
        'src/index.css', // Vite / CRA
        'src/App.css', // CRA alternative
        'styles/globals.css', // Custom styles dir
        'globals.css', // Root level
        'app.css', // Root level
    ];
    for (const file of possibleFiles) {
        const fullPath = join(cwd, file);
        if (existsSync(fullPath)) {
            return file;
        }
    }
    return null;
}
export function getDefaultCssFile(framework, cwd = process.cwd()) {
    // First, try to find an existing CSS file
    const existingFile = findCssFile(cwd);
    if (existingFile) {
        return existingFile;
    }
    // If no existing file, suggest framework-appropriate default
    switch (framework) {
        case 'next':
            return 'app/globals.css'; // Next.js App Router
        case 'react-router':
            return 'app/app.css'; // React Router v7
        case 'remix':
            return 'app/root.css'; // Remix
        case 'vite':
            return 'src/index.css'; // Vite
        case 'cra':
            return 'src/index.css'; // Create React App
        default:
            return 'src/globals.css'; // Generic fallback
    }
}
/**
 * Detect import alias configuration from tsconfig.json or jsconfig.json
 * Returns the detected alias or null if none found
 */
export function detectImportAlias(cwd = process.cwd()) {
    // Check for any tsconfig.* or jsconfig.* files
    const configPatterns = [
        'tsconfig.json',
        'jsconfig.json',
        'tsconfig.app.json',
        'tsconfig.cloudflare.json',
        'tsconfig.node.json',
        'tsconfig.web.json',
        'tsconfig.server.json',
        'tsconfig.build.json',
    ];
    for (const configFile of configPatterns) {
        const configPath = join(cwd, configFile);
        if (existsSync(configPath)) {
            try {
                const configContent = readFileSync(configPath, 'utf-8');
                const config = JSON.parse(configContent);
                const paths = config.compilerOptions?.paths;
                if (!paths)
                    continue;
                // Common alias patterns to check
                const commonAliases = ['@/*', '~/*', '#/*', '$/*'];
                for (const alias of commonAliases) {
                    if (paths[alias] && Array.isArray(paths[alias]) && paths[alias].length > 0) {
                        // Extract the alias prefix (e.g., "@" from "@/*")
                        return alias.replace('/*', '');
                    }
                }
            }
            catch { }
        }
    }
    return null;
}
/**
 * Transform component imports to use the detected alias or relative paths
 */
export function transformImports(componentContent, componentsDir, cwd = process.cwd()) {
    const alias = detectImportAlias(cwd);
    let transformedContent = componentContent;
    if (alias) {
        // Transform relative imports to use alias
        // Replace "../lib/utils" with "@/lib/utils" (or detected alias)
        transformedContent = transformedContent.replace(/from\s+['"]\.\.\/lib\/utils['"];?/g, `from '${alias}/lib/utils';`);
        // Transform other common relative imports
        transformedContent = transformedContent.replace(/from\s+['"]\.\.\/([^'"]+)['"];?/g, `from '${alias}/$1';`);
    }
    else {
        // No alias detected, use relative paths
        // This is already the default in our components, so no transformation needed
        // But we should ensure the relative path is correct based on componentsDir
        // If componentsDir is not the standard "./src/components/ui", adjust the relative path
        if (componentsDir !== './src/components/ui') {
            // Calculate the relative path from componentsDir to src/lib/utils
            const srcLibPath = join(cwd, 'src/lib');
            const componentsDirPath = join(cwd, componentsDir);
            // Simple heuristic: if componentsDir is deeper, add more "../"
            const relativeDepth = componentsDir.split('/').length - 2; // -2 for "./" and "src"
            const relativePath = relativeDepth > 2 ? `${'../'.repeat(relativeDepth - 2)}../lib/utils` : '../lib/utils';
            transformedContent = transformedContent.replace(/from\s+['"]\.\.\/lib\/utils['"];?/g, `from '${relativePath}';`);
        }
    }
    // Remove invalid imports like @rafters/design-tokens/motion
    transformedContent = transformedContent.replace(/import.*from\s+['"]@rafters\/design-tokens\/motion['"];?\n?/g, '');
    // Remove references to motion classes that don't exist
    transformedContent = transformedContent.replace(/'motion-hover'[\s,]*/g, '');
    transformedContent = transformedContent.replace(/'easing-snappy'[\s,]*/g, '');
    // Clean up any double commas or trailing commas in className strings
    transformedContent = transformedContent.replace(/,\s*,/g, ',');
    transformedContent = transformedContent.replace(/,\s*\)/g, ')');
    return transformedContent;
}
