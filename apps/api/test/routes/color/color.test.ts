import { SELF } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';

describe('Color Routes', () => {
  describe('GET /color/search', () => {
    // These tests require AI and Vectorize bindings which only work with remote: true
    // Skip in local development, run in CI with remote bindings
    it.skip('returns search results for valid query', async () => {
      const res = await SELF.fetch('http://localhost/color/search?q=ocean%20blue');

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toHaveProperty('results');
      expect(json).toHaveProperty('query', 'ocean blue');
      expect(json).toHaveProperty('total');
      expect(Array.isArray(json.results)).toBe(true);
    });

    it('requires q parameter', async () => {
      const res = await SELF.fetch('http://localhost/color/search');

      // OpenAPI validation returns 422 Unprocessable Entity
      expect(res.status).toBe(422);
    });

    // Requires AI/Vectorize bindings - skip locally
    it.skip('accepts optional filter parameters', async () => {
      const res = await SELF.fetch(
        'http://localhost/color/search?q=blue&hue=blue&lightness=mid&chroma=saturated&limit=5',
      );

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.query).toBe('blue');
    });

    it('validates hue enum values', async () => {
      const res = await SELF.fetch('http://localhost/color/search?q=test&hue=invalid');

      // OpenAPI validation returns 422 Unprocessable Entity
      expect(res.status).toBe(422);
    });

    it('validates limit range', async () => {
      const res = await SELF.fetch('http://localhost/color/search?q=test&limit=200');

      // OpenAPI validation returns 422 Unprocessable Entity
      expect(res.status).toBe(422);
    });
  });

  describe('GET /color/{oklch}', () => {
    it('returns queued status for uncached color', async () => {
      const res = await SELF.fetch('http://localhost/color/0.500-0.120-240');

      expect(res.status).toBe(202);
      const json = await res.json();
      expect(json.status).toBe('queued');
      expect(json.color).toBeNull();
      expect(json.requestId).toContain('stub-');
    });

    it('validates OKLCH format', async () => {
      const res = await SELF.fetch('http://localhost/color/invalid-format');

      // OpenAPI validation returns 422 Unprocessable Entity
      expect(res.status).toBe(422);
    });

    it('validates OKLCH with wrong decimal places', async () => {
      // Should be L.LLL-C.CCC-H format
      const res = await SELF.fetch('http://localhost/color/0.5-0.12-240');

      // OpenAPI validation returns 422 Unprocessable Entity
      expect(res.status).toBe(422);
    });
  });
});
