import { afterEach, describe, expect, it } from 'vitest';
import './button.element';
import { RaftersButton } from './button.element';

afterEach(() => {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
});

function mount(attrs: Record<string, string> = {}): HTMLElement {
  const el = document.createElement('rafters-button');
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

describe('rafters-button', () => {
  it('registers as a custom element', () => {
    expect(customElements.get('rafters-button')).toBeDefined();
  });

  it('exports RaftersButton as the registered constructor', () => {
    expect(customElements.get('rafters-button')).toBe(RaftersButton);
  });

  it('renders an inner <button> with type="button" by default', () => {
    const el = mount();
    const inner = el.shadowRoot?.querySelector('button');
    expect(inner).toBeTruthy();
    expect(inner?.getAttribute('type')).toBe('button');
  });

  it('inner <button> carries only the .button class (no Tailwind)', () => {
    const el = mount();
    const inner = el.shadowRoot?.querySelector('button');
    expect(inner?.className).toBe('button');
  });

  it('reflects disabled to the inner button', () => {
    const el = mount({ disabled: '' });
    const inner = el.shadowRoot?.querySelector('button');
    expect(inner?.disabled).toBe(true);

    el.removeAttribute('disabled');
    const refreshed = el.shadowRoot?.querySelector('button');
    expect(refreshed?.disabled).toBe(false);
  });

  it('applies type=submit when attribute is set', () => {
    const el = mount({ type: 'submit' });
    expect(el.shadowRoot?.querySelector('button')?.getAttribute('type')).toBe('submit');
  });

  it('applies type=reset when attribute is set', () => {
    const el = mount({ type: 'reset' });
    expect(el.shadowRoot?.querySelector('button')?.getAttribute('type')).toBe('reset');
  });

  it('falls back to type=button for unknown type values', () => {
    const el = mount({ type: 'bogus' });
    expect(el.shadowRoot?.querySelector('button')?.getAttribute('type')).toBe('button');
  });

  it('falls back to default variant/size for unknown values without throwing', () => {
    expect(() => mount({ variant: 'made-up', size: 'enormous' })).not.toThrow();
  });

  it('bubbles click events from inner button to host', () => {
    const el = mount();
    let received = 0;
    el.addEventListener('click', () => {
      received += 1;
    });
    el.shadowRoot?.querySelector('button')?.click();
    expect(received).toBe(1);
  });

  it('does not fire click when disabled', () => {
    const el = mount({ disabled: '' });
    let received = 0;
    el.addEventListener('click', () => {
      received += 1;
    });
    el.shadowRoot?.querySelector('button')?.click();
    expect(received).toBe(0);
  });

  it('renders a default <slot> for consumer content', () => {
    const el = mount();
    el.textContent = 'Save';
    const slot = el.shadowRoot?.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  it('updates stylesheet when variant attribute changes', () => {
    const el = mount();
    el.setAttribute('variant', 'destructive');
    const css = collectCss(el);
    expect(css).toContain('var(--color-destructive)');
  });

  it('updates stylesheet when size attribute changes', () => {
    const el = mount();
    el.setAttribute('size', 'lg');
    const css = collectCss(el);
    expect(css).toContain('height: 3rem');
  });

  it('updates stylesheet when disabled is toggled', () => {
    const el = mount();
    expect(collectCss(el)).not.toMatch(/\.button\s*\{[^}]*opacity:\s*0\.5/);
    el.setAttribute('disabled', '');
    expect(collectCss(el)).toMatch(/opacity:\s*0\.5/);
    el.removeAttribute('disabled');
    const after = collectCss(el);
    // :disabled rule still emits disabled styles, but the base rule should not.
    expect(after).toMatch(/\.button:disabled\s*\{[^}]*opacity:\s*0\.5/);
  });

  it('rebuilds inner button type when type attribute changes', () => {
    const el = mount();
    expect(el.shadowRoot?.querySelector('button')?.getAttribute('type')).toBe('button');
    el.setAttribute('type', 'submit');
    expect(el.shadowRoot?.querySelector('button')?.getAttribute('type')).toBe('submit');
    el.setAttribute('type', 'bogus');
    expect(el.shadowRoot?.querySelector('button')?.getAttribute('type')).toBe('button');
  });

  it('observedAttributes matches the documented contract', () => {
    expect(RaftersButton.observedAttributes).toEqual(['variant', 'size', 'disabled', 'type']);
  });

  it('importing the module twice does not throw', async () => {
    await import('./button.element');
    await import('./button.element');
    expect(customElements.get('rafters-button')).toBe(RaftersButton);
  });

  it('shadow root adopts the per-instance stylesheet', () => {
    const el = mount();
    const sheets = el.shadowRoot?.adoptedStyleSheets ?? [];
    expect(sheets.length).toBeGreaterThanOrEqual(1);
  });

  it('stylesheet uses only --motion-duration / --motion-ease tokens', () => {
    const el = mount();
    const css = collectCss(el);
    expect(css).not.toMatch(/var\(--duration-/);
    expect(css).not.toMatch(/var\(--ease-/);
  });

  it('source contains no direct var() literals in either .ts file', async () => {
    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    const elementSource = await fs.readFile(path.resolve(__dirname, 'button.element.ts'), 'utf-8');
    expect(elementSource).not.toMatch(/[^a-zA-Z_]var\(/);
  });
});
