/**
 * CLI type definitions
 */

export interface CLIConfig {
  output: string;
  colorApiUrl?: string;
  template: string;
  typescript: boolean;
}

export interface GenerateOptions {
  output: string;
  config: string;
  colorApi?: string;
}

export interface InitOptions {
  template: string;
  typescript: boolean;
}

export interface ValidateOptions {
  path: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface TokenFile {
  name: string;
  path: string;
  tokens: unknown[];
  intelligence: Record<string, unknown>;
}
