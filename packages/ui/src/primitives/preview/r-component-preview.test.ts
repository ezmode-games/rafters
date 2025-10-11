/**
 * Tests for r-component-preview Web Component
 */

import type { Preview } from '@rafters/shared';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import './r-component-preview';
import type { RComponentPreview } from './r-component-preview';

describe('r-component-preview', () => {
  let element: RComponentPreview;
  let fetchMock: ReturnType<typeof vi.fn>;

  const mockPreviewData: Preview = {
    framework: 'react',
    variant: 'default',
    props: {},
    compiledJs: 'export default function Button() { return null; }',
    sizeBytes: 1024,
    cva: {
      baseClasses: ['inline-flex', 'items-center'],
      propMappings: [
        {
          propName: 'variant',
          values: {
            primary: ['bg-blue-600', 'text-white'],
            secondary: ['bg-gray-200', 'text-gray-900'],
          },
        },
        {
          propName: 'size',
          values: {
            sm: ['px-3', 'py-1', 'text-sm'],
            md: ['px-4', 'py-2', 'text-base'],
            lg: ['px-6', 'py-3', 'text-lg'],
          },
        },
      ],
      allClasses: [
        'inline-flex',
        'items-center',
        'bg-blue-600',
        'text-white',
        'bg-gray-200',
        'text-gray-900',
        'px-3',
        'py-1',
        'text-sm',
        'px-4',
        'py-2',
        'text-base',
        'px-6',
        'py-3',
        'text-lg',
      ],
    },
    css: '.inline-flex { display: inline-flex; }',
    dependencies: ['react', 'class-variance-authority'],
  };

  beforeEach(() => {
    // Create element
    element = document.createElement('r-component-preview') as RComponentPreview;

    // Mock fetch
    fetchMock = vi.fn();
    global.fetch = fetchMock;
  });

  describe('Initialization', () => {
    it('should create element with default properties', () => {
      expect(element).toBeDefined();
      expect(element.component).toBe('');
      expect(element.variant).toBe('default');
      expect(element.disabled).toBe(false);
      expect(element.loading).toBe(false);
      expect(element.props).toEqual({});
    });

    it('should have correct tag name', () => {
      expect(element.tagName.toLowerCase()).toBe('r-component-preview');
    });
  });

  describe('connectedCallback', () => {
    it('should fetch preview data when connected', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockPreviewData,
      });

      element.component = 'button';
      document.body.appendChild(element);

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(fetchMock).toHaveBeenCalledWith('/registry/components/button/preview/default.json');
    });

    it('should not fetch if component name is missing', async () => {
      document.body.appendChild(element);

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe('fetchPreviewData', () => {
    it('should successfully fetch and parse preview data', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockPreviewData,
      });

      element.component = 'button';
      element.variant = 'primary';
      document.body.appendChild(element);

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(fetchMock).toHaveBeenCalledWith('/registry/components/button/preview/primary.json');
    });

    it('should emit preview-loaded event on success', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockPreviewData,
      });

      const loadedHandler = vi.fn();
      element.addEventListener('preview-loaded', loadedHandler);

      element.component = 'button';
      document.body.appendChild(element);

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(loadedHandler).toHaveBeenCalled();
      expect(loadedHandler.mock.calls[0][0].detail).toEqual(mockPreviewData);
    });

    it('should handle fetch failure', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
      });

      const errorHandler = vi.fn();
      element.addEventListener('preview-error', errorHandler);

      element.component = 'nonexistent';
      document.body.appendChild(element);

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(errorHandler).toHaveBeenCalled();
      expect(errorHandler.mock.calls[0][0].detail).toContain('Not Found');
    });

    it('should handle invalid JSON', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const errorHandler = vi.fn();
      element.addEventListener('preview-error', errorHandler);

      element.component = 'button';
      document.body.appendChild(element);

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(errorHandler).toHaveBeenCalled();
    });

    it('should validate required fields', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ framework: 'react' }), // Missing required fields
      });

      const errorHandler = vi.fn();
      element.addEventListener('preview-error', errorHandler);

      element.component = 'button';
      document.body.appendChild(element);

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(errorHandler).toHaveBeenCalled();
      expect(errorHandler.mock.calls[0][0].detail).toContain('missing required fields');
    });
  });

  describe('computeClasses', () => {
    beforeEach(async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockPreviewData,
      });

      element.component = 'button';
      document.body.appendChild(element);

      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    it('should include base classes', () => {
      const classes = element.computeClasses();
      expect(classes).toContain('inline-flex');
      expect(classes).toContain('items-center');
    });

    it('should add classes for prop values', () => {
      element.props = { variant: 'primary' };
      const classes = element.computeClasses();

      expect(classes).toContain('bg-blue-600');
      expect(classes).toContain('text-white');
    });

    it('should combine multiple prop mappings', () => {
      element.props = { variant: 'secondary', size: 'lg' };
      const classes = element.computeClasses();

      expect(classes).toContain('bg-gray-200');
      expect(classes).toContain('text-gray-900');
      expect(classes).toContain('px-6');
      expect(classes).toContain('py-3');
      expect(classes).toContain('text-lg');
    });

    it('should add disabled state classes', () => {
      element.disabled = true;
      const classes = element.computeClasses();

      expect(classes).toContain('opacity-50');
      expect(classes).toContain('cursor-not-allowed');
    });

    it('should add loading state classes', () => {
      element.loading = true;
      const classes = element.computeClasses();

      expect(classes).toContain('animate-pulse');
    });

    it('should handle invalid prop values', () => {
      element.props = { variant: 'nonexistent' };
      const classes = element.computeClasses();

      // Should only include base classes
      expect(classes).toContain('inline-flex');
      expect(classes).toContain('items-center');
      expect(classes).not.toContain('bg-blue-600');
    });

    it('should handle non-string prop values', () => {
      element.props = { variant: 123 };
      const classes = element.computeClasses();

      // Should ignore non-string values
      expect(classes).toContain('inline-flex');
      expect(classes).not.toContain('bg-blue-600');
    });
  });

  describe('Rendering', () => {
    it('should render loading state', async () => {
      fetchMock.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ ok: true, json: async () => mockPreviewData }), 100)
          )
      );

      element.component = 'button';
      document.body.appendChild(element);

      await element.updateComplete;

      const shadowRoot = element.shadowRoot;
      expect(shadowRoot?.querySelector('.preview-loading')).toBeDefined();
      expect(shadowRoot?.querySelector('[role="status"]')).toBeDefined();
    });

    it('should render error state', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        statusText: 'Server Error',
      });

      element.component = 'button';
      document.body.appendChild(element);

      await new Promise((resolve) => setTimeout(resolve, 0));
      await element.updateComplete;

      const shadowRoot = element.shadowRoot;
      expect(shadowRoot?.querySelector('.preview-error')).toBeDefined();
      expect(shadowRoot?.querySelector('[role="alert"]')).toBeDefined();
      expect(shadowRoot?.textContent).toContain('Server Error');
    });

    it('should render preview with computed classes', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockPreviewData,
      });

      element.component = 'button';
      element.props = { variant: 'primary', size: 'md' };
      document.body.appendChild(element);

      await new Promise((resolve) => setTimeout(resolve, 0));
      await element.updateComplete;

      const shadowRoot = element.shadowRoot;
      const previewContainer = shadowRoot?.querySelector('.preview-container');
      expect(previewContainer).toBeDefined();

      // Check that classes are applied
      const classDiv = previewContainer?.querySelector('[class]');
      expect(classDiv?.getAttribute('class')).toContain('inline-flex');
      expect(classDiv?.getAttribute('class')).toContain('bg-blue-600');
      expect(classDiv?.getAttribute('class')).toContain('px-4');
    });

    it('should inject critical CSS', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockPreviewData,
      });

      element.component = 'button';
      document.body.appendChild(element);

      await new Promise((resolve) => setTimeout(resolve, 0));
      await element.updateComplete;

      const shadowRoot = element.shadowRoot;
      const styles = shadowRoot?.querySelector('style');
      expect(styles?.textContent).toContain('.inline-flex { display: inline-flex; }');
    });

    it('should support slot content', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockPreviewData,
      });

      element.component = 'button';
      element.textContent = 'Click me';
      document.body.appendChild(element);

      await new Promise((resolve) => setTimeout(resolve, 0));
      await element.updateComplete;

      const shadowRoot = element.shadowRoot;
      const slot = shadowRoot?.querySelector('slot');
      expect(slot).toBeDefined();
    });

    it('should set aria-busy when loading', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockPreviewData,
      });

      element.component = 'button';
      element.loading = true;
      document.body.appendChild(element);

      await new Promise((resolve) => setTimeout(resolve, 0));
      await element.updateComplete;

      const shadowRoot = element.shadowRoot;
      const classDiv = shadowRoot?.querySelector('[aria-busy]');
      expect(classDiv?.getAttribute('aria-busy')).toBe('true');
    });

    it('should set disabled attribute when disabled', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockPreviewData,
      });

      element.component = 'button';
      element.disabled = true;
      document.body.appendChild(element);

      await new Promise((resolve) => setTimeout(resolve, 0));
      await element.updateComplete;

      const shadowRoot = element.shadowRoot;
      const classDiv = shadowRoot?.querySelector('[disabled]');
      expect(classDiv?.hasAttribute('disabled')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have appropriate ARIA labels', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockPreviewData,
      });

      element.component = 'button';
      document.body.appendChild(element);

      await new Promise((resolve) => setTimeout(resolve, 0));
      await element.updateComplete;

      const shadowRoot = element.shadowRoot;
      const container = shadowRoot?.querySelector('[role="region"]');
      expect(container?.getAttribute('aria-label')).toBe('Component preview');
    });

    it('should have screen reader text for loading', async () => {
      fetchMock.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ ok: true, json: async () => mockPreviewData }), 100)
          )
      );

      element.component = 'button';
      document.body.appendChild(element);

      await element.updateComplete;

      const shadowRoot = element.shadowRoot;
      const srText = shadowRoot?.querySelector('.sr-only');
      expect(srText?.textContent).toBe('Loading preview...');
    });

    it('should use aria-live for dynamic updates', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockPreviewData,
      });

      element.component = 'button';
      document.body.appendChild(element);

      await new Promise((resolve) => setTimeout(resolve, 0));
      await element.updateComplete;

      const shadowRoot = element.shadowRoot;

      // Check loading state
      const loading = shadowRoot?.querySelector('.preview-loading');
      if (loading) {
        expect(loading.getAttribute('aria-live')).toBe('polite');
      }
    });

    it('should use assertive aria-live for errors', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        statusText: 'Error',
      });

      element.component = 'button';
      document.body.appendChild(element);

      await new Promise((resolve) => setTimeout(resolve, 0));
      await element.updateComplete;

      const shadowRoot = element.shadowRoot;
      const error = shadowRoot?.querySelector('.preview-error');
      expect(error?.getAttribute('aria-live')).toBe('assertive');
    });
  });
});
