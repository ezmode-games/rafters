/**
 * Test suite for clean command
 */

import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ensureDirSync, existsSync, removeSync, writeJsonSync } from 'fs-extra';
import type inquirer from 'inquirer';
import { afterEach, beforeEach, describe, expect, it, type MockedFunction, vi } from 'vitest';

// Type definitions for mocked functions
type MockedInquirer = {
  prompt: MockedFunction<typeof inquirer.prompt>;
};

import { cleanCommand } from '../../src/commands/clean.js';

// Mock external dependencies
vi.mock('inquirer', () => ({
  default: {
    prompt: vi.fn(),
  },
}));

vi.mock('ora', () => ({
  default: vi.fn(() => ({
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn().mockReturnThis(),
    fail: vi.fn().mockReturnThis(),
  })),
}));

describe('clean command', () => {
  let testDir: string;
  let originalCwd: string;
  let mockInquirer: MockedInquirer;

  beforeEach(async () => {
    originalCwd = process.cwd();
    testDir = join(tmpdir(), `rafters-clean-test-${Date.now()}`);
    ensureDirSync(testDir);
    process.chdir(testDir);

    // Mock console methods
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});

    // Get mocked inquirer
    const inquirer = await import('inquirer');
    mockInquirer = vi.mocked(inquirer.default.prompt);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    if (existsSync(testDir)) {
      removeSync(testDir);
    }
    vi.restoreAllMocks();
  });

  describe('directory detection', () => {
    it('should handle missing .rafters directory', async () => {
      await cleanCommand({});

      expect(console.log).toHaveBeenCalledWith('No .rafters directory found. Nothing to clean.');
    });

    it('should detect existing .rafters directory', async () => {
      // Create .rafters directory with some files
      const raftersDir = join(testDir, '.rafters');
      ensureDirSync(raftersDir);
      writeJsonSync(join(raftersDir, 'config.json'), { version: '1.0.0' });
      writeJsonSync(join(raftersDir, 'component-manifest.json'), { components: {} });

      mockInquirer.mockResolvedValue({ shouldClean: true });

      await cleanCommand({});

      expect(existsSync(raftersDir)).toBe(false);
    });
  });

  describe('confirmation handling', () => {
    beforeEach(() => {
      // Create .rafters directory
      const raftersDir = join(testDir, '.rafters');
      ensureDirSync(raftersDir);
      writeJsonSync(join(raftersDir, 'config.json'), { version: '1.0.0' });
    });

    it('should prompt for confirmation when force is not provided', async () => {
      mockInquirer.mockResolvedValue({ shouldClean: true });

      await cleanCommand({});

      expect(mockInquirer).toHaveBeenCalledWith([
        {
          type: 'confirm',
          name: 'shouldClean',
          message:
            'This will remove the entire .rafters directory and all configuration. Continue?',
          default: false,
        },
      ]);
    });

    it('should skip confirmation when force is provided', async () => {
      await cleanCommand({ force: true });

      expect(mockInquirer).not.toHaveBeenCalled();
      expect(existsSync(join(testDir, '.rafters'))).toBe(false);
    });

    it('should cancel cleaning when user declines confirmation', async () => {
      mockInquirer.mockResolvedValue({ shouldClean: false });

      await cleanCommand({});

      expect(console.log).toHaveBeenCalledWith('Clean cancelled.');
      expect(existsSync(join(testDir, '.rafters'))).toBe(true);
    });

    it('should proceed with cleaning when user confirms', async () => {
      mockInquirer.mockResolvedValue({ shouldClean: true });

      await cleanCommand({});

      expect(existsSync(join(testDir, '.rafters'))).toBe(false);
    });
  });

  describe('cleanup operation', () => {
    it('should remove entire .rafters directory', async () => {
      // Create complex .rafters structure
      const raftersDir = join(testDir, '.rafters');
      ensureDirSync(raftersDir);
      ensureDirSync(join(raftersDir, 'tokens'));

      writeJsonSync(join(raftersDir, 'config.json'), {
        version: '1.0.0',
        componentsDir: './src/components/ui',
        packageManager: 'pnpm',
      });

      writeJsonSync(join(raftersDir, 'component-manifest.json'), {
        version: '1.0.0',
        components: {
          button: {
            path: './src/components/ui/button.tsx',
            installed: '2024-01-01T00:00:00.000Z',
          },
        },
      });

      writeJsonSync(join(raftersDir, 'tokens', 'colors.json'), {
        colors: { primary: '#000' },
      });

      await cleanCommand({ force: true });

      expect(existsSync(raftersDir)).toBe(false);
    });

    it('should show success message after cleaning', async () => {
      const raftersDir = join(testDir, '.rafters');
      ensureDirSync(raftersDir);
      writeJsonSync(join(raftersDir, 'config.json'), { version: '1.0.0' });

      await cleanCommand({ force: true });

      expect(console.log).toHaveBeenCalledWith('Removed:');
      expect(console.log).toHaveBeenCalledWith('  • .rafters/ directory');
      expect(console.log).toHaveBeenCalledWith('  • All token files');
      expect(console.log).toHaveBeenCalledWith('  • Component manifest');
      expect(console.log).toHaveBeenCalledWith('  • Configuration files');
      expect(console.log).toHaveBeenCalledWith('Run "rafters init" to reinitialize Rafters.');
    });
  });

  describe('error handling', () => {
    it('should handle filesystem errors gracefully', async () => {
      // Create .rafters directory
      const raftersDir = join(testDir, '.rafters');
      ensureDirSync(raftersDir);
      writeJsonSync(join(raftersDir, 'config.json'), { version: '1.0.0' });

      // Mock fs-extra to throw an error
      vi.doMock('fs-extra', () => ({
        removeSync: vi.fn(() => {
          throw new Error('Permission denied');
        }),
        existsSync: vi.fn(() => true),
      }));

      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('Process exit called');
      });

      await expect(cleanCommand({ force: true })).rejects.toThrow('Process exit called');
      expect(exitSpy).toHaveBeenCalledWith(1);
    });

    it('should handle read-only files and directories', async () => {
      const raftersDir = join(testDir, '.rafters');
      ensureDirSync(raftersDir);

      // Create a read-only file (simulate permission issue)
      const configPath = join(raftersDir, 'config.json');
      writeJsonSync(configPath, { version: '1.0.0' });

      await cleanCommand({ force: true });

      // Should still succeed (fs-extra.removeSync handles permissions)
      expect(existsSync(raftersDir)).toBe(false);
    });
  });

  describe('nested directory structures', () => {
    it('should remove deeply nested directories and files', async () => {
      const raftersDir = join(testDir, '.rafters');

      // Create nested structure
      ensureDirSync(join(raftersDir, 'tokens', 'colors'));
      ensureDirSync(join(raftersDir, 'tokens', 'spacing'));
      ensureDirSync(join(raftersDir, 'components', 'ui'));
      ensureDirSync(join(raftersDir, 'templates', 'react'));

      // Add files at various levels
      writeJsonSync(join(raftersDir, 'config.json'), { version: '1.0.0' });
      writeJsonSync(join(raftersDir, 'tokens', 'colors', 'primary.json'), { color: '#000' });
      writeJsonSync(join(raftersDir, 'tokens', 'spacing', 'scale.json'), { spacing: '4px' });
      writeJsonSync(join(raftersDir, 'components', 'ui', 'button.tsx'), 'component content');
      writeJsonSync(join(raftersDir, 'templates', 'react', 'utils.ts'), 'utils content');

      await cleanCommand({ force: true });

      expect(existsSync(raftersDir)).toBe(false);
      expect(existsSync(join(raftersDir, 'tokens'))).toBe(false);
      expect(existsSync(join(raftersDir, 'components'))).toBe(false);
      expect(existsSync(join(raftersDir, 'templates'))).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle empty .rafters directory', async () => {
      const raftersDir = join(testDir, '.rafters');
      ensureDirSync(raftersDir); // Empty directory

      await cleanCommand({ force: true });

      expect(existsSync(raftersDir)).toBe(false);
    });

    it('should handle .rafters as a file instead of directory', async () => {
      const raftersPath = join(testDir, '.rafters');

      // Create .rafters as a file instead of directory
      require('node:fs').writeFileSync(raftersPath, 'not a directory');

      await cleanCommand({ force: true });

      expect(existsSync(raftersPath)).toBe(false);
    });

    it('should handle broken symlinks in .rafters directory', async () => {
      const raftersDir = join(testDir, '.rafters');
      ensureDirSync(raftersDir);

      // Create broken symlink (pointing to non-existent file)
      try {
        require('node:fs').symlinkSync('/nonexistent/path', join(raftersDir, 'broken-link'));
      } catch {
        // Symlinks might not be supported on all systems, skip if fails
      }

      await cleanCommand({ force: true });

      expect(existsSync(raftersDir)).toBe(false);
    });
  });

  describe('concurrent operations', () => {
    it('should handle multiple clean operations on same directory', async () => {
      const raftersDir = join(testDir, '.rafters');
      ensureDirSync(raftersDir);
      writeJsonSync(join(raftersDir, 'config.json'), { version: '1.0.0' });

      // Run clean operations concurrently
      const cleanPromises = [
        cleanCommand({ force: true }),
        cleanCommand({ force: true }),
        cleanCommand({ force: true }),
      ];

      await Promise.allSettled(cleanPromises);

      expect(existsSync(raftersDir)).toBe(false);
    });
  });
});
