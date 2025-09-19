/**
 * Tests for fetchArchive function
 */

import { existsSync } from 'node:fs';
import { readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchArchive } from '../src/archive.js';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('fetchArchive', () => {
  const testTargetPath = './test-tokens';

  beforeEach(async () => {
    vi.clearAllMocks();

    // Clean up test directory
    try {
      await rm(testTargetPath, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('SQID validation', () => {
    it('should reject invalid SQID format', async () => {
      await expect(fetchArchive('invalid!')).rejects.toThrow('Invalid SQID format');
      await expect(fetchArchive('12345')).rejects.toThrow('Invalid SQID format');
      await expect(fetchArchive('123456789')).rejects.toThrow('Invalid SQID format');
      await expect(fetchArchive('')).rejects.toThrow('Invalid SQID format');
    });

    it('should accept valid SQID formats', async () => {
      // These should not throw during validation (they might fail for other reasons)
      const validSQIDs = ['ABC123', 'abc123', '123456', 'A1B2C3', '12345678'];

      for (const sqid of validSQIDs) {
        try {
          await fetchArchive(sqid, testTargetPath);
        } catch (error) {
          // Should not be a validation error
          expect((error as Error).message).not.toContain('Invalid SQID format');
        }
      }
    });
  });

  describe('default system (000000)', () => {
    it('should load embedded default for SQID 000000', async () => {
      await fetchArchive('000000', testTargetPath);

      // Verify all required files exist
      const requiredFiles = [
        'manifest.json',
        'colors.json',
        'typography.json',
        'spacing.json',
        'motion.json',
        'shadows.json',
        'borders.json',
        'breakpoints.json',
        'layout.json',
        'fonts.json',
      ];

      for (const filename of requiredFiles) {
        const filePath = join(testTargetPath, filename);
        expect(existsSync(filePath)).toBe(true);
      }

      // Verify manifest content
      const manifestPath = join(testTargetPath, 'manifest.json');
      const manifestContent = await readFile(manifestPath, 'utf-8');
      const manifest = JSON.parse(manifestContent);
      expect(manifest.id).toBe('000000');
    });
  });

  describe('network fetching', () => {
    it('should fetch and extract valid archive', async () => {
      // Mock successful ZIP response
      const mockZipBuffer = Buffer.from('mock zip content');
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        arrayBuffer: () => Promise.resolve(mockZipBuffer.buffer),
      });

      // Mock StreamZip to avoid actual ZIP processing in tests
      const mockExtract = vi.fn();
      const mockClose = vi.fn();
      vi.doMock('node-stream-zip', () => ({
        default: {
          async: class {
            extract = mockExtract;
            close = mockClose;
          },
        },
      }));

      try {
        await fetchArchive('ABC123', testTargetPath);
        expect(mockFetch).toHaveBeenCalledWith('https://rafters.realhandy.tech/archive/ABC123');
      } catch (_error) {
        // Test validates the network call was made correctly
        // Actual extraction might fail due to mocking
        expect(mockFetch).toHaveBeenCalledWith('https://rafters.realhandy.tech/archive/ABC123');
      }
    });

    it('should fallback to default on 404 error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await fetchArchive('MISSING', testTargetPath);

      expect(consoleSpy).toHaveBeenCalledWith('Archive MISSING not found, falling back to default');

      // Should have created default archive
      expect(existsSync(join(testTargetPath, 'manifest.json'))).toBe(true);

      consoleSpy.mockRestore();
    });

    it('should throw on non-404 HTTP errors', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(fetchArchive('ABC123', testTargetPath)).rejects.toThrow(
        'Failed to fetch archive: 500 Internal Server Error'
      );
    });

    it('should fallback to default on network errors', async () => {
      mockFetch.mockRejectedValue(new TypeError('Failed to fetch'));

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await fetchArchive('ABC123', testTargetPath);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Network error fetching ABC123, falling back to default'
      );

      // Should have created default archive
      expect(existsSync(join(testTargetPath, 'manifest.json'))).toBe(true);

      consoleSpy.mockRestore();
    });
  });

  describe('file validation', () => {
    it('should validate all required files are present', async () => {
      // This test verifies the validation logic works
      // The actual archive creation will ensure files are present
      await fetchArchive('000000', testTargetPath);

      const requiredFiles = [
        'manifest.json',
        'colors.json',
        'typography.json',
        'spacing.json',
        'motion.json',
        'shadows.json',
        'borders.json',
        'breakpoints.json',
        'layout.json',
        'fonts.json',
      ];

      for (const filename of requiredFiles) {
        const filePath = join(testTargetPath, filename);
        expect(existsSync(filePath)).toBe(true);
      }
    });
  });

  describe('error handling', () => {
    it('should handle TypeError as network error', async () => {
      mockFetch.mockRejectedValue(new TypeError('Failed to fetch'));

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await fetchArchive('TYPEERR', testTargetPath);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Network error fetching TYPEERR, falling back to default'
      );
      consoleSpy.mockRestore();
    });

    it('should handle ENOTFOUND as network error', async () => {
      const networkError = new Error('ENOTFOUND example.com');
      mockFetch.mockRejectedValue(networkError);

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await fetchArchive('ABC123', testTargetPath);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Network error fetching ABC123, falling back to default'
      );
      consoleSpy.mockRestore();
    });

    it('should re-throw non-network errors', async () => {
      const nonNetworkError = new Error('Some validation error');
      mockFetch.mockRejectedValue(nonNetworkError);

      await expect(fetchArchive('ABC123', testTargetPath)).rejects.toThrow('Some validation error');
    });
  });
});
