import { afterEach, describe, expect, it } from 'vitest';
import './spinner.element';
import { RaftersSpinner } from './spinner.element';

afterEach(() => {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
});

function mount(attrs: Record<string, string> = {}): HTMLElement {
  const el = document.createElement('rafters-spinner');
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  document.body.appendChild(el);
  return el;
}

function adoptedCssText(el: Element): string {
  const sheets = el.shadowRoot?.adoptedStyleSheets ?? [];
  const blocks: string[] = [];
  for (const sheet of sheets) {
    const rules: string[] = [];
    for (const rule of Array.from(sheet.cssRules)) {
      rules.push(rule.cssText);
    }
    blocks.push(rules.join('\n'));
  }
  return blocks.join('\n');
}

describe('<rafters-spinner>', () => {
  it('registers the rafters-spinner tag on import', () => {
    expect(customElements.get('rafters-spinner')).toBe(RaftersSpinner);
  });

  it('does not throw when the module is imported twice', async () => {
    await expect(import('./spinner.element')).resolves.toBeDefined();
    await expect(import('./spinner.element')).resolves.toBeDefined();
    expect(customElements.get('rafters-spinner')).toBe(RaftersSpinner);
  });

  it('renders an output.spinner[aria-label=Loading] with a sr-only Loading span', () => {
    const el = mount();
    const root = el.shadowRoot;
    expect(root).not.toBeNull();
    const output = root?.querySelector('output.spinner');
    expect(output).not.toBeNull();
    expect(output?.getAttribute('aria-label')).toBe('Loading');
    const sr = output?.querySelector('span.sr-only');
    expect(sr).not.toBeNull();
    expect(sr?.textContent).toBe('Loading');
    // Output hosts exactly one child: the sr-only span.
    expect(output?.children.length).toBe(1);
    // Shadow root hosts exactly one top-level element.
    expect(root?.childNodes.length).toBe(1);
  });

  it('falls back to default size/variant for unknown values', () => {
    const el = mount({ size: 'gigantic', variant: 'nonsense' });
    const css = adoptedCssText(el);
    // Default variant: color-primary border-color.
    expect(css).toContain('color-primary');
    // Default size: 1.5rem height (default), 2px border width.
    expect(css).toContain('height: 1.5rem');
    expect(css).toContain('border-width: 2px');
  });

  it('reflects size attribute changes to the adopted stylesheet', () => {
    const el = mount();
    el.setAttribute('size', 'lg');
    const css = adoptedCssText(el);
    expect(css).toContain('height: 2rem');
    expect(css).toContain('border-width: 3px');
  });

  it('reflects variant attribute changes to the adopted stylesheet', () => {
    const el = mount();
    el.setAttribute('variant', 'destructive');
    const css = adoptedCssText(el);
    expect(css).toContain('color-destructive');
  });

  it('source contains no direct var() references', async () => {
    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    const source = await fs.readFile(path.resolve(__dirname, 'spinner.element.ts'), 'utf-8');
    expect(source).not.toMatch(/[^a-zA-Z_]var\(/);
  });

  it('observedAttributes matches the documented contract', () => {
    expect(RaftersSpinner.observedAttributes).toEqual(['size', 'variant']);
  });

  it('shadow root adopts the per-instance stylesheet', () => {
    const el = mount();
    const sheets = el.shadowRoot?.adoptedStyleSheets ?? [];
    expect(sheets.length).toBeGreaterThanOrEqual(1);
  });

  it('stylesheet uses only --motion-duration / --motion-ease tokens', () => {
    const el = mount();
    const css = adoptedCssText(el);
    expect(css).not.toMatch(/var\(--duration-/);
    expect(css).not.toMatch(/var\(--ease-/);
  });

  it('stylesheet includes a prefers-reduced-motion rule that disables animation', () => {
    const el = mount();
    const css = adoptedCssText(el);
    expect(css).toMatch(/prefers-reduced-motion:\s*reduce/);
    expect(css).toMatch(/animation:\s*none/);
  });

  it('stylesheet includes sr-only visually-hidden declarations', () => {
    const el = mount();
    const css = adoptedCssText(el);
    expect(css).toMatch(/\.sr-only/);
    expect(css).toMatch(/position:\s*absolute/);
    expect(css).toMatch(/clip:\s*rect\(0,\s*0,\s*0,\s*0\)/);
  });
});
