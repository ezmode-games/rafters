/**
 * Unit tests for Registry Root API endpoint
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET, OPTIONS } from '../../../src/pages/registry/index.json';

// Mock the componentService lib functions
vi.mock('../../../src/lib/registry/componentService', () => ({
  getRegistryMetadata: vi.fn(),
}));

import { getRegistryMetadata } from '../../../src/lib/registry/componentService';

describe('Registry Root API (index.json.ts)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset console.error mock
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('GET handler', () => {
    it('should return registry metadata with correct headers', async () => {
      const mockRegistry = {
        $schema: 'https://rafters.dev/schemas/registry.json',
        name: 'Test Registry',
        components: [],
      };

      vi.mocked(getRegistryMetadata).mockResolvedValue(mockRegistry);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/json');
      expect(response.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable');
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(data).toEqual(mockRegistry);
    });

    it('should handle errors gracefully', async () => {
      const errorMessage = 'Test error';
      vi.mocked(getRegistryMetadata).mockRejectedValue(new Error(errorMessage));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(response.headers.get('Content-Type')).toBe('application/json');
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(data).toEqual({ error: 'Internal server error' });
      expect(console.error).toHaveBeenCalledWith('Registry API error:', expect.any(Error));
    });

    it('should include CORS headers', async () => {
      vi.mocked(getRegistryMetadata).mockResolvedValue({ components: [] });

      const response = await GET();

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
