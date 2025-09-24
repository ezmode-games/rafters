/**
 * Test suite for list command
 */

import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ensureDirSync, existsSync, removeSync, writeJsonSync } from 'fs-extra';
import { afterEach, beforeEach, describe, expect, it, type MockedFunction, vi } from 'vitest';
import type { loadConfig } from '../../src/utils/config.js';
import type { fetchComponentRegistry } from '../../src/utils/registry.js';

// Type definitions for mocked functions
type MockedLoadConfig = MockedFunction<typeof loadConfig>;
type MockedFetchComponentRegistry = MockedFunction<typeof fetchComponentRegistry>;

import { listCommand } from '../../src/commands/list.js';

// Mock external dependencies
vi.mock('../../src/utils/config.js', () => ({
  loadConfig: vi.fn(),
}));

vi.mock('../../src/utils/registry.js', () => ({
  fetchComponentRegistry: vi.fn(),
}));

vi.mock('../../src/utils/logo.js', () => ({
  getRaftersTitle: vi.fn(() => 'RAFTERS CLI'),
}));

describe('list command', () => {
  let testDir: string;
  let originalCwd: string;
  let mockLoadConfig: MockedLoadConfig;
  let mockFetchComponentRegistry: MockedFetchComponentRegistry;

  beforeEach(async () => {
    originalCwd = process.cwd();
    testDir = join(tmpdir(), `rafters-list-test-${Date.now()}`);
    ensureDirSync(testDir);
    process.chdir(testDir);

    // Mock console methods
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});

    // Get mocked functions
    const { loadConfig } = await import('../../src/utils/config.js');
    const { fetchComponentRegistry } = await import('../../src/utils/registry.js');
    mockLoadConfig = vi.mocked(loadConfig);
    mockFetchComponentRegistry = vi.mocked(fetchComponentRegistry);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    if (existsSync(testDir)) {
      removeSync(testDir);
    }
    vi.restoreAllMocks();
  });

  describe('version comparison', () => {
    beforeEach(() => {
      mockLoadConfig.mockReturnValue({
        componentsDir: './src/components/ui',
        packageManager: 'pnpm',
      });
    });

    it('should detect outdated components', async () => {
      // Setup installed component
      ensureDirSync(join(testDir, '.rafters'));
      writeJsonSync(join(testDir, '.rafters/component-manifest.json'), {
        components: {
          button: {
            version: '1.0.0',
            path: './src/components/ui/button.tsx',
            installed: '2024-01-01T00:00:00.000Z',
            intelligence: {
              cognitiveLoad: 2,
              attentionEconomics: 'Primary: Command attention for main actions',
              accessibility: 'WCAG AAA',
              trustBuilding: 'High trust through consistent styling',
              semanticMeaning: 'Primary action trigger',
            },
            dependencies: [],
          },
        },
      });

      mockFetchComponentRegistry.mockResolvedValue({
        components: [
          {
            name: 'button',
            description: 'A customizable button component',
            meta: {
              rafters: {
                version: '1.2.0',
                intelligence: { cognitiveLoad: 2 },
              },
            },
          },
        ],
      });

      await listCommand({ details: true });

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Update available: v1.2.0'));
    });

    it('should detect up-to-date components', async () => {
      ensureDirSync(join(testDir, '.rafters'));
      writeJsonSync(join(testDir, '.rafters/component-manifest.json'), {
        components: {
          button: {
            version: '1.2.0',
            path: './src/components/ui/button.tsx',
            installed: '2024-01-01T00:00:00.000Z',
            intelligence: {
              cognitiveLoad: 2,
              attentionEconomics: 'Primary action',
              accessibility: 'WCAG AAA',
              trustBuilding: 'High trust',
              semanticMeaning: 'Primary action',
            },
            dependencies: [],
          },
        },
      });

      mockFetchComponentRegistry.mockResolvedValue({
        components: [
          {
            name: 'button',
            description: 'A button component',
            meta: {
              rafters: {
                version: '1.2.0',
                intelligence: { cognitiveLoad: 2 },
              },
            },
          },
        ],
      });

      await listCommand({ details: true });

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Up to date'));
    });

    it('should detect newer local versions', async () => {
      ensureDirSync(join(testDir, '.rafters'));
      writeJsonSync(join(testDir, '.rafters/component-manifest.json'), {
        components: {
          button: {
            version: '2.0.0',
            path: './src/components/ui/button.tsx',
            installed: '2024-01-01T00:00:00.000Z',
            intelligence: {
              cognitiveLoad: 2,
              attentionEconomics: 'Primary action',
              accessibility: 'WCAG AAA',
              trustBuilding: 'High trust',
              semanticMeaning: 'Primary action',
            },
            dependencies: [],
          },
        },
      });

      mockFetchComponentRegistry.mockResolvedValue({
        components: [
          {
            name: 'button',
            description: 'A button component',
            meta: {
              rafters: {
                version: '1.2.0',
                intelligence: { cognitiveLoad: 2 },
              },
            },
          },
        ],
      });

      await listCommand({ details: true });

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Development version'));
    });
  });

  describe('compact view', () => {
    it('should show compact list of installed and available components', async () => {
      mockLoadConfig.mockReturnValue({
        componentsDir: './src/components/ui',
        packageManager: 'pnpm',
      });

      ensureDirSync(join(testDir, '.rafters'));
      writeJsonSync(join(testDir, '.rafters/component-manifest.json'), {
        components: {
          button: {
            version: '1.0.0',
            path: './src/components/ui/button.tsx',
            installed: '2024-01-01T00:00:00.000Z',
            intelligence: {
              cognitiveLoad: 2,
              attentionEconomics: 'Primary action',
              accessibility: 'WCAG AAA',
              trustBuilding: 'High trust',
              semanticMeaning: 'Primary action',
            },
            dependencies: [],
          },
        },
      });

      mockFetchComponentRegistry.mockResolvedValue({
        components: [
          {
            name: 'button',
            description: 'A button component',
            meta: { rafters: { version: '1.0.0', intelligence: { cognitiveLoad: 2 } } },
          },
          {
            name: 'card',
            description: 'A card component',
            meta: { rafters: { version: '1.0.0', intelligence: { cognitiveLoad: 3 } } },
          },
        ],
      });

      await listCommand(); // Default compact view

      expect(console.log).toHaveBeenCalledWith('Installed Components:');
      expect(console.log).toHaveBeenCalledWith('Available Components:');
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('1 installed, 1 available'));
    });

    it('should show summary statistics', async () => {
      mockLoadConfig.mockReturnValue({
        componentsDir: './src/components/ui',
        packageManager: 'pnpm',
      });

      mockFetchComponentRegistry.mockResolvedValue({
        components: [
          {
            name: 'button',
            description: 'Button',
            meta: { rafters: { intelligence: { cognitiveLoad: 2 } } },
          },
          {
            name: 'card',
            description: 'Card',
            meta: { rafters: { intelligence: { cognitiveLoad: 3 } } },
          },
          {
            name: 'dialog',
            description: 'Dialog',
            meta: { rafters: { intelligence: { cognitiveLoad: 4 } } },
          },
        ],
      });

      await listCommand();

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('0 installed, 3 available'));
    });
  });

  describe('detailed view', () => {
    it('should show detailed component information', async () => {
      mockLoadConfig.mockReturnValue({
        componentsDir: './src/components/ui',
        packageManager: 'pnpm',
      });

      ensureDirSync(join(testDir, '.rafters'));
      writeJsonSync(join(testDir, '.rafters/component-manifest.json'), {
        components: {
          button: {
            version: '1.0.0',
            path: './src/components/ui/button.tsx',
            installed: '2024-01-01T00:00:00.000Z',
            intelligence: {
              cognitiveLoad: 2,
              attentionEconomics: 'Primary: Command attention for main actions',
              accessibility: 'WCAG AAA with 44px touch targets',
              trustBuilding: 'High trust through consistent styling',
              semanticMeaning: 'Primary action trigger',
            },
            dependencies: ['clsx', 'class-variance-authority'],
          },
        },
      });

      mockFetchComponentRegistry.mockResolvedValue({
        components: [
          {
            name: 'button',
            description: 'A customizable button component',
            meta: {
              rafters: {
                version: '1.0.0',
                intelligence: { cognitiveLoad: 2 },
              },
            },
          },
        ],
      });

      await listCommand({ details: true });

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('button (v1.0.0)'));
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Path: ./src/components/ui/button.tsx')
      );
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Cognitive load=2/10'));
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Dependencies: clsx, class-variance-authority')
      );
    });

    it('should limit available components display to 8', async () => {
      mockLoadConfig.mockReturnValue({
        componentsDir: './src/components/ui',
        packageManager: 'pnpm',
      });

      const manyComponents = Array.from({ length: 12 }, (_, i) => ({
        name: `component${i}`,
        description: `Component ${i}`,
        meta: { rafters: { intelligence: { cognitiveLoad: 1 } } },
      }));

      mockFetchComponentRegistry.mockResolvedValue({
        components: manyComponents,
      });

      await listCommand({ details: true });

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('... and 4 more'));
    });
  });

  describe('error handling', () => {
    it('should handle missing manifest file', async () => {
      mockLoadConfig.mockReturnValue({
        componentsDir: './src/components/ui',
        packageManager: 'pnpm',
      });

      mockFetchComponentRegistry.mockResolvedValue({
        components: [
          {
            name: 'button',
            description: 'A button component',
            meta: { rafters: { intelligence: { cognitiveLoad: 2 } } },
          },
        ],
      });

      await listCommand();

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('0 installed, 1 available'));
    });

    it('should handle missing config gracefully', async () => {
      mockLoadConfig.mockImplementation(() => {
        throw new Error('Config not found');
      });

      mockFetchComponentRegistry.mockResolvedValue({
        components: [
          {
            name: 'button',
            description: 'A button component',
            meta: { rafters: { intelligence: { cognitiveLoad: 2 } } },
          },
        ],
      });

      await listCommand();

      // Should still show available components
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Available Components'));
    });

    it('should handle registry fetch failure', async () => {
      mockLoadConfig.mockReturnValue({
        componentsDir: './src/components/ui',
        packageManager: 'pnpm',
      });

      mockFetchComponentRegistry.mockRejectedValue(new Error('Registry unavailable'));

      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('Process exit called');
      });

      await expect(listCommand()).rejects.toThrow('Process exit called');
      expect(exitSpy).toHaveBeenCalledWith(1);
    });

    it('should handle corrupted manifest file', async () => {
      mockLoadConfig.mockReturnValue({
        componentsDir: './src/components/ui',
        packageManager: 'pnpm',
      });

      ensureDirSync(join(testDir, '.rafters'));
      // Write invalid JSON
      require('node:fs').writeFileSync(
        join(testDir, '.rafters/component-manifest.json'),
        'invalid json content'
      );

      mockFetchComponentRegistry.mockResolvedValue({
        components: [
          {
            name: 'button',
            description: 'A button component',
            meta: { rafters: { intelligence: { cognitiveLoad: 2 } } },
          },
        ],
      });

      await listCommand();

      // Should handle gracefully and show available components
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('0 installed, 1 available'));
    });
  });

  describe('update notifications', () => {
    it('should notify about available updates in compact view', async () => {
      mockLoadConfig.mockReturnValue({
        componentsDir: './src/components/ui',
        packageManager: 'pnpm',
      });

      ensureDirSync(join(testDir, '.rafters'));
      writeJsonSync(join(testDir, '.rafters/component-manifest.json'), {
        components: {
          button: {
            version: '1.0.0',
            path: './src/components/ui/button.tsx',
            installed: '2024-01-01T00:00:00.000Z',
            intelligence: {
              cognitiveLoad: 2,
              attentionEconomics: '',
              accessibility: '',
              trustBuilding: '',
              semanticMeaning: '',
            },
            dependencies: [],
          },
        },
      });

      mockFetchComponentRegistry.mockResolvedValue({
        components: [
          {
            name: 'button',
            description: 'A button component',
            meta: {
              rafters: {
                version: '1.2.0',
                intelligence: { cognitiveLoad: 2 },
              },
            },
          },
        ],
      });

      await listCommand();

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Updates: 1 component(s) have updates available')
      );
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('rafters add button'));
    });

    it('should show multiple updates', async () => {
      mockLoadConfig.mockReturnValue({
        componentsDir: './src/components/ui',
        packageManager: 'pnpm',
      });

      ensureDirSync(join(testDir, '.rafters'));
      writeJsonSync(join(testDir, '.rafters/component-manifest.json'), {
        components: {
          button: {
            version: '1.0.0',
            path: './src/components/ui/button.tsx',
            installed: '2024-01-01T00:00:00.000Z',
            intelligence: {
              cognitiveLoad: 2,
              attentionEconomics: '',
              accessibility: '',
              trustBuilding: '',
              semanticMeaning: '',
            },
            dependencies: [],
          },
          card: {
            version: '1.1.0',
            path: './src/components/ui/card.tsx',
            installed: '2024-01-01T00:00:00.000Z',
            intelligence: {
              cognitiveLoad: 3,
              attentionEconomics: '',
              accessibility: '',
              trustBuilding: '',
              semanticMeaning: '',
            },
            dependencies: [],
          },
        },
      });

      mockFetchComponentRegistry.mockResolvedValue({
        components: [
          {
            name: 'button',
            description: 'Button',
            meta: { rafters: { version: '1.2.0', intelligence: { cognitiveLoad: 2 } } },
          },
          {
            name: 'card',
            description: 'Card',
            meta: { rafters: { version: '1.3.0', intelligence: { cognitiveLoad: 3 } } },
          },
        ],
      });

      await listCommand({ details: true });

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('2 update(s) available: button, card')
      );
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('rafters add button card'));
    });
  });

  describe('component not in registry', () => {
    it('should handle locally installed component not found in registry', async () => {
      mockLoadConfig.mockReturnValue({
        componentsDir: './src/components/ui',
        packageManager: 'pnpm',
      });

      ensureDirSync(join(testDir, '.rafters'));
      writeJsonSync(join(testDir, '.rafters/component-manifest.json'), {
        components: {
          'custom-component': {
            version: '1.0.0',
            path: './src/components/ui/custom-component.tsx',
            installed: '2024-01-01T00:00:00.000Z',
            intelligence: {
              cognitiveLoad: 2,
              attentionEconomics: '',
              accessibility: '',
              trustBuilding: '',
              semanticMeaning: '',
            },
            dependencies: [],
          },
        },
      });

      mockFetchComponentRegistry.mockResolvedValue({
        components: [], // Empty registry
      });

      await listCommand({ details: true });

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Component not found in registry')
      );
    });
  });
});
