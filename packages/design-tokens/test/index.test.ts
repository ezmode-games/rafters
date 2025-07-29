import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  checkTailwindVersion,
  createDefaultRegistry,
  fetchStudioTokens,
  injectCSSImport,
  writeTokenFiles,
} from '../src/index.js';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock fs-extra
vi.mock('fs-extra', () => ({
  ensureDir: vi.fn(),
  writeFile: vi.fn(),
  pathExists: vi.fn(),
  readFile: vi.fn(),
  ensureFile: vi.fn(),
  readJson: vi.fn(),
}));

// Mock node:path
vi.mock('node:path', () => ({
  join: vi.fn((...args: string[]) => args.join('/')),
}));

describe('design-tokens', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchStudioTokens', () => {
    it('should fetch tokens successfully from Studio API', async () => {
      const mockTokenSet = {
        id: 'test-system',
        name: 'Test System',
        version: '1.0.0',
        registry: { version: '1.0.0', system: 'test', tokens: {} },
        manifest: { version: '1.0.0', system: 'test', name: 'Test' },
        css: ':root {}',
        tailwind: '@theme {}',
        reactNative: 'export const tokens = {};',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTokenSet),
      });

      const result = await fetchStudioTokens('ABC123');

      expect(result).toEqual(mockTokenSet);
      expect(mockFetch).toHaveBeenCalledWith('https://rafters.realhandy.tech/studio/ABC123', {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'rafters-cli/1.0.0',
        },
        signal: expect.any(AbortSignal),
      });
    });

    it('should throw error on API failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(fetchStudioTokens('INVALID')).rejects.toThrow('Studio API error: 404 Not Found');
    });

    it('should handle network timeouts', async () => {
      mockFetch.mockRejectedValueOnce(
        Object.assign(new Error('Request timeout'), { name: 'AbortError' })
      );

      await expect(fetchStudioTokens('ABC123')).rejects.toThrow(
        'Studio request timed out. Please try again.'
      );
    });
  });

  describe('createDefaultRegistry', () => {
    it('should create default grayscale token set', () => {
      const result = createDefaultRegistry();

      expect(result).toMatchObject({
        name: 'Rafters Grayscale',
        version: '1.0.0',
        registry: expect.objectContaining({
          version: '1.0.0',
          tokens: expect.objectContaining({
            colors: expect.any(Object),
            typography: expect.any(Object),
            spacing: expect.any(Object),
            state: expect.any(Object),
            semantic: expect.any(Object),
          }),
        }),
        manifest: expect.objectContaining({
          version: '1.0.0',
          name: 'Rafters Grayscale',
          categories: ['colors', 'typography', 'spacing', 'state', 'semantic'],
        }),
        css: expect.stringContaining(':root {'),
        tailwind: expect.stringContaining('@theme {'),
        reactNative: expect.stringContaining('export const designTokens'),
      });
    });
  });

  describe('writeTokenFiles', () => {
    it('should write registry, manifest, and CSS files', async () => {
      const mockFs = await import('fs-extra');

      const mockTokenSet = {
        id: 'test-system',
        name: 'Test System',
        version: '1.0.0',
        registry: { version: '1.0.0', system: 'test', tokens: {} },
        manifest: {
          version: '1.0.0',
          system: 'test',
          name: 'Test',
          categories: [],
          tokenCount: 0,
          created: '',
        },
        css: ':root { --color-primary: red; }',
        tailwind: '@theme { --color-primary: red; }',
        reactNative: 'export const tokens = { primary: "red" };',
      };

      await writeTokenFiles(mockTokenSet, 'css', '/test/project');

      expect(mockFs.ensureDir).toHaveBeenCalledWith('/test/project/.rafters/tokens');
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        '/test/project/.rafters/tokens/registry.json',
        JSON.stringify(mockTokenSet.registry, null, 2)
      );
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        '/test/project/.rafters/tokens/manifest.json',
        JSON.stringify(mockTokenSet.manifest, null, 2)
      );
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        '/test/project/src/design-tokens.css',
        mockTokenSet.css
      );
    });

    it('should write TypeScript file for React Native format', async () => {
      const mockFs = await import('fs-extra');

      const mockTokenSet = {
        id: 'test-system',
        name: 'Test System',
        version: '1.0.0',
        registry: { version: '1.0.0', system: 'test', tokens: {} },
        manifest: {
          version: '1.0.0',
          system: 'test',
          name: 'Test',
          categories: [],
          tokenCount: 0,
          created: '',
        },
        css: ':root {}',
        tailwind: '@theme {}',
        reactNative: 'export const tokens = {};',
      };

      await writeTokenFiles(mockTokenSet, 'react-native', '/test/project');

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        '/test/project/src/design-tokens.ts',
        mockTokenSet.reactNative
      );
    });
  });

  describe('injectCSSImport', () => {
    it('should inject import into existing CSS file', async () => {
      const mockFs = await import('fs-extra');

      mockFs.pathExists.mockResolvedValueOnce(true);
      mockFs.readFile.mockResolvedValueOnce('body { margin: 0; }');

      await injectCSSImport('css', '/test/project');

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        '/test/project/src/index.css',
        '@import "./design-tokens.css";\nbody { margin: 0; }'
      );
    });

    it('should create CSS file if none exists', async () => {
      const mockFs = await import('fs-extra');

      mockFs.pathExists.mockResolvedValue(false);
      mockFs.readFile.mockRejectedValueOnce(new Error('File not found'));

      await injectCSSImport('css', '/test/project');

      expect(mockFs.ensureFile).toHaveBeenCalledWith('/test/project/src/index.css');
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        '/test/project/src/index.css',
        '@import "./design-tokens.css";\n'
      );
    });

    it('should skip import if already exists', async () => {
      const mockFs = await import('fs-extra');

      mockFs.pathExists.mockResolvedValueOnce(true);
      mockFs.readFile.mockResolvedValueOnce('@import "./design-tokens.css";\nbody { margin: 0; }');

      await injectCSSImport('css', '/test/project');

      expect(mockFs.writeFile).not.toHaveBeenCalled();
    });

    it('should skip for React Native format', async () => {
      const mockFs = await import('fs-extra');

      await injectCSSImport('react-native', '/test/project');

      expect(mockFs.pathExists).not.toHaveBeenCalled();
    });
  });

  describe('checkTailwindVersion', () => {
    it('should detect Tailwind v3', async () => {
      const mockFs = await import('fs-extra');

      mockFs.readJson.mockResolvedValueOnce({
        devDependencies: {
          tailwindcss: '^3.4.0',
        },
      });

      const result = await checkTailwindVersion('/test/project');

      expect(result).toBe('v3');
    });

    it('should detect Tailwind v4', async () => {
      const mockFs = await import('fs-extra');

      mockFs.readJson.mockResolvedValueOnce({
        dependencies: {
          tailwindcss: '^4.0.0',
        },
      });

      const result = await checkTailwindVersion('/test/project');

      expect(result).toBe('v4');
    });

    it('should return null if Tailwind not found', async () => {
      const mockFs = await import('fs-extra');

      mockFs.readJson.mockResolvedValueOnce({
        dependencies: {
          react: '^18.0.0',
        },
      });

      const result = await checkTailwindVersion('/test/project');

      expect(result).toBeNull();
    });

    it('should handle package.json read errors', async () => {
      const mockFs = await import('fs-extra');

      mockFs.readJson.mockRejectedValueOnce(new Error('File not found'));

      const result = await checkTailwindVersion('/test/project');

      expect(result).toBeNull();
    });
  });
});
