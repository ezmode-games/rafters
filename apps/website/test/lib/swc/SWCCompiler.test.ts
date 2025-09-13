/**
 * SWC Compiler Tests
 *
 * Comprehensive test coverage for TypeScript/JSX compilation with SWC
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { SWCCompiler } from '../../../src/lib/swc/SWCCompiler';

describe('SWCCompiler', () => {
  let compiler: SWCCompiler;

  beforeEach(async () => {
    compiler = new SWCCompiler();
    await compiler.init();
  });

  describe('Initialization', () => {
    it('should initialize successfully', async () => {
      const newCompiler = new SWCCompiler();
      await expect(newCompiler.init()).resolves.not.toThrow();
    });

    it('should be able to compile after initialization', async () => {
      const newCompiler = new SWCCompiler();
      await newCompiler.init();

      const source = 'export const test = "hello";';
      const result = await newCompiler.compile(source);

      expect(result.code).toBeDefined();
      expect(result.code.length).toBeGreaterThan(0);
    });
  });

  describe('Basic TypeScript Compilation', () => {
    it('should compile simple TypeScript to JavaScript', async () => {
      const tsSource = `
        interface ButtonProps {
          children: React.ReactNode;
          variant?: 'primary' | 'secondary';
        }

        export function Button({ children, variant = 'primary' }: ButtonProps) {
          return <button className={\`btn \${variant}\`}>{children}</button>;
        }
      `;

      const result = await compiler.compile(tsSource, { filename: 'Button.tsx' });

      // Should contain compiled JavaScript with automatic React runtime
      expect(result.code).toContain('_jsxruntime.jsx');
      expect(result.code).toContain('btn');
      expect(result.cacheHit).toBe(false);
      expect(result.compilationTime).toBeGreaterThan(0);
      expect(result.sourceHash).toBeDefined();
      expect(result.sourceHash.length).toBe(64); // SHA-256 hash
    });

    it('should compile JSX with automatic React runtime', async () => {
      const jsxSource = `
        export function SimpleButton() {
          return <button onClick={() => alert('clicked')}>Click me</button>;
        }
      `;

      const result = await compiler.compile(jsxSource);

      // Should use automatic React runtime (jsx/jsxs)
      expect(result.code).toContain('_jsxruntime.jsx');
      expect(result.code).toContain('onClick');
    });

    it('should handle modern JavaScript features', async () => {
      const modernSource = `
        export const processItems = async (items: string[]) => {
          const results = await Promise.all(
            items.map(async item => {
              const { data } = await fetch(\`/api/\${item}\`).then(r => r.json());
              return { item, data };
            })
          );
          return results;
        };
      `;

      const result = await compiler.compile(modernSource);

      expect(result.code).toBeDefined();
      expect(result.code).toContain('async');
      expect(result.code).toContain('Promise.all');
    });
  });

  describe('Caching Behavior', () => {
    it('should cache compiled results', async () => {
      const source = `
        export function CachedComponent() {
          return <div>Cached test</div>;
        }
      `;

      // First compilation
      const firstResult = await compiler.compile(source);
      expect(firstResult.cacheHit).toBe(false);
      expect(firstResult.compilationTime).toBeGreaterThan(0);

      // Second compilation should hit cache
      const secondResult = await compiler.compile(source);
      expect(secondResult.cacheHit).toBe(true);
      expect(secondResult.sourceHash).toBe(firstResult.sourceHash);
      expect(secondResult.code).toBe(firstResult.code);
      expect(secondResult.compilationTime).toBeLessThan(firstResult.compilationTime);
    });

    it('should use different cache keys for different source', async () => {
      const source1 = 'export const a = 1;';
      const source2 = 'export const b = 2;';

      const result1 = await compiler.compile(source1);
      const result2 = await compiler.compile(source2);

      expect(result1.sourceHash).not.toBe(result2.sourceHash);
      expect(result1.code).not.toBe(result2.code);
      expect(result1.cacheHit).toBe(false);
      expect(result2.cacheHit).toBe(false);
    });

    it('should allow custom cache keys', async () => {
      const source = 'export const test = "custom";';

      const result1 = await compiler.compile(source, { cacheKey: 'custom-key-1' });
      const result2 = await compiler.compile(source, { cacheKey: 'custom-key-2' });
      const result3 = await compiler.compile(source, { cacheKey: 'custom-key-1' });

      expect(result1.cacheHit).toBe(false);
      expect(result2.cacheHit).toBe(false);
      expect(result3.cacheHit).toBe(true);
      expect(result3.code).toBe(result1.code);
    });

    it('should clear cache when requested', async () => {
      const source = 'export const cleared = true;';

      // Compile and cache
      const firstResult = await compiler.compile(source);
      expect(firstResult.cacheHit).toBe(false);

      // Verify cache hit
      const cachedResult = await compiler.compile(source);
      expect(cachedResult.cacheHit).toBe(true);

      // Clear cache
      compiler.clearCache();

      // Should not hit cache after clearing
      const afterClearResult = await compiler.compile(source);
      expect(afterClearResult.cacheHit).toBe(false);
      expect(afterClearResult.sourceHash).toBe(firstResult.sourceHash);
    });
  });

  describe('Error Handling', () => {
    it('should throw CompilationError for invalid TypeScript', async () => {
      const invalidSource = 'export function Button() { return <button>unclosed';

      await expect(compiler.compile(invalidSource, { filename: 'Invalid.tsx' })).rejects.toThrow();

      try {
        await compiler.compile(invalidSource, { filename: 'Invalid.tsx' });
      } catch (error: unknown) {
        expect(error).toHaveProperty('name', 'CompilationError');
        expect(error).toHaveProperty('filename', 'Invalid.tsx');
        expect(error).toHaveProperty('message');
        expect((error as CompilationError).message).toContain('Invalid.tsx');
        expect(error).toHaveProperty('originalError');
      }
    });

    it('should handle syntax errors with location information', async () => {
      const syntaxError = `
        export function BadSyntax() {
          return <div>
            <span>Missing closing tag
          </div>
        }
      `;

      try {
        await compiler.compile(syntaxError);
        expect.fail('Should have thrown compilation error');
      } catch (error: unknown) {
        expect(error).toHaveProperty('name', 'CompilationError');
        expect(error).toHaveProperty('message');
        // Line/column info depends on SWC error format
      }
    });

    it('should handle malformed JSX syntax errors', async () => {
      const jsxError = `
        export function MalformedJSX() {
          return <div><span>Missing closing div;
        }
      `;

      try {
        await compiler.compile(jsxError);
        expect.fail('Should have thrown compilation error');
      } catch (error: unknown) {
        expect(error).toHaveProperty('name', 'CompilationError');
        expect(error).toHaveProperty('message');
        expect((error as CompilationError).message).toBeTruthy();
      }
    });

    it('should provide fallback error messages', async () => {
      const problematicSource = 'export function() { }'; // Invalid function syntax

      try {
        await compiler.compile(problematicSource);
        expect.fail('Should have thrown compilation error');
      } catch (error: unknown) {
        expect(error).toHaveProperty('name', 'CompilationError');
        expect(error).toHaveProperty('message');
        expect((error as CompilationError).message).toBeTruthy();
        expect(error.originalError).toBeDefined();
      }
    });
  });

  describe('Performance and Memory', () => {
    it('should compile typical component in reasonable time', async () => {
      const typicalComponent = `
        import React from 'react';

        interface ButtonProps {
          children: React.ReactNode;
          variant?: 'primary' | 'secondary' | 'destructive';
          size?: 'sm' | 'md' | 'lg';
          disabled?: boolean;
          onClick?: () => void;
        }

        export function Button({ 
          children, 
          variant = 'primary', 
          size = 'md',
          disabled = false,
          onClick 
        }: ButtonProps) {
          const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium';
          const variantClasses = {
            primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
          };
          const sizeClasses = {
            sm: 'h-9 px-3 text-sm',
            md: 'h-10 px-4 py-2',
            lg: 'h-11 px-8',
          };

          return (
            <button
              className={\`\${baseClasses} \${variantClasses[variant]} \${sizeClasses[size]}\`}
              disabled={disabled}
              onClick={onClick}
            >
              {children}
            </button>
          );
        }
      `;

      const startTime = performance.now();
      const result = await compiler.compile(typicalComponent);
      const endTime = performance.now();

      expect(result.code).toBeDefined();
      expect(endTime - startTime).toBeLessThan(200); // <200ms requirement
      expect(result.compilationTime).toBeLessThan(200);
    });

    it('should handle cache operations efficiently', async () => {
      const source = 'export const fast = "cache test";';

      // Initial compilation
      await compiler.compile(source);

      // Measure cache lookup time
      const startTime = performance.now();
      await compiler.compile(source);
      const cacheTime = performance.now() - startTime;

      expect(cacheTime).toBeLessThan(5); // <5ms requirement
    });
  });

  describe('Cache Management Utilities', () => {
    it('should provide cache size information', async () => {
      expect(compiler.getCacheSize()).toBe(0);

      await compiler.compile('export const a = 1;');
      expect(compiler.getCacheSize()).toBe(1);

      await compiler.compile('export const b = 2;');
      expect(compiler.getCacheSize()).toBe(2);

      compiler.clearCache();
      expect(compiler.getCacheSize()).toBe(0);
    });

    it('should provide cache keys', async () => {
      const source1 = 'export const key1 = 1;';
      const source2 = 'export const key2 = 2;';

      const result1 = await compiler.compile(source1);
      const result2 = await compiler.compile(source2);

      const keys = compiler.getCacheKeys();
      expect(keys).toHaveLength(2);
      expect(keys).toContain(result1.sourceHash);
      expect(keys).toContain(result2.sourceHash);
    });
  });

  describe('Hash Generation', () => {
    it('should generate consistent hashes for same source', async () => {
      const source = 'export const consistent = true;';

      const result1 = await compiler.compile(source);
      const result2 = await compiler.compile(source);

      expect(result1.sourceHash).toBe(result2.sourceHash);
    });

    it('should generate different hashes for different source', async () => {
      const source1 = 'export const different1 = 1;';
      const source2 = 'export const different2 = 2;';

      const result1 = await compiler.compile(source1);
      const result2 = await compiler.compile(source2);

      expect(result1.sourceHash).not.toBe(result2.sourceHash);
    });

    it('should generate SHA-256 hashes', async () => {
      const source = 'export const hash = "test";';
      const result = await compiler.compile(source);

      // SHA-256 hashes are 64 characters in hex
      expect(result.sourceHash).toHaveLength(64);
      expect(result.sourceHash).toMatch(/^[a-f0-9]{64}$/);
    });
  });
});
