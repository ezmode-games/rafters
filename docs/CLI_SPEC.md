# Rafters CLI Specification

**Replaces:** Closed issue #366, deleted CLI_ARCHITECTURE.md, deleted MCP_ARCHITECTURE.md

---

## Goal

Build `@rafters/cli` - a CLI that initializes projects, generates output files, and runs an MCP server for AI agent access to the design token system.

---

## Commands

### `rafters init`

Creates `.rafters/` folder with default configuration and tokens.

```bash
rafters init          # Initialize in current directory
rafters init --force  # Overwrite existing
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

### `rafters generate`

Regenerates output files from token sources.

```bash
rafters generate  # Regenerate all output files
```

Uses existing exporters from `@rafters/design-tokens`:
- `registryToTailwind()` -> theme.css
- `registryToDTCG()` -> tokens.json
- `registryToTypeScript()` -> tokens.ts

### `rafters mcp`

Starts MCP server for AI agent access (stdio transport, no network).

```bash
rafters mcp
```

---

## MCP Tools

All tools prefixed with `rafters_` for namespacing:

| Tool | Description | Input |
|------|-------------|-------|
| `rafters_list_namespaces` | List available token namespaces | none |
| `rafters_get_tokens` | Get tokens, filtered by namespace | `{ namespace?: string }` |
| `rafters_get_token` | Get single token with full metadata | `{ name: string }` |
| `rafters_search_tokens` | Search by name or semantic meaning | `{ query: string, limit?: number }` |
| `rafters_get_config` | Get design system configuration | none |

**Key principle:** Token metadata includes "why" (semanticMeaning, usagePatterns) so agents don't have to guess.

---

## Package Structure

```
packages/cli/
  src/
    index.ts              # Entry point, commander setup
    commands/
      init.ts             # rafters init
      generate.ts         # rafters generate
      mcp.ts              # rafters mcp
    mcp/
      server.ts           # MCP server implementation
      tools.ts            # Tool handlers
    utils/
      paths.ts            # .rafters/ path helpers
  bin/
    rafters.js            # Executable shebang
  package.json
  tsconfig.json
```

---

## Dependencies

Uses existing workspace packages:
- `@rafters/design-tokens` - TokenRegistry, NodePersistenceAdapter, generateBaseSystem, exporters
- `@rafters/shared` - Token types, Zod schemas

External:
- `@modelcontextprotocol/sdk` - MCP server SDK
- `commander` - CLI framework

---

## What Exists in design-tokens

Already implemented and ready to use:

```typescript
// Registry
import { TokenRegistry } from '@rafters/design-tokens';
const registry = new TokenRegistry(tokens);
registry.list(filter?)
registry.get(name)
registry.add(token)

// Persistence
import { NodePersistenceAdapter } from '@rafters/design-tokens';
const adapter = new NodePersistenceAdapter(projectRoot);
await adapter.listNamespaces()
await adapter.loadNamespace(namespace)
await adapter.saveNamespace(namespace, tokens)
await adapter.namespaceExists(namespace)

// Generation
import { generateBaseSystem } from '@rafters/design-tokens';
const result = generateBaseSystem(config);

// Export
import { registryToTailwind, registryToDTCG, registryToTypeScript } from '@rafters/design-tokens';
```

---

## What's NOT in Scope

- **Studio UI** - Separate project, many issues, not part of CLI
- **Web server / HTTP API** - CLI is local-only
- **Cloud sync** - Local filesystem only
- **Component scaffolding** - Just tokens, not components
- **Framework-specific init** - Creates vanilla .rafters/, no Next/Vite detection

---

## Acceptance Criteria

- [ ] `npx rafters init` creates valid .rafters/ structure
- [ ] `npx rafters generate` produces theme.css, tokens.json, tokens.ts
- [ ] `rafters mcp` starts stdio MCP server
- [ ] All 5 MCP tools respond correctly
- [ ] Works with Claude Desktop config:
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
- [ ] TypeScript strict mode, no `any` types
- [ ] Biome clean
- [ ] Unit tests for each command
- [ ] Integration test for MCP tools

---

## Implementation Order

1. **Scaffold package** - package.json, tsconfig, bin setup
2. **`init` command** - uses generateBaseSystem, NodePersistenceAdapter
3. **`generate` command** - uses registry, exporters
4. **`mcp` command** - MCP server with 5 tools
5. **Tests** - unit + integration
6. **Docs** - README, Claude Desktop config example

---

## Context

- Consolidates deleted CLI_ARCHITECTURE.md and MCP_ARCHITECTURE.md
- Replaces closed issue #366 which had inconsistent specs
- Studio is intentionally excluded (separate epic)
