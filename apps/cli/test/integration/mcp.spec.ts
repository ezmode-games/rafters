/**
 * Integration tests for the 'rafters mcp' server command
 *
 * Tests real stdio communication, token registry access, and all design intelligence tools.
 */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

describe('rafters mcp', () => {
  const testDir = '/tmp/rafters-mcp-test';

  function setupTestProject() {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
    mkdirSync(testDir, { recursive: true });
    writeFileSync(
      join(testDir, 'package.json'),
      JSON.stringify({
        name: 'mcp-test-app',
        dependencies: { react: '^19.0.0' },
      })
    );
  }

  function runRaftersCommand(args: string[]) {
    const cliPath = join(process.cwd(), 'dist', 'index.js');
    return spawn('node', [cliPath, ...args], {
      cwd: testDir,
      env: { ...process.env, CI: 'true' },
      stdio: ['pipe', 'pipe', 'pipe'],
    });
  }

  /**
   * Create an MCP client that can communicate with the server via stdio
   */
  function createMCPClient(process: ReturnType<typeof runRaftersCommand>) {
    let messageId = 1;

    const sendRequest = (method: string, params?: Record<string, unknown>): Promise<unknown> => {
      return new Promise((resolve, reject) => {
        const request = {
          jsonrpc: '2.0',
          id: messageId++,
          method,
          params: params || {},
        };

        const timeout = setTimeout(() => {
          reject(new Error(`Request timeout: ${method}`));
        }, 5000);

        let responseBuffer = '';

        const onData = (data: Buffer) => {
          responseBuffer += data.toString();

          // Try to parse complete JSON responses
          const lines = responseBuffer.split('\n');
          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i].trim();
            if (line.startsWith('{')) {
              try {
                const response = JSON.parse(line);
                if (response.id === request.id) {
                  clearTimeout(timeout);
                  process.stdout?.off('data', onData);

                  if (response.error) {
                    reject(new Error(response.error.message));
                  } else {
                    resolve(response.result);
                  }
                  return;
                }
              } catch (e) {
                // Not a complete JSON yet, continue
              }
            }
          }

          // Keep the last incomplete line in buffer
          responseBuffer = lines[lines.length - 1];
        };

        process.stdout?.on('data', onData);

        // Send the request
        process.stdin?.write(`${JSON.stringify(request)}\n`);
      });
    };

    const initialize = async () => {
      return sendRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
          name: 'test-client',
          version: '1.0.0',
        },
      });
    };

    const listTools = async () => {
      return sendRequest('tools/list');
    };

    const callTool = async (name: string, arguments_: Record<string, unknown>) => {
      return sendRequest('tools/call', {
        name,
        arguments: arguments_,
      });
    };

    return { initialize, listTools, callTool, sendRequest };
  }

  afterEach(async () => {
    // Clean up any test directories
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('MCP server startup and communication', () => {
    it('should start MCP server and establish stdio communication', async () => {
      setupTestProject();

      const serverProcess = runRaftersCommand(['mcp']);
      const client = createMCPClient(serverProcess);

      try {
        // Test server startup by initializing
        const initResult = await client.initialize();
        expect(initResult).toBeDefined();
        expect(initResult.capabilities).toBeDefined();

        // Test tool listing
        const toolsResult = (await client.listTools()) as { tools: unknown[] };
        expect(toolsResult.tools).toBeDefined();
        expect(Array.isArray(toolsResult.tools)).toBe(true);
        expect(toolsResult.tools.length).toBe(7); // All 7 design intelligence tools
      } finally {
        serverProcess.kill('SIGTERM');
      }
    }, 10000);

    it('should list all 7 design intelligence tools', async () => {
      setupTestProject();

      const serverProcess = runRaftersCommand(['mcp']);
      const client = createMCPClient(serverProcess);

      try {
        await client.initialize();
        const result = (await client.listTools()) as { tools: { name: string }[] };

        const toolNames = result.tools.map((t) => t.name);
        const expectedTools = [
          'get_color_intelligence',
          'get_token_by_category',
          'get_component_intelligence',
          'validate_color_combination',
          'get_accessible_colors',
          'get_tokens_by_trust_level',
          'calculate_cognitive_load',
        ];

        for (const expectedTool of expectedTools) {
          expect(toolNames).toContain(expectedTool);
        }
      } finally {
        serverProcess.kill('SIGTERM');
      }
    }, 10000);
  });

  describe('token registry integration', () => {
    it('should handle missing .rafters directory gracefully', async () => {
      setupTestProject();
      // Don't run init, so no .rafters directory exists

      const serverProcess = runRaftersCommand(['mcp']);
      const client = createMCPClient(serverProcess);

      try {
        await client.initialize();

        // Try to call a token-related tool
        const result = await client.callTool('get_color_intelligence', { tokenName: 'primary' });
        expect(result.content[0].type).toBe('text');
        const data = JSON.parse(result.content[0].text);
        expect(data.error).toContain('Token registry not found');
      } finally {
        serverProcess.kill('SIGTERM');
      }
    }, 10000);

    it('should access token registry after initialization', async () => {
      setupTestProject();

      // Initialize project first
      const initProcess = runRaftersCommand(['init', '--yes']);
      await new Promise((resolve) => {
        initProcess.on('close', resolve);
      });

      const serverProcess = runRaftersCommand(['mcp']);
      const client = createMCPClient(serverProcess);

      try {
        await client.initialize();

        // Test token category listing
        const result = await client.callTool('get_token_by_category', {
          category: 'color',
        });

        expect(result.content).toBeDefined();
        expect(Array.isArray(result.content)).toBe(true);
        expect(result.content[0].type).toBe('text');

        const data = JSON.parse(result.content[0].text);
        expect(data.category).toBe('color');
        expect(data.tokens).toBeDefined();
        expect(Array.isArray(data.tokens)).toBe(true);
      } finally {
        serverProcess.kill('SIGTERM');
      }
    }, 15000);

    it('should get color intelligence for existing tokens', async () => {
      setupTestProject();

      // Initialize project first
      const initProcess = runRaftersCommand(['init', '--yes']);
      await new Promise((resolve) => {
        initProcess.on('close', resolve);
      });

      const serverProcess = runRaftersCommand(['mcp']);
      const client = createMCPClient(serverProcess);

      try {
        await client.initialize();

        const result = await client.callTool('get_color_intelligence', {
          tokenName: 'primary',
        });

        expect(result.content[0].type).toBe('text');
        const data = JSON.parse(result.content[0].text);

        expect(data.token).toBeDefined();
        expect(data.token.name).toBe('primary');
        expect(data.token.category).toBe('color');
        expect(data.intelligence).toBeDefined();
        expect(data.scale).toBeDefined();
        expect(data.states).toBeDefined();
      } finally {
        serverProcess.kill('SIGTERM');
      }
    }, 15000);

    it('should validate color combinations with cognitive load analysis', async () => {
      setupTestProject();

      // Initialize project first
      const initProcess = runRaftersCommand(['init', '--yes']);
      await new Promise((resolve) => {
        initProcess.on('close', resolve);
      });

      const serverProcess = runRaftersCommand(['mcp']);
      const client = createMCPClient(serverProcess);

      try {
        await client.initialize();

        const result = await client.callTool('validate_color_combination', {
          colors: ['primary', 'secondary', 'destructive'],
        });

        expect(result.content[0].type).toBe('text');
        const data = JSON.parse(result.content[0].text);

        expect(data.valid).toBeDefined();
        expect(data.totalCognitiveLoad).toBeDefined();
        expect(data.trustLevels).toBeDefined();
        expect(data.warnings).toBeDefined();
        expect(data.recommendation).toBeDefined();
        expect(Array.isArray(data.warnings)).toBe(true);
      } finally {
        serverProcess.kill('SIGTERM');
      }
    }, 15000);

    it('should filter tokens by trust level', async () => {
      setupTestProject();

      // Initialize project first
      const initProcess = runRaftersCommand(['init', '--yes']);
      await new Promise((resolve) => {
        initProcess.on('close', resolve);
      });

      const serverProcess = runRaftersCommand(['mcp']);
      const client = createMCPClient(serverProcess);

      try {
        await client.initialize();

        // Test with 'high' trust level since we know primary token has trustLevel='high'
        const result = await client.callTool('get_tokens_by_trust_level', {
          trustLevel: 'high',
        });

        expect(result.content[0].type).toBe('text');
        const data = JSON.parse(result.content[0].text);

        expect(data.trustLevel).toBe('high');
        expect(data.count).toBeDefined();
        expect(data.tokens).toBeDefined();
        expect(Array.isArray(data.tokens)).toBe(true);

        // Should have at least the primary token which has trustLevel='high'
        expect(data.count).toBeGreaterThan(0);

        // All returned tokens should have high trust level
        for (const token of data.tokens) {
          expect(token.trustLevel).toBe('high');
        }
      } finally {
        serverProcess.kill('SIGTERM');
      }
    }, 15000);
  });

  describe('component intelligence integration', () => {
    it('should fetch component intelligence with network requests', async () => {
      setupTestProject();

      const serverProcess = runRaftersCommand(['mcp']);
      const client = createMCPClient(serverProcess);

      try {
        await client.initialize();

        const result = await client.callTool('get_component_intelligence', {
          componentName: 'button',
        });

        expect(result.content[0].type).toBe('text');
        const data = JSON.parse(result.content[0].text);

        expect(data.name).toBe('button');
        expect(data.intelligence).toBeDefined();
        expect(data.description).toBeDefined();
      } finally {
        serverProcess.kill('SIGTERM');
      }
    }, 15000);

    it('should calculate cognitive load for components', async () => {
      setupTestProject();

      const serverProcess = runRaftersCommand(['mcp']);
      const client = createMCPClient(serverProcess);

      try {
        await client.initialize();

        const result = await client.callTool('calculate_cognitive_load', {
          components: ['button', 'input'],
        });

        expect(result.content[0].type).toBe('text');
        const data = JSON.parse(result.content[0].text);

        expect(data.components).toBeDefined();
        expect(Array.isArray(data.components)).toBe(true);
        expect(data.totalLoad).toBeDefined();
        expect(data.budget).toBeDefined();
        expect(data.remaining).toBeDefined();
        expect(data.status).toBeDefined();
        expect(data.recommendation).toBeDefined();
      } finally {
        serverProcess.kill('SIGTERM');
      }
    }, 15000);
  });

  describe('error handling and edge cases', () => {
    it('should handle nonexistent token requests gracefully', async () => {
      setupTestProject();

      // Initialize project first
      const initProcess = runRaftersCommand(['init', '--yes']);
      await new Promise((resolve) => {
        initProcess.on('close', resolve);
      });

      const serverProcess = runRaftersCommand(['mcp']);
      const client = createMCPClient(serverProcess);

      try {
        await client.initialize();

        const result = await client.callTool('get_color_intelligence', {
          tokenName: 'nonexistent-token',
        });

        expect(result.content[0].type).toBe('text');
        const data = JSON.parse(result.content[0].text);

        expect(data.error).toBeDefined();
        expect(data.error).toContain('not found');
      } finally {
        serverProcess.kill('SIGTERM');
      }
    }, 15000);

    it('should handle invalid tool calls gracefully', async () => {
      setupTestProject();

      const serverProcess = runRaftersCommand(['mcp']);
      const client = createMCPClient(serverProcess);

      try {
        await client.initialize();

        const result = await client.callTool('nonexistent_tool', {});

        expect(result.content[0].type).toBe('text');
        const data = JSON.parse(result.content[0].text);
        expect(data.error).toContain('Unknown tool');
      } finally {
        serverProcess.kill('SIGTERM');
      }
    }, 10000);

    it('should handle malformed requests properly', async () => {
      setupTestProject();

      const serverProcess = runRaftersCommand(['mcp']);
      const client = createMCPClient(serverProcess);

      try {
        await client.initialize();

        // Send malformed request (missing required parameter)
        const result = await client.callTool('get_color_intelligence', {});

        expect(result.content[0].type).toBe('text');
        const data = JSON.parse(result.content[0].text);
        expect(data.error).toBeDefined();
      } finally {
        serverProcess.kill('SIGTERM');
      }
    }, 10000);
  });

  describe('performance and reliability', () => {
    it('should start server within performance requirements', async () => {
      setupTestProject();

      const startTime = Date.now();
      const serverProcess = runRaftersCommand(['mcp']);
      const client = createMCPClient(serverProcess);

      try {
        await client.initialize();
        const duration = Date.now() - startTime;

        // Should start within 2 seconds as specified
        expect(duration).toBeLessThan(2000);
      } finally {
        serverProcess.kill('SIGTERM');
      }
    }, 10000);

    it('should respond to tool calls within performance requirements', async () => {
      setupTestProject();

      // Initialize project first
      const initProcess = runRaftersCommand(['init', '--yes']);
      await new Promise((resolve) => {
        initProcess.on('close', resolve);
      });

      const serverProcess = runRaftersCommand(['mcp']);
      const client = createMCPClient(serverProcess);

      try {
        await client.initialize();

        const startTime = Date.now();
        await client.callTool('get_token_by_category', { category: 'color' });
        const duration = Date.now() - startTime;

        // Should respond within 1 second for cached data
        expect(duration).toBeLessThan(1000);
      } finally {
        serverProcess.kill('SIGTERM');
      }
    }, 15000);
  });
});
