import type { Token } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { exportTailwindColor, generateColorTokens, TokenRegistry } from '../../src/index.js';

const baseToken = (partial: Partial<Token> & { name: string }): Token =>
  ({
    name: partial.name,
    value: partial.value ?? '0',
    category: partial.category ?? 'color',
    namespace: partial.namespace ?? 'color',
    userOverride: partial.userOverride ?? null,
    ...partial,
  }) as Token;

describe('exportTailwindColor', () => {
  it('resolves per-position ColorReferences to literal oklch', () => {
    const r = new TokenRegistry(
      generateColorTokens([{ name: 'neutral', oklch: { l: 0.5, c: 0, h: 0 } }]),
    );
    const css = exportTailwindColor(r);
    expect(css).toMatch(/--color-neutral-500:\s*oklch\([\d.]+\s+[\d.]+\s+[\d.]+\);/);
    expect(css).toMatch(/--color-neutral-50:\s*oklch\([\d.]+\s+[\d.]+\s+[\d.]+\);/);
    expect(css).toMatch(/--color-neutral-950:\s*oklch\([\d.]+\s+[\d.]+\s+[\d.]+\);/);
  });

  it('emits the family token as --color-{family} using position 500', () => {
    const r = new TokenRegistry(
      generateColorTokens([{ name: 'neutral', oklch: { l: 0.5, c: 0, h: 0 } }]),
    );
    const css = exportTailwindColor(r);
    expect(css).toMatch(/--color-neutral:\s*oklch\(/);
  });

  it('emits semantic ColorReferences as var() references', () => {
    const colorTokens = generateColorTokens([{ name: 'neutral', oklch: { l: 0.5, c: 0, h: 0 } }]);
    const r = new TokenRegistry([
      ...colorTokens,
      baseToken({
        name: 'background',
        namespace: 'semantic',
        category: 'color',
        value: { family: 'neutral', position: '50' },
      }),
    ]);
    const css = exportTailwindColor(r);
    expect(css).toMatch(/--background:\s*var\(--color-neutral-50\);/);
  });

  it('emits a dark-mode block', () => {
    const r = new TokenRegistry(
      generateColorTokens([{ name: 'neutral', oklch: { l: 0.5, c: 0, h: 0 } }]),
    );
    const css = exportTailwindColor(r);
    expect(css).toMatch(/@media \(prefers-color-scheme: dark\)/);
    expect(css).toMatch(/--color-neutral-50:\s*oklch\(/);
  });

  it('emits a CSS comment when a reference cannot be resolved', () => {
    const r = new TokenRegistry([
      baseToken({
        name: 'orphan-500',
        value: { family: 'ghost', position: '500' },
      }),
    ]);
    const css = exportTailwindColor(r);
    expect(css).toMatch(/unresolved ref: color\.ghost-500/);
  });

  it('userOverride with a string value wins over the resolved reference', () => {
    const tokens = generateColorTokens([{ name: 'neutral', oklch: { l: 0.5, c: 0, h: 0 } }]);
    const overridden = tokens.map((t) =>
      t.name === 'neutral-500'
        ? {
            ...t,
            value: 'oklch(0.6 0.2 240)',
            userOverride: {
              previousValue: { family: 'neutral' as const, position: '500' as const },
              reason: 'brand match',
            },
          }
        : t,
    );
    const r = new TokenRegistry(overridden as Token[]);
    const css = exportTailwindColor(r);
    expect(css).toMatch(/--color-neutral-500:\s*oklch\(0\.6 0\.2 240\);/);
  });

  it('emits multiple families', () => {
    const r = new TokenRegistry(
      generateColorTokens([
        { name: 'neutral', oklch: { l: 0.5, c: 0, h: 0 } },
        { name: 'ocean-blue', oklch: { l: 0.5, c: 0.18, h: 240 } },
      ]),
    );
    const css = exportTailwindColor(r);
    expect(css).toMatch(/--color-neutral-500:/);
    expect(css).toMatch(/--color-ocean-blue-500:/);
  });
});
