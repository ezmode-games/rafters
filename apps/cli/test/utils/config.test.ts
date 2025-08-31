import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  type Config,
  ConfigSchema,
  configExists,
  detectPackageManager,
  getConfigPath,
  hasReact,
  isNodeProject,
  loadConfig,
  saveConfig,
} from '../../src/utils/config.js';

// Mock file system operations
vi.mock('node:fs');
const mockExistsSync = vi.mocked(existsSync);
const mockReadFileSync = vi.mocked(readFileSync);
const mockWriteFileSync = vi.mocked(writeFileSync);

describe('config', () => {
  const mockCwd = '/test/project';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ConfigSchema', () => {
    it('should validate valid config', () => {
      const validConfig = {
        version: '1.0.0',
        componentsDir: 'src/components',
        packageManager: 'npm' as const,
        registry: 'https://rafters.realhandy.tech/registry',
      };

      expect(() => ConfigSchema.parse(validConfig)).not.toThrow();
    });

    it('should reject invalid package manager', () => {
      const invalidConfig = {
        version: '1.0.0',
        componentsDir: 'src/components',
        packageManager: 'invalid', // This will fail Zod validation since it's not 'npm' | 'yarn' | 'pnpm'
        registry: 'https://rafters.realhandy.tech/registry',
      };

      expect(() => ConfigSchema.parse(invalidConfig)).toThrow();
    });

    it('should reject invalid registry URL', () => {
      const invalidConfig = {
        version: '1.0.0',
        componentsDir: 'src/components',
        packageManager: 'npm' as const,
        registry: 'not-a-url',
      };

      expect(() => ConfigSchema.parse(invalidConfig)).toThrow();
    });

    it('should allow optional storiesDir', () => {
      const configWithStories = {
        version: '1.0.0',
        componentsDir: 'src/components',
        storiesDir: 'src/stories',
        hasStorybook: true,
        packageManager: 'pnpm' as const,
        registry: 'https://rafters.realhandy.tech/registry',
      };

      expect(() => ConfigSchema.parse(configWithStories)).not.toThrow();
    });
  });

  describe('getConfigPath', () => {
    it('should return correct config path', () => {
      const result = getConfigPath(mockCwd);
      expect(result).toBe(join(mockCwd, '.rafters', 'config.json'));
    });

    it('should use process.cwd() when no path provided', () => {
      const spy = vi.spyOn(process, 'cwd').mockReturnValue('/current/dir');
      const result = getConfigPath();
      expect(result).toBe(join('/current/dir', '.rafters', 'config.json'));
      spy.mockRestore();
    });
  });

  describe('configExists', () => {
    it('should return true when config exists', () => {
      mockExistsSync.mockReturnValue(true);
      expect(configExists(mockCwd)).toBe(true);
      expect(mockExistsSync).toHaveBeenCalledWith(join(mockCwd, '.rafters', 'config.json'));
    });

    it('should return false when config does not exist', () => {
      mockExistsSync.mockReturnValue(false);
      expect(configExists(mockCwd)).toBe(false);
    });
  });

  describe('loadConfig', () => {
    const validConfigJson = JSON.stringify({
      version: '1.0.0',
      componentsDir: 'src/components',
      packageManager: 'npm',
      registry: 'https://rafters.realhandy.tech/registry',
    });

    it('should load valid config', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(validConfigJson);

      const result = loadConfig(mockCwd);
      expect(result).toEqual({
        version: '1.0.0',
        componentsDir: 'src/components',
        packageManager: 'npm',
        registry: 'https://rafters.realhandy.tech/registry',
      });
    });

    it('should throw when config file does not exist', () => {
      mockExistsSync.mockReturnValue(false);

      expect(() => loadConfig(mockCwd)).toThrow(
        'Rafters not initialized. Run `rafters init` first.'
      );
    });

    it('should throw when config file has invalid JSON', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('invalid json');

      expect(() => loadConfig(mockCwd)).toThrow('Invalid config file:');
    });

    it('should throw when config fails schema validation', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(JSON.stringify({ invalid: 'config' }));

      expect(() => loadConfig(mockCwd)).toThrow('Invalid config file:');
    });
  });

  describe('saveConfig', () => {
    it('should save config to file', () => {
      const config: Config = {
        version: '1.0.0',
        componentsDir: 'src/components',
        hasStorybook: true,
        packageManager: 'pnpm',
        registry: 'https://rafters.realhandy.tech/registry',
      };

      saveConfig(config, mockCwd);

      expect(mockWriteFileSync).toHaveBeenCalledWith(
        join(mockCwd, '.rafters', 'config.json'),
        JSON.stringify(config, null, 2)
      );
    });
  });

  describe('detectPackageManager', () => {
    it('should detect pnpm', () => {
      mockExistsSync.mockImplementation((path) => path.includes('pnpm-lock.yaml'));
      expect(detectPackageManager(mockCwd)).toBe('pnpm');
    });

    it('should detect yarn', () => {
      mockExistsSync.mockImplementation(
        (path) => path.includes('yarn.lock') && !path.includes('pnpm-lock.yaml')
      );
      expect(detectPackageManager(mockCwd)).toBe('yarn');
    });

    it('should default to npm', () => {
      mockExistsSync.mockReturnValue(false);
      expect(detectPackageManager(mockCwd)).toBe('npm');
    });
  });

  describe('isNodeProject', () => {
    it('should return true when package.json exists', () => {
      mockExistsSync.mockReturnValue(true);
      expect(isNodeProject(mockCwd)).toBe(true);
      expect(mockExistsSync).toHaveBeenCalledWith(join(mockCwd, 'package.json'));
    });

    it('should return false when package.json does not exist', () => {
      mockExistsSync.mockReturnValue(false);
      expect(isNodeProject(mockCwd)).toBe(false);
    });
  });

  describe('hasReact', () => {
    it('should return true when React is in dependencies', () => {
      const packageJson = JSON.stringify({
        dependencies: { react: '^19.0.0' },
      });

      mockReadFileSync.mockReturnValue(packageJson);
      expect(hasReact(mockCwd)).toBe(true);
    });

    it('should return true when React is in devDependencies', () => {
      const packageJson = JSON.stringify({
        devDependencies: { react: '^19.0.0' },
      });

      mockReadFileSync.mockReturnValue(packageJson);
      expect(hasReact(mockCwd)).toBe(true);
    });

    it('should return false when React is not present', () => {
      const packageJson = JSON.stringify({
        dependencies: { lodash: '^4.0.0' },
      });

      mockReadFileSync.mockReturnValue(packageJson);
      expect(hasReact(mockCwd)).toBe(false);
    });

    it('should return false when package.json cannot be read', () => {
      mockReadFileSync.mockImplementation(() => {
        throw new Error('File not found');
      });

      expect(hasReact(mockCwd)).toBe(false);
    });
  });
});
