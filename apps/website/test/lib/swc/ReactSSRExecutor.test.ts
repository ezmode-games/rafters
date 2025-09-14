/**
 * ReactSSRExecutor Tests
 *
 * Comprehensive test suite covering all acceptance criteria for the React SSR Component Execution Engine
 */

import { describe, expect, it } from 'vitest';
import { ReactSSRExecutor } from '@/lib/swc/ReactSSRExecutor';
import type { ExecutionError } from '@/lib/swc/types';

describe('ReactSSRExecutor', () => {
  const executor = new ReactSSRExecutor();

  describe('Basic Component Execution', () => {
    it('should execute basic component with default export', async () => {
      const buttonCode = `
        const { jsx: _jsx } = require('react/jsx-runtime');
        function Button({ children, variant = 'primary' }) {
          return _jsx('button', { className: \`btn \${variant}\`, children });
        }
        module.exports = { default: Button };
      `;

      const result = await executor.execute(buttonCode, {
        children: 'Click me',
        variant: 'primary',
      });

      expect(result.html).toContain('<button');
      expect(result.html).toContain('class="btn primary"');
      expect(result.html).toContain('Click me');
      expect(result.html).toContain('</button>');
      expect(result.renderTime).toBeGreaterThan(0);
      expect(result.componentName).toBe('Component');
      expect(result.props).toEqual({
        children: 'Click me',
        variant: 'primary',
      });
    });

    it('should execute component with direct function export', async () => {
      const cardCode = `
        const { jsx: _jsx } = require('react/jsx-runtime');
        function Card({ title, content }) {
          return _jsx('div', { 
            className: 'card',
            children: [
              _jsx('h3', { children: title, key: 'title' }),
              _jsx('p', { children: content, key: 'content' })
            ]
          });
        }
        module.exports = Card;
      `;

      const result = await executor.execute(cardCode, {
        title: 'Test Card',
        content: 'This is test content',
      });

      expect(result.html).toContain('<div class="card">');
      expect(result.html).toContain('<h3>Test Card</h3>');
      expect(result.html).toContain('<p>This is test content</p>');
      expect(result.renderTime).toBeGreaterThan(0);
    });

    it('should handle component with custom name option', async () => {
      const buttonCode = `
        const { jsx: _jsx } = require('react/jsx-runtime');
        function Button({ children }) {
          return _jsx('button', { children });
        }
        module.exports = { default: Button };
      `;

      const result = await executor.execute(
        buttonCode,
        { children: 'Named Button' },
        { componentName: 'CustomButton' }
      );

      expect(result.html).toContain('Named Button');
      expect(result.componentName).toBe('CustomButton');
    });
  });

  describe('Component Export Variations', () => {
    it('should handle named export extraction', async () => {
      const namedExportCode = `
        const { jsx: _jsx } = require('react/jsx-runtime');
        function Button({ children }) {
          return _jsx('button', { children });
        }
        exports.Button = Button;
      `;

      const result = await executor.execute(namedExportCode, {
        children: 'Named Export',
      });

      expect(result.html).toContain('Named Export');
      expect(result.html).toContain('<button>');
    });

    it('should extract component by name from named exports', async () => {
      const multiExportCode = `
        const { jsx: _jsx } = require('react/jsx-runtime');
        function Button({ children }) {
          return _jsx('button', { children });
        }
        function Link({ href, children }) {
          return _jsx('a', { href, children });
        }
        exports.Button = Button;
        exports.Link = Link;
      `;

      const result = await executor.execute(
        multiExportCode,
        { children: 'Click me' },
        { componentName: 'Button' }
      );

      expect(result.html).toContain('<button>Click me</button>');
    });

    it('should use first function export if no componentName specified', async () => {
      const multiExportCode = `
        const { jsx: _jsx } = require('react/jsx-runtime');
        const nonFunction = 'not a function';
        function FirstComponent({ children }) {
          return _jsx('div', { children });
        }
        function SecondComponent({ children }) {
          return _jsx('span', { children });
        }
        exports.nonFunction = nonFunction;
        exports.FirstComponent = FirstComponent;
        exports.SecondComponent = SecondComponent;
      `;

      const result = await executor.execute(multiExportCode, {
        children: 'First Component',
      });

      expect(result.html).toContain('<div>First Component</div>');
    });
  });

  describe('Props Sanitization', () => {
    it('should handle complex props with various data types', async () => {
      const buttonCode = `
        const { jsx: _jsx } = require('react/jsx-runtime');
        function Button({ title, disabled, data, onClick, nested }) {
          return _jsx('button', { 
            disabled,
            'data-id': data?.id,
            children: title 
          });
        }
        module.exports = { default: Button };
      `;

      const complexProps = {
        title: 'Save Document',
        onClick: 'function() { console.log("clicked"); }', // String function
        disabled: false,
        data: { id: 1, name: 'test' },
        nested: { deep: { value: 42 } },
      };

      const result = await executor.execute(buttonCode, complexProps);

      expect(result.html).toContain('Save Document');
      expect(result.html).toContain('data-id="1"');
      expect(result.props).toEqual({
        title: 'Save Document',
        onClick: undefined, // Function strings should be sanitized to undefined
        disabled: false,
        data: { id: 1, name: 'test' },
        nested: { deep: { value: 42 } },
      });
    });

    it('should sanitize function props to undefined', async () => {
      const buttonCode = `
        const { jsx: _jsx } = require('react/jsx-runtime');
        function Button({ children, onClick }) {
          return _jsx('button', { children });
        }
        module.exports = { default: Button };
      `;

      const result = await executor.execute(buttonCode, {
        children: 'Click me',
        onClick: () => console.log('clicked'), // Real function
      });

      expect(result.props.onClick).toBeUndefined();
      expect(result.props.children).toBe('Click me');
    });

    it('should handle null and undefined props correctly', async () => {
      const componentCode = `
        const { jsx: _jsx } = require('react/jsx-runtime');
        function Component({ nullProp, undefinedProp, validProp }) {
          return _jsx('div', { 
            children: validProp || 'default' 
          });
        }
        module.exports = { default: Component };
      `;

      const result = await executor.execute(componentCode, {
        nullProp: null,
        undefinedProp: undefined,
        validProp: 'valid',
      });

      expect(result.props.nullProp).toBeNull();
      expect(result.props.undefinedProp).toBeUndefined();
      expect(result.props.validProp).toBe('valid');
    });

    it('should handle objects with circular references', async () => {
      const componentCode = `
        const { jsx: _jsx } = require('react/jsx-runtime');
        function Component({ circular, normal }) {
          return _jsx('div', { children: normal || 'default' });
        }
        module.exports = { default: Component };
      `;

      // Create circular reference
      const circular = { name: 'circular' };
      circular.self = circular;

      const result = await executor.execute(componentCode, {
        circular,
        normal: 'safe value',
      });

      expect(result.props.circular).toBeUndefined(); // Circular refs should be sanitized
      expect(result.props.normal).toBe('safe value');
    });
  });

  describe('Error Handling', () => {
    it('should throw ExecutionError for component creation failures', async () => {
      const errorCode = 'this is not valid javascript';

      await expect(executor.execute(errorCode, {})).rejects.toThrow();

      try {
        await executor.execute(errorCode, {});
      } catch (error) {
        const executionError = error as ExecutionError;
        expect(executionError.name).toBe('ExecutionError');
        expect(executionError.phase).toBe('creation');
        expect(executionError.originalError).toBeDefined();
        expect(executionError.message).toContain('creation error');
      }
    });

    it('should throw ExecutionError for React rendering failures', async () => {
      const errorCode = `
        function BrokenButton() {
          throw new Error('Component rendering failed');
        }
        module.exports = { default: BrokenButton };
      `;

      await expect(executor.execute(errorCode, {})).rejects.toThrow();

      try {
        await executor.execute(errorCode, {});
      } catch (error) {
        const executionError = error as ExecutionError;
        expect(executionError.name).toBe('ExecutionError');
        expect(executionError.phase).toBe('rendering');
        expect(executionError.originalError).toBeDefined();
        expect(executionError.message).toContain('rendering error');
      }
    });

    it('should handle missing component exports gracefully', async () => {
      const noExportCode = `
        const { jsx: _jsx } = require('react/jsx-runtime');
        function Button() {
          return _jsx('button', {});
        }
        // No export!
      `;

      await expect(executor.execute(noExportCode, {})).rejects.toThrow();

      try {
        await executor.execute(noExportCode, {});
      } catch (error) {
        const executionError = error as ExecutionError;
        expect(executionError.name).toBe('ExecutionError');
        expect(executionError.phase).toBe('creation');
        expect(executionError.message).toContain(
          'No React component found in compiled code exports'
        );
      }
    });

    it('should handle non-function exports', async () => {
      const nonFunctionCode = `
        const notAFunction = 'I am a string';
        module.exports = { default: notAFunction };
      `;

      await expect(executor.execute(nonFunctionCode, {})).rejects.toThrow();

      try {
        await executor.execute(nonFunctionCode, {});
      } catch (error) {
        const executionError = error as ExecutionError;
        expect(executionError.name).toBe('ExecutionError');
        expect(executionError.phase).toBe('creation');
        expect(executionError.message).toContain('Expected component to be a function');
      }
    });

    it('should include component name in error messages', async () => {
      const errorCode = 'invalid javascript';

      try {
        await executor.execute(errorCode, {}, { componentName: 'TestComponent' });
      } catch (error) {
        const executionError = error as ExecutionError;
        expect(executionError.componentName).toBe('TestComponent');
        expect(executionError.message).toContain('in TestComponent');
      }
    });
  });

  describe('Safe Execution Context', () => {
    it('should provide React and jsx-runtime modules', async () => {
      const contextTestCode = `
        const { jsx } = require('react/jsx-runtime');
        
        function Component() {
          return jsx('div', { children: 'Context works!' });
        }
        module.exports = { default: Component };
      `;

      const result = await executor.execute(contextTestCode, {});
      expect(result.html).toContain('Context works!');
    });

    it('should reject unsupported module imports', async () => {
      const unsafeCode = `
        const fs = require('fs'); // Should fail
        function Component() {
          return React.createElement('div', {}, 'Should not work');
        }
        module.exports = { default: Component };
      `;

      await expect(executor.execute(unsafeCode, {})).rejects.toThrow();

      try {
        await executor.execute(unsafeCode, {});
      } catch (error) {
        const executionError = error as ExecutionError;
        expect(executionError.originalError).toBeDefined();
        expect(String(executionError.originalError)).toContain('Module fs not available');
      }
    });

    it('should provide safe console implementation', async () => {
      const consoleTestCode = `
        const { jsx: _jsx } = require('react/jsx-runtime');
        
        function Component() {
          console.log('Testing console');
          console.warn('Testing warn');
          console.error('Testing error');
          return _jsx('div', { children: 'Console test' });
        }
        module.exports = { default: Component };
      `;

      const result = await executor.execute(consoleTestCode, {});
      expect(result.html).toContain('Console test');
      // Console calls should not throw errors
    });
  });

  describe('Performance and Output', () => {
    it('should measure and return render time', async () => {
      const simpleCode = `
        const { jsx: _jsx } = require('react/jsx-runtime');
        function Component() {
          return _jsx('div', { children: 'Performance test' });
        }
        module.exports = { default: Component };
      `;

      const result = await executor.execute(simpleCode, {});
      expect(result.renderTime).toBeGreaterThan(0);
      expect(typeof result.renderTime).toBe('number');
    });

    it('should return clean HTML suitable for Shadow DOM injection', async () => {
      const complexCode = `
        const { jsx: _jsx, jsxs: _jsxs } = require('react/jsx-runtime');
        function Component({ title, items = [] }) {
          return _jsxs('div', {
            className: 'container',
            children: [
              _jsx('h1', { children: title, key: 'title' }),
              _jsx('ul', {
                children: items.map((item, index) => 
                  _jsx('li', { children: item, key: index })
                ),
                key: 'list'
              })
            ]
          });
        }
        module.exports = { default: Component };
      `;

      const result = await executor.execute(complexCode, {
        title: 'Test List',
        items: ['Item 1', 'Item 2', 'Item 3'],
      });

      expect(result.html).toContain('<div class="container">');
      expect(result.html).toContain('<h1>Test List</h1>');
      expect(result.html).toContain('<ul>');
      expect(result.html).toContain('<li>Item 1</li>');
      expect(result.html).toContain('<li>Item 2</li>');
      expect(result.html).toContain('<li>Item 3</li>');
      expect(result.html).toContain('</ul>');
      expect(result.html).toContain('</div>');
    });

    it('should handle empty props correctly', async () => {
      const componentCode = `
        const { jsx: _jsx } = require('react/jsx-runtime');
        function Component() {
          return _jsx('div', { children: 'No props needed' });
        }
        module.exports = { default: Component };
      `;

      const result = await executor.execute(componentCode);
      expect(result.html).toContain('No props needed');
      expect(result.props).toEqual({});
    });
  });
});
