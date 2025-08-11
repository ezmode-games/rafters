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
