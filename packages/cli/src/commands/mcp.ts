/**
 * rafters mcp
 *
 * Starts MCP server for AI agent access (stdio transport).
 * Discovers the project root by walking up from cwd to find .rafters/,
 * or uses --project-root if provided.
 */

import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { startMcpServer } from '../mcp/server.js';
import { discoverProjectRoot } from '../utils/discover.js';

interface McpOptions {
  projectRoot?: string;
}

export async function mcp(options: McpOptions): Promise<void> {
  let projectRoot: string | null;

  if (options.projectRoot) {
    const explicit = resolve(options.projectRoot);
    const configPath = join(explicit, '.rafters', 'config.rafters.json');
    if (!existsSync(configPath)) {
      process.stderr.write(
        `--project-root ${explicit} does not contain .rafters/config.rafters.json\n`,
      );
      projectRoot = null;
    } else {
      projectRoot = explicit;
    }
  } else {
    projectRoot = discoverProjectRoot(process.cwd());
  }

  await startMcpServer(projectRoot);
}
