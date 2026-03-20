/**
 * rafters mcp
 *
 * Starts MCP server for AI agent access (stdio transport).
 * Discovers the project root by walking up from cwd to find .rafters/,
 * or uses --project-root if provided.
 */

import { startMcpServer } from '../mcp/server.js';
import { discoverProjectRoot } from '../utils/discover.js';

interface McpOptions {
  projectRoot?: string;
}

export async function mcp(options: McpOptions): Promise<void> {
  const projectRoot = options.projectRoot ?? discoverProjectRoot(process.cwd());
  await startMcpServer(projectRoot);
}
