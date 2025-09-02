import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanCommand } from '../../src/commands/clean.js';

// Mock all external dependencies
vi.mock('node:fs');
vi.mock('node:path');
vi.mock('fs-extra', () => ({
  default: {
    removeSync: vi.fn(),
  },
  removeSync: vi.fn(),
}));
vi.mock('inquirer');
vi.mock('ora');

const mockExistsSync = vi.mocked(existsSync);
const mockJoin = vi.mocked(join);

describe('cleanCommand', () => {
  const mockSpinner = {
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn().mockReturnThis(),
    fail: vi.fn().mockReturnThis(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(process, 'cwd').mockReturnValue('/test/project');
    vi.spyOn(process, 'exit').mockImplementation((code) => {
      throw new Error(`process.exit(${code})`);
    });
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});

    // Setup default mocks
    mockJoin.mockImplementation((...paths) => paths.join('/'));
  });

  it('should exit early if .rafters directory does not exist', async () => {
    mockExistsSync.mockReturnValue(false);

    await cleanCommand({});

    expect(console.log).toHaveBeenCalledWith('No .rafters directory found. Nothing to clean.');
    expect(mockExistsSync).toHaveBeenCalledWith('/test/project/.rafters');
  });

  it('should prompt for confirmation when force is not specified', async () => {
    mockExistsSync.mockReturnValue(true);

    const { default: inquirer } = await import('inquirer');
    const { default: ora } = await import('ora');
    const { default: fsExtra } = await import('fs-extra');

    vi.mocked(inquirer.prompt).mockResolvedValue({ shouldClean: true });
    vi.mocked(ora).mockReturnValue(mockSpinner as ReturnType<typeof ora>);
    vi.mocked(fsExtra.removeSync).mockImplementation(() => {});

    await cleanCommand({});

    expect(inquirer.prompt).toHaveBeenCalledWith([
      {
        type: 'confirm',
        name: 'shouldClean',
        message: 'This will remove the entire .rafters directory and all configuration. Continue?',
        default: false,
      },
    ]);

    expect(fsExtra.removeSync).toHaveBeenCalledWith('/test/project/.rafters');
    expect(mockSpinner.succeed).toHaveBeenCalledWith('Rafters configuration cleaned successfully');
  });

  it('should cancel clean when user declines confirmation', async () => {
    mockExistsSync.mockReturnValue(true);

    const { default: inquirer } = await import('inquirer');
    const { default: fsExtra } = await import('fs-extra');

    vi.mocked(inquirer.prompt).mockResolvedValue({ shouldClean: false });

    await cleanCommand({});

    expect(console.log).toHaveBeenCalledWith('Clean cancelled.');

    // Should not attempt to remove anything
    expect(fsExtra.removeSync).not.toHaveBeenCalled();
  });

  it('should skip confirmation when force flag is true', async () => {
    mockExistsSync.mockReturnValue(true);

    const { default: ora } = await import('ora');
    const { default: fsExtra } = await import('fs-extra');

    vi.mocked(ora).mockReturnValue(mockSpinner as ReturnType<typeof ora>);
    vi.mocked(fsExtra.removeSync).mockImplementation(() => {});

    await cleanCommand({ force: true });

    // Should not prompt for confirmation
    const { default: inquirer } = await import('inquirer');
    expect(inquirer.prompt).not.toHaveBeenCalled();

    expect(fsExtra.removeSync).toHaveBeenCalledWith('/test/project/.rafters');
    expect(mockSpinner.succeed).toHaveBeenCalledWith('Rafters configuration cleaned successfully');
  });

  it('should display success messages and guidance', async () => {
    mockExistsSync.mockReturnValue(true);

    const { default: ora } = await import('ora');
    const { default: fsExtra } = await import('fs-extra');

    vi.mocked(ora).mockReturnValue(mockSpinner as ReturnType<typeof ora>);
    vi.mocked(fsExtra.removeSync).mockImplementation(() => {});

    await cleanCommand({ force: true });

    expect(console.log).toHaveBeenCalledWith('Removed:');
    expect(console.log).toHaveBeenCalledWith('  • .rafters/ directory');
    expect(console.log).toHaveBeenCalledWith('  • All token files');
    expect(console.log).toHaveBeenCalledWith('  • Component manifest');
    expect(console.log).toHaveBeenCalledWith('  • Configuration files');
    expect(console.log).toHaveBeenCalledWith('Run "rafters init" to reinitialize Rafters.');
  });

  it('should handle file removal errors', async () => {
    mockExistsSync.mockReturnValue(true);

    const { default: ora } = await import('ora');
    const { default: fsExtra } = await import('fs-extra');

    vi.mocked(ora).mockReturnValue(mockSpinner as ReturnType<typeof ora>);
    vi.mocked(fsExtra.removeSync).mockImplementation(() => {
      throw new Error('Permission denied');
    });

    await expect(cleanCommand({ force: true })).rejects.toThrow('process.exit(1)');

    expect(mockSpinner.fail).toHaveBeenCalledWith('Failed to clean Rafters configuration');
    expect(console.error).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should use correct path resolution', async () => {
    mockExistsSync.mockReturnValue(true);
    mockJoin.mockReturnValue('/custom/project/.rafters');

    const { default: ora } = await import('ora');
    const { default: fsExtra } = await import('fs-extra');

    vi.mocked(ora).mockReturnValue(mockSpinner as ReturnType<typeof ora>);
    vi.mocked(fsExtra.removeSync).mockImplementation(() => {});

    // Mock different cwd
    vi.spyOn(process, 'cwd').mockReturnValue('/custom/project');

    await cleanCommand({ force: true });

    expect(mockJoin).toHaveBeenCalledWith('/custom/project', '.rafters');
    expect(mockExistsSync).toHaveBeenCalledWith('/custom/project/.rafters');
    expect(fsExtra.removeSync).toHaveBeenCalledWith('/custom/project/.rafters');
  });

  it('should handle inquirer prompt errors', async () => {
    mockExistsSync.mockReturnValue(true);

    const { default: inquirer } = await import('inquirer');

    vi.mocked(inquirer.prompt).mockRejectedValue(new Error('Prompt failed'));

    await expect(cleanCommand({})).rejects.toThrow('Prompt failed');
  });
});
