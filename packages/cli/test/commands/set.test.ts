import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { set } from '../../src/commands/set.js';

vi.mock('@inquirer/prompts', () => ({
  input: vi.fn(),
}));

let tmpDir: string;

beforeEach(() => {
  tmpDir = mkdtempSync(join(tmpdir(), 'rafters-cli-set-'));
  writeFileSync(
    join(tmpDir, 'spacing.rafters.json'),
    JSON.stringify({
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
    }),
  );
});

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

function readNamespace(name: string): { tokens: Array<Record<string, unknown>> } {
  return JSON.parse(readFileSync(join(tmpDir, `${name}.rafters.json`), 'utf8'));
}

describe('set command', () => {
  it('updates a leaf token value with cascade (default)', async () => {
    await set('spacing-base', '8px', { raftersDir: tmpDir, agent: true });
    const file = readNamespace('spacing');
    const token = file.tokens.find((t) => t.name === 'spacing-base');
    expect(token?.value).toBe('8px');
    expect(token?.userOverride).toBeNull();
  });

  it('records userOverride when --no-cascade with --reason', async () => {
    await set('spacing-base', '20px', {
      noCascade: true,
      reason: 'Q1 brand campaign',
      raftersDir: tmpDir,
      agent: true,
    });
    const file = readNamespace('spacing');
    const token = file.tokens.find((t) => t.name === 'spacing-base');
    expect(token?.value).toBe('20px');
    expect(token?.userOverride).toMatchObject({
      reason: 'Q1 brand campaign',
      previousValue: '4px',
    });
  });

  it('throws in agent mode when --no-cascade missing --reason', async () => {
    await expect(
      set('spacing-base', '20px', { noCascade: true, raftersDir: tmpDir, agent: true }),
    ).rejects.toThrow(/--no-cascade requires --reason/);
  });

  it('throws when token does not exist', async () => {
    await expect(set('does-not-exist', '4px', { raftersDir: tmpDir, agent: true })).rejects.toThrow(
      /not found/,
    );
  });

  it('throws when tokens directory does not exist', async () => {
    await expect(
      set('spacing-base', '4px', { raftersDir: '/nonexistent/path', agent: true }),
    ).rejects.toThrow(/tokens directory not found/);
  });

  it('parses JSON values for ColorReference', async () => {
    writeFileSync(
      join(tmpDir, 'color.rafters.json'),
      JSON.stringify({
        namespace: 'color',
        tokens: [
          {
            name: 'color-primary',
            namespace: 'color',
            category: 'color',
            value: { family: 'accent', position: '500' },
            userOverride: null,
          },
        ],
      }),
    );
    await set('color-primary', '{"family":"warning","position":"700"}', {
      raftersDir: tmpDir,
      agent: true,
    });
    const file = readNamespace('color');
    const token = file.tokens.find((t) => t.name === 'color-primary');
    expect(token?.value).toEqual({ family: 'warning', position: '700' });
  });
});
