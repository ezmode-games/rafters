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
  usagePatterns: {
    dos: string[];
    nevers: string[];
  };
  designGuides: Array<{
    name: string;
    url: string;
  }>;
  examples: Array<{
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
