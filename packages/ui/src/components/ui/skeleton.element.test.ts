import { afterEach, describe, expect, it } from 'vitest';
import './skeleton.element';
import { RaftersSkeleton } from './skeleton.element';

afterEach(() => {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
});

function mount(attrs: Record<string, string> = {}): HTMLElement {
  const el = document.createElement('rafters-skeleton');
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

describe('<rafters-skeleton>', () => {
  it('registers the rafters-skeleton tag on import', () => {
    expect(customElements.get('rafters-skeleton')).toBe(RaftersSkeleton);
  });

  it('does not throw when the module is imported twice', async () => {
    await expect(import('./skeleton.element')).resolves.toBeDefined();
    await expect(import('./skeleton.element')).resolves.toBeDefined();
    expect(customElements.get('rafters-skeleton')).toBe(RaftersSkeleton);
  });

  it('renders a single div.skeleton[aria-hidden=true] with no slot', () => {
    const el = mount();
    const root = el.shadowRoot;
    expect(root).not.toBeNull();
    const div = root?.querySelector('div.skeleton');
    expect(div).not.toBeNull();
    expect(div?.getAttribute('aria-hidden')).toBe('true');
    // No slot element anywhere in the shadow tree
    expect(root?.querySelector('slot')).toBeNull();
    // Single child on the shadow root
    expect(root?.childNodes.length).toBe(1);
    // The skeleton div itself has no children
    expect(div?.children.length).toBe(0);
  });

  it('falls back to default variant for unknown values', () => {
    const el = mount({ variant: 'nonsense' });
    // Default variant background is color-muted
    const css = adoptedCssText(el);
    expect(css).toContain('color-muted');
    expect(css).not.toContain('color-primary-subtle');
    expect(css).not.toContain('color-destructive-subtle');
  });

  it('reflects variant attribute changes to the adopted stylesheet', () => {
    const el = mount();
    el.setAttribute('variant', 'destructive');
    const css = adoptedCssText(el);
    expect(css).toContain('color-destructive-subtle');
  });

  it('source contains no direct var() references', async () => {
    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    const source = await fs.readFile(path.resolve(__dirname, 'skeleton.element.ts'), 'utf-8');
    expect(source).not.toMatch(/[^a-zA-Z_]var\(/);
  });

  it('observedAttributes matches the documented contract', () => {
    expect(RaftersSkeleton.observedAttributes).toEqual(['variant']);
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

  it('reflects primary variant to the primary-subtle background', () => {
    const el = mount({ variant: 'primary' });
    const css = adoptedCssText(el);
    expect(css).toContain('color-primary-subtle');
  });
});
