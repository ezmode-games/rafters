import { fixture, html } from '@open-wc/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RComponentPreview } from './r-component-preview';
import './r-component-preview';

describe('r-component-preview', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('should render button preview with primary variant', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        component: 'button',
        baseClasses: ['inline-flex', 'items-center'],
        propMappings: [
          {
            propName: 'variant',
            values: { primary: ['bg-primary', 'text-white'] },
          },
        ],
        allClasses: ['inline-flex', 'items-center', 'bg-primary', 'text-white'],
        criticalCSS: '.inline-flex { display: inline-flex; }',
      }),
    } as Response);

    const el = (await fixture(html`
      <r-component-preview component="button" variant="primary"></r-component-preview>
    `)) as RComponentPreview;

    await el.updateComplete;

    const button = el.shadowRoot?.querySelector('button');
    expect(button).toBeDefined();
    expect(button?.className).toContain('bg-primary');
    expect(button?.className).toContain('inline-flex');
  });

  it('should apply disabled state classes', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        component: 'button',
        baseClasses: [],
        propMappings: [],
        allClasses: [],
        criticalCSS: '',
      }),
    } as Response);

    const el = (await fixture(html`
      <r-component-preview component="button" disabled></r-component-preview>
    `)) as RComponentPreview;

    await el.updateComplete;

    const button = el.shadowRoot?.querySelector('button');
    expect(button?.className).toContain('opacity-50');
    expect(button?.className).toContain('cursor-not-allowed');
    expect(button?.disabled).toBe(true);
  });

  it('should apply loading state classes', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        component: 'button',
        baseClasses: [],
        propMappings: [],
        allClasses: [],
        criticalCSS: '',
      }),
    } as Response);

    const el = (await fixture(html`
      <r-component-preview component="button" loading></r-component-preview>
    `)) as RComponentPreview;

    await el.updateComplete;

    const button = el.shadowRoot?.querySelector('button');
    expect(button?.className).toContain('animate-pulse');
    expect(button?.getAttribute('aria-busy')).toBe('true');
  });

  it('should handle fetch errors gracefully', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const el = (await fixture(html`
      <r-component-preview component="nonexistent"></r-component-preview>
    `)) as RComponentPreview;

    await el.updateComplete;

    const errorDiv = el.shadowRoot?.querySelector('.error');
    expect(errorDiv?.textContent).toContain('not found');
  });

  it('should show loading state initially', async () => {
    vi.mocked(fetch).mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    const el = (await fixture(html`
      <r-component-preview component="button"></r-component-preview>
    `)) as RComponentPreview;

    const loadingDiv = el.shadowRoot?.querySelector('.loading');
    expect(loadingDiv).toBeDefined();
    expect(loadingDiv?.textContent).toContain('Loading');
  });

  it('should inject critical CSS into shadow DOM', async () => {
    const testCSS = '.test-class { color: red; }';

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        component: 'button',
        baseClasses: [],
        propMappings: [],
        allClasses: [],
        criticalCSS: testCSS,
      }),
    } as Response);

    const el = (await fixture(html`
      <r-component-preview component="button"></r-component-preview>
    `)) as RComponentPreview;

    await el.updateComplete;

    const styleTag = el.shadowRoot?.querySelector('style');
    expect(styleTag?.textContent).toContain(testCSS);
  });
});
