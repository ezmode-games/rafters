# CLI Architecture

**Purpose:** Define the `@rafters/cli` package that initializes projects, launches Studio, generates output files, and runs the local MCP server.

---

## Overview

The CLI is the primary entry point for developers using Rafters. It follows the "Think Apple" principle: **simple commands, invisible complexity**.

```
rafters init      # Creates .rafters/ with defaults
rafters studio    # Node server + opens browser
rafters generate  # Regenerates output/ from tokens/
rafters mcp       # Local MCP server (stdio, no network)
```

---

## Package Structure

```
packages/cli/
  src/
    index.ts              # Entry point, command router
    commands/
      init.ts             # rafters init
      studio.ts           # rafters studio
      generate.ts         # rafters generate
      mcp.ts              # rafters mcp
    server/
      index.ts            # Hono server for Studio
      routes/
        tokens.ts         # /api/tokens endpoints
        config.ts         # /api/config endpoints
        generate.ts       # /api/generate endpoint
        color.ts          # /api/color/intelligence proxy
        events.ts         # SSE endpoint
    utils/
      paths.ts            # .rafters/ path helpers
      logger.ts           # Minimal logging
  bin/
    rafters.js            # Executable entry point
  package.json
```

---

## Commands

### `rafters init`

Creates `.rafters/` folder with default configuration and tokens.

```typescript
// commands/init.ts

import { mkdir, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import { generateBaseSystem } from '@rafters/design-tokens';
import { NodePersistenceAdapter } from '@rafters/design-tokens/persistence';

interface InitOptions {
  force?: boolean;  // Overwrite existing .rafters/
}

export async function init(cwd: string, options: InitOptions = {}): Promise<void> {
  const raftersDir = join(cwd, '.rafters');
  const tokensDir = join(raftersDir, 'tokens');
  const outputDir = join(raftersDir, 'output');

  // Check if already initialized
  if (!options.force) {
    try {
      await access(raftersDir);
      console.error('.rafters/ already exists. Use --force to overwrite.');
      process.exit(1);
    } catch {
      // Directory doesn't exist, continue
    }
  }

  // Create directory structure
  await mkdir(tokensDir, { recursive: true });
  await mkdir(outputDir, { recursive: true });

  // Write default config
  const defaultConfig = {
    $schema: 'https://rafters.studio/schemas/config.json',
    version: '1.0.0',
    base: {
      spacingUnit: 4,
      progressionRatio: 'minor-third',
    },
    typography: {
      fontFamily: "'Noto Sans Variable', sans-serif",
      monoFontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
    },
    api: {
      colorApiBaseUrl: 'https://api.rafters.studio',
    },
    colors: [
      { name: 'neutral', oklch: { l: 0.5, c: 0, h: 0 } },
    ],
    semanticMappings: {
      primary: { color: 'neutral', position: '900' },
      secondary: { color: 'neutral', position: '100' },
      background: { color: 'neutral', position: '50' },
      foreground: { color: 'neutral', position: '950' },
    },
  };

  await writeFile(
    join(raftersDir, 'config.rafters.json'),
    JSON.stringify(defaultConfig, null, 2)
  );

  // Generate default tokens
  const adapter = new NodePersistenceAdapter(cwd);
  const result = await generateBaseSystem(defaultConfig);

  for (const [namespace, tokens] of Object.entries(result)) {
    await adapter.saveNamespace(namespace, tokens);
  }

  // Generate output files
  await generateOutputFiles(cwd);

  console.log('Initialized .rafters/ with defaults');
}
```

**Usage:**

```bash
rafters init          # Initialize in current directory
rafters init --force  # Overwrite existing .rafters/
```

**Output:**

```
.rafters/
  config.rafters.json
  tokens/
    color.rafters.json
    semantic.rafters.json
    spacing.rafters.json
    typography.rafters.json
    radius.rafters.json
    shadow.rafters.json
    depth.rafters.json
    elevation.rafters.json
    motion.rafters.json
    focus.rafters.json
    breakpoint.rafters.json
  output/
    theme.css
    tokens.json
    tokens.ts
```

---

### `rafters studio`

Launches local development server and opens Studio in browser.

```typescript
// commands/studio.ts

import { serve } from '@hono/node-server';
import { createStudioServer } from '../server';
import open from 'open';

interface StudioOptions {
  port?: number;
  noOpen?: boolean;
}

export async function studio(cwd: string, options: StudioOptions = {}): Promise<void> {
  const port = options.port ?? 3456;

  // Create Hono server
  const app = createStudioServer(cwd);

  // Start server
  const server = serve({
    fetch: app.fetch,
    port,
  });

  console.log(`Studio running at http://localhost:${port}`);

  // Open browser
  if (!options.noOpen) {
    await open(`http://localhost:${port}`);
  }

  // Keep process alive
  process.on('SIGINT', () => {
    server.close();
    process.exit(0);
  });
}
```

**Usage:**

```bash
rafters studio              # Start on port 3456, open browser
rafters studio --port 8080  # Custom port
rafters studio --no-open    # Don't open browser
```

---

### `rafters generate`

Regenerates output files from token source files.

```typescript
// commands/generate.ts

import { join } from 'node:path';
import { writeFile, mkdir } from 'node:fs/promises';
import { TokenRegistry } from '@rafters/design-tokens';
import { NodePersistenceAdapter } from '@rafters/design-tokens/persistence';
import {
  registryToTailwind,
  registryToDTCG,
  registryToTypeScript,
} from '@rafters/design-tokens/exporters';

export async function generate(cwd: string): Promise<void> {
  const adapter = new NodePersistenceAdapter(cwd);
  const outputDir = join(cwd, '.rafters', 'output');

  // Load all namespaces into registry
  const registry = new TokenRegistry();
  const namespaces = await adapter.listNamespaces();

  for (const namespace of namespaces) {
    const tokens = await adapter.loadNamespace(namespace);
    for (const token of tokens) {
      registry.add(token);
    }
  }

  // Generate output files
  await mkdir(outputDir, { recursive: true });

  // Tailwind CSS
  const css = registryToTailwind(registry);
  await writeFile(join(outputDir, 'theme.css'), css);

  // DTCG JSON
  const dtcg = registryToDTCG(registry);
  await writeFile(join(outputDir, 'tokens.json'), JSON.stringify(dtcg, null, 2));

  // TypeScript
  const ts = registryToTypeScript(registry);
  await writeFile(join(outputDir, 'tokens.ts'), ts);

  console.log(`Generated 3 files in .rafters/output/`);
}
```

**Usage:**

```bash
rafters generate  # Regenerate all output files
```

---

### `rafters mcp`

Starts local MCP server for AI agent access.

```typescript
// commands/mcp.ts

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { NodePersistenceAdapter } from '@rafters/design-tokens/persistence';
import { TokenRegistry } from '@rafters/design-tokens';

export async function mcp(cwd: string): Promise<void> {
  const adapter = new NodePersistenceAdapter(cwd);

  // Load registry
  const registry = new TokenRegistry();
  const namespaces = await adapter.listNamespaces();
  for (const namespace of namespaces) {
    const tokens = await adapter.loadNamespace(namespace);
    for (const token of tokens) {
      registry.add(token);
    }
  }

  // Create MCP server
  const server = new Server(
    { name: 'rafters-mcp', version: '0.1.0' },
    { capabilities: { tools: {} } }
  );

  // Register tools
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: 'rafters_list_namespaces',
        description: 'List all available token namespaces',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'rafters_get_tokens',
        description: 'Get tokens, optionally filtered by namespace',
        inputSchema: {
          type: 'object',
          properties: {
            namespace: { type: 'string', description: 'Filter by namespace' },
          },
        },
      },
      {
        name: 'rafters_get_token',
        description: 'Get a single token by name',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Token name' },
          },
          required: ['name'],
        },
      },
      {
        name: 'rafters_search_tokens',
        description: 'Search tokens by query',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query' },
          },
          required: ['query'],
        },
      },
      {
        name: 'rafters_get_config',
        description: 'Get the design system configuration',
        inputSchema: { type: 'object', properties: {} },
      },
    ],
  }));

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'rafters_list_namespaces':
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(await adapter.listNamespaces()),
          }],
        };

      case 'rafters_get_tokens':
        const filter = args?.namespace ? { namespace: args.namespace as string } : undefined;
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(registry.list(filter)),
          }],
        };

      case 'rafters_get_token':
        const token = registry.get(args?.name as string);
        return {
          content: [{
            type: 'text',
            text: token ? JSON.stringify(token) : 'Token not found',
          }],
        };

      case 'rafters_search_tokens':
        const query = (args?.query as string)?.toLowerCase() ?? '';
        const results = registry.list().filter(t =>
          t.name.toLowerCase().includes(query) ||
          t.semanticMeaning?.toLowerCase().includes(query)
        );
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(results),
          }],
        };

      case 'rafters_get_config':
        const configPath = join(cwd, '.rafters', 'config.rafters.json');
        const config = JSON.parse(await readFile(configPath, 'utf-8'));
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(config),
          }],
        };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  });

  // Start stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
```

**Usage:**

```bash
rafters mcp  # Start MCP server (stdio transport)
```

**Claude Desktop Configuration:**

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

---

## Server API

### Routes

```typescript
// server/index.ts

import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { cors } from 'hono/cors';
import { tokensRoutes } from './routes/tokens';
import { configRoutes } from './routes/config';
import { generateRoutes } from './routes/generate';
import { colorRoutes } from './routes/color';
import { eventsRoutes } from './routes/events';

export function createStudioServer(cwd: string) {
  const app = new Hono();

  // CORS for local development
  app.use('*', cors());

  // API routes
  app.route('/api/tokens', tokensRoutes(cwd));
  app.route('/api/config', configRoutes(cwd));
  app.route('/api/generate', generateRoutes(cwd));
  app.route('/api/color', colorRoutes(cwd));
  app.route('/api/events', eventsRoutes(cwd));

  // Serve Studio UI (pre-built React app)
  app.use('/*', serveStatic({ root: './dist/studio' }));

  return app;
}
```

### Token Routes

```typescript
// server/routes/tokens.ts

import { Hono } from 'hono';
import { NodePersistenceAdapter } from '@rafters/design-tokens/persistence';
import { TokenRegistry } from '@rafters/design-tokens';

export function tokensRoutes(cwd: string) {
  const app = new Hono();
  const adapter = new NodePersistenceAdapter(cwd);

  // GET /api/tokens - All tokens
  app.get('/', async (c) => {
    const namespaces = await adapter.listNamespaces();
    const allTokens = [];

    for (const namespace of namespaces) {
      const tokens = await adapter.loadNamespace(namespace);
      allTokens.push(...tokens);
    }

    return c.json({ tokens: allTokens, namespaces });
  });

  // GET /api/tokens/:namespace - Single namespace
  app.get('/:namespace', async (c) => {
    const namespace = c.req.param('namespace');

    if (!(await adapter.namespaceExists(namespace))) {
      return c.json({ error: 'Namespace not found' }, 404);
    }

    const tokens = await adapter.loadNamespace(namespace);
    return c.json({ namespace, tokens });
  });

  // PUT /api/tokens/:namespace - Replace namespace
  app.put('/:namespace', async (c) => {
    const namespace = c.req.param('namespace');
    const { tokens } = await c.req.json();

    // TODO: Validate against Zod schema

    await adapter.saveNamespace(namespace, tokens);

    // Emit SSE event
    emitTokensChanged(namespace);

    return c.json({ success: true, namespace });
  });

  // PATCH /api/tokens/:namespace/:name - Update single token
  app.patch('/:namespace/:name', async (c) => {
    const namespace = c.req.param('namespace');
    const tokenName = c.req.param('name');
    const updates = await c.req.json();

    const tokens = await adapter.loadNamespace(namespace);
    const index = tokens.findIndex(t => t.name === tokenName);

    if (index === -1) {
      return c.json({ error: 'Token not found' }, 404);
    }

    tokens[index] = { ...tokens[index], ...updates };
    await adapter.saveNamespace(namespace, tokens);

    // Emit SSE event
    emitTokensChanged(namespace, tokenName);

    return c.json({ success: true, token: tokens[index] });
  });

  return app;
}
```

### Color Intelligence Proxy

```typescript
// server/routes/color.ts

import { Hono } from 'hono';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export function colorRoutes(cwd: string) {
  const app = new Hono();

  // GET /api/color/intelligence?l=0.5&c=0.12&h=240
  app.get('/intelligence', async (c) => {
    const l = c.req.query('l');
    const chroma = c.req.query('c');
    const h = c.req.query('h');

    if (!l || !chroma || !h) {
      return c.json({ error: 'Missing l, c, or h parameter' }, 400);
    }

    // Read API base URL from config
    const configPath = join(cwd, '.rafters', 'config.rafters.json');
    const config = JSON.parse(await readFile(configPath, 'utf-8'));
    const baseUrl = config.api?.colorApiBaseUrl ?? 'https://api.rafters.studio';

    // Proxy to hosted API
    const response = await fetch(`${baseUrl}/color/${l}-${chroma}-${h}`);
    const data = await response.json();

    return c.json(data);
  });

  return app;
}
```

### SSE Events

```typescript
// server/routes/events.ts

import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';

// Simple event emitter for token changes
const listeners = new Set<(event: string, data: unknown) => void>();

export function emitTokensChanged(namespace: string, tokenName?: string) {
  const event = tokenName ? 'token-changed' : 'namespace-changed';
  const data = { namespace, tokenName };

  for (const listener of listeners) {
    listener(event, data);
  }
}

export function eventsRoutes(cwd: string) {
  const app = new Hono();

  // GET /api/events - SSE stream
  app.get('/', (c) => {
    return streamSSE(c, async (stream) => {
      const listener = (event: string, data: unknown) => {
        stream.writeSSE({ event, data: JSON.stringify(data) });
      };

      listeners.add(listener);

      // Keep connection alive
      const keepAlive = setInterval(() => {
        stream.writeSSE({ event: 'ping', data: '' });
      }, 30000);

      // Cleanup on disconnect
      stream.onAbort(() => {
        listeners.delete(listener);
        clearInterval(keepAlive);
      });

      // Wait forever (until client disconnects)
      await new Promise(() => {});
    });
  });

  return app;
}
```

---

## Entry Point

```typescript
// index.ts

import { Command } from 'commander';
import { init } from './commands/init';
import { studio } from './commands/studio';
import { generate } from './commands/generate';
import { mcp } from './commands/mcp';

const program = new Command();

program
  .name('rafters')
  .description('Design token system for Tailwind v4')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize .rafters/ in current directory')
  .option('-f, --force', 'Overwrite existing .rafters/')
  .action(async (options) => {
    await init(process.cwd(), options);
  });

program
  .command('studio')
  .description('Launch Studio editor')
  .option('-p, --port <port>', 'Server port', '3456')
  .option('--no-open', 'Do not open browser')
  .action(async (options) => {
    await studio(process.cwd(), {
      port: parseInt(options.port),
      noOpen: !options.open,
    });
  });

program
  .command('generate')
  .description('Regenerate output files from tokens')
  .action(async () => {
    await generate(process.cwd());
  });

program
  .command('mcp')
  .description('Start MCP server for AI agents')
  .action(async () => {
    await mcp(process.cwd());
  });

program.parse();
```

---

## Dependencies

```json
{
  "dependencies": {
    "@hono/node-server": "^1.8.0",
    "@modelcontextprotocol/sdk": "^0.5.0",
    "@rafters/design-tokens": "workspace:*",
    "@rafters/shared": "workspace:*",
    "commander": "^12.0.0",
    "hono": "^4.0.0",
    "open": "^10.0.0"
  }
}
```

---

## Output

The CLI produces a `.rafters/` folder that is:

1. **Source of truth** - `tokens/*.rafters.json` files
2. **Configured** - `config.rafters.json`
3. **Export-ready** - `output/` contains generated files

Users interact via Studio UI or AI agents via MCP. They never manually edit the JSON files.

Git tracks everything in `.rafters/` for version history. Rafters+ will add GitHub API integration for design history UI.
