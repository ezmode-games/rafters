import { z } from 'zod';
export declare const ConfigSchema: z.ZodObject<{
    version: z.ZodString;
    componentsDir: z.ZodString;
    storiesDir: z.ZodOptional<z.ZodString>;
    hasStorybook: z.ZodBoolean;
    packageManager: z.ZodEnum<{
        npm: "npm";
        yarn: "yarn";
        pnpm: "pnpm";
    }>;
    registry: z.ZodString;
    cssFile: z.ZodOptional<z.ZodString>;
    tailwindVersion: z.ZodOptional<z.ZodEnum<{
        v3: "v3";
        v4: "v4";
    }>>;
    tokenFormat: z.ZodOptional<z.ZodEnum<{
        css: "css";
        tailwind: "tailwind";
        "react-native": "react-native";
    }>>;
}, z.core.$strip>;
export type Config = z.infer<typeof ConfigSchema>;
export declare const defaultConfig: Config;
export declare function getConfigPath(cwd?: string): string;
export declare function configExists(cwd?: string): boolean;
export declare function loadConfig(cwd?: string): Config;
export declare function saveConfig(config: Config, cwd?: string): void;
export declare function detectPackageManager(cwd?: string): Config['packageManager'];
export declare function isNodeProject(cwd?: string): boolean;
export declare function hasReact(cwd?: string): boolean;
export declare function detectFramework(cwd?: string): string | null;
export declare function findCssFile(cwd?: string): string | null;
export declare function getDefaultCssFile(framework: string | null, cwd?: string): string;
/**
 * Detect import alias configuration from tsconfig.json or jsconfig.json
 * Returns the detected alias or null if none found
 */
export declare function detectImportAlias(cwd?: string): string | null;
/**
 * Transform component imports to use the detected alias or relative paths
 */
export declare function transformImports(componentContent: string, componentsDir: string, cwd?: string): string;
