/**
 * CLI type definitions
 */

export interface CLIConfig {
  output: string;
  colorApiUrl?: string;
  template: string;
  typescript: boolean;
}

export interface InitOptions {
  template: string;
  typescript: boolean;
}
