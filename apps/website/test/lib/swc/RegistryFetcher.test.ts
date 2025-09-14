/**
 * Registry Component Fetcher Tests - Issue #130
 *
 * Comprehensive tests for the Registry Component Fetcher including
 * caching, error handling, and validation.
 */

import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { RegistryComponentFetcher } from '../../../src/lib/swc/RegistryFetcher';
import type { RegistryComponent, RegistryError } from '../../../src/lib/swc/types';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('RegistryComponentFetcher', () => {
  let fetcher: RegistryComponentFetcher;
  let mockComponent: RegistryComponent;

  beforeEach(() => {
    fetcher = new RegistryComponentFetcher();
    mockComponent = {
      name: 'button',
      type: 'registry:component',
      description: 'A button component',
      dependencies: ['react'],
      files: [
        {
          path: 'ui/button.tsx',
          content: 'export default function Button() { return <button>Click me</button>; }',
          type: 'registry:component',
        },
      ],
      meta: {
        rafters: {
          version: '1.0.0',
          intelligence: {
            cognitiveLoad: 3,
            attentionEconomics: 'Size hierarchy: sm=tertiary, md=secondary, lg=primary',
            accessibility: 'WCAG AAA compliant',
            trustBuilding: 'Destructive actions require confirmation',
            semanticMeaning: 'Primary=main actions',
            usagePatterns: {
              dos: ['Use for primary actions'],
              nevers: ['Never use for destructive actions without confirmation'],
            },
            designGuides: [],
            examples: [],
          },
        },
      },
    };
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchComponent', () => {
    it('should fetch component successfully from registry', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockComponent),
      });

      const result = await fetcher.fetchComponent('button');

      expect(result.component.name).toBe('button');
      expect(result.component.files).toHaveLength(1);
      expect(result.component.files[0].content).toContain('export');
      expect(result.fromCache).toBe(false);
      expect(result.fetchTime).toBeGreaterThan(0);
      expect(result.registryUrl).toContain('/registry/components/button');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://rafters.realhandy.tech/registry/components/button',
        {
          signal: expect.any(AbortSignal),
          headers: {
            Accept: 'application/json',
            'User-Agent': 'rafters-swc/1.0.0',
          },
        }
      );
    });

    it('should return cached result on second fetch', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockComponent),
      });

      // First fetch
      await fetcher.fetchComponent('button');
      
      // Second fetch should use cache
      const cachedResult = await fetcher.fetchComponent('button');
      
      expect(cachedResult.fromCache).toBe(true);
      expect(cachedResult.component.name).toBe('button');
      expect(mockFetch).toHaveBeenCalledTimes(1); // Only called once
    });

    it('should throw RegistryError when component not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(fetcher.fetchComponent('nonexistent-component')).rejects.toThrow();
    });

    it('should throw RegistryError with proper context when component not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });
      
      try {
        await fetcher.fetchComponent('missing');
      } catch (error) {
        const registryError = error as RegistryError;
        expect(registryError.name).toBe('RegistryError');
        expect(registryError.componentName).toBe('missing');
        expect(registryError.statusCode).toBe(404);
        expect(registryError.registryUrl).toContain('/registry/components/missing');
      }
    });

    it('should handle network timeout errors', async () => {
      mockFetch.mockImplementation(() => {
        const abortError = new Error('The user aborted a request');
        abortError.name = 'AbortError';
        return Promise.reject(abortError);
      });

      await expect(fetcher.fetchComponent('button')).rejects.toThrow('Registry request timeout after 10000ms');
      
      try {
        await fetcher.fetchComponent('button');
      } catch (error) {
        const registryError = error as RegistryError;
        expect(registryError.name).toBe('RegistryError');
        expect(registryError.componentName).toBe('button');
      }
    });

    it('should handle general network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetcher.fetchComponent('button')).rejects.toThrow('Failed to fetch from registry');
      
      try {
        await fetcher.fetchComponent('button');
      } catch (error) {
        const registryError = error as RegistryError;
        expect(registryError.name).toBe('RegistryError');
        expect(registryError.componentName).toBe('button');
      }
    });

    it('should validate registry response structure', async () => {
      const invalidResponse = {
        name: 'button',
        // Missing required fields: type, files
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidResponse),
      });

      await expect(fetcher.fetchComponent('button')).rejects.toThrow('Registry response validation failed');
    });

    it('should require at least one file with content', async () => {
      const componentWithoutContent = {
        ...mockComponent,
        files: [
          {
            path: 'ui/button.tsx',
            content: '', // Empty content
            type: 'registry:component',
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(componentWithoutContent),
      });

      await expect(fetcher.fetchComponent('button')).rejects.toThrow(
        'Component must have at least one file with non-empty content'
      );
    });

    it('should handle malformed JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      await expect(fetcher.fetchComponent('button')).rejects.toThrow('Failed to fetch from registry');
    });
  });

  describe('fetchMultipleComponents', () => {
    it('should fetch multiple components in parallel', async () => {
      const cardComponent = { ...mockComponent, name: 'card' };
      
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockComponent),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(cardComponent),
        });

      const results = await fetcher.fetchMultipleComponents(['button', 'card']);

      expect(results.size).toBe(2);
      expect(results.get('button')?.component.name).toBe('button');
      expect(results.get('card')?.component.name).toBe('card');
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should handle partial failures gracefully', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockComponent),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: 'Not Found',
        });

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const results = await fetcher.fetchMultipleComponents(['button', 'missing']);

      expect(results.size).toBe(1); // Only successful result
      expect(results.get('button')?.component.name).toBe('button');
      expect(results.has('missing')).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Failed to fetch component 'missing'"),
        expect.any(String)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('cache management', () => {
    beforeEach(async () => {
      // Set up cache with a component
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockComponent),
      });
      await fetcher.fetchComponent('button');
    });

    it('should provide cache statistics', () => {
      const stats = fetcher.getCacheStats();
      expect(stats.size).toBeGreaterThan(0);
      expect(stats.keys).toContain('button');
    });

    it('should clear specific component from cache', () => {
      fetcher.clearCache('button');
      const afterClear = fetcher.getCacheStats();
      expect(afterClear.keys).not.toContain('button');
    });

    it('should clear entire cache', () => {
      fetcher.clearCache();
      const afterClear = fetcher.getCacheStats();
      expect(afterClear.size).toBe(0);
      expect(afterClear.keys).toHaveLength(0);
    });
  });

  describe('constructor', () => {
    it('should use default base URL', () => {
      const defaultFetcher = new RegistryComponentFetcher();
      // We can't directly access the private property, but we can test the URL in requests
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockComponent),
      });

      defaultFetcher.fetchComponent('button');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://rafters.realhandy.tech/registry/components/button',
        expect.any(Object)
      );
    });

    it('should accept custom base URL', () => {
      const customFetcher = new RegistryComponentFetcher('https://custom.registry.com');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockComponent),
      });

      customFetcher.fetchComponent('button');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://custom.registry.com/registry/components/button',
        expect.any(Object)
      );
    });
  });

  describe('URL encoding', () => {
    it('should properly encode component names with special characters', async () => {
      const specialName = 'button/special-name';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockComponent, name: specialName }),
      });

      await fetcher.fetchComponent(specialName);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://rafters.realhandy.tech/registry/components/button%2Fspecial-name',
        expect.any(Object)
      );
    });
  });

  describe('metadata preservation', () => {
    it('should preserve all component metadata from registry response', async () => {
      const componentWithFullMetadata = {
        ...mockComponent,
        meta: {
          rafters: {
            version: '2.0.0',
            intelligence: {
              cognitiveLoad: 5,
              attentionEconomics: 'Complex attention patterns',
              accessibility: 'WCAG AA compliant',
              trustBuilding: 'High security requirements',
              semanticMeaning: 'Critical system actions',
            },
            usagePatterns: {
              dos: ['Use for critical actions'],
              nevers: ['Never use without confirmation'],
            },
            designGuides: [
              {
                name: 'Component Guide',
                url: 'https://example.com/guide',
              },
            ],
            examples: [
              {
                code: '<Button>Example</Button>',
              },
            ],
          },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(componentWithFullMetadata),
      });

      const result = await fetcher.fetchComponent('button');

      expect(result.component.meta?.rafters?.version).toBe('2.0.0');
      expect(result.component.meta?.rafters?.intelligence?.cognitiveLoad).toBe(5);
      expect(result.component.meta?.rafters?.usagePatterns?.dos).toEqual(['Use for critical actions']);
      expect(result.component.meta?.rafters?.designGuides?.[0].name).toBe('Component Guide');
      expect(result.component.meta?.rafters?.examples?.[0].code).toBe('<Button>Example</Button>');
    });
  });
});