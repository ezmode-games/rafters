/**
 * Test suite for MCP server command
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('MCP server command', () => {
  let mockStart: ReturnType<typeof vi.fn>;
  let mockStop: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    // Reset modules to ensure clean state
    vi.resetModules();

    // Create fresh mocks for each test
    mockStart = vi.fn().mockResolvedValue(undefined);
    mockStop = vi.fn().mockResolvedValue(undefined);

    // Mock the server class before importing
    vi.doMock('../../src/mcp/server.js', () => ({
      RaftersDesignIntelligenceServer: vi.fn().mockImplementation(() => ({
        start: mockStart,
        stop: mockStop,
      })),
    }));

    // Mock console methods to avoid output during tests
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  describe('server startup', () => {
    it('should start MCP server successfully', async () => {
      const { startMCPServer } = await import('../../src/mcp/index.js');
      await expect(startMCPServer()).resolves.not.toThrow();
    });

    it('should initialize RaftersDesignIntelligenceServer', async () => {
      const { RaftersDesignIntelligenceServer } = await import('../../src/mcp/server.js');
      const { startMCPServer } = await import('../../src/mcp/index.js');

      await startMCPServer();

      expect(RaftersDesignIntelligenceServer).toHaveBeenCalledTimes(1);
    });

    it('should call start() on server instance', async () => {
      const { startMCPServer } = await import('../../src/mcp/index.js');

      await startMCPServer();

      expect(mockStart).toHaveBeenCalledTimes(1);
    });
  });

  describe('error handling', () => {
    it('should propagate server initialization errors', async () => {
      // Mock start to throw error for this test
      mockStart.mockRejectedValueOnce(new Error('Server initialization failed'));

      const { startMCPServer } = await import('../../src/mcp/index.js');

      await expect(startMCPServer()).rejects.toThrow('Server initialization failed');
    });

    it('should handle server start timeout', async () => {
      // Mock start to timeout for this test
      mockStart.mockImplementationOnce(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Server start timeout')), 50);
          })
      );

      const { startMCPServer } = await import('../../src/mcp/index.js');

      await expect(startMCPServer()).rejects.toThrow('Server start timeout');
    }, 5000);
  });

  describe('server lifecycle', () => {
    it('should create new server instance for each start', async () => {
      const { RaftersDesignIntelligenceServer } = await import('../../src/mcp/server.js');
      const { startMCPServer } = await import('../../src/mcp/index.js');

      await startMCPServer();
      await startMCPServer();

      expect(RaftersDesignIntelligenceServer).toHaveBeenCalledTimes(2);
    });
  });
});
