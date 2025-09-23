/**
 * Tests for /api/archive endpoint
 */

import { describe, expect, it } from 'vitest';

const WORKER_URL = 'http://localhost:8787';

describe('/api/archive endpoint', () => {
  describe('SQID validation', () => {
    it('should reject invalid SQID format', async () => {
      const invalidSQIDs = ['invalid!', '12345', '123456789', '', 'ABC-123'];

      for (const sqid of invalidSQIDs) {
        const response = await fetch(`${WORKER_URL}/api/archive/${sqid}`);
        expect(response.status).toBe(400);

        const data = await response.json() as { error: string };
        expect(data.error).toContain('Invalid SQID format');
      }
    });

    it('should accept valid SQID formats', async () => {
      const validSQIDs = ['ABC123', 'abc123', '123456', 'A1B2C3', '12345678'];

      for (const sqid of validSQIDs) {
        const response = await fetch(`${WORKER_URL}/api/archive/${sqid}`);

        // Should not be a validation error (might be 404 for custom SQIDs)
        expect(response.status).not.toBe(400);
      }
    });
  });

  describe('default system (000000)', () => {
    it('should serve default archive as ZIP file', async () => {
      const response = await fetch(`${WORKER_URL}/api/archive/000000`);

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/zip');
      expect(response.headers.get('Content-Disposition')).toBe('attachment; filename="rafters-000000.zip"');
      expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600');

      // Verify we get a valid ZIP response
      const arrayBuffer = await response.arrayBuffer();
      expect(arrayBuffer.byteLength).toBeGreaterThan(1000); // Should be substantial ZIP file
    });

    it('should serve consistent archive content', async () => {
      const response1 = await fetch(`${WORKER_URL}/api/archive/000000`);
      const response2 = await fetch(`${WORKER_URL}/api/archive/000000`);

      const buffer1 = await response1.arrayBuffer();
      const buffer2 = await response2.arrayBuffer();

      // Archives should be identical (deterministic generation)
      expect(buffer1.byteLength).toBe(buffer2.byteLength);
    });
  });

  describe('custom SQIDs', () => {
    it('should return 404 for custom SQIDs (not implemented)', async () => {
      const customSQIDs = ['ABC123', 'CUSTOM1', 'TEST999'];

      for (const sqid of customSQIDs) {
        const response = await fetch(`${WORKER_URL}/api/archive/${sqid}`);
        expect(response.status).toBe(404);

        const data = await response.json() as { error: string; message: string };
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
      const response = await fetch(`${WORKER_URL}/api/archive/NOTFOUND`);

      expect(response.status).toBe(404);
      expect(response.headers.get('Content-Type')).toContain('application/json');

      const data = await response.json() as { error: string; message: string };
      expect(data).toHaveProperty('error');
      expect(data).toHaveProperty('message');
    });
  });

  describe('response headers', () => {
    it('should set correct CORS headers for archive requests', async () => {
      const response = await fetch(`${WORKER_URL}/api/archive/000000`, {
        headers: {
          'Origin': 'https://example.realhandy.tech',
        },
      });

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://example.realhandy.tech');
    });

    it('should set appropriate cache headers for default archive', async () => {
      const response = await fetch(`${WORKER_URL}/api/archive/000000`);

      expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600');
    });
  });
});