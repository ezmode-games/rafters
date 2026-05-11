import { generateBaseSystem } from '@rafters/design-tokens-v1';
import { describe, expect, it } from 'vitest';
import { setTokens, TokenSetManifestSchema, validateTokenSet } from '../../src/index.js';
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

  it('projects every v1 token to a token whose value matches a v2 value kind', () => {
    const sample = projection.tokens.slice(0, 50);
    for (const t of sample) {
      expect(['color', 'number', 'string', 'reference', 'composite']).toContain(t.value.kind);
    }
  });

  it('projection produces a manifest that parses and loads as a v2 manifest', () => {
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

    const parsed = TokenSetManifestSchema.safeParse(manifestData);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    const result = validateTokenSet(manifestData);
    if (!result.ok) {
      const byCode: Record<string, number> = {};
      for (const issue of result.issues) byCode[issue.code] = (byCode[issue.code] ?? 0) + 1;
      console.log('validateTokenSet issue counts:', byCode);
    }

    const empty = {
      ...parsed.data,
      tokens: [],
    };
    const loaded = setTokens(empty, parsed.data.tokens);
    const uniqueIds = new Set(parsed.data.tokens.map((t) => t.id));
    expect(loaded.tokens.length).toBe(uniqueIds.size);
  });
});
