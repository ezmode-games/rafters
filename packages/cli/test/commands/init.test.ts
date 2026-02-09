import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ensureTailwindCli, isTailwindCliInstalled } from '../../src/commands/init.js';

vi.mock('@inquirer/prompts', () => ({
  checkbox: vi.fn(),
  confirm: vi.fn(),
}));

vi.mock('../../src/utils/update-dependencies.js', () => ({
  updateDependencies: vi.fn().mockResolvedValue(undefined),
}));

describe('isTailwindCliInstalled', () => {
  it('returns a boolean without throwing', () => {
    const result = isTailwindCliInstalled();
    expect(typeof result).toBe('boolean');
  });
});

describe('ensureTailwindCli', () => {
  let savedStdinTTY: boolean | undefined;
  let savedStdoutTTY: boolean | undefined;

  beforeEach(() => {
    savedStdinTTY = process.stdin.isTTY;
    savedStdoutTTY = process.stdout.isTTY;
  });

  afterEach(() => {
    process.stdin.isTTY = savedStdinTTY as boolean;
    process.stdout.isTTY = savedStdoutTTY as boolean;
  });

  function setTTY(interactive: boolean): void {
    const value = interactive ? true : (undefined as unknown as boolean);
    process.stdin.isTTY = value;
    process.stdout.isTTY = value;
  }

  it('throws in non-interactive mode', async () => {
    setTTY(false);

    await expect(ensureTailwindCli(process.cwd())).rejects.toThrow(
      'Standalone CSS export requires @tailwindcss/cli',
    );
  });

  it('throws when user declines install', async () => {
    setTTY(true);
    const { confirm } = await import('@inquirer/prompts');
    vi.mocked(confirm).mockResolvedValue(false);

    await expect(ensureTailwindCli(process.cwd())).rejects.toThrow(
      'Standalone CSS export requires @tailwindcss/cli',
    );
  });

  it('calls updateDependencies when user confirms install', async () => {
    setTTY(true);
    const { confirm } = await import('@inquirer/prompts');
    vi.mocked(confirm).mockResolvedValue(true);
    const { updateDependencies } = await import('../../src/utils/update-dependencies.js');

    // Will throw because @tailwindcss/cli won't actually be resolvable after
    // the mocked install, but we can verify updateDependencies was called
    try {
      await ensureTailwindCli(process.cwd());
    } catch {
      // Expected: post-install verification fails in test environment
    }

    expect(updateDependencies).toHaveBeenCalledWith([], ['@tailwindcss/cli'], {
      cwd: process.cwd(),
    });
  });
});
