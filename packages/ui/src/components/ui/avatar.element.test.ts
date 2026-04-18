import { afterEach, describe, expect, it } from 'vitest';
import './avatar.element';
import { RaftersAvatar } from './avatar.element';

afterEach(() => {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
});

function mount(attrs: Record<string, string> = {}): HTMLElement {
  const el = document.createElement('rafters-avatar');
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  document.body.appendChild(el);
  return el;
}

function collectCss(el: HTMLElement): string {
  const sheets = el.shadowRoot?.adoptedStyleSheets ?? [];
  return sheets
    .map((s) =>
      Array.from(s.cssRules)
        .map((r) => r.cssText)
        .join('\n'),
    )
    .join('\n');
}

describe('<rafters-avatar>', () => {
  it('registers the rafters-avatar tag on import', () => {
    expect(customElements.get('rafters-avatar')).toBe(RaftersAvatar);
  });

  it('does not throw when the module is imported twice', async () => {
    await expect(import('./avatar.element')).resolves.toBeDefined();
    await expect(import('./avatar.element')).resolves.toBeDefined();
    expect(customElements.get('rafters-avatar')).toBe(RaftersAvatar);
  });

  it('renders a single span.avatar containing a slot', () => {
    const el = mount();
    const span = el.shadowRoot?.querySelector('span.avatar');
    expect(span).not.toBeNull();
    expect(span?.children.length).toBe(1);
    expect(span?.firstElementChild?.tagName.toLowerCase()).toBe('slot');
  });

  it('falls back to default size md for unknown values', () => {
    const el = mount({ size: 'mega' });
    expect(collectCss(el)).toContain('spacing-10');
  });

  it('reflects size attribute changes to the adopted stylesheet', () => {
    const el = mount();
    el.setAttribute('size', 'xl');
    expect(collectCss(el)).toContain('spacing-16');
  });

  it('source contains no direct var() references', async () => {
    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    const source = await fs.readFile(path.resolve(__dirname, 'avatar.element.ts'), 'utf-8');
    expect(source).not.toMatch(/var\(/);
  });
});
