# Rafters CLI Specification

**Replaces:** Closed issue #366, deleted CLI_ARCHITECTURE.md, deleted MCP_ARCHITECTURE.md

---

## Goal

Build `@rafters/cli` - a CLI that initializes projects, adds components, runs an MCP server for AI agent access, and launches Studio for visual token editing.

**Usage:** `pnpx rafters <command>` - ephemeral, not installed as a dependency.

---

## Commands

### `rafters init`

Detects framework and shadcn, creates `.rafters/` folder with configuration and default tokens, generates output files.

```bash
rafters init            # Initialize in current directory
rafters init --rebuild  # Regenerate output files from existing tokens
rafters init --reset    # Re-run generators fresh, replacing persisted tokens
```

**Detection:**
- Framework: Next.js, Vite, Remix, Astro, etc.
- shadcn: Checks for shadcn installation and existing color variables

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

**Behavior:**
- First run: Generates default tokens, writes config and output
- With `--rebuild`: Reads existing tokens, regenerates all output files
- With `--reset`: Re-runs generators fresh, replaces persisted tokens, backs up userOverride tokens
- On existing project without flags: Warns and exits

Uses existing exporters from `@rafters/design-tokens`:
- `registryToTailwind()` -> theme.css
- `registryToDTCG()` -> tokens.json
- `registryToTypeScript()` -> tokens.ts

### `rafters add <component>`

Adds a rafters component to the project (drop-in shadcn replacement).

```bash
rafters add button
rafters add card dialog
```

### `rafters mcp`

Starts MCP server for AI agent access (stdio transport, no network).

```bash
rafters mcp
```

### `rafters studio`

Opens Studio UI for visual token editing.

```bash
rafters studio
```

Studio is a static React app using the File System Access API to read/write `.rafters/` directly from the browser. No server needed - CLI just opens the bundled HTML file.

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

**Key principle:** Token metadata includes "why" (semanticMeaning, usagePatterns) so AI agents have the intelligence layer, not just values.

---

## Package Structure

```
packages/cli/
  src/
    index.ts              # Entry point, commander setup
    commands/
      init.ts             # rafters init
      add.ts              # rafters add
      mcp.ts              # rafters mcp
      studio.ts           # rafters studio (opens bundled app)
    mcp/
      server.ts           # MCP server implementation
      tools.ts            # Tool handlers
    utils/
      paths.ts            # .rafters/ path helpers
      detect.ts           # Framework + shadcn detection (reusable for --upgrade)
  bin/
    rafters.js            # Executable shebang
  package.json
  tsconfig.json

packages/studio/
  src/
    App.tsx               # React app root
    components/           # UI components
    hooks/
      useFileSystem.ts    # File System Access API wrapper
    utils/
      tokens.ts           # Token read/write via FS API
  index.html              # Static entry point
  vite.config.ts          # Build config (build only, no dev server for production)
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

- **Web server / HTTP API** - CLI is local-only
- **Cloud sync** - Local filesystem only
- **Token migration from shadcn** - Basic init uses defaults; migration is future work

---

## Acceptance Criteria

- [ ] `pnpx rafters init` detects framework and shadcn
- [ ] `pnpx rafters init` creates valid .rafters/ structure with default tokens
- [ ] `pnpx rafters init --rebuild` regenerates output from existing tokens
- [ ] `pnpx rafters init --reset` re-runs generators fresh, replacing persisted tokens
- [ ] `pnpx rafters add <component>` adds component files
- [ ] `pnpx rafters mcp` starts stdio MCP server
- [ ] `pnpx rafters studio` launches Studio UI
- [ ] All 5 MCP tools respond correctly
- [ ] Works with Claude Desktop config:
  ```json
  {
    "mcpServers": {
      "rafters": {
        "command": "pnpx",
        "args": ["rafters", "mcp"],
        "cwd": "/path/to/project"
      }
    }
  }
  ```
- [ ] TypeScript strict mode, no `any` types
- [ ] Biome clean
- [ ] BDD tests with playwright-bdd
- [ ] Zod mock data with zocker
- [ ] Filesystem fixtures for detection scenarios

---

## Implementation Order

1. **Scaffold package** - package.json, tsconfig, bin setup
2. **`init` command** - framework detection, shadcn detection, generateBaseSystem, NodePersistenceAdapter
3. **`add` command** - component scaffolding
4. **`mcp` command** - MCP server with 5 tools
5. **`studio` command** - Studio launcher
6. **Tests** - unit + integration
7. **Docs** - README, Claude Desktop config example

---

## Context

- Consolidates deleted CLI_ARCHITECTURE.md and MCP_ARCHITECTURE.md
- Replaces closed issue #366 which had inconsistent specs
- Components are drop-in replacements for shadcn
- Tailwind v4 only (OKLCH native, no v3 support)
