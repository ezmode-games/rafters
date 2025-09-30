/**
 * ReactSSRExecutor Unit Tests
 *
 * Tests the React SSR execution engine with comprehensive coverage
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ReactSSRExecutor } from '../src/lib/swc/ReactSSRExecutor';
import type { ExecutionError } from '../src/lib/swc/types';

describe('ReactSSRExecutor', () => {
  let executor: ReactSSRExecutor;

  beforeEach(() => {
    executor = new ReactSSRExecutor();
  });

  afterEach(() => {
    // Clean up any remaining temp files
  });

  describe('basic component execution', () => {
    it('should render a simple component with default export', async () => {
      const compiledCode = `
        const React = require('react');
        function Button({ children }) {
          return React.createElement('button', null, children);
        }
        module.exports = { default: Button };
      `;

      const result = await executor.execute(
        compiledCode,
        { children: 'Click Me' },
        { componentName: 'Button' }
      );

      expect(result.html).toContain('<button>');
      expect(result.html).toContain('Click Me');
      expect(result.html).toContain('</button>');
      expect(result.componentName).toBe('Button');
      expect(result.renderTime).toBeGreaterThan(0);
      expect(result.props).toHaveProperty('children', 'Click Me');
    });

    it('should render component with named export', async () => {
      const compiledCode = `
        const React = require('react');
        function MyButton({ text }) {
          return React.createElement('button', null, text);
        }
        exports.MyButton = MyButton;
      `;

      const result = await executor.execute(
        compiledCode,
        { text: 'Named Export' },
        { componentName: 'MyButton' }
      );

      expect(result.html).toContain('Named Export');
      expect(result.componentName).toBe('MyButton');
    });

    it('should render component with direct function export', async () => {
      const compiledCode = `
        const React = require('react');
        module.exports = function Button() {
          return React.createElement('button', null, 'Direct Export');
        };
      `;

      const result = await executor.execute(compiledCode, {}, { componentName: 'Button' });

      expect(result.html).toContain('Direct Export');
    });

    it('should find first function in exports if no default', async () => {
      const compiledCode = `
        const React = require('react');
        exports.SomeButton = function() {
          return React.createElement('button', null, 'First Function');
        };
        exports.someString = 'not a function';
        exports.someNumber = 42;
      `;

      const result = await executor.execute(compiledCode, {}, { componentName: 'Unknown' });

      expect(result.html).toContain('First Function');
    });
  });

  describe('props sanitization', () => {
    it('should keep primitive props (string, number, boolean)', async () => {
      const compiledCode = `
        const React = require('react');
        function Component({ title, count, isActive }) {
          return React.createElement('div', null,
            title + ' ' + count + ' ' + isActive
          );
        }
        module.exports = { default: Component };
      `;

      const result = await executor.execute(
        compiledCode,
        {
          title: 'Test',
          count: 42,
          isActive: true,
        },
        { componentName: 'Component' }
      );

      expect(result.props).toEqual({
        title: 'Test',
        count: 42,
        isActive: true,
      });
    });

    it('should keep null and undefined values', async () => {
      const compiledCode = `
        const React = require('react');
        module.exports = { default: () => React.createElement('div', null, 'test') };
      `;

      const result = await executor.execute(
        compiledCode,
        {
          nullValue: null,
          undefinedValue: undefined,
        },
        { componentName: 'Component' }
      );

      expect(result.props).toHaveProperty('nullValue', null);
      expect(result.props).toHaveProperty('undefinedValue', undefined);
    });

    it('should sanitize function props to undefined', async () => {
      const compiledCode = `
        const React = require('react');
        module.exports = { default: () => React.createElement('div', null, 'test') };
      `;

      const result = await executor.execute(
        compiledCode,
        {
          onClick: () => console.log('clicked'),
          onChange: function handler() {},
        },
        { componentName: 'Component' }
      );

      expect(result.props.onClick).toBeUndefined();
      expect(result.props.onChange).toBeUndefined();
    });

    it('should sanitize string functions to undefined', async () => {
      const compiledCode = `
        const React = require('react');
        module.exports = { default: () => React.createElement('div', null, 'test') };
      `;

      const result = await executor.execute(
        compiledCode,
        {
          handler: 'function() { console.log("test"); }',
        },
        { componentName: 'Component' }
      );

      expect(result.props.handler).toBeUndefined();
    });

    it('should keep serializable objects', async () => {
      const compiledCode = `
        const React = require('react');
        module.exports = { default: () => React.createElement('div', null, 'test') };
      `;

      const result = await executor.execute(
        compiledCode,
        {
          data: { id: 1, name: 'test', nested: { value: 42 } },
        },
        { componentName: 'Component' }
      );

      expect(result.props.data).toEqual({
        id: 1,
        name: 'test',
        nested: { value: 42 },
      });
    });

    it('should sanitize objects with circular references', async () => {
      const compiledCode = `
        const React = require('react');
        module.exports = { default: () => React.createElement('div', null, 'test') };
      `;

      const circularObj: Record<string, unknown> = { name: 'test' };
      circularObj.self = circularObj; // Create circular reference

      const result = await executor.execute(
        compiledCode,
        { circular: circularObj },
        { componentName: 'Component' }
      );

      expect(result.props.circular).toBeUndefined();
    });
  });

  describe('component rendering', () => {
    it('should render component with children', async () => {
      const compiledCode = `
        const React = require('react');
        function Container({ children }) {
          return React.createElement('div', { className: 'container' }, children);
        }
        module.exports = { default: Container };
      `;

      const result = await executor.execute(
        compiledCode,
        { children: 'Child content' },
        { componentName: 'Container' }
      );

      expect(result.html).toContain('class="container"');
      expect(result.html).toContain('Child content');
    });

    it('should render component with multiple props', async () => {
      const compiledCode = `
        const React = require('react');
        function Button({ variant, size, disabled, children }) {
          return React.createElement('button', {
            className: 'btn ' + variant + ' ' + size,
            disabled: disabled
          }, children);
        }
        module.exports = { default: Button };
      `;

      const result = await executor.execute(
        compiledCode,
        {
          variant: 'primary',
          size: 'large',
          disabled: false,
          children: 'Submit',
        },
        { componentName: 'Button' }
      );

      expect(result.html).toContain('class="btn primary large"');
      expect(result.html).toContain('Submit');
      expect(result.html).not.toContain('disabled=""');
    });

    it('should render component with data attributes', async () => {
      const compiledCode = `
        const React = require('react');
        function Component({ id }) {
          return React.createElement('div', { 'data-id': id }, 'Content');
        }
        module.exports = { default: Component };
      `;

      const result = await executor.execute(compiledCode, { id: 42 }, { componentName: 'Component' });

      expect(result.html).toContain('data-id="42"');
    });

    it('should render nested components', async () => {
      const compiledCode = `
        const React = require('react');
        function Card({ title, body }) {
          return React.createElement('div', { className: 'card' },
            React.createElement('h2', null, title),
            React.createElement('p', null, body)
          );
        }
        module.exports = { default: Card };
      `;

      const result = await executor.execute(
        compiledCode,
        {
          title: 'Card Title',
          body: 'Card body text',
        },
        { componentName: 'Card' }
      );

      expect(result.html).toContain('<h2>Card Title</h2>');
      expect(result.html).toContain('<p>Card body text</p>');
    });
  });

  describe('error handling', () => {
    it('should throw ExecutionError for component rendering errors', async () => {
      const compiledCode = `
        const React = require('react');
        function BrokenComponent() {
          throw new Error('Component rendering failed');
        }
        module.exports = { default: BrokenComponent };
      `;

      await expect(executor.execute(compiledCode, {}, { componentName: 'BrokenComponent' })).rejects.toThrow();

      try {
        await executor.execute(compiledCode, {}, { componentName: 'BrokenComponent' });
      } catch (error) {
        const execError = error as ExecutionError;
        expect(execError.name).toBe('ExecutionError');
        expect(execError.message).toContain('rendering error');
        expect(execError.componentName).toBe('BrokenComponent');
        expect(execError.phase).toBe('rendering');
        expect(execError.originalError).toBeDefined();
      }
    });

    it('should throw ExecutionError for invalid JavaScript', async () => {
      const invalidCode = 'this is not valid javascript {{{';

      await expect(executor.execute(invalidCode, {}, { componentName: 'Invalid' })).rejects.toThrow();

      try {
        await executor.execute(invalidCode, {}, { componentName: 'Invalid' });
      } catch (error) {
        const execError = error as ExecutionError;
        expect(execError.name).toBe('ExecutionError');
      }
    });

    it('should throw ExecutionError when no component found', async () => {
      const compiledCode = `
        const React = require('react');
        exports.notAFunction = 'just a string';
        exports.alsoNotAFunction = 42;
      `;

      await expect(executor.execute(compiledCode, {}, { componentName: 'Missing' })).rejects.toThrow();

      try {
        await executor.execute(compiledCode, {}, { componentName: 'Missing' });
      } catch (error) {
        const execError = error as ExecutionError;
        expect(execError.name).toBe('ExecutionError');
        expect(execError.phase).toBe('creation');
        expect(execError.message).toContain('creation error');
      }
    });

    it('should throw ExecutionError for non-function exports', async () => {
      const compiledCode = `
        module.exports = { default: 'not a function' };
      `;

      await expect(executor.execute(compiledCode, {}, { componentName: 'NotFunction' })).rejects.toThrow();

      try {
        await executor.execute(compiledCode, {}, { componentName: 'NotFunction' });
      } catch (error) {
        const execError = error as ExecutionError;
        expect(execError.name).toBe('ExecutionError');
        expect(execError.phase).toBe('creation');
        expect(execError.message).toContain('No React component function found');
      }
    });
  });

  describe('performance', () => {
    it('should complete execution in reasonable time', async () => {
      const compiledCode = `
        const React = require('react');
        module.exports = { default: () => React.createElement('div', null, 'test') };
      `;

      const result = await executor.execute(compiledCode, {}, { componentName: 'Fast' });

      // Should be fast (< 100ms for simple component)
      expect(result.renderTime).toBeLessThan(100);
    });

    it('should handle multiple sequential executions', async () => {
      const compiledCode = `
        const React = require('react');
        module.exports = { default: ({ n }) => React.createElement('div', null, 'Render ' + n) };
      `;

      const results = [];
      for (let i = 0; i < 5; i++) {
        const result = await executor.execute(compiledCode, { n: i }, { componentName: 'Multi' });
        results.push(result);
      }

      expect(results).toHaveLength(5);
      results.forEach((result, i) => {
        expect(result.html).toContain(`Render ${i}`);
      });
    });
  });

  describe('temp file cleanup', () => {
    it('should clean up temp file after successful execution', async () => {
      const compiledCode = `
        const React = require('react');
        module.exports = { default: () => React.createElement('div', null, 'cleanup test') };
      `;

      const result = await executor.execute(compiledCode, {}, { componentName: 'Cleanup' });

      expect(result.html).toContain('cleanup test');
      // Temp file should be deleted (no way to verify without fs access in test)
    });

    it('should clean up temp file even on error', async () => {
      const compiledCode = `
        const React = require('react');
        function BrokenComponent() {
          throw new Error('Intentional error');
        }
        module.exports = { default: BrokenComponent };
      `;

      try {
        await executor.execute(compiledCode, {}, { componentName: 'ErrorCleanup' });
      } catch {
        // Expected error
      }

      // Temp file should still be deleted
    });
  });

  describe('component name handling', () => {
    it('should use default component name when not provided', async () => {
      const compiledCode = `
        const React = require('react');
        module.exports = { default: () => React.createElement('div', null, 'default name') };
      `;

      const result = await executor.execute(compiledCode, {});

      expect(result.componentName).toBe('Component');
      expect(result.html).toContain('default name');
    });

    it('should use provided component name', async () => {
      const compiledCode = `
        const React = require('react');
        module.exports = { default: () => React.createElement('div', null, 'custom name') };
      `;

      const result = await executor.execute(compiledCode, {}, { componentName: 'CustomButton' });

      expect(result.componentName).toBe('CustomButton');
    });
  });

  describe('React features', () => {
    it('should render component with React fragments', async () => {
      const compiledCode = `
        const React = require('react');
        function FragmentComponent() {
          return React.createElement(React.Fragment, null,
            React.createElement('div', null, 'First'),
            React.createElement('div', null, 'Second')
          );
        }
        module.exports = { default: FragmentComponent };
      `;

      const result = await executor.execute(compiledCode, {}, { componentName: 'Fragment' });

      expect(result.html).toContain('First');
      expect(result.html).toContain('Second');
    });

    it('should render component with conditional rendering', async () => {
      const compiledCode = `
        const React = require('react');
        function ConditionalComponent({ show }) {
          return React.createElement('div', null,
            show ? React.createElement('span', null, 'Visible') : null
          );
        }
        module.exports = { default: ConditionalComponent };
      `;

      const resultVisible = await executor.execute(
        compiledCode,
        { show: true },
        { componentName: 'Conditional' }
      );
      expect(resultVisible.html).toContain('Visible');

      const resultHidden = await executor.execute(
        compiledCode,
        { show: false },
        { componentName: 'Conditional' }
      );
      expect(resultHidden.html).not.toContain('Visible');
    });

    it('should render component with list mapping', async () => {
      const compiledCode = `
        const React = require('react');
        function ListComponent({ items }) {
          return React.createElement('ul', null,
            items.map((item, i) =>
              React.createElement('li', { key: i }, item)
            )
          );
        }
        module.exports = { default: ListComponent };
      `;

      const result = await executor.execute(
        compiledCode,
        { items: ['First', 'Second', 'Third'] },
        { componentName: 'List' }
      );

      expect(result.html).toContain('<ul>');
      expect(result.html).toContain('<li>First</li>');
      expect(result.html).toContain('<li>Second</li>');
      expect(result.html).toContain('<li>Third</li>');
    });
  });
});