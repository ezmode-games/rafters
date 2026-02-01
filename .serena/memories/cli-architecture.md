# @rafters/cli Architecture

## Package Purpose
AI-first design intelligence CLI. Provides MCP server for AI agents and CLI commands for developers.

## Directory Structure
```
src/
├── index.ts              # CLI entry point (commander)
├── commands/
│   ├── init.ts           # Initialize Rafters in a project
│   ├── add.ts            # Add components
│   ├── mcp.ts            # Start MCP server
│   └── studio.ts         # Launch Studio
├── mcp/
│   ├── server.ts         # MCP server (stdio transport)
│   └── tools.ts          # Tool definitions and handler
├── registry/
│   ├── client.ts         # Fetch from website registry API
│   └── types.ts          # Registry response types
└── utils/
    ├── detect.ts         # Framework detection
    ├── paths.ts          # Path resolution
    ├── exports.ts        # Package export generation
    ├── get-package-manager.ts
    ├── update-dependencies.ts
    └── ui.ts             # Console output helpers
```

## MCP Server Architecture

### Server Setup (server.ts)
```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server(
  { name: 'rafters', version: '0.0.1' },
  { capabilities: { tools: {} } }
);

const transport = new StdioServerTransport();
await server.connect(transport);
```

### Tool Handler (tools.ts)
```typescript
class RaftersToolHandler {
  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    this.adapter = new NodePersistenceAdapter(projectRoot);
  }

  async handleToolCall(name: string, args: Record<string, unknown>) {
    switch (name) {
      case 'rafters_vocabulary': return this.getVocabulary();
      case 'rafters_pattern': return this.getPattern(args.pattern);
      case 'rafters_component': return this.getComponent(args.name);
      case 'rafters_token': return this.getToken(args.name);
    }
  }
}
```

## Four MCP Tools

| Tool | Purpose | Input |
|------|---------|-------|
| `rafters_vocabulary` | List available colors, spacing, components, patterns | none |
| `rafters_pattern` | Get guidance for scenario (destructive-action, etc) | `pattern: string` |
| `rafters_component` | Get full component intelligence | `name: string` |
| `rafters_token` | Get token with dependencies and override context | `name: string` |

## Tool Response Format

All tools return:
```typescript
{
  isError: boolean;
  content: [{ type: 'text', text: string }];  // JSON string
}
```

## CLI Commands

```bash
# Initialize Rafters in a project
rafters init

# Add a component
rafters add button

# Start MCP server (for AI agents)
rafters mcp

# Launch Studio
rafters studio
```

## Framework Detection

Detects and supports:
- Next.js (app router, pages router)
- Vite
- Remix
- Create React App

Detection order: package.json dependencies → config files → directory structure

## Registry Client

Fetches component definitions from website:
```typescript
const client = new RegistryClient('https://rafters.studio');
const component = await client.getComponent('button');
const primitive = await client.getPrimitive('focus-trap');
```

## Key Files

- `src/mcp/tools.ts` - Tool definitions with TOOL_DEFINITIONS array
- `src/mcp/server.ts` - MCP server setup with stdio transport
- `src/commands/init.ts` - Project initialization flow
- `src/registry/client.ts` - Registry API client

## Running MCP Server

Via CLI:
```bash
rafters mcp
```

Or for Claude Desktop config:
```json
{
  "mcpServers": {
    "rafters": {
      "command": "npx",
      "args": ["rafters", "mcp"],
      "cwd": "/path/to/project"
    }
  }
}
```
