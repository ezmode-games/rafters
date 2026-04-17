/**
 * rafters mcp
 *
 * Starts MCP server for AI agent access (stdio transport).
 *
 * Discovery:
 *   - With no `--project-root`, walks up from cwd looking for a monorepo
 *     manifest (pnpm-workspace.yaml or package.json#workspaces). Each
 *     workspace package with a `.rafters/config.rafters.json` becomes an
 *     addressable workspace; the agent picks one per tool call via the
 *     `workspace` parameter.
 *   - Falls back to single-root mode when no monorepo manifest is found.
 *   - With `--project-root`, scopes the server to that one workspace.
 */

import { existsSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { startMcpServer } from '../mcp/server.js';
import { discoverWorkspaces, pickDefaultWorkspace, type Workspace } from '../utils/workspaces.js';

interface McpOptions {
  projectRoot?: string;
}

export async function mcp(options: McpOptions): Promise<void> {
  let workspaces: Workspace[];
  let defaultWorkspace: Workspace | null;

  if (options.projectRoot) {
    const explicit = resolve(options.projectRoot);
    const configPath = join(explicit, '.rafters', 'config.rafters.json');
    if (!existsSync(configPath)) {
      process.stderr.write(
        `--project-root ${explicit} does not contain .rafters/config.rafters.json\n`,
      );
      workspaces = [];
      defaultWorkspace = null;
    } else {
      const ws: Workspace = { name: basename(explicit), root: explicit };
      workspaces = [ws];
      defaultWorkspace = ws;
    }
  } else {
    workspaces = discoverWorkspaces(process.cwd());
    defaultWorkspace = pickDefaultWorkspace(workspaces, process.cwd());
  }

  await startMcpServer(workspaces, defaultWorkspace);
}
