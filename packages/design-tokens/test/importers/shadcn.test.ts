import { describe, expect, it } from 'vitest';
import { extractShadcnRoot } from '../../src/importers/shadcn.js';

describe('extractShadcnRoot', () => {
  it('extracts custom properties from a :root block', () => {
    const css = `
      :root {
        --primary: oklch(0.5 0.2 30);
        --background: oklch(1 0 0);
      }
    `;
    expect(extractShadcnRoot(css)).toEqual([
      { name: 'primary', value: 'oklch(0.5 0.2 30)' },
      { name: 'background', value: 'oklch(1 0 0)' },
    ]);
  });

  it('skips .dark blocks (dark is computed)', () => {
    const css = `
      :root { --primary: oklch(0.5 0.2 30); }
      .dark { --primary: oklch(0.8 0.2 30); }
    `;
    expect(extractShadcnRoot(css)).toEqual([{ name: 'primary', value: 'oklch(0.5 0.2 30)' }]);
  });

  it('skips non-custom-property declarations inside :root', () => {
    const css = `
      :root {
        color: red;
        --primary: oklch(0.5 0.2 30);
      }
    `;
    expect(extractShadcnRoot(css)).toEqual([{ name: 'primary', value: 'oklch(0.5 0.2 30)' }]);
  });

  it('preserves duplicate declarations in source order', () => {
    const css = `
      :root { --primary: oklch(0.5 0.2 30); }
      :root { --primary: oklch(0.7 0.2 30); }
    `;
    expect(extractShadcnRoot(css)).toEqual([
      { name: 'primary', value: 'oklch(0.5 0.2 30)' },
      { name: 'primary', value: 'oklch(0.7 0.2 30)' },
    ]);
  });

  it('returns empty when no :root block is present', () => {
    expect(extractShadcnRoot('.button { color: red; }')).toEqual([]);
  });

  it('returns empty for empty input', () => {
    expect(extractShadcnRoot('')).toEqual([]);
  });

  it('does not match compound selectors involving :root', () => {
    const css = `
      :root.dark { --primary: oklch(0.5 0.2 30); }
      :root, html { --background: oklch(1 0 0); }
    `;
    expect(extractShadcnRoot(css)).toEqual([]);
  });

  it('handles HSL, hex, and named color values uniformly as raw strings', () => {
    const css = `
      :root {
        --a: hsl(20 50% 50%);
        --b: #ff5500;
        --c: red;
      }
    `;
    expect(extractShadcnRoot(css)).toEqual([
      { name: 'a', value: 'hsl(20 50% 50%)' },
      { name: 'b', value: '#ff5500' },
      { name: 'c', value: 'red' },
    ]);
  });
});
