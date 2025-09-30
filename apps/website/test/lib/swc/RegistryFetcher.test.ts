/**
 * RegistryComponentFetcher Unit Tests
 *
 * Tests the registry fetcher with comprehensive coverage
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RegistryComponentFetcher, validateComponentName } from '../../../src/lib/swc/RegistryFetcher';

describe('RegistryComponentFetcher', () => {
  let fetcher: RegistryComponentFetcher;

  beforeEach(() => {
    fetcher = new RegistryComponentFetcher('https://test-registry.example.com');
    vi.clearAllMocks();
  });

  describe('validateComponentName', () => {
    it('should accept valid component names', () => {
      expect(() => validateComponentName('button')).not.toThrow();
      expect(() => validateComponentName('badge')).not.toThrow();
      expect(() => validateComponentName('my-component')).not.toThrow();
      expect(() => validateComponentName('a')).not.toThrow();
      expect(() => validateComponentName('button-2')).not.toThrow();
    });

    it('should reject empty or null names', () => {
      expect(() => validateComponentName('')).toThrow('Component name cannot be empty');
      expect(() => validateComponentName('   ')).toThrow('Component name cannot be empty');
    });

    it('should reject names with invalid characters', () => {
      expect(() => validateComponentName('Button')).toThrow('lowercase letters');
      expect(() => validateComponentName('button_test')).toThrow('lowercase letters');
      expect(() => validateComponentName('button test')).toThrow('lowercase letters');
      expect(() => validateComponentName('button!')).toThrow('lowercase letters');
    });

    it('should reject names starting or ending with hyphens', () => {
      expect(() => validateComponentName('-button')).toThrow('lowercase letters');
      expect(() => validateComponentName('button-')).toThrow('lowercase letters');
    });

    it('should reject names with leading/trailing whitespace', () => {
      expect(() => validateComponentName(' button')).toThrow('cannot have leading or trailing whitespace');
      expect(() => validateComponentName('button ')).toThrow('cannot have leading or trailing whitespace');
    });
  });

  describe('fetchComponent', () => {
    it('should validate component name before fetching', async () => {
      await expect(fetcher.fetchComponent('Invalid-Name')).rejects.toThrow();
      await expect(fetcher.fetchComponent('')).rejects.toThrow();
    });

    it('should throw error for names exceeding 100 characters', async () => {
      const longName = 'a'.repeat(101);
      await expect(fetcher.fetchComponent(longName)).rejects.toThrow('cannot exceed 100 characters');
    });

    it('should reject names with XSS characters', async () => {
      await expect(fetcher.fetchComponent('<script>')).rejects.toThrow('invalid characters');
      await expect(fetcher.fetchComponent('test&test')).rejects.toThrow('invalid characters');
      await expect(fetcher.fetchComponent('test"test')).rejects.toThrow('invalid characters');
    });

    it('should construct correct URL for fetch', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({
          name: 'button',
          type: 'registry:component',
          files: [{ path: 'button.tsx', content: 'export default () => {}', type: 'component' }],
        }),
      } as Response);

      await fetcher.fetchComponent('button');

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://test-registry.example.com/registry/components/button',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Accept': 'application/json',
            'User-Agent': 'rafters-swc/1.0.0',
          }),
        })
      );

      fetchSpy.mockRestore();
    });

    it('should handle 404 errors properly', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      await expect(fetcher.fetchComponent('nonexistent')).rejects.toMatchObject({
        name: 'RegistryError',
        statusCode: 404,
        componentName: 'nonexistent',
      });

      fetchSpy.mockRestore();
    });

    it.skip('should handle network timeouts', async () => {
      // This test requires complex setup with fake timers and AbortController
      // Skipping for now as the timeout logic is tested in integration tests
    });

    it('should validate required fields in response', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({
          name: 'button',
          type: 'registry:component',
          // Missing 'files' field
        }),
      } as Response);

      await expect(fetcher.fetchComponent('button')).rejects.toMatchObject({
        name: 'RegistryError',
        message: expect.stringContaining('validation failed'),
      });

      fetchSpy.mockRestore();
    });

    it('should require at least one file with content', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({
          name: 'button',
          type: 'registry:component',
          files: [{ path: 'button.tsx', content: '   ', type: 'component' }],
        }),
      } as Response);

      await expect(fetcher.fetchComponent('button')).rejects.toMatchObject({
        name: 'RegistryError',
        message: expect.stringContaining('non-empty content'),
      });

      fetchSpy.mockRestore();
    });
  });

  describe('caching', () => {
    it('should cache successful fetches', async () => {
      const mockResponse = {
        name: 'button',
        type: 'registry:component',
        files: [{ path: 'button.tsx', content: 'export default () => {}', type: 'component' }],
      };

      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      // First fetch
      const result1 = await fetcher.fetchComponent('button');
      expect(result1.fromCache).toBe(false);
      expect(fetchSpy).toHaveBeenCalledTimes(1);

      // Second fetch should use cache
      const result2 = await fetcher.fetchComponent('button');
      expect(result2.fromCache).toBe(true);
      expect(fetchSpy).toHaveBeenCalledTimes(1); // Still only 1 call

      fetchSpy.mockRestore();
    });

    it('should evict expired entries', async () => {
      const mockResponse = {
        name: 'button',
        type: 'registry:component',
        files: [{ path: 'button.tsx', content: 'export default () => {}', type: 'component' }],
      };

      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      // First fetch
      await fetcher.fetchComponent('button');

      // Mock time passing (6 minutes = beyond TTL)
      vi.useFakeTimers();
      vi.advanceTimersByTime(6 * 60 * 1000);

      // Should fetch again
      const result = await fetcher.fetchComponent('button');
      expect(result.fromCache).toBe(false);
      expect(fetchSpy).toHaveBeenCalledTimes(2);

      vi.useRealTimers();
      fetchSpy.mockRestore();
    });

    it('should manage cache size limit', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(async (url) => {
        const componentName = (url as string).split('/').pop();
        return {
          ok: true,
          json: async () => ({
            name: componentName,
            type: 'registry:component',
            files: [{ path: `${componentName}.tsx`, content: 'export default () => {}', type: 'component' }],
          }),
        } as Response;
      });

      // Fetch 101 different components (exceeds MAX_CACHE_SIZE of 100)
      for (let i = 0; i < 101; i++) {
        await fetcher.fetchComponent(`component-${i}`);
      }

      const stats = fetcher.getCacheStats();
      expect(stats.size).toBeLessThanOrEqual(100);

      fetchSpy.mockRestore();
    });

    it('should clear cache on demand', async () => {
      const mockResponse = {
        name: 'button',
        type: 'registry:component',
        files: [{ path: 'button.tsx', content: 'export default () => {}', type: 'component' }],
      };

      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await fetcher.fetchComponent('button');
      expect(fetcher.getCacheStats().size).toBe(1);

      fetcher.clearCache('button');
      expect(fetcher.getCacheStats().size).toBe(0);

      fetchSpy.mockRestore();
    });

    it('should clear all cache entries', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(async (url) => {
        const componentName = (url as string).split('/').pop();
        return {
          ok: true,
          json: async () => ({
            name: componentName,
            type: 'registry:component',
            files: [{ path: `${componentName}.tsx`, content: 'export default () => {}', type: 'component' }],
          }),
        } as Response;
      });

      await fetcher.fetchComponent('button');
      await fetcher.fetchComponent('badge');
      expect(fetcher.getCacheStats().size).toBe(2);

      fetcher.clearCache();
      expect(fetcher.getCacheStats().size).toBe(0);

      fetchSpy.mockRestore();
    });
  });

  describe('fetchMultipleComponents', () => {
    it('should fetch multiple components in parallel', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(async (url) => {
        const componentName = (url as string).split('/').pop();
        return {
          ok: true,
          json: async () => ({
            name: componentName,
            type: 'registry:component',
            files: [{ path: `${componentName}.tsx`, content: 'export default () => {}', type: 'component' }],
          }),
        } as Response;
      });

      const results = await fetcher.fetchMultipleComponents(['button', 'badge', 'chip']);

      expect(results.size).toBe(3);
      expect(results.get('button')).toBeDefined();
      expect(results.get('badge')).toBeDefined();
      expect(results.get('chip')).toBeDefined();

      fetchSpy.mockRestore();
    });

    it('should handle individual failures gracefully', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(async (url) => {
        const componentName = (url as string).split('/').pop();
        if (componentName === 'badge') {
          return { ok: false, status: 404, statusText: 'Not Found' } as Response;
        }
        return {
          ok: true,
          json: async () => ({
            name: componentName,
            type: 'registry:component',
            files: [{ path: `${componentName}.tsx`, content: 'export default () => {}', type: 'component' }],
          }),
        } as Response;
      });

      const results = await fetcher.fetchMultipleComponents(['button', 'badge', 'chip']);

      expect(results.size).toBe(2); // Only button and chip succeeded
      expect(results.get('button')).toBeDefined();
      expect(results.get('badge')).toBeUndefined();
      expect(results.get('chip')).toBeDefined();

      fetchSpy.mockRestore();
    });
  });

  describe('getCacheStats', () => {
    it('should return correct cache statistics', async () => {
      const mockResponse = {
        name: 'button',
        type: 'registry:component',
        files: [{ path: 'button.tsx', content: 'export default () => {}', type: 'component' }],
      };

      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await fetcher.fetchComponent('button');

      const stats = fetcher.getCacheStats();
      expect(stats.size).toBe(1);
      expect(stats.keys).toEqual(['button']);
      expect(stats.ttl).toBe(5 * 60 * 1000);
      expect(stats.maxSize).toBe(100);

      fetchSpy.mockRestore();
    });
  });

  describe('intelligence metadata', () => {
    it('should preserve intelligence metadata from registry', async () => {
      const mockResponse = {
        name: 'button',
        type: 'registry:component',
        files: [{ path: 'button.tsx', content: 'export default () => {}', type: 'component' }],
        meta: {
          rafters: {
            version: '1.0.0',
            intelligence: {
              cognitiveLoad: 5,
              attentionEconomics: 'Low attention required',
              accessibility: 'WCAG AAA compliant',
              trustBuilding: 'High trust signals',
              semanticMeaning: 'Primary action',
            },
          },
        },
      };

      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await fetcher.fetchComponent('button');

      expect(result.component.meta?.rafters?.intelligence).toEqual({
        cognitiveLoad: 5,
        attentionEconomics: 'Low attention required',
        accessibility: 'WCAG AAA compliant',
        trustBuilding: 'High trust signals',
        semanticMeaning: 'Primary action',
      });

      fetchSpy.mockRestore();
    });
  });
});