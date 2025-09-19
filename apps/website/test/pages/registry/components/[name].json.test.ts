/**
 * Unit tests for Individual Component Registry API endpoint
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  GET,
  getStaticPaths,
  OPTIONS,
} from '../../../../src/pages/registry/components/[name].json';

// Mock the componentService lib functions
vi.mock('../../../../src/lib/registry/componentService', () => ({
  getComponent: vi.fn(),
  getRegistryMetadata: vi.fn(),
}));

import { getComponent, getRegistryMetadata } from '../../../../src/lib/registry/componentService';

describe('Individual Component Registry API ([name].json.ts)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('getStaticPaths', () => {
    it('should generate paths for all components', async () => {
      const mockComponents = [{ name: 'button' }, { name: 'input' }, { name: 'dialog' }];

      vi.mocked(getRegistryMetadata).mockReturnValue({
        components: mockComponents,
      });

      const paths = await getStaticPaths();

      expect(paths).toEqual([
        { params: { name: 'button' } },
        { params: { name: 'input' } },
        { params: { name: 'dialog' } },
      ]);
    });

    it('should handle empty component list', async () => {
      vi.mocked(getRegistryMetadata).mockReturnValue({
        components: [],
      });

      const paths = await getStaticPaths();

      expect(paths).toEqual([]);
    });

    it('should handle undefined components', async () => {
      vi.mocked(getRegistryMetadata).mockReturnValue({});

      const paths = await getStaticPaths();

      expect(paths).toEqual([]);
    });
  });

  describe('GET handler', () => {
    it('should return component data when found', async () => {
      const mockComponent = {
        name: 'button',
        type: 'registry:component',
        description: 'Test button',
      };

      vi.mocked(getComponent).mockReturnValue(mockComponent);

      const response = await GET({ params: { name: 'button' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/json');
      expect(response.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable');
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(data).toEqual(mockComponent);
    });

    it('should return 404 when component not found', async () => {
      vi.mocked(getComponent).mockReturnValue(null);

      const response = await GET({ params: { name: 'nonexistent' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(response.headers.get('Content-Type')).toBe('application/json');
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(data).toEqual({ error: "Component 'nonexistent' not found" });
    });

    it('should handle errors gracefully', async () => {
      vi.mocked(getComponent).mockImplementation(() => {
        throw new Error('Test error');
      });

      const response = await GET({ params: { name: 'button' } });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(response.headers.get('Content-Type')).toBe('application/json');
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(data).toEqual({ error: 'Internal server error' });
      expect(console.error).toHaveBeenCalledWith(
        'Registry component API error for button:',
        expect.any(Error)
      );
    });

    it('should include CORS headers on success', async () => {
      vi.mocked(getComponent).mockReturnValue({ name: 'button' });

      const response = await GET({ params: { name: 'button' } });

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toBe('GET, OPTIONS');
      expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type');
    });
  });

  describe('OPTIONS handler', () => {
    it('should return CORS headers for preflight requests', async () => {
      const response = await OPTIONS();

      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toBe('GET, OPTIONS');
      expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type');
    });

    it('should return null body for OPTIONS', async () => {
      const response = await OPTIONS();
      const text = await response.text();

      expect(text).toBe('');
    });
  });
});
