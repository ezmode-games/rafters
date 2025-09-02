import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initCommand } from '../../src/commands/init.js';

// Mock all dependencies
vi.mock('node:fs');
vi.mock('fs-extra');
vi.mock('inquirer');
vi.mock('ora');
vi.mock('@rafters/design-tokens/src');
vi.mock('../../src/utils/config.js');
vi.mock('../../src/utils/dependencies.js');
vi.mock('../../src/utils/logo.js');

const mockExistsSync = vi.mocked(existsSync);
const mockReadFileSync = vi.mocked(readFileSync);
const _mockWriteFileSync = vi.mocked(writeFileSync);

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
        cssFile: './src/app/globals.css',
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
        registry: 'https://rafters.realhandy.tech/registry',
      });

      vi.mocked(dependencies.getCoreDependencies).mockReturnValue(['react', 'typescript']);
      vi.mocked(dependencies.installDependencies).mockResolvedValue();

      vi.mocked(logo.getRaftersLogo).mockReturnValue('ASCII LOGO');
      vi.mocked(logo.getRaftersTitle).mockReturnValue('RAFTERS TITLE');

      const mockTokenSet = {
        id: 'default',
        name: 'Generated Design System',
        tokens: [
          {
            name: 'primary',
            value: 'oklch(0.45 0.12 240)',
            category: 'color',
            namespace: 'color',
          },
        ],
      };

      vi.spyOn(designTokens, 'checkTailwindVersion').mockResolvedValue(null);
      vi.spyOn(designTokens, 'generateAllTokens').mockReturnValue([
        {
          name: 'primary',
          value: 'oklch(0.45 0.12 240)',
          category: 'color',
          namespace: 'color',
        },
      ]);
      vi.spyOn(designTokens, 'fetchStudioTokens').mockResolvedValue(mockTokenSet);
      vi.spyOn(designTokens, 'writeTokenFiles').mockResolvedValue();
      vi.spyOn(designTokens, 'injectCSSImport').mockResolvedValue({
        action: 'created',
        message: 'CSS file created',
      });

      // Execute the command
      await initCommand();

      // Verify default tokens were generated (not fetched from Studio)
      expect(designTokens.generateAllTokens).toHaveBeenCalled();
      expect(designTokens.fetchStudioTokens).not.toHaveBeenCalled();
      expect(designTokens.writeTokenFiles).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'default',
          name: 'Generated Design System',
          tokens: expect.any(Array),
        }),
        'css',
        mockCwd
      );
      expect(designTokens.injectCSSImport).toHaveBeenCalledWith('./src/app/globals.css', mockCwd);
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
        cssFile: './src/app/globals.css',
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
        registry: 'https://rafters.realhandy.tech/registry',
      });

      vi.mocked(dependencies.getCoreDependencies).mockReturnValue(['react', 'typescript']);
      vi.mocked(dependencies.installDependencies).mockResolvedValue();

      vi.mocked(logo.getRaftersLogo).mockReturnValue('ASCII LOGO');
      vi.mocked(logo.getRaftersTitle).mockReturnValue('RAFTERS TITLE');

      const mockStudioTokenSet = {
        id: 'studio-ABC123XY',
        name: 'Studio Theme ABC123XY',
        tokens: [
          {
            name: 'primary',
            value: 'oklch(0.5 0.15 250)',
            category: 'color',
            namespace: 'color',
          },
        ],
      };

      vi.spyOn(designTokens, 'checkTailwindVersion').mockResolvedValue('v4');
      vi.spyOn(designTokens, 'fetchStudioTokens').mockResolvedValue(mockStudioTokenSet);
      vi.spyOn(designTokens, 'writeTokenFiles').mockResolvedValue();
      vi.spyOn(designTokens, 'injectCSSImport').mockResolvedValue({
        action: 'created',
        message: 'CSS file created',
      });

      // Execute the command
      await initCommand();

      // Verify Studio tokens were fetched
      expect(designTokens.fetchStudioTokens).toHaveBeenCalledWith('ABC123XY');
      expect(designTokens.generateAllTokens).not.toHaveBeenCalled();
      expect(designTokens.writeTokenFiles).toHaveBeenCalledWith(
        mockStudioTokenSet,
        'tailwind',
        mockCwd
      );
      expect(designTokens.injectCSSImport).toHaveBeenCalledWith('./src/app/globals.css', mockCwd);
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
        registry: 'https://rafters.realhandy.tech/registry',
      });

      vi.mocked(dependencies.getCoreDependencies).mockReturnValue(['react', 'typescript']);
      vi.mocked(dependencies.installDependencies).mockResolvedValue();

      vi.mocked(logo.getRaftersLogo).mockReturnValue('ASCII LOGO');
      vi.mocked(logo.getRaftersTitle).mockReturnValue('RAFTERS TITLE');

      const mockDefaultTokens = [
        {
          name: 'primary',
          value: 'oklch(0.45 0.12 240)',
          category: 'color',
          namespace: 'color',
        },
      ];

      vi.spyOn(designTokens, 'checkTailwindVersion').mockResolvedValue(null);
      vi.spyOn(designTokens, 'fetchStudioTokens').mockRejectedValue(
        new Error('Studio API error: 404 Not Found')
      );
      vi.spyOn(designTokens, 'generateAllTokens').mockReturnValue(mockDefaultTokens);
      vi.spyOn(designTokens, 'writeTokenFiles').mockResolvedValue();
      vi.spyOn(designTokens, 'injectCSSImport').mockResolvedValue({
        action: 'created',
        message: 'CSS file created',
      });

      // Execute the command
      await initCommand();

      // Verify fallback to default tokens
      expect(designTokens.fetchStudioTokens).toHaveBeenCalledWith('INVALID1');
      expect(designTokens.generateAllTokens).toHaveBeenCalled();
      expect(mockSpinner.warn).toHaveBeenCalledWith(
        'Failed to fetch Studio tokens: Studio API error: 404 Not Found'
      );
      expect(designTokens.writeTokenFiles).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'default',
          name: 'Generated Design System',
          tokens: mockDefaultTokens,
        }),
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

      vi.spyOn(designTokens, 'checkTailwindVersion').mockResolvedValue('v3'); // Tailwind v3 detected

      // Execute and expect process.exit to be called
      await expect(initCommand()).rejects.toThrow('process.exit called');

      expect(mockExit).toHaveBeenCalledWith(1);
      expect(inquirer.prompt).not.toHaveBeenCalled(); // Should exit before prompts
    });
  });
});
