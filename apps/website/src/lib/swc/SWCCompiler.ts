/**
 * SWC TypeScript/JSX Compiler
 *
 * Transforms component source code to executable JavaScript using SWC
 * with caching and comprehensive error handling.
 */

import { createHash } from 'node:crypto';
import { transform } from '@swc/core';
import type { CompilationError, CompilationOptions, CompilationResult, SWCConfig } from './types';

export class SWCCompiler {
  private cache: Map<string, string> = new Map();
  private initialized = false;

  async init(): Promise<void> {
    // Initialize SWC compiler (lazy loading)
    // SWC is ready to use immediately after import, no async initialization needed
    this.initialized = true;
  }

  async compile(source: string, options: CompilationOptions = {}): Promise<CompilationResult> {
    const startTime = performance.now();

    // Check initialization
    if (!this.initialized) {
      await this.init();
    }

    // Generate cache key from source hash
    const sourceHash = this.hash(source);
    const cacheKey = options.cacheKey || sourceHash;

    // Check cache for compiled result
    const cachedCode = this.cache.get(cacheKey);
    if (cachedCode) {
      return {
        code: cachedCode,
        cacheHit: true,
        compilationTime: performance.now() - startTime,
        sourceHash,
      };
    }

    try {
      // Transform using SWC if not cached
      const compiledCode = await this.transformWithSWC(source, options.filename);

      // Store result in cache
      this.cache.set(cacheKey, compiledCode);

      // Return compilation result with metadata
      return {
        code: compiledCode,
        cacheHit: false,
        compilationTime: performance.now() - startTime,
        sourceHash,
      };
    } catch (error) {
      // Re-throw with enhanced error information
      throw this.createCompilationError(error, options.filename);
    }
  }

  private async transformWithSWC(source: string, filename?: string): Promise<string> {
    const config: SWCConfig = {
      jsc: {
        parser: {
          syntax: 'typescript',
          tsx: true,
          decorators: false,
          dynamicImport: true,
        },
        transform: {
          react: {
            runtime: 'automatic',
            development: false,
            refresh: false,
          },
        },
        target: 'es2020',
      },
      module: {
        type: 'commonjs',
      },
      sourceMaps: false,
      minify: false,
      isModule: true,
    };
    const result = await transform(source, {
      ...config,
      filename: filename || 'component.tsx',
    });

    return result.code;
  }

  private hash(source: string): string {
    return createHash('sha256').update(source).digest('hex');
  }

  private createCompilationError(error: unknown, filename?: string): CompilationError {
    const compilationError = new Error() as CompilationError;
    compilationError.name = 'CompilationError';
    compilationError.originalError = error;
    compilationError.filename = filename;

    // Extract line/column information from SWC error messages
    if (
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      compilationError.message = error.message;

      // Parse SWC error format for line/column info
      // SWC errors typically include location info in the message
      const locationMatch = error.message.match(/(\d+):(\d+)/);
      if (locationMatch) {
        compilationError.line = Number.parseInt(locationMatch[1], 10);
        compilationError.column = Number.parseInt(locationMatch[2], 10);
      }
    } else {
      compilationError.message = 'Unknown compilation error occurred';
    }

    // Include filename context if available
    if (filename) {
      compilationError.message = `${filename}: ${compilationError.message}`;
    }

    return compilationError;
  }

  clearCache(): void {
    this.cache.clear();
  }

  // Utility methods for cache management
  getCacheSize(): number {
    return this.cache.size;
  }

  getCacheKeys(): string[] {
    return Array.from(this.cache.keys());
  }
}
