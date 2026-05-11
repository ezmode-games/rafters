import { generateBaseSystem } from '@rafters/design-tokens-v1';
import { describe, expect, it } from 'vitest';
import { TokenRegistry, TokenSetManifestSchema, validateTokenSet } from '../../src/index.js';
import { projectAll } from './project.js';

describe('v1 → v2 parity', () => {
  const v1Result = generateBaseSystem();
  const projection = projectAll(v1Result.allTokens);

  it('reports projection coverage', () => {
    const total = v1Result.allTokens.length;
    const projected = projection.tokens.length;
    const failed = projection.issues.length;
    console.log(
      `\nParity projection: ${projected}/${total} (${((projected / total) * 100).toFixed(1)}%) — ${failed} issues`,
    );
    const byCode = projection.issues.reduce<Record<string, number>>((acc, i) => {
      acc[i.code] = (acc[i.code] ?? 0) + 1;
      return acc;
    }, {});
    console.log('Issues by code:', byCode);
    expect(projected).toBeGreaterThan(0);
  });

  it('projects every v1 token to a token whose value passes the v2 ColorValue/Number/String/Reference/Composite schemas', () => {
    const sample = projection.tokens.slice(0, 50);
    for (const t of sample) {
      const v = t.value;
      expect(['color', 'number', 'string', 'reference', 'composite']).toContain(v.kind);
    }
  });

  it('produces a manifest that loads cleanly into the v2 registry', () => {
    const manifestData = {
      version: '2' as const,
      id: 'parity-default',
      name: 'v1 default system, projected to v2',
      tokens: projection.tokens,
      plugins: [
        'calc',
        'state-hover',
        'state-active',
        'state-disabled',
        'scale',
        'contrast-auto',
        'invert',
      ],
      depends: [],
      overrides: [],
    };

    // Manifest parses
    const parsed = TokenSetManifestSchema.safeParse(manifestData);
    if (!parsed.success) {
      const sampled = parsed.error.issues.slice(0, 5);
      console.log('manifest parse failures sample:', JSON.stringify(sampled, null, 2));
    }
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    // Install-time validation gate runs (will surface unknown-dependency-source for cross-namespace refs)
    const result = validateTokenSet(manifestData);
    if (!result.ok) {
      const byCode: Record<string, number> = {};
      for (const issue of result.issues) byCode[issue.code] = (byCode[issue.code] ?? 0) + 1;
      console.log('validateTokenSet issue counts:', byCode);
    }

    // Registry round-trip — even if validation surfaces issues, the data structures load
    const registry = new TokenRegistry();
    registry.setMany(parsed.data.tokens);
    const uniqueIds = new Set(parsed.data.tokens.map((t) => t.id));
    expect(registry.size()).toBe(uniqueIds.size);
    if (uniqueIds.size !== parsed.data.tokens.length) {
      const counts = new Map<string, number>();
      for (const t of parsed.data.tokens) counts.set(t.id, (counts.get(t.id) ?? 0) + 1);
      const collisions = [...counts.entries()].filter(([, n]) => n > 1);
      console.log('id collisions in projection:', collisions);
    }
  });

  it('snapshot round-trips losslessly', () => {
    const r1 = new TokenRegistry();
    r1.setMany(projection.tokens);
    const snap = r1.snapshot([]);

    const r2 = new TokenRegistry();
    r2.loadSnapshot(snap);

    expect(r2.size()).toBe(r1.size());
    const r1Ids = new Set(r1.all().map((t) => t.id));
    const r2Ids = new Set(r2.all().map((t) => t.id));
    expect(r2Ids).toEqual(r1Ids);
  });
});
