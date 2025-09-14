/**
 * SWC Component Preview System
 *
 * Exports for JSDoc Intelligence parsing and TypeScript/JSX compilation
 */

// React SSR Executor
export { ReactSSRExecutor } from './ReactSSRExecutor';
// Registry Component Fetcher
export { RegistryComponentFetcher } from './RegistryFetcher';
// SWC Compiler
export { SWCCompiler } from './SWCCompiler';

// Types
export type {
  CompilationError,
  CompilationOptions,
  CompilationResult,
  ComponentIntelligence,
  ExecutionError,
  ExecutionResult,
  FetchResult,
  RegistryComponent,
  RegistryError,
  SWCConfig,
} from './types';

// JSDoc Parser (will be available when Issue #127 is completed)
// export { JSDocIntelligenceParser } from './JSDocParser';
