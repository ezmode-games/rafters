import { afterEach, describe, expect, it } from 'vitest';
import './alert.element';
import { RaftersAlert } from './alert.element';

afterEach(() => {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
});

function mount(attrs: Record<string, string> = {}): HTMLElement {
  const el = document.createElement('rafters-alert');
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  document.body.appendChild(el);
  return el;
}

function adoptedCss(el: HTMLElement): string {
  const sheets = el.shadowRoot?.adoptedStyleSheets ?? [];
  return sheets
    .map((s) =>
      Array.from(s.cssRules)
        .map((r) => r.cssText)
        .join('\n'),
    )
    .join('\n');
}

describe('rafters-alert', () => {
  it('registers the rafters-alert tag on import', () => {
    expect(customElements.get('rafters-alert')).toBe(RaftersAlert);
  });

  it('does not throw when the module is imported twice', async () => {
    await expect(import('./alert.element')).resolves.toBeDefined();
    await expect(import('./alert.element')).resolves.toBeDefined();
    expect(customElements.get('rafters-alert')).toBe(RaftersAlert);
  });

  it('renders a single div.alert[role=alert] containing a slot', () => {
    const el = mount();
    const root = el.shadowRoot;
    expect(root).not.toBeNull();
    const divs = root?.querySelectorAll('div') ?? [];
    expect(divs.length).toBe(1);
    const wrapper = divs[0];
    expect(wrapper?.className).toBe('alert');
    expect(wrapper?.getAttribute('role')).toBe('alert');
    const slot = wrapper?.querySelector('slot');
    expect(slot).not.toBeNull();
  });

  it('falls back to default variant for unknown values', () => {
    const el = mount({ variant: 'nonsense' });
    const css = adoptedCss(el);
    expect(css).toContain('color-primary-subtle');
    expect(css).toContain('color-primary-foreground');
    expect(css).toContain('color-primary-border');
  });

  it('reflects variant attribute changes to the adopted stylesheet', () => {
    const el = mount();
    el.setAttribute('variant', 'destructive');
    const css = adoptedCss(el);
    expect(css).toContain('color-destructive');
  });

  it('source contains no direct var() references', async () => {
    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    const source = await fs.readFile(path.resolve(__dirname, 'alert.element.ts'), 'utf-8');
    expect(source).not.toMatch(/[^a-zA-Z_]var\(/);
  });

  it('observedAttributes contains only variant', () => {
    expect(RaftersAlert.observedAttributes).toEqual(['variant']);
  });

  it('adopts a per-instance stylesheet on connect', () => {
    const el = mount();
    const sheets = el.shadowRoot?.adoptedStyleSheets ?? [];
    expect(sheets.length).toBe(1);
  });

  it('stylesheet uses only --motion-duration / --motion-ease tokens', () => {
    const el = mount();
    const css = adoptedCss(el);
    expect(css).not.toMatch(/var\(--duration-/);
    expect(css).not.toMatch(/var\(--ease-/);
  });

  it('falls back silently without throwing for unknown variant', () => {
    expect(() => mount({ variant: 'made-up' })).not.toThrow();
  });
});
