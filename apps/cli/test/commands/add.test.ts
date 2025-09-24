/**
 * Test suite for add command
 */

import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ensureDirSync, existsSync, readJsonSync, removeSync, writeJsonSync } from 'fs-extra';
import { afterEach, beforeEach, describe, expect, it, type MockedFunction, vi } from 'vitest';
import type { installDependencies } from '../../src/utils/dependencies.js';
import type { fetchComponent } from '../../src/utils/registry.js';

// Type definitions for mocked functions
type MockedFetchComponent = MockedFunction<typeof fetchComponent>;
type MockedInstallDependencies = MockedFunction<typeof installDependencies>;

import { addCommand } from '../../src/commands/add.js';

// Mock external dependencies
vi.mock('ora', () => ({
  default: vi.fn(() => ({
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn().mockReturnThis(),
    fail: vi.fn().mockReturnThis(),
    warn: vi.fn().mockReturnThis(),
  })),
}));

vi.mock('../../src/utils/registry.js', () => ({
  fetchComponent: vi.fn(),
}));

vi.mock('../../src/utils/dependencies.js', () => ({
  installDependencies: vi.fn(),
}));

vi.mock('../../src/utils/logo.js', () => ({
  getRaftersTitle: vi.fn(() => 'RAFTERS CLI'),
}));

describe('add command', () => {
  let testDir: string;
  let originalCwd: string;
  let mockFetchComponent: MockedFetchComponent;
  let mockInstallDependencies: MockedInstallDependencies;

  beforeEach(async () => {
    originalCwd = process.cwd();
    testDir = join(tmpdir(), `rafters-add-test-${Date.now()}`);
    ensureDirSync(testDir);
    process.chdir(testDir);

    // Mock console methods
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});

    // Get mocked functions
    const { fetchComponent } = await import('../../src/utils/registry.js');
    const { installDependencies } = await import('../../src/utils/dependencies.js');
    mockFetchComponent = vi.mocked(fetchComponent);
    mockInstallDependencies = vi.mocked(installDependencies);

    // Create basic project structure
    ensureDirSync(join(testDir, '.rafters'));
    ensureDirSync(join(testDir, 'src/components/ui'));

    // Create config file
    writeJsonSync(join(testDir, '.rafters/config.json'), {
      version: '1.0.0',
      componentsDir: './src/components/ui',
      packageManager: 'pnpm',
      registry: 'https://rafters.realhandy.tech/registry',
    });
  });

  afterEach(() => {
    process.chdir(originalCwd);
    if (existsSync(testDir)) {
      removeSync(testDir);
    }
    vi.restoreAllMocks();
  });

  describe('component parsing', () => {
    it('should handle single component name', async () => {
      mockFetchComponent.mockResolvedValue({
        name: 'button',
        files: [
          {
            path: 'button.tsx',
            type: 'registry:component',
            content: 'export const Button = () => <button />;',
          },
        ],
        dependencies: [],
        meta: {
          rafters: {
            intelligence: { cognitiveLoad: 2 },
            version: '1.0.0',
          },
        },
      });

      await addCommand(['button']);
      expect(mockFetchComponent).toHaveBeenCalledWith('button');
    });

    it('should handle multiple component names', async () => {
      mockFetchComponent.mockResolvedValue({
        name: 'button',
        files: [
          {
            path: 'button.tsx',
            type: 'registry:component',
            content: 'export const Button = () => <button />;',
          },
        ],
        dependencies: [],
        meta: {
          rafters: {
            intelligence: { cognitiveLoad: 2 },
            version: '1.0.0',
          },
        },
      });

      await addCommand(['button', 'card']);
      expect(mockFetchComponent).toHaveBeenCalledWith('button');
      expect(mockFetchComponent).toHaveBeenCalledWith('card');
    });

    it('should handle comma-separated component names', async () => {
      mockFetchComponent.mockResolvedValue({
        name: 'button',
        files: [
          {
            path: 'button.tsx',
            type: 'registry:component',
            content: 'export const Button = () => <button />;',
          },
        ],
        dependencies: [],
        meta: {
          rafters: {
            intelligence: { cognitiveLoad: 2 },
            version: '1.0.0',
          },
        },
      });

      await addCommand(['button,card,dialog']);
      expect(mockFetchComponent).toHaveBeenCalledWith('button');
      expect(mockFetchComponent).toHaveBeenCalledWith('card');
      expect(mockFetchComponent).toHaveBeenCalledWith('dialog');
    });

    it('should handle mixed spaces and commas', async () => {
      mockFetchComponent.mockResolvedValue({
        name: 'button',
        files: [
          {
            path: 'button.tsx',
            type: 'registry:component',
            content: 'export const Button = () => <button />;',
          },
        ],
        dependencies: [],
        meta: {
          rafters: {
            intelligence: { cognitiveLoad: 2 },
            version: '1.0.0',
          },
        },
      });

      await addCommand(['button card', 'dialog,sheet']);
      expect(mockFetchComponent).toHaveBeenCalledWith('button');
      expect(mockFetchComponent).toHaveBeenCalledWith('card');
      expect(mockFetchComponent).toHaveBeenCalledWith('dialog');
      expect(mockFetchComponent).toHaveBeenCalledWith('sheet');
    });
  });

  describe('error handling', () => {
    it('should exit with error when no components provided', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('Process exit called');
      });

      await expect(addCommand([])).rejects.toThrow('Process exit called');
      expect(exitSpy).toHaveBeenCalledWith(1);
    });

    it('should handle component not found in registry', async () => {
      mockFetchComponent.mockResolvedValue(null);

      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('Process exit called');
      });

      await expect(addCommand(['nonexistent'])).rejects.toThrow('Process exit called');
      expect(exitSpy).toHaveBeenCalledWith(1);
    });

    it('should handle component with no source code', async () => {
      mockFetchComponent.mockResolvedValue({
        name: 'empty',
        files: [
          {
            path: 'empty.tsx',
            type: 'registry:component',
            content: '', // Empty content
          },
        ],
        dependencies: [],
        meta: {
          rafters: {
            intelligence: { cognitiveLoad: 2 },
            version: '1.0.0',
          },
        },
      });

      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('Process exit called');
      });

      await expect(addCommand(['empty'])).rejects.toThrow('Process exit called');
      expect(exitSpy).toHaveBeenCalledWith(1);
    });

    it('should handle component missing intelligence metadata', async () => {
      mockFetchComponent.mockResolvedValue({
        name: 'button',
        files: [
          {
            path: 'button.tsx',
            type: 'registry:component',
            content: 'export const Button = () => <button />;',
          },
        ],
        dependencies: [],
        meta: {
          rafters: {
            version: '1.0.0',
            // Missing intelligence
          },
        },
      });

      await expect(addCommand(['button'])).rejects.toThrow('missing rafters intelligence metadata');
    });
  });

  describe('dependency installation', () => {
    it('should install component dependencies', async () => {
      mockFetchComponent.mockResolvedValue({
        name: 'dialog',
        files: [
          {
            path: 'dialog.tsx',
            type: 'registry:component',
            content: 'export const Dialog = () => <div />;',
          },
        ],
        dependencies: ['@radix-ui/react-dialog', 'class-variance-authority'],
        meta: {
          rafters: {
            intelligence: { cognitiveLoad: 4 },
            version: '1.0.0',
          },
        },
      });

      mockInstallDependencies.mockResolvedValue(undefined);

      await addCommand(['dialog']);

      expect(mockInstallDependencies).toHaveBeenCalledWith(
        ['@radix-ui/react-dialog', 'class-variance-authority'],
        'pnpm',
        testDir
      );
    });

    it('should handle dependency installation failure gracefully', async () => {
      mockFetchComponent.mockResolvedValue({
        name: 'dialog',
        files: [
          {
            path: 'dialog.tsx',
            type: 'registry:component',
            content: 'export const Dialog = () => <div />;',
          },
        ],
        dependencies: ['@radix-ui/react-dialog'],
        meta: {
          rafters: {
            intelligence: { cognitiveLoad: 4 },
            version: '1.0.0',
          },
        },
      });

      mockInstallDependencies.mockRejectedValue(new Error('npm install failed'));

      await addCommand(['dialog']);

      // Should continue despite dependency failure
      expect(existsSync(join(testDir, 'src/components/ui/dialog.tsx'))).toBe(true);
    });
  });

  describe('file operations', () => {
    it('should write component file successfully', async () => {
      const componentContent = 'export const Button = () => <button>Click me</button>;';

      mockFetchComponent.mockResolvedValue({
        name: 'button',
        files: [
          {
            path: 'button.tsx',
            type: 'registry:component',
            content: componentContent,
          },
        ],
        dependencies: [],
        meta: {
          rafters: {
            intelligence: { cognitiveLoad: 2 },
            version: '1.0.0',
          },
        },
      });

      await addCommand(['button']);

      const filePath = join(testDir, 'src/components/ui/button.tsx');
      expect(existsSync(filePath)).toBe(true);

      const writtenContent = readJsonSync(filePath, 'utf8');
      expect(writtenContent).toContain('export const Button');
    });

    it('should refuse to overwrite existing component without --force', async () => {
      // Create existing component
      const existingPath = join(testDir, 'src/components/ui/button.tsx');
      ensureDirSync(join(testDir, 'src/components/ui'));
      writeJsonSync(existingPath, 'existing content');

      mockFetchComponent.mockResolvedValue({
        name: 'button',
        files: [
          {
            path: 'button.tsx',
            type: 'registry:component',
            content: 'export const Button = () => <button />;',
          },
        ],
        dependencies: [],
        meta: {
          rafters: {
            intelligence: { cognitiveLoad: 2 },
            version: '1.0.0',
          },
        },
      });

      await addCommand(['button']); // Without force

      // Should not overwrite
      expect(readJsonSync(existingPath, 'utf8')).toBe('existing content');
    });

    it('should overwrite existing component with --force', async () => {
      // Create existing component
      const existingPath = join(testDir, 'src/components/ui/button.tsx');
      ensureDirSync(join(testDir, 'src/components/ui'));
      writeJsonSync(existingPath, 'existing content');

      const newContent = 'export const Button = () => <button>New</button>;';
      mockFetchComponent.mockResolvedValue({
        name: 'button',
        files: [
          {
            path: 'button.tsx',
            type: 'registry:component',
            content: newContent,
          },
        ],
        dependencies: [],
        meta: {
          rafters: {
            intelligence: { cognitiveLoad: 2 },
            version: '1.0.0',
          },
        },
      });

      await addCommand(['button'], { force: true });

      // Should overwrite
      expect(readJsonSync(existingPath, 'utf8')).toContain('New');
    });
  });

  describe('manifest management', () => {
    it('should update component manifest after successful installation', async () => {
      mockFetchComponent.mockResolvedValue({
        name: 'button',
        files: [
          {
            path: 'button.tsx',
            type: 'registry:component',
            content: 'export const Button = () => <button />;',
          },
        ],
        dependencies: ['clsx'],
        meta: {
          rafters: {
            intelligence: {
              cognitiveLoad: 2,
              attentionEconomics: 'Primary action button',
            },
            version: '1.2.0',
          },
        },
      });

      await addCommand(['button']);

      const manifestPath = join(testDir, '.rafters/component-manifest.json');
      expect(existsSync(manifestPath)).toBe(true);

      const manifest = readJsonSync(manifestPath);
      expect(manifest.components.button).toEqual({
        path: './src/components/ui/button.tsx',
        installed: expect.any(String),
        version: '1.2.0',
        intelligence: {
          cognitiveLoad: 2,
          attentionEconomics: 'Primary action button',
        },
        dependencies: ['clsx'],
      });
    });

    it('should handle missing manifest file gracefully', async () => {
      // Remove .rafters directory
      removeSync(join(testDir, '.rafters'));

      mockFetchComponent.mockResolvedValue({
        name: 'button',
        files: [
          {
            path: 'button.tsx',
            type: 'registry:component',
            content: 'export const Button = () => <button />;',
          },
        ],
        dependencies: [],
        meta: {
          rafters: {
            intelligence: { cognitiveLoad: 2 },
            version: '1.0.0',
          },
        },
      });

      await addCommand(['button']);

      // Should create new manifest
      const manifestPath = join(testDir, '.rafters/component-manifest.json');
      expect(existsSync(manifestPath)).toBe(true);

      const manifest = readJsonSync(manifestPath);
      expect(manifest.components.button).toBeDefined();
    });
  });

  describe('multiple components', () => {
    it('should handle mixed success and failure', async () => {
      mockFetchComponent.mockImplementation((name: string) => {
        if (name === 'button') {
          return Promise.resolve({
            name: 'button',
            files: [
              {
                path: 'button.tsx',
                type: 'registry:component',
                content: 'export const Button = () => <button />;',
              },
            ],
            dependencies: [],
            meta: {
              rafters: {
                intelligence: { cognitiveLoad: 2 },
                version: '1.0.0',
              },
            },
          });
        }
        return Promise.resolve(null); // card not found
      });

      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('Process exit called');
      });

      await expect(addCommand(['button', 'card'])).rejects.toThrow('Process exit called');

      // Should have installed button successfully
      expect(existsSync(join(testDir, 'src/components/ui/button.tsx'))).toBe(true);
      // But not exit cleanly due to card failure
      expect(exitSpy).toHaveBeenCalledWith(1);
    });

    it('should track installation statistics', async () => {
      mockFetchComponent.mockResolvedValue({
        name: 'button',
        files: [
          {
            path: 'button.tsx',
            type: 'registry:component',
            content: 'export const Button = () => <button />;',
          },
        ],
        dependencies: [],
        meta: {
          rafters: {
            intelligence: { cognitiveLoad: 2 },
            version: '1.0.0',
          },
        },
      });

      await addCommand(['button', 'button', 'button']); // Same component multiple times

      // Should process each request
      expect(mockFetchComponent).toHaveBeenCalledTimes(3);
    });
  });
});
