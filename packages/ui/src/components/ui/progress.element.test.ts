import { afterEach, describe, expect, it } from 'vitest';
import './progress.element';
import { RaftersProgress } from './progress.element';

afterEach(() => {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
});

function mount(attrs: Record<string, string> = {}): HTMLElement {
  const el = document.createElement('rafters-progress');
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

describe('<rafters-progress>', () => {
  it('registers the rafters-progress tag on import', () => {
    expect(customElements.get('rafters-progress')).toBe(RaftersProgress);
  });

  it('does not throw when the module is imported twice', async () => {
    await expect(import('./progress.element')).resolves.toBeDefined();
    await expect(import('./progress.element')).resolves.toBeDefined();
    expect(customElements.get('rafters-progress')).toBe(RaftersProgress);
  });

  it('renders a div.progress > div.progress-indicator structure', () => {
    const el = mount();
    const track = el.shadowRoot?.querySelector('div.progress');
    expect(track).not.toBeNull();
    expect(track?.getAttribute('role')).toBe('progressbar');
    const indicator = track?.querySelector('div.progress-indicator');
    expect(indicator).not.toBeNull();
  });

  it('falls back to default variant/size for unknown values', () => {
    const el = mount({ variant: 'nonsense', size: 'gigantic' });
    const css = adoptedCssText(el);
    // default variant = color-primary, default size = 0.5rem track height
    expect(css).toContain('color-primary');
    expect(css).toMatch(/height:\s*0\.5rem/);
  });

  it('reflects value changes to indicator inline width and aria-valuenow', () => {
    const el = mount();
    el.setAttribute('value', '33');
    const indicator = el.shadowRoot?.querySelector('div.progress-indicator');
    const track = el.shadowRoot?.querySelector('div.progress');
    expect((indicator as HTMLElement | null)?.style.width).toBe('33%');
    expect(track?.getAttribute('aria-valuenow')).toBe('33');
    expect(track?.getAttribute('aria-valuetext')).toBe('33%');
    expect(el.hasAttribute('aria-busy')).toBe(false);
  });

  it('falls back to indeterminate when value is absent or non-numeric', () => {
    const el = mount();
    expect(el.getAttribute('aria-busy')).toBe('true');
    const indicator = el.shadowRoot?.querySelector('div.progress-indicator');
    expect((indicator as HTMLElement | null)?.style.width).toBe('');
    expect(indicator?.hasAttribute('data-indeterminate')).toBe(true);

    const el2 = mount({ value: 'not-a-number' });
    expect(el2.getAttribute('aria-busy')).toBe('true');
    const indicator2 = el2.shadowRoot?.querySelector('div.progress-indicator');
    expect((indicator2 as HTMLElement | null)?.style.width).toBe('');
    expect(indicator2?.hasAttribute('data-indeterminate')).toBe(true);
  });

  it('source contains no direct var() references', async () => {
    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    const source = await fs.readFile(path.resolve(__dirname, 'progress.element.ts'), 'utf-8');
    expect(source).not.toMatch(/[^a-zA-Z_]var\(/);
  });

  it('observedAttributes matches the documented contract', () => {
    expect(RaftersProgress.observedAttributes).toEqual(['value', 'max', 'variant', 'size']);
  });

  it('emits aria-valuemin=0 and aria-valuemax=max on the track', () => {
    const el = mount({ max: '250', value: '50' });
    const track = el.shadowRoot?.querySelector('div.progress');
    expect(track?.getAttribute('aria-valuemin')).toBe('0');
    expect(track?.getAttribute('aria-valuemax')).toBe('250');
    expect(track?.getAttribute('aria-valuenow')).toBe('50');
  });

  it('clamps value to [0, max]', () => {
    const el = mount({ value: '200', max: '100' });
    const indicator = el.shadowRoot?.querySelector('div.progress-indicator');
    const track = el.shadowRoot?.querySelector('div.progress');
    expect((indicator as HTMLElement | null)?.style.width).toBe('100%');
    expect(track?.getAttribute('aria-valuenow')).toBe('100');

    const el2 = mount({ value: '-50' });
    const indicator2 = el2.shadowRoot?.querySelector('div.progress-indicator');
    const track2 = el2.shadowRoot?.querySelector('div.progress');
    expect((indicator2 as HTMLElement | null)?.style.width).toBe('0%');
    expect(track2?.getAttribute('aria-valuenow')).toBe('0');
  });

  it('falls back to max=100 when max is non-numeric or non-positive', () => {
    const el = mount({ max: 'abc', value: '50' });
    const track = el.shadowRoot?.querySelector('div.progress');
    expect(track?.getAttribute('aria-valuemax')).toBe('100');

    const el2 = mount({ max: '0', value: '50' });
    const track2 = el2.shadowRoot?.querySelector('div.progress');
    expect(track2?.getAttribute('aria-valuemax')).toBe('100');

    const el3 = mount({ max: '-10', value: '50' });
    const track3 = el3.shadowRoot?.querySelector('div.progress');
    expect(track3?.getAttribute('aria-valuemax')).toBe('100');
  });

  it('reflects variant attribute changes to the adopted stylesheet', () => {
    const el = mount();
    el.setAttribute('variant', 'destructive');
    expect(adoptedCssText(el)).toContain('color-destructive');
  });

  it('reflects size attribute changes to the adopted stylesheet', () => {
    const el = mount();
    el.setAttribute('size', 'lg');
    expect(adoptedCssText(el)).toMatch(/height:\s*0\.75rem/);
    el.setAttribute('size', 'sm');
    expect(adoptedCssText(el)).toMatch(/height:\s*0\.25rem/);
  });

  it('removes aria-busy and data-indeterminate when value becomes numeric', () => {
    const el = mount();
    expect(el.getAttribute('aria-busy')).toBe('true');
    el.setAttribute('value', '42');
    expect(el.hasAttribute('aria-busy')).toBe(false);
    const indicator = el.shadowRoot?.querySelector('div.progress-indicator');
    expect(indicator?.hasAttribute('data-indeterminate')).toBe(false);
    expect((indicator as HTMLElement | null)?.style.width).toBe('42%');
  });

  it('re-enters indeterminate when value is removed', () => {
    const el = mount({ value: '50' });
    expect(el.hasAttribute('aria-busy')).toBe(false);
    el.removeAttribute('value');
    expect(el.getAttribute('aria-busy')).toBe('true');
    const indicator = el.shadowRoot?.querySelector('div.progress-indicator');
    expect(indicator?.hasAttribute('data-indeterminate')).toBe(true);
    expect((indicator as HTMLElement | null)?.style.width).toBe('');
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
});
