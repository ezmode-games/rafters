/**
 * Tests for r-component-preview Web Component
 */

import type { ComponentManifest } from '@rafters/shared';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import './r-component-preview';
import type { RComponentPreview } from './r-component-preview';

describe('r-component-preview', () => {
  let element: RComponentPreview;
  let fetchMock: ReturnType<typeof vi.fn>;

  const mockButtonData: ComponentManifest = {
    name: 'button',
    type: 'registry:component',
    description: 'Button component',
    files: [],
    meta: {
      rafters: {
        version: '1.0.0',
        intelligence: {
          cognitiveLoad: 3,
          attentionEconomics: 'primary',
          accessibility: 'WCAG AAA',
          trustBuilding: 'medium',
          semanticMeaning: 'action',
          cva: {
            baseClasses: ['inline-flex', 'items-center', 'justify-center'],
            propMappings: [
              {
                propName: 'variant',
                values: {
                  default: ['bg-primary', 'text-primary-foreground'],
                  destructive: ['bg-destructive', 'text-destructive-foreground'],
                },
              },
              {
                propName: 'size',
                values: {
                  sm: ['h-8', 'px-3', 'text-sm'],
                  md: ['h-10', 'px-4', 'text-base'],
                  lg: ['h-12', 'px-6', 'text-lg'],
                },
              },
            ],
            allClasses: [
              'inline-flex',
              'items-center',
              'justify-center',
              'bg-primary',
              'text-primary-foreground',
              'bg-destructive',
              'text-destructive-foreground',
              'h-8',
              'px-3',
              'text-sm',
              'h-10',
              'px-4',
              'text-base',
              'h-12',
              'px-6',
              'text-lg',
            ],
            css: '.inline-flex{display:inline-flex}.items-center{align-items:center}',
          },
        },
      },
    },
  };

  beforeEach(() => {
    // Create fresh element for each test
    element = document.createElement('r-component-preview') as RComponentPreview;

    // Mock fetch
    fetchMock = vi.fn();
    global.fetch = fetchMock;
  });

  it('should render loading state initially', async () => {
    // Don't set component name so it won't fetch
    // This keeps it in loading state
    element.component = '';
    document.body.appendChild(element);
    await element.updateComplete;

    // Should show error about missing component name
    const error = element.shadowRoot?.querySelector('.preview-error');
    expect(error).toBeTruthy();
    expect(error?.textContent).toContain('Component name is required');

    document.body.removeChild(element);
  });

  it('should fetch component data on connect', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockButtonData,
    });

    element.component = 'button';
    document.body.appendChild(element);

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:4321/registry/components/button.json');

    document.body.removeChild(element);
  });

  it('should display error on fetch failure', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    element.component = 'nonexistent';
    document.body.appendChild(element);

    await new Promise((resolve) => setTimeout(resolve, 10));
    await element.updateComplete;

    const error = element.shadowRoot?.querySelector('.preview-error');
    expect(error).toBeTruthy();
    expect(error?.textContent).toContain('404');

    document.body.removeChild(element);
  });

  it('should compute base classes correctly', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockButtonData,
    });

    element.component = 'button';
    document.body.appendChild(element);

    await new Promise((resolve) => setTimeout(resolve, 10));
    await element.updateComplete;

    const button = element.shadowRoot?.querySelector('button');
    expect(button?.className).toContain('inline-flex');
    expect(button?.className).toContain('items-center');
    expect(button?.className).toContain('justify-center');

    document.body.removeChild(element);
  });

  it('should apply variant classes', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockButtonData,
    });

    element.component = 'button';
    element.variant = 'destructive';
    document.body.appendChild(element);

    await new Promise((resolve) => setTimeout(resolve, 10));
    await element.updateComplete;

    const button = element.shadowRoot?.querySelector('button');
    expect(button?.className).toContain('bg-destructive');
    expect(button?.className).toContain('text-destructive-foreground');

    document.body.removeChild(element);
  });

  it('should apply size classes', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockButtonData,
    });

    element.component = 'button';
    element.size = 'lg';
    document.body.appendChild(element);

    await new Promise((resolve) => setTimeout(resolve, 10));
    await element.updateComplete;

    const button = element.shadowRoot?.querySelector('button');
    expect(button?.className).toContain('h-12');
    expect(button?.className).toContain('px-6');
    expect(button?.className).toContain('text-lg');

    document.body.removeChild(element);
  });

  it('should apply disabled state classes', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockButtonData,
    });

    element.component = 'button';
    element.disabled = true;
    document.body.appendChild(element);

    await new Promise((resolve) => setTimeout(resolve, 10));
    await element.updateComplete;

    const button = element.shadowRoot?.querySelector('button');
    expect(button?.className).toContain('opacity-50');
    expect(button?.className).toContain('cursor-not-allowed');
    expect(button?.disabled).toBe(true);

    document.body.removeChild(element);
  });

  it('should apply loading state classes', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockButtonData,
    });

    element.component = 'button';
    element.loading = true;
    document.body.appendChild(element);

    await new Promise((resolve) => setTimeout(resolve, 10));
    await element.updateComplete;

    const button = element.shadowRoot?.querySelector('button');
    expect(button?.className).toContain('animate-pulse');

    document.body.removeChild(element);
  });

  it('should inject critical CSS into Shadow DOM', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockButtonData,
    });

    element.component = 'button';
    document.body.appendChild(element);

    await new Promise((resolve) => setTimeout(resolve, 10));
    await element.updateComplete;

    const style = element.shadowRoot?.querySelector('style');
    expect(style).toBeTruthy();
    expect(style?.textContent).toContain('.inline-flex');
    expect(style?.textContent).toContain('display:inline-flex');

    document.body.removeChild(element);
  });

  it('should handle missing CVA data gracefully', async () => {
    const mockDataWithoutCVA: ComponentManifest = {
      name: 'simple',
      type: 'registry:component',
      description: 'Simple component',
      files: [],
      meta: {
        rafters: {
          version: '1.0.0',
          intelligence: {
            cognitiveLoad: 1,
            attentionEconomics: 'neutral',
            accessibility: 'WCAG AA',
            trustBuilding: 'low',
            semanticMeaning: 'container',
          },
        },
      },
    };

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDataWithoutCVA,
    });

    element.component = 'simple';
    document.body.appendChild(element);

    await new Promise((resolve) => setTimeout(resolve, 10));
    await element.updateComplete;

    // Should not crash, just render with no classes
    const button = element.shadowRoot?.querySelector('button');
    expect(button).toBeTruthy();

    document.body.removeChild(element);
  });

  it('should use custom registry URL', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockButtonData,
    });

    element.component = 'button';
    element.registryUrl = 'https://custom-registry.com';
    document.body.appendChild(element);

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(fetchMock).toHaveBeenCalledWith(
      'https://custom-registry.com/registry/components/button.json'
    );

    document.body.removeChild(element);
  });
});
