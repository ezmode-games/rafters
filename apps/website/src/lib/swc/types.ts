/**
 * Types for SWC Component Preview System
 *
 * Includes both JSDoc Intelligence parsing and SWC TypeScript compilation types.
 */

// JSDoc Intelligence Types (from Issue #127)
export interface ComponentIntelligence {
  cognitiveLoad: number;
  attentionEconomics: string;
  trustBuilding: string;
  accessibility: string;
  semanticMeaning: string;
  usagePatterns?: {
    dos: string[];
    nevers: string[];
  };
  designGuides?: Array<{
    name: string;
    url: string;
  }>;
  examples?: Array<{
    code: string;
  }>;
}

// SWC Compilation Types (Issue #128)
export interface CompilationResult {
  code: string;
  cacheHit: boolean;
  compilationTime: number;
  sourceHash: string;
}

export interface CompilationError extends Error {
  name: 'CompilationError';
  line?: number;
  column?: number;
  filename?: string;
  originalError: unknown;
}

// SWC Configuration Types
export interface SWCConfig {
  jsc: {
    parser: {
      syntax: 'typescript' | 'ecmascript';
      tsx: boolean;
      decorators: boolean;
      dynamicImport: boolean;
    };
    transform: {
      react: {
        runtime: 'automatic' | 'classic';
        development: boolean;
        refresh: boolean;
      };
    };
    target: string;
  };
  module: {
    type: 'commonjs' | 'es6' | 'amd' | 'umd';
  };
  sourceMaps: boolean;
  minify: boolean;
  isModule: boolean;
}

// Compilation Options
export interface CompilationOptions {
  filename?: string;
  cacheKey?: string;
}

// React SSR Execution Types (Issue #129)
export interface ExecutionResult {
  html: string;
  renderTime: number;
  componentName: string;
  props: Record<string, unknown>;
}

export interface ExecutionError extends Error {
  name: 'ExecutionError';
  componentName?: string;
  phase: 'creation' | 'rendering' | 'props';
  originalError: unknown;
}

// Registry Component Fetcher Types (Issue #130)
export interface RegistryComponent {
  name: string;
  type: string;
  description: string;
  dependencies: string[];
  files: Array<{
    path: string;
    content: string;
    type: string;
  }>;
  meta?: {
    rafters?: {
      version: string;
      intelligence?: ComponentIntelligence;
      usagePatterns?: {
        dos: string[];
        nevers: string[];
      };
      designGuides?: Array<{
        name: string;
        url: string;
      }>;
      examples?: Array<{
        code: string;
      }>;
    };
  };
}

export interface FetchResult {
  component: RegistryComponent;
  fromCache: boolean;
  fetchTime: number;
  registryUrl: string;
}

export interface RegistryError extends Error {
  name: 'RegistryError';
  componentName: string;
  statusCode?: number;
  registryUrl: string;
}
