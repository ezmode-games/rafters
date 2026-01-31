/**
 * Vite Plugin API Tests
 *
 * Exhaustive tests for the Studio API endpoints.
 * Uses real @rafters/color-utils and @rafters/design-tokens implementations.
 * Only mocks file system and persistence layer.
 */

import { EventEmitter } from 'node:events';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

// Use vi.hoisted to ensure mock objects are created before vi.mock runs
const { mockRegistry, mockPersistence, mockMkdir, mockWriteFile } = vi.hoisted(() => ({
  mockRegistry: {
    add: vi.fn(),
    get: vi.fn().mockReturnValue(null),
    list: vi.fn().mockReturnValue([]),
    has: vi.fn().mockReturnValue(true),
    updateToken: vi.fn(),
    setChangeCallback: vi.fn(),
  },
  mockPersistence: {
    listNamespaces: vi.fn().mockResolvedValue([]),
    loadNamespace: vi.fn().mockResolvedValue([]),
    saveNamespace: vi.fn().mockResolvedValue(undefined),
  },
  mockMkdir: vi.fn().mockResolvedValue(undefined),
  mockWriteFile: vi.fn().mockResolvedValue(undefined),
}));

// Mock only file system - not the package implementations
vi.mock('node:fs/promises', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs/promises')>();
  return {
    ...actual,
    mkdir: mockMkdir,
    writeFile: mockWriteFile,
  };
});

// Mock only the persistence and registry classes, not the utility functions
vi.mock('@rafters/design-tokens', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@rafters/design-tokens')>();
  return {
    ...actual,
    // Use real implementations for these - they create proper structures
    generateColorTokens: actual.generateColorTokens,
    resolveConfig: actual.resolveConfig,
    registryToVars: actual.registryToVars,
    // Mock only the classes that interact with file system/state
    TokenRegistry: vi.fn().mockImplementation(() => mockRegistry),
    NodePersistenceAdapter: vi.fn().mockImplementation(() => mockPersistence),
  };
});

// Use real color-utils - no mocking, these functions create proper structures

// Helper to create mock request
function createMockRequest(
  method: string,
  url: string,
  body?: unknown,
): IncomingMessage & EventEmitter {
  const req = new EventEmitter() as IncomingMessage & EventEmitter;
  req.method = method;
  req.url = url;

  // If body provided, emit data events after a tick
  if (body !== undefined) {
    process.nextTick(() => {
      req.emit('data', JSON.stringify(body));
      req.emit('end');
    });
  }

  return req;
}

// Helper to create mock response
function createMockResponse(): ServerResponse & {
  _headers: Record<string, string>;
  _body: string;
  _statusCode: number;
} {
  const res = {
    _headers: {} as Record<string, string>,
    _body: '',
    _statusCode: 200,
    statusCode: 200,
    setHeader(name: string, value: string) {
      this._headers[name] = value;
    },
    end(body?: string) {
      this._body = body || '';
    },
    getHeader(name: string) {
      return this._headers[name];
    },
  } as ServerResponse & {
    _headers: Record<string, string>;
    _body: string;
    _statusCode: number;
  };

  Object.defineProperty(res, 'statusCode', {
    get() {
      return this._statusCode;
    },
    set(value: number) {
      this._statusCode = value;
    },
  });

  return res;
}

// Helper to wait for async middleware with body
function waitForAsyncMiddleware(ms = 20): Promise<void> {
  return new Promise((resolve) => {
    // Use setTimeout to ensure all async operations complete
    setTimeout(resolve, ms);
  });
}

describe('studioApiPlugin', () => {
  let studioApiPlugin: typeof import('../../src/api/vite-plugin').studioApiPlugin;
  let middleware: (req: IncomingMessage, res: ServerResponse, next: () => void) => Promise<void>;

  beforeAll(async () => {
    // Set environment variable before importing
    process.env.RAFTERS_PROJECT_PATH = '/test/project';

    // Import the module (mocks are already in place from vi.mock)
    const module = await import('../../src/api/vite-plugin');
    studioApiPlugin = module.studioApiPlugin;

    // Force registry initialization with a warmup request
    // This ensures the singleton is set up before actual tests run
    const plugin = studioApiPlugin();
    const mockServer = {
      middlewares: {
        use: vi.fn((mw) => {
          middleware = mw;
        }),
      },
    };
    (plugin.configureServer as (server: typeof mockServer) => void)(mockServer);

    // Make a warmup request to initialize the registry
    const warmupReq = new EventEmitter() as IncomingMessage & EventEmitter;
    warmupReq.method = 'GET';
    warmupReq.url = '/api/tokens';
    const warmupRes = createMockResponse();
    await middleware(warmupReq, warmupRes, () => {});
    await waitForAsyncMiddleware(100);
  });

  beforeEach(() => {
    // Clear mock states but keep implementations
    vi.clearAllMocks();

    // Reset mock return values to defaults
    mockRegistry.list.mockReturnValue([]);
    mockRegistry.has.mockReturnValue(true);
    mockRegistry.updateToken.mockReturnValue(undefined);
    mockPersistence.listNamespaces.mockResolvedValue([]);
    mockPersistence.loadNamespace.mockResolvedValue([]);
    mockPersistence.saveNamespace.mockResolvedValue(undefined);

    // Create fresh plugin and extract middleware
    const plugin = studioApiPlugin();
    const mockServer = {
      middlewares: {
        use: vi.fn((mw) => {
          middleware = mw;
        }),
      },
    };
    (plugin.configureServer as (server: typeof mockServer) => void)(mockServer);
  });

  afterAll(() => {
    delete process.env.RAFTERS_PROJECT_PATH;
  });

  describe('GET /api/tokens', () => {
    it('returns tokens grouped by namespace', async () => {
      mockRegistry.list.mockReturnValue([
        { name: 'color-primary', value: 'blue', namespace: 'color' },
        { name: 'spacing-4', value: '1rem', namespace: 'spacing' },
      ]);

      const req = createMockRequest('GET', '/api/tokens');
      const res = createMockResponse();
      const next = vi.fn();

      await middleware(req, res, next);
      await waitForAsyncMiddleware();

      expect(next).not.toHaveBeenCalled();
      expect(res._headers['Content-Type']).toBe('application/json');

      const response = JSON.parse(res._body);
      expect(response.tokens.color).toHaveLength(1);
      expect(response.tokens.spacing).toHaveLength(1);
    });

    it('groups tokens without namespace under "default"', async () => {
      mockRegistry.list.mockReturnValue([
        { name: 'orphan-token', value: 'value' }, // No namespace
      ]);

      const req = createMockRequest('GET', '/api/tokens');
      const res = createMockResponse();
      const next = vi.fn();

      await middleware(req, res, next);
      await waitForAsyncMiddleware();

      const response = JSON.parse(res._body);
      expect(response.tokens.default).toHaveLength(1);
    });

    it('handles empty token list', async () => {
      mockRegistry.list.mockReturnValue([]);

      const req = createMockRequest('GET', '/api/tokens');
      const res = createMockResponse();
      const next = vi.fn();

      await middleware(req, res, next);
      await waitForAsyncMiddleware();

      const response = JSON.parse(res._body);
      expect(response.tokens).toEqual({});
    });

    it('handles registry errors', async () => {
      mockRegistry.list.mockImplementation(() => {
        throw new Error('Registry corrupted');
      });

      const req = createMockRequest('GET', '/api/tokens');
      const res = createMockResponse();
      const next = vi.fn();

      await middleware(req, res, next);
      await waitForAsyncMiddleware();

      expect(res._statusCode).toBe(500);
      const response = JSON.parse(res._body);
      expect(response.error).toContain('Registry corrupted');
    });
  });

  describe('PATCH /api/token/:ns/:name', () => {
    it('updates token with new value', async () => {
      const req = createMockRequest('PATCH', '/api/token/color/primary', {
        value: 'red',
      });
      const res = createMockResponse();
      const next = vi.fn();

      await middleware(req, res, next);
      await waitForAsyncMiddleware();

      expect(mockRegistry.updateToken).toHaveBeenCalledWith('color/primary', 'red');
      expect(res._statusCode).toBe(200);
    });

    it('persists changes to file', async () => {
      mockRegistry.list.mockReturnValue([{ name: 'primary', value: 'red', namespace: 'color' }]);

      const req = createMockRequest('PATCH', '/api/token/color/primary', {
        value: 'red',
      });
      const res = createMockResponse();
      const next = vi.fn();

      await middleware(req, res, next);
      await waitForAsyncMiddleware();

      expect(mockPersistence.saveNamespace).toHaveBeenCalledWith('color', expect.any(Array));
    });

    it('returns 400 when value is missing', async () => {
      const req = createMockRequest('PATCH', '/api/token/color/primary', {});
      const res = createMockResponse();
      const next = vi.fn();

      await middleware(req, res, next);
      await waitForAsyncMiddleware();

      expect(res._statusCode).toBe(400);
      const response = JSON.parse(res._body);
      expect(response.error).toBe('value required');
    });

    it('returns 404 when token not found', async () => {
      mockRegistry.has.mockReturnValue(false);

      const req = createMockRequest('PATCH', '/api/token/color/nonexistent', {
        value: 'red',
      });
      const res = createMockResponse();
      const next = vi.fn();

      await middleware(req, res, next);
      await waitForAsyncMiddleware();

      expect(res._statusCode).toBe(404);
      const response = JSON.parse(res._body);
      expect(response.error).toBe('Token not found');
    });

    it('handles special characters in token name', async () => {
      mockRegistry.has.mockReturnValue(true);

      const req = createMockRequest('PATCH', '/api/token/color/color-primary-500', {
        value: 'blue',
      });
      const res = createMockResponse();
      const next = vi.fn();

      await middleware(req, res, next);
      await waitForAsyncMiddleware();

      expect(mockRegistry.updateToken).toHaveBeenCalledWith('color/color-primary-500', 'blue');
    });
  });

  describe('POST /api/tokens/primary', () => {
    const mockColor = { l: 0.6, c: 0.15, h: 180, alpha: 1 };

    beforeEach(() => {
      mockRegistry.has.mockReturnValue(true);
    });

    it('calls buildColorValue with correct parameters', async () => {
      const req = createMockRequest('POST', '/api/tokens/primary', {
        color: mockColor,
        reason: 'brand update',
      });
      const res = createMockResponse();
      const next = vi.fn();

      await middleware(req, res, next);
      await waitForAsyncMiddleware();

      // Real buildColorValue was called - check the response has proper ColorValue structure
      expect(res._statusCode).toBe(200);
      const response = JSON.parse(res._body);
      expect(response.colorValue).toBeDefined();
      expect(response.colorValue.token).toBe('primary');
      expect(response.colorValue.use).toBe('brand update');
    });

    it('adds generated tokens to registry', async () => {
      const req = createMockRequest('POST', '/api/tokens/primary', {
        color: mockColor,
        reason: 'test',
      });
      const res = createMockResponse();
      const next = vi.fn();

      await middleware(req, res, next);
      await waitForAsyncMiddleware();

      // Real generateColorTokens creates proper tokens - verify registry.add was called
      expect(mockRegistry.add).toHaveBeenCalled();
    });

    it('returns full ColorValue from real buildColorValue', async () => {
      const req = createMockRequest('POST', '/api/tokens/primary', {
        color: mockColor,
        reason: 'test',
      });
      const res = createMockResponse();
      const next = vi.fn();

      await middleware(req, res, next);
      await waitForAsyncMiddleware(50); // Extra time for response

      expect(res._statusCode).toBe(200);
      expect(res._body).not.toBe(''); // Ensure body was set
      const response = JSON.parse(res._body);
      expect(response.success).toBe(true);
      expect(response.colorValue).toBeDefined();
      // Real buildColorValue creates proper ColorValue with name from OKLCH analysis
      expect(response.colorValue.name).toBeDefined();
      expect(response.colorValue.scale).toBeInstanceOf(Array);
      // Real scale has 11 positions (50-950)
      expect(response.colorValue.scale.length).toBe(11);
    });

    it('persists updated tokens', async () => {
      mockRegistry.list.mockReturnValue([
        { name: 'color-primary-500', value: 'oklch(0.6 0.15 180)', namespace: 'color' },
      ]);

      const req = createMockRequest('POST', '/api/tokens/primary', {
        color: mockColor,
        reason: 'test',
      });
      const res = createMockResponse();
      const next = vi.fn();

      await middleware(req, res, next);
      await waitForAsyncMiddleware();

      expect(mockPersistence.saveNamespace).toHaveBeenCalledWith('color', expect.any(Array));
    });

    it('returns 400 when color is missing', async () => {
      const req = createMockRequest('POST', '/api/tokens/primary', {
        reason: 'test',
      });
      const res = createMockResponse();
      const next = vi.fn();

      await middleware(req, res, next);
      await waitForAsyncMiddleware();

      expect(res._statusCode).toBe(400);
      const response = JSON.parse(res._body);
      expect(response.error).toBe('Invalid request');
      expect(response.details).toBeDefined();
    });

    it('returns 400 when color format is invalid', async () => {
      const req = createMockRequest('POST', '/api/tokens/primary', {
        color: { invalid: true },
        reason: 'test',
      });
      const res = createMockResponse();
      const next = vi.fn();

      await middleware(req, res, next);
      await waitForAsyncMiddleware();

      expect(res._statusCode).toBe(400);
    });

    it('adds tokens from generator to registry', async () => {
      const req = createMockRequest('POST', '/api/tokens/primary', {
        color: mockColor,
        reason: 'test',
      });
      const res = createMockResponse();
      const next = vi.fn();

      await middleware(req, res, next);
      await waitForAsyncMiddleware();

      // Generator creates tokens and adds them to registry
      expect(mockRegistry.add).toHaveBeenCalled();
    });

    it('logs reason for design intelligence', async () => {
      // Set up spy before making the request
      const consoleSpy = vi.spyOn(console, 'log');

      const req = createMockRequest('POST', '/api/tokens/primary', {
        color: mockColor,
        reason: 'brand guidelines update',
      });
      const res = createMockResponse();
      const next = vi.fn();

      await middleware(req, res, next);
      await waitForAsyncMiddleware(50); // Extra time for logging

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('brand guidelines update'));

      consoleSpy.mockRestore();
    });

    it('updates family token with full ColorValue', async () => {
      // Set up existing family token with metadata we want preserved
      const existingFamilyToken = {
        name: 'color-primary',
        namespace: 'color',
        category: 'color',
        value: { name: 'old-blue', scale: [] },
        semanticMeaning: 'Primary brand color',
      };
      mockRegistry.get.mockImplementation((tokenId: string) => {
        if (tokenId === 'color/color-primary') return existingFamilyToken;
        return null;
      });
      mockRegistry.has.mockImplementation((tokenId: string) => {
        return tokenId === 'color/color-primary-500' || tokenId === 'color/color-primary';
      });

      const req = createMockRequest('POST', '/api/tokens/primary', {
        color: mockColor,
        reason: 'test',
      });
      const res = createMockResponse();
      const next = vi.fn();

      await middleware(req, res, next);
      await waitForAsyncMiddleware();

      // Should update the family token with real ColorValue from buildColorValue
      expect(mockRegistry.add).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'color-primary',
          namespace: 'color',
          semanticMeaning: 'Primary brand color', // Preserved from existing
          value: expect.objectContaining({
            // Real buildColorValue creates proper name from OKLCH color analysis
            name: expect.any(String),
            // Real scale has 11 OKLCH positions
            scale: expect.any(Array),
          }),
        }),
      );
    });

    it('handles server error gracefully', async () => {
      mockRegistry.get.mockImplementation(() => {
        throw new Error('Database connection failed');
      });

      const req = createMockRequest('POST', '/api/tokens/primary', {
        color: mockColor,
        reason: 'test',
      });
      const res = createMockResponse();
      const next = vi.fn();

      await middleware(req, res, next);
      await waitForAsyncMiddleware();

      expect(res._statusCode).toBe(500);
      const response = JSON.parse(res._body);
      expect(response.error).toContain('Database connection failed');
    });
  });

  describe('non-API routes', () => {
    it('passes non-API routes to next', async () => {
      const req = createMockRequest('GET', '/index.html');
      const res = createMockResponse();
      const next = vi.fn();

      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('passes unknown API routes to next', async () => {
      const req = createMockRequest('GET', '/api/unknown');
      const res = createMockResponse();
      const next = vi.fn();

      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe('studioApiPlugin - missing project path', () => {
  let middleware: (req: IncomingMessage, res: ServerResponse, next: () => void) => Promise<void>;
  let originalEnv: string | undefined;

  beforeAll(async () => {
    // Save and clear the env var
    originalEnv = process.env.RAFTERS_PROJECT_PATH;
    delete process.env.RAFTERS_PROJECT_PATH;

    // Reset modules to get fresh import without RAFTERS_PROJECT_PATH
    vi.resetModules();

    // Re-apply mocks after module reset - only mock file system and persistence classes
    vi.doMock('node:fs/promises', async (importOriginal) => {
      const actual = await importOriginal<typeof import('node:fs/promises')>();
      return {
        ...actual,
        mkdir: vi.fn().mockResolvedValue(undefined),
        writeFile: vi.fn().mockResolvedValue(undefined),
      };
    });

    vi.doMock('@rafters/design-tokens', async (importOriginal) => {
      const actual = await importOriginal<typeof import('@rafters/design-tokens')>();
      return {
        ...actual,
        // Use real implementations for utility functions
        generateColorTokens: actual.generateColorTokens,
        resolveConfig: actual.resolveConfig,
        registryToVars: actual.registryToVars,
        // Mock only the classes
        TokenRegistry: vi.fn().mockImplementation(() => mockRegistry),
        NodePersistenceAdapter: vi.fn().mockImplementation(() => mockPersistence),
      };
    });

    const { studioApiPlugin } = await import('../../src/api/vite-plugin');
    const plugin = studioApiPlugin();

    const mockServer = {
      middlewares: {
        use: vi.fn((mw) => {
          middleware = mw;
        }),
      },
    };

    (plugin.configureServer as (server: typeof mockServer) => void)(mockServer);
  });

  afterAll(() => {
    // Restore env var
    if (originalEnv !== undefined) {
      process.env.RAFTERS_PROJECT_PATH = originalEnv;
    }
    vi.resetModules();
  });

  it('returns 400 for API requests when project path not set', async () => {
    const req = createMockRequest('GET', '/api/tokens');
    const res = createMockResponse();
    const next = vi.fn();

    await middleware(req, res, next);

    expect(res._statusCode).toBe(400);
    const response = JSON.parse(res._body);
    expect(response.error).toContain('RAFTERS_PROJECT_PATH');
  });

  it('passes non-API routes to next even without project path', async () => {
    const req = createMockRequest('GET', '/index.html');
    const res = createMockResponse();
    const next = vi.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
