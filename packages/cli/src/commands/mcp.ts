/**
 * rafters mcp
 *
 * Starts MCP server for AI agent access (stdio transport)
 */

import { startMcpServer } from '../mcp/server.js';

export async function mcp(): Promise<void> {
  // Start the MCP server - this blocks until shutdown
  await startMcpServer();
}
