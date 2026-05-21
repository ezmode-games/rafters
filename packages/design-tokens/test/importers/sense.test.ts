import { describe, expect, it } from 'vitest';
import { senseShadcnCss } from '../../src/importers/sense.js';

describe('senseShadcnCss', () => {
  it('counts declarations across rafters namespaces and unclassified', () => {
    const css = `
      :root {
        --primary: oklch(0.5 0.2 30);
        --background: oklch(1 0 0);
        --destructive: hsl(0 70% 50%);
        --radius: 0.5rem;
        --font-sans: "Inter", system-ui, sans-serif;
        --brand-empire: oklch(0.4 0.2 240);
        --tw-ring-color: oklch(0.5 0.2 240);
        --some-internal: 42;
      }
    `;
    const summary = senseShadcnCss(css);

    expect(summary.totalDeclarations).toBe(8);
    expect(summary.byNamespace).toEqual({
      color: 2, // brand-empire, tw-ring-color (both color values, neither in shadcn vocab)
      semantic: 3, // primary, background, destructive
      typography: 1, // font-sans
      spacing: 0,
      radius: 1,
      shadow: 0,
    });
    expect(summary.namespacesPresent).toEqual(['color', 'semantic', 'typography', 'radius']);
    expect(summary.unclassifiedCount).toBe(1); // some-internal: 42
  });

  it('returns zero counts for empty CSS', () => {
    const summary = senseShadcnCss('');
    expect(summary.totalDeclarations).toBe(0);
    expect(summary.unclassifiedCount).toBe(0);
    expect(summary.namespacesPresent).toEqual([]);
    for (const ns of ['color', 'semantic', 'typography', 'spacing', 'radius', 'shadow'] as const) {
      expect(summary.byNamespace[ns]).toBe(0);
    }
  });

  it('returns zero counts for CSS without a :root block', () => {
    const summary = senseShadcnCss('.button { color: red; }');
    expect(summary.totalDeclarations).toBe(0);
    expect(summary.namespacesPresent).toEqual([]);
  });

  it('lists namespaces present in declaration order', () => {
    const css = `
      :root {
        --radius: 0.5rem;
        --primary: oklch(0.5 0.2 30);
        --font-sans: "Inter";
      }
    `;
    const summary = senseShadcnCss(css);
    // namespacesPresent uses RAFTERS_IMPORT_NAMESPACES order (color, semantic,
    // typography, spacing, radius, shadow), not source order -- that's the
    // canonical ordering for the human summary.
    expect(summary.namespacesPresent).toEqual(['semantic', 'typography', 'radius']);
  });
});
