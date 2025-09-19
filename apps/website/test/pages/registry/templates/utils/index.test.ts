/**
 * Unit tests for Template Utils API endpoint
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { dynamic, GET } from '../../../../../src/pages/registry/templates/utils/index';

describe('Template Utils API', () => {
  beforeEach(() => {
    // No mocks needed for this simple endpoint
  });

  describe('dynamic export', () => {
    it('should export force-static for static generation', () => {
      expect(dynamic).toBe('force-static');
    });
  });

  describe('GET handler', () => {
    it('should return cn utility function content', async () => {
      const response = await GET();
      const content = await response.text();

      expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
      expect(response.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable');

      // Check that content includes the cn function
      expect(content).toContain('export function cn');
      expect(content).toContain('import { type ClassValue, clsx }');
      expect(content).toContain('import { twMerge }');
      expect(content).toContain('return twMerge(clsx(inputs))');
    });

    it('should include JSDoc documentation', async () => {
      const response = await GET();
      const content = await response.text();

      expect(content).toContain('* Utility function for combining Tailwind CSS classes');
      expect(content).toContain('@example');
      expect(content).toContain("cn('px-4', 'px-2')");
    });

    it('should return immutable cache headers', async () => {
      const response = await GET();

      // Static utility should be cached forever
      expect(response.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable');
    });

    it('should return valid TypeScript code', async () => {
      const response = await GET();
      const content = await response.text();

      // Check for TypeScript syntax
      expect(content).toContain('...inputs: ClassValue[]');
      expect(content).toContain('type ClassValue');
      expect(content).toMatch(/export function cn\(.*\)/);
    });
  });
});
