/**
 * SWC Component Preview System
 *
 * Exports for JSDoc Intelligence parsing and TypeScript/JSX compilation
 */

// SWC Compiler
export { SWCCompiler } from './SWCCompiler';

// Types
export type {
  CompilationError,
  CompilationOptions,
  CompilationResult,
  ComponentIntelligence,
  SWCConfig,
} from './types';

// JSDoc Parser (will be available when Issue #127 is completed)
// export { JSDocIntelligenceParser } from './JSDocParser';
