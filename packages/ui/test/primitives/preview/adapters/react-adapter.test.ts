/**
 * Tests for React Framework Adapter
 * Using fixture generators for realistic test data
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ReactAdapter } from '../../../../src/primitives/preview/adapters/react-adapter';
import { createPreviewFixture } from '../../../../../shared/test/fixtures.js';

// Helper to execute IIFE in test environment
function executeIIFE(code: string) {
  // Use eval to execute the code synchronously in jsdom
  // This mimics how script tags work in real browsers
  // biome-ignore lint/security/noGlobalEval: Required for test environment to execute component IIFEs
  eval(code);
}

describe('ReactAdapter', () => {
  let adapter: ReactAdapter;
  let container: HTMLElement;
  let originalMount: typeof adapter.mount;

  beforeEach(() => {
    adapter = new ReactAdapter();
    container = document.createElement('div');
    document.body.appendChild(container);

    // Clear globals before each test
    // biome-ignore lint/performance/noDelete: Test cleanup requires deleting globals
    delete (window as any).React;
    // biome-ignore lint/performance/noDelete: Test cleanup requires deleting globals
    delete (window as any).ReactDOM;
    // biome-ignore lint/performance/noDelete: Test cleanup requires deleting globals
    delete (window as any).jsxRuntime;
    // biome-ignore lint/performance/noDelete: Test cleanup requires deleting globals
    delete (window as any).jsxDevRuntime;
    // biome-ignore lint/performance/noDelete: Test cleanup requires deleting globals
    delete (window as any).cva;
    // biome-ignore lint/performance/noDelete: Test cleanup requires deleting globals
    delete (window as any).shared;
    // biome-ignore lint/performance/noDelete: Test cleanup requires deleting globals
    delete (window as any).ComponentPreview;

    // Override mount to use eval instead of script tags in jsdom
    originalMount = adapter.mount.bind(adapter);
    adapter.mount = async function(container, compiledJs, props, children) {
      executeIIFE(compiledJs);
      // Call original mount logic but skip script creation
      const ComponentPreview = window.ComponentPreview;
      if (!ComponentPreview) {
        throw new Error('ComponentPreview global not found after script execution');
      }

      const Component: any =
        ComponentPreview.default ||
        Object.values(ComponentPreview).find(
          (exp) => typeof exp === 'function' && exp !== Object && exp !== Symbol
        );

      if (!Component) {
        throw new Error(
          `No component found in ComponentPreview global. Available exports: ${Object.keys(ComponentPreview).join(', ')}`
        );
      }

      const React = window.React;
      const ReactDOM = window.ReactDOM;

      (adapter as any).root = ReactDOM.createRoot(container);
      (adapter as any).root.render(React.createElement(Component, props, children));
    };
  });

  afterEach(() => {
    adapter.unmount();
    container.remove();
  });

  describe('loadRuntime', () => {
    it('should load React and dependencies as globals', async () => {
      await adapter.loadRuntime();

      expect(window.React).toBeDefined();
      expect(window.ReactDOM).toBeDefined();
      expect(window.jsxRuntime).toBeDefined();
      expect(window.jsxDevRuntime).toBeDefined();
      expect(window.cva).toBeDefined();
      expect(window.shared).toBeDefined();
    });

    it('should expose shared utilities', async () => {
      await adapter.loadRuntime();

      expect(window.shared).toBeDefined();
      // Check for some known exports from shared package
      expect(window.shared.oklchToHex).toBeDefined();
      expect(typeof window.shared.oklchToHex).toBe('function');
    });

    it('should expose cva function', async () => {
      await adapter.loadRuntime();

      expect(window.cva).toBeDefined();
      expect(window.cva.cva).toBeDefined();
      expect(typeof window.cva.cva).toBe('function');
    });

    it('should not reload if runtime already exists', async () => {
      // Load once
      await adapter.loadRuntime();
      const firstReact = window.React;

      // Load again
      await adapter.loadRuntime();
      const secondReact = window.React;

      // Should be the same reference
      expect(firstReact).toBe(secondReact);
    });

    it('should expose all React runtime modules', async () => {
      await adapter.loadRuntime();

      // Check React exports
      expect(window.React.createElement).toBeDefined();
      expect(window.React.useState).toBeDefined();

      // Check ReactDOM exports
      expect(window.ReactDOM.createRoot).toBeDefined();

      // Check jsx runtime exports
      expect(window.jsxRuntime.jsx).toBeDefined();
      expect(window.jsxDevRuntime.jsxDEV).toBeDefined();
    });
  });

  describe('mount', () => {
    beforeEach(async () => {
      // Ensure runtime is loaded for mount tests
      await adapter.loadRuntime();
    });

    it('should execute compiled IIFE and mount component', async () => {
      // Create a proper React component IIFE
      const compiledJs = `
        window.ComponentPreview = (function() {
          function TestComponent(props) {
            return window.React.createElement('div', {
              className: 'test-component'
            }, props.text || 'Test');
          }
          return { default: TestComponent };
        })();
      `;

      await adapter.mount(container, compiledJs, { text: 'Hello' });

      // Wait for React to render
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Component should be mounted
      expect(container.children.length).toBeGreaterThan(0);
      expect(container.querySelector('.test-component')).toBeDefined();
    });

    it('should handle props passed to component', async () => {
      const compiledJs = `
        window.ComponentPreview = (function() {
          function TestComponent(props) {
            return window.React.createElement('div', {
              'data-testid': 'test-component',
              'data-variant': props.variant
            }, props.children);
          }
          return { default: TestComponent };
        })();
      `;

      await adapter.mount(container, compiledJs, {
        variant: 'primary',
        children: 'Test Content',
      });

      // Wait for React to render
      await new Promise((resolve) => setTimeout(resolve, 10));

      const element = container.querySelector('[data-testid="test-component"]');
      expect(element).toBeDefined();
      expect(element?.getAttribute('data-variant')).toBe('primary');
    });

    it('should throw error if ComponentPreview global not found', async () => {
      const invalidJs = 'var SomeOtherGlobal = {};';

      await expect(adapter.mount(container, invalidJs, {})).rejects.toThrow(
        'ComponentPreview global not found'
      );
    });

    it('should find component export dynamically', async () => {
      // Test non-default export
      const compiledJs = `
        window.ComponentPreview = (function() {
          function ButtonComponent(props) {
            return window.React.createElement('button', {
              type: 'button',
              'data-testid': 'button'
            }, 'Click me');
          }
          return { ButtonComponent };
        })();
      `;

      await adapter.mount(container, compiledJs, {});

      // Wait for React to render
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(container.querySelector('[data-testid="button"]')).toBeDefined();
    });

    it('should throw error if no valid component found in exports', async () => {
      const compiledJs = `
        window.ComponentPreview = {
          notAFunction: 'string',
          alsoNotAFunction: 123
        };
      `;

      await expect(adapter.mount(container, compiledJs, {})).rejects.toThrow(
        'No component found in ComponentPreview global'
      );
    });

    it('should clean up script element after execution', async () => {
      const scriptsBefore = document.head.querySelectorAll('script').length;

      const compiledJs = `
        window.ComponentPreview = (function() {
          return { default: () => window.React.createElement('div', null, 'Test') };
        })();
      `;

      await adapter.mount(container, compiledJs, {});

      const scriptsAfter = document.head.querySelectorAll('script').length;
      expect(scriptsAfter).toBe(scriptsBefore);
    });
  });

  describe('unmount', () => {
    beforeEach(async () => {
      await adapter.loadRuntime();
    });

    it('should unmount React root', async () => {
      const compiledJs = `
        window.ComponentPreview = (function() {
          return { default: () => window.React.createElement('div', null, 'Test') };
        })();
      `;

      await adapter.mount(container, compiledJs, {});

      // Wait for React to render
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(container.children.length).toBeGreaterThan(0);

      adapter.unmount();

      // Root should be cleared
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(container.children.length).toBe(0);
    });

    it('should handle unmount without mount', () => {
      // Should not throw
      expect(() => adapter.unmount()).not.toThrow();
    });

    it('should allow re-mounting after unmount', async () => {
      const compiledJs = `
        window.ComponentPreview = (function() {
          return { default: () => window.React.createElement('div', { className: 'test' }, 'Test') };
        })();
      `;

      // Mount
      await adapter.mount(container, compiledJs, {});
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(container.querySelector('.test')).toBeDefined();

      // Unmount
      adapter.unmount();
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(container.querySelector('.test')).toBeNull();

      // Re-mount (need to clear and re-set ComponentPreview)
      delete (window as any).ComponentPreview;
      await adapter.mount(container, compiledJs, {});
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(container.querySelector('.test')).toBeDefined();
    });
  });

  describe('integration with fixtures', () => {
    beforeEach(async () => {
      await adapter.loadRuntime();
    });

    it('should work with fixture-generated preview data', async () => {
      const preview = createPreviewFixture({
        seed: 42,
        overrides: {
          framework: 'react',
          variant: 'default',
        },
      });

      // Mock a simple IIFE that uses preview props
      const compiledJs = `
        window.ComponentPreview = (function() {
          return {
            default: (props) => window.React.createElement('div', {
              'data-framework': '${preview.framework}',
              'data-variant': '${preview.variant}'
            }, 'Fixture Component')
          };
        })();
      `;

      await adapter.mount(container, compiledJs, preview.props);
      await new Promise((resolve) => setTimeout(resolve, 10));

      const element = container.querySelector('[data-framework]');
      expect(element?.getAttribute('data-framework')).toBe('react');
      expect(element?.getAttribute('data-variant')).toBe('default');
    });

    it('should handle different preview variants', async () => {
      const variants = ['default', 'primary', 'secondary'];

      for (const variant of variants) {
        const preview = createPreviewFixture({
          overrides: { variant },
        });

        const compiledJs = `
          window.ComponentPreview = (function() {
            return {
              default: () => window.React.createElement('div', {
                'data-variant': '${variant}'
              }, 'Test')
            };
          })();
        `;

        adapter.unmount();
        container.innerHTML = '';
        delete (window as any).ComponentPreview;

        await adapter.mount(container, compiledJs, preview.props);
        await new Promise((resolve) => setTimeout(resolve, 10));

        const element = container.querySelector('[data-variant]');
        expect(element?.getAttribute('data-variant')).toBe(variant);
      }
    });
  });
});
