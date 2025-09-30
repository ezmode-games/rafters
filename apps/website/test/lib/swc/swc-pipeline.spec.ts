/**
 * Simple Pipeline Test: Fetch → Compile → Execute
 *
 * Tests the complete SWC pipeline with actual registry component
 */

import { describe, expect, it } from 'vitest';
import { ReactSSRExecutor } from '../../../src/lib/swc/ReactSSRExecutor';
import { RegistryComponentFetcher } from '../../../src/lib/swc/RegistryFetcher';
import { SWCCompiler } from '../../../src/lib/swc/SWCCompiler';

describe('SWC Pipeline: Fetch → Compile → Execute', () => {
  it('should render a simple button component from registry', async () => {
    // Stage 1: Fetch from registry (#130)
    const fetcher = new RegistryComponentFetcher();
    const fetchResult = await fetcher.fetchComponent('button');

    expect(fetchResult.component).toBeDefined();
    expect(fetchResult.component.files).toHaveLength(1);

    const componentSource = fetchResult.component.files[0].content;
    expect(componentSource).toContain('Button');

    // Stage 2: Compile with SWC (#128)
    const compiler = new SWCCompiler();
    await compiler.init();

    const compileResult = await compiler.compile(componentSource, {
      filename: 'button.tsx',
    });

    expect(compileResult.code).toBeDefined();
    expect(compileResult.code.length).toBeGreaterThan(0);
    expect(compileResult.compilationTime).toBeGreaterThan(0);

    // Stage 3: Execute with React SSR (#129)
    const executor = new ReactSSRExecutor();

    const executeResult = await executor.execute(
      compileResult.code,
      {
        children: 'Click Me',
        variant: 'default',
      },
      { componentName: 'Button' }
    );

    expect(executeResult.html).toBeDefined();
    expect(executeResult.html).toContain('button');
    expect(executeResult.html).toContain('Click Me');
    expect(executeResult.renderTime).toBeGreaterThan(0);
    expect(executeResult.componentName).toBe('Button');
  }, 30000); // 30s timeout for registry fetch

  it('should handle component with complex props', async () => {
    const executor = new ReactSSRExecutor();
    const compiler = new SWCCompiler();
    await compiler.init();

    // Simple component source
    const source = `
      import React from 'react';

      interface ButtonProps {
        title: string;
        disabled?: boolean;
        data?: { id: number };
      }

      export default function Button({ title, disabled = false, data }: ButtonProps) {
        return (
          <button disabled={disabled} data-id={data?.id}>
            {title}
          </button>
        );
      }
    `;

    const compileResult = await compiler.compile(source, {
      filename: 'custom-button.tsx',
    });

    const executeResult = await executor.execute(
      compileResult.code,
      {
        title: 'Save Document',
        disabled: false,
        data: { id: 42 },
        onClick: () => console.log('clicked'), // Should be sanitized
      },
      { componentName: 'Button' }
    );

    expect(executeResult.html).toContain('Save Document');
    expect(executeResult.html).toContain('data-id="42"');
    expect(executeResult.props).toHaveProperty('title', 'Save Document');
    expect(executeResult.props).toHaveProperty('onClick', undefined); // Sanitized
  });

  it('should handle execution errors gracefully', async () => {
    const executor = new ReactSSRExecutor();
    const compiler = new SWCCompiler();
    await compiler.init();

    // Component that throws error
    const source = `
      import React from 'react';

      export default function BrokenButton() {
        throw new Error('Component rendering failed');
        return <button>Never renders</button>;
      }
    `;

    const compileResult = await compiler.compile(source, {
      filename: 'broken-button.tsx',
    });

    await expect(
      executor.execute(compileResult.code, {}, { componentName: 'BrokenButton' })
    ).rejects.toThrow('rendering error');
  });

  it('should support named exports', async () => {
    const executor = new ReactSSRExecutor();
    const compiler = new SWCCompiler();
    await compiler.init();

    const source = `
      import React from 'react';

      export function MyButton({ children }: { children: string }) {
        return <button>{children}</button>;
      }
    `;

    const compileResult = await compiler.compile(source, {
      filename: 'named-export.tsx',
    });

    const executeResult = await executor.execute(
      compileResult.code,
      { children: 'Named Export Button' },
      { componentName: 'MyButton' }
    );

    expect(executeResult.html).toContain('Named Export Button');
  });
});
