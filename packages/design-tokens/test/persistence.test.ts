import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Token } from '@rafters/shared';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  findTokenFile,
  loadRegistryFromDir,
  type NamespaceFile,
  saveRegistryToDir,
  TokenRegistry,
} from '../src/index.js';

const TEST_TMP_ROOT = join(import.meta.dirname, '..', 'node_modules', '.test-tmp');

let tmpDir: string;

beforeEach(() => {
  mkdirSync(TEST_TMP_ROOT, { recursive: true });
  tmpDir = mkdtempSync(join(TEST_TMP_ROOT, 'persistence-'));
});

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

const colorFile: NamespaceFile = {
  namespace: 'color',
  tokens: [
    {
      name: 'color-accent',
      namespace: 'color',
      category: 'color',
      value: '#3a8cff',
      userOverride: null,
    },
  ],
};

const spacingFile: NamespaceFile = {
  namespace: 'spacing',
  tokens: [
    {
      name: 'spacing-base',
      namespace: 'spacing',
      category: 'spacing',
      value: '4px',
      userOverride: null,
    },
  ],
};

describe('loadRegistryFromDir', () => {
  it('loads tokens from all *.rafters.json files in a directory', () => {
    writeFileSync(join(tmpDir, 'color.rafters.json'), JSON.stringify(colorFile));
    writeFileSync(join(tmpDir, 'spacing.rafters.json'), JSON.stringify(spacingFile));
    const r = loadRegistryFromDir(tmpDir);
    expect(r.size()).toBe(2);
    expect(r.get('color-accent')?.value).toBe('#3a8cff');
    expect(r.get('spacing-base')?.value).toBe('4px');
  });

  it('skips non-rafters.json files', () => {
    writeFileSync(join(tmpDir, 'color.rafters.json'), JSON.stringify(colorFile));
    writeFileSync(join(tmpDir, 'config.json'), '{}');
    const r = loadRegistryFromDir(tmpDir);
    expect(r.size()).toBe(1);
  });

  it('skips a file with no tokens array (just reads what it can)', () => {
    writeFileSync(join(tmpDir, 'broken.rafters.json'), '{"not": "valid"}');
    const r = loadRegistryFromDir(tmpDir);
    expect(r.size()).toBe(0);
  });

  it('loads tokens with arbitrary extra metadata (description, generatedAt) without rejecting them', () => {
    const fileWithExtras = {
      namespace: 'spacing',
      tokens: [
        {
          name: 'spacing-base',
          namespace: 'spacing',
          category: 'spacing',
          value: '4px',
          userOverride: null,
          description: 'arbitrary metadata',
          generatedAt: '2026-01-01T00:00:00Z',
          someUnknownField: { nested: true },
        },
      ],
    };
    writeFileSync(join(tmpDir, 'spacing.rafters.json'), JSON.stringify(fileWithExtras));
    const r = loadRegistryFromDir(tmpDir);
    expect(r.get('spacing-base')?.value).toBe('4px');
  });

  it('throws TokenParseError when a token entry does not satisfy TokenSchema', () => {
    const messyFile = {
      namespace: 'mixed',
      tokens: [{ name: 'incomplete' }], // missing namespace, category, value, userOverride
    };
    writeFileSync(join(tmpDir, 'mixed.rafters.json'), JSON.stringify(messyFile));
    expect(() => loadRegistryFromDir(tmpDir)).toThrow(/TokenSchema validation/);
  });
});

describe('saveRegistryToDir', () => {
  it('writes one file per namespace', () => {
    const r = new TokenRegistry([colorFile.tokens[0] as Token, spacingFile.tokens[0] as Token]);
    saveRegistryToDir(tmpDir, r);
    const colorRoundTrip = JSON.parse(readFileSync(join(tmpDir, 'color.rafters.json'), 'utf8'));
    expect(colorRoundTrip.namespace).toBe('color');
    expect(colorRoundTrip.tokens[0].name).toBe('color-accent');
    const spacingRoundTrip = JSON.parse(readFileSync(join(tmpDir, 'spacing.rafters.json'), 'utf8'));
    expect(spacingRoundTrip.namespace).toBe('spacing');
  });

  it('round-trips tokens through save+load preserving values', () => {
    const r = new TokenRegistry([colorFile.tokens[0] as Token]);
    r.set('color-accent', '#ff0000');
    saveRegistryToDir(tmpDir, r);
    const reloaded = loadRegistryFromDir(tmpDir);
    expect(reloaded.get('color-accent')?.value).toBe('#ff0000');
  });

  it('round-trips userOverride records', () => {
    const r = new TokenRegistry([colorFile.tokens[0] as Token]);
    r.set('color-accent', '#ff0000', { cascade: false, reason: 'Q1 brand campaign' });
    saveRegistryToDir(tmpDir, r);
    const reloaded = loadRegistryFromDir(tmpDir);
    expect(reloaded.get('color-accent')?.userOverride?.reason).toBe('Q1 brand campaign');
  });
});

describe('findTokenFile', () => {
  it('returns the file path containing the token', () => {
    writeFileSync(join(tmpDir, 'color.rafters.json'), JSON.stringify(colorFile));
    writeFileSync(join(tmpDir, 'spacing.rafters.json'), JSON.stringify(spacingFile));
    expect(findTokenFile(tmpDir, 'color-accent')).toBe(join(tmpDir, 'color.rafters.json'));
    expect(findTokenFile(tmpDir, 'spacing-base')).toBe(join(tmpDir, 'spacing.rafters.json'));
  });

  it('returns undefined for unknown token', () => {
    writeFileSync(join(tmpDir, 'color.rafters.json'), JSON.stringify(colorFile));
    expect(findTokenFile(tmpDir, 'nonexistent')).toBeUndefined();
  });
});
