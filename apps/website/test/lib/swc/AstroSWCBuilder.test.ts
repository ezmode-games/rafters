/**
 * Unit tests for AstroSWCBuilder
 *
 * Tests the complete build-time orchestration:
 * - Single component builds
 * - Parallel component builds
 * - Error handling per phase
 * - Intelligence metadata extraction
 * - Build caching
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AstroSWCBuilder } from '../../../src/lib/swc/AstroSWCBuilder';
import * as ReactSSRExecutor from '../../../src/lib/swc/ReactSSRExecutor';
// Import the actual modules to mock specific methods
import * as RegistryFetcher from '../../../src/lib/swc/RegistryFetcher';
import * as SWCCompiler from '../../../src/lib/swc/SWCCompiler';

vi.mock('../../../src/lib/swc/RegistryFetcher');
vi.mock('../../../src/lib/swc/SWCCompiler');
vi.mock('../../../src/lib/swc/ReactSSRExecutor');

describe('AstroSWCBuilder', () => {
  let builder: AstroSWCBuilder;

  beforeEach(() => {
    vi.clearAllMocks();
    builder = new AstroSWCBuilder({
      componentTimeout: 3000,
      enableSourceMaps: false,
    });
  });

  describe('initialization', () => {
    it('should create builder with default config', () => {
      const defaultBuilder = new AstroSWCBuilder();
      expect(defaultBuilder).toBeDefined();
    });

    it('should create builder with custom config', () => {
      const customBuilder = new AstroSWCBuilder({
        componentTimeout: 10000,
        enableSourceMaps: true,
      });
      expect(customBuilder).toBeDefined();
    });
  });

  describe('buildComponentPreview', () => {
    it('should build simple component successfully', async () => {
      // Mock successful pipeline
      vi.mocked(
        RegistryFetcher.RegistryComponentFetcher.prototype.fetchComponent
      ).mockResolvedValue({
        component: {
          name: 'button',
          type: 'registry:ui',
          description: 'A button component',
          dependencies: [],
          files: [
            {
              path: 'button.tsx',
              content: 'export default ({ children }) => <button>{children}</button>',
              type: 'registry:ui',
            },
          ],
        },
        fromCache: false,
        fetchTime: 100,
        registryUrl: 'https://example.com',
      });

      vi.mocked(SWCCompiler.SWCCompiler.prototype.init).mockResolvedValue();

      vi.mocked(SWCCompiler.SWCCompiler.prototype.compile).mockResolvedValue({
        code: 'module.exports = { default: () => {} }',
        cacheHit: false,
        compilationTime: 50,
        sourceHash: 'abc123',
      });

      vi.mocked(ReactSSRExecutor.ReactSSRExecutor.prototype.execute).mockResolvedValue({
        html: '<button>Click Me</button>',
        renderTime: 10,
        componentName: 'button',
        props: { children: 'Click Me' },
      });

      const result = await builder.buildComponentPreview('button', {
        children: 'Click Me',
      });

      expect(result.componentName).toBe('button');
      expect(result.htmlOutput).toContain('<button>');
      expect(result.htmlOutput).toContain('Click Me');
      expect(result.buildTime).toBeGreaterThanOrEqual(0);
      expect(result.props).toEqual({ children: 'Click Me' });
    });

    it('should extract intelligence metadata when available', async () => {
      const intelligence = {
        cognitiveLoad: 3,
        attentionEconomics: 'Low cognitive load',
        trustBuilding: 'Familiar pattern',
        accessibility: 'WCAG AAA',
        semanticMeaning: 'Action trigger',
      };

      vi.mocked(
        RegistryFetcher.RegistryComponentFetcher.prototype.fetchComponent
      ).mockResolvedValue({
        component: {
          name: 'button',
          type: 'registry:ui',
          description: 'Button',
          dependencies: [],
          files: [
            {
              path: 'button.tsx',
              content: 'export default () => <button>Test</button>',
              type: 'registry:ui',
            },
          ],
          meta: {
            rafters: {
              version: '1.0.0',
              intelligence,
            },
          },
        },
        fromCache: false,
        fetchTime: 100,
        registryUrl: 'https://example.com',
      });

      vi.mocked(SWCCompiler.SWCCompiler.prototype.init).mockResolvedValue();
      vi.mocked(SWCCompiler.SWCCompiler.prototype.compile).mockResolvedValue({
        code: 'module.exports = { default: () => {} }',
        cacheHit: false,
        compilationTime: 50,
        sourceHash: 'abc123',
      });

      vi.mocked(ReactSSRExecutor.ReactSSRExecutor.prototype.execute).mockResolvedValue({
        html: '<button>Test</button>',
        renderTime: 10,
        componentName: 'button',
        props: {},
      });

      const result = await builder.buildComponentPreview('button');

      expect(result.intelligence).toEqual(intelligence);
    });

    it('should handle components without intelligence metadata', async () => {
      vi.mocked(
        RegistryFetcher.RegistryComponentFetcher.prototype.fetchComponent
      ).mockResolvedValue({
        component: {
          name: 'button',
          type: 'registry:ui',
          description: 'Button',
          dependencies: [],
          files: [
            {
              path: 'button.tsx',
              content: 'export default () => <button>Test</button>',
              type: 'registry:ui',
            },
          ],
        },
        fromCache: false,
        fetchTime: 100,
        registryUrl: 'https://example.com',
      });

      vi.mocked(SWCCompiler.SWCCompiler.prototype.init).mockResolvedValue();
      vi.mocked(SWCCompiler.SWCCompiler.prototype.compile).mockResolvedValue({
        code: 'module.exports = { default: () => {} }',
        cacheHit: false,
        compilationTime: 50,
        sourceHash: 'abc123',
      });

      vi.mocked(ReactSSRExecutor.ReactSSRExecutor.prototype.execute).mockResolvedValue({
        html: '<button>Test</button>',
        renderTime: 10,
        componentName: 'button',
        props: {},
      });

      const result = await builder.buildComponentPreview('button');

      expect(result.intelligence).toBeNull();
    });

    it('should report cache hits correctly', async () => {
      vi.mocked(
        RegistryFetcher.RegistryComponentFetcher.prototype.fetchComponent
      ).mockResolvedValue({
        component: {
          name: 'button',
          type: 'registry:ui',
          description: 'Button',
          dependencies: [],
          files: [
            {
              path: 'button.tsx',
              content: 'export default () => <button>Test</button>',
              type: 'registry:ui',
            },
          ],
        },
        fromCache: true,
        fetchTime: 1,
        registryUrl: 'https://example.com',
      });

      vi.mocked(SWCCompiler.SWCCompiler.prototype.init).mockResolvedValue();
      vi.mocked(SWCCompiler.SWCCompiler.prototype.compile).mockResolvedValue({
        code: 'module.exports = { default: () => {} }',
        cacheHit: true,
        compilationTime: 1,
        sourceHash: 'abc123',
      });

      vi.mocked(ReactSSRExecutor.ReactSSRExecutor.prototype.execute).mockResolvedValue({
        html: '<button>Test</button>',
        renderTime: 1,
        componentName: 'button',
        props: {},
      });

      const result = await builder.buildComponentPreview('button');

      expect(result.cacheHit).toBe(true);
      expect(result.buildTime).toBeLessThan(100);
    });
  });

  describe('buildMultipleComponents', () => {
    it('should build multiple components in parallel', async () => {
      vi.mocked(
        RegistryFetcher.RegistryComponentFetcher.prototype.fetchComponent
      ).mockImplementation((name: string) =>
        Promise.resolve({
          component: {
            name,
            type: 'registry:ui',
            description: `${name} component`,
            dependencies: [],
            files: [
              {
                path: `${name}.tsx`,
                content: `export default () => <div>${name}</div>`,
                type: 'registry:ui',
              },
            ],
          },
          fromCache: false,
          fetchTime: 100,
          registryUrl: 'https://example.com',
        })
      );

      vi.mocked(SWCCompiler.SWCCompiler.prototype.init).mockResolvedValue();
      vi.mocked(SWCCompiler.SWCCompiler.prototype.compile).mockResolvedValue({
        code: 'module.exports = { default: () => {} }',
        cacheHit: false,
        compilationTime: 50,
        sourceHash: 'abc123',
      });

      vi.mocked(ReactSSRExecutor.ReactSSRExecutor.prototype.execute).mockImplementation(
        (_code, props, options) =>
          Promise.resolve({
            html: `<div>${options?.componentName || 'test'}</div>`,
            renderTime: 10,
            componentName: options?.componentName || 'test',
            props: props ?? {},
          })
      );

      const results = await builder.buildMultipleComponents([
        { name: 'button', props: { variant: 'primary' } },
        { name: 'card', props: { title: 'Test Card' } },
        { name: 'input', props: { type: 'text' } },
      ]);

      expect(results.size).toBe(3);
      expect(results.has('button')).toBe(true);
      expect(results.has('card')).toBe(true);
      expect(results.has('input')).toBe(true);
    });

    it('should isolate errors and continue building other components', async () => {
      vi.mocked(
        RegistryFetcher.RegistryComponentFetcher.prototype.fetchComponent
      ).mockImplementation((name: string) => {
        if (name === 'failing-component') {
          return Promise.reject(new Error('Component not found'));
        }
        return Promise.resolve({
          component: {
            name,
            type: 'registry:ui',
            description: `${name} component`,
            dependencies: [],
            files: [
              {
                path: `${name}.tsx`,
                content: `export default () => <div>${name}</div>`,
                type: 'registry:ui',
              },
            ],
          },
          fromCache: false,
          fetchTime: 100,
          registryUrl: 'https://example.com',
        });
      });

      vi.mocked(SWCCompiler.SWCCompiler.prototype.init).mockResolvedValue();
      vi.mocked(SWCCompiler.SWCCompiler.prototype.compile).mockResolvedValue({
        code: 'module.exports = { default: () => {} }',
        cacheHit: false,
        compilationTime: 50,
        sourceHash: 'abc123',
      });

      vi.mocked(ReactSSRExecutor.ReactSSRExecutor.prototype.execute).mockResolvedValue({
        html: '<div>Test</div>',
        renderTime: 10,
        componentName: 'test',
        props: {},
      });

      const results = await builder.buildMultipleComponents([
        { name: 'button' },
        { name: 'failing-component' },
        { name: 'card' },
      ]);

      expect(results.size).toBe(2);
      expect(results.has('button')).toBe(true);
      expect(results.has('failing-component')).toBe(false);
      expect(results.has('card')).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should throw AstroSWCError for fetch phase failures', async () => {
      const registryError = new Error('Component not found') as Error & { name: string };
      registryError.name = 'RegistryError';

      vi.mocked(
        RegistryFetcher.RegistryComponentFetcher.prototype.fetchComponent
      ).mockRejectedValue(registryError);

      vi.mocked(SWCCompiler.SWCCompiler.prototype.init).mockResolvedValue();

      await expect(builder.buildComponentPreview('missing-component')).rejects.toMatchObject({
        name: 'AstroSWCError',
        componentName: 'missing-component',
        phase: 'fetch',
      });
    });

    it('should throw AstroSWCError for compile phase failures', async () => {
      vi.mocked(
        RegistryFetcher.RegistryComponentFetcher.prototype.fetchComponent
      ).mockResolvedValue({
        component: {
          name: 'button',
          type: 'registry:ui',
          description: 'Button',
          dependencies: [],
          files: [
            {
              path: 'button.tsx',
              content: 'invalid typescript code!!!',
              type: 'registry:ui',
            },
          ],
        },
        fromCache: false,
        fetchTime: 100,
        registryUrl: 'https://example.com',
      });

      vi.mocked(SWCCompiler.SWCCompiler.prototype.init).mockResolvedValue();

      const compilationError = new Error('Syntax error') as Error & { name: string };
      compilationError.name = 'CompilationError';

      vi.mocked(SWCCompiler.SWCCompiler.prototype.compile).mockRejectedValue(compilationError);

      await expect(builder.buildComponentPreview('button')).rejects.toMatchObject({
        name: 'AstroSWCError',
        componentName: 'button',
        phase: 'compile',
      });
    });

    it('should throw AstroSWCError for execute phase failures', async () => {
      vi.mocked(
        RegistryFetcher.RegistryComponentFetcher.prototype.fetchComponent
      ).mockResolvedValue({
        component: {
          name: 'button',
          type: 'registry:ui',
          description: 'Button',
          dependencies: [],
          files: [
            {
              path: 'button.tsx',
              content: 'export default () => <button>Test</button>',
              type: 'registry:ui',
            },
          ],
        },
        fromCache: false,
        fetchTime: 100,
        registryUrl: 'https://example.com',
      });

      vi.mocked(SWCCompiler.SWCCompiler.prototype.init).mockResolvedValue();
      vi.mocked(SWCCompiler.SWCCompiler.prototype.compile).mockResolvedValue({
        code: 'invalid runtime code',
        cacheHit: false,
        compilationTime: 50,
        sourceHash: 'abc123',
      });

      const executionError = new Error('Runtime error') as Error & { name: string };
      executionError.name = 'ExecutionError';

      vi.mocked(ReactSSRExecutor.ReactSSRExecutor.prototype.execute).mockRejectedValue(
        executionError
      );

      await expect(builder.buildComponentPreview('button')).rejects.toMatchObject({
        name: 'AstroSWCError',
        componentName: 'button',
        phase: 'execute',
      });
    });

    it('should throw AstroSWCError when component has no files', async () => {
      vi.mocked(
        RegistryFetcher.RegistryComponentFetcher.prototype.fetchComponent
      ).mockResolvedValue({
        component: {
          name: 'empty',
          type: 'registry:ui',
          description: 'Empty',
          dependencies: [],
          files: [],
        },
        fromCache: false,
        fetchTime: 100,
        registryUrl: 'https://example.com',
      });

      vi.mocked(SWCCompiler.SWCCompiler.prototype.init).mockResolvedValue();

      await expect(builder.buildComponentPreview('empty')).rejects.toMatchObject({
        name: 'AstroSWCError',
        componentName: 'empty',
        phase: 'fetch',
      });
    });
  });

  describe('performance', () => {
    it('should complete cached build quickly', async () => {
      vi.mocked(
        RegistryFetcher.RegistryComponentFetcher.prototype.fetchComponent
      ).mockResolvedValue({
        component: {
          name: 'button',
          type: 'registry:ui',
          description: 'Button',
          dependencies: [],
          files: [
            {
              path: 'button.tsx',
              content: 'export default () => <button>Test</button>',
              type: 'registry:ui',
            },
          ],
        },
        fromCache: true,
        fetchTime: 1,
        registryUrl: 'https://example.com',
      });

      vi.mocked(SWCCompiler.SWCCompiler.prototype.init).mockResolvedValue();
      vi.mocked(SWCCompiler.SWCCompiler.prototype.compile).mockResolvedValue({
        code: 'module.exports = { default: () => {} }',
        cacheHit: true,
        compilationTime: 1,
        sourceHash: 'abc123',
      });

      vi.mocked(ReactSSRExecutor.ReactSSRExecutor.prototype.execute).mockResolvedValue({
        html: '<button>Test</button>',
        renderTime: 1,
        componentName: 'button',
        props: {},
      });

      const result = await builder.buildComponentPreview('button');

      expect(result.cacheHit).toBe(true);
      expect(result.buildTime).toBeLessThan(100);
    });
  });
});
