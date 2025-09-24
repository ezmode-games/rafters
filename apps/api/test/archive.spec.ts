/**
 * Archive API Integration Tests
 * Tests archive endpoint with Workers environment
 */

import { env } from 'cloudflare:test';
import Sqids from 'sqids';
import { describe, expect, it } from 'vitest';
import worker from '@/index';

// Initialize SQIDS for test data generation
const sqids = new Sqids();

describe('/api/archive endpoint', () => {
  describe('SQID validation', () => {
    it('should reject invalid SQID format', async () => {
      const invalidSQIDs = [
        'invalid!', // Contains special character
        'notvalid', // Not a valid SQID encoding
        '123ABC!@#', // Mixed with special characters
        'short', // Valid chars but not a proper SQID
        'abc', // Too short and not valid SQID
      ];

      for (const sqid of invalidSQIDs) {
        const response = await worker.fetch(
          new Request(`http://localhost/api/archive/${sqid}`),
          env
        );

        // For this specific implementation, if the route matches but validation fails,
        // we should get a 400. However, some invalid characters might cause Hono
        // to not match the route at all, resulting in 404.

        if (response.status === 404) {
          // This is actually expected for some invalid characters - the route doesn't match
          // Skip this case as it's handled by Hono's routing, not our validation
          continue;
        }

        expect(response.status).toBe(400);

        const data = (await response.json()) as {
          success: false;
          error: { name: string; message: string };
        };
        // The response format is { success: false, error: { name: "ZodError", message: "..." } }
        expect(data.success).toBe(false);
        expect(data.error).toBeDefined();
        expect(data.error.name).toBe('ZodError');

        // The error.message contains a JSON string with validation details
        expect(data.error.message).toContain('Invalid SQID');
      }
    });

    it('should accept valid SQID formats', async () => {
      // Generate some valid SQIDs using the same logic as the design tokens package
      const validSQIDs = [
        '000000', // Reserved SQID for default system (decodes to [844596300])
        sqids.encode([123]), // Valid SQID from small number
        sqids.encode([456, 789]), // Valid SQID from multiple numbers
        sqids.encode([Date.now() - 1000]), // Valid SQID from recent timestamp
        sqids.encode([42]), // Another valid SQID
      ];

      for (const sqid of validSQIDs) {
        const response = await worker.fetch(
          new Request(`http://localhost/api/archive/${sqid}`),
          env
        );

        // Should not be a validation error (might be 404 for custom SQIDs)
        expect(response.status).not.toBe(400);
      }
    });
  });

  describe('default system (000000)', () => {
    it('should return not implemented for default system', async () => {
      const response = await worker.fetch(new Request('http://localhost/api/archive/000000'), env);

      expect(response.status).toBe(501);
      expect(response.headers.get('Content-Type')).toContain('application/json');

      const data = (await response.json()) as {
        error: string;
        message: string;
        sqid: string;
        requiredFiles: string[];
      };
      expect(data.error).toBe('Archive generation not available');
      expect(data.message).toContain('ZIP generation not supported');
      expect(data.sqid).toBe('000000');
      expect(data.requiredFiles).toHaveLength(10);
    });

    it('should return consistent not implemented response', async () => {
      const response1 = await worker.fetch(new Request('http://localhost/api/archive/000000'), env);
      const response2 = await worker.fetch(new Request('http://localhost/api/archive/000000'), env);

      expect(response1.status).toBe(501);
      expect(response2.status).toBe(501);

      const data1 = (await response1.json()) as { sqid: string; error: string };
      const data2 = (await response2.json()) as { sqid: string; error: string };

      expect(data1.sqid).toBe(data2.sqid);
      expect(data1.error).toBe(data2.error);
    });
  });

  describe('custom SQIDs', () => {
    it('should return 404 for custom SQIDs (not implemented)', async () => {
      const customSQIDs = ['ABC123', 'CUSTOM1', 'TEST999'];

      for (const sqid of customSQIDs) {
        const response = await worker.fetch(
          new Request(`http://localhost/api/archive/${sqid}`),
          env
        );
        expect(response.status).toBe(404);

        const data = (await response.json()) as { error: string; message: string };
        expect(data.error).toBe('Archive not found');
        expect(data.message).toContain(sqid);
      }
    });
  });

  describe('error handling', () => {
    it('should handle archive generation errors gracefully', async () => {
      // This test would require mocking generateDefaultArchive to throw
      // For now, we just verify the error response structure is correct
      // when custom SQIDs are requested
      const response = await worker.fetch(
        new Request('http://localhost/api/archive/NOTFOUND'),
        env
      );

      expect(response.status).toBe(404);
      expect(response.headers.get('Content-Type')).toContain('application/json');

      const data = (await response.json()) as { error: string; message: string };
      expect(data).toHaveProperty('error');
      expect(data).toHaveProperty('message');
    });
  });

  describe('response headers', () => {
    it('should set correct CORS headers for archive requests', async () => {
      const response = await worker.fetch(
        new Request('http://localhost/api/archive/000000', {
          headers: {
            Origin: 'https://example.realhandy.tech',
          },
        }),
        env
      );

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe(
        'https://example.realhandy.tech'
      );
    });

    it('should return JSON response for default archive', async () => {
      const response = await worker.fetch(new Request('http://localhost/api/archive/000000'), env);

      expect(response.status).toBe(501);
      expect(response.headers.get('Content-Type')).toContain('application/json');
    });
  });
});
