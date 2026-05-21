import { describe, expect, it } from 'vitest';
import { classifyDeclarations } from '../../src/importers/classify.js';

describe('classifyDeclarations', () => {
  it('routes shadcn semantic names with color values to semantic', () => {
    const result = classifyDeclarations([
      { name: 'primary', value: 'oklch(0.21 0.006 285)' },
      { name: 'background', value: '#ffffff' },
      { name: 'destructive', value: 'hsl(0 70% 50%)' },
    ]);
    expect(result.byNamespace.semantic.map((d) => d.name)).toEqual([
      'primary',
      'background',
      'destructive',
    ]);
    expect(result.byNamespace.color).toEqual([]);
    expect(result.unclassified).toEqual([]);
  });

  it('routes non-shadcn color names to color (palette primitive)', () => {
    const result = classifyDeclarations([
      { name: 'brand-empire', value: 'oklch(0.4 0.2 240)' },
      { name: 'brand-empire-500', value: '#a31515' },
    ]);
    expect(result.byNamespace.color.map((d) => d.name)).toEqual([
      'brand-empire',
      'brand-empire-500',
    ]);
    expect(result.byNamespace.semantic).toEqual([]);
  });

  it('routes radius declarations by name + length value', () => {
    const result = classifyDeclarations([
      { name: 'radius', value: '0.5rem' },
      { name: 'radius-lg', value: '1rem' },
    ]);
    expect(result.byNamespace.radius.map((d) => d.name)).toEqual(['radius', 'radius-lg']);
  });

  it('routes spacing declarations by name + length value', () => {
    const result = classifyDeclarations([
      { name: 'spacing', value: '0.25rem' },
      { name: 'spacing-4', value: '1rem' },
      { name: 'space-x', value: '8px' },
    ]);
    expect(result.byNamespace.spacing.map((d) => d.name)).toEqual([
      'spacing',
      'spacing-4',
      'space-x',
    ]);
  });

  it('routes typography by font-stack value or font- name prefix', () => {
    const result = classifyDeclarations([
      { name: 'font-sans', value: '"Inter", system-ui, sans-serif' },
      { name: 'font-mono', value: 'ui-monospace, monospace' },
      { name: 'font-weight-bold', value: '700' },
      { name: 'line-height', value: '1.5rem' },
    ]);
    expect(result.byNamespace.typography.map((d) => d.name)).toEqual([
      'font-sans',
      'font-mono',
      'font-weight-bold',
      'line-height',
    ]);
  });

  it('routes shadow declarations by name prefix when value is complex', () => {
    const result = classifyDeclarations([
      { name: 'shadow', value: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
      { name: 'shadow-lg', value: '0 10px 15px -3px rgb(0 0 0 / 0.1)' },
    ]);
    expect(result.byNamespace.shadow.map((d) => d.name)).toEqual(['shadow', 'shadow-lg']);
  });

  it('sends Tailwind internals and unknown vars to unclassified', () => {
    const result = classifyDeclarations([
      { name: 'tw-ring-color', value: 'oklch(0.5 0.2 240)' },
      { name: 'some-app-internal', value: '42' },
      { name: 'random-thing', value: 'auto' },
    ]);
    // tw-ring-color has a color value, so it lands in `color` (not `semantic`,
    // because the name is not in the shadcn vocabulary). That is correct --
    // the importer cannot tell that `--tw-*` is internal; the consumer
    // filters those at prompt time if desired.
    expect(result.byNamespace.color.map((d) => d.name)).toEqual(['tw-ring-color']);
    expect(result.unclassified.map((d) => d.name)).toEqual(['some-app-internal', 'random-thing']);
  });

  it('returns empty buckets for empty input', () => {
    const result = classifyDeclarations([]);
    for (const ns of ['color', 'semantic', 'typography', 'spacing', 'radius', 'shadow'] as const) {
      expect(result.byNamespace[ns]).toEqual([]);
    }
    expect(result.unclassified).toEqual([]);
  });

  it('preserves order within each bucket', () => {
    const result = classifyDeclarations([
      { name: 'primary', value: '#000' },
      { name: 'radius', value: '0.5rem' },
      { name: 'background', value: '#fff' },
    ]);
    expect(result.byNamespace.semantic.map((d) => d.name)).toEqual(['primary', 'background']);
    expect(result.byNamespace.radius.map((d) => d.name)).toEqual(['radius']);
  });

  it('attaches namespace to each classified declaration', () => {
    const result = classifyDeclarations([
      { name: 'primary', value: '#000' },
      { name: 'radius', value: '0.5rem' },
    ]);
    expect(result.byNamespace.semantic[0]).toEqual({
      name: 'primary',
      value: '#000',
      namespace: 'semantic',
    });
    expect(result.byNamespace.radius[0]).toEqual({
      name: 'radius',
      value: '0.5rem',
      namespace: 'radius',
    });
  });
});
