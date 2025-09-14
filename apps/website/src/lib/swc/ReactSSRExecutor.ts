/**
 * React SSR Component Execution Engine
 *
 * Executes compiled JavaScript components using React's renderToString
 * for static HTML generation at build time.
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import type { ExecutionError, ExecutionResult } from './types';

export class ReactSSRExecutor {
  async execute(
    compiledCode: string,
    props: Record<string, unknown> = {},
    options: { componentName?: string } = {}
  ): Promise<ExecutionResult> {
    const startTime = performance.now();
    const componentName = options.componentName || 'Component';

    try {
      // 1. Create component function from compiled code
      const ComponentFunction = this.createComponentFromCode(compiledCode, componentName);

      // 2. Sanitize props for React rendering
      const sanitizedProps = this.sanitizeProps(props);

      // 3. Create React element with props
      const element = React.createElement(ComponentFunction, sanitizedProps);

      // 4. Render to HTML string using renderToString
      const html = renderToString(element);

      const renderTime = performance.now() - startTime;

      return {
        html,
        renderTime,
        componentName,
        props: sanitizedProps,
      };
    } catch (error) {
      // Check if error is already an ExecutionError from createComponentFromCode
      if (
        error &&
        typeof error === 'object' &&
        'name' in error &&
        error.name === 'ExecutionError'
      ) {
        throw error; // Re-throw creation errors as-is
      }
      // Handle rendering errors
      throw this.createExecutionError(error, componentName, 'rendering');
    }
  }

  private createComponentFromCode(
    compiledCode: string,
    componentName?: string
  ): React.ComponentType<unknown> {
    try {
      // Create safe execution context with required globals
      const executionContext = this.createSafeExecutionContext();

      // Execute compiled JavaScript in isolated context
      // Order: parameters first, then the function body
      const executeCode = new Function(
        'React',
        'require',
        'exports',
        'module',
        'console',
        compiledCode
      );

      executeCode(
        executionContext.React,
        executionContext.require,
        executionContext.exports,
        executionContext.module,
        executionContext.console
      );

      // Extract component from module exports
      let ComponentFunction: React.ComponentType<unknown>;

      if (executionContext.module.exports?.default) {
        // Default export
        ComponentFunction = executionContext.module.exports.default;
      } else if (
        executionContext.module.exports &&
        typeof executionContext.module.exports === 'function'
      ) {
        // Direct function export
        ComponentFunction = executionContext.module.exports;
      } else if (
        executionContext.exports &&
        componentName &&
        executionContext.exports[componentName]
      ) {
        // Named export matching component name
        ComponentFunction = executionContext.exports[componentName];
      } else if (executionContext.exports) {
        // Find first function in named exports
        const exportedFunctions = Object.values(executionContext.exports).filter(
          (value): value is React.ComponentType<unknown> => typeof value === 'function'
        );
        if (exportedFunctions.length > 0) {
          ComponentFunction = exportedFunctions[0];
        } else {
          throw new Error('No React component found in compiled code exports');
        }
      } else {
        throw new Error('No valid component export found in compiled code');
      }

      // Validate component function
      if (typeof ComponentFunction !== 'function') {
        throw new Error(`Expected component to be a function, got ${typeof ComponentFunction}`);
      }

      return ComponentFunction;
    } catch (error) {
      throw this.createExecutionError(error, componentName, 'creation');
    }
  }

  private sanitizeProps(props: Record<string, unknown>): Record<string, unknown> {
    try {
      const sanitized: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(props)) {
        // Handle different value types
        if (value === null || value === undefined) {
          // Keep null/undefined values
          sanitized[key] = value;
        } else if (typeof value === 'function') {
          // Convert functions to undefined (React can't serialize functions)
          sanitized[key] = undefined;
        } else if (typeof value === 'string' && value.startsWith('function')) {
          // Convert string functions to undefined
          sanitized[key] = undefined;
        } else if (typeof value === 'object' && value !== null) {
          try {
            // Test for circular references by attempting JSON serialization
            JSON.stringify(value);
            sanitized[key] = value;
          } catch {
            // Skip objects with circular references
            sanitized[key] = undefined;
          }
        } else {
          // Keep primitive values (string, number, boolean)
          sanitized[key] = value;
        }
      }

      return sanitized;
    } catch (error) {
      throw this.createExecutionError(error, undefined, 'props');
    }
  }

  private createSafeExecutionContext(): {
    React: typeof React;
    require: (id: string) => unknown;
    exports: Record<string, unknown>;
    module: { exports: unknown };
    console: {
      log: (...args: unknown[]) => void;
      warn: (...args: unknown[]) => void;
      error: (...args: unknown[]) => void;
    };
  } {
    return {
      React,
      require: (id: string) => {
        // Minimal require implementation for essential modules
        if (id === 'react') return React;
        if (id === 'react/jsx-runtime') {
          // Provide jsx runtime for React 19 automatic transformation
          return {
            jsx: React.createElement,
            jsxs: React.createElement,
            Fragment: React.Fragment,
          };
        }
        throw new Error(`Module ${id} not available in execution context`);
      },
      exports: {},
      module: { exports: {} },
      console: {
        // Safe console implementation for component logging
        log: (...args: unknown[]) => console.log('[Component]', ...args),
        warn: (...args: unknown[]) => console.warn('[Component]', ...args),
        error: (...args: unknown[]) => console.error('[Component]', ...args),
      },
    };
  }

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
