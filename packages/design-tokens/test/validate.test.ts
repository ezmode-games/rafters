import { describe, expect, it } from 'vitest';
import type { TokenSetManifest } from '../src/schemas/index.js';
import { validateTokenSet } from '../src/validation/index.js';

const minimalToken = (overrides: Partial<{ id: string; namespace: string }> = {}): unknown => ({
  id: overrides.id ?? 'color.primary.500',
  namespace: overrides.namespace ?? 'color',
  value: { kind: 'color', l: 0.5, c: 0.2, h: 180 },
  source: 'default',
});

const baseManifest = (
  tokens: unknown[] = [],
  extras: Partial<{ plugins: string[]; depends: string[] }> = {},
): unknown => ({
  version: '2',
  id: 'test',
  name: 'Test',
  tokens,
  plugins: extras.plugins ?? [],
  depends: extras.depends ?? [],
});

describe('validateTokenSet', () => {
  it('returns ok for a minimal valid manifest', () => {
    const result = validateTokenSet(baseManifest([minimalToken()]));
    expect(result.ok).toBe(true);
    if (result.ok) {
      const manifest: TokenSetManifest = result.manifest;
      expect(manifest.tokens).toHaveLength(1);
    }
  });

  it('reports schema violations when the input is malformed', () => {
    const result = validateTokenSet({ version: '1', id: 'x', name: 'x', tokens: [] });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.some((i) => i.code === 'schema-violation')).toBe(true);
    }
  });

  it('flags id collisions', () => {
    const result = validateTokenSet(baseManifest([minimalToken(), minimalToken()]));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      const collision = result.issues.find((i) => i.code === 'id-collision');
      expect(collision).toMatchObject({
        code: 'id-collision',
        tokenId: 'color.primary.500',
        count: 2,
      });
    }
  });

  it('flags namespace mismatch when id prefix does not match declared namespace', () => {
    const result = validateTokenSet(
      baseManifest([{ ...(minimalToken() as object), namespace: 'spacing' }]),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.some((i) => i.code === 'namespace-mismatch')).toBe(true);
    }
  });

  it('flags unknown dependency source', () => {
    const result = validateTokenSet(
      baseManifest(
        [
          {
            ...(minimalToken() as object),
            id: 'semantic.primary.hover',
            namespace: 'semantic',
            dependsOn: [{ source: 'color.does-not-exist', plugin: 'state-hover', args: {} }],
            source: 'plugin',
          },
        ],
        { plugins: ['state-hover'] },
      ),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.some((i) => i.code === 'unknown-dependency-source')).toBe(true);
    }
  });

  it('flags unknown dependency plugin', () => {
    const result = validateTokenSet(
      baseManifest([
        minimalToken(),
        {
          ...(minimalToken() as object),
          id: 'color.primary.hover',
          dependsOn: [{ source: 'color.primary.500', plugin: 'mystery', args: {} }],
          source: 'plugin',
        },
      ]),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.some((i) => i.code === 'unknown-dependency-plugin')).toBe(true);
    }
  });

  it('resolves external token ids via context', () => {
    const result = validateTokenSet(
      baseManifest(
        [
          {
            ...(minimalToken() as object),
            id: 'semantic.primary.hover',
            namespace: 'semantic',
            dependsOn: [{ source: 'color.primary.500', plugin: 'state-hover', args: {} }],
            source: 'plugin',
          },
        ],
        { plugins: ['state-hover'] },
      ),
      { externalTokenIds: ['color.primary.500'] },
    );
    expect(result.ok).toBe(true);
  });

  it('resolves plugin ids via knownPluginIds context', () => {
    const result = validateTokenSet(
      baseManifest([
        minimalToken(),
        {
          ...(minimalToken() as object),
          id: 'color.primary.hover',
          dependsOn: [{ source: 'color.primary.500', plugin: 'global-plugin', args: {} }],
          source: 'plugin',
        },
      ]),
      { knownPluginIds: ['global-plugin'] },
    );
    expect(result.ok).toBe(true);
  });

  it('detects two-node cycles', () => {
    const result = validateTokenSet(
      baseManifest(
        [
          {
            ...(minimalToken() as object),
            id: 'color.a.500',
            dependsOn: [{ source: 'color.b.500', plugin: 'p', args: {} }],
            source: 'plugin',
          },
          {
            ...(minimalToken() as object),
            id: 'color.b.500',
            dependsOn: [{ source: 'color.a.500', plugin: 'p', args: {} }],
            source: 'plugin',
          },
        ],
        { plugins: ['p'] },
      ),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      const cycles = result.issues.filter((i) => i.code === 'cycle');
      expect(cycles).toHaveLength(1);
    }
  });

  it('detects longer cycles', () => {
    const result = validateTokenSet(
      baseManifest(
        [
          {
            ...(minimalToken() as object),
            id: 'color.a.500',
            dependsOn: [{ source: 'color.b.500', plugin: 'p', args: {} }],
            source: 'plugin',
          },
          {
            ...(minimalToken() as object),
            id: 'color.b.500',
            dependsOn: [{ source: 'color.c.500', plugin: 'p', args: {} }],
            source: 'plugin',
          },
          {
            ...(minimalToken() as object),
            id: 'color.c.500',
            dependsOn: [{ source: 'color.a.500', plugin: 'p', args: {} }],
            source: 'plugin',
          },
        ],
        { plugins: ['p'] },
      ),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      const cycles = result.issues.filter((i) => i.code === 'cycle');
      expect(cycles).toHaveLength(1);
    }
  });

  it('passes a valid DAG of derived tokens', () => {
    const result = validateTokenSet(
      baseManifest(
        [
          minimalToken(),
          {
            ...(minimalToken() as object),
            id: 'color.primary.hover',
            dependsOn: [{ source: 'color.primary.500', plugin: 'state-hover', args: {} }],
            source: 'plugin',
          },
          {
            ...(minimalToken() as object),
            id: 'semantic.primary.hover',
            namespace: 'semantic',
            dependsOn: [{ source: 'color.primary.hover', plugin: 'alias', args: {} }],
            source: 'plugin',
          },
        ],
        { plugins: ['state-hover', 'alias'] },
      ),
    );
    expect(result.ok).toBe(true);
  });
});
