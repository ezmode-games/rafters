/**
 * SWCCompiler Unit Tests
 *
 * Tests the SWC TypeScript/JSX compiler with comprehensive coverage
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { SWCCompiler } from '../../../src/lib/swc/SWCCompiler';

describe('SWCCompiler', () => {
  let compiler: SWCCompiler;

  beforeEach(async () => {
    compiler = new SWCCompiler();
    await compiler.init();
  });

  describe('initialization', () => {
    it('should initialize successfully', async () => {
      const newCompiler = new SWCCompiler();
      await expect(newCompiler.init()).resolves.not.toThrow();
    });

    it('should only initialize once', async () => {
      const newCompiler = new SWCCompiler();
      await newCompiler.init();
      await newCompiler.init(); // Second call should be no-op
      // Should not throw or have side effects
    });
  });

  describe('TypeScript compilation', () => {
    it('should compile simple TypeScript', async () => {
      const source = `
        function add(a: number, b: number): number {
          return a + b;
        }
      `;

      const result = await compiler.compile(source, { filename: 'add.ts' });

      expect(result.code).toBeDefined();
      expect(result.code).not.toContain(': number'); // Types stripped
      expect(result.sourceHash).toBeDefined();
      expect(result.compilationTime).toBeGreaterThan(0);
    });

    it('should compile TypeScript with interfaces', async () => {
      const source = `
        interface User {
          name: string;
          age: number;
        }

        function greet(user: User): string {
          return \`Hello, \${user.name}!\`;
        }
      `;

      const result = await compiler.compile(source, { filename: 'user.ts' });

      expect(result.code).toBeDefined();
      expect(result.code).not.toContain('interface User'); // Interfaces removed
      expect(result.code).toContain('greet');
    });

    it('should compile TypeScript with type aliases', async () => {
      const source = `
        type ID = string | number;

        function getId(id: ID): string {
          return String(id);
        }
      `;

      const result = await compiler.compile(source, { filename: 'types.ts' });

      expect(result.code).toBeDefined();
      expect(result.code).not.toContain('type ID'); // Type aliases removed
    });

    it('should compile TypeScript with generics', async () => {
      const source = `
        function identity<T>(value: T): T {
          return value;
        }
      `;

      const result = await compiler.compile(source, { filename: 'generics.ts' });

      expect(result.code).toBeDefined();
      expect(result.code).not.toContain('<T>'); // Generics stripped
      expect(result.code).toContain('identity');
    });
  });

  describe('JSX compilation', () => {
    it('should compile JSX with React 19 automatic runtime', async () => {
      const source = `
        export default function Button({ children }) {
          return <button>{children}</button>;
        }
      `;

      const result = await compiler.compile(source, { filename: 'Button.tsx' });

      expect(result.code).toBeDefined();
      expect(result.code).toContain('jsx'); // Uses jsx runtime
      expect(result.code).not.toContain('React.createElement'); // No manual createElement
    });

    it('should compile JSX with props', async () => {
      const source = `
        export default function Button({ variant, children }) {
          return <button className={\`btn \${variant}\`}>{children}</button>;
        }
      `;

      const result = await compiler.compile(source, { filename: 'Button.tsx' });

      expect(result.code).toBeDefined();
      expect(result.code).toContain('variant');
      expect(result.code).toContain('children');
    });

    it('should compile JSX with fragments', async () => {
      const source = `
        export default function List() {
          return (
            <>
              <li>Item 1</li>
              <li>Item 2</li>
            </>
          );
        }
      `;

      const result = await compiler.compile(source, { filename: 'List.tsx' });

      expect(result.code).toBeDefined();
      expect(result.code).toContain('Fragment');
    });

    it('should compile JSX with conditional rendering', async () => {
      const source = `
        export default function Conditional({ show }) {
          return <div>{show ? <span>Visible</span> : null}</div>;
        }
      `;

      const result = await compiler.compile(source, { filename: 'Conditional.tsx' });

      expect(result.code).toBeDefined();
      expect(result.code).toContain('show');
    });

    it('should compile JSX with map', async () => {
      const source = `
        export default function List({ items }) {
          return (
            <ul>
              {items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          );
        }
      `;

      const result = await compiler.compile(source, { filename: 'List.tsx' });

      expect(result.code).toBeDefined();
      expect(result.code).toContain('map');
    });
  });

  describe('TypeScript + JSX', () => {
    it('should compile TypeScript component with typed props', async () => {
      const source = `
        interface ButtonProps {
          variant: 'primary' | 'secondary';
          children: React.ReactNode;
        }

        export default function Button({ variant, children }: ButtonProps) {
          return <button className={variant}>{children}</button>;
        }
      `;

      const result = await compiler.compile(source, { filename: 'Button.tsx' });

      expect(result.code).toBeDefined();
      expect(result.code).not.toContain('interface ButtonProps');
      expect(result.code).not.toContain('ButtonProps');
      expect(result.code).toContain('variant');
      expect(result.code).toContain('children');
    });

    it('should compile component with React 19 types', async () => {
      const source = `
        import { FC } from 'react';

        interface Props {
          title: string;
        }

        const Card: FC<Props> = ({ title }) => {
          return <div>{title}</div>;
        };

        export default Card;
      `;

      const result = await compiler.compile(source, { filename: 'Card.tsx' });

      expect(result.code).toBeDefined();
      expect(result.code).toContain('title');
    });
  });

  describe('caching', () => {
    it('should cache compiled code', async () => {
      const source = `export default function Button() { return <button>Click</button>; }`;

      const result1 = await compiler.compile(source, { filename: 'Button.tsx' });
      expect(result1.cacheHit).toBe(false);

      const result2 = await compiler.compile(source, { filename: 'Button.tsx' });
      expect(result2.cacheHit).toBe(true);
      expect(result2.code).toBe(result1.code);
    });

    it('should use custom cache key when provided', async () => {
      const source = `export default function Button() { return <button>Click</button>; }`;

      const result1 = await compiler.compile(source, {
        filename: 'Button.tsx',
        cacheKey: 'custom-button-v1',
      });
      expect(result1.cacheHit).toBe(false);

      const result2 = await compiler.compile(source, {
        filename: 'Button.tsx',
        cacheKey: 'custom-button-v1',
      });
      expect(result2.cacheHit).toBe(true);
    });

    it('should recompile when source changes', async () => {
      const source1 = `export default function Button() { return <button>Click</button>; }`;
      const source2 = `export default function Button() { return <button>Press</button>; }`;

      const result1 = await compiler.compile(source1, { filename: 'Button.tsx' });
      const result2 = await compiler.compile(source2, { filename: 'Button.tsx' });

      expect(result1.sourceHash).not.toBe(result2.sourceHash);
      expect(result2.cacheHit).toBe(false);
    });

    it('should generate consistent hash for same source', async () => {
      const source = `export default function Button() { return <button>Click</button>; }`;

      const result1 = await compiler.compile(source, { filename: 'Button.tsx' });
      const result2 = await compiler.compile(source, { filename: 'Button.tsx' });

      expect(result1.sourceHash).toBe(result2.sourceHash);
    });

    it('should clear cache on demand', async () => {
      const source = `export default function Button() { return <button>Click</button>; }`;

      await compiler.compile(source, { filename: 'Button.tsx' });
      compiler.clearCache();

      const result = await compiler.compile(source, { filename: 'Button.tsx' });
      expect(result.cacheHit).toBe(false);
    });

    it('should clear specific cache entry', async () => {
      const source = `export default function Button() { return <button>Click</button>; }`;

      const result1 = await compiler.compile(source, {
        filename: 'Button.tsx',
        cacheKey: 'button-v1',
      });
      const hash = result1.sourceHash;

      compiler.clearCache(hash);

      const result2 = await compiler.compile(source, {
        filename: 'Button.tsx',
        cacheKey: 'button-v1',
      });
      expect(result2.cacheHit).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should throw CompilationError for invalid JSX', async () => {
      const source = `
        export default function Button() {
          return <button>Click<button>;
        }
      `;

      await expect(compiler.compile(source, { filename: 'Button.tsx' })).rejects.toMatchObject({
        name: 'CompilationError',
      });
    });

    it('should include source context in error', async () => {
      const source = `invalid javascript {{{`;

      try {
        await compiler.compile(source, { filename: 'invalid.tsx' });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toMatchObject({
          name: 'CompilationError',
          filename: 'invalid.tsx',
        });
      }
    });
  });

  describe('performance', () => {
    it('should compile in reasonable time', async () => {
      const source = `
        export default function Button({ children }: { children: React.ReactNode }) {
          return <button>{children}</button>;
        }
      `;

      const result = await compiler.compile(source, { filename: 'Button.tsx' });

      expect(result.compilationTime).toBeLessThan(100); // < 100ms
    });

    it('should handle large components efficiently', async () => {
      const source = `
        export default function LargeComponent() {
          return (
            <div>
              ${Array.from({ length: 50 }, (_, i) => `<div key={${i}}>Item ${i}</div>`).join('\n')}
            </div>
          );
        }
      `;

      const result = await compiler.compile(source, { filename: 'Large.tsx' });

      expect(result.code).toBeDefined();
      expect(result.compilationTime).toBeLessThan(200); // < 200ms for large component
    });
  });

  describe('CommonJS output', () => {
    it('should output CommonJS modules', async () => {
      const source = `
        export default function Button() {
          return <button>Click</button>;
        }
      `;

      const result = await compiler.compile(source, { filename: 'Button.tsx' });

      expect(result.code).toContain('exports');
      expect(result.code).toContain('Object.defineProperty');
    });

    it('should handle named exports', async () => {
      const source = `
        export function Button() {
          return <button>Click</button>;
        }
        export const version = '1.0.0';
      `;

      const result = await compiler.compile(source, { filename: 'Button.tsx' });

      expect(result.code).toContain('Button');
      expect(result.code).toContain('version');
    });

    it('should handle default and named exports together', async () => {
      const source = `
        export function helper() {
          return 'help';
        }
        export default function Button() {
          return <button>{helper()}</button>;
        }
      `;

      const result = await compiler.compile(source, { filename: 'Button.tsx' });

      expect(result.code).toContain('helper');
      expect(result.code).toContain('default');
    });
  });

  describe('React 19 features', () => {
    it('should compile with automatic JSX runtime', async () => {
      const source = `
        export default function Button() {
          return <button>Click</button>;
        }
      `;

      const result = await compiler.compile(source, { filename: 'Button.tsx' });

      // Should use new jsx runtime, not React.createElement
      expect(result.code).toContain('jsx');
      expect(result.code).not.toContain('React.createElement');
    });

    it('should handle React imports', async () => {
      const source = `
        import React from 'react';

        export default function Button() {
          return <button>Click</button>;
        }
      `;

      const result = await compiler.compile(source, { filename: 'Button.tsx' });

      expect(result.code).toBeDefined();
    });
  });

  describe('ES2020 target', () => {
    it('should compile to ES2020', async () => {
      const source = `
        export default function Button() {
          const obj = { a: 1, b: 2 };
          const merged = { ...obj, c: 3 };
          return <button>{merged.c}</button>;
        }
      `;

      const result = await compiler.compile(source, { filename: 'Button.tsx' });

      expect(result.code).toBeDefined();
      // Should preserve modern syntax where possible
    });

    it('should support optional chaining', async () => {
      const source = `
        export default function Component({ user }) {
          return <div>{user?.name}</div>;
        }
      `;

      const result = await compiler.compile(source, { filename: 'Component.tsx' });

      expect(result.code).toBeDefined();
    });

    it('should support nullish coalescing', async () => {
      const source = `
        export default function Component({ value }) {
          return <div>{value ?? 'default'}</div>;
        }
      `;

      const result = await compiler.compile(source, { filename: 'Component.tsx' });

      expect(result.code).toBeDefined();
    });
  });
});
