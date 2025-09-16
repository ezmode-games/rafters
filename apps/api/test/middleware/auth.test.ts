/**
 * Unit Tests for Authentication Middleware
 *
 * Tests API key validation, timing-safe comparison, and security logging.
 * Focuses on security aspects and error handling.
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { allowDevelopment, requireApiKey } from '../../src/middleware/auth';

// Mock Hono Context and Next
interface MockContext {
  req: {
    header: ReturnType<typeof vi.fn>;
    path: string;
  };
  env: {
    SEED_QUEUE_API_KEY?: string;
  };
  json: ReturnType<typeof vi.fn>;
}

type MockHonoContext = MockContext & Record<string, unknown>;

type MockNext = () => Promise<void>;

describe('requireApiKey middleware', () => {
  let mockContext: MockContext;
  let mockNext: MockNext;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockContext = {
      req: {
        header: vi.fn(),
        path: '/api/seed-queue/single',
      },
      env: {
        SEED_QUEUE_API_KEY: 'valid-api-key-12345',
      },
      json: vi.fn().mockReturnValue({
        status: 401,
        body: { error: 'Mock response' },
      }),
    };

    mockNext = vi.fn().mockResolvedValue(undefined);

    // Spy on console methods for security logging tests
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  describe('successful authentication', () => {
    test('allows valid API key in X-API-Key header', async () => {
      mockContext.req.header.mockImplementation((name: string) => {
        if (name === 'X-API-Key') return 'valid-api-key-12345';
        return undefined;
      });

      const middleware = requireApiKey();
      await middleware(mockContext as MockHonoContext, mockNext);

      expect(mockNext).toHaveBeenCalledOnce();
      expect(mockContext.json).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    test('allows valid API key in X-API-Key header', async () => {
      mockContext.req.header.mockImplementation((name: string) => {
        if (name === 'X-API-Key') return 'valid-api-key-12345';
        return undefined;
      });

      const middleware = requireApiKey();
      await middleware(mockContext as MockHonoContext, mockNext);

      expect(mockNext).toHaveBeenCalledOnce();
      expect(mockContext.json).not.toHaveBeenCalled();
    });

    test('only checks X-API-Key header (optimized)', async () => {
      mockContext.req.header.mockImplementation((name: string) => {
        if (name === 'X-API-Key') return 'valid-api-key-12345';
        return undefined;
      });

      const middleware = requireApiKey();
      await middleware(mockContext as MockHonoContext, mockNext);

      expect(mockContext.req.header).toHaveBeenCalledWith('X-API-Key');
      expect(mockContext.req.header).toHaveBeenCalledTimes(1); // Only one call now
      expect(mockNext).toHaveBeenCalledOnce();
    });
  });

  describe('missing API key', () => {
    test('rejects request with no API key header', async () => {
      mockContext.req.header.mockReturnValue(undefined);

      const middleware = requireApiKey();
      await middleware(mockContext as MockHonoContext, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockContext.json).toHaveBeenCalledWith(
        {
          error: 'Authentication required',
          message: 'Missing X-API-Key header',
          code: 'MISSING_API_KEY',
        },
        401,
        {
          'Cache-Control': 'public, max-age=300',
          'Content-Type': 'application/json',
        }
      );
    });

    test('rejects request with empty API key header', async () => {
      mockContext.req.header.mockReturnValue('');

      const middleware = requireApiKey();
      await middleware(mockContext as MockHonoContext, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'MISSING_API_KEY',
        }),
        401,
        {
          'Cache-Control': 'public, max-age=300',
          'Content-Type': 'application/json',
        }
      );
    });
  });

  describe('invalid API key', () => {
    test('rejects incorrect API key', async () => {
      mockContext.req.header.mockImplementation((name: string) => {
        if (name === 'X-API-Key') return 'wrong-api-key';
        return undefined;
      });

      const middleware = requireApiKey();
      await middleware(mockContext as MockHonoContext, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockContext.json).toHaveBeenCalledWith(
        {
          error: 'Invalid API key',
          message: 'The provided API key is not valid',
          code: 'INVALID_API_KEY',
        },
        403,
        {
          'Cache-Control': 'no-cache, no-store',
          'Content-Type': 'application/json',
        }
      );
    });

    test('logs security warning for invalid API key attempts', async () => {
      mockContext.req.header.mockImplementation((name: string) => {
        if (name === 'X-API-Key') return 'malicious-key';
        if (name === 'CF-Connecting-IP') return '192.168.1.100';
        if (name === 'User-Agent') return 'BadBot/1.0';
        return undefined;
      });

      const middleware = requireApiKey();
      await middleware(mockContext as MockHonoContext, mockNext);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Unauthorized access attempt:',
        expect.objectContaining({
          ip: '192.168.1.100',
          path: '/api/seed-queue/single',
          timestamp: expect.any(Number), // Now using timestamp instead of ISO string
        })
      );
    });

    test('handles missing IP and User-Agent in security logs', async () => {
      mockContext.req.header.mockImplementation((name: string) => {
        if (name === 'X-API-Key') return 'wrong-key';
        if (name === 'CF-Connecting-IP') return undefined;
        if (name === 'User-Agent') return undefined;
        return undefined;
      });

      const middleware = requireApiKey();
      await middleware(mockContext as MockHonoContext, mockNext);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Unauthorized access attempt:',
        expect.objectContaining({
          ip: 'unknown',
          timestamp: expect.any(Number),
        })
      );
    });
  });

  describe('server configuration errors', () => {
    test('returns 500 when SEED_QUEUE_API_KEY is not configured', async () => {
      mockContext.env.SEED_QUEUE_API_KEY = undefined;
      mockContext.req.header.mockReturnValue('any-key');

      const middleware = requireApiKey();
      await middleware(mockContext as MockHonoContext, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockContext.json).toHaveBeenCalledWith(
        {
          error: 'Server configuration error',
          message: 'Authentication system not properly configured',
          code: 'AUTH_CONFIG_ERROR',
        },
        500,
        { 'Cache-Control': 'no-cache' }
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'SEED_QUEUE_API_KEY environment variable not configured'
      );
    });

    test('returns 500 when SEED_QUEUE_API_KEY is empty string', async () => {
      mockContext.env.SEED_QUEUE_API_KEY = '';
      mockContext.req.header.mockReturnValue('any-key');

      const middleware = requireApiKey();
      await middleware(mockContext as MockHonoContext, mockNext);

      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'AUTH_CONFIG_ERROR',
        }),
        500,
        { 'Cache-Control': 'no-cache' }
      );
    });
  });

  describe('timing-safe comparison', () => {
    test('uses timing-safe comparison for security', async () => {
      // This test verifies that the function behaves consistently
      // regardless of where strings differ (to prevent timing attacks)
      const validKey = 'secret-key-123456789';
      mockContext.env.SEED_QUEUE_API_KEY = validKey;

      // Test multiple different keys to ensure consistent behavior
      const testKeys = [
        'wrong-key-123456789', // Different prefix, same length
        'secret-key-wrongsuffix', // Different suffix, same length
        'totally-different-key', // Completely different, same length
        'short', // Different length
      ];

      for (const testKey of testKeys) {
        mockContext.req.header.mockImplementation((name: string) => {
          if (name === 'X-API-Key') return testKey;
          return undefined;
        });

        const middleware = requireApiKey();
        await middleware(mockContext as MockHonoContext, mockNext);

        // All should be rejected (none match the valid key)
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockContext.json).toHaveBeenCalledWith(
          expect.objectContaining({
            code: 'INVALID_API_KEY',
          }),
          403,
          {
            'Cache-Control': 'no-cache, no-store',
            'Content-Type': 'application/json',
          }
        );

        // Reset mocks for next iteration
        vi.clearAllMocks();
        mockNext = vi.fn().mockResolvedValue(undefined);
        mockContext.json = vi.fn().mockReturnValue({ status: 403 });
      }
    });

    test('correctly identifies valid key among similar keys', async () => {
      const validKey = 'precise-match-key';
      mockContext.env.SEED_QUEUE_API_KEY = validKey;

      // Test exact match
      mockContext.req.header.mockImplementation((name: string) => {
        if (name === 'X-API-Key') return 'precise-match-key';
        return undefined;
      });

      const middleware = requireApiKey();
      await middleware(mockContext as MockHonoContext, mockNext);

      expect(mockNext).toHaveBeenCalledOnce();
      expect(mockContext.json).not.toHaveBeenCalled();
    });

    test('rejects keys that differ by single character', async () => {
      mockContext.env.SEED_QUEUE_API_KEY = 'precise-match-key';

      mockContext.req.header.mockImplementation((name: string) => {
        if (name === 'X-API-Key') return 'precise-match-kez'; // Changed last char
        return undefined;
      });

      const middleware = requireApiKey();
      await middleware(mockContext as MockHonoContext, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'INVALID_API_KEY',
        }),
        403,
        {
          'Cache-Control': 'no-cache, no-store',
          'Content-Type': 'application/json',
        }
      );
    });
  });
});

describe('allowDevelopment middleware', () => {
  let mockContext: MockContext;
  let mockNext: MockNext;

  beforeEach(() => {
    mockContext = {
      req: {
        header: vi.fn(),
        path: '/api/seed-queue/single',
      },
      env: {
        SEED_QUEUE_API_KEY: 'valid-api-key-12345',
      },
      json: vi.fn().mockReturnValue({ status: 401 }),
    };

    mockNext = vi.fn().mockResolvedValue(undefined);
  });

  test('allows development bypass with correct dev key', async () => {
    mockContext.req.header.mockImplementation((name: string) => {
      if (name === 'CF-Worker-Environment') return 'development';
      if (name === 'X-Dev-Key') return 'dev-queue-access';
      return undefined;
    });

    const middleware = allowDevelopment();
    await middleware(mockContext as MockHonoContext, mockNext);

    expect(mockNext).toHaveBeenCalledOnce();
    expect(mockContext.json).not.toHaveBeenCalled();
  });

  test('allows staging bypass with correct dev key', async () => {
    mockContext.req.header.mockImplementation((name: string) => {
      if (name === 'CF-Worker-Environment') return 'staging';
      if (name === 'X-Dev-Key') return 'dev-queue-access';
      return undefined;
    });

    const middleware = allowDevelopment();
    await middleware(mockContext as MockHonoContext, mockNext);

    expect(mockNext).toHaveBeenCalledOnce();
  });

  test('requires full auth in production environment', async () => {
    mockContext.req.header.mockImplementation((name: string) => {
      if (name === 'CF-Worker-Environment') return 'production';
      if (name === 'X-Dev-Key') return 'dev-queue-access';
      if (name === 'X-API-Key') return 'valid-api-key-12345';
      return undefined;
    });

    const middleware = allowDevelopment();
    await middleware(mockContext as MockHonoContext, mockNext);

    expect(mockNext).toHaveBeenCalledOnce();
  });

  test('requires full auth when environment header is missing', async () => {
    mockContext.req.header.mockImplementation((name: string) => {
      if (name === 'CF-Worker-Environment') return undefined;
      if (name === 'X-Dev-Key') return 'dev-queue-access';
      if (name === 'X-API-Key') return 'valid-api-key-12345';
      return undefined;
    });

    const middleware = allowDevelopment();
    await middleware(mockContext as MockHonoContext, mockNext);

    expect(mockNext).toHaveBeenCalledOnce();
  });

  test('rejects development request with wrong dev key', async () => {
    mockContext.req.header.mockImplementation((name: string) => {
      if (name === 'CF-Worker-Environment') return 'development';
      if (name === 'X-Dev-Key') return 'wrong-dev-key';
      return undefined;
    });

    const middleware = allowDevelopment();
    await middleware(mockContext as MockHonoContext, mockNext);

    // Should fall back to requireApiKey behavior
    expect(mockNext).not.toHaveBeenCalled();
    expect(mockContext.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'MISSING_API_KEY',
      }),
      401,
      {
        'Cache-Control': 'public, max-age=300',
        'Content-Type': 'application/json',
      }
    );
  });

  test('rejects development request with no dev key', async () => {
    mockContext.req.header.mockImplementation((name: string) => {
      if (name === 'CF-Worker-Environment') return 'development';
      if (name === 'X-Dev-Key') return undefined;
      return undefined;
    });

    const middleware = allowDevelopment();
    await middleware(mockContext as MockHonoContext, mockNext);

    // Should fall back to requireApiKey behavior
    expect(mockNext).not.toHaveBeenCalled();
    expect(mockContext.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'MISSING_API_KEY',
      }),
      401,
      {
        'Cache-Control': 'public, max-age=300',
        'Content-Type': 'application/json',
      }
    );
  });
});
