import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Command } from 'commander';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { set } from '../../src/commands/set.js';

vi.mock('@inquirer/prompts', () => ({
  input: vi.fn(),
}));

const TEST_TMP_ROOT = join(import.meta.dirname, '..', '..', 'node_modules', '.test-tmp');

let tmpDir: string;

beforeEach(() => {
  mkdirSync(TEST_TMP_ROOT, { recursive: true });
  tmpDir = mkdtempSync(join(TEST_TMP_ROOT, 'cli-set-'));
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
  it('updates a leaf token value and records userOverride', async () => {
    await set('spacing-base', '8px', {
      reason: 'designer choice',
      raftersDir: tmpDir,
      agent: true,
    });
    const file = readNamespace('spacing');
    const token = file.tokens.find((t) => t.name === 'spacing-base');
    expect(token?.value).toBe('8px');
    expect(token?.userOverride).toMatchObject({
      reason: 'designer choice',
      previousValue: '4px',
    });
  });

  it('throws in agent mode when reason is missing', async () => {
    await expect(set('spacing-base', '20px', { raftersDir: tmpDir, agent: true })).rejects.toThrow(
      /requires --reason in agent mode/,
    );
  });

  it('integration: --reason flag through Commander wires through to userOverride', async () => {
    const program = new Command()
      .exitOverride()
      .name('set')
      .argument('<name>')
      .argument('<value>')
      .option('--reason <text>')
      .option('--rafters-dir <path>')
      .option('--agent')
      .action(async (name: string, value: string, options) => {
        await set(name, value, options);
      });
    await program.parseAsync(
      ['spacing-base', '12px', '--reason', 'flag round-trip', '--rafters-dir', tmpDir, '--agent'],
      { from: 'user' },
    );
    const file = readNamespace('spacing');
    const token = file.tokens.find((t) => t.name === 'spacing-base');
    expect(token?.value).toBe('12px');
    expect(token?.userOverride).toMatchObject({
      reason: 'flag round-trip',
      previousValue: '4px',
    });
  });

  it('throws when token does not exist', async () => {
    await expect(
      set('does-not-exist', '4px', { reason: 'test', raftersDir: tmpDir, agent: true }),
    ).rejects.toThrow(/not found/);
  });

  it('throws when tokens directory does not exist', async () => {
    await expect(
      set('spacing-base', '4px', {
        reason: 'test',
        raftersDir: '/nonexistent/path',
        agent: true,
      }),
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
      reason: 'remap to warning',
      raftersDir: tmpDir,
      agent: true,
    });
    const file = readNamespace('color');
    const token = file.tokens.find((t) => t.name === 'color-primary');
    expect(token?.value).toEqual({ family: 'warning', position: '700' });
  });
});
