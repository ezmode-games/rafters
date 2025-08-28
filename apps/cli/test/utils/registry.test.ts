import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ComponentManifest, Registry } from '../../src/utils/registry.js';
import { fetchComponent, fetchComponentRegistry } from '../../src/utils/registry.js';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('registry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('RAFTERS_REGISTRY_URL', undefined);
  });

  describe('fetchComponentRegistry', () => {
    const mockResponse: Registry = {
      $schema: 'https://ui.shadcn.com/schema/registry.json',
      name: 'Rafters AI Design Intelligence Registry',
      components: [
        {
          name: 'button',
          type: 'registry:component',
          files: [
            {
              path: 'ui/button.tsx',
              type: 'registry:component',
              content: 'export const Button = () => <button>Click me</button>;',
            },
          ],
          meta: {
            rafters: {
              version: '0.1.0',
              intelligence: {
                cognitiveLoad: 3,
                attentionEconomics: 'Size hierarchy: sm=tertiary, md=secondary, lg=primary',
                accessibility: 'WCAG AAA compliant',
                trustBuilding: 'Destructive actions require confirmation',
                semanticMeaning: 'Primary=main actions',
              },
              usagePatterns: {
                dos: ['Use for primary actions'],
                nevers: ['Never use for destructive actions without confirmation'],
              },
              designGuides: [],
              examples: [],
            },
          },
        },
      ],
    };

    it('should fetch registry successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ components: mockResponse.components }),
      });

      const result = await fetchComponentRegistry();
      expect(result.components).toEqual(mockResponse.components);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://rafters.realhandy.tech/api/registry/components',
        {
          signal: expect.any(AbortSignal),
          headers: {
            Accept: 'application/json',
            'User-Agent': 'rafters-cli/1.0.0',
          },
        }
      );
    });

    it('should use custom registry URL from environment', async () => {
      process.env.RAFTERS_REGISTRY_URL = 'https://custom-registry.example.com';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ components: mockResponse.components }),
      });

      await fetchComponentRegistry();
      expect(mockFetch).toHaveBeenCalledWith('https://custom-registry.example.com/components', {
        signal: expect.any(AbortSignal),
        headers: {
          Accept: 'application/json',
          'User-Agent': 'rafters-cli/1.0.0',
        },
      });
    });

    it('should throw error on failed request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(fetchComponentRegistry()).rejects.toThrow('Registry API error: 404 Not Found');
    });

    it('should throw error on network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchComponentRegistry()).rejects.toThrow('Network error');
    });

    it('should throw error on invalid JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      await expect(fetchComponentRegistry()).rejects.toThrow('Invalid JSON');
    });
  });

  describe('fetchComponent', () => {
    const mockManifest: ComponentManifest = {
      name: 'button',
      type: 'registry:component',
      dependencies: [],
      files: [
        {
          path: 'ui/button.tsx',
          type: 'registry:component',
          content: 'export const Button = () => <button>Click me</button>;',
        },
      ],
      meta: {
        rafters: {
          version: '0.1.0',
          intelligence: {
            cognitiveLoad: 3,
            attentionEconomics: 'Size hierarchy: sm=tertiary, md=secondary, lg=primary',
            accessibility: 'WCAG AAA compliant',
            trustBuilding: 'Destructive actions require confirmation',
            semanticMeaning: 'Primary=main actions',
          },
        },
      },
    };

    it('should fetch component successfully from direct endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockManifest),
      });

      const result = await fetchComponent('button');
      expect(result).toEqual(mockManifest);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://rafters.realhandy.tech/api/registry/components/button',
        {
          signal: expect.any(AbortSignal),
          headers: {
            Accept: 'application/json',
            'User-Agent': 'rafters-cli/1.0.0',
          },
        }
      );
    });

    it('should fallback to registry search when direct fetch fails', async () => {
      // First call (direct component fetch) fails
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      // Second call (registry fallback) returns components
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ components: [mockManifest] }),
      });

      const result = await fetchComponent('button');
      expect(result).toEqual(mockManifest);
    });

    it('should return null when component not found anywhere', async () => {
      // First call fails
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      // Fallback registry call returns empty components
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ components: [] }),
      });

      const result = await fetchComponent('nonexistent');
      expect(result).toBeNull();
    });

    it('should throw error when all API calls fail', async () => {
      // All fetch calls fail
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(fetchComponent('button')).rejects.toThrow(
        "Component 'button' not found: Failed to fetch from registry: Network error"
      );
    });
  });
});
