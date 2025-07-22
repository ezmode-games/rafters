import type { Config } from './config.js';
export declare function installDependencies(dependencies: string[], packageManager: Config['packageManager'], cwd?: string): Promise<void>;
export declare function getCoreDependencies(): string[];
