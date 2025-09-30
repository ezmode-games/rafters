/**
 * React SSR Component Execution Engine
 *
 * Executes compiled JavaScript components using React's renderToString
 * for static HTML generation at build time.
 *
 * Uses Node.js native module imports via temporary files for clean,
 * reliable execution without custom require() implementations.
 */

import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import type { ExecutionError, ExecutionResult } from './types';

export class ReactSSRExecutor {
  private tempDir = '.astro/swc-temp';
  private initialized = false;

  /**
   * Initialize temp directory for component execution
   */
  private async init(): Promise<void> {
    if (this.initialized) return;

    try {
      await mkdir(this.tempDir, { recursive: true });
      this.initialized = true;
    } catch (error) {
      throw this.createExecutionError(error, undefined, 'creation');
    }
  }

  /**
   * Execute compiled component code and render to HTML
   */
  async execute(
    compiledCode: string,
    props: Record<string, unknown> = {},
    options: { componentName?: string } = {}
  ): Promise<ExecutionResult> {
    const startTime = performance.now();
    const componentName = options.componentName || 'Component';

    // Ensure temp directory exists
    await this.init();

    // Generate unique temp file path
    const tempFile = join(this.tempDir, `${componentName}-${Date.now()}.js`);

    try {
      // 1. Write compiled code to temp file
      await writeFile(tempFile, compiledCode, 'utf-8');

      // 2. Import as Node.js module (supports both CommonJS and ESM)
      const module = await import(tempFile);

      // 3. Extract component function
      const ComponentFunction = this.extractComponent(module, componentName);

      // 4. Sanitize props for React rendering
      const sanitizedProps = this.sanitizeProps(props);

      // 5. Create React element with props
      const element = React.createElement(ComponentFunction, sanitizedProps);

      // 6. Render to HTML string
      const html = renderToString(element);

      const renderTime = performance.now() - startTime;

      return {
        html,
        renderTime,
        componentName,
        props: sanitizedProps,
      };
    } catch (error) {
      // Check if error is already an ExecutionError
      if (
        error &&
        typeof error === 'object' &&
        'name' in error &&
        error.name === 'ExecutionError'
      ) {
        throw error;
      }
      throw this.createExecutionError(error, componentName, 'rendering');
    } finally {
      // 7. Clean up temp file
      try {
        await unlink(tempFile);
      } catch (cleanupError) {
        console.warn(`Failed to clean up temp file ${tempFile}:`, cleanupError);
      }
    }
  }

  /**
   * Extract component from module exports
   * Supports: default export, named export, or direct function export
   */
  private extractComponent(
    // biome-ignore lint/suspicious/noExplicitAny: Module type is dynamic
    module: any,
    componentName: string
  ): React.ComponentType<unknown> {
    try {
      let ComponentFunction: React.ComponentType<unknown>;

      // Try default export first
      if (module.default && typeof module.default === 'function') {
        ComponentFunction = module.default;
      }
      // Try named export matching component name
      else if (module[componentName] && typeof module[componentName] === 'function') {
        ComponentFunction = module[componentName];
      }
      // Find first function in exports
      else {
        const exportedFunctions = Object.values(module).filter(
          (value): value is React.ComponentType<unknown> => typeof value === 'function'
        );
        if (exportedFunctions.length > 0) {
          ComponentFunction = exportedFunctions[0];
        } else {
          throw new Error('No React component function found in module exports');
        }
      }

      // Validate component is a function
      if (typeof ComponentFunction !== 'function') {
        throw new Error(`Expected component to be a function, got ${typeof ComponentFunction}`);
      }

      return ComponentFunction;
    } catch (error) {
      throw this.createExecutionError(error, componentName, 'creation');
    }
  }

  /**
   * Sanitize props for safe React rendering
   * Removes functions and circular references
   */
  private sanitizeProps(props: Record<string, unknown>): Record<string, unknown> {
    try {
      const sanitized: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(props)) {
        if (value === null || value === undefined) {
          sanitized[key] = value;
        } else if (typeof value === 'function') {
          // Skip functions (React can't serialize)
          sanitized[key] = undefined;
        } else if (typeof value === 'string' && value.startsWith('function')) {
          // Skip string functions
          sanitized[key] = undefined;
        } else if (typeof value === 'object' && value !== null) {
          try {
            // Test for circular references
            JSON.stringify(value);
            sanitized[key] = value;
          } catch {
            // Skip objects with circular references
            sanitized[key] = undefined;
          }
        } else {
          // Keep primitives (string, number, boolean)
          sanitized[key] = value;
        }
      }

      return sanitized;
    } catch (error) {
      throw this.createExecutionError(error, undefined, 'props');
    }
  }

  /**
   * Create properly typed ExecutionError
   */
  private createExecutionError(
    error: unknown,
    componentName?: string,
    phase: ExecutionError['phase'] = 'rendering'
  ): ExecutionError {
    const executionError = new Error() as ExecutionError;
    executionError.name = 'ExecutionError';
    executionError.componentName = componentName;
    executionError.phase = phase;
    executionError.originalError = error;

    if (
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      executionError.message = `${phase} error${componentName ? ` in ${componentName}` : ''}: ${error.message}`;
    } else {
      executionError.message = `${phase} error${componentName ? ` in ${componentName}` : ''}: Unknown error occurred`;
    }

    return executionError;
  }
}
