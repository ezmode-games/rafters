import { describe, expect, it } from 'vitest';
import {
  ColorValueSchema,
  CompositeValueSchema,
  NamespaceSchema,
  NumberValueSchema,
  PluginManifestSchema,
  ReferenceValueSchema,
  StringValueSchema,
  TokenDependencySchema,
  TokenIdSchema,
  TokenSchema,
  TokenSetManifestSchema,
  TokenValueSchema,
  UserOverrideSchema,
} from '../src/schemas/index.js';

describe('NamespaceSchema', () => {
  it('accepts every supported namespace', () => {
    for (const ns of [
      'color',
      'semantic',
      'spacing',
      'typography',
      'typography-composite',
      'radius',
      'shadow',
      'depth',
      'motion',
      'focus',
      'breakpoint',
      'elevation',
      'fill',
    ]) {
      expect(NamespaceSchema.safeParse(ns).success).toBe(true);
    }
  });

  it('rejects unknown namespaces', () => {
    expect(NamespaceSchema.safeParse('unknown').success).toBe(false);
  });
});

describe('TokenIdSchema', () => {
  it.each([
    'color.primary.500',
    'spacing.lg',
    'typography-composite.body.lg',
    'motion.duration.fast',
  ])('accepts %s', (id) => {
    expect(TokenIdSchema.safeParse(id).success).toBe(true);
  });

  it.each(['NoNamespace', 'color', 'color.', '.color.500', 'color..500', 'Color.Primary.500'])(
    'rejects %s',
    (id) => {
      expect(TokenIdSchema.safeParse(id).success).toBe(false);
    },
  );
});

describe('TokenValueSchema discriminated union', () => {
  it('parses a color value', () => {
    const parsed = ColorValueSchema.parse({ kind: 'color', l: 0.5, c: 0.2, h: 180 });
    expect(parsed.kind).toBe('color');
  });

  it('parses a number value with unit', () => {
    expect(NumberValueSchema.parse({ kind: 'number', value: 16, unit: 'px' })).toBeDefined();
  });

  it('parses a string value', () => {
    expect(StringValueSchema.parse({ kind: 'string', value: 'sans-serif' })).toBeDefined();
  });

  it('parses a reference value', () => {
    expect(
      ReferenceValueSchema.parse({ kind: 'reference', ref: 'color.primary.500' }),
    ).toBeDefined();
  });

  it('parses a composite value with scalar fields', () => {
    const parsed = CompositeValueSchema.parse({
      kind: 'composite',
      fields: {
        fontSize: { kind: 'number', value: 16, unit: 'px' },
        fontFamily: { kind: 'string', value: 'Inter' },
      },
    });
    expect(parsed.fields.fontSize?.kind).toBe('number');
  });

  it('routes via discriminator', () => {
    const value = TokenValueSchema.parse({ kind: 'number', value: 4, unit: 'rem' });
    expect(value.kind).toBe('number');
  });

  it('rejects unknown kinds', () => {
    expect(TokenValueSchema.safeParse({ kind: 'magic', value: 'nope' }).success).toBe(false);
  });
});

describe('TokenSchema', () => {
  it('parses a root token with default dependsOn and metadata', () => {
    const parsed = TokenSchema.parse({
      id: 'color.primary.500',
      namespace: 'color',
      value: { kind: 'color', l: 0.5, c: 0.2, h: 180 },
      source: 'default',
    });
    expect(parsed.dependsOn).toEqual([]);
    expect(parsed.metadata).toEqual({});
  });

  it('parses a derived token with dependsOn edges', () => {
    const parsed = TokenSchema.parse({
      id: 'semantic.primary.hover',
      namespace: 'semantic',
      value: { kind: 'reference', ref: 'color.primary.600' },
      dependsOn: [{ source: 'color.primary.500', plugin: 'state-hover', args: {} }],
      source: 'plugin',
    });
    expect(parsed.dependsOn).toHaveLength(1);
  });
});

describe('TokenDependencySchema', () => {
  it('defaults args to {}', () => {
    const parsed = TokenDependencySchema.parse({ source: 'color.primary.500', plugin: 'scale' });
    expect(parsed.args).toEqual({});
  });
});

describe('UserOverrideSchema', () => {
  it('requires an iso timestamp', () => {
    expect(
      UserOverrideSchema.safeParse({
        tokenId: 'color.primary.500',
        value: { kind: 'string', value: '#fff' },
        author: 'sean',
        timestamp: 'yesterday',
      }).success,
    ).toBe(false);
  });

  it('accepts a well-formed override', () => {
    expect(
      UserOverrideSchema.parse({
        tokenId: 'color.primary.500',
        value: { kind: 'color', l: 0.6, c: 0.1, h: 200 },
        author: 'sean',
        timestamp: '2026-05-10T20:00:00.000Z',
      }),
    ).toBeDefined();
  });
});

describe('PluginManifestSchema', () => {
  it('parses a derive plugin manifest', () => {
    expect(
      PluginManifestSchema.parse({
        id: 'state-hover',
        kind: 'derive',
        version: '1.0.0',
        inputSchema: { type: 'object' },
        outputSchema: { type: 'object' },
        description: 'Derive hover state from a color value.',
      }),
    ).toBeDefined();
  });

  it('rejects plugin ids with dots', () => {
    expect(
      PluginManifestSchema.safeParse({
        id: 'state.hover',
        kind: 'derive',
        version: '1.0.0',
        inputSchema: {},
        outputSchema: {},
        description: 'x',
      }).success,
    ).toBe(false);
  });
});

describe('TokenSetManifestSchema', () => {
  it('parses an empty set with defaults', () => {
    const parsed = TokenSetManifestSchema.parse({
      version: '2',
      id: 'test',
      name: 'Test Set',
      tokens: [],
    });
    expect(parsed.depends).toEqual([]);
    expect(parsed.plugins).toEqual([]);
    expect(parsed.overrides).toEqual([]);
  });

  it('rejects non-v2 versions', () => {
    expect(
      TokenSetManifestSchema.safeParse({
        version: '1',
        id: 'old',
        name: 'Old',
        tokens: [],
      }).success,
    ).toBe(false);
  });
});
