/**
 * Unit tests for Component Preview API endpoint
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  GET,
  getStaticPaths,
} from '../../../../../../src/pages/registry/components/[name]/preview/[variant].json';

// Mock the componentService lib functions
vi.mock('../../../../../../src/lib/registry/componentService', () => ({
  getComponent: vi.fn(),
  getRegistryMetadata: vi.fn(),
}));

import {
  getComponent,
  getRegistryMetadata,
} from '../../../../../../src/lib/registry/componentService';

describe('Component Preview API ([name]/preview/[variant].json.ts)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('getStaticPaths', () => {
    it('should generate paths for all component preview variants', async () => {
      const mockButton = {
        name: 'button',
        meta: {
          rafters: {
            previews: [
              { variant: 'default', framework: 'react' },
              { variant: 'primary', framework: 'react' },
            ],
          },
        },
      };

      const mockInput = {
        name: 'input',
        meta: {
          rafters: {
            previews: [{ variant: 'default', framework: 'react' }],
          },
        },
      };

      vi.mocked(getRegistryMetadata).mockReturnValue({
        components: [{ name: 'button' }, { name: 'input' }],
      });

      vi.mocked(getComponent).mockReturnValueOnce(mockButton).mockReturnValueOnce(mockInput);

      const paths = await getStaticPaths();

      expect(paths).toEqual([
        { params: { name: 'button', variant: 'default' } },
        { params: { name: 'button', variant: 'primary' } },
        { params: { name: 'input', variant: 'default' } },
      ]);
    });

    it('should handle components without previews', async () => {
      const mockComponent = {
        name: 'card',
        meta: {
          rafters: {},
        },
      };

      vi.mocked(getRegistryMetadata).mockReturnValue({
        components: [{ name: 'card' }],
      });

      vi.mocked(getComponent).mockReturnValue(mockComponent);

      const paths = await getStaticPaths();

      expect(paths).toEqual([]);
    });

    it('should handle empty component list', async () => {
      vi.mocked(getRegistryMetadata).mockReturnValue({
        components: [],
      });

      const paths = await getStaticPaths();

      expect(paths).toEqual([]);
    });
  });

  describe('GET handler', () => {
    it('should return preview with CVA, CSS, and dependencies', async () => {
      const mockCVA = {
        baseClasses: ['inline-flex', 'items-center'],
        propMappings: [
          {
            propName: 'variant',
            values: {
              primary: ['bg-blue-600'],
              secondary: ['bg-gray-200'],
            },
          },
        ],
        allClasses: ['inline-flex', 'items-center', 'bg-blue-600', 'bg-gray-200'],
      };

      const mockComponent = {
        name: 'button',
        dependencies: ['react', 'class-variance-authority'],
        meta: {
          rafters: {
            intelligence: {
              cva: {
                ...mockCVA,
                css: '.inline-flex { display: inline-flex; }',
              },
            },
            previews: [
              {
                framework: 'react',
                variant: 'default',
                props: {},
                compiledJs: 'export default function Button() { return null; }',
                sizeBytes: 1024,
              },
            ],
          },
        },
      };

      vi.mocked(getComponent).mockReturnValue(mockComponent);

      const response = await GET({ params: { name: 'button', variant: 'default' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/json');
      expect(response.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable');

      expect(data).toMatchObject({
        framework: 'react',
        variant: 'default',
        compiledJs: 'export default function Button() { return null; }',
        sizeBytes: 1024,
        cva: mockCVA,
        css: '.inline-flex { display: inline-flex; }',
        dependencies: ['react', 'class-variance-authority'],
      });
    });

    it('should return 400 when component name is missing', async () => {
      const response = await GET({ params: { name: '', variant: 'default' } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Component name and variant are required' });
    });

    it('should return 400 when variant is missing', async () => {
      const response = await GET({ params: { name: 'button', variant: '' } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Component name and variant are required' });
    });

    it('should return 404 when component not found', async () => {
      vi.mocked(getComponent).mockReturnValue(null);

      const response = await GET({ params: { name: 'nonexistent', variant: 'default' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: 'Component not found' });
    });

    it('should return 404 when preview variant not found', async () => {
      const mockComponent = {
        name: 'button',
        meta: {
          rafters: {
            previews: [
              {
                framework: 'react',
                variant: 'default',
                props: {},
                compiledJs: 'code',
                sizeBytes: 100,
              },
            ],
          },
        },
      };

      vi.mocked(getComponent).mockReturnValue(mockComponent);

      const response = await GET({ params: { name: 'button', variant: 'nonexistent' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: 'Preview variant not found' });
    });

    it('should return 500 when CVA intelligence is missing', async () => {
      const mockComponent = {
        name: 'button',
        dependencies: ['react'],
        meta: {
          rafters: {
            intelligence: {},
            previews: [
              {
                framework: 'react',
                variant: 'default',
                props: {},
                compiledJs: 'code',
                sizeBytes: 100,
              },
            ],
          },
        },
      };

      vi.mocked(getComponent).mockReturnValue(mockComponent);

      const response = await GET({ params: { name: 'button', variant: 'default' } });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'CVA intelligence not found for preview' });
    });

    it('should handle undefined dependencies gracefully', async () => {
      const mockCVA = {
        baseClasses: ['btn'],
        propMappings: [],
        allClasses: ['btn'],
        css: '.btn { }',
      };

      const mockComponent = {
        name: 'button',
        meta: {
          rafters: {
            intelligence: {
              cva: mockCVA,
            },
            previews: [
              {
                framework: 'react',
                variant: 'default',
                props: {},
                compiledJs: 'code',
                sizeBytes: 100,
              },
            ],
          },
        },
      };

      vi.mocked(getComponent).mockReturnValue(mockComponent);

      const response = await GET({ params: { name: 'button', variant: 'default' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.dependencies).toEqual([]);
    });

    it('should return 500 when CSS is missing from CVA intelligence', async () => {
      const mockCVA = {
        baseClasses: ['btn'],
        propMappings: [],
        allClasses: ['btn'],
      };

      const mockComponent = {
        name: 'button',
        dependencies: ['react'],
        meta: {
          rafters: {
            intelligence: {
              cva: mockCVA,
            },
            previews: [
              {
                framework: 'react',
                variant: 'default',
                props: {},
                compiledJs: 'code',
                sizeBytes: 100,
              },
            ],
          },
        },
      };

      vi.mocked(getComponent).mockReturnValue(mockComponent);

      const response = await GET({ params: { name: 'button', variant: 'default' } });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'CSS for CVA intelligence is missing or empty' });
    });
  });
});
