import { describe, expect, it } from 'vitest';
import {
  buildSystem,
  exportTailwind,
  generateNamespaces,
  registryToTypeScript,
  TokenRegistry,
  toDTCG,
} from '../src/index.js';

describe('buildSystem', () => {
  it('produces tokens across every namespace', () => {
    const result = buildSystem();
    const namespaces = new Set(result.allTokens.map((t) => t.namespace));
    for (const expected of [
      'color',
      'spacing',
      'typography',
      'breakpoint',
      'semantic',
      'typography-composite',
      'radius',
      'shadow',
      'depth',
      'motion',
      'fill',
      'elevation',
      'focus',
    ]) {
      expect(namespaces.has(expected)).toBe(true);
    }
  });

  it('color tokens use families-stay-whole shape (not v1 OKLCH strings)', () => {
    const result = buildSystem();
    const family = result.allTokens.find((t) => t.namespace === 'color' && t.name === 'neutral');
    expect(typeof family?.value).toBe('object');
    const pos500 = result.allTokens.find((t) => t.name === 'neutral-500');
    expect(pos500?.value).toEqual({ family: 'neutral', position: '500' });
  });

  it('byNamespace map has entries for every emitted namespace', () => {
    const result = buildSystem();
    for (const ns of result.metadata.namespaces) {
      expect(result.byNamespace.get(ns)?.length).toBeGreaterThan(0);
    }
  });

  it('metadata.tokenCount matches allTokens.length', () => {
    const result = buildSystem();
    expect(result.metadata.tokenCount).toBe(result.allTokens.length);
  });
});

describe('generateNamespaces', () => {
  it('produces tokens for only the requested namespaces', () => {
    const result = generateNamespaces(['spacing', 'radius']);
    const namespaces = new Set(result.allTokens.map((t) => t.namespace));
    expect(namespaces.has('spacing')).toBe(true);
    expect(namespaces.has('radius')).toBe(true);
    expect(namespaces.has('color')).toBe(false);
    expect(namespaces.has('motion')).toBe(false);
  });
});

describe('exportTailwind over a full buildSystem', () => {
  it('emits CSS vars for color, semantic, and at least one non-color namespace', () => {
    const registry = new TokenRegistry(buildSystem().allTokens);
    const css = exportTailwind(registry);
    expect(css).toMatch(/--color-neutral-500:\s*oklch\(/);
    expect(css).toMatch(/--background:\s*var\(--color-/);
    expect(css).toMatch(/--spacing-\w+:/);
  });

  it('emits a dark-mode block', () => {
    const registry = new TokenRegistry(buildSystem().allTokens);
    const css = exportTailwind(registry);
    expect(css).toMatch(/@media \(prefers-color-scheme: dark\)/);
  });
});

describe('registryToTypeScript over a full buildSystem', () => {
  it('emits a TypeScript module with token constants', () => {
    const registry = new TokenRegistry(buildSystem().allTokens);
    const ts = registryToTypeScript(registry);
    expect(ts).toMatch(/export const tokens/);
    expect(ts.length).toBeGreaterThan(100);
  });
});

describe('toDTCG over a full buildSystem', () => {
  it('emits a DTCG-shaped JSON object', () => {
    const dtcg = toDTCG(buildSystem().allTokens);
    expect(typeof dtcg).toBe('object');
    expect(JSON.stringify(dtcg).length).toBeGreaterThan(100);
  });
});
