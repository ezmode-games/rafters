/**
 * Queue Consumer Unit Tests
 * Tests consumer logic with spyOn mocking
 */

import type { ColorValue } from '@rafters/shared';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import * as consumer from '@/lib/queue/consumer';
import type { ColorSeedMessage } from '@/lib/queue/publisher';

describe('Queue Consumer Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createColorIntelRequest', () => {
    test('creates POST request with correct URL', () => {
      const message: ColorSeedMessage = {
        oklch: { l: 0.5, c: 0.1, h: 180 },
        timestamp: Date.now(),
      };

      const request = consumer.createColorIntelRequest(message);

      expect(request.method).toBe('POST');
      expect(request.url).toBe('http://internal/api/color-intel');
    });

    test('creates request with JSON content type', () => {
      const message: ColorSeedMessage = {
        oklch: { l: 0.5, c: 0.1, h: 180 },
        timestamp: Date.now(),
      };

      const request = consumer.createColorIntelRequest(message);

      expect(request.headers.get('Content-Type')).toBe('application/json');
    });

    test('includes only OKLCH in request body', () => {
      const message: ColorSeedMessage = {
        oklch: { l: 0.5, c: 0.1, h: 180 },
        token: 'primary',
        name: 'test-blue',
        timestamp: Date.now(),
      };

      const request = consumer.createColorIntelRequest(message);
      const body = request.body;

      expect(body).toBeDefined();
    });
  });

  describe('isSuccessResponse', () => {
    test('returns true for status 200', () => {
      expect(consumer.isSuccessResponse(200)).toBe(true);
    });

    test('returns false for status 400', () => {
      expect(consumer.isSuccessResponse(400)).toBe(false);
    });

    test('returns false for status 500', () => {
      expect(consumer.isSuccessResponse(500)).toBe(false);
    });

    test('returns false for status 201', () => {
      expect(consumer.isSuccessResponse(201)).toBe(false);
    });
  });

  describe('handleSuccessResponse', () => {
    test('calls message.ack()', () => {
      const mockMessage = {
        ack: vi.fn(),
        retry: vi.fn(),
      } as unknown as Message<ColorSeedMessage>;

      const colorData: ColorValue = {
        name: 'Test Color',
        scale: [{ l: 0.5, c: 0.1, h: 180 }],
      };

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      consumer.handleSuccessResponse(mockMessage, colorData);

      expect(mockMessage.ack).toHaveBeenCalled();
      expect(mockMessage.retry).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    test('logs color name and suggested name', () => {
      const mockMessage = {
        ack: vi.fn(),
        retry: vi.fn(),
      } as unknown as Message<ColorSeedMessage>;

      const colorData: ColorValue = {
        name: 'Test Color',
        scale: [{ l: 0.5, c: 0.1, h: 180 }],
        intelligence: {
          suggestedName: 'Ocean Blue',
          reasoning: 'test',
          emotionalImpact: 'test',
          culturalContext: 'test',
          accessibilityNotes: 'test',
          usageGuidance: 'test',
        },
      };

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      consumer.handleSuccessResponse(mockMessage, colorData);

      expect(consoleSpy).toHaveBeenCalledWith('Processed color seed: Test Color - Ocean Blue');

      consoleSpy.mockRestore();
    });
  });

  describe('handleErrorResponse', () => {
    test('calls message.retry()', () => {
      const mockMessage = {
        ack: vi.fn(),
        retry: vi.fn(),
      } as unknown as Message<ColorSeedMessage>;

      const error = new Error('Test error');
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      consumer.handleErrorResponse(mockMessage, error);

      expect(mockMessage.retry).toHaveBeenCalled();
      expect(mockMessage.ack).not.toHaveBeenCalled();

      errorSpy.mockRestore();
    });

    test('logs error message', () => {
      const mockMessage = {
        ack: vi.fn(),
        retry: vi.fn(),
      } as unknown as Message<ColorSeedMessage>;

      const error = new Error('Test error');
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      consumer.handleErrorResponse(mockMessage, error);

      expect(errorSpy).toHaveBeenCalledWith('Failed to process color seed message:', error);

      errorSpy.mockRestore();
    });
  });

  describe('createApiError', () => {
    test('creates error with status and text', () => {
      const error = consumer.createApiError(500, 'Internal Server Error');

      expect(error.message).toBe('Color-intel API returned 500: Internal Server Error');
    });

    test('creates error with 404 status', () => {
      const error = consumer.createApiError(404, 'Not Found');

      expect(error.message).toBe('Color-intel API returned 404: Not Found');
    });
  });

  describe('chunkArray', () => {
    test('splits array into chunks of specified size', () => {
      const array = [1, 2, 3, 4, 5, 6, 7];
      const chunks = consumer.chunkArray(array, 3);

      expect(chunks).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
    });

    test('returns empty array for empty input', () => {
      const chunks = consumer.chunkArray([], 5);

      expect(chunks).toEqual([]);
    });

    test('returns single chunk for small array', () => {
      const array = [1, 2];
      const chunks = consumer.chunkArray(array, 5);

      expect(chunks).toEqual([[1, 2]]);
    });

    test('handles chunk size of 1', () => {
      const array = [1, 2, 3];
      const chunks = consumer.chunkArray(array, 1);

      expect(chunks).toEqual([[1], [2], [3]]);
    });
  });
});
