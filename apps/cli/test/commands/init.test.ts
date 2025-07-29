import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initCommand } from '../../src/commands/init.js';

// Mock all dependencies
vi.mock('node:fs');
vi.mock('fs-extra');
vi.mock('inquirer');
vi.mock('ora');
vi.mock('@rafters/design-tokens');
vi.mock('../../src/utils/config.js');
vi.mock('../../src/utils/dependencies.js');
vi.mock('../../src/utils/logo.js');

const mockExistsSync = vi.mocked(existsSync);
const mockReadFileSync = vi.mocked(readFileSync);
const mockWriteFileSync = vi.mocked(writeFileSync);

describe('initCommand', () => {
  const mockCwd = '/test/project';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd);
  });

  describe('token integration', () => {
    it('should use default tokens when no shortcode provided', async () => {
      // Mock all required modules
      const { default: inquirer } = await import('inquirer');
      const { default: ora } = await import('ora');
      const designTokens = await import('@rafters/design-tokens');
      const config = await import('../../src/utils/config.js');
      const dependencies = await import('../../src/utils/dependencies.js');
      const logo = await import('../../src/utils/logo.js');

      // Setup mocks
      mockExistsSync.mockImplementation((path) => {
        if (typeof path === 'string' && path.includes('package.json')) return true;
        if (typeof path === 'string' && path.includes('.rafters')) return false;
        return false;
      });

      mockReadFileSync.mockImplementation((path) => {
        if (typeof path === 'string' && path.includes('package.json')) {
          return JSON.stringify({ dependencies: { react: '^18.0.0' } });
        }
        return 'template content';
      });

      vi.mocked(inquirer.prompt).mockResolvedValue({
        hasStorybook: false,
        componentsDir: './src/components/ui',
        studioShortcode: '', // No shortcode = default tokens
        tokenFormat: 'css',
      });

      const mockSpinner = {
        start: vi.fn().mockReturnThis(),
        succeed: vi.fn().mockReturnThis(),
        fail: vi.fn().mockReturnThis(),
        warn: vi.fn().mockReturnThis(),
      };
      vi.mocked(ora).mockReturnValue(mockSpinner as ReturnType<typeof ora>);

      vi.mocked(config.isNodeProject).mockReturnValue(true);
      vi.mocked(config.hasReact).mockReturnValue(true);
      vi.mocked(config.configExists).mockReturnValue(false);
      vi.mocked(config.detectPackageManager).mockReturnValue('npm');
      // Mock defaultConfig as an object property
      Object.assign(config.defaultConfig, {
        version: '1.0.0',
        componentsDir: './src/components/ui',
        storiesDir: './src/stories',
        hasStorybook: false,
        packageManager: 'npm',
        registry: 'https://registry.rafters.dev',
      });

      vi.mocked(dependencies.getCoreDependencies).mockReturnValue(['react', 'typescript']);
      vi.mocked(dependencies.installDependencies).mockResolvedValue();

      vi.mocked(logo.getRaftersLogo).mockReturnValue('ASCII LOGO');
      vi.mocked(logo.getRaftersTitle).mockReturnValue('RAFTERS TITLE');

      const mockTokenSet = {
        id: 'grayscale-system',
        name: 'Rafters Grayscale',
        version: '1.0.0',
        registry: { version: '1.0.0', system: 'grayscale', tokens: {} },
        manifest: {
          version: '1.0.0',
          system: 'grayscale',
          name: 'Rafters Grayscale',
          categories: [],
          tokenCount: 0,
          created: '',
        },
        css: ':root { --color-primary: gray; }',
        tailwind: '@theme { --color-primary: gray; }',
        reactNative: 'export const tokens = { primary: "gray" };',
      };

      vi.mocked(designTokens.checkTailwindVersion).mockResolvedValue(null);
      vi.mocked(designTokens.createDefaultRegistry).mockReturnValue(mockTokenSet);
      vi.mocked(designTokens.writeTokenFiles).mockResolvedValue();
      vi.mocked(designTokens.injectCSSImport).mockResolvedValue();

      // Execute the command
      await initCommand();

      // Verify default registry was used
      expect(designTokens.createDefaultRegistry).toHaveBeenCalled();
      expect(designTokens.fetchStudioTokens).not.toHaveBeenCalled();
      expect(designTokens.writeTokenFiles).toHaveBeenCalledWith(mockTokenSet, 'css', mockCwd);
      expect(designTokens.injectCSSImport).toHaveBeenCalledWith('css', mockCwd);
    });

    it('should fetch Studio tokens when shortcode provided', async () => {
      // Mock all required modules
      const { default: inquirer } = await import('inquirer');
      const { default: ora } = await import('ora');
      const designTokens = await import('@rafters/design-tokens');
      const config = await import('../../src/utils/config.js');
      const dependencies = await import('../../src/utils/dependencies.js');
      const logo = await import('../../src/utils/logo.js');

      // Setup mocks
      mockExistsSync.mockImplementation((path) => {
        if (typeof path === 'string' && path.includes('package.json')) return true;
        if (typeof path === 'string' && path.includes('.rafters')) return false;
        return false;
      });

      mockReadFileSync.mockImplementation((path) => {
        if (typeof path === 'string' && path.includes('package.json')) {
          return JSON.stringify({ dependencies: { react: '^18.0.0' } });
        }
        return 'template content';
      });

      vi.mocked(inquirer.prompt).mockResolvedValue({
        hasStorybook: false,
        componentsDir: './src/components/ui',
        studioShortcode: 'ABC123XY', // Studio shortcode provided
        tokenFormat: 'tailwind',
      });

      const mockSpinner = {
        start: vi.fn().mockReturnThis(),
        succeed: vi.fn().mockReturnThis(),
        fail: vi.fn().mockReturnThis(),
        warn: vi.fn().mockReturnThis(),
      };
      vi.mocked(ora).mockReturnValue(mockSpinner as ReturnType<typeof ora>);

      vi.mocked(config.isNodeProject).mockReturnValue(true);
      vi.mocked(config.hasReact).mockReturnValue(true);
      vi.mocked(config.configExists).mockReturnValue(false);
      vi.mocked(config.detectPackageManager).mockReturnValue('pnpm');
      // Mock defaultConfig as an object property
      Object.assign(config.defaultConfig, {
        version: '1.0.0',
        componentsDir: './src/components/ui',
        storiesDir: './src/stories',
        hasStorybook: false,
        packageManager: 'pnpm',
        registry: 'https://registry.rafters.dev',
      });

      vi.mocked(dependencies.getCoreDependencies).mockReturnValue(['react', 'typescript']);
      vi.mocked(dependencies.installDependencies).mockResolvedValue();

      vi.mocked(logo.getRaftersLogo).mockReturnValue('ASCII LOGO');
      vi.mocked(logo.getRaftersTitle).mockReturnValue('RAFTERS TITLE');

      const mockStudioTokenSet = {
        id: 'studio-system',
        name: 'My Custom System',
        version: '1.0.0',
        registry: { version: '1.0.0', system: 'studio', tokens: {} },
        manifest: {
          version: '1.0.0',
          system: 'studio',
          name: 'My Custom System',
          categories: [],
          tokenCount: 0,
          created: '',
        },
        css: ':root { --color-primary: blue; }',
        tailwind: '@theme { --color-primary: blue; }',
        reactNative: 'export const tokens = { primary: "blue" };',
      };

      vi.mocked(designTokens.checkTailwindVersion).mockResolvedValue('v4');
      vi.mocked(designTokens.fetchStudioTokens).mockResolvedValue(mockStudioTokenSet);
      vi.mocked(designTokens.writeTokenFiles).mockResolvedValue();
      vi.mocked(designTokens.injectCSSImport).mockResolvedValue();

      // Execute the command
      await initCommand();

      // Verify Studio tokens were fetched
      expect(designTokens.fetchStudioTokens).toHaveBeenCalledWith('ABC123XY');
      expect(designTokens.createDefaultRegistry).not.toHaveBeenCalled();
      expect(designTokens.writeTokenFiles).toHaveBeenCalledWith(
        mockStudioTokenSet,
        'tailwind',
        mockCwd
      );
      expect(designTokens.injectCSSImport).toHaveBeenCalledWith('tailwind', mockCwd);
    });

    it('should fallback to default tokens when Studio API fails', async () => {
      // Mock all required modules
      const { default: inquirer } = await import('inquirer');
      const { default: ora } = await import('ora');
      const designTokens = await import('@rafters/design-tokens');
      const config = await import('../../src/utils/config.js');
      const dependencies = await import('../../src/utils/dependencies.js');
      const logo = await import('../../src/utils/logo.js');

      // Setup mocks
      mockExistsSync.mockImplementation((path) => {
        if (typeof path === 'string' && path.includes('package.json')) return true;
        if (typeof path === 'string' && path.includes('.rafters')) return false;
        return false;
      });

      mockReadFileSync.mockImplementation((path) => {
        if (typeof path === 'string' && path.includes('package.json')) {
          return JSON.stringify({ dependencies: { react: '^18.0.0' } });
        }
        return 'template content';
      });

      vi.mocked(inquirer.prompt).mockResolvedValue({
        hasStorybook: false,
        componentsDir: './src/components/ui',
        studioShortcode: 'INVALID1', // Invalid shortcode
        tokenFormat: 'css',
      });

      const mockSpinner = {
        start: vi.fn().mockReturnThis(),
        succeed: vi.fn().mockReturnThis(),
        fail: vi.fn().mockReturnThis(),
        warn: vi.fn().mockReturnThis(),
      };
      vi.mocked(ora).mockReturnValue(mockSpinner as ReturnType<typeof ora>);

      vi.mocked(config.isNodeProject).mockReturnValue(true);
      vi.mocked(config.hasReact).mockReturnValue(true);
      vi.mocked(config.configExists).mockReturnValue(false);
      vi.mocked(config.detectPackageManager).mockReturnValue('npm');
      // Mock defaultConfig as an object property
      Object.assign(config.defaultConfig, {
        version: '1.0.0',
        componentsDir: './src/components/ui',
        storiesDir: './src/stories',
        hasStorybook: false,
        packageManager: 'npm',
        registry: 'https://registry.rafters.dev',
      });

      vi.mocked(dependencies.getCoreDependencies).mockReturnValue(['react', 'typescript']);
      vi.mocked(dependencies.installDependencies).mockResolvedValue();

      vi.mocked(logo.getRaftersLogo).mockReturnValue('ASCII LOGO');
      vi.mocked(logo.getRaftersTitle).mockReturnValue('RAFTERS TITLE');

      const mockDefaultTokenSet = {
        id: 'grayscale-system',
        name: 'Rafters Grayscale',
        version: '1.0.0',
        registry: { version: '1.0.0', system: 'grayscale', tokens: {} },
        manifest: {
          version: '1.0.0',
          system: 'grayscale',
          name: 'Rafters Grayscale',
          categories: [],
          tokenCount: 0,
          created: '',
        },
        css: ':root { --color-primary: gray; }',
        tailwind: '@theme { --color-primary: gray; }',
        reactNative: 'export const tokens = { primary: "gray" };',
      };

      vi.mocked(designTokens.checkTailwindVersion).mockResolvedValue(null);
      vi.mocked(designTokens.fetchStudioTokens).mockRejectedValue(
        new Error('Studio API error: 404 Not Found')
      );
      vi.mocked(designTokens.createDefaultRegistry).mockReturnValue(mockDefaultTokenSet);
      vi.mocked(designTokens.writeTokenFiles).mockResolvedValue();
      vi.mocked(designTokens.injectCSSImport).mockResolvedValue();

      // Execute the command
      await initCommand();

      // Verify fallback to default
      expect(designTokens.fetchStudioTokens).toHaveBeenCalledWith('INVALID1');
      expect(designTokens.createDefaultRegistry).toHaveBeenCalled();
      expect(mockSpinner.warn).toHaveBeenCalledWith(
        'Failed to fetch Studio tokens: Studio API error: 404 Not Found'
      );
      expect(designTokens.writeTokenFiles).toHaveBeenCalledWith(
        mockDefaultTokenSet,
        'css',
        mockCwd
      );
    });

    it('should exit with error when Tailwind v3 detected', async () => {
      // Mock all required modules
      const { default: inquirer } = await import('inquirer');
      const { default: ora } = await import('ora');
      const designTokens = await import('@rafters/design-tokens');
      const config = await import('../../src/utils/config.js');
      const logo = await import('../../src/utils/logo.js');

      const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      // Setup mocks
      mockExistsSync.mockImplementation((path) => {
        if (typeof path === 'string' && path.includes('package.json')) return true;
        if (typeof path === 'string' && path.includes('.rafters')) return false;
        return false;
      });

      mockReadFileSync.mockImplementation((path) => {
        if (typeof path === 'string' && path.includes('package.json')) {
          return JSON.stringify({ dependencies: { react: '^18.0.0' } });
        }
        return 'template content';
      });

      const mockSpinner = {
        start: vi.fn().mockReturnThis(),
        succeed: vi.fn().mockReturnThis(),
        fail: vi.fn().mockReturnThis(),
        warn: vi.fn().mockReturnThis(),
      };
      vi.mocked(ora).mockReturnValue(mockSpinner as ReturnType<typeof ora>);

      vi.mocked(config.isNodeProject).mockReturnValue(true);
      vi.mocked(config.hasReact).mockReturnValue(true);
      vi.mocked(config.configExists).mockReturnValue(false);

      vi.mocked(logo.getRaftersLogo).mockReturnValue('ASCII LOGO');
      vi.mocked(logo.getRaftersTitle).mockReturnValue('RAFTERS TITLE');

      vi.mocked(designTokens.checkTailwindVersion).mockResolvedValue('v3'); // Tailwind v3 detected

      // Execute and expect process.exit to be called
      await expect(initCommand()).rejects.toThrow('process.exit called');

      expect(mockExit).toHaveBeenCalledWith(1);
      expect(inquirer.prompt).not.toHaveBeenCalled(); // Should exit before prompts
    });
  });
});
