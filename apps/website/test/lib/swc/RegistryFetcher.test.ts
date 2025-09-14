/**
 * Registry Component Fetcher Tests - Issue #130
 *
 * Comprehensive tests for the Registry Component Fetcher including
 * caching, error handling, and validation.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RegistryComponentFetcher, validateComponentName } from '../../../src/lib/swc/RegistryFetcher';
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
    vi.resetAllMocks();
  });

  describe('validateComponentName', () => {
    it('should validate valid component names', () => {
      expect(() => validateComponentName('button')).not.toThrow();
      expect(() => validateComponentName('button-large')).not.toThrow();
      expect(() => validateComponentName('card')).not.toThrow();
      expect(() => validateComponentName('a')).not.toThrow();
      expect(() => validateComponentName('a-b-c')).not.toThrow();
    });

    it('should reject invalid component names', () => {
      expect(() => validateComponentName('')).toThrow('Component name cannot be empty');
      expect(() => validateComponentName('  ')).toThrow('Component name cannot be empty');
      expect(() => validateComponentName(' button')).toThrow('leading or trailing whitespace');
      expect(() => validateComponentName('button ')).toThrow('leading or trailing whitespace');
      expect(() => validateComponentName('Button')).toThrow('lowercase letters, numbers, and hyphens');
      expect(() => validateComponentName('button_test')).toThrow('lowercase letters, numbers, and hyphens');
      expect(() => validateComponentName('-button')).toThrow('lowercase letters, numbers, and hyphens');
      expect(() => validateComponentName('button-')).toThrow('lowercase letters, numbers, and hyphens');
    });
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

      await expect(
        fetcher.fetchComponent('nonexistent')
      ).rejects.toThrow();
    });

    it('should throw RegistryError with proper context when component not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      try {
        await fetcher.fetchComponent('nonexistent');
        expect.fail('Should have thrown an error');
      } catch (error) {
        const registryError = error as RegistryError;
        expect(registryError.name).toBe('RegistryError');
        expect(registryError.componentName).toBe('nonexistent');
        expect(registryError.statusCode).toBe(404);
        expect(registryError.registryUrl).toContain('/registry/components/nonexistent');
      }
    });

    it('should handle network timeout errors', async () => {
      // Mock fetch to simulate AbortError
      mockFetch.mockRejectedValueOnce(
        Object.assign(new Error('The operation was aborted'), {
          name: 'AbortError',
        })
      );

      try {
        await fetcher.fetchComponent('timeout-test');
        expect.fail('Should have thrown an error');
      } catch (error) {
        const registryError = error as RegistryError;
        expect(registryError.name).toBe('RegistryError');
        expect(registryError.message).toContain('timeout');
        expect(registryError.componentName).toBe('timeout-test');
      }
    });

    it('should handle malformed JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      try {
        await fetcher.fetchComponent('malformed-json');
        expect.fail('Should have thrown an error');
      } catch (error) {
        const registryError = error as RegistryError;
        expect(registryError.name).toBe('RegistryError');
        expect(registryError.message).toContain('Failed to fetch');
        expect(registryError.componentName).toBe('malformed-json');
      }
    });

    it('should validate required fields in component response', async () => {
      const invalidComponent = { ...mockComponent };
      delete (invalidComponent as any).name;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidComponent),
      });

      try {
        await fetcher.fetchComponent('invalid-component');
        expect.fail('Should have thrown an error');
      } catch (error) {
        const registryError = error as RegistryError;
        expect(registryError.name).toBe('RegistryError');
        expect(registryError.message).toContain('validation failed');
        expect(registryError.componentName).toBe('invalid-component');
      }
    });

    it('should validate files array structure', async () => {
      const invalidComponent = { ...mockComponent, files: [] };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidComponent),
      });

      try {
        await fetcher.fetchComponent('no-files');
        expect.fail('Should have thrown an error');
      } catch (error) {
        const registryError = error as RegistryError;
        expect(registryError.name).toBe('RegistryError');
        expect(registryError.message).toContain('validation failed');
        expect(registryError.message).toContain('at least one file');
      }
    });

    it('should preserve component intelligence metadata', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockComponent),
      });

      const result = await fetcher.fetchComponent('button');
      const intelligence = result.component.meta?.rafters?.intelligence;

      expect(intelligence).toBeDefined();
      expect(intelligence?.cognitiveLoad).toBe(3);
      expect(intelligence?.attentionEconomics).toContain('Size hierarchy');
      expect(intelligence?.accessibility).toBe('WCAG AAA compliant');
      expect(intelligence?.trustBuilding).toContain('Destructive actions');
      expect(intelligence?.semanticMeaning).toContain('Primary=main actions');
      expect(intelligence?.usagePatterns?.dos).toEqual(['Use for primary actions']);
      expect(intelligence?.usagePatterns?.nevers).toEqual([
        'Never use for destructive actions without confirmation',
      ]);
    });
  });

  describe('fetchMultipleComponents', () => {
    it('should fetch multiple components in parallel', async () => {
      const mockCard = { ...mockComponent, name: 'card' };
      
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockComponent),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockCard),
        });

      const results = await fetcher.fetchMultipleComponents(['button', 'card']);

      expect(results.size).toBe(2);
      expect(results.has('button')).toBe(true);
      expect(results.has('card')).toBe(true);
      expect(results.get('button')?.component.name).toBe('button');
      expect(results.get('card')?.component.name).toBe('card');
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should handle partial failures gracefully', async () => {
      const mockCard = { ...mockComponent, name: 'card' };
      
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

      // Spy on console.warn
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const results = await fetcher.fetchMultipleComponents(['button', 'nonexistent']);

      expect(results.size).toBe(1);
      expect(results.has('button')).toBe(true);
      expect(results.has('nonexistent')).toBe(false);
      expect(warnSpy).toHaveBeenCalledWith(
        "Failed to fetch component 'nonexistent':",
        "HTTP 404: Not Found"
      );

      warnSpy.mockRestore();
    });

    it('should validate component names before fetching', async () => {
      // Spy on console.warn to avoid noise in test output
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const results = await fetcher.fetchMultipleComponents(['Button', 'invalid_name']);
      
      // Should return empty results since both names are invalid
      expect(results.size).toBe(0);
      expect(warnSpy).toHaveBeenCalledTimes(2); // Called for each invalid name
      
      warnSpy.mockRestore();
    });
  });

  describe('Cache Management', () => {
    it('should clear specific component from cache', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockComponent),
      });
      
      // Fetch and cache
      await fetcher.fetchComponent('button');

      // Clear specific component
      fetcher.clearCache('button');

      // Should fetch from network again
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockComponent),
      });

      const result = await fetcher.fetchComponent('button');
      expect(result.fromCache).toBe(false);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should clear entire cache', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockComponent),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ ...mockComponent, name: 'card' }),
        });

      // Cache multiple components
      await fetcher.fetchComponent('button');
      await fetcher.fetchComponent('card');

      // Clear entire cache
      fetcher.clearCache();

      // Both should fetch from network again
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockComponent),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ ...mockComponent, name: 'card' }),
        });

      const buttonResult = await fetcher.fetchComponent('button');
      const cardResult = await fetcher.fetchComponent('card');

      expect(buttonResult.fromCache).toBe(false);
      expect(cardResult.fromCache).toBe(false);
      expect(mockFetch).toHaveBeenCalledTimes(4);
    });

    it('should return cache statistics with new fields', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockComponent),
      });

      await fetcher.fetchComponent('button');

      const stats = fetcher.getCacheStats();
      expect(stats.size).toBe(1);
      expect(stats.keys).toEqual(['button']);
      expect(stats.ttl).toBe(5 * 60 * 1000); // 5 minutes
      expect(stats.maxSize).toBe(100);
    });
  });

  describe('Custom Registry URL', () => {
    it('should use custom registry URL', async () => {
      const customFetcher = new RegistryComponentFetcher('https://custom.registry.com');
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockComponent),
      });

      const result = await customFetcher.fetchComponent('button');

      expect(result.registryUrl).toContain('https://custom.registry.com');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://custom.registry.com/registry/components/button',
        expect.any(Object)
      );
    });
  });

  describe('Input Validation', () => {
    it('should reject invalid component name inputs', async () => {
      await expect(fetcher.fetchComponent('')).rejects.toThrow('Component name must be a non-empty string');
      await expect(fetcher.fetchComponent('  ')).rejects.toThrow('Component name cannot be empty or only whitespace');
      await expect(fetcher.fetchComponent('<script>alert(1)</script>')).rejects.toThrow('contains invalid characters');
    });
  });
});