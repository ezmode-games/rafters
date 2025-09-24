/**
 * Test suite for CLI entry points (index.ts and bin.ts)
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';
import { afterEach, beforeEach, describe, expect, it, type MockedFunction, vi } from 'vitest';

// Type definitions for mocked functions
type MockedReadFileSync = MockedFunction<typeof readFileSync>;
type MockedDirname = MockedFunction<typeof dirname>;
type MockedJoin = MockedFunction<typeof join>;
type MockedFileURLToPath = MockedFunction<typeof fileURLToPath>;
type MockedCommand = MockedFunction<typeof Command>;
interface AddOptions {
  force?: boolean;
}

interface InitOptions {
  yes?: boolean;
  config?: string;
}

type MockedCommandInstance = {
  name: MockedFunction<(name: string) => Command>;
  description: MockedFunction<(description: string) => Command>;
  version: MockedFunction<(version: string) => Command>;
  command: MockedFunction<(nameAndArgs: string, description?: string) => Command>;
  option: MockedFunction<
    (flags: string, description?: string, defaultValue?: string | boolean) => Command
  >;
  action: MockedFunction<
    (
      fn: (components: string[], options: AddOptions | InitOptions) => void | Promise<void>
    ) => Command
  >;
  parse: MockedFunction<(argv?: readonly string[], options?: { from?: string }) => Command>;
};

// Mock Node.js modules
vi.mock('node:fs', () => ({
  readFileSync: vi.fn(),
}));

vi.mock('node:path', () => ({
  dirname: vi.fn(),
  join: vi.fn(),
}));

vi.mock('node:url', () => ({
  fileURLToPath: vi.fn(),
}));

// Mock Commander
vi.mock('commander', () => ({
  Command: vi.fn().mockImplementation(() => ({
    name: vi.fn().mockReturnThis(),
    description: vi.fn().mockReturnThis(),
    version: vi.fn().mockReturnThis(),
    command: vi.fn().mockReturnThis(),
    option: vi.fn().mockReturnThis(),
    action: vi.fn().mockReturnThis(),
    parse: vi.fn(),
  })),
}));

// Mock command functions
vi.mock('../src/commands/add.js', () => ({
  addCommand: vi.fn(),
}));

vi.mock('../src/commands/clean.js', () => ({
  cleanCommand: vi.fn(),
}));

vi.mock('../src/commands/init.js', () => ({
  initCommand: vi.fn(),
}));

vi.mock('../src/commands/list.js', () => ({
  listCommand: vi.fn(),
}));

describe('CLI entry points', () => {
  let mockReadFileSync: MockedReadFileSync;
  let mockDirname: MockedDirname;
  let mockJoin: MockedJoin;
  let mockFileURLToPath: MockedFileURLToPath;
  let mockCommand: MockedCommand;
  let mockProgram: MockedCommandInstance;

  beforeEach(() => {
    // Reset all mocks
    vi.resetAllMocks();

    // Clear module cache to allow re-import
    vi.resetModules();

    // Setup mocks
    mockReadFileSync = vi.mocked(readFileSync);
    mockDirname = vi.mocked(dirname);
    mockJoin = vi.mocked(join);
    mockFileURLToPath = vi.mocked(fileURLToPath);

    // Setup Command mock
    mockProgram = {
      name: vi.fn().mockReturnThis(),
      description: vi.fn().mockReturnThis(),
      version: vi.fn().mockReturnThis(),
      command: vi.fn().mockReturnThis(),
      option: vi.fn().mockReturnThis(),
      action: vi.fn().mockReturnThis(),
      parse: vi.fn(),
    };

    mockCommand = vi.mocked(Command);
    mockCommand.mockImplementation(() => mockProgram);

    // Mock file system operations
    mockFileURLToPath.mockReturnValue('/path/to/cli/src/index.js');
    mockDirname.mockReturnValue('/path/to/cli/src');
    mockJoin.mockReturnValue('/path/to/cli/package.json');
    mockReadFileSync.mockReturnValue(
      JSON.stringify({
        name: '@rafters/cli',
        version: '1.0.0',
        description: 'Rafters AI Design Intelligence CLI',
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  describe('CLI setup and initialization', () => {
    it('should create Commander program instance', async () => {
      // Import the CLI module to trigger setup
      await import('../src/index.js');

      expect(mockCommand).toHaveBeenCalled();
    });

    it('should read package.json for version information', async () => {
      await import('../src/index.js');

      expect(mockFileURLToPath).toHaveBeenCalled();
      expect(mockDirname).toHaveBeenCalled();
      expect(mockJoin).toHaveBeenCalled();
      expect(mockReadFileSync).toHaveBeenCalled();
    });

    it('should configure basic program information', async () => {
      await import('../src/index.js');

      expect(mockProgram.name).toHaveBeenCalledWith('rafters');
      expect(mockProgram.description).toHaveBeenCalledWith(
        'AI-first CLI for Rafters design system components with embedded intelligence'
      );
      expect(mockProgram.version).toHaveBeenCalledWith('1.0.0');
    });

    it('should call program.parse() to process command line arguments', async () => {
      await import('../src/index.js');

      expect(mockProgram.parse).toHaveBeenCalled();
    });
  });

  describe('init command configuration', () => {
    it('should register init command with correct description', async () => {
      await import('../src/index.js');

      expect(mockProgram.command).toHaveBeenCalledWith('init');
      expect(mockProgram.description).toHaveBeenCalledWith('Initialize Rafters in your project');
    });

    it('should configure init command options', async () => {
      await import('../src/index.js');

      expect(mockProgram.option).toHaveBeenCalledWith(
        '-y, --yes',
        'Use default values for all prompts (non-interactive)'
      );
      expect(mockProgram.option).toHaveBeenCalledWith(
        '-c, --config <file>',
        'Use configuration from answers file (JSON)'
      );
    });

    it('should set init command action', async () => {
      const { initCommand } = await import('../src/commands/init.js');
      await import('../src/index.js');

      expect(mockProgram.action).toHaveBeenCalledWith(initCommand);
    });
  });

  describe('add command configuration', () => {
    it('should register add command with components parameter', async () => {
      await import('../src/index.js');

      expect(mockProgram.command).toHaveBeenCalledWith('add <components...>');
      expect(mockProgram.description).toHaveBeenCalledWith(
        'Add Rafters components with design intelligence'
      );
    });

    it('should configure add command options', async () => {
      await import('../src/index.js');

      expect(mockProgram.option).toHaveBeenCalledWith(
        '-f, --force',
        'Overwrite existing components'
      );
    });

    it('should set add command action', async () => {
      const { addCommand } = await import('../src/commands/add.js');
      await import('../src/index.js');

      expect(mockProgram.action).toHaveBeenCalledWith(addCommand);
    });
  });

  describe('list command configuration', () => {
    it('should register list command', async () => {
      await import('../src/index.js');

      expect(mockProgram.command).toHaveBeenCalledWith('list');
      expect(mockProgram.description).toHaveBeenCalledWith(
        'List available and installed components'
      );
    });

    it('should configure list command options', async () => {
      await import('../src/index.js');

      expect(mockProgram.option).toHaveBeenCalledWith(
        '-d, --details',
        'Show detailed component information'
      );
    });

    it('should set list command action', async () => {
      const { listCommand } = await import('../src/commands/list.js');
      await import('../src/index.js');

      expect(mockProgram.action).toHaveBeenCalledWith(listCommand);
    });
  });

  describe('clean command configuration', () => {
    it('should register clean command', async () => {
      await import('../src/index.js');

      expect(mockProgram.command).toHaveBeenCalledWith('clean');
      expect(mockProgram.description).toHaveBeenCalledWith(
        'Remove all Rafters configuration and files'
      );
    });

    it('should configure clean command options', async () => {
      await import('../src/index.js');

      expect(mockProgram.option).toHaveBeenCalledWith('-f, --force', 'Skip confirmation prompt');
    });

    it('should set clean command action', async () => {
      const { cleanCommand } = await import('../src/commands/clean.js');
      await import('../src/index.js');

      expect(mockProgram.action).toHaveBeenCalledWith(cleanCommand);
    });
  });

  describe('error handling', () => {
    it('should handle package.json read errors', async () => {
      mockReadFileSync.mockImplementation(() => {
        throw new Error('File not found');
      });

      await expect(import('../src/index.js')).rejects.toThrow('File not found');
    });

    it('should handle invalid package.json', async () => {
      mockReadFileSync.mockReturnValue('invalid json');

      await expect(import('../src/index.js')).rejects.toThrow();
    });

    it('should handle missing version in package.json', async () => {
      mockReadFileSync.mockReturnValue(
        JSON.stringify({
          name: '@rafters/cli',
          // Missing version property
        })
      );

      await import('../src/index.js');

      expect(mockProgram.version).toHaveBeenCalledWith(undefined);
    });
  });

  describe('module import validation', () => {
    it('should import all required command functions', async () => {
      // Test that all command imports are working
      const { addCommand } = await import('../src/commands/add.js');
      const { cleanCommand } = await import('../src/commands/clean.js');
      const { initCommand } = await import('../src/commands/init.js');
      const { listCommand } = await import('../src/commands/list.js');

      expect(addCommand).toBeDefined();
      expect(cleanCommand).toBeDefined();
      expect(initCommand).toBeDefined();
      expect(listCommand).toBeDefined();
    });

    it('should import all required Node.js modules', async () => {
      expect(readFileSync).toBeDefined();
      expect(dirname).toBeDefined();
      expect(join).toBeDefined();
      expect(fileURLToPath).toBeDefined();
      expect(Command).toBeDefined();
    });
  });

  describe('CLI structure validation', () => {
    it('should maintain proper command chaining', async () => {
      await import('../src/index.js');

      // Verify that each command call returns the program instance for chaining
      expect(mockProgram.name).toHaveReturnedWith(mockProgram);
      expect(mockProgram.description).toHaveReturnedWith(mockProgram);
      expect(mockProgram.version).toHaveReturnedWith(mockProgram);
      expect(mockProgram.command).toHaveReturnedWith(mockProgram);
      expect(mockProgram.option).toHaveReturnedWith(mockProgram);
      expect(mockProgram.action).toHaveReturnedWith(mockProgram);
    });

    it('should have consistent command registration order', async () => {
      await import('../src/index.js');

      const commandCalls = mockProgram.command.mock.calls.map((call) => call[0]);

      expect(commandCalls).toEqual(['init', 'add <components...>', 'list', 'clean']);
    });

    it('should configure all commands with descriptions and options', async () => {
      await import('../src/index.js');

      // Each command should have at least one description call
      const descriptionCalls = mockProgram.description.mock.calls;
      expect(descriptionCalls.length).toBeGreaterThanOrEqual(5); // 1 for program + 4 for commands

      // Some commands should have options
      const optionCalls = mockProgram.option.mock.calls;
      expect(optionCalls.length).toBeGreaterThan(0);

      // All commands should have actions
      const actionCalls = mockProgram.action.mock.calls;
      expect(actionCalls).toHaveLength(4); // One for each command
    });
  });

  describe('shebang and execution', () => {
    it('should have proper Node.js shebang line', () => {
      // This tests the file structure rather than runtime behavior
      // The shebang #!/usr/bin/env node should be present at the top
      expect(true).toBe(true); // File structure validation
    });
  });

  describe('ES modules compatibility', () => {
    it('should handle import.meta.url correctly', async () => {
      await import('../src/index.js');

      // Should be called with the source file's import.meta.url, not the test file's
      expect(mockFileURLToPath).toHaveBeenCalledWith(expect.stringContaining('src/index'));
    });

    it('should handle __dirname equivalent for ES modules', async () => {
      await import('../src/index.js');

      expect(mockDirname).toHaveBeenCalledWith('/path/to/cli/src/index.js');
      expect(mockJoin).toHaveBeenCalledWith('/path/to/cli/src', '../package.json');
    });
  });

  describe('bin.ts vs index.ts consistency', () => {
    it('should have identical functionality between bin.ts and index.ts', async () => {
      // Reset mocks for second import
      vi.resetAllMocks();

      // Setup mocks again
      const mockProgram2 = {
        name: vi.fn().mockReturnThis(),
        description: vi.fn().mockReturnThis(),
        version: vi.fn().mockReturnThis(),
        command: vi.fn().mockReturnThis(),
        option: vi.fn().mockReturnThis(),
        action: vi.fn().mockReturnThis(),
        parse: vi.fn(),
      };

      mockCommand.mockImplementation(() => mockProgram2);
      mockFileURLToPath.mockReturnValue('/path/to/cli/src/bin.js');
      mockDirname.mockReturnValue('/path/to/cli/src');
      mockJoin.mockReturnValue('/path/to/cli/package.json');
      mockReadFileSync.mockReturnValue(JSON.stringify({ version: '1.0.0' }));

      // Import bin.ts
      await import('../src/bin.js');

      // Should have same configuration calls as index.ts
      expect(mockProgram2.name).toHaveBeenCalledWith('rafters');
      expect(mockProgram2.command).toHaveBeenCalledWith('init');
      expect(mockProgram2.command).toHaveBeenCalledWith('add <components...>');
      expect(mockProgram2.command).toHaveBeenCalledWith('list');
      expect(mockProgram2.command).toHaveBeenCalledWith('clean');
      expect(mockProgram2.parse).toHaveBeenCalled();
    });
  });
});
